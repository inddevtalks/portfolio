import { Fragment } from 'react'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/* ══════════════ variants shared by stagger groups ══════════════ */

export const staggerParent = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
})

export const staggerChild = (y = 24, scale = 1) => ({
  hidden: { opacity: 0, y, scale, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: EASE },
  },
})

/* ══════════════════════ Reveal ══════════════════════ */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  duration = 0.75,
  amount = 0.25,
  once = true,
  className,
  as = 'div',
  ...rest
}) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/* ══════════════════════ Stagger ══════════════════════ */

export function Stagger({
  children,
  stagger = 0.08,
  delay = 0,
  className,
  amount = 0.15,
  once = true,
  ...rest
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, y = 24, scale = 1, className, ...rest }) {
  return (
    <motion.div className={className} variants={staggerChild(y, scale)} {...rest}>
      {children}
    </motion.div>
  )
}

/* ══════════════════════ RichText ══════════════════════
   Animates text word-by-word out of a mask, and renders the `**bold**`
   markers used in content.json as real <strong> elements. */

function renderInline(text, keyPrefix) {
  // split on ** markers -> alternating plain / bold
  return text.split(/(\*\*)/g).map((chunk, i) => {
    if (chunk === '**') return null
    const isBold = i % 2 === 1
    const key = `${keyPrefix}-${i}`
    return isBold ? (
      <strong key={key} className="font-semibold text-[var(--text)]">
        {chunk}
      </strong>
    ) : (
      <span key={key}>{chunk}</span>
    )
  })
}

export function RichText({
  text,
  className,
  delay = 0,
  stagger = 0.02,
  amount = 0.15,
  as: Tag = 'p',
}) {
  const words = String(text ?? '').split(' ')

  // Cap the per-word delay so a paragraph always finishes within ~0.6s.
  // Without this a 60-word paragraph takes over two seconds to finish
  // revealing, which reads to the visitor as "this section is empty".
  const step = Math.min(stagger, 0.6 / Math.max(words.length, 1))

  return (
    <Tag className={className}>
      {/*
        ONE IntersectionObserver per paragraph. The words inherit the
        parent's "show" state through Framer Motion variants rather than
        each registering its own whileInView. The previous version created
        one observer per word — ~240 in the About section alone — which was
        the single biggest source of jank on the page.
      */}
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: step, delayChildren: delay } },
        }}
      >
        {words.map((word, i) => (
          // The separator space must live BETWEEN the word wrappers as its own
          // node. Inside either wrapper it lands at the end of that wrapper's
          // inline formatting context, where CSS trailing-whitespace rules
          // collapse it away — which renders the whole paragraph as one
          // unreadable run-together string.
          <Fragment key={i}>
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: '115%', opacity: 0 },
                  show: {
                    y: '0%',
                    opacity: 1,
                    transition: { duration: 0.55, ease: EASE },
                  },
                }}
              >
                {renderInline(word, `w${i}`)}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  )
}

/* ══════════════════════ ScaleIn ══════════════════════ */

export function ScaleIn({ children, delay = 0, className, amount = 0.3, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════ TiltCard ══════════════════════
   3D tilt toward the cursor, with a soft glare that tracks the light. */

export function TiltCard({ children, className, max = 8, lift = 1.015, glare = true }) {
  return (
    <motion.div
      className={className}
      style={{ perspective: 1000 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <TiltInner max={max} lift={lift} glare={glare}>
        {children}
      </TiltInner>
    </motion.div>
  )
}

function TiltInner({ children, max, lift, glare }) {
  return (
    <motion.div className="relative h-full w-full [transform-style:preserve-3d]"
      onPointerMove={(e) => {
        const el = e.currentTarget
        if (window.matchMedia('(pointer: coarse)').matches) return

        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height

        el.style.transform = `rotateX(${(0.5 - py) * max * 2}deg) rotateY(${
          (px - 0.5) * max * 2
        }deg) scale(${lift})`
        el.style.setProperty('--gx', `${px * 100}%`)
        el.style.setProperty('--gy', `${py * 100}%`)
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px)'
      }}
      style={{ transition: 'transform .45s cubic-bezier(.22,1,.36,1)' }}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              'radial-gradient(360px circle at var(--gx,50%) var(--gy,50%), rgb(255 255 255 / .07), transparent 62%)',
          }}
        />
      )}
    </motion.div>
  )
}

export { EASE }
