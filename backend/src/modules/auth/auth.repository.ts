import { db } from '../../db';
import { users, refresh_tokens, audit_logs, User, NewUser, NewRefreshToken } from '../../db/schema';
import { eq, or, and, gte } from 'drizzle-orm';

export class AuthRepository {
  async findUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async findUserByUsernameOrEmail(identifier: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(or(eq(users.username, identifier), eq(users.email, identifier)))
      .limit(1);
    return result[0];
  }

  async createUser(data: NewUser): Promise<User> {
    const [newUser] = await db.insert(users).values(data).returning();
    return newUser;
  }

  async saveRefreshToken(data: NewRefreshToken) {
    return db.insert(refresh_tokens).values(data).returning();
  }

  async findRefreshToken(tokenHash: string) {
    const result = await db
      .select()
      .from(refresh_tokens)
      .where(
        and(
          eq(refresh_tokens.token_hash, tokenHash),
          eq(refresh_tokens.revoked, false),
          gte(refresh_tokens.expires_at, new Date())
        )
      )
      .limit(1);
    return result[0];
  }

  async revokeRefreshToken(tokenHash: string) {
    await db
      .update(refresh_tokens)
      .set({ revoked: true })
      .where(eq(refresh_tokens.token_hash, tokenHash));
  }

  async revokeAllUserRefreshTokens(userId: string) {
    await db
      .update(refresh_tokens)
      .set({ revoked: true })
      .where(eq(refresh_tokens.user_id, userId));
  }

  async createAuditLog(log: {
    actor_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
  }) {
    await db.insert(audit_logs).values(log);
  }
}
