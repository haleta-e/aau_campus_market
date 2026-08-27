import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerBuyerSchema, loginSchema, refreshTokenSchema } from './auth.schema';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = registerBuyerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          code: 'VALIDATION_ERROR',
          errors: parsed.error.format(),
        });
      }

      const user = await this.service.registerBuyer(parsed.data, req.ip);
      return res.status(201).json({
        status: 'success',
        data: { user },
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          code: 'VALIDATION_ERROR',
          errors: parsed.error.format(),
        });
      }

      const result = await this.service.login(parsed.data, req.ip);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = refreshTokenSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          code: 'VALIDATION_ERROR',
          errors: parsed.error.format(),
        });
      }

      const tokens = await this.service.refreshToken(parsed.data);
      return res.status(200).json({
        status: 'success',
        data: tokens,
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({
          status: 'error',
          code: error.code,
          message: error.message,
        });
      }
      next(error);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const refreshTokenStr = req.body?.refreshToken;
      await this.service.logout(refreshTokenStr, req.user?.userId);
      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' });
      }
      const user = await this.service.getCurrentUser(req.user.userId);
      return res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ status: 'error', code: error.code, message: error.message });
      }
      next(error);
    }
  };
}
