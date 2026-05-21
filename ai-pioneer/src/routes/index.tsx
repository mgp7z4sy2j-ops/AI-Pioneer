import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { questions } from '@/data/questions'
import { getCountdownParts, REGISTRATION_DEADLINE_ISO, type CountdownParts } from '@/lib/countdown'
import { applicationSchema, personalInfoSchema } from '@/lib/schema'
import { submitApplication } from '@/server/applications'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <OfferSection />
      <JourneySection />
      <JudgesSection />
      <AwardsSection />
      <ApplicationForm />
      <FooterSection />
    </main>
  )
}

const PILLARS = [
  {
    title: 'Curiosity About AI',
    desc: "You ask questions others haven't thought to ask yet.",
    insight: 'Signals someone who will explore beyond prompts and discover practical use cases.',
  },
  {
    title: 'Strong Learning Motivation',
    desc: 'Self-driven to explore, experiment, and grow — no prodding needed.',
    insight: 'Keeps momentum through ambiguity, new tools, and fast-changing AI workflows.',
  },
  {
    title: 'Innovation Mindset',
    desc: 'You see workflows as opportunities to rethink, not just repeat.',
    insight: 'Turns routine work into better systems, smarter processes, and measurable improvements.',
  },
  {
    title: 'Willingness to Explore',
    desc: 'Comfortable testing new tools, sharing findings, and iterating openly.',
    insight: 'Builds confidence through experimentation instead of waiting for perfect answers.',
  },
  {
    title: 'Transformation Potential',
    desc: "You want to help shape STARTRADER's AI-first future from the inside.",
    insight: 'Connects personal growth with the company-wide shift toward AI-enabled work.',
  },
  {
    title: 'Knowledge Sharing',
    desc: 'You turn experiments into practical lessons that help teammates move faster.',
    insight: 'Multiplies individual learning into team capability and stronger internal adoption.',
  },
]

function PillarsSection() {
  const [activePillar, setActivePillar] = useState(0)

  return (
    <section className="relative bg-navy py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-cyan/40 to-transparent" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-cyan text-xs font-semibold uppercase tracking-[0.25em] mb-4 block">Who We Select</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 md:mb-4">6 Qualities.</h2>
          <p className="text-gradient-static text-4xl sm:text-5xl md:text-6xl font-black">Not a Job Title.</p>
          <p className="text-mist/70 text-base md:text-lg mt-5 md:mt-6 max-w-xl mx-auto">Any department, any seniority — what matters is how you think.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((p, i) => {
            const isActive = activePillar === i

            return (
              <button
                key={p.title}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActivePillar(i)}
                onFocus={() => setActivePillar(i)}
                onMouseEnter={() => setActivePillar(i)}
                className={`group relative overflow-hidden rounded-xl p-5 sm:p-7 text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan/[0.08] border border-cyan/45 shadow-[0_0_34px_rgba(22,233,215,0.18),0_18px_44px_rgba(0,0,0,0.35)] -translate-y-1'
                    : 'glass-card-hover border-white/15 bg-white/[0.04] opacity-75 hover:opacity-100'
                }`}
              >
                <div className={`absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-cyan/15 to-transparent transition-transform duration-700 ${
                  isActive ? 'translate-x-[320%]' : 'translate-x-0'
                }`} />
                <div className={`relative text-5xl sm:text-6xl font-black leading-none mb-4 select-none transition-all duration-300 ${
                  isActive ? 'text-cyan text-glow-cyan' : 'text-cyan/65 group-hover:text-cyan/90'
                }`}>
                  0{i + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-wide">{p.title}</h3>
                <p className="text-mist/85 text-sm leading-relaxed">{p.desc}</p>
                <div className={`grid transition-all duration-300 ${
                  isActive ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}>
                  <div className="overflow-hidden">
                    <div className="h-px bg-gradient-to-r from-cyan/60 via-white/10 to-transparent mb-4" />
                    <p className="text-cyan/90 text-xs font-semibold uppercase tracking-[0.2em] mb-2">Why it matters</p>
                    <p className="text-mist/80 text-sm leading-relaxed">{p.insight}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const OFFER_ITEMS = [
  {
    title: 'Enterprise AI Accounts',
    desc: 'Company-sponsored model access ready for serious experimentation.',
  },
  {
    title: 'Advanced Sandboxes',
    desc: 'Test workflows, prompts, and automations in a supported AI environment.',
  },
  {
    title: 'Learning Resources',
    desc: 'Internal guides, training materials, and practical AI playbooks.',
  },
  {
    title: 'Future Project Priority',
    desc: 'Stand out for upcoming AI initiatives and transformation projects.',
  },
]

function OfferSection() {
  return (
    <section className="relative bg-deep-blue py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-cyan/5 to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-cyan text-xs font-semibold uppercase tracking-[0.25em] mb-4 block">What You Get</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white">Your AI Toolkit.</h2>
          <p className="text-gradient-static text-4xl sm:text-5xl md:text-6xl font-black leading-tight pb-2">Fully Sponsored.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(22,233,215,0.08),transparent_35%,rgba(255,255,255,0.04)_65%,transparent)] pointer-events-none" />
            <div className="relative mb-5 flex items-center justify-between">
              <div>
                <p className="text-cyan text-xs font-bold uppercase tracking-[0.25em]">Access Stack</p>
                <p className="text-mist/60 text-sm mt-1">Everything included from day one</p>
              </div>
              <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10">
                <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_rgba(22,233,215,0.9)]" />
              </div>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OFFER_ITEMS.map((item, i) => (
                <div key={item.title} className="group relative min-h-36 sm:min-h-40 overflow-hidden rounded-2xl border border-white/10 bg-navy/35 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:bg-cyan/[0.06] hover:shadow-[0_0_28px_rgba(22,233,215,0.14)]">
                  <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-cyan/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-40" />
                  <div className="relative mb-6 flex items-center justify-between">
                    <span className="text-cyan/80 text-sm font-black tracking-widest">0{i + 1}</span>
                    <span className="h-px w-12 bg-gradient-to-r from-cyan/60 to-transparent" />
                  </div>
                  <h3 className="relative text-white text-lg font-bold leading-tight">{item.title}</h3>
                  <p className="relative mt-3 text-mist/75 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-cyan/30 bg-gradient-to-br from-cyan/15 via-white/[0.04] to-blue/20 p-6 md:p-8 shadow-[0_0_50px_rgba(22,233,215,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(22,233,215,0.22),transparent_38%)]" />
            <div className="absolute left-8 right-8 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
            <div className="absolute bottom-8 top-8 left-1/2 w-px bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan/20 blur-3xl" />
            <div className="absolute -bottom-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-blue/30 blur-3xl" />
            <div className="relative flex min-h-[360px] md:min-h-[428px] flex-col">
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan">
                  Program Access
                </span>
                <span className="text-mist/50 text-xs font-semibold">2026</span>
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="relative flex h-52 w-52 sm:h-64 sm:w-64 items-center justify-center rounded-full border border-cyan/35 bg-navy/45 shadow-[0_0_48px_rgba(22,233,215,0.24),inset_0_0_44px_rgba(22,233,215,0.12)]">
                  <div className="absolute inset-5 rounded-full border border-dashed border-cyan/25 animate-spin" style={{animationDuration: '18s'}} />
                  <div className="absolute inset-12 rounded-full border border-white/10" />
                  <div className="text-center">
                    <div className="text-cyan font-black text-glow-cyan" style={{fontSize: 'clamp(5rem, 28vw, 7rem)', lineHeight: 0.85}}>2</div>
                    <div className="text-white text-sm font-black uppercase tracking-[0.35em]">Months</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-white text-xl font-bold leading-snug">Enterprise AI access, fully sponsored.</p>
                <p className="mx-auto mt-3 max-w-md text-mist/75 text-sm leading-relaxed">
                  Use the tools top AI teams rely on, then turn experiments into real workflow wins.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-cyan text-xs font-bold uppercase tracking-widest">Sandbox</div>
                  <div className="text-mist/70 text-xs mt-1">Explore freely</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-cyan text-xs font-bold uppercase tracking-widest">Support</div>
                  <div className="text-mist/70 text-xs mt-1">Company backed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const JOURNEY_STEPS = [
  { num: 1, title: 'Application & Assessment', desc: 'Complete the 30-question AI assessment and submit your application.' },
  { num: 2, title: 'Selected Candidates', desc: 'The judging panel reviews all submissions and selects participants.' },
  { num: 3, title: 'AI Account Access Granted', desc: 'Selected candidates receive access to enterprise AI accounts.' },
  { num: 4, title: '2-Month Exploration Phase', desc: 'Explore, experiment, and build real AI workflows in your daily work.' },
  { num: 5, title: 'AI Use Case Submission', desc: 'Submit your most impactful AI use case and learning reflections.' },
  { num: 6, title: 'AI Champion Selection', desc: 'The judging panel evaluates submissions across four dimensions.' },
  { num: 7, title: 'Advanced Internal AI Projects', desc: 'Champions join exclusive, high-impact AI projects at STARTRADER.' },
]

function JourneySection() {
  return (
    <section className="relative bg-navy py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan/8 blur-[120px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-cyan text-xs font-semibold uppercase tracking-[0.25em] mb-4 block">The Process</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2">7 Steps.</h2>
          <p className="text-gradient-static text-4xl sm:text-5xl md:text-6xl font-black leading-tight pb-2">Curious to Champion.</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/30 to-transparent" />
          <div className="absolute left-6 md:left-1/2 top-0 h-28 w-px bg-gradient-to-b from-transparent via-cyan to-transparent shadow-[0_0_24px_rgba(22,233,215,0.9)] animate-pulse" />

          <div className="space-y-6">
            {JOURNEY_STEPS.map((step, i) => {
              const isRight = i % 2 === 1
              const isFinal = i === JOURNEY_STEPS.length - 1

              return (
                <div key={step.num} className="relative min-h-32">
                  <div className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cyan/45 bg-navy shadow-[0_0_24px_rgba(22,233,215,0.22)] md:left-1/2 md:-translate-x-1/2">
                    <span className="absolute h-16 w-16 rounded-full border border-cyan/15" />
                    <span className="text-cyan text-sm font-black text-glow-cyan">{step.num}</span>
                  </div>
                  <div className={`timeline-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] px-5 sm:px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:bg-cyan/[0.06] hover:shadow-[0_0_30px_rgba(22,233,215,0.14)] ${
                    isRight ? 'timeline-card-right' : 'timeline-card-left'
                  }`}>
                    <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-cyan/10 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />
                    <div className="relative flex items-center gap-3 mb-2">
                      <span className="text-cyan/70 text-xs font-black uppercase tracking-[0.25em]">Phase {step.num}</span>
                      {isFinal && <span className="text-xs bg-cyan/15 text-cyan border border-cyan/25 rounded-full px-2 py-0.5 font-semibold">Final</span>}
                    </div>
                    <h3 className="relative text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="relative text-mist/78 text-sm leading-relaxed">{step.desc}</p>
                    <div className="relative mt-4 flex items-center gap-2 text-cyan/70 text-xs font-semibold uppercase tracking-[0.18em]">
                      <span className="h-px w-8 bg-cyan/40" />
                      {isFinal ? 'Champion track' : 'Next milestone'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const JUDGING_CRITERIA = [
  { label: 'Learning Initiative', weight: '30%', desc: 'Depth and consistency of exploration during the program.' },
  { label: 'AI Understanding', weight: '20%', desc: 'Quality and accuracy of AI knowledge demonstrated.' },
  { label: 'Business Application', weight: '30%', desc: 'Real, measurable impact in your day-to-day work.' },
  { label: 'Collaboration & Sharing', weight: '20%', desc: 'Contributing insights back to the broader STARTRADER community.' },
]

function JudgesSection() {
  return (
    <section className="relative bg-ink py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-cyan text-sm font-black uppercase tracking-[0.3em] mb-4 block text-glow-cyan">Judging Panel</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight">Reviewed by</h2>
          <p className="text-gradient-static text-4xl sm:text-5xl md:text-7xl font-black leading-tight pb-2">the Best.</p>
        </div>

        {/* Peter Karsten — spotlight feature */}
        <div
          className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 mb-12 md:mb-16 max-w-5xl mx-auto relative"
        >
          <div className="absolute left-24 bottom-10 h-56 w-56 rounded-full bg-cyan/10 blur-[120px] pointer-events-none" />
          <div className="absolute right-24 top-24 h-48 w-48 rounded-full bg-blue/15 blur-[120px] pointer-events-none" />
          <div className="flex-shrink-0 w-full md:w-[24rem] flex justify-center md:justify-start relative">
            <img
              src="/peter-karsten.png"
              alt="Peter Karsten, STARTRADER CEO"
              className="h-[22rem] sm:h-[26rem] md:h-[30rem] w-auto object-contain object-bottom relative z-10 drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
            />
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-ink via-ink/50 to-transparent pointer-events-none" />
          </div>
          <div className="flex-1 px-2 pb-8 md:pb-16 relative z-10 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-cyan/10 rounded-full px-4 py-1.5 text-cyan text-xs font-black uppercase tracking-[0.22em] mb-6 shadow-[0_0_24px_rgba(22,233,215,0.12)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              Lead Judge
            </span>
            <h3 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-3 leading-none tracking-tight">Peter<br/>Karsten</h3>
            <p className="text-cyan font-black text-lg sm:text-xl mb-5 md:mb-6 text-glow-cyan tracking-wide">STARTRADER CEO</p>
            <p className="text-mist/80 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0 font-medium">
              Peter personally reviews all AI Pioneer applications and selects participants based on learning potential, business mindset, and genuine curiosity about AI.
            </p>
          </div>
        </div>

        {/* Criteria grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {JUDGING_CRITERIA.map(c => (
            <div key={c.label} className="rounded-2xl bg-white/[0.06] p-6 text-center shadow-[0_18px_48px_rgba(0,0,0,0.16)]">
              <div className="text-cyan font-black text-glow-cyan mb-3" style={{fontSize: '3rem', lineHeight: 1}}>{c.weight}</div>
              <h3 className="text-white font-black text-lg mb-3 leading-tight">{c.label}</h3>
              <p className="text-mist/80 text-sm font-semibold leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AwardsSection() {
  return (
    <section className="hero-bg relative py-20 md:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      {/* Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan/6 rounded-full blur-[160px] pointer-events-none animate-float" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 bg-cyan/15 border border-cyan/30 rounded-full px-4 sm:px-5 py-2 text-cyan text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-8 md:mb-10">
          ★ Top Performers Only
        </span>

        <h2 className="font-black text-white leading-none mb-4">
          <span className="block" style={{fontSize: 'clamp(3rem, 10vw, 6rem)'}}>AI Leadership</span>
          <span className="text-gradient-cyan block" style={{fontSize: 'clamp(3rem, 10vw, 6rem)'}}>Award</span>
        </h2>

        <p className="text-mist/80 text-base sm:text-xl max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
          Outstanding participants become STARTRADER's inaugural cohort of{' '}
          <span className="text-white font-bold">AI Champions</span> — shaping our AI-first future from within.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10 md:mb-14">
          {[
            { icon: '🏆', title: 'Pioneer Award' },
            { icon: '🚀', title: 'Advanced Projects' },
            { icon: '⭐', title: 'AI Champion Status' },
          ].map(item => (
            <div key={item.title} className="glass-card rounded-xl p-5 sm:p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-white font-bold text-sm">{item.title}</div>
            </div>
          ))}
        </div>

        <button
          className="btn-pulse bg-cyan text-navy font-black text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 rounded-full hover:bg-cyan/90 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Apply to the Program →
        </button>
      </div>
    </section>
  )
}

const MC_SELECTED_OPTION_CLASS = 'border-cyan bg-cyan/20 text-white shadow-[0_0_28px_rgba(22,233,215,0.28)] ring-2 ring-cyan/45'
const MC_IDLE_OPTION_CLASS = 'border-mist/15 bg-ink/40 text-mist hover:border-mist/40 hover:bg-ink/60'

function MCQuestionCard({
  question,
  value,
  onChange,
}: {
  question: { id: number; text: string; options?: { value: string; label: string }[] }
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div id={`q-${question.id}`} className="space-y-3">
      <p className="text-white text-base font-medium">
        <span className="text-cyan font-bold mr-2">Q{question.id}.</span>
        {question.text}
      </p>
      <div className="space-y-2">
        {(question.options ?? []).map(opt => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-all duration-150 ${
              value === opt.value
                ? MC_SELECTED_OPTION_CLASS
                : MC_IDLE_OPTION_CLASS
            }`}
          >
            <span className={`font-bold mr-2 ${value === opt.value ? 'text-cyan' : 'text-graphite'}`}>
              {opt.value}.
            </span>
            {opt.label}
            {value === opt.value && (
              <span className="ml-3 rounded-full bg-cyan px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-navy">
                Selected
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function OpenQuestionCard({
  question,
  value,
  onChange,
}: {
  question: { id: number; text: string; maxLength?: number }
  value: string
  onChange: (val: string) => void
}) {
  const max = question.maxLength ?? 2000
  return (
    <div id={`q-${question.id}`} className="space-y-3">
      <p className="text-white text-base font-medium">
        <span className="text-cyan font-bold mr-2">Q{question.id}.</span>
        {question.text}
      </p>
      <div>
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={max}
          rows={4}
          placeholder="Write your answer here..."
          className="bg-navy border-mist/20 text-white placeholder:text-graphite focus:border-cyan resize-none"
        />
        <div className="text-right mt-1">
          <span className={`text-xs ${value.length > max * 0.9 ? 'text-sand' : 'text-graphite'}`}>
            {value.length} / {max}
          </span>
        </div>
      </div>
    </div>
  )
}

const ASSESSMENT_SECTION_CARD_CLASS = 'relative overflow-hidden rounded-2xl border border-cyan/15 bg-white/[0.04] p-5 sm:p-6 md:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]'
const PERSONAL_INFO_CARD_CLASS = 'space-y-6 rounded-2xl border border-cyan/20 bg-mist/95 p-5 sm:p-6 text-ink shadow-[0_24px_70px_rgba(218,227,237,0.16)]'
const PERSONAL_INFO_INPUT_CLASS = 'bg-white/90 border-ink/15 text-ink placeholder:text-graphite/70 focus:border-cyan focus:ring-cyan/20'
const SECTION_TITLES = {
  1: 'AI Fundamentals',
  2: 'AI Application & Business Thinking',
  3: 'Learning Motivation & Growth Potential',
} as const

function ApplicationForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [detailsSubmitted, setDetailsSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const answeredCount = useMemo(() => {
    return questions.filter(q => (answers[q.id] ?? '').trim().length > 0).length
  }, [answers])
  const progress = Math.round((answeredCount / questions.length) * 100)
  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion.id] ?? ''
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const allQuestionsAnswered = answeredCount === questions.length

  if (submitted) {
    return (
      <section id="apply" className="bg-navy py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-cyan text-7xl mb-6">✓</div>
          <h2 className="text-4xl font-bold text-white mb-4">Application Submitted</h2>
          <p className="text-mist text-lg leading-relaxed">
            Thank you for applying to the STARTRADER AI Pioneer Program. Your application
            will be reviewed by Peter and the STARTRADER AI expert team. We'll be in touch.
          </p>
        </div>
      </section>
    )
  }

  function handlePersonalInfoSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = personalInfoSchema.safeParse({ name, phone, company_email: email })
    if (!parsed.success) {
      toast.error('Please enter your name, phone number, and a STARTRADER or STARPRIME company email.')
      return
    }
    setDetailsSubmitted(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allQuestionsAnswered) {
      toast.error('Please answer all 30 questions before submitting.')
      return
    }
    const parsed = applicationSchema.safeParse({ name, phone, company_email: email, answers })
    if (!parsed.success) {
      const firstUnanswered = questions.find(q => !(answers[q.id] ?? '').trim())
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      toast.error('Please complete all required fields before submitting.')
      return
    }
    setSubmitting(true)
    try {
      await submitApplication({ data: parsed.data })
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function advanceToNextQuestion() {
    if (isLastQuestion) return
    const nextQuestionIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextQuestionIndex)
  }

  function handleQuestionAnswer(questionId: number, value: string, advanceAfterAnswer = false) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (advanceAfterAnswer && value.trim().length > 0) {
      advanceToNextQuestion()
    }
  }

  return (
    <section id="apply" className="bg-navy py-16 md:py-20 px-4 sm:px-6">
      <div className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-mist/10 py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 mb-8 md:mb-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-4">
          <span className="text-mist text-xs sm:text-sm flex-shrink-0">{detailsSubmitted ? 'Progress' : 'Step 1 of 2'}</span>
          <Progress value={progress} className="flex-1 h-2 bg-mist/10 [&>div]:bg-cyan" />
          <span className="text-cyan text-xs sm:text-sm font-medium flex-shrink-0">{progress}%</span>
        </div>
      </div>

      <form onSubmit={detailsSubmitted ? handleSubmit : handlePersonalInfoSubmit} className="max-w-2xl mx-auto space-y-8 md:space-y-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Apply to the Program</h2>
          <p className="text-mist text-base">Fill in your details and complete the 30-question AI assessment.</p>
        </div>

        <div className={PERSONAL_INFO_CARD_CLASS}>
          <h3 className="text-lg font-bold text-ink">Your Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-ink text-sm font-semibold mb-1.5 block">Full Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                className={PERSONAL_INFO_INPUT_CLASS} />
            </div>
            <div>
              <Label htmlFor="phone" className="text-ink text-sm font-semibold mb-1.5 block">Phone Number *</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+971 00 000 0000"
                className={PERSONAL_INFO_INPUT_CLASS} />
            </div>
            <div>
              <Label htmlFor="email" className="text-ink text-sm font-semibold mb-1.5 block">Company Email *</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jane@startrader.com or jane@starprime.com"
                className={PERSONAL_INFO_INPUT_CLASS} />
              <p className="text-graphite text-xs font-medium mt-1">Only @startrader.com and @starprime.com email addresses are accepted.</p>
            </div>
          </div>
        </div>

        {!detailsSubmitted ? (
          <Button type="submit"
            className="w-full bg-cyan text-navy font-bold py-3 rounded-md hover:bg-cyan/80 transition-colors">
            Submit Details & Start Assessment
          </Button>
        ) : (
          <>
            <div className={ASSESSMENT_SECTION_CARD_CLASS}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-cyan text-xs font-medium uppercase tracking-widest">Section {currentQuestion.section}</span>
              <h3 className="text-lg font-medium text-white mt-1">{SECTION_TITLES[currentQuestion.section]}</h3>
              <p className="text-graphite text-sm mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-bold text-cyan">
              {answeredCount} / {questions.length} answered
            </span>
          </div>
          <div className="mt-8">
            {currentQuestion.type === 'open' ? (
              <OpenQuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                value={currentAnswer}
                onChange={val => handleQuestionAnswer(currentQuestion.id, val)}
              />
            ) : (
              <MCQuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                value={currentAnswer}
                onChange={val => handleQuestionAnswer(currentQuestion.id, val, true)}
              />
            )}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-mist/10 pt-6">
            <Button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="w-full sm:w-auto bg-white/[0.06] text-mist hover:bg-white/[0.1] disabled:opacity-40"
            >
              Previous
            </Button>
            {currentQuestion.type === 'open' && !isLastQuestion ? (
              <Button
                type="button"
                disabled={!currentAnswer.trim()}
                onClick={advanceToNextQuestion}
                className="w-full sm:w-auto bg-cyan text-navy font-bold hover:bg-cyan/80 disabled:opacity-40"
              >
                Next Question
              </Button>
            ) : (
              <span className="text-center sm:text-right text-mist/60 text-sm">
                {allQuestionsAnswered ? 'All questions answered.' : 'Answer this question to continue.'}
              </span>
            )}
          </div>
            </div>

            <Button type="submit" disabled={submitting || !allQuestionsAnswered}
              className="w-full bg-cyan text-navy font-bold py-3 rounded-md hover:bg-cyan/80 disabled:opacity-50 transition-colors">
              {submitting ? 'Submitting...' : allQuestionsAnswered ? 'Submit Application' : `Answer ${questions.length - answeredCount} more question${questions.length - answeredCount === 1 ? '' : 's'} to submit`}
            </Button>
          </>
        )}
      </form>
    </section>
  )
}

function FooterSection() {
  return (
    <footer className="bg-navy border-t border-mist/10 py-10 md:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-8">
          <img
            src="/STARTRADER LOGO/WEB/STARTRADER_Primary_Logo_Inverted_RGB.png"
            alt="STARTRADER"
            className="h-14 sm:h-16 md:h-20 w-auto"
          />
          <p className="text-center text-mist/80 text-base md:text-lg italic">Built on Trust. Driven by Growth.</p>
        </div>
        <div className="border-t border-mist/10 pt-6 text-center">
          <p className="text-mist/80 text-xs mt-2">
            © {new Date().getFullYear()} STARTRADER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

const REGISTRATION_DEADLINE = new Date(REGISTRATION_DEADLINE_ISO)

const COUNTDOWN_UNITS: Array<{ key: keyof Omit<CountdownParts, 'isExpired'>; label: string }> = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
]

function HeroSection() {
  const [countdown, setCountdown] = useState<CountdownParts | null>(null)

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdownParts(REGISTRATION_DEADLINE))

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section className="hero-bg relative min-h-screen flex flex-col overflow-hidden">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan/8 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-blue/15 rounded-full blur-[100px] pointer-events-none" style={{animationDelay: '3s'}} />
      <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-cyan/5 rounded-full blur-[80px] pointer-events-none animate-float" style={{animationDelay: '1.5s'}} />

      {/* Nav */}
      <nav className="relative z-10 px-5 sm:px-8 py-5 sm:py-6 flex items-center max-w-7xl mx-auto w-full">
        <img
          src="/STARTRADER LOGO/WEB/STARTRADER_Primary_Logo_Inverted_RGB.png"
          alt="STARTRADER"
          className="h-14 sm:h-16 md:h-28 w-auto drop-shadow-[0_0_28px_rgba(0,212,255,0.35)]"
        />
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 sm:py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan/10 border border-cyan/30 rounded-full px-4 sm:px-5 py-2 mb-8 sm:mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          <span className="text-cyan text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em]">Internal Program · 2026</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-none tracking-tight max-w-5xl mb-6">
          <span className="text-white block">STARTRADER</span>
          <span className="text-gradient-cyan block">AI Pioneer</span>
          <span className="text-white block">Program</span>
        </h1>

        {/* Tagline */}
        <p className="text-cyan text-lg sm:text-xl md:text-2xl font-semibold mb-5 text-glow-cyan tracking-wide">
          Learn Faster. Think Bigger. Build Smarter.
        </p>
        <p className="text-mist/80 text-base sm:text-lg max-w-xl mb-10 sm:mb-12 leading-relaxed">
          A 2-month enterprise AI sandbox for STARTRADER's most curious minds —
          top performers earn the AI Leadership Award.
        </p>

        {/* CTA Button with glow */}
        <button
          className="btn-pulse bg-cyan text-navy font-black text-lg px-10 py-4 rounded-full hover:bg-cyan/90 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Apply to the Program →
        </button>

        {/* Registration countdown */}
        <div className="mt-8 w-full max-w-2xl glass-card rounded-2xl px-5 py-5 border-cyan/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div className="text-cyan text-xs font-semibold uppercase tracking-[0.25em]">
              {countdown?.isExpired ? 'Applications Closed' : 'Registration Countdown'}
            </div>
            <div className="text-mist/60 text-xs uppercase tracking-widest">
              Deadline: May 29, 2026 · 23:59:59 GMT+4
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {COUNTDOWN_UNITS.map(unit => (
              <div key={unit.key} className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-4">
                <div className="text-cyan font-black leading-none text-glow-cyan text-3xl md:text-4xl">
                  {countdown ? String(countdown[unit.key]).padStart(2, '0') : '--'}
                </div>
                <div className="text-mist/50 text-[10px] md:text-xs uppercase tracking-widest mt-2">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-0 mt-20 max-w-2xl w-full divide-x divide-white/10">
          {[
            { value: '2', unit: 'mo', label: 'Enterprise AI Access' },
            { value: '30', unit: '', label: 'Assessment Questions' },
            { value: '10', unit: '', label: 'AI Pioneer Awards' },
          ].map(stat => (
            <div key={stat.label} className="text-center px-8 py-6">
              <div className="text-cyan font-black leading-none text-glow-cyan" style={{fontSize: '3.5rem'}}>
                {stat.value}<span className="text-2xl ml-1 opacity-70">{stat.unit}</span>
              </div>
              <div className="text-mist/60 text-xs uppercase tracking-widest mt-2 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
