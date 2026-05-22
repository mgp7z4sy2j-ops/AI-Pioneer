import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { ManualScores } from '@/lib/application-types'

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  company_email: text('company_email').notNull(),
  answers: jsonb('answers').notNull().$type<Record<string, string>>(),
  manual_scores: jsonb('manual_scores').$type<ManualScores>(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ApplicationRow = typeof applications.$inferSelect
