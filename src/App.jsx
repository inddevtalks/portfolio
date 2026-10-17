import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'

import Preloader from './components/Preloader'
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
 * Everything below the first screen loads on demand.
 *
 * These sections are ~60% of the page's components but a first-time visitor
 * never sees them without scrolling. Splitting them keeps the initial parse
 * and execute small, which is what makes the page feel fast to open.
 *
 * `About` stays eager — it sits directly under the hero and is the first
 * thing read after the headline.
 */
const About = lazy(() => import('./components/About'))
const Strengths = lazy(() => import('./components/Strengths'))
const Skills = lazy(() => import('./components/Skills'))
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Roles = lazy(() => import('./components/Roles'))
const AI = lazy(() => import('./components/AI'))
const Recommendations = lazy(() => import('./components/Recommendations'))
const Education = lazy(() => import('./components/Education'))
const Contact = lazy(() => import('./components/Contact'))

/** Reserves height so lazy chunks arriving later don't shift the page. */
function Placeholder({ h = '70vh' }) {
  return <div style={{ minHeight: h }} aria-hidden="true" />
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

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

  const onPreloaderDone = useCallback(() => setLoaded(true), [])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader onDone={onPreloaderDone} name={content.personal.name} />

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

      <main
        id="main"
        className="transition-opacity duration-500"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <Hero />
        <Marquee />

        <Suspense fallback={<Placeholder />}>
          <About />
          <Strengths />
          <Skills />
          <Experience />
          <Projects />
          <Roles />
          <AI />
          <Recommendations />
          <Education />
          <Contact />
        </Suspense>
      </main>

      <Footer />

      {/* film grain over the whole page */}
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}
