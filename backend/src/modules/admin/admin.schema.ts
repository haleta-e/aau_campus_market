import { z } from 'zod';

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']),
});

export const auditLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  action: z.string().optional(),
  entity_type: z.string().optional(),
});

export type UpdateUserStatusDTO = z.infer<typeof updateUserStatusSchema>;
export type AuditLogsQueryDTO = z.infer<typeof auditLogsQuerySchema>;
