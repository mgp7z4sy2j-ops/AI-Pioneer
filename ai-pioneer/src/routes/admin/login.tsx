import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { adminLogin, getAdminSession } from '@/server/admin'

export const Route = createFileRoute('/admin/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/admin',
  }),
  beforeLoad: async () => {
    const session = await getAdminSession()
    if (session) {
      throw redirect({ to: '/admin' })
    }
  },
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await adminLogin({ data: { email, password } })
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast.success('Signed in')
      await router.invalidate()
      await router.navigate({ to: redirectTo as '/admin' })
    } catch {
      setError('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-trust flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-navy/80 backdrop-blur-md shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="text-cyan text-xs font-semibold uppercase tracking-[0.25em] mb-3">Internal</p>
            <h1 className="text-2xl font-black text-white">Admin Console</h1>
            <p className="text-mist/70 text-sm mt-2">STARTRADER AI Pioneer Program</p>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-mist">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@startrader.com"
                className="bg-white/5 border-white/15 text-white placeholder:text-mist/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-mist">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white/5 border-white/15 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan text-navy font-bold hover:bg-cyan/90"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-mist/50 text-xs mt-6">
            <Link to="/" className="text-cyan/80 hover:text-cyan transition-colors">
              ← Back to program page
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
