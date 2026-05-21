export const ADMIN_SESSION_NAME = 'ai-pioneer-admin'

export type AdminSessionData = {
  email: string
  role: 'admin'
}

export function getAdminSessionConfig() {
  const password = process.env.SESSION_SECRET ?? 'dev-only-change-in-production-32chars!!'
  return {
    password,
    name: ADMIN_SESSION_NAME,
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    },
  }
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@startrader.com').trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme'
  return email.trim().toLowerCase() === adminEmail && password === adminPassword
}
