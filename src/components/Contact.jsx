import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
} from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard, Magnetic } from './primitives/Card'
import { Reveal } from './primitives/motion'
import { submitContact } from '../lib/api'
import content from '../data/content.json'

const { personal } = content

const ROLE_OPTIONS = [
  'Cyber Security Analyst role',
  'Python Developer role',
  'AI / Automation work',
  'Web Scraping project',
  'Full-Stack build',
  'Social media / content work',
  'Something else',
]

const EMPTY = {
  name: '',
  email: '',
  subject: '',
  role: ROLE_OPTIONS[0],
  message: '',
  company: '', // honeypot
}

const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/

export function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | success | error | offline
  const [feedback, setFeedback] = useState('')
  const [touched, setTouched] = useState({})

  const errors = {
    name: form.name.trim().length >= 2 ? '' : 'Please enter your name.',
    email: EMAIL_RE.test(form.email.trim()) ? '' : 'Please enter a valid email address.',
    message: form.message.trim().length >= 10 ? '' : 'Tell me a little more (10+ characters).',
  }
  const isValid = !errors.name && !errors.email && !errors.message

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (status !== 'idle') setStatus('idle')
  }

  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))

  async function onSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (!isValid) return

    setStatus('sending')
    setFeedback('')

    try {
      const res = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        role: form.role || null,
        message: form.message.trim(),
        company: form.company,
      })
      setStatus('success')
      setFeedback(res?.preview || "Message received — I'll get back to you soon.")
      setForm(EMPTY)
      setTouched({})
    } catch (err) {
      // a failed network call means the API isn't running (static hosting);
      // offer a mailto escape hatch instead of losing the message.
      if (err.status === undefined || err.status === 0) {
        setStatus('offline')
      } else {
        setStatus('error')
      }
      setFeedback(err.message || 'Something went wrong. Please try again.')
    }
  }

  const mailtoFallback = `mailto:${personal.email}?subject=${encodeURIComponent(
    form.subject || 'Enquiry from your portfolio',
  )}&body=${encodeURIComponent(`Hi Peter,\n\n${form.message}\n\n— ${form.name}`)}`

  const links = [
    { icon: Mail, k: 'Email', v: personal.email, href: `mailto:${personal.email}` },
    {
      icon: Phone,
      k: 'Phone',
      v: personal.phone,
      href: `tel:+${personal.phone.replace(/\s/g, '')}`,
      alt: `/ ${personal.phoneAlt}`,
    },
    {
      icon: Linkedin,
      k: 'LinkedIn',
      v: '/in/peter-kumar-8a76ba1b3',
      href: personal.linkedin,
      external: true,
    },
    {
      icon: Github,
      k: 'GitHub',
      v: 'github.com/inddevtalks',
      href: personal.github,
      external: true,
    },
  ]

  return (
    <Section id="contact">
      <SectionHeading num="11" title="Get in touch" />

      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:gap-8">
        {/* ── info ── */}
        <Reveal>
          <div className="flex h-full flex-col gap-4">
            <GlowCard className="p-6">
              <h3 className="mb-2 text-[1.15rem] leading-snug">
                Let's talk about your next project or role.
              </h3>
              <p className="text-[0.9rem] leading-relaxed text-[var(--muted)]">
                {personal.openTo}
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-[var(--line)] pt-4 text-[0.84rem] text-[var(--muted)]">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2} />
                {personal.location}
              </div>
            </GlowCard>

            <div className="grid flex-1 gap-3">
              {links.map((l) => (
                <a
                  key={l.k}
                  href={l.href}
                  target={l.external ? '_blank' : undefined}
                  rel={l.external ? 'noopener noreferrer' : undefined}
                  className="group flex items-center gap-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:bg-[var(--surface-2)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-300 group-hover:scale-110">
                    <l.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mono block text-[0.64rem] uppercase tracking-widest text-[var(--muted)]">
                      {l.k}
                    </span>
                    <span className="block truncate text-[0.87rem] font-medium text-[var(--text)]">
                      {l.v}
                    </span>
                  </span>
                </a>
              ))}

              <a
                href={personal.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:bg-[var(--surface-2)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] transition-transform duration-300 group-hover:scale-110">
                  <Globe className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mono block text-[0.64rem] uppercase tracking-widest text-[var(--muted)]">
                    Portfolio
                  </span>
                  <span className="block truncate text-[0.87rem] font-medium text-[var(--text)]">
                    peter-kumar.vercel.app
                  </span>
                </span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* ── form ── */}
        <Reveal delay={0.1}>
          <GlowCard className="relative h-full overflow-hidden p-6 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
              style={{ background: 'var(--accent-glow)' }}
            />

            <form onSubmit={onSubmit} noValidate className="relative space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="c-name"
                  label="Your name"
                  value={form.name}
                  onChange={set('name')}
                  onBlur={blur('name')}
                  error={touched.name ? errors.name : ''}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                <Field
                  id="c-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  onBlur={blur('email')}
                  error={touched.email ? errors.email : ''}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="c-subject"
                  label="Subject"
                  value={form.subject}
                  onChange={set('subject')}
                  placeholder="VAPT engagement"
                  optional
                />
                <div>
                  <label htmlFor="c-role" className="eyebrow mb-2 block !text-[0.66rem]">
                    What is this about?
                  </label>
                  <select
                    id="c-role"
                    value={form.role}
                    onChange={set('role')}
                    className="field appearance-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-[var(--surface-solid)]">
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="c-message" className="eyebrow mb-2 block !text-[0.66rem]">
                  Message
                </label>
                <textarea
                  id="c-message"
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                  onBlur={blur('message')}
                  placeholder="Tell me about the role or project…"
                  className="field resize-y"
                  aria-invalid={Boolean(touched.message && errors.message)}
                />
                {touched.message && errors.message && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[0.76rem] text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* honeypot — hidden from people, tempting to bots */}
              <div className="absolute left-[-9999px] top-0" aria-hidden="true">
                <label htmlFor="c-company">Company</label>
                <input
                  id="c-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={set('company')}
                />
              </div>

              {/* status message */}
              <AnimatePresence mode="wait">
                {(status === 'success' || status === 'error' || status === 'offline') && (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-[0.84rem] ${
                        status === 'success'
                          ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300'
                          : status === 'offline'
                            ? 'border-amber-500/35 bg-amber-500/10 text-amber-300'
                            : 'border-red-500/35 bg-red-500/10 text-red-300'
                      }`}
                    >
                      {status === 'success' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <div>
                        <b className="font-semibold">
                          {status === 'success'
                            ? 'Message sent!'
                            : status === 'offline'
                              ? 'The API is offline'
                              : 'Could not send'}
                        </b>{' '}
                        {feedback}
                        {status === 'offline' && (
                          <div className="mt-2.5">
                            <Magnetic strength={0.2}>
                              <a href={mailtoFallback} className="btn btn--ghost !py-2 !text-[0.8rem]">
                                <Mail /> Open in your mail app
                              </a>
                            </Magnetic>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Magnetic strength={0.2} className="block w-full sm:w-fit">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn btn--primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <Send />
                    </>
                  )}
                </button>
              </Magnetic>

              <p className="text-[0.76rem] leading-relaxed text-[var(--muted)]">
                Goes straight to my inbox over a small Python (FastAPI) server. No third parties,
                no tracking.
              </p>
            </form>
          </GlowCard>
        </Reveal>
      </div>
    </Section>
  )
}

function Field({ id, label, error, optional, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block !text-[0.66rem]">
        {label}
        {optional && <span className="ml-1 normal-case opacity-60">(optional)</span>}
      </label>
      <input
        id={id}
        className="field"
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[0.76rem] text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Contact
