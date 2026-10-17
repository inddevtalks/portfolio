import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'

import Cursor from './components/Cursor'
import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Footer from './components/Footer'
import ToTop from './components/ToTop'

import { useLenis } from './hooks/useLenis'
import content from './data/content.json'

/*
 * Sections below the fold are split into their own chunks AND their own
 * Suspense boundaries.
 *
 * The earlier version wrapped all ten lazy() components in a single
 * <Suspense>. React has to resolve every child of a boundary before it
 * renders any of them, so all ten chunks were fetched, parsed and mounted
 * during first paint — 16 JS requests and 2.5s of main-thread long tasks.
 * The code-splitting was doing nothing except adding requests.
 *
 * LazySection loads each chunk only once it is within `rootMargin` of the
 * viewport, so the browser is never doing ten chunks of work at once.
 */
const SECTIONS = [
  { id: 'about', loader: () => import('./components/About'), h: '62vh' },
  { id: 'strengths', loader: () => import('./components/Strengths'), h: '78vh' },
  { id: 'skills', loader: () => import('./components/Skills'), h: '58vh' },
  { id: 'experience', loader: () => import('./components/Experience'), h: '84vh' },
  { id: 'projects', loader: () => import('./components/Projects'), h: '82vh' },
  { id: 'roles', loader: () => import('./components/Roles'), h: '70vh' },
  { id: 'ai', loader: () => import('./components/AI'), h: '80vh' },
  {
    id: 'recommendations',
    loader: () => import('./components/Recommendations'),
    h: '62vh',
  },
  { id: 'education', loader: () => import('./components/Education'), h: '54vh' },
  { id: 'contact', loader: () => import('./components/Contact'), h: '92vh' },
]

/**
 * Loads `loader()` when the placeholder scrolls near the viewport, then
 * renders the component. Reserves height meanwhile so arriving chunks
 * don't shove the page around under the reader.
 */
function LazySection({ loader, minHeight }) {
  const ref = useRef(null)
  const [Comp, setComp] = useState(null)

  useEffect(() => {
    if (Comp) return
    const el = ref.current
    if (!el) return

    // No IntersectionObserver (very old browser) — just load it.
    if (typeof IntersectionObserver === 'undefined') {
      loader().then((m) => setComp(() => m.default))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        loader().then((m) => setComp(() => m.default))
      },
      // start fetching a little before it scrolls into view
      { rootMargin: '600px 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [loader, Comp])

  return (
    <div ref={ref} style={Comp ? undefined : { minHeight }}>
      {Comp ? (
        <Comp />
      ) : (
        <div aria-hidden="true" style={{ minHeight }} />
      )}
    </div>
  )
}

export default function App() {
  // smooth scrolling only when the user hasn't asked for less motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useLenis(!prefersReduced)

  // let the page start at the top on a reload, even with a #hash in the URL
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  // keep the tab title in sync — a small detail that reads as considered
  useEffect(() => {
    document.title = `${content.personal.name} — Cyber Security Analyst · Python Developer`
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Cursor />
      <ToTop />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Nav />

      {/*
        No preloader. It held the first paint back by ~670ms to play a
        loading animation, which pushed First Contentful Paint to 1164ms
        for decoration. Content renders immediately now and the entrance
        animations still give it life.
      */}
      <main id="main">
        <Hero />
        <Marquee />

        {SECTIONS.map(({ id, loader, h }) => (
          <LazySection key={id} loader={loader} minHeight={h} />
        ))}
      </main>

      <Footer />

      {/* film grain over the whole page */}
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}
