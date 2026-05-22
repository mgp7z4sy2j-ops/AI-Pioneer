import { eq } from 'drizzle-orm'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../src/db/client'
import { applications } from '../src/db/schema'
import {
  addApplication,
  listApplications,
  updateApplicationManualScores,
} from '../src/server/application-store'

const validAnswers = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => [
    String(i + 1),
    [22, 25, 27, 30].includes(i + 1) ? 'Open answer text.' : 'A',
  ]),
)

const validData = {
  name: 'Jane Smith',
  phone: '+852 9000 0000',
  company_email: 'jane@startrader.com',
  answers: validAnswers,
}

let insertedIds: string[] = []

beforeEach(() => {
  insertedIds = []
})

afterEach(async () => {
  if (insertedIds.length > 0) {
    for (const id of insertedIds) {
      await db.delete(applications).where(eq(applications.id, id))
    }
  }
})

describe('application-store (DB integration)', () => {
  it('inserts and lists applications', async () => {
    const record = await addApplication(validData)
    insertedIds.push(record.id)

    expect(record.id).toBeTypeOf('string')
    expect(record.name).toBe('Jane Smith')
    expect(record.company_email).toBe('jane@startrader.com')
    expect(record.created_at).toBeTypeOf('string')

    const list = await listApplications()
    const found = list.find(a => a.id === record.id)
    expect(found).toBeDefined()
    expect(found?.name).toBe('Jane Smith')
  })

  it('returns applications ordered by created_at descending', async () => {
    const first = await addApplication({ ...validData, name: 'First' })
    const second = await addApplication({ ...validData, name: 'Second' })
    insertedIds.push(first.id, second.id)

    const list = await listApplications()
    const idx1 = list.findIndex(a => a.id === first.id)
    const idx2 = list.findIndex(a => a.id === second.id)
    expect(idx2).toBeLessThan(idx1)
  })

  it('updates manual scores partially', async () => {
    const record = await addApplication(validData)
    insertedIds.push(record.id)

    const updated = await updateApplicationManualScores(record.id, { q22: 4 })
    expect(updated).not.toBeNull()
    expect(updated?.manual_scores?.q22).toBe(4)
    expect(updated?.manual_scores?.q25).toBeUndefined()

    const updated2 = await updateApplicationManualScores(record.id, { q25: 3 })
    expect(updated2?.manual_scores?.q22).toBe(4)
    expect(updated2?.manual_scores?.q25).toBe(3)
  })

  it('returns null for unknown id', async () => {
    const result = await updateApplicationManualScores('00000000-0000-0000-0000-000000000000', { q22: 5 })
    expect(result).toBeNull()
  })
})
