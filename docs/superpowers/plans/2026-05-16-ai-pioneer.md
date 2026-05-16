# STARTRADER AI Pioneer Program — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page TanStack Start landing site with a 30-question application form for the STARTRADER AI Pioneer Program.

**Architecture:** Single route `/` renders all 7 content sections plus an application form. Form validates with Zod, submits to Supabase (mocked via `console.log` in MVP). No client-side routing — all content is in `app/routes/index.tsx`.

**Tech Stack:** TanStack Start v1 (React 19, SSR) · Vite 7 · Tailwind CSS v4 · shadcn/ui · Zod · Supabase JS SDK (mock)

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/routes/__root.tsx` | Root layout: SEO meta, Sonner Toaster |
| `app/routes/index.tsx` | All 7 page sections + ApplicationForm component |
| `app/data/questions.ts` | 30-question dataset with types |
| `app/lib/schema.ts` | Zod validation schema |
| `app/lib/supabase.ts` | Submit function (mock for MVP) |
| `app/styles.css` | Tailwind v4 entry + brand design tokens |
| `tests/questions.test.ts` | Question data shape tests |
| `tests/schema.test.ts` | Form validation unit tests |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `app/`, `vite.config.ts` (via scaffold)

- [ ] **Step 1: Scaffold the project**

```bash
npm create tanstack@latest ai-pioneer
# When prompted: select TanStack Start, React 19, TypeScript
cd ai-pioneer
npm install
```

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```
Expected: Server running at `http://localhost:3000`, browser shows default TanStack Start page.

- [ ] **Step 3: Commit initial scaffold**

```bash
git init
git add .
git commit -m "chore: scaffold TanStack Start project"
```

---

### Task 2: Design Tokens + Tailwind v4

**Files:**
- Modify: `app/styles.css`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install Tailwind v4 Vite plugin (if not already included by scaffold)**

```bash
npm install tailwindcss @tailwindcss/vite
```

Add to `vite.config.ts` plugins array:
```typescript
import tailwindcss from '@tailwindcss/vite'
// add tailwindcss() to plugins: [tailwindcss(), ...]
```

- [ ] **Step 2: Replace `app/styles.css` with brand tokens**

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap");

@theme {
  /* Primary colors */
  --color-navy: #0D0D4B;
  --color-cyan: #16E9D7;
  --color-blue: #0047BB;
  --color-mist: #DAE3ED;

  /* Secondary colors */
  --color-ink: #1C1F2A;
  --color-graphite: #50555B;
  --color-deep-blue: #001489;
  --color-sand: #DFC5AE;

  /* Premium colors */
  --color-bronze: #AC7C59;
  --color-silver: #A0A8AE;

  /* Typography */
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgb(13 13 75 / 0.06);
  --shadow-md: 0 4px 12px rgb(13 13 75 / 0.10);
  --shadow-lg: 0 12px 32px rgb(13 13 75 / 0.16);
}

@layer utilities {
  .bg-gradient-momentum {
    background: linear-gradient(135deg, #0D0D4B 0%, #0047BB 50%, #16E9D7 100%);
  }
  .bg-gradient-trust {
    background: linear-gradient(180deg, #0D0D4B 0%, #001489 100%);
  }
  .bg-gradient-growth {
    background: linear-gradient(90deg, #0047BB 0%, #16E9D7 100%);
  }
}

html {
  font-family: var(--font-sans);
  background-color: #0D0D4B;
  color: #FFFFFF;
}
```

- [ ] **Step 3: Verify colors work**

Temporarily add to `app/routes/index.tsx`:
```tsx
<div className="bg-navy text-cyan p-8">Brand colors work</div>
```
Confirm navy background and cyan text appear in browser. Remove the test div after verification.

- [ ] **Step 4: Commit**

```bash
git add app/styles.css vite.config.ts
git commit -m "feat: add brand design tokens to Tailwind v4"
```

---

### Task 3: shadcn/ui Setup

**Files:**
- Create: `components.json`
- Create: `app/components/ui/` (generated)

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```
When prompted: Default style, CSS variables Yes, CSS file `app/styles.css`, components alias `~/components`.

- [ ] **Step 2: Add required components**

```bash
npx shadcn@latest add button input card progress radio-group textarea label sonner
```

- [ ] **Step 3: Override button default variant for brand**

In `app/components/ui/button.tsx`, find the `cva` config and update the `default` variant:
```typescript
default: "bg-cyan text-navy shadow hover:bg-cyan/80 font-bold",
```

- [ ] **Step 4: Verify a component renders**

Temporarily add to `app/routes/index.tsx`:
```tsx
import { Button } from '~/components/ui/button'
// ...
<Button>Test</Button>
```
Confirm cyan button renders. Remove after verification.

- [ ] **Step 5: Commit**

```bash
git add components.json app/components/
git commit -m "feat: add shadcn/ui components"
```

---

### Task 4: Root Layout with SEO + Sonner

**Files:**
- Modify: `app/routes/__root.tsx`

- [ ] **Step 1: Update root layout**

Replace `app/routes/__root.tsx` with:

```tsx
import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import { Toaster } from '~/components/ui/sonner'
import '~/styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'STARTRADER AI Pioneer Program — Apply Now' },
      {
        name: 'description',
        content:
          'Join the STARTRADER AI Pioneer Program. 2-month enterprise AI accounts, training, and AI Leadership Awards for top performers.',
      },
      { property: 'og:title', content: 'STARTRADER AI Pioneer Program' },
      {
        property: 'og:description',
        content:
          'Apply for 2 months of enterprise AI access, hands-on learning, and a chance to win the AI Leadership Award.',
      },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body className="bg-navy text-white antialiased">
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
```

Note: The exact TanStack Start root route API varies by scaffold version. Check the generated `__root.tsx` and adapt accordingly — the key additions are `<Meta />`, the `head()` config, and `<Toaster />`.

- [ ] **Step 2: Verify page title**

Run `npm run dev`. Browser tab should read "STARTRADER AI Pioneer Program — Apply Now".

- [ ] **Step 3: Commit**

```bash
git add app/routes/__root.tsx
git commit -m "feat: root layout with SEO meta and Sonner toaster"
```

---

### Task 5: Questions Data + Zod Schema

**Files:**
- Create: `app/data/questions.ts`
- Create: `app/lib/schema.ts`
- Create: `tests/questions.test.ts`
- Create: `tests/schema.test.ts`

- [ ] **Step 1: Write failing tests for question data shape**

Create `tests/questions.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { questions } from '../app/data/questions'

describe('questions data', () => {
  it('has exactly 30 questions', () => {
    expect(questions).toHaveLength(30)
  })

  it('has questions numbered 1-30', () => {
    const ids = questions.map(q => q.id)
    expect(ids).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
  })

  it('sections are 1, 2, or 3 only', () => {
    questions.forEach(q => expect([1, 2, 3]).toContain(q.section))
  })

  it('section 1 has 10 MC questions (Q1–Q10)', () => {
    const s1 = questions.filter(q => q.section === 1)
    expect(s1).toHaveLength(10)
    s1.forEach(q => expect(q.type).toBe('mc'))
  })

  it('section 2 has 10 MC questions (Q11–Q20)', () => {
    const s2 = questions.filter(q => q.section === 2)
    expect(s2).toHaveLength(10)
    s2.forEach(q => expect(q.type).toBe('mc'))
  })

  it('section 3 has 10 questions (Q21–Q30)', () => {
    expect(questions.filter(q => q.section === 3)).toHaveLength(10)
  })

  it('open questions are exactly Q22, Q25, Q27, Q30', () => {
    const openIds = questions.filter(q => q.type === 'open').map(q => q.id)
    expect(openIds).toEqual([22, 25, 27, 30])
  })

  it('all MC questions have at least 4 options', () => {
    questions.filter(q => q.type === 'mc').forEach(q => {
      expect(q.options).toBeDefined()
      expect(q.options!.length).toBeGreaterThanOrEqual(4)
    })
  })

  it('all open questions have maxLength 2000', () => {
    questions.filter(q => q.type === 'open').forEach(q => {
      expect(q.maxLength).toBe(2000)
    })
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm run test tests/questions.test.ts
```
Expected: FAIL — "Cannot find module '../app/data/questions'"

- [ ] **Step 3: Create `app/data/questions.ts`**

```typescript
export type QuestionType = 'mc' | 'open'

export interface Question {
  id: number
  section: 1 | 2 | 3
  text: string
  type: QuestionType
  options?: { value: string; label: string }[]
  maxLength?: number
}

export const questions: Question[] = [
  // === SECTION 1: AI Fundamentals ===
  {
    id: 1, section: 1, type: 'mc',
    text: 'What does "LLM" stand for in the context of AI?',
    options: [
      { value: 'A', label: 'Large Language Model' },
      { value: 'B', label: 'Linear Learning Machine' },
      { value: 'C', label: 'Logical Logic Module' },
      { value: 'D', label: 'Language Learning Memory' },
    ],
  },
  {
    id: 2, section: 1, type: 'mc',
    text: 'Which of the following best describes "prompt engineering"?',
    options: [
      { value: 'A', label: 'Writing code for AI systems' },
      { value: 'B', label: 'Crafting instructions to get optimal outputs from an AI model' },
      { value: 'C', label: 'Training AI models from scratch' },
      { value: 'D', label: 'Testing AI performance metrics in production' },
    ],
  },
  {
    id: 3, section: 1, type: 'mc',
    text: 'What is "hallucination" in the context of AI?',
    options: [
      { value: 'A', label: 'A feature that enables visual AI generation' },
      { value: 'B', label: 'When an AI generates confidently stated but factually incorrect information' },
      { value: 'C', label: 'An AI security vulnerability exploited by hackers' },
      { value: 'D', label: "The AI model's creative writing mode" },
    ],
  },
  {
    id: 4, section: 1, type: 'mc',
    text: 'Which AI capability allows a model to process both text and images?',
    options: [
      { value: 'A', label: 'Multimodal AI' },
      { value: 'B', label: 'Transfer learning' },
      { value: 'C', label: 'Federated learning' },
      { value: 'D', label: 'Reinforcement learning' },
    ],
  },
  {
    id: 5, section: 1, type: 'mc',
    text: 'What is RAG (Retrieval-Augmented Generation)?',
    options: [
      { value: 'A', label: 'A type of specialized AI hardware' },
      { value: 'B', label: 'A technique combining AI generation with real-time data retrieval' },
      { value: 'C', label: 'A programming language for building AI apps' },
      { value: 'D', label: 'A method for training models with limited data' },
    ],
  },
  {
    id: 6, section: 1, type: 'mc',
    text: 'What does "context window" refer to in large language models?',
    options: [
      { value: 'A', label: 'The graphical interface of an AI application' },
      { value: 'B', label: 'The maximum amount of text an AI can process in a single interaction' },
      { value: 'C', label: "The AI's average response latency" },
      { value: 'D', label: 'A display feature in AI developer tools' },
    ],
  },
  {
    id: 7, section: 1, type: 'mc',
    text: 'Which of the following is the best example of generative AI?',
    options: [
      { value: 'A', label: 'A spam email filter' },
      { value: 'B', label: 'A Netflix recommendation engine' },
      { value: 'C', label: 'A tool that writes marketing copy from a brief' },
      { value: 'D', label: 'A real-time fraud detection system' },
    ],
  },
  {
    id: 8, section: 1, type: 'mc',
    text: 'What is "fine-tuning" in the context of AI models?',
    options: [
      { value: 'A', label: "Adjusting the speed of an AI's responses" },
      { value: 'B', label: 'Further training a pre-built model on domain-specific data' },
      { value: 'C', label: 'Compressing an AI model to reduce its file size' },
      { value: 'D', label: 'Optimizing the hardware running an AI model' },
    ],
  },
  {
    id: 9, section: 1, type: 'mc',
    text: 'Which best describes "AI agents"?',
    options: [
      { value: 'A', label: 'Human operators who manage AI systems' },
      { value: 'B', label: 'AI systems that autonomously take multi-step actions to complete goals' },
      { value: 'C', label: 'AI models specialized in customer service' },
      { value: 'D', label: 'Dedicated hardware processors for AI workloads' },
    ],
  },
  {
    id: 10, section: 1, type: 'mc',
    text: 'What is the primary difference between AI and traditional software?',
    options: [
      { value: 'A', label: 'AI always requires an internet connection' },
      { value: 'B', label: 'AI learns patterns from data rather than following explicitly programmed rules' },
      { value: 'C', label: 'AI is always faster than traditional software' },
      { value: 'D', label: 'AI can only process text-based data' },
    ],
  },

  // === SECTION 2: AI Application & Business Thinking ===
  {
    id: 11, section: 2, type: 'mc',
    text: 'Which is the most appropriate use of AI in a financial services company?',
    options: [
      { value: 'A', label: 'Making final investment decisions autonomously without human oversight' },
      { value: 'B', label: 'Generating first-draft compliance summaries for human review and approval' },
      { value: 'C', label: 'Replacing all customer service agents to reduce headcount' },
      { value: 'D', label: 'Automatically adjusting interest rates in real time' },
    ],
  },
  {
    id: 12, section: 2, type: 'mc',
    text: 'What is "AI governance" in an enterprise context?',
    options: [
      { value: 'A', label: 'Government regulations that control AI companies' },
      { value: 'B', label: 'Policies and processes ensuring AI is used responsibly within an organization' },
      { value: 'C', label: 'The organizational chart of an AI development team' },
      { value: 'D', label: 'A mandatory security audit procedure for AI tools' },
    ],
  },
  {
    id: 13, section: 2, type: 'mc',
    text: 'When considering AI adoption, which risk should typically be prioritized first?',
    options: [
      { value: 'A', label: 'AI displacing all employees over time' },
      { value: 'B', label: 'Data privacy, confidentiality, and regulatory compliance' },
      { value: 'C', label: 'High upfront implementation costs' },
      { value: 'D', label: 'Resistance from employees unfamiliar with technology' },
    ],
  },
  {
    id: 14, section: 2, type: 'mc',
    text: 'What is the most effective approach to measuring AI ROI in a business?',
    options: [
      { value: 'A', label: 'Count the number of AI tools subscribed to or purchased' },
      { value: 'B', label: 'Compare time and cost savings against implementation and ongoing costs' },
      { value: 'C', label: 'Measure by how many employees log into AI tools daily' },
      { value: 'D', label: 'Track vendor customer satisfaction scores' },
    ],
  },
  {
    id: 15, section: 2, type: 'mc',
    text: 'Which statement best describes "responsible AI"?',
    options: [
      { value: 'A', label: 'AI systems guaranteed to never produce errors' },
      { value: 'B', label: 'AI developed and deployed in ways that are fair, transparent, and accountable' },
      { value: 'C', label: 'AI systems that automatically comply with all laws' },
      { value: 'D', label: 'AI with the highest available security configurations' },
    ],
  },
  {
    id: 16, section: 2, type: 'mc',
    text: 'A trading desk wants to use AI for real-time market analysis. What is the MOST important consideration?',
    options: [
      { value: 'A', label: 'Selecting the most recently released AI model available' },
      { value: 'B', label: 'Ensuring AI outputs are reviewed and validated by human analysts before acting' },
      { value: 'C', label: 'Minimizing the total cost of AI implementation' },
      { value: 'D', label: 'Maximizing the processing speed of AI inference' },
    ],
  },
  {
    id: 17, section: 2, type: 'mc',
    text: 'What does "AI democratization" mean in a business context?',
    options: [
      { value: 'A', label: 'Using AI to flatten organizational hierarchies' },
      { value: 'B', label: 'Making AI tools and capabilities accessible to non-technical business users' },
      { value: 'C', label: 'Open-sourcing all proprietary AI models' },
      { value: 'D', label: 'Reducing AI subscription costs across the industry' },
    ],
  },
  {
    id: 18, section: 2, type: 'mc',
    text: 'Which approach best describes effective human-AI collaboration?',
    options: [
      { value: 'A', label: 'Humans review, validate, and take ownership of AI-generated outputs' },
      { value: 'B', label: 'AI makes all decisions; humans serve as passive monitors' },
      { value: 'C', label: 'AI handles only simple, repetitive tasks with no human review needed' },
      { value: 'D', label: 'Humans and AI work in completely separate silos with no overlap' },
    ],
  },
  {
    id: 19, section: 2, type: 'mc',
    text: 'When should an employee escalate an AI-generated output to a supervisor?',
    options: [
      { value: 'A', label: 'Never — modern AI is reliable enough to trust without escalation' },
      { value: 'B', label: 'When the output involves high-stakes decisions, unusual results, or potential compliance issues' },
      { value: 'C', label: 'Only when the AI model itself recommends escalation' },
      { value: 'D', label: 'Only for calculations involving financial figures above a set threshold' },
    ],
  },
  {
    id: 20, section: 2, type: 'mc',
    text: 'What does "AI literacy" mean for a non-technical employee?',
    options: [
      { value: 'A', label: 'The ability to write, train, and deploy AI models from code' },
      { value: 'B', label: "Understanding AI's capabilities, limitations, and appropriate use cases to work with it effectively" },
      { value: 'C', label: 'Successfully completing a recognized AI certification course' },
      { value: 'D', label: 'Actively using at least five different AI tools on a weekly basis' },
    ],
  },

  // === SECTION 3: Learning Motivation & Growth Potential ===
  {
    id: 21, section: 3, type: 'mc',
    text: 'How would you describe your current approach to learning new professional tools?',
    options: [
      { value: 'A', label: 'I wait for formal training programs organized by the company' },
      { value: 'B', label: 'I proactively explore and experiment on my own before formal training' },
      { value: 'C', label: 'I only invest time in learning when explicitly required by my manager' },
      { value: 'D', label: 'I prefer learning informally from teammates when they share tips' },
    ],
  },
  {
    id: 22, section: 3, type: 'open',
    text: 'What area of your work would you most like AI to improve?',
    maxLength: 2000,
  },
  {
    id: 23, section: 3, type: 'mc',
    text: 'Which best describes your current use of AI tools in your daily work?',
    options: [
      { value: 'A', label: "I don't currently use any AI tools in my work" },
      { value: 'B', label: 'I occasionally try AI tools when a colleague suggests them' },
      { value: 'C', label: 'I regularly use AI tools and have built personal workflows around them' },
      { value: 'D', label: 'I build and share AI-enhanced workflows for my broader team' },
    ],
  },
  {
    id: 24, section: 3, type: 'mc',
    text: 'What is your primary motivation for joining this program?',
    options: [
      { value: 'A', label: 'It will look strong on my performance review' },
      { value: 'B', label: 'I want to build skills that future-proof my career in a changing landscape' },
      { value: 'C', label: 'My manager suggested or encouraged me to apply' },
      { value: 'D', label: "I'm curious to get hands-on experience with enterprise AI tools" },
    ],
  },
  {
    id: 25, section: 3, type: 'open',
    text: 'What do you think is the biggest risk or challenge of AI adoption in a company like STARTRADER?',
    maxLength: 2000,
  },
  {
    id: 26, section: 3, type: 'mc',
    text: 'How do you typically respond when a new tool or workflow does not immediately deliver expected results?',
    options: [
      { value: 'A', label: 'I give up and return to familiar, proven methods' },
      { value: 'B', label: 'I log the issue and wait for official support to resolve it' },
      { value: 'C', label: 'I experiment, troubleshoot, and seek input from peers or online resources' },
      { value: 'D', label: 'I escalate to management immediately and ask for a different solution' },
    ],
  },
  {
    id: 27, section: 3, type: 'open',
    text: 'If AI could reliably save you 1 hour every working day, how would you use that extra time?',
    maxLength: 2000,
  },
  {
    id: 28, section: 3, type: 'mc',
    text: 'Which statement best describes your attitude toward sharing knowledge with colleagues?',
    options: [
      { value: 'A', label: 'I keep my methods and shortcuts private to maintain a personal edge' },
      { value: 'B', label: 'I share knowledge freely and enjoy helping others level up their skills' },
      { value: 'C', label: "I share when someone asks directly, but don't take initiative to broadcast" },
      { value: 'D', label: 'I document things internally but rarely proactively share with the wider team' },
    ],
  },
  {
    id: 29, section: 3, type: 'mc',
    text: 'How would you rate your ability to adapt when facing rapid technology changes in your role?',
    options: [
      { value: 'A', label: 'I find rapid change stressful and strongly prefer predictable, stable environments' },
      { value: 'B', label: 'I adapt slowly but reliably catch up once I have sufficient time and support' },
      { value: 'C', label: 'I adapt comfortably when provided with clear guidance and adequate resources' },
      { value: 'D', label: 'I thrive on technological change and actively seek out new challenges' },
    ],
  },
  {
    id: 30, section: 3, type: 'open',
    text: 'Why would you like to join the STARTRADER AI Pioneer Program?',
    maxLength: 2000,
  },
]
```

- [ ] **Step 4: Run questions tests**

```bash
npm run test tests/questions.test.ts
```
Expected: All 9 tests PASS.

- [ ] **Step 5: Write failing tests for Zod schema**

Create `tests/schema.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { applicationSchema } from '../app/lib/schema'

const openIds = [22, 25, 27, 30]
const validAnswers = Object.fromEntries(
  Array.from({ length: 30 }, (_, i) => {
    const id = i + 1
    return [id, openIds.includes(id) ? 'Some open-ended answer text here.' : 'A']
  })
)

const validData = {
  name: 'Jane Smith',
  phone: '+852 9000 0000',
  company_email: 'jane@startrader.com',
  answers: validAnswers,
}

describe('applicationSchema', () => {
  it('accepts valid complete submission', () => {
    expect(applicationSchema.safeParse(validData).success).toBe(true)
  })

  it('rejects empty name', () => {
    expect(applicationSchema.safeParse({ ...validData, name: '' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(applicationSchema.safeParse({ ...validData, company_email: 'notanemail' }).success).toBe(false)
  })

  it('rejects empty phone', () => {
    expect(applicationSchema.safeParse({ ...validData, phone: '' }).success).toBe(false)
  })

  it('rejects answers missing question 5', () => {
    const { 5: _, ...without5 } = validAnswers as Record<number, string>
    expect(applicationSchema.safeParse({ ...validData, answers: without5 }).success).toBe(false)
  })

  it('rejects open answer exceeding 2000 chars', () => {
    const tooLong = { ...validAnswers, 22: 'x'.repeat(2001) }
    expect(applicationSchema.safeParse({ ...validData, answers: tooLong }).success).toBe(false)
  })
})
```

- [ ] **Step 6: Run schema test to confirm it fails**

```bash
npm run test tests/schema.test.ts
```
Expected: FAIL — "Cannot find module '../app/lib/schema'"

- [ ] **Step 7: Create `app/lib/schema.ts`**

```typescript
import { z } from 'zod'
import { questions } from '~/data/questions'

const answersSchema = z.object(
  Object.fromEntries(
    questions.map(q => [
      q.id,
      q.type === 'open'
        ? z.string().min(1, 'Please answer this question').max(2000, 'Answer must be 2000 characters or less')
        : z.string().min(1, 'Please select an option'),
    ])
  )
)

export const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  company_email: z.string().email('Please enter a valid email address'),
  answers: answersSchema,
})

export type ApplicationData = z.infer<typeof applicationSchema>
```

- [ ] **Step 8: Run schema tests**

```bash
npm run test tests/schema.test.ts
```
Expected: All 6 tests PASS.

- [ ] **Step 9: Commit**

```bash
git add app/data/questions.ts app/lib/schema.ts tests/
git commit -m "feat: add question data, Zod schema, and unit tests"
```

---

### Task 6: Supabase Mock

**Files:**
- Create: `app/lib/supabase.ts`

- [ ] **Step 1: Create `app/lib/supabase.ts`**

```typescript
import type { ApplicationData } from '~/lib/schema'

export async function submitApplication(data: ApplicationData): Promise<void> {
  console.log('[submitApplication] Received:', JSON.stringify(data, null, 2))
  await new Promise(resolve => setTimeout(resolve, 800))
  // To wire real Supabase later, replace the above with:
  // const { error } = await supabase.from('applications').insert(data)
  // if (error) throw error
}
```

- [ ] **Step 2: Commit**

```bash
git add app/lib/supabase.ts
git commit -m "feat: add Supabase submit mock"
```

---

### Task 7: Hero Section

**Files:**
- Modify: `app/routes/index.tsx`
- Create: `public/STARTRADER LOGO/` (copy from source)

- [ ] **Step 1: Copy logo assets to public directory**

```bash
cp -r "/Users/feiwang/Downloads/claude/AI Pioneer /STARTRADER LOGO" public/
```

- [ ] **Step 2: Replace `app/routes/index.tsx` with Hero section**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main>
      <HeroSection />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="bg-gradient-momentum min-h-screen flex flex-col">
      <nav className="px-6 py-5 flex items-center max-w-6xl mx-auto w-full">
        <img
          src="/STARTRADER LOGO/WEB/STARTRADER_Primary_Logo_Inverted_RGB.png"
          alt="STARTRADER"
          className="h-9 w-auto"
        />
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="text-cyan text-xs font-medium uppercase tracking-widest mb-4 block">
          Internal Program · 2026
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
          STARTRADER<br />AI Pioneer Program
        </h1>

        <p className="text-mist text-lg max-w-2xl mb-4 leading-relaxed font-medium">
          Learn Faster. Think Bigger. Build Smarter.
        </p>
        <p className="text-mist/70 text-base max-w-xl mb-10 leading-relaxed">
          A 2-month enterprise AI sandbox for STARTRADER's most curious minds —
          top performers earn the AI Leadership Award.
        </p>

        <Button
          size="lg"
          className="bg-cyan text-navy font-bold px-8 py-3 rounded-full hover:bg-cyan/80 transition-colors"
          onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Apply to the Program
        </Button>

        <div className="grid grid-cols-3 gap-8 mt-16 border-t border-white/10 pt-12 max-w-lg w-full">
          {[
            { value: '2 mo', label: 'Enterprise AI Access' },
            { value: '30', label: 'Assessment Questions' },
            { value: '1', label: 'AI Leadership Award' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-cyan text-4xl font-bold">{stat.value}</div>
              <div className="text-mist text-xs uppercase tracking-wide mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify Hero in browser**

Check: diagonal gradient background, logo top-left, white headline, cyan stats, CTA button.

- [ ] **Step 4: Commit**

```bash
git add app/routes/index.tsx public/
git commit -m "feat: add Hero section with logo and stats strip"
```

---

### Task 8: Pillars + Offer Sections

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add Pillars and Offer to `index.tsx`**

Update `LandingPage`:
```tsx
function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <OfferSection />
    </main>
  )
}
```

Add these components at the end of the file:

```tsx
const PILLARS = [
  { title: 'Curiosity About AI', desc: "You ask questions others haven't thought to ask yet." },
  { title: 'Strong Learning Motivation', desc: 'Self-driven to explore, experiment, and grow — no prodding needed.' },
  { title: 'Innovation Mindset', desc: 'You see workflows as opportunities to rethink, not just repeat.' },
  { title: 'Willingness to Explore', desc: 'Comfortable testing new tools, sharing findings, and iterating openly.' },
  { title: 'Transformation Potential', desc: "You want to help shape STARTRADER's AI-first future from the inside." },
]

function PillarsSection() {
  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Who We're Looking For</h2>
        <p className="text-mist text-lg text-center mb-12 max-w-2xl mx-auto">
          Five qualities — not a job title or seniority level.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map(p => (
            <div
              key={p.title}
              className="bg-ink border border-mist/10 rounded-lg p-6 hover:-translate-y-0.5 hover:border-cyan/30 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="text-lg font-medium text-white mb-2">{p.title}</h3>
              <p className="text-graphite text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const OFFER_ITEMS = [
  'Company-sponsored enterprise AI model accounts',
  'Access to advanced AI tools and sandboxes',
  'Internal AI training resources and learning materials',
  'Priority opportunities to join future AI projects',
]

function OfferSection() {
  return (
    <section className="bg-deep-blue py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-white mb-4">What Selected Participants Get</h2>
          <p className="text-mist text-lg mb-8 leading-relaxed">
            Every selected participant gets direct access to the tools, accounts, and support needed to explore AI deeply.
          </p>
          <ul className="space-y-4">
            {OFFER_ITEMS.map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-cyan mt-0.5 flex-shrink-0">✓</span>
                <span className="text-mist text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 bg-ink/50 border border-mist/10 rounded-lg p-8 text-center">
          <div className="text-cyan text-6xl font-bold mb-2">2</div>
          <div className="text-mist text-base uppercase tracking-widest mb-4">Months of Access</div>
          <p className="text-mist/60 text-sm">
            Full enterprise AI account access — the same tools used by leading AI teams worldwide.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Check: 5 trait cards with hover lift + cyan border glow, offer checklist, stat card.

- [ ] **Step 3: Commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add Pillars and Offer sections"
```

---

### Task 9: Journey + Judges Sections

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add Journey and Judges to `LandingPage`**

```tsx
function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <OfferSection />
      <JourneySection />
      <JudgesSection />
    </main>
  )
}
```

Add components:

```tsx
const JOURNEY_STEPS = [
  { num: 1, title: 'Application & Assessment', desc: 'Complete the 30-question AI assessment and submit your application.' },
  { num: 2, title: 'Selected Candidates', desc: 'The judging panel reviews all submissions and selects participants.' },
  { num: 3, title: 'AI Account Access Granted', desc: 'Selected candidates receive access to enterprise AI accounts.' },
  { num: 4, title: '2-Month Exploration Phase', desc: 'Explore, experiment, and build real AI workflows in your daily work.' },
  { num: 5, title: 'AI Use Case Submission', desc: 'Submit your most impactful AI use case and learning reflections.' },
  { num: 6, title: 'AI Champion Selection', desc: 'The judging panel evaluates submissions across four dimensions.' },
  { num: 7, title: 'Advanced Internal AI Projects', desc: 'Champions join exclusive, high-impact AI projects at STARTRADER.' },
]

function JourneySection() {
  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">The Pioneer Journey</h2>
        <p className="text-mist text-lg text-center mb-12">Seven steps from curious to champion.</p>
        <div className="space-y-6">
          {JOURNEY_STEPS.map(step => (
            <div key={step.num} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                <span className="text-cyan text-sm font-bold">{step.num}</span>
              </div>
              <div className="flex-1 pb-4">
                <h3 className="text-lg font-medium text-white mb-1">{step.title}</h3>
                <p className="text-graphite text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const JUDGING_CRITERIA = [
  { label: 'Learning Initiative', weight: '30%', desc: 'Depth and consistency of exploration during the program.' },
  { label: 'AI Understanding', weight: '20%', desc: 'Quality and accuracy of AI knowledge demonstrated.' },
  { label: 'Business Application', weight: '30%', desc: 'Real, measurable impact in your day-to-day work.' },
  { label: 'Collaboration & Sharing', weight: '20%', desc: 'Contributing insights back to the broader STARTRADER community.' },
]

function JudgesSection() {
  return (
    <section className="bg-ink py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Judging Panel</h2>
        <p className="text-mist text-lg text-center mb-12">
          Applications reviewed by the STARTRADER AI expert team, led by Peter.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {JUDGING_CRITERIA.map(c => (
            <div key={c.label} className="bg-navy/60 border border-mist/10 rounded-lg p-6">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-base font-medium text-white">{c.label}</h3>
                <span className="text-cyan text-3xl font-bold">{c.weight}</span>
              </div>
              <p className="text-graphite text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Check: 7 numbered steps with cyan circles, 4 criteria cards with cyan weight percentages.

- [ ] **Step 3: Commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add Journey and Judges sections"
```

---

### Task 10: Awards Section

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add Awards to `LandingPage`**

```tsx
function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <OfferSection />
      <JourneySection />
      <JudgesSection />
      <AwardsSection />
    </main>
  )
}
```

Add component:

```tsx
function AwardsSection() {
  return (
    <section className="bg-gradient-momentum py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-cyan text-xs font-medium uppercase tracking-widest mb-4 block">
          Top Performers
        </span>
        <h2 className="text-5xl font-bold text-white mb-6">AI Leadership Award</h2>
        <p className="text-mist text-lg mb-6 leading-relaxed">
          Outstanding participants will be recognized as STARTRADER's first cohort of{' '}
          <strong className="text-white">AI Champions</strong> — joining exclusive advanced AI projects
          and helping shape our AI-first culture from within.
        </p>
        <ul className="text-left max-w-md mx-auto mb-10 space-y-3">
          {[
            'Official AI Leadership Pioneer Award',
            'Invitation to advanced internal AI projects',
            'Recognition as an AI Champion at STARTRADER',
          ].map(item => (
            <li key={item} className="flex items-start gap-3">
              <span className="text-cyan mt-0.5 flex-shrink-0">★</span>
              <span className="text-mist text-base">{item}</span>
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          className="bg-cyan text-navy font-bold px-8 rounded-full hover:bg-cyan/80 transition-colors"
          onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Apply to the Program
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Check: gradient background, star list, second CTA scrolls to form.

- [ ] **Step 3: Commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add Awards section"
```

---

### Task 11: ApplicationForm — Info Fields + Progress Bar

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add imports and ApplicationForm scaffold**

At the top of `index.tsx`, add:
```tsx
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Progress } from '~/components/ui/progress'
import { questions } from '~/data/questions'
import { applicationSchema } from '~/lib/schema'
import { submitApplication } from '~/lib/supabase'
```

Add `<ApplicationForm />` to `LandingPage` after `<AwardsSection />`.

Add the component:

```tsx
function ApplicationForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const progress = useMemo(() => {
    const answered = questions.filter(q => (answers[q.id] ?? '').trim().length > 0).length
    return Math.round((answered / questions.length) * 100)
  }, [answers])

  if (submitted) {
    return (
      <section id="apply" className="bg-navy py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-cyan text-7xl mb-6">✓</div>
          <h2 className="text-4xl font-bold text-white mb-4">Application Submitted</h2>
          <p className="text-mist text-lg leading-relaxed">
            Thank you for applying to the STARTRADER AI Pioneer Program. Your application
            will be reviewed by Peter and the STARTRADER AI expert team. We'll be in touch.
          </p>
        </div>
      </section>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = applicationSchema.safeParse({ name, phone, company_email: email, answers })
    if (!parsed.success) {
      const firstUnanswered = questions.find(q => !(answers[q.id] ?? '').trim())
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      toast.error('Please complete all required fields before submitting.')
      return
    }
    setSubmitting(true)
    try {
      await submitApplication(parsed.data)
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="apply" className="bg-navy py-20 px-6">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-mist/10 py-3 px-6 -mx-6 mb-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <span className="text-mist text-sm flex-shrink-0">Progress</span>
          <Progress value={progress} className="flex-1 h-2 bg-mist/10 [&>div]:bg-cyan" />
          <span className="text-cyan text-sm font-medium flex-shrink-0">{progress}%</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Apply to the Program</h2>
          <p className="text-mist text-base">Fill in your details and complete the 30-question AI assessment.</p>
        </div>

        {/* Info fields */}
        <div className="space-y-6 bg-ink border border-mist/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white">Your Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-mist text-sm mb-1.5 block">Full Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                className="bg-navy border-mist/20 text-white placeholder:text-graphite focus:border-cyan" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-mist text-sm mb-1.5 block">Phone Number *</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+852 9000 0000"
                className="bg-navy border-mist/20 text-white placeholder:text-graphite focus:border-cyan" />
            </div>
            <div>
              <Label htmlFor="email" className="text-mist text-sm mb-1.5 block">Company Email *</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jane@startrader.com"
                className="bg-navy border-mist/20 text-white placeholder:text-graphite focus:border-cyan" />
            </div>
          </div>
        </div>

        {/* Question sections — added in Tasks 12 and 13 */}
        <div id="questions-placeholder" />

        <Button type="submit" disabled={submitting}
          className="w-full bg-cyan text-navy font-bold py-3 rounded-md hover:bg-cyan/80 disabled:opacity-50 transition-colors">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Check: sticky progress bar at 0%, three input fields with dark styling, submit button.

- [ ] **Step 3: Commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add ApplicationForm with info fields and progress bar"
```

---

### Task 12: ApplicationForm — MC Question Cards (Sections 1 & 2)

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add MCQuestionCard component**

Add before `ApplicationForm`:

```tsx
function MCQuestionCard({
  question,
  value,
  onChange,
}: {
  question: { id: number; text: string; options?: { value: string; label: string }[] }
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div id={`q-${question.id}`} className="space-y-3">
      <p className="text-white text-base font-medium">
        <span className="text-cyan font-bold mr-2">Q{question.id}.</span>
        {question.text}
      </p>
      <div className="space-y-2">
        {(question.options ?? []).map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-all duration-150 ${
              value === opt.value
                ? 'border-cyan bg-cyan/10 text-white'
                : 'border-mist/15 bg-ink/40 text-mist hover:border-mist/40 hover:bg-ink/60'
            }`}
          >
            <span className={`font-bold mr-2 ${value === opt.value ? 'text-cyan' : 'text-graphite'}`}>
              {opt.value}.
            </span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Replace questions placeholder in `ApplicationForm`**

Replace `<div id="questions-placeholder" />` with:

```tsx
{/* Section 1 */}
<div className="space-y-8 bg-ink border border-mist/10 rounded-lg p-6">
  <div>
    <span className="text-cyan text-xs font-medium uppercase tracking-widest">Section 1</span>
    <h3 className="text-lg font-medium text-white mt-1">AI Fundamentals</h3>
    <p className="text-graphite text-sm mt-1">10 questions · Multiple choice</p>
  </div>
  {questions.filter(q => q.section === 1).map(q => (
    <MCQuestionCard key={q.id} question={q}
      value={answers[q.id] ?? ''}
      onChange={val => setAnswers(prev => ({ ...prev, [q.id]: val }))} />
  ))}
</div>

{/* Section 2 */}
<div className="space-y-8 bg-ink border border-mist/10 rounded-lg p-6">
  <div>
    <span className="text-cyan text-xs font-medium uppercase tracking-widest">Section 2</span>
    <h3 className="text-lg font-medium text-white mt-1">AI Application & Business Thinking</h3>
    <p className="text-graphite text-sm mt-1">10 questions · Multiple choice</p>
  </div>
  {questions.filter(q => q.section === 2).map(q => (
    <MCQuestionCard key={q.id} question={q}
      value={answers[q.id] ?? ''}
      onChange={val => setAnswers(prev => ({ ...prev, [q.id]: val }))} />
  ))}
</div>

{/* Section 3 placeholder */}
<div id="section3-placeholder" />
```

- [ ] **Step 3: Verify in browser**

Check: Sections 1 and 2 render with radio card buttons. Clicking an option highlights it (cyan border + bg). Progress bar updates.

- [ ] **Step 4: Commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add MC question cards for sections 1 and 2"
```

---

### Task 13: ApplicationForm — Open Questions + Section 3

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add Textarea import**

```tsx
import { Textarea } from '~/components/ui/textarea'
```

- [ ] **Step 2: Add OpenQuestionCard component**

Add before `ApplicationForm`:

```tsx
function OpenQuestionCard({
  question,
  value,
  onChange,
}: {
  question: { id: number; text: string; maxLength?: number }
  value: string
  onChange: (val: string) => void
}) {
  const max = question.maxLength ?? 2000
  return (
    <div id={`q-${question.id}`} className="space-y-3">
      <p className="text-white text-base font-medium">
        <span className="text-cyan font-bold mr-2">Q{question.id}.</span>
        {question.text}
      </p>
      <div>
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={max}
          rows={4}
          placeholder="Write your answer here..."
          className="bg-navy border-mist/20 text-white placeholder:text-graphite focus:border-cyan resize-none"
        />
        <div className="text-right mt-1">
          <span className={`text-xs ${value.length > max * 0.9 ? 'text-sand' : 'text-graphite'}`}>
            {value.length} / {max}
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Replace Section 3 placeholder**

Replace `<div id="section3-placeholder" />` with:

```tsx
{/* Section 3 */}
<div className="space-y-8 bg-ink border border-mist/10 rounded-lg p-6">
  <div>
    <span className="text-cyan text-xs font-medium uppercase tracking-widest">Section 3</span>
    <h3 className="text-lg font-medium text-white mt-1">Learning Motivation & Growth Potential</h3>
    <p className="text-graphite text-sm mt-1">10 questions · Multiple choice + open-ended</p>
  </div>
  {questions.filter(q => q.section === 3).map(q =>
    q.type === 'open' ? (
      <OpenQuestionCard key={q.id} question={q}
        value={answers[q.id] ?? ''}
        onChange={val => setAnswers(prev => ({ ...prev, [q.id]: val }))} />
    ) : (
      <MCQuestionCard key={q.id} question={q}
        value={answers[q.id] ?? ''}
        onChange={val => setAnswers(prev => ({ ...prev, [q.id]: val }))} />
    )
  )}
</div>
```

- [ ] **Step 4: Verify in browser**

Check: Section 3 mixes MC cards and textareas. Q22, Q25, Q27, Q30 are textareas with character counter turning amber near 2000. Progress bar reaches 100% when all 30 answered.

- [ ] **Step 5: Commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add open question cards and Section 3"
```

---

### Task 14: Submit Flow Verification

**Files:**
- `app/routes/index.tsx` (no code changes — manual verification)

The submit logic was written in Task 11. This task confirms the end-to-end flow works.

- [ ] **Step 1: Test happy path**

1. Fill Name, Phone, Company Email
2. Answer all 30 questions (any option for MC, any text for open)
3. Click "Submit Application"
4. Expected: button shows "Submitting..." for ~800ms, then success view appears
5. Check browser console: `[submitApplication] Received:` with full JSON payload

- [ ] **Step 2: Test validation — incomplete questionnaire**

1. Fill user info only, leave questions blank
2. Click "Submit Application"
3. Expected: Sonner error toast appears, page scrolls to Q1

- [ ] **Step 3: Test validation — invalid email**

1. Enter `notanemail` in the email field, fill everything else
2. Click "Submit Application"
3. Expected: Sonner error toast about completing required fields

- [ ] **Step 4: Commit if all flows verified**

No code changes needed if all flows work. Only commit if you needed to fix something:

```bash
git add app/routes/index.tsx
git commit -m "fix: adjust submit validation flow"
```

---

### Task 15: Footer + Responsive Polish

**Files:**
- Modify: `app/routes/index.tsx`

- [ ] **Step 1: Add Footer to `LandingPage`**

```tsx
function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <OfferSection />
      <JourneySection />
      <JudgesSection />
      <AwardsSection />
      <ApplicationForm />
      <FooterSection />
    </main>
  )
}
```

Add component:

```tsx
function FooterSection() {
  return (
    <footer className="bg-navy border-t border-mist/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <img
            src="/STARTRADER LOGO/WEB/STARTRADER_Primary_Logo_Inverted_RGB.png"
            alt="STARTRADER"
            className="h-8 w-auto"
          />
          <p className="text-graphite text-sm italic">Built on Trust. Driven by Growth.</p>
        </div>
        <div className="border-t border-mist/10 pt-6 text-center">
          <p className="text-graphite text-xs">
            This is an internal STARTRADER program. For inquiries, contact{' '}
            <span className="text-cyan">brandhub@startrader.com</span>
          </p>
          <p className="text-graphite/50 text-xs mt-2">
            © {new Date().getFullYear()} STARTRADER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Verify mobile layout at 375px**

In browser DevTools, set width to 375px. Check:
- Hero headline wraps without overflow
- Pillars cards stack to single column
- Offer section stacks vertically
- Journey steps readable
- Judges criteria cards stack to 1 column
- Form inputs are full-width and tappable

- [ ] **Step 3: Final all-sections run-through at desktop**

Scroll through the full page at 1280px wide. Verify all 7 sections + footer render correctly with brand colors.

- [ ] **Step 4: Final commit**

```bash
git add app/routes/index.tsx
git commit -m "feat: add footer and complete landing page"
```

---

## Self-Review

**Spec coverage:**
- ✅ Hero (tagline, 3-stat strip, CTA) — Task 7
- ✅ Pillars (5 traits) — Task 8
- ✅ Offer (4 benefits) — Task 8
- ✅ Journey (7 steps) — Task 9
- ✅ Judges (Peter, 4 weighted criteria) — Task 9
- ✅ Awards (AI Champions, secondary CTA) — Task 10
- ✅ Application Form (name/phone/email) — Task 11
- ✅ 30 questions (26 MC + 4 open) — Task 5 (data), Tasks 12–13 (UI)
- ✅ Sticky progress bar — Task 11
- ✅ Zod validation + scroll to first unanswered — Task 11
- ✅ Supabase mock (console.log) — Task 6
- ✅ Success / thank-you state — Task 11
- ✅ Sonner toast errors — Task 11
- ✅ SEO meta (title, description, OG) — Task 4
- ✅ Brand tokens (Navy, Cyan, Blue, Mist) — Task 2
- ✅ Logo (Primary Horizontal Inverted on dark bg) — Task 7
- ✅ Footer — Task 15
- ✅ Mobile responsive — Task 15

**No gaps found.**

**Placeholder scan:** No TBD, TODO, or incomplete steps found.

**Type consistency:**
- `answers` is `Record<number, string>` in Tasks 5, 11, 12, 13 — consistent
- `applicationSchema` takes `{ name, phone, company_email, answers }` in Tasks 5 and 11 — consistent
- `submitApplication(data: ApplicationData)` — `ApplicationData` inferred from schema in Tasks 5, 6, 11 — consistent
- `MCQuestionCard` and `OpenQuestionCard` both receive `value: string` + `onChange: (val: string) => void` — consistent

**All consistent. No issues.**
