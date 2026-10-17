import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { Magnetic } from './primitives/Card'
import content from '../data/content.json'

const SITEMAP = [
  { id: 'about', label: 'About' },
  { id: 'strengths', label: 'Strengths' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'roles', label: 'What I Do' },
  { id: 'ai', label: 'AI Toolkit' },
  { id: 'recommendations', label: 'Reviews' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function Footer() {
  const { personal } = content
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[var(--line)] py-12">
      <div className="wrap">
        <div className="grid gap-9 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand */}
          <div>
            <a href="#top" className="mb-3.5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-3))]">
                <span className="mono text-[0.72rem] font-bold text-white">PK</span>
              </span>
              <span className="text-[1rem] font-bold text-[var(--text)]">Peter&nbsp;Kumar</span>
            </a>
            <p className="max-w-xs text-[0.86rem] leading-relaxed text-[var(--muted)]">
              Cyber Security Analyst · Python Developer · AI Practitioner — available for new roles,
              remote work and contract projects.
            </p>

            <div className="mt-5 flex gap-2">
              {[
                { icon: Github, href: personal.github, label: 'GitHub' },
                { icon: Linkedin, href: personal.linkedin, label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${personal.email}`, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
                >
                  <s.icon className="h-4 w-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* sitemap */}
          <nav aria-label="Footer">
            <h3 className="eyebrow mb-4 !text-[0.66rem]">Sections</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SITEMAP.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[0.85rem] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div>
            <h3 className="eyebrow mb-4 !text-[0.66rem]">Contact</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-[0.85rem] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {personal.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${personal.phone.replace(/\s/g, '')}`}
                  className="text-[0.85rem] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {personal.phone}
                </a>
              </li>
              <li className="text-[0.85rem] text-[var(--muted)]">{personal.location}</li>
            </ul>

            <Magnetic strength={0.25} className="mt-5">
              <a href="#top" className="btn btn--ghost !py-2 !text-[0.8rem]">
                Back to top
                <ArrowUp />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-[0.8rem] text-[var(--muted)] sm:flex-row">
          <p>
            © {year} Peter Kumar — Cyber Security Analyst &amp; Python Developer
          </p>
          <p className="mono flex items-center gap-2 text-[0.72rem]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            React · Tailwind · FastAPI
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
