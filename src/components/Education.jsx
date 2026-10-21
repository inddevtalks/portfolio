import { GraduationCap, Award, HeartHandshake, FileText, BadgeCheck } from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Stagger, StaggerItem } from './primitives/motion'
import content from '../data/content.json'

export function Education() {
  return (
    <Section id="education" alt>
      <SectionHeading num="09" title="Education &amp; Certifications" />

      <Stagger stagger={0.1} className="grid gap-4 md:grid-cols-2">
        {content.education.map((e) => (
          <StaggerItem key={e.title} className="h-full">
            <GlowCard className="group h-full p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-400 group-hover:scale-110">
                  <GraduationCap className="h-4.5 w-4.5" strokeWidth={1.9} />
                </span>
                <h3 className="text-[1.02rem]">{e.title}</h3>
              </div>
              <p className="mb-3 text-[0.83rem] font-medium text-[var(--accent)]">{e.meta}</p>
              <p className="text-[0.9rem] leading-relaxed text-[var(--muted)]">{e.text}</p>
            </GlowCard>
          </StaggerItem>
        ))}

        <StaggerItem className="h-full">
          <GlowCard className="group h-full p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-400 group-hover:scale-110">
                <Award className="h-4.5 w-4.5" strokeWidth={1.9} />
              </span>
              <h3 className="text-[1.02rem]">Certifications</h3>
            </div>
            <p className="mb-4 text-[0.83rem] font-medium text-[var(--accent)]">
              {content.certifications.meta}
            </p>

            <ul className="space-y-3">
              {content.certifications.items.map((c) => (
                <li
                  key={c.title}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4"
                >
                  <b className="block text-[0.93rem] text-[var(--text)]">{c.title}</b>
                  <span className="mono mt-1 block text-[0.7rem] text-[var(--muted)]">
                    {c.issuer} · {c.date}
                  </span>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-[var(--muted)]">
                    {c.note}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4">
                    <a
                      href={c.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--accent)]"
                    >
                      <FileText className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:scale-110" />
                      View document
                    </a>
                    {c.verify && (
                      <a
                        href={c.verify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                      >
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verify
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--line)] pt-4">
              {content.certifications.platforms.map((c) => (
                <li key={c} className="chip">
                  {c}
                </li>
              ))}
            </ul>
          </GlowCard>
        </StaggerItem>

        <StaggerItem className="h-full">
          <GlowCard className="group h-full p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-400 group-hover:scale-110">
                <HeartHandshake className="h-4.5 w-4.5" strokeWidth={1.9} />
              </span>
              <h3 className="text-[1.02rem]">Leadership &amp; Volunteering</h3>
            </div>
            <ul className="space-y-2.5">
              {content.leadership.map((l) => (
                <li
                  key={l}
                  className="relative pl-5 text-[0.885rem] leading-relaxed text-[var(--muted)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[0.5em] h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                  />
                  {l}
                </li>
              ))}
            </ul>
          </GlowCard>
        </StaggerItem>
      </Stagger>
    </Section>
  )
}

export default Education
