import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Sparkles, CheckCircle2, Zap } from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Icon } from './primitives/Icon'
import { Stagger, StaggerItem } from './primitives/motion'
import content from '../data/content.json'

/**
 * "What I can do" — the non-engineering and operations roles.
 * Each row expands to show the core deliverables and the advanced,
 * automation-assisted extras.
 */
export function Roles() {
  const [open, setOpen] = useState(content.roles.items[0].title)
  const { intro, items } = content.roles

  return (
    <Section id="roles">
      <SectionHeading num="06" title="What I Can Do" />

      <p className="mb-9 max-w-2xl text-pretty text-[0.99rem] leading-relaxed text-[var(--body)]">
        {intro}
      </p>

      <Stagger stagger={0.08} className="space-y-3.5">
        {items.map((role) => {
          const isOpen = open === role.title
          return (
            <StaggerItem key={role.title}>
              <RoleRow
                role={role}
                open={isOpen}
                onToggle={() => setOpen(isOpen ? null : role.title)}
              />
            </StaggerItem>
          )
        })}
      </Stagger>
    </Section>
  )
}

function RoleRow({ role, open, onToggle }) {
  const panelId = `role-panel-${role.title.replace(/\W+/g, '-').toLowerCase()}`

  return (
    <GlowCard className="overflow-hidden">
      {/* header — the whole bar is the button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex w-full items-center gap-4 p-5 text-left md:p-6"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-400 group-hover:scale-110"
        >
          <Icon name={role.icon} className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[1.04rem] font-bold leading-snug text-[var(--text)]">
            {role.title}
          </span>
          <span className="mt-0.5 block truncate text-[0.83rem] text-[var(--muted)]">
            {role.subtitle}
          </span>
        </span>

        <motion.span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)]"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* expandable panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3 },
            }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 border-t border-[var(--line)] px-5 py-6 md:grid-cols-2 md:px-6">
              <BulletList
                title="I will"
                icon={CheckCircle2}
                items={role.willDo}
                accent="var(--accent)"
              />
              <BulletList
                title="Advanced"
                icon={Zap}
                items={role.advanced}
                accent="var(--accent-3)"
                highlight
              />
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-[var(--line)] px-5 py-4 md:px-6">
              {role.tags.map((t) => (
                <span key={t} className="chip !px-2.5 !py-1 !text-[0.73rem]">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlowCard>
  )
}

function BulletList({ title, icon: IconCmp, items, accent, highlight }) {
  return (
    <div>
      <div className="mb-3.5 flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{
            background: `color-mix(in srgb, ${accent} 15%, transparent)`,
            color: accent,
          }}
        >
          <IconCmp className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
        <h4 className="eyebrow !text-[0.68rem]" style={{ color: accent }}>
          {title}
        </h4>
      </div>

      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={item}
            className="flex gap-2.5 text-[0.885rem] leading-relaxed text-[var(--body)]"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.055, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              aria-hidden="true"
              className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent, opacity: 0.8 }}
            />
            <span className={highlight ? 'text-[var(--text)]' : undefined}>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export { Sparkles }
export default Roles
