import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const validAnswers = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => [i + 1, i + 1 >= 22 && [22, 25, 27, 30].includes(i + 1) ? 'Open answer text.' : 'A']),
)

const validData = {
  name: 'Jane Smith',
  phone: '+852 9000 0000',
  company_email: 'jane@startrader.com',
  answers: validAnswers,
}

describe('application-store', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-pioneer-store-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
    vi.resetModules()
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it('persists submissions to disk and lists them', async () => {
    const { addApplication, listApplications } = await import('../src/server/application-store')

    await addApplication(validData)
    const list = await listApplications()

    expect(list).toHaveLength(1)
    expect(list[0]?.name).toBe('Jane Smith')
    expect(list[0]?.company_email).toBe('jane@startrader.com')

    const raw = await fs.readFile(path.join(tmpDir, '.data', 'applications.json'), 'utf-8')
    expect(JSON.parse(raw)).toHaveLength(1)
  })
})
