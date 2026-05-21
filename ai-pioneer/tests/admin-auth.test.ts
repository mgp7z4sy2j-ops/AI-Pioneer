import { describe, it, expect, beforeEach } from 'vitest'
import { verifyAdminCredentials } from '../src/lib/admin-auth'

describe('verifyAdminCredentials', () => {
  const env = process.env

  beforeEach(() => {
    process.env = { ...env }
    delete process.env.ADMIN_EMAIL
    delete process.env.ADMIN_PASSWORD
  })

  it('accepts default dev credentials', () => {
    expect(verifyAdminCredentials('admin@startrader.com', 'changeme')).toBe(true)
  })

  it('is case-insensitive for email', () => {
    expect(verifyAdminCredentials('Admin@STARTRADER.COM', 'changeme')).toBe(true)
  })

  it('rejects wrong password', () => {
    expect(verifyAdminCredentials('admin@startrader.com', 'wrong')).toBe(false)
  })

  it('uses env overrides when set', () => {
    process.env.ADMIN_EMAIL = 'judge@starprime.com'
    process.env.ADMIN_PASSWORD = 'secret123'
    expect(verifyAdminCredentials('judge@starprime.com', 'secret123')).toBe(true)
    expect(verifyAdminCredentials('admin@startrader.com', 'secret123')).toBe(false)
  })
})
