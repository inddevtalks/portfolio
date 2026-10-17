import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Opening curtain: counts to 100 while the name assembles, then wipes
 * away upward. Sits above everything and never blocks scrolling for
 * longer than it takes.
 */
export function Preloader({ onDone, name = 'Peter Kumar' }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100)
      setDone(true)
      onDone?.()
      return
    }

    let frame
    const start = performance.now()
    // Kept deliberately short. This is dead time before the visitor sees
    // anything, so every extra 100ms here is paid by every person who opens
    // the site. 600ms still reads as deliberate.
    const total = 600

    const tick = (now) => {
      const t = Math.min((now - start) / total, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const finish = setTimeout(() => {
      setDone(true)
      onDone?.()
    }, total + 120)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(finish)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)]"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: EASE }}
          aria-hidden="true"
        >
          {/* soft glow behind the name */}
          <div
            className="pointer-events-none absolute h-72 w-72 rounded-full blur-3xl"
            style={{ background: 'var(--accent-glow)', opacity: 0.5 }}
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* NB: the wrapper must NOT be a flex container. A lone
                &nbsp; inside a flex parent becomes a whitespace-only
                anonymous flex item, which is not rendered — the words then
                run together as "PeterKumar". inline-block keeps the space
                in a normal inline formatting context where it survives. */}
            <div className="overflow-hidden text-center">
              {name.split(' ').map((word, wi) => (
                <span key={wi} className="inline-block">
                  {word.split('').map((ch, ci) => (
                    <motion.span
                      key={ci}
                      className="inline-block text-[clamp(1.9rem,7vw,3.4rem)] font-extrabold tracking-tight text-[var(--text)]"
                      initial={{ y: '110%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.75,
                        delay: 0.1 + (wi === 0 ? ci : ci + word.length + 2) * 0.045,
                        ease: EASE,
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                  {wi < name.split(' ').length - 1 && <span>{'\u00A0'}</span>}
                </span>
              ))}
            </div>

            <div className="h-px w-56 overflow-hidden rounded-full bg-[var(--line)]">
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ ease: 'linear', duration: 0.2 }}
              />
            </div>

            <div className="mono flex w-56 items-center justify-between text-[0.72rem] text-[var(--muted)]">
              <span>loading portfolio</span>
              <span className="tabular-nums text-[var(--accent)]">
                {String(progress).padStart(3, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
