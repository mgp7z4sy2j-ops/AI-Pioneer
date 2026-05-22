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
