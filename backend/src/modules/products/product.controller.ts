import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import {
  createProductSchema,
  updateProductSchema,
  productListQuerySchema,
} from './product.schema';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ProductController {
  private service = new ProductService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = productListQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const result = await this.service.listProducts(parsed.data);
      return res.status(200).json({
        status: 'success',
        data: result.rows,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.getProduct(req.params.id);
      return res.status(200).json({ status: 'success', data: product });
    } catch (err: any) {
      if (err.status) return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
      next(err);
    }
  };

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = createProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const product = await this.service.createProduct(parsed.data, req.user!, req.ip);
      return res.status(201).json({ status: 'success', data: product });
    } catch (err: any) {
      if (err.status) return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
      next(err);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = updateProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: parsed.error.format() });
      }
      const product = await this.service.updateProduct(req.params.id, parsed.data, req.user!, req.ip);
      return res.status(200).json({ status: 'success', data: product });
    } catch (err: any) {
      if (err.status) return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
      next(err);
    }
  };

  remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteProduct(req.params.id, req.user!, req.ip);
      return res.status(200).json({ status: 'success', message: 'Product deactivated successfully' });
    } catch (err: any) {
      if (err.status) return res.status(err.status).json({ status: 'error', code: err.code, message: err.message });
      next(err);
    }
  };
}
