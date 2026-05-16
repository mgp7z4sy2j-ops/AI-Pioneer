import { describe, expect, it } from 'vitest'
import { getCountdownParts, REGISTRATION_DEADLINE_ISO } from '../src/lib/countdown'

describe('registration countdown', () => {
  it('uses the GMT+4 registration deadline', () => {
    expect(REGISTRATION_DEADLINE_ISO).toBe('2026-05-29T23:59:59+04:00')
  })

  it('returns remaining days, hours, minutes, and seconds', () => {
    const now = new Date('2026-05-28T22:58:57+04:00')
    const deadline = new Date(REGISTRATION_DEADLINE_ISO)

    expect(getCountdownParts(deadline, now)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 2,
      isExpired: false,
    })
  })

  it('clamps expired countdowns to zero', () => {
    const now = new Date('2026-05-30T00:00:00+04:00')
    const deadline = new Date(REGISTRATION_DEADLINE_ISO)

    expect(getCountdownParts(deadline, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    })
  })
})
