import { motion } from 'framer-motion'
import { EASE } from './motion'

/**
 * The numbered section header used throughout the page.
 * The rule to the right of the title draws itself in when the
 * section scrolls into view.
 */
export function SectionHeading({ num, title, id, className = '' }) {
  return (
    <motion.header
      id={id}
      className={`mb-10 flex flex-wrap items-center gap-x-4 gap-y-3 md:mb-14 ${className}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <span className="sec-num">{num}</span>
      <h2 className="text-balance text-[clamp(1.55rem,4.2vw,2.4rem)] leading-[1.1]">
        {title}
      </h2>
      <motion.span
        aria-hidden="true"
        className="h-[2px] min-w-40 flex-1 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, var(--accent), var(--accent-2), transparent)',
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.05, delay: 0.15, ease: EASE }}
      />
    </motion.header>
  )
}

/** Section wrapper — supplies the id anchor and vertical rhythm. */
export function Section({ id, alt = false, className = '', children }) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-[clamp(64px,8.6vw,116px)] ${
        alt ? 'border-y border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_55%,transparent)]' : ''
      } ${className}`}
    >
      <div className="wrap">{children}</div>
    </section>
  )
}
