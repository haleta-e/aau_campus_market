import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(150),
  description: z.string().max(1000).optional(),
  category: z.string().min(2).max(50),
  price: z.number().positive('Price must be a positive number'),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(150).optional(),
  description: z.string().max(1000).optional(),
  category: z.string().min(2).max(50).optional(),
  price: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const productListQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  category: z.string().optional(),
  search: z.string().optional(),
  seller_id: z.string().uuid().optional(),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
