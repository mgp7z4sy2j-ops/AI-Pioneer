import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mcAnswerKeys, openQuestionIds } from '@/data/answer-keys'
import { questions } from '@/data/questions'
import { JUDGING_WEIGHTS, type ScoredApplication } from '@/lib/scoring'
import { adminLogout, exportApplicationsCsv, fetchApplications, saveManualScores } from '@/server/admin'

export const Route = createFileRoute('/admin/')({
  loader: async () => {
    const applications = await fetchApplications()
    return { applications }
  },
  component: AdminDashboard,
})

type SortKey = 'score-desc' | 'score-asc' | 'date-desc' | 'mc-desc'

const OPEN_LABELS: Record<number, string> = {
  22: 'Q22 — Work improvement (Learning)',
  25: 'Q25 — AI adoption risk (Business)',
  27: 'Q27 — Extra hour use (Learning)',
  30: 'Q30 — Why join (Collaboration)',
}

function AdminDashboard() {
  const router = useRouter()
  const { applications } = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('score-desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = applications
    if (q) {
      list = list.filter(app =>
        [app.name, app.phone, app.company_email].some(field => field.toLowerCase().includes(q)),
      )
    }

    return [...list].sort((a, b) => {
      if (sort === 'date-desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      const aOverall = a.score.overall ?? -1
      const bOverall = b.score.overall ?? -1
      if (sort === 'score-desc') return bOverall - aOverall || b.score.mcPercent - a.score.mcPercent
      if (sort === 'score-asc') return aOverall - bOverall || a.score.mcPercent - b.score.mcPercent
      if (sort === 'mc-desc') return b.score.mcPercent - a.score.mcPercent
      return 0
    })
  }, [applications, query, sort])

  const avgMc =
    applications.length === 0
      ? '—'
      : `${Math.round(applications.reduce((s, a) => s + a.score.mcPercent, 0) / applications.length)}%`

  async function handleLogout() {
    await adminLogout()
    await router.invalidate()
    await router.navigate({ to: '/admin/login' })
  }

  async function handleExport() {
    setExporting(true)
    try {
      const { filename, csv } = await exportApplicationsCsv()
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-navy">
      <header className="border-b border-white/10 bg-navy/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-cyan text-xs font-semibold uppercase tracking-[0.2em]">Admin</p>
            <h1 className="text-xl font-black text-white">Applications & Scoring</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || applications.length === 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {exporting ? 'Exporting…' : 'Export CSV'}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard label="Submissions" value={String(applications.length)} />
          <StatCard label="Avg MC score" value={avgMc} />
          <StatCard
            label="Fully scored"
            value={String(applications.filter(a => a.score.overallComplete).length)}
          />
          <StatCard
            label="Pending open review"
            value={String(applications.filter(a => !a.score.openReviewComplete).length)}
          />
        </div>

        <div className="rounded-xl border border-cyan/20 bg-cyan/5 px-4 py-3 text-sm text-mist/90">
          <span className="text-cyan font-semibold">Scoring:</span> 26 MC auto-scored · 4 open questions
          manual (0–5) · Overall = Learning 30% + AI 20% + Business 30% + Collaboration 20%
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, phone, or email…"
              className="max-w-md bg-white/5 border-white/15 text-white placeholder:text-mist/40"
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="h-10 rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white"
            >
              <option value="score-desc">Sort: Overall (high → low)</option>
              <option value="score-asc">Sort: Overall (low → high)</option>
              <option value="mc-desc">Sort: MC score</option>
              <option value="date-desc">Sort: Newest first</option>
            </select>
          </div>
          <Link to="/" className="text-sm text-cyan/80 hover:text-cyan">
            View public page →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center text-mist/70">
            {applications.length === 0
              ? 'No applications yet. Submissions from the landing page will appear here.'
              : 'No applications match your search.'}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-mist/80 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">MC</th>
                    <th className="px-4 py-3 font-semibold">Overall</th>
                    <th className="px-4 py-3 font-semibold">Grade</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Submitted</th>
                    <th className="px-4 py-3 font-semibold w-24" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map(app => (
                    <ApplicationRow
                      key={app.id}
                      app={app}
                      expanded={expandedId === app.id}
                      onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      onSaved={async () => {
                        await router.invalidate()
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-mist/60 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white text-2xl font-bold mt-1 truncate">{value}</p>
    </div>
  )
}

function ScoreBadge({ percent, pending }: { percent: number | null; pending?: boolean }) {
  if (pending || percent === null) {
    return <span className="text-mist/50 text-xs">Pending</span>
  }
  const color =
    percent >= 90 ? 'text-cyan' : percent >= 70 ? 'text-white' : percent >= 60 ? 'text-mist' : 'text-red-300'
  return <span className={`font-bold tabular-nums ${color}`}>{percent}</span>
}

function GradeBadge({ grade, label }: { grade: string | null; label: string | null }) {
  if (!grade) return <span className="text-mist/50">—</span>
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-black text-cyan">{grade}</span>
      <span className="text-mist/60 text-xs">{label}</span>
    </span>
  )
}

function DimensionBar({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-mist">{label}</span>
        <span className="text-white font-medium">
          {value}
          <span className="text-mist/50 ml-1">({Math.round(weight * 100)}%)</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-cyan/80 rounded-full transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ApplicationRow({
  app,
  expanded,
  onToggle,
  onSaved,
}: {
  app: ScoredApplication
  expanded: boolean
  onToggle: () => void
  onSaved: () => Promise<void>
}) {
  const { score } = app
  const [draft, setDraft] = useState(() => ({
    q22: app.manual_scores?.q22 ?? '',
    q25: app.manual_scores?.q25 ?? '',
    q27: app.manual_scores?.q27 ?? '',
    q30: app.manual_scores?.q30 ?? '',
  }))
  const [saving, setSaving] = useState(false)

  async function handleSaveManual() {
    const manual_scores: Record<string, number> = {}
    for (const id of openQuestionIds) {
      const key = `q${id}` as keyof typeof draft
      const raw = draft[key]
      if (raw === '') continue
      const num = Number(raw)
      if (Number.isNaN(num) || num < 0 || num > 5) {
        toast.error(`Q${id} score must be 0–5`)
        return
      }
      manual_scores[key] = num
    }

    setSaving(true)
    try {
      const result = await saveManualScores({
        data: { applicationId: app.id, manual_scores },
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success('Scores saved')
      await onSaved()
    } catch {
      toast.error('Failed to save scores')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <tr className="hover:bg-white/5 transition-colors">
        <td className="px-4 py-3 text-white font-medium">{app.name}</td>
        <td className="px-4 py-3">
          <span className="text-white font-bold tabular-nums">{score.mcPercent}</span>
          <span className="text-mist/50 text-xs ml-1">
            ({score.mcCorrect}/{score.mcTotal})
          </span>
        </td>
        <td className="px-4 py-3">
          <ScoreBadge percent={score.overall} pending={!score.overallComplete} />
        </td>
        <td className="px-4 py-3">
          <GradeBadge grade={score.grade} label={score.gradeLabel} />
        </td>
        <td className="px-4 py-3 text-mist">{app.company_email}</td>
        <td className="px-4 py-3 text-mist whitespace-nowrap">
          {new Date(app.created_at).toLocaleString()}
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="text-cyan text-xs font-semibold hover:underline"
          >
            {expanded ? 'Hide' : 'Score'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 py-5 bg-white/[0.03]">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Dimension scores</h3>
                <DimensionBar
                  label="Learning Initiative"
                  value={score.dimensions.learningInitiative}
                  weight={JUDGING_WEIGHTS.learningInitiative}
                />
                <DimensionBar
                  label="AI Understanding"
                  value={score.dimensions.aiUnderstanding}
                  weight={JUDGING_WEIGHTS.aiUnderstanding}
                />
                <DimensionBar
                  label="Business Application"
                  value={score.dimensions.businessApplication}
                  weight={JUDGING_WEIGHTS.businessApplication}
                />
                <DimensionBar
                  label="Collaboration & Sharing"
                  value={score.dimensions.collaborationSharing}
                  weight={JUDGING_WEIGHTS.collaborationSharing}
                />
                {score.overall !== null && (
                  <p className="text-cyan text-lg font-black pt-2">
                    Overall: {score.overall} · {score.grade} ({score.gradeLabel})
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                  Open question review (0–5)
                </h3>
                {openQuestionIds.map(id => {
                  const key = `q${id}` as keyof typeof draft
                  const q = questions.find(item => item.id === id)
                  return (
                    <div key={id} className="space-y-1">
                      <label className="text-xs text-mist block" htmlFor={`${app.id}-q${id}`}>
                        {OPEN_LABELS[id]}
                      </label>
                      <p className="text-mist/70 text-xs line-clamp-2">{q?.text}</p>
                      <input
                        id={`${app.id}-q${id}`}
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        value={draft[key]}
                        onChange={e => setDraft(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-20 h-9 rounded-md border border-white/15 bg-white/5 px-2 text-white text-sm"
                        placeholder="0–5"
                      />
                    </div>
                  )
                })}
                <Button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveManual}
                  className="bg-cyan text-navy font-bold hover:bg-cyan/90"
                >
                  {saving ? 'Saving…' : 'Save manual scores'}
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
                MC answer key check
              </h3>
              <div className="grid gap-1.5 max-h-48 overflow-y-auto text-xs font-mono">
                {questions
                  .filter(q => q.type === 'mc')
                  .map(q => {
                    const ok = score.mcByQuestion[q.id]
                    const given = String(app.answers[q.id] ?? '—')
                    const key = score.mcByQuestion[q.id] === null ? '—' : (ok ? '✓' : '✗')
                    return (
                      <div
                        key={q.id}
                        className={`flex gap-2 ${ok === true ? 'text-cyan/90' : ok === false ? 'text-red-300/90' : 'text-mist/50'}`}
                      >
                        <span className="w-8 shrink-0">Q{q.id}</span>
                        <span className="w-6 shrink-0">{key}</span>
                        <span className="text-mist/60">
                          {given}
                          {ok === false && ` (key: ${mcAnswerKeys[q.id] ?? '?'})`}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
