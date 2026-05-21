import { createServerFn } from '@tanstack/react-start'
import {
  clearSession,
  getSession,
  updateSession,
} from '@tanstack/react-start/server'
import { z } from 'zod'
import { scoreApplication, withScores } from '@/lib/scoring'
import { listApplications, updateApplicationManualScores } from '@/server/application-store'
import {
  type AdminSessionData,
  getAdminSessionConfig,
  verifyAdminCredentials,
} from '@/lib/admin-auth'
import { questions } from '@/data/questions'

const loginInput = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const getAdminSession = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession<AdminSessionData>(getAdminSessionConfig())
  if (!session.data?.email || session.data.role !== 'admin') {
    return null
  }
  return { email: session.data.email }
})

export const adminLogin = createServerFn({ method: 'POST' })
  .inputValidator(loginInput)
  .handler(async ({ data }) => {
    if (!verifyAdminCredentials(data.email, data.password)) {
      return { ok: false as const, error: 'Invalid email or password' }
    }

    await updateSession<AdminSessionData>(getAdminSessionConfig(), {
      email: data.email.trim().toLowerCase(),
      role: 'admin',
    })

    return { ok: true as const }
  })

export const adminLogout = createServerFn({ method: 'POST' }).handler(async () => {
  await clearSession(getAdminSessionConfig())
  return { ok: true as const }
})

export const fetchApplications = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession<AdminSessionData>(getAdminSessionConfig())
  if (!session.data?.email || session.data.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const apps = await listApplications()
  return withScores(apps)
})

const manualScoresInput = z.object({
  applicationId: z.string().uuid(),
  manual_scores: z.object({
    q22: z.number().min(0).max(5).optional(),
    q25: z.number().min(0).max(5).optional(),
    q27: z.number().min(0).max(5).optional(),
    q30: z.number().min(0).max(5).optional(),
  }),
})

export const saveManualScores = createServerFn({ method: 'POST' })
  .inputValidator(manualScoresInput)
  .handler(async ({ data }) => {
    const session = await getSession<AdminSessionData>(getAdminSessionConfig())
    if (!session.data?.email || session.data.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    const updated = await updateApplicationManualScores(data.applicationId, data.manual_scores)
    if (!updated) {
      return { ok: false as const, error: 'Application not found' }
    }

    return { ok: true as const, application: { ...updated, score: scoreApplication(updated) } }
  })

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export const exportApplicationsCsv = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSession<AdminSessionData>(getAdminSessionConfig())
  if (!session.data?.email || session.data.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const apps = withScores(await listApplications())
  const baseHeaders = [
    'id',
    'name',
    'phone',
    'company_email',
    'created_at',
    'mc_score',
    'overall_score',
    'grade',
    'learning_initiative',
    'ai_understanding',
    'business_application',
    'collaboration_sharing',
    'open_review_complete',
    'manual_q22',
    'manual_q25',
    'manual_q27',
    'manual_q30',
  ]
  const questionHeaders = questions.map(q => `Q${q.id}`)
  const headers = [...baseHeaders, ...questionHeaders]

  const rows = apps.map(app => {
    const s = app.score
    const base = [
      app.id,
      app.name,
      app.phone,
      app.company_email,
      app.created_at,
      `${s.mcCorrect}/${s.mcTotal}`,
      s.overall !== null ? String(s.overall) : '',
      s.grade ?? '',
      String(s.dimensions.learningInitiative),
      String(s.dimensions.aiUnderstanding),
      String(s.dimensions.businessApplication),
      String(s.dimensions.collaborationSharing),
      s.openReviewComplete ? 'yes' : 'no',
      app.manual_scores?.q22 !== undefined ? String(app.manual_scores.q22) : '',
      app.manual_scores?.q25 !== undefined ? String(app.manual_scores.q25) : '',
      app.manual_scores?.q27 !== undefined ? String(app.manual_scores.q27) : '',
      app.manual_scores?.q30 !== undefined ? String(app.manual_scores.q30) : '',
    ]
    const answers = questions.map(q => String(app.answers[q.id] ?? ''))
    return [...base, ...answers].map(escapeCsvCell).join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  return { filename: `ai-pioneer-applications-${new Date().toISOString().slice(0, 10)}.csv`, csv }
})
