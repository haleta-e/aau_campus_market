import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sellers = pgTable('sellers', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  seller_name: varchar('seller_name', { length: 100 }).notNull(),
  store_name: varchar('store_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  campus_location: varchar('campus_location', { length: 100 }).notNull(),
  status: text('status', { enum: ['ACTIVE', 'SUSPENDED'] }).default('ACTIVE').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Seller = typeof sellers.$inferSelect;
export type NewSeller = typeof sellers.$inferInsert;
