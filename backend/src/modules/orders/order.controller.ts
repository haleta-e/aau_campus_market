import { Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { createOrderSchema, updateOrderStatusSchema, acceptOrderSchema } from './order.schema';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class OrderController {
  private service = new OrderService();

  private handleError(err: any, res: Response, next: NextFunction) {
    if (err.status) {
      return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
    }
    next(err);
  }

  placeOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = createOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const order = await this.service.placeOrder(parsed.data, req.user!, req.ip);
      return res.status(201).json({ status: 'success', data: order });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getMyOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await this.service.getMyOrders(req.user!);
      return res.status(200).json({ status: 'success', data: orders });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getSellerOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await this.service.getSellerOrders(req.user!);
      return res.status(200).json({ status: 'success', data: orders });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getOrderDetail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.getOrderDetail(req.params.id, req.user!);
      return res.status(200).json({ status: 'success', data: order });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = updateOrderStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const order = await this.service.updateStatus(req.params.id, parsed.data, req.user!, req.ip);
      return res.status(200).json({ status: 'success', data: order });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  acceptOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = acceptOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const order = await this.service.acceptOrder(req.params.id, req.user!, req.ip);
      return res.status(200).json({ status: 'success', data: order });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };
}
