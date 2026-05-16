export const REGISTRATION_DEADLINE_ISO = '2026-05-29T23:59:59+04:00'

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function getCountdownParts(deadline: Date, now = new Date()): CountdownParts {
  const remainingSeconds = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000))

  return {
    days: Math.floor(remainingSeconds / 86_400),
    hours: Math.floor((remainingSeconds % 86_400) / 3_600),
    minutes: Math.floor((remainingSeconds % 3_600) / 60),
    seconds: remainingSeconds % 60,
    isExpired: deadline.getTime() <= now.getTime(),
  }
}
