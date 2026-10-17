import { RichText, Reveal, Stagger, StaggerItem } from './primitives/motion'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import content from '../data/content.json'

export function About() {
  return (
    <Section id="about">
      <SectionHeading num="01" title="About" />

      <div className="grid gap-7 lg:grid-cols-[1.45fr_.55fr] lg:gap-9">
        <div className="space-y-5">
          {content.about.paragraphs.map((p, i) => (
            <RichText
              key={i}
              text={p}
              className="text-pretty text-[0.99rem] leading-[1.85] text-[var(--body)]"
              delay={i * 0.06}
            />
          ))}
        </div>

        <Reveal delay={0.2} className="h-fit">
          <GlowCard className="p-6 lg:sticky lg:top-28">
            <h3 className="eyebrow mb-4 !text-[0.7rem]">At a glance</h3>
            <Stagger stagger={0.05} delay={0.1} className="space-y-0">
              {content.about.glance.map((row) => (
                <StaggerItem key={row.k} y={10}>
                  <div className="flex items-start justify-between gap-3 border-b border-dashed border-[var(--line-2)] py-2.5 transition-colors last:border-0 hover:border-[var(--accent-line)]">
                    <dt className="text-[0.8rem] text-[var(--muted)]">{row.k}</dt>
                    <dd className="text-right text-[0.82rem] font-semibold text-[var(--text)]">
                      {row.v}
                    </dd>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </GlowCard>
        </Reveal>
      </div>
    </Section>
  )
}

export default About
