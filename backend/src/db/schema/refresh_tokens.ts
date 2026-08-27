import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const refresh_tokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token_hash: text('token_hash').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  revoked: boolean('revoked').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type RefreshToken = typeof refresh_tokens.$inferSelect;
export type NewRefreshToken = typeof refresh_tokens.$inferInsert;
