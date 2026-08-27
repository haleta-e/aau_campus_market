import { pgTable, uuid, varchar, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';
import { sellers } from './sellers';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  seller_id: uuid('seller_id').references(() => sellers.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock_quantity: integer('stock_quantity').default(0).notNull(),
  status: text('status', { enum: ['ACTIVE', 'INACTIVE'] }).default('ACTIVE').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
