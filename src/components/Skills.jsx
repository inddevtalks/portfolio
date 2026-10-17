import { Stagger, StaggerItem } from './primitives/motion'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Icon } from './primitives/Icon'
import content from '../data/content.json'

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading num="03" title="Skills" />

      <Stagger stagger={0.07} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.skills.map((group) => (
          <StaggerItem key={group.title} className="h-full">
            <GlowCard className="group flex h-full flex-col p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-400 group-hover:scale-110">
                  <Icon name={group.icon} className="h-4.5 w-4.5" />
                </span>
                <h3 className="text-[0.98rem]">{group.title}</h3>
              </div>

              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-1 text-[0.76rem] font-medium text-[var(--muted)] transition-all duration-250 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

export default Skills
