import { useCallback, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * Magnetic hover — the element drifts toward the cursor while it's nearby,
 * then springs back. Used on buttons and nav links.
 *
 * @param {number} strength 0–1; how far the element is pulled (fraction of
 *                          the remaining distance to the cursor)
 */
export function useMagnetic(strength = 0.32) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.55 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.55 })

  const onPointerMove = useCallback(
    (event) => {
      const el = ref.current
      if (!el) return

      // coarse pointers (touch) have no hover — skip entirely
      if (window.matchMedia('(pointer: coarse)').matches) return

      const rect = el.getBoundingClientRect()
      const relX = event.clientX - (rect.left + rect.width / 2)
      const relY = event.clientY - (rect.top + rect.height / 2)

      x.set(relX * strength)
      y.set(relY * strength)
    },
    [strength, x, y],
  )

  const reset = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return { ref, x: springX, y: springY, onPointerMove, onPointerLeave: reset }
}
