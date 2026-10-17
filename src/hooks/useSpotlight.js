import { useCallback } from 'react'

/**
 * Publishes the cursor position as `--mx` / `--my` CSS variables so
 * `.spotlight` / `.spot-border` can render a gradient that follows it.
 */
export function useSpotlight() {
  const onPointerMove = useCallback((event) => {
    const el = event.currentTarget
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }, [])

  return { onPointerMove }
}
