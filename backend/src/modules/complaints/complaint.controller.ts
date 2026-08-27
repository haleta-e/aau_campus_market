import { Response, NextFunction } from 'express';
import { ComplaintService } from './complaint.service';
import {
  createComplaintSchema,
  addComplaintMessageSchema,
  resolveComplaintSchema,
} from './complaint.schema';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ComplaintController {
  private service = new ComplaintService();

  private handleError(err: any, res: Response, next: NextFunction) {
    if (err.status) {
      return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
    }
    next(err);
  }

  fileComplaint = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = createComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const complaint = await this.service.fileComplaint(parsed.data, req.user!, req.ip);
      return res.status(201).json({ status: 'success', data: complaint });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getMyComplaints = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const complaints = await this.service.getMyComplaints(req.user!);
      return res.status(200).json({ status: 'success', data: complaints });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getSellerComplaints = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const complaints = await this.service.getSellerComplaints(req.user!);
      return res.status(200).json({ status: 'success', data: complaints });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getAllComplaints = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const complaints = await this.service.getAllComplaints();
      return res.status(200).json({ status: 'success', data: complaints });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  getComplaintDetail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const complaint = await this.service.getComplaintDetail(req.params.id, req.user!);
      return res.status(200).json({ status: 'success', data: complaint });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  addMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = addComplaintMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const msg = await this.service.addMessage(req.params.id, parsed.data, req.user!, req.ip);
      return res.status(201).json({ status: 'success', data: msg });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };

  resolveComplaint = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = resolveComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const resolved = await this.service.resolveComplaint(req.params.id, parsed.data, req.user!, req.ip);
      return res.status(200).json({ status: 'success', data: resolved });
    } catch (err: any) {
      return this.handleError(err, res, next);
    }
  };
}
