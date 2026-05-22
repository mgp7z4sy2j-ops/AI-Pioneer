import { desc, eq } from 'drizzle-orm'
import { db } from '@/db/client'
import { applications } from '@/db/schema'
import type { ApplicationRecord } from '@/lib/application-types'
import type { ApplicationData } from '@/lib/schema'

function toRecord(row: typeof applications.$inferSelect): ApplicationRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    company_email: row.company_email,
    answers: row.answers as Record<string, string>,
    manual_scores: (row.manual_scores as ApplicationRecord['manual_scores']) ?? undefined,
    created_at: row.created_at.toISOString(),
  }
}

export async function addApplication(data: ApplicationData): Promise<ApplicationRecord> {
  const [row] = await db
    .insert(applications)
    .values({
      name: data.name,
      phone: data.phone,
      company_email: data.company_email,
      answers: data.answers,
    })
    .returning()
  return toRecord(row)
}

export async function listApplications(): Promise<ApplicationRecord[]> {
  const rows = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.created_at))
  return rows.map(toRecord)
}

export async function updateApplicationManualScores(
  id: string,
  manual_scores: ApplicationRecord['manual_scores'],
): Promise<ApplicationRecord | null> {
  const existing = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1)

  if (existing.length === 0) return null

  const [row] = await db
    .update(applications)
    .set({
      manual_scores: {
        ...(existing[0].manual_scores as ApplicationRecord['manual_scores']),
        ...manual_scores,
      },
    })
    .where(eq(applications.id, id))
    .returning()

  return toRecord(row)
}
