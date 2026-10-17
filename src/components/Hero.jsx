import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Github, MapPin, Mail, Phone } from 'lucide-react'
import { Magnetic } from './primitives/Card'
import { Counter } from './primitives/Counter'
import content from '../data/content.json'

const EASE = [0.22, 1, 0.36, 1]
const { personal, stats } = content

/* ── headline split into mask-revealed lines ── */
const LINES = [
  [{ text: 'Cyber Security', accent: false }, { text: 'Analyst', accent: false }],
  [{ text: '& ', accent: false }, { text: 'Python Developer', accent: true }],
]

export function Hero() {
  const sectionRef = useRef(null)
  const [roleIndex, setRoleIndex] = useState(0)

  // rotate the "also does" role line
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % personal.roles.length),
      2600,
    )
    return () => clearInterval(id)
  }, [])

  // the whole hero drifts back and fades as you scroll into the next section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(7px)'])

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden pt-28 md:pt-32">
      {/* ── backdrop ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="mesh">
          <span />
          <span />
          <span />
        </div>
        <div
          className="animate-grid absolute inset-0 opacity-[0.55]"
          style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 78%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>

      <motion.div style={{ y, opacity, scale, filter: blur }} className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-8">
          {/* ══════════ copy ══════════ */}
          <div className="order-2 lg:order-1">
            {/* availability */}
            <motion.div
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--accent-line)] bg-[var(--accent-soft)] px-4 py-1.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-[var(--accent)]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
              </span>
              <span className="eyebrow !text-[0.68rem]">Available for opportunities</span>
            </motion.div>

            {/* headline */}
            <h1 className="text-[clamp(2.35rem,8.2vw,4.6rem)] font-extrabold leading-[1.02] tracking-[-0.04em]">
              {LINES.map((line, li) => (
                <span key={li} className="block overflow-hidden pb-1">
                  <span className="flex flex-wrap gap-x-[0.28em]">
                    {line.map((seg, si) => (
                      <motion.span
                        key={si}
                        className={`inline-block ${seg.accent ? 'grad-text animate-gradient' : 'text-[var(--text)]'}`}
                        initial={{ y: '112%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        transition={{
                          delay: 0.5 + (li * 2 + si) * 0.09,
                          duration: 0.85,
                          ease: EASE,
                        }}
                      >
                        {seg.text}
                      </motion.span>
                    ))}
                  </span>
                </span>
              ))}

              {/* rotating extra role */}
              <span className="mt-1 flex items-baseline overflow-hidden pb-1">
                <span className="mr-2 text-[0.55em] font-bold text-[var(--muted)]">+</span>
                <span className="relative h-[1.15em] flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roleIndex}
                      className="mono absolute inset-0 text-[0.62em] font-medium tracking-tight text-[var(--muted)]"
                      initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
                      animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {personal.roles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>

            {/* lede */}
            <motion.p
              className="mt-7 max-w-xl text-pretty text-[1.02rem] leading-relaxed text-[var(--body)] md:text-[1.08rem]"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7, ease: EASE }}
            >
              {personal.lede}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3.5"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
            >
              <Magnetic strength={0.28}>
                <a href="#projects" className="btn btn--primary" data-cursor="view">
                  View my work
                  <ArrowRight />
                </a>
              </Magnetic>

              <Magnetic strength={0.24}>
                <a href={personal.github} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <Github className="!fill-current" />
                  GitHub
                </a>
              </Magnetic>
            </motion.div>

            {/* contact strip */}
            <motion.ul
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.85rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.7 }}
            >
              <li>
                <a href={`mailto:${personal.email}`} className="group flex items-center gap-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                  <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="link-underline">{personal.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:+${personal.phone.replace(/\s/g, '')}`} className="group flex items-center gap-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                  <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="link-underline">{personal.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-[var(--muted)]">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                {personal.location}
              </li>
            </motion.ul>
          </div>

          {/* ══════════ portrait ══════════ */}
          <motion.div
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: EASE }}
          >
            <Portrait />
          </motion.div>
        </div>

        {/* ══════════ stats ══════════ */}
        <motion.ul
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:mt-20 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.8, ease: EASE }}
        >
          {stats.map((s) => (
            <li key={s.label} className="group relative bg-[var(--bg)] p-5 transition-colors duration-300 hover:bg-[var(--surface)] md:p-6">
              <div className="grad-text">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <span className="mt-2 block text-[0.8rem] text-[var(--muted)]">{s.label}</span>
              <span
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
              />
            </li>
          ))}
        </motion.ul>

        <div className="h-16 md:h-20" />
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--muted)] transition-colors hover:text-[var(--accent)] lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        style={{ opacity }}
      >
        <span className="eyebrow !text-[0.62rem]">Scroll</span>
        <span className="relative h-10 w-5 rounded-full border border-[var(--line-2)]">
          <motion.span
            className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent)]"
            animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}

/* ══════════════════ portrait with 3D tilt + parallax ══════════════════ */

function Portrait() {
  const wrapRef = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMove = (e) => {
    const el = wrapRef.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rx: -py * 13, ry: px * 15 })
  }

  const reset = () => setTilt({ rx: 0, ry: 0 })

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[400px] [perspective:1200px]"
    >
      {/* orbiting dashed ring */}
      <div
        className="animate-spin-slow absolute -inset-8 rounded-full border border-dashed border-[var(--line-2)]"
        aria-hidden="true"
      />
      <div
        className="animate-spin-slower absolute -inset-14 rounded-full border border-[var(--line)]"
        aria-hidden="true"
        style={{ borderStyle: 'dotted' }}
      />

      {/* glow */}
      <div
        className="absolute inset-6 rounded-full blur-3xl"
        style={{ background: 'var(--accent-glow)', opacity: 0.55 }}
        aria-hidden="true"
      />

      <motion.div
        className="relative [transform-style:preserve-3d]"
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      >
        <div className="relative overflow-hidden rounded-[26px] border border-[var(--line-2)] bg-[var(--surface-2)] shadow-[var(--shadow-lg)]">
          <picture>
            <source srcSet="/images/peter.webp" type="image/webp" />
            <img
              src="/images/peter.jpg"
              alt="Peter Kumar, Cyber Security Analyst and Python developer"
              width={720}
              height={960}
              fetchPriority="high"
              decoding="async"
              className="aspect-[3/4] w-full object-cover"
            />
          </picture>

          {/* inner rim + sweep */}
          <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/12" />
          <div className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/22 to-transparent" />
        </div>

        {/* floating glass card */}
        <motion.div
          className="glass-badge absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow)] sm:-left-8"
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(60px)' }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div className="leading-tight">
            <b className="block text-[0.82rem] text-[var(--text)]">Cyber Security Analyst</b>
            <span className="text-[0.72rem] text-[var(--muted)]">AWASAF · VAPT &amp; DevSecOps</span>
          </div>
        </motion.div>

        {/* skill badges */}
        <div className="absolute -right-2 top-8 flex flex-col gap-2 sm:-right-5" style={{ transform: 'translateZ(80px)' }}>
          {[
            { icon: '🛡', label: 'VAPT' },
            { icon: '🐍', label: 'Python' },
            { icon: '🤖', label: 'AI' },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              className="glass-badge flex items-center gap-2 rounded-xl px-3 py-2 text-[0.74rem] font-semibold text-[var(--text)] shadow-[var(--shadow-sm)]"
              animate={{ y: [0, i === 1 ? 10 : -7, 0] }}
              transition={{ duration: 4 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
            >
              <span aria-hidden="true">{b.icon}</span>
              {b.label}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
