import { pgTable, uuid, varchar, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { users } from './users';
import { sellers } from './sellers';

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  order_id: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  buyer_id: uuid('buyer_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  seller_id: uuid('seller_id').references(() => sellers.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  payment_method: text('payment_method', {
    enum: ['CASH', 'CBE', 'TELEBIRR', 'MOCK_PAYMENT'],
  }).default('MOCK_PAYMENT').notNull(),
  status: text('status', {
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
  }).default('PENDING').notNull(),
  reference: varchar('reference', { length: 100 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
