import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, TerminalSquare, Wand2 } from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard, IndexBadge } from './primitives/Card'
import { Stagger, StaggerItem, Reveal } from './primitives/motion'
import content from '../data/content.json'

const SAMPLE_PROMPT = `You are a senior security analyst.
Task: triage these Nmap findings.
Return ONLY valid JSON: {cve, cvss, severity, fix}.
Rules: no prose, no markdown fences, no guessing CVEs.`

export function AI() {
  const { intro, tools, promptEngineering, agentic } = content.ai

  return (
    <Section id="ai" alt>
      <SectionHeading num="08" title="AI Toolkit" />

      <p className="mb-9 max-w-2xl text-pretty text-[0.99rem] leading-relaxed text-[var(--body)]">
        {intro}
      </p>

      {/* ── tools grid ── */}
      <Stagger stagger={0.055} className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((t, i) => (
          <StaggerItem key={t.name} className="h-full">
            <GlowCard className="group flex h-full flex-col p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-400 group-hover:rotate-6 group-hover:scale-110">
                  <Bot className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <IndexBadge>{String(i + 1).padStart(2, '0')}</IndexBadge>
              </div>

              <h3 className="text-[1rem] leading-tight">{t.name}</h3>
              <span className="mono mt-1 text-[0.68rem] uppercase tracking-wider text-[var(--accent)]">
                {t.category}
              </span>
              <p className="mt-2.5 text-[0.855rem] leading-relaxed text-[var(--muted)]">{t.use}</p>
            </GlowCard>
          </StaggerItem>
        ))}
      </Stagger>

      {/* ── prompt engineering ── */}
      <Reveal className="mt-5" delay={0.05}>
        <GlowCard className="relative overflow-hidden p-6 md:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-40 blur-3xl"
            style={{ background: 'var(--accent-glow)' }}
          />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Wand2 className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <h3 className="text-[1.15rem]">{promptEngineering.title}</h3>
              </div>

              <p className="mb-5 text-[1rem] font-semibold leading-snug text-[var(--text)]">
                {promptEngineering.claim}
              </p>

              <ul className="space-y-2.5">
                {promptEngineering.items.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex gap-2.5 text-[0.885rem] leading-relaxed text-[var(--body)]"
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                  >
                    <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* live prompt demo */}
            <div className="flex items-center">
              <PromptTerminal />
            </div>
          </div>
        </GlowCard>
      </Reveal>

      {/* ── agentic ai ── */}
      <Reveal className="mt-5" delay={0.05}>
        <GlowCard className="relative overflow-hidden p-6 md:p-8">
          <div
            aria-hidden="true"
            className="animate-spin-slower absolute -right-24 -top-24 h-64 w-64 rounded-full border border-dashed border-[var(--line-2)]"
          />
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[var(--accent-line)] opacity-40"
          />

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <h3 className="text-[1.15rem]">{agentic.title}</h3>
              <span className="tag tag--live">Next level</span>
            </div>

            <p className="mb-6 max-w-xl text-[0.95rem] font-medium leading-snug text-[var(--text)]">
              {agentic.claim}
            </p>

            <div className="grid gap-3.5 sm:grid-cols-3">
              {agentic.items.map((a, i) => (
                <motion.div
                  key={a.name}
                  className="group rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[var(--accent-line)]"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-2.5 flex items-center gap-2">
                    <TerminalSquare className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
                    <b className="text-[0.98rem] text-[var(--text)]">{a.name}</b>
                  </div>
                  <p className="text-[0.855rem] leading-relaxed text-[var(--muted)]">{a.use}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlowCard>
      </Reveal>
    </Section>
  )
}

/* ══════════ animated prompt terminal ══════════ */

function PromptTerminal() {
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(SAMPLE_PROMPT)
      setPhase('done')
      return
    }

    let i = 0
    const typeTimer = setInterval(() => {
      i += 1
      setTyped(SAMPLE_PROMPT.slice(0, i))
      if (i >= SAMPLE_PROMPT.length) {
        clearInterval(typeTimer)
        setPhase('done')
      }
    }, 16)

    // restart after a pause so the loop stays interesting
    const loop = setInterval(() => {
      setPhase('done')
      setTimeout(() => {
        setTyped('')
        setPhase('typing')
        i = 0
      }, 3800)
    }, 14000)

    return () => {
      clearInterval(typeTimer)
      clearInterval(loop)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--line-2)] bg-[var(--bg-2)] shadow-[var(--shadow)]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="mono ml-2 text-[0.68rem] text-[var(--muted)]">prompt.txt</span>
        <span className="mono ml-auto flex items-center gap-1.5 text-[0.64rem] text-[var(--accent)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          {phase === 'typing' ? 'writing' : 'ready'}
        </span>
      </div>

      <pre className="mono min-h-[248px] whitespace-pre-wrap break-words p-4 text-[0.76rem] leading-[1.75] text-[var(--body)] sm:min-h-[236px]">
        <span className="text-[var(--accent)]">$ </span>
        <span>{typed}</span>
        <span className="animate-blink ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 bg-[var(--accent)]" />
      </pre>
    </div>
  )
}

export default AI
