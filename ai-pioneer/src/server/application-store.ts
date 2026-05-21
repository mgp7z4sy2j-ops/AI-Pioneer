import fs from 'node:fs/promises'
import path from 'node:path'
import type { ApplicationRecord } from '@/lib/application-types'
import type { ApplicationData } from '@/lib/schema'

const dataFile = path.join(process.cwd(), '.data', 'applications.json')

let cache: ApplicationRecord[] | null = null

async function ensureLoaded(): Promise<ApplicationRecord[]> {
  if (cache) return cache
  try {
    const raw = await fs.readFile(dataFile, 'utf-8')
    cache = JSON.parse(raw) as ApplicationRecord[]
  } catch {
    cache = []
  }
  return cache
}

async function persist(apps: ApplicationRecord[]): Promise<void> {
  cache = apps
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(apps, null, 2), 'utf-8')
}

export async function addApplication(data: ApplicationData): Promise<ApplicationRecord> {
  const apps = await ensureLoaded()
  const record: ApplicationRecord = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  apps.unshift(record)
  await persist(apps)
  return record
}

export async function listApplications(): Promise<ApplicationRecord[]> {
  return [...(await ensureLoaded())]
}

export async function updateApplicationManualScores(
  id: string,
  manual_scores: ApplicationRecord['manual_scores'],
): Promise<ApplicationRecord | null> {
  const apps = await ensureLoaded()
  const index = apps.findIndex(app => app.id === id)
  if (index === -1) return null

  apps[index] = {
    ...apps[index],
    manual_scores: {
      ...apps[index].manual_scores,
      ...manual_scores,
    },
  }
  await persist(apps)
  return apps[index]
}
