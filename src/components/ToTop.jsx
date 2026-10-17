import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'

/** Floating back-to-top button with its own progress ring. */
export function ToTop() {
  const [show, setShow] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30 })
  const circumference = 2 * Math.PI * 19

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTop = () => {
    // use native smooth scroll — Lenis intercepts anchor/hash navigation,
    // and this keeps working even if Lenis is disabled for reduced motion
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={goTop}
          aria-label="Back to top"
          className="glass-strong fixed bottom-6 right-5 z-[80] flex h-12 w-12 items-center justify-center rounded-full text-[var(--text)] shadow-[var(--shadow)] md:bottom-8 md:right-8"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <circle cx="22" cy="22" r="19" stroke="var(--line)" strokeWidth="2" />
            <motion.circle
              cx="22"
              cy="22"
              r="19"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ pathLength: progress }}
              // @ts-expect-error -- framer exposes pathLength as a motion value
              transform="rotate(-90 22 22)"
            />
          </svg>
          <svg
            className="relative h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ToTop
