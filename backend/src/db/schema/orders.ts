import { pgTable, uuid, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { sellers } from './sellers';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  order_number: varchar('order_number', { length: 30 }).notNull().unique(),
  buyer_id: uuid('buyer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  seller_id: uuid('seller_id').references(() => sellers.id, { onDelete: 'cascade' }).notNull(),
  status: text('status', {
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
  }).default('PENDING').notNull(),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  payment_status: text('payment_status', {
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
  }).default('PENDING').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  accepted_at: timestamp('accepted_at'),
  completed_at: timestamp('completed_at'),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
