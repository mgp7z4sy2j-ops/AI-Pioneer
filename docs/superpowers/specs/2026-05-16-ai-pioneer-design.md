# STARTRADER AI Pioneer Program — Design Spec

**Date**: 2026-05-16  
**Status**: Approved

---

## Overview

Single-page landing + application form for STARTRADER's internal AI Pioneer Program. Targets STARTRADER employees. Goal: recruit participants for a 2-month enterprise AI learning program, culminating in an AI Leadership Award.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | TanStack Start v1 (React 19, SSR) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Validation | Zod |
| Database | Supabase JS SDK (mock via console.log in MVP) |
| Notifications | Sonner toast |

---

## Page Sections (7)

1. **Hero** — `gradient-momentum` background, tagline "Learn Faster. Think Bigger. Build Smarter.", 3-stat strip (2mo / 30 / 1), CTA scrolls to form
2. **Pillars** — 5 trait cards (Curiosity, Learning Motivation, Innovation, Exploration, Transformation)
3. **Offer** — 4-item benefit list (AI accounts, tools, training, projects)
4. **Journey** — 7-step process timeline
5. **Judges** — Peter lead + AI expert team, 4 weighted criteria (Learning 30% / AI Understanding 20% / Business 30% / Collaboration 20%)
6. **Awards** — AI Champions recognition + secondary CTA
7. **Application Form** — user info + 30-question assessment + submit

---

## Application Form

**User fields**: Name, Phone, Company Email (Zod: required + email format)

**Questionnaire**: 30 questions in 3 sections
- Section 1 (Q1–Q10): AI Fundamentals, MC only
- Section 2 (Q11–Q20): AI Application & Business Thinking, MC only
- Section 3 (Q21–Q30): Learning Motivation & Growth Potential, MC + 4 open-ended

**Open-ended questions**: Q22, Q25, Q27, Q30 (textarea, max 2000 chars)

**UX**:
- Sticky progress bar (top)
- Radio cards with hover border effect for MC
- All 30 questions must be answered before submit
- On incomplete: auto-scroll to first unanswered
- On success: thank-you state (no page reload), Peter review note
- Loading state on submit button
- Sonner toast for errors

**Data flow**: form → Zod validate → Supabase INSERT `applications` table (mock in MVP)

---

## Design System

**Colors** (from brand guidelines):
- Navy `#0D0D4B` — primary background
- Cyan `#16E9D7` — CTAs, accents, links
- Blue `#0047BB` — secondary CTAs
- Mist `#DAE3ED` — borders, subtle backgrounds
- Ink `#1C1F2A` — card surfaces

**Gradients**:
- `gradient-momentum`: `linear-gradient(135deg, #0D0D4B 0%, #0047BB 50%, #16E9D7 100%)` — Hero background

**Typography**: Plus Jakarta Sans (primary), Zodiak (display/hero)

**Logo**: `STARTRADER_Primary_Logo_Inverted_RGB.png` — nav + hero (dark background)

---

## File Structure

```
src/
  routes/
    __root.tsx        # root layout, SEO meta, Sonner
    index.tsx         # full landing + form
  data/
    questions.ts      # 30-question dataset
  styles.css          # Tailwind v4 theme tokens
```

---

## Database Schema (MVP mock, real Supabase later)

```sql
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_email TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## SEO

```
Title: STARTRADER AI Pioneer Program — Apply Now
Description: Join the STARTRADER AI Pioneer Program. 2-month enterprise AI accounts, training, and AI Leadership Awards for top performers.
```
