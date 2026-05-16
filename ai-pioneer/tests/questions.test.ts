import { describe, it, expect } from 'vitest'
import { questions } from '../src/data/questions'

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
