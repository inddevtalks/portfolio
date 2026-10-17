import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Momentum smooth scrolling.
 *
 * Lenis animates the real scroll position (it does not hijack with
 * transforms), so Framer Motion's useScroll and any scroll-linked
 * effects keep working normally.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // keeps anchor links honest under smooth scroll
      anchors: { offset: -88 },
    })

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Dev aid: Lenis owns the scroll position, so a raw
    // window.scrollTo() gets snapped back. Exposing the instance lets
    // tooling (and you, in the console) drive real scrollTo calls.
    if (import.meta.env.DEV) window.__lenis = lenis

    // native smooth-scroll would fight Lenis
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'

    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.style.scrollBehavior = prev
      if (import.meta.env.DEV && window.__lenis === lenis) delete window.__lenis
      lenis.destroy()
    }
  }, [enabled])
}
