import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const indexRouteSource = readFileSync('src/routes/index.tsx', 'utf8')

describe('JudgesSection styles', () => {
  it('uses mist at 80% opacity for judge description copy', () => {
    expect(indexRouteSource).toContain(
      'text-mist/80 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0 font-medium'
    )
  })

  it('copies the judge description color opacity to judging criteria copy', () => {
    expect(indexRouteSource).toContain(
      'text-mist/80 text-sm font-semibold leading-relaxed'
    )
  })

  it('uses the recentered Peter image without mobile-only CSS offsets', () => {
    expect(indexRouteSource).toContain(
      'h-[22rem] sm:h-[26rem] md:h-[30rem] w-auto object-contain object-bottom relative z-10'
    )
    expect(indexRouteSource).not.toContain('-translate-x-14 sm:-translate-x-16 md:translate-x-0')
  })
})

describe('FooterSection styles', () => {
  it('uses a brighter and larger footer tagline', () => {
    expect(indexRouteSource).toContain(
      'text-mist/80 text-base md:text-lg italic'
    )
  })

  it('uses a larger footer logo', () => {
    expect(indexRouteSource).toContain('className="h-14 sm:h-16 md:h-20 w-auto"')
  })

  it('keeps only the copyright line in footer legal copy', () => {
    expect(indexRouteSource).not.toContain('This is an internal STARTRADER program.')
    expect(indexRouteSource).not.toContain('brandhub@startrader.com')
    expect(indexRouteSource).toContain('className="text-mist/80 text-xs mt-2"')
  })
})

describe('ApplicationForm styles', () => {
  it('renders assessment sections with the shared card treatment', () => {
    expect(indexRouteSource).toContain(
      "const ASSESSMENT_SECTION_CARD_CLASS = 'relative overflow-hidden rounded-2xl border border-cyan/15 bg-white/[0.04] p-5 sm:p-6 md:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]'"
    )
    expect(indexRouteSource.match(/className=\{ASSESSMENT_SECTION_CARD_CLASS\}/g)).toHaveLength(1)
  })

  it('presents assessment questions one at a time until all are answered', () => {
    expect(indexRouteSource).toContain('const [detailsSubmitted, setDetailsSubmitted] = useState(false)')
    expect(indexRouteSource).toContain('{!detailsSubmitted ? (')
    expect(indexRouteSource).toContain('const parsed = personalInfoSchema.safeParse')
    expect(indexRouteSource).toContain('setDetailsSubmitted(true)')
    expect(indexRouteSource).toContain('const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)')
    expect(indexRouteSource).toContain('const currentQuestion = questions[currentQuestionIndex]')
    expect(indexRouteSource).toContain('const allQuestionsAnswered = answeredCount === questions.length')
    expect(indexRouteSource).toContain('setCurrentQuestionIndex(nextQuestionIndex)')
    expect(indexRouteSource).toContain('disabled={submitting || !allQuestionsAnswered}')
  })

  it('uses a light card treatment for the personal info step', () => {
    expect(indexRouteSource).toContain(
      "const PERSONAL_INFO_CARD_CLASS = 'space-y-6 rounded-2xl border border-cyan/20 bg-mist/95 p-5 sm:p-6 text-ink shadow-[0_24px_70px_rgba(218,227,237,0.16)]'"
    )
    expect(indexRouteSource).toContain(
      "const PERSONAL_INFO_INPUT_CLASS = 'bg-white/90 border-ink/15 text-ink placeholder:text-graphite/70 focus:border-cyan focus:ring-cyan/20'"
    )
    expect(indexRouteSource).toContain('className={PERSONAL_INFO_CARD_CLASS}')
  })

  it('uses a prominent selected style for multiple-choice answers', () => {
    expect(indexRouteSource).toContain(
      "const MC_SELECTED_OPTION_CLASS = 'border-cyan bg-cyan/20 text-white shadow-[0_0_28px_rgba(22,233,215,0.28)] ring-2 ring-cyan/45'"
    )
    expect(indexRouteSource).toContain('aria-pressed={value === opt.value}')
    expect(indexRouteSource).toContain('Selected')
  })
})

describe('Mobile responsive styles', () => {
  it('uses compact mobile spacing and typography on the landing page', () => {
    expect(indexRouteSource).toContain('className="text-5xl sm:text-6xl md:text-8xl font-black leading-none tracking-tight max-w-5xl mb-6"')
    expect(indexRouteSource).toContain('className="h-14 sm:h-16 md:h-28 w-auto drop-shadow-[0_0_28px_rgba(0,212,255,0.35)]"')
    expect(indexRouteSource).toContain('className="relative bg-navy py-20 md:py-28 px-4 sm:px-6 overflow-hidden"')
    expect(indexRouteSource).toContain('className="bg-navy py-16 md:py-20 px-4 sm:px-6"')
    expect(indexRouteSource).toContain('className="hero-bg relative py-20 md:py-32 px-4 sm:px-6 overflow-hidden"')
  })
})
