import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Stagger, StaggerItem } from './primitives/motion'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import content from '../data/content.json'

export function Experience() {
  const listRef = useRef(null)

  // the accent rail fills as the list scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 78%', 'end 60%'],
  })
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const glow = useTransform(rail, (v) => 0.25 + v * 0.55)

  return (
    <Section id="experience" alt>
      <SectionHeading num="04" title="Experience" />

      <div className="relative pl-9 sm:pl-11">
        {/* base rail */}
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[7px] top-2 w-[2px] rounded-full bg-[var(--line-2)] sm:left-[9px]"
        />
        {/* filling rail */}
        <motion.span
          aria-hidden="true"
          className="absolute bottom-4 left-[7px] top-2 w-[2px] origin-top rounded-full sm:left-[9px]"
          style={{
            scaleY: rail,
            background: 'linear-gradient(180deg, var(--accent), var(--accent-2), var(--accent-3))',
            boxShadow: '0 0 18px var(--accent-glow)',
          }}
        />

        <Stagger ref={listRef} stagger={0.14} className="space-y-5">
          {content.experience.map((job) => (
            <StaggerItem key={job.title + job.date}>
              <JobCard {...job} glow={glow} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

function JobCard({ date, title, org, points, glow }) {
  return (
    <div className="group relative">
      {/* timeline node */}
      <span
        aria-hidden="true"
        className="absolute -left-[2.42rem] top-6 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] transition-all duration-400 group-hover:scale-125 sm:-left-[2.85rem]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] transition-all duration-400"
          style={{ opacity: glow }}
        />
      </span>

      <GlowCard className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mono rounded-lg border border-[var(--accent-line)] bg-[var(--accent-soft)] px-2.5 py-1 text-[0.7rem] font-medium text-[var(--accent)]">
            {date}
          </span>
          <h3 className="text-[1.12rem]">{title}</h3>
        </div>

        <p className="mt-1.5 mb-4 text-[0.86rem] text-[var(--muted)]">{org}</p>

        <ul className="space-y-2.5">
          {points.map((p, i) => (
            <motion.li
              key={i}
              className="relative pl-5 text-[0.91rem] leading-relaxed text-[var(--body)]"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-[var(--accent)] opacity-70 transition-opacity group-hover:opacity-100"
              />
              {p}
            </motion.li>
          ))}
        </ul>
      </GlowCard>
    </div>
  )
}

export default Experience
