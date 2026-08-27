import { z } from 'zod';

export const processPaymentSchema = z.object({
  order_id: z.string().uuid('Invalid order_id format'),
  payment_method: z.enum(['CASH', 'CBE', 'TELEBIRR', 'MOCK_PAYMENT'], {
    errorMap: () => ({
      message: 'payment_method must be one of: CASH, CBE, TELEBIRR, MOCK_PAYMENT',
    }),
  }),
});

export type ProcessPaymentDTO = z.infer<typeof processPaymentSchema>;
