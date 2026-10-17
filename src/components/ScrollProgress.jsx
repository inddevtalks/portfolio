import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin gradient bar pinned to the top showing page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-3))',
      }}
    />
  )
}

export default ScrollProgress
