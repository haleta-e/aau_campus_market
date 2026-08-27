import { z } from 'zod';

export const createComplaintSchema = z.object({
  order_id: z.string().uuid('Invalid order_id format'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM').optional(),
});

export const addComplaintMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000),
});

export const resolveComplaintSchema = z.object({
  status: z.enum(['UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED']),
  resolution: z.string().min(5, 'Resolution notes must be at least 5 characters'),
});

export type CreateComplaintDTO = z.infer<typeof createComplaintSchema>;
export type AddComplaintMessageDTO = z.infer<typeof addComplaintMessageSchema>;
export type ResolveComplaintDTO = z.infer<typeof resolveComplaintSchema>;
