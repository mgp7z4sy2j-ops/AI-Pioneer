import { describe, it, expect } from 'vitest'
import { applicationSchema, personalInfoSchema } from '../src/lib/schema'

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

  it('accepts STARTRADER and STARPRIME company email domains only', () => {
    expect(applicationSchema.safeParse({ ...validData, company_email: 'jane@startrader.com' }).success).toBe(true)
    expect(applicationSchema.safeParse({ ...validData, company_email: 'jane@starprime.com' }).success).toBe(true)
    expect(applicationSchema.safeParse({ ...validData, company_email: 'jane@gmail.com' }).success).toBe(false)
  })

  it('rejects empty phone', () => {
    expect(applicationSchema.safeParse({ ...validData, phone: '' }).success).toBe(false)
  })

  it('rejects answers missing question 5', () => {
    const without5 = { ...validAnswers }
    delete (without5 as Record<number, string>)[5]
    expect(applicationSchema.safeParse({ ...validData, answers: without5 }).success).toBe(false)
  })

  it('rejects open answer exceeding 2000 chars', () => {
    const tooLong = { ...validAnswers, 22: 'x'.repeat(2001) }
    expect(applicationSchema.safeParse({ ...validData, answers: tooLong }).success).toBe(false)
  })
})

describe('personalInfoSchema', () => {
  it('accepts complete personal info with allowed company email domains', () => {
    expect(personalInfoSchema.safeParse({
      name: 'Jane Smith',
      phone: '+852 9000 0000',
      company_email: 'jane@starprime.com',
    }).success).toBe(true)
  })

  it('rejects missing personal info and non-company email domains', () => {
    expect(personalInfoSchema.safeParse({
      name: '',
      phone: '+852 9000 0000',
      company_email: 'jane@startrader.com',
    }).success).toBe(false)
    expect(personalInfoSchema.safeParse({
      name: 'Jane Smith',
      phone: '',
      company_email: 'jane@startrader.com',
    }).success).toBe(false)
    expect(personalInfoSchema.safeParse({
      name: 'Jane Smith',
      phone: '+852 9000 0000',
      company_email: 'jane@example.com',
    }).success).toBe(false)
  })
})
