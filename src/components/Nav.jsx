import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Magnetic } from './primitives/Card'
import { useTheme } from '../hooks/useTheme'
import content from '../data/content.json'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'strengths', label: 'Strengths' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'roles', label: 'What I Do' },
  { id: 'ai', label: 'AI Toolkit' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  // shrink + blur once we leave the top of the page
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight whichever section owns the middle of the viewport
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // lock the page while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[70]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <div className="wrap flex items-center justify-between gap-4 py-3.5">
            {/* brand */}
            <a href="#top" className="group flex shrink-0 items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-3))]">
                <span className="mono text-[0.72rem] font-bold text-white">PK</span>
                <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-full" />
              </span>
              <span className="text-[0.98rem] font-bold tracking-tight text-[var(--text)]">
                Peter&nbsp;Kumar
              </span>
            </a>

            {/* desktop links */}
            <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
              {LINKS.map((link) => (
                <Magnetic key={link.id} strength={0.22}>
                  <a
                    href={`#${link.id}`}
                    className="relative block px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-300"
                    style={{ color: active === link.id ? 'var(--accent)' : 'var(--muted)' }}
                  >
                    {active === link.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg border border-[var(--accent-line)] bg-[var(--accent-soft)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </Magnetic>
              ))}
            </nav>

            {/* right controls */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.28 }}
                    className="flex"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Moon className="h-4 w-4" strokeWidth={2} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>

              <Magnetic strength={0.2} className="hidden sm:inline-block">
                <a href={`mailto:${content.personal.email}`} className="btn btn--primary !py-2 !text-[0.82rem]">
                  Hire me
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] xl:hidden"
              >
                {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="glass-strong fixed inset-y-0 right-0 z-[66] flex w-[min(82vw,340px)] flex-col gap-1 border-l border-[var(--line)] p-6 pt-24 xl:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              aria-label="Mobile"
            >
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[1rem] font-medium transition-colors"
                  style={{
                    color: active === link.id ? 'var(--accent)' : 'var(--text)',
                    background: active === link.id ? 'var(--accent-soft)' : 'transparent',
                  }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
                >
                  <span>{link.label}</span>
                  <span className="mono text-[0.68rem] text-[var(--muted)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.a>
              ))}

              <motion.div
                className="divider my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              />

              <motion.a
                href={`mailto:${content.personal.email}`}
                onClick={() => setOpen(false)}
                className="btn btn--primary mt-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {content.personal.email}
              </motion.a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Nav
