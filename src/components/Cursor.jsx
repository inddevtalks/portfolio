import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Custom cursor: a small dot that tracks 1:1 and a larger ring that
 * lags behind on a spring. The ring swells and fills over anything
 * interactive.
 *
 * Desktop pointers only — touch devices have no hover state, so the
 * native cursor is left completely alone.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 340, damping: 30, mass: 0.55 })
  const ringY = useSpring(y, { stiffness: 340, damping: 30, mass: 0.55 })

  useEffect(() => {
    const fine =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    setEnabled(fine)
    if (!fine) return

    document.body.classList.add('has-custom-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const leave = () => setVisible(false)
    const over = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, textarea, select, .cursor-label')
      if (el) {
        setLabel(el.dataset.cursor || '')
      } else {
        setLabel('')
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', () => setLabel('•'))
    document.addEventListener('pointerover', over)
    document.addEventListener('mouseleave', leave)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  if (!enabled) return null

  const active = label !== ''

  return (
    <>
      {/* trailing ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] flex items-center justify-center rounded-full"
        style={{ x: ringX, y: ringY, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
        animate={{
          opacity: visible ? 1 : 0,
          width: active ? 62 : 40,
          height: active ? 62 : 40,
          marginLeft: active ? -31 : -20,
          marginTop: active ? -31 : -20,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" fill="none">
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="var(--accent)"
            strokeWidth="1.4"
            strokeDasharray="126"
            opacity={active ? 0.9 : 0.32}
            style={{ transition: 'opacity .25s' }}
          />
        </svg>
        {label && (
          <span className="mono text-[0.6rem] font-bold text-[var(--accent)]">{label}</span>
        )}
      </motion.div>

      {/* precise dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[96] h-2 w-2 rounded-full bg-[var(--accent)]"
        style={{ x, y, marginLeft: -4, marginTop: -4 }}
        animate={{ opacity: visible && !active ? 1 : 0, scale: active ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
    </>
  )
}

export default Cursor
