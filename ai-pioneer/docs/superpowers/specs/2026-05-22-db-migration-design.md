# DB Migration: File Store → Neon PostgreSQL

**Date:** 2026-05-22  
**Scope:** Replace `.data/applications.json` file-based storage with Neon PostgreSQL via Drizzle ORM.

---

## Problem

The current storage layer (`src/server/application-store.ts`) writes to a local JSON file (`.data/applications.json`). This breaks in serverless/cloud deployments where the filesystem is ephemeral, and cannot scale beyond a single instance.

---

## Solution

Swap the storage backend to Neon PostgreSQL. The public interface of `application-store.ts` stays identical — all callers remain untouched.

---

## Database Schema

Single table `applications`:

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PRIMARY KEY, default `gen_random_uuid()` |
| `name` | `text` | NOT NULL |
| `phone` | `text` | NOT NULL |
| `company_email` | `text` | NOT NULL |
| `answers` | `jsonb` | NOT NULL |
| `manual_scores` | `jsonb` | nullable |
| `created_at` | `timestamptz` | default `now()` |

`answers` stores the full 30-question response object as JSONB — queries never filter by individual answer, so normalization adds cost with no benefit.

`manual_scores` stores the four open-question judge scores (`q22`, `q25`, `q27`, `q30`, each 0–5) as nullable JSONB — partial updates are common during review.

---

## Architecture

### New files

**`src/db/schema.ts`**  
Drizzle table definition. Single source of truth for column types. Exports the `applications` table object and an inferred `ApplicationRow` type.

**`src/db/client.ts`**  
Creates a singleton Drizzle client using `@neondatabase/serverless` (HTTP transport) and `drizzle-orm/neon-http`. Reads `DATABASE_URL` from env. No connection pooling config needed — Neon's HTTP driver is stateless.

### Modified files

**`src/server/application-store.ts`**  
Internal implementation replaced with Drizzle queries. Public API unchanged:
- `addApplication(data)` → `db.insert(applications).values(...).returning()`
- `listApplications()` → `db.select().from(applications).orderBy(desc(created_at))`
- `updateApplicationManualScores(id, scores)` → `db.update(applications).set(...).where(eq(id, ...))`

The in-memory `cache` and all `fs` calls are removed entirely.

---

## Dependencies

```
drizzle-orm          (runtime)
@neondatabase/serverless  (runtime)
drizzle-kit          (devDependency)
```

New script in `package.json`:
```json
"db:push": "drizzle-kit push"
```

`drizzle.config.ts` at project root points to `src/db/schema.ts` and reads `DATABASE_URL`.

---

## Data Flow

```
Client form submit
  → submitApplication() server fn
  → addApplication(data)
  → db.insert(applications)          ← Neon PostgreSQL via HTTP
  → return ApplicationRecord

Admin dashboard load
  → fetchApplications() server fn
  → listApplications()
  → db.select().from(applications)
  → score() each record client-side  ← scoring logic unchanged
```

---

## Error Handling

- Missing `DATABASE_URL`: Drizzle/Neon will throw at query time with a clear connection error. No silent fallback — fail fast.
- Duplicate submissions: no unique constraint on email intentionally — re-submissions are allowed and reviewed manually by admin.
- `updateApplicationManualScores` with unknown `id`: returns `null`, caller (`saveManualScores` server fn) already handles this with a 404-style response.

---

## Out of Scope

- No data migration from existing `.data/applications.json` — dev data only, not needed
- No connection pooling config — Neon HTTP driver is stateless
- No Prisma, no raw SQL
- No changes to scoring logic, admin auth, or frontend
