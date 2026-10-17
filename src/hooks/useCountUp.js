import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Counts from 0 to `target` once the element scrolls into view.
 * Honours prefers-reduced-motion by jumping straight to the final value.
 */
export function useCountUp(target, { duration = 1700, decimals = 0 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!inView) return

    if (reduced) {
      setValue(target)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutExpo — fast start, gentle settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setValue(Number((target * eased).toFixed(decimals)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration, decimals, reduced])

  return [ref, value]
}
