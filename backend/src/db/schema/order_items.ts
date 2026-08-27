import { pgTable, uuid, numeric, integer } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { products } from './products';

export const order_items = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  order_id: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  product_id: uuid('product_id').references(() => products.id, { onDelete: 'set null' }).notNull(),
  quantity: integer('quantity').notNull(),
  unit_price: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof order_items.$inferSelect;
export type NewOrderItem = typeof order_items.$inferInsert;
