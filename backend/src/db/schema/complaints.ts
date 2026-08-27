import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { users } from './users';
import { sellers } from './sellers';

export const complaints = pgTable('complaints', {
  id: uuid('id').defaultRandom().primaryKey(),
  complaint_number: varchar('complaint_number', { length: 30 }).notNull().unique(),
  order_id: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  buyer_id: uuid('buyer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  seller_id: uuid('seller_id').references(() => sellers.id, { onDelete: 'cascade' }).notNull(),
  admin_id: uuid('admin_id').references(() => users.id, { onDelete: 'set null' }),
  subject: varchar('subject', { length: 200 }).notNull(),
  description: text('description').notNull(),
  status: text('status', {
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED'],
  }).default('OPEN').notNull(),
  priority: text('priority', {
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  }).default('MEDIUM').notNull(),
  resolution: text('resolution'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at'),
});

export type Complaint = typeof complaints.$inferSelect;
export type NewComplaint = typeof complaints.$inferInsert;
