import { mcAnswerKeys, openQuestionIds } from '@/data/answer-keys'
import { questions } from '@/data/questions'
import type { ApplicationRecord, ManualScores } from '@/lib/application-types'

export const JUDGING_WEIGHTS = {
  learningInitiative: 0.3,
  aiUnderstanding: 0.2,
  businessApplication: 0.3,
  collaborationSharing: 0.2,
} as const

const MC_BY_DIMENSION = {
  aiUnderstanding: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  businessApplication: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  learningInitiative: [21, 23, 24, 26, 29],
  collaborationSharing: [28],
} as const

export interface ApplicationScore {
  mcCorrect: number
  mcTotal: number
  mcPercent: number
  mcByQuestion: Record<number, boolean | null>
  dimensions: {
    learningInitiative: number
    aiUnderstanding: number
    businessApplication: number
    collaborationSharing: number
  }
  overall: number | null
  overallComplete: boolean
  openReviewComplete: boolean
  grade: string | null
  gradeLabel: string | null
}

function normalizeAnswer(value: unknown): string {
  return String(value ?? '').trim().toUpperCase()
}

function percentCorrect(ids: number[], answers: ApplicationRecord['answers']): number {
  if (ids.length === 0) return 0
  const correct = ids.filter(id => normalizeAnswer(answers[id]) === mcAnswerKeys[id]).length
  return Math.round((correct / ids.length) * 100)
}

function manualToPercent(score: number | undefined): number | null {
  if (score === undefined) return null
  return Math.round((score / 5) * 100)
}

function blendScores(parts: Array<number | null>): number {
  const valid = parts.filter((p): p is number => p !== null)
  if (valid.length === 0) return 0
  return Math.round(valid.reduce((sum, n) => sum + n, 0) / valid.length)
}

function gradeFromOverall(overall: number): { grade: string; gradeLabel: string } {
  if (overall >= 90) return { grade: 'A', gradeLabel: 'Pioneer' }
  if (overall >= 80) return { grade: 'B', gradeLabel: 'Strong' }
  if (overall >= 70) return { grade: 'C', gradeLabel: 'Promising' }
  if (overall >= 60) return { grade: 'D', gradeLabel: 'Developing' }
  return { grade: 'F', gradeLabel: 'Needs focus' }
}

export function scoreApplication(app: ApplicationRecord): ApplicationScore {
  const manual = app.manual_scores ?? {}
  const mcQuestions = questions.filter(q => q.type === 'mc')

  let mcCorrect = 0
  const mcByQuestion: Record<number, boolean | null> = {}

  for (const q of mcQuestions) {
    const key = mcAnswerKeys[q.id]
    if (!key) {
      mcByQuestion[q.id] = null
      continue
    }
    const isCorrect = normalizeAnswer(app.answers[q.id]) === key
    mcByQuestion[q.id] = isCorrect
    if (isCorrect) mcCorrect += 1
  }

  const mcTotal = Object.values(mcAnswerKeys).length
  const mcPercent = mcTotal === 0 ? 0 : Math.round((mcCorrect / mcTotal) * 100)

  const aiUnderstanding = percentCorrect([...MC_BY_DIMENSION.aiUnderstanding], app.answers)

  const businessApplication = blendScores([
    percentCorrect([...MC_BY_DIMENSION.businessApplication], app.answers),
    manualToPercent(manual.q25),
  ])

  const learningInitiative = blendScores([
    percentCorrect([...MC_BY_DIMENSION.learningInitiative], app.answers),
    manualToPercent(manual.q22),
    manualToPercent(manual.q27),
  ])

  const collaborationSharing = blendScores([
    percentCorrect([...MC_BY_DIMENSION.collaborationSharing], app.answers),
    manualToPercent(manual.q30),
  ])

  const dimensions = {
    learningInitiative,
    aiUnderstanding,
    businessApplication,
    collaborationSharing,
  }

  const openReviewComplete = openQuestionIds.every(id => manual[`q${id}` as keyof ManualScores] !== undefined)

  const overallComplete = openReviewComplete
  const overall = overallComplete
    ? Math.round(
        dimensions.learningInitiative * JUDGING_WEIGHTS.learningInitiative +
          dimensions.aiUnderstanding * JUDGING_WEIGHTS.aiUnderstanding +
          dimensions.businessApplication * JUDGING_WEIGHTS.businessApplication +
          dimensions.collaborationSharing * JUDGING_WEIGHTS.collaborationSharing,
      )
    : null

  const gradeInfo = overall !== null ? gradeFromOverall(overall) : { grade: null, gradeLabel: null }

  return {
    mcCorrect,
    mcTotal,
    mcPercent,
    mcByQuestion,
    dimensions,
    overall,
    overallComplete,
    openReviewComplete,
    grade: gradeInfo.grade,
    gradeLabel: gradeInfo.gradeLabel,
  }
}

export type ScoredApplication = ApplicationRecord & { score: ApplicationScore }

export function withScores(apps: ApplicationRecord[]): ScoredApplication[] {
  return apps.map(app => ({ ...app, score: scoreApplication(app) }))
}
