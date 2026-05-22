# DB Migration: File Store → Neon PostgreSQL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the local JSON file storage in `application-store.ts` with Neon PostgreSQL using Drizzle ORM, keeping the public API identical.

**Architecture:** Add `src/db/schema.ts` (Drizzle table definition) and `src/db/client.ts` (singleton DB connection via `@neondatabase/serverless` HTTP driver), then rewrite `application-store.ts` internals to use Drizzle queries. All callers (`applications.ts`, `admin.ts`) are untouched.

**Tech Stack:** `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit` (dev), Neon PostgreSQL

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `src/db/schema.ts` | Drizzle `applications` table definition + inferred types |
| Create | `src/db/client.ts` | Singleton Drizzle client over Neon HTTP |
| Create | `drizzle.config.ts` | drizzle-kit config for `db:push` |
| Modify | `package.json` | Add deps + `db:push` script |
| Modify | `src/server/application-store.ts` | Replace fs implementation with Drizzle queries |
| Modify | `tests/application-store.test.ts` | Replace fs-based test with DB integration test |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime and dev dependencies**

```bash
cd ai-pioneer
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

Expected output: packages added, no errors.

- [ ] **Step 2: Verify installation**

```bash
npm ls drizzle-orm @neondatabase/serverless drizzle-kit
```

Expected: all three listed without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Install drizzle-orm, @neondatabase/serverless, drizzle-kit"
```

---

## Task 2: Create Drizzle schema

**Files:**
- Create: `src/db/schema.ts`

- [ ] **Step 1: Write the failing type-check test**

Create `tests/db-schema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { applications } from '../src/db/schema'

describe('db schema', () => {
  it('applications table has required columns', () => {
    const cols = Object.keys(applications)
    expect(cols).toContain('id')
    expect(cols).toContain('name')
    expect(cols).toContain('phone')
    expect(cols).toContain('company_email')
    expect(cols).toContain('answers')
    expect(cols).toContain('manual_scores')
    expect(cols).toContain('created_at')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/db-schema.test.ts
```

Expected: FAIL — `Cannot find module '../src/db/schema'`

- [ ] **Step 3: Create `src/db/schema.ts`**

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/db-schema.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/db/schema.ts tests/db-schema.test.ts
git commit -m "Add Drizzle schema for applications table"
```

---

## Task 3: Create DB client

**Files:**
- Create: `src/db/client.ts`

- [ ] **Step 1: Create `src/db/client.ts`**

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors (or only pre-existing errors unrelated to `src/db/`).

- [ ] **Step 3: Commit**

```bash
git add src/db/client.ts
git commit -m "Add Neon/Drizzle client singleton"
```

---

## Task 4: Add drizzle-kit config and db:push script

**Files:**
- Create: `drizzle.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Create `drizzle.config.ts`** at the project root (same level as `package.json`):

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 2: Add `db:push` script to `package.json`**

Find the `"scripts"` section in `package.json` and add:

```json
"db:push": "drizzle-kit push"
```

Result:
```json
"scripts": {
  "dev": "vite dev --port 3050 --strictPort",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "db:push": "drizzle-kit push"
},
```

- [ ] **Step 3: Push schema to Neon**

Make sure `DATABASE_URL` is in `.env`, then run:

```bash
npm run db:push
```

Expected output:
```
[✓] Changes applied
```

If prompted to confirm table creation, type `yes`.

- [ ] **Step 4: Commit**

```bash
git add drizzle.config.ts package.json package-lock.json
git commit -m "Add drizzle-kit config and db:push script, push schema to Neon"
```

---

## Task 5: Rewrite application-store.ts

**Files:**
- Modify: `src/server/application-store.ts`

- [ ] **Step 1: Update the existing integration test first**

Replace the entire contents of `tests/application-store.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run the new tests to verify they fail** (store still uses fs)

```bash
npm test -- tests/application-store.test.ts
```

Expected: FAIL — tests run against the old fs implementation and won't match DB behavior.

- [ ] **Step 3: Replace `src/server/application-store.ts`**

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/application-store.test.ts
```

Expected: all 4 tests PASS. If `DATABASE_URL` is missing, you'll get a connection error — ensure `.env` is present.

- [ ] **Step 5: Run full test suite to check for regressions**

```bash
npm test
```

Expected: all unit tests pass. The `db-schema.test.ts` and `application-store.test.ts` should both be green.

- [ ] **Step 6: Commit**

```bash
git add src/server/application-store.ts tests/application-store.test.ts
git commit -m "Replace file-based store with Neon PostgreSQL via Drizzle"
```

---

## Task 6: Verify end-to-end

**Files:** none changed

- [ ] **Step 1: Ensure dev server is running**

```bash
npm run dev
```

Server should start on http://localhost:3050.

- [ ] **Step 2: Run e2e tests**

```bash
npx playwright test --headed
```

Expected: 11/11 pass.

- [ ] **Step 3: Manual smoke test — submit an application**

Open http://localhost:3050, fill in the form (use a `@startrader.com` email), answer all 30 questions, submit.

Expected: success toast appears.

- [ ] **Step 4: Verify data in Admin**

Open http://localhost:3050/admin (login: `admin@startrader.com` / `changeme`).

Expected: the submitted application appears in the dashboard with name, email, and MC score.

- [ ] **Step 5: Push to GitHub**

```bash
git push origin main
```
