import { Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { auditLogsQuerySchema, updateUserStatusSchema } from './admin.schema';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class AdminController {
  private service = new AdminService();

  private handleError(err: any, res: Response, next: NextFunction) {
    if (err.status) {
      return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
    }
    next(err);
  }

  getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.service.getDashboardStats();
      return res.status(200).json({ status: 'success', data: stats });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = auditLogsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const logs = await this.service.getAuditLogs(parsed.data);
      return res.status(200).json({ status: 'success', ...logs });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.getAllUsers();
      return res.status(200).json({ status: 'success', data: users });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = updateUserStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const user = await this.service.updateUserStatus(req.params.id, parsed.data, req.user!, req.ip);
      return res.status(200).json({ status: 'success', data: user });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await this.service.getAllOrders();
      return res.status(200).json({ status: 'success', data: orders });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };
}
