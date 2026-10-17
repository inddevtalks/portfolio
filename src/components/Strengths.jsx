import { motion } from 'framer-motion'
import { Stagger, StaggerItem } from './primitives/motion'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Icon } from './primitives/Icon'
import content from '../data/content.json'

/**
 * Personal strengths in a bento grid. The first two cards are given
 * double width on large screens so the block doesn't read as a flat
 * list of identical boxes.
 */
export function Strengths() {
  const { intro, items } = content.strengths

  return (
    <Section id="strengths" alt>
      <SectionHeading num="02" title="Strengths" />

      <p className="mb-10 max-w-2xl text-pretty text-[0.99rem] leading-relaxed text-[var(--body)]">
        {intro}
      </p>

      <Stagger stagger={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((s, i) => {
          const wide = i < 2
          return (
            <StaggerItem
              key={s.title}
              className={wide ? 'lg:col-span-3' : 'lg:col-span-2'}
            >
              <StrengthCard {...s} wide={wide} index={i} />
            </StaggerItem>
          )
        })}
      </Stagger>
    </Section>
  )
}

function StrengthCard({ icon, title, text, wide, index }) {
  return (
    <GlowCard className="group h-full overflow-hidden p-6">
      {/* soft accent wash that fades in on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'var(--accent-glow)' }}
      />

      <div className="relative flex items-start gap-4">
        <motion.span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]"
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
          transition={{ duration: 0.5 }}
        >
          <Icon name={icon} className="h-5 w-5" />
        </motion.span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[1.02rem] leading-snug">{title}</h3>
            <span className="mono shrink-0 text-[0.66rem] font-bold text-[var(--line-2)] transition-colors group-hover:text-[var(--accent)]">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="mt-2.5 text-[0.9rem] leading-relaxed text-[var(--muted)]">{text}</p>
        </div>
      </div>

      {/* progress-style underline that fills on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-600 ease-out group-hover:scale-x-100"
        style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2), transparent)' }}
      />
    </GlowCard>
  )
}

export default Strengths
