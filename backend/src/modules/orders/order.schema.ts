import { z } from 'zod';

export const createOrderSchema = z.object({
  seller_id: z.string().uuid('Invalid seller_id format'),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid('Invalid product_id format'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'PREPARING', 'READY', 'CANCELLED'], {
    errorMap: () => ({
      message: "Status must be one of: CONFIRMED, PREPARING, READY, CANCELLED",
    }),
  }),
});

export const acceptOrderSchema = z.object({
  confirm: z.literal(true, { errorMap: () => ({ message: 'confirm must be true' }) }),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;
export type AcceptOrderDTO = z.infer<typeof acceptOrderSchema>;
