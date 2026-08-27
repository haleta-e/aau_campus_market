import { AuthRepository } from './auth.repository';
import { RegisterBuyerDTO, LoginDTO, RefreshTokenDTO } from './auth.schema';
import { hashPassword, verifyPassword } from '../../utils/password.util';
import { generateAccessToken, generateRefreshToken, hashToken, JwtPayload } from '../../utils/jwt.util';

export class AuthService {
  private repo = new AuthRepository();

  async registerBuyer(dto: RegisterBuyerDTO, ipAddress?: string) {
    const existingUser = await this.repo.findUserByUsernameOrEmail(dto.email);
    if (existingUser) {
      throw { status: 409, code: 'EMAIL_EXISTS', message: 'User with this email already exists' };
    }

    const existingUsername = await this.repo.findUserByUsernameOrEmail(dto.username);
    if (existingUsername) {
      throw { status: 409, code: 'USERNAME_EXISTS', message: 'Username is already taken' };
    }

    const password_hash = await hashPassword(dto.password);

    const user = await this.repo.createUser({
      username: dto.username,
      email: dto.email,
      password_hash,
      role: 'BUYER',
      status: 'ACTIVE',
    });

    await this.repo.createAuditLog({
      actor_id: user.id,
      action: 'BUYER_REGISTERED',
      entity_type: 'USER',
      entity_id: user.id,
      new_value: { username: user.username, email: user.email, role: user.role },
      ip_address: ipAddress,
    });

    const { password_hash: _, ...safeUser } = user;
    return safeUser;
  }

  async login(dto: LoginDTO, ipAddress?: string) {
    const user = await this.repo.findUserByUsernameOrEmail(dto.usernameOrEmail);
    if (!user) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' };
    }

    if (user.status !== 'ACTIVE') {
      throw { status: 403, code: 'ACCOUNT_INACTIVE', message: `Account is ${user.status.toLowerCase()}` };
    }

    const isPasswordValid = await verifyPassword(user.password_hash, dto.password);
    if (!isPasswordValid) {
      throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' };
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      role: user.role,
      username: user.username,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshTokenStr = generateRefreshToken();
    const tokenHash = hashToken(refreshTokenStr);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    await this.repo.saveRefreshToken({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      revoked: false,
    });

    await this.repo.createAuditLog({
      actor_id: user.id,
      action: 'USER_LOGIN',
      entity_type: 'USER',
      entity_id: user.id,
      ip_address: ipAddress,
    });

    const { password_hash: _, ...safeUser } = user;

    return {
      accessToken,
      refreshToken: refreshTokenStr,
      user: safeUser,
    };
  }

  async refreshToken(dto: RefreshTokenDTO) {
    const tokenHash = hashToken(dto.refreshToken);
    const tokenRecord = await this.repo.findRefreshToken(tokenHash);

    if (!tokenRecord) {
      throw { status: 401, code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token' };
    }

    const user = await this.repo.findUserById(tokenRecord.user_id);
    if (!user || user.status !== 'ACTIVE') {
      throw { status: 403, code: 'ACCOUNT_DISABLED', message: 'User account is no longer active' };
    }

    // Revoke used refresh token (Token Rotation)
    await this.repo.revokeRefreshToken(tokenHash);

    const newJwtPayload: JwtPayload = {
      userId: user.id,
      role: user.role,
      username: user.username,
    };

    const newAccessToken = generateAccessToken(newJwtPayload);
    const newRefreshTokenStr = generateRefreshToken();
    const newTokenHash = hashToken(newRefreshTokenStr);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repo.saveRefreshToken({
      user_id: user.id,
      token_hash: newTokenHash,
      expires_at: expiresAt,
      revoked: false,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenStr,
    };
  }

  async logout(refreshTokenStr: string, userId?: string) {
    if (refreshTokenStr) {
      const tokenHash = hashToken(refreshTokenStr);
      await this.repo.revokeRefreshToken(tokenHash);
    }
    if (userId) {
      await this.repo.createAuditLog({
        actor_id: userId,
        action: 'USER_LOGOUT',
        entity_type: 'USER',
        entity_id: userId,
      });
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }
    const { password_hash: _, ...safeUser } = user;
    return safeUser;
  }
}
