import { Quote, FileText } from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Stagger, StaggerItem } from './primitives/motion'
import content from '../data/content.json'

export function Recommendations() {
  return (
    <Section id="recommendations">
      <SectionHeading num="08" title="Professional Recommendations" />

      <Stagger stagger={0.12} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {content.recommendations.map((r) => (
          <StaggerItem key={r.name} className="h-full">
            <figure className="card-base spotlight spot-border group relative flex h-full flex-col overflow-hidden p-7">
              <Quote
                className="absolute right-5 top-4 h-16 w-16 text-[var(--accent)] opacity-[0.09] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.16]"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <blockquote className="relative flex-1 text-pretty text-[0.93rem] italic leading-[1.8] text-[var(--body)]">
                {r.text}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-[var(--line)] pt-5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[0.82rem] font-bold text-white"
                  style={{
                    background:
                      r.tone === 'a'
                        ? 'linear-gradient(135deg, var(--accent), var(--accent-3))'
                        : 'linear-gradient(135deg, var(--accent-2), var(--accent-3))',
                  }}
                >
                  {r.initials}
                </span>
                <span className="min-w-0">
                  <b className="block text-[0.95rem] text-[var(--text)]">{r.name}</b>
                  <span className="mono text-[0.7rem] text-[var(--muted)]">
                    Recommendation · {r.date}
                  </span>
                </span>
              </figcaption>

              {r.file && (
                <a
                  href={r.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/doc mt-4 inline-flex items-center gap-1.5 self-start text-[0.78rem] font-semibold text-[var(--accent)]"
                >
                  <FileText className="h-3.5 w-3.5 transition-transform duration-300 group-hover/doc:scale-110" />
                  {r.fileLabel}
                </a>
              )}
            </figure>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-7 text-center text-[0.85rem] italic text-[var(--muted)]">
        Full references and further details available on request.
      </p>
    </Section>
  )
}

export default Recommendations
