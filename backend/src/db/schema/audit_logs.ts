import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const audit_logs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actor_id: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  entity_type: varchar('entity_type', { length: 50 }).notNull(),
  entity_id: uuid('entity_id'),
  old_value: jsonb('old_value'),
  new_value: jsonb('new_value'),
  ip_address: varchar('ip_address', { length: 45 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type AuditLog = typeof audit_logs.$inferSelect;
export type NewAuditLog = typeof audit_logs.$inferInsert;
