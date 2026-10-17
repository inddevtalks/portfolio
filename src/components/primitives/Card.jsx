import { motion } from 'framer-motion'
import { useMagnetic } from '../../hooks/useMagnetic'
import { useSpotlight } from '../../hooks/useSpotlight'

/**
 * Wraps children in a magnetic hover effect.
 * The wrapper must not break layout — it renders an inline-block span.
 */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic(strength)
  return (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.span>
  )
}

/**
 * A card with a cursor-following radial highlight and a gradient border
 * that fades in on hover. Use as the base for most content cards.
 */
export function GlowCard({
  children,
  className = '',
  hoverLift = true,
  as = 'div',
  ...rest
}) {
  const { onPointerMove } = useSpotlight()
  const Comp = motion[as] || motion.div

  return (
    <Comp
      onPointerMove={onPointerMove}
      whileHover={hoverLift ? { y: -6 } : undefined}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`card-base spotlight spot-border ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/**
 * Small monospace index badge used at the top of cards.
 */
export function IndexBadge({ children }) {
  return (
    <span className="mono inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[0.7rem] font-bold text-[var(--accent)]">
      {children}
    </span>
  )
}
