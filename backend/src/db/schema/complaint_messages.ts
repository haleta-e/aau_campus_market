import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { complaints } from './complaints';
import { users } from './users';

export const complaint_messages = pgTable('complaint_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  complaint_id: uuid('complaint_id').references(() => complaints.id, { onDelete: 'cascade' }).notNull(),
  sender_id: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type ComplaintMessage = typeof complaint_messages.$inferSelect;
export type NewComplaintMessage = typeof complaint_messages.$inferInsert;
