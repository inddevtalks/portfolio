import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard, Magnetic } from './primitives/Card'
import { TiltCard } from './primitives/motion'
import content from '../data/content.json'

export function Projects() {
  const [filter, setFilter] = useState('All')

  const visible = useMemo(() => {
    if (filter === 'All') return content.projects
    return content.projects.filter((p) => p.category === filter)
  }, [filter])

  return (
    <Section id="projects" alt>
      <SectionHeading num="05" title="Projects Delivered" />

      {/* header row: count + filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-[0.92rem] leading-relaxed text-[var(--body)]">
          Every project below is open source on GitHub — and most are deployed,
          so you can click through and use them. Client work handled under NDA
          isn't listed here.
        </p>

        {/* wraps rather than scrolls, so no category is ever hidden */}
        <div
          className="flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {content.projectFilters.map((f) => {
            const activeTab = filter === f
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={activeTab}
                onClick={() => setFilter(f)}
                className="relative shrink-0 rounded-lg px-3.5 py-2 text-[0.79rem] font-medium transition-colors duration-300"
                style={{ color: activeTab ? 'var(--accent)' : 'var(--muted)' }}
              >
                {activeTab && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-lg border border-[var(--accent-line)] bg-[var(--accent-soft)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* grid */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -12 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard max={5} className="h-full">
                <ProjectCard {...p} />
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* count readout */}
      <p className="mono mt-6 text-center text-[0.74rem] text-[var(--muted)]">
        Showing {visible.length} of {content.projects.length} projects
        {filter !== 'All' ? ` · ${filter}` : ''}
      </p>

      <div className="mt-10 flex justify-center">
        <Magnetic strength={0.25}>
          <a href={content.personal.github} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            See everything on GitHub
            <ExternalLink />
          </a>
        </Magnetic>
      </div>
    </Section>
  )
}

function ProjectCard({ title, category, badge, desc, stack = [], live, source, featured }) {
  return (
    <GlowCard className="group flex h-full flex-col p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {badge && (
          <span className={`tag ${live || badge === 'Open Source' ? 'tag--live' : ''}`}>{badge}</span>
        )}
        <span className="tag">{category}</span>
        {featured && (
          <span className="ml-auto flex items-center gap-1 text-[0.68rem] font-semibold text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Featured
          </span>
        )}
      </div>

      <h3 className="text-[1.04rem] leading-snug">{title}</h3>
      <p className="mt-2.5 flex-1 text-[0.89rem] leading-relaxed text-[var(--muted)]">{desc}</p>

      {stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {stack.map((s) => (
            <li key={s} className="chip !px-2.5 !py-1 !text-[0.73rem]">
              {s}
            </li>
          ))}
        </ul>
      )}

      {(live || source) && (
        <div className="mt-5 flex flex-wrap gap-4 border-t border-[var(--line)] pt-4">
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--accent)]"
            >
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              Live site
            </a>
          )}
          {source && (
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          )}
        </div>
      )}
    </GlowCard>
  )
}

export default Projects
