import { Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { processPaymentSchema } from './payment.schema';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class PaymentController {
  private service = new PaymentService();

  private handleError(err: any, res: Response, next: NextFunction) {
    if (err.status) {
      return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
    }
    next(err);
  }

  processPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = processPaymentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const tx = await this.service.processPayment(parsed.data, req.user!, req.ip);
      return res.status(201).json({ status: 'success', data: tx });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getMyPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const txs = await this.service.getMyTransactions(req.user!);
      return res.status(200).json({ status: 'success', data: txs });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tx = await this.service.getTransaction(req.params.id, req.user!);
      return res.status(200).json({ status: 'success', data: tx });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };
}
