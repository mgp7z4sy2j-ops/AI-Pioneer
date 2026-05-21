import { describe, expect, it } from 'vitest'
import { scoreApplication } from '../src/lib/scoring'
import type { ApplicationRecord } from '../src/lib/application-types'
import { mcAnswerKeys } from '../src/data/answer-keys'

function buildApp(overrides: Partial<ApplicationRecord> = {}): ApplicationRecord {
  const answers = Object.fromEntries(
    Object.keys(mcAnswerKeys).map(id => [Number(id), mcAnswerKeys[Number(id)]]),
  )
  return {
    id: 'test-id',
    name: 'Test User',
    phone: '+852 0000 0000',
    company_email: 'test@startrader.com',
    answers: {
      ...answers,
      22: 'Improve reporting workflows.',
      25: 'Data privacy and compliance.',
      27: 'Mentor junior teammates.',
      30: 'Grow AI skills for the team.',
    },
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

describe('scoreApplication', () => {
  it('scores all MC questions correct at 100%', () => {
    const score = scoreApplication(buildApp())
    expect(score.mcCorrect).toBe(26)
    expect(score.mcPercent).toBe(100)
    expect(score.dimensions.aiUnderstanding).toBe(100)
  })

  it('marks overall pending until open questions are reviewed', () => {
    const score = scoreApplication(buildApp())
    expect(score.overall).toBeNull()
    expect(score.overallComplete).toBe(false)
  })

  it('computes weighted overall when manual scores are complete', () => {
    const score = scoreApplication(
      buildApp({
        manual_scores: { q22: 5, q25: 5, q27: 5, q30: 5 },
      }),
    )
    expect(score.overall).toBe(100)
    expect(score.grade).toBe('A')
    expect(score.gradeLabel).toBe('Pioneer')
  })

  it('reduces MC percent when answers are wrong', () => {
    const app = buildApp()
    app.answers[1] = 'B'
    const score = scoreApplication(app)
    expect(score.mcCorrect).toBe(25)
    expect(score.mcPercent).toBe(96)
  })
})
