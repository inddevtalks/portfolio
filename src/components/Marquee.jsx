import content from '../data/content.json'

/**
 * Dual-row scrolling tech ticker. The track holds the list twice so the
 * -50% translate loops seamlessly. Pauses on hover.
 */
export function Marquee() {
  const items = content.marquee

  return (
    <div className="relative border-y border-[var(--line)] py-5">
      {/* soft edges so items fade in and out */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent" />

      <div className="pause-hover space-y-3 overflow-hidden">
        {[0, 1].map((row) => (
          <div
            key={row}
            className={`animate-marquee flex w-max items-center gap-3 ${
              row === 1 ? 'animate-marquee-rev' : ''
            }`}
          >
            {[...items, ...items].map((item, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="mono whitespace-nowrap text-[0.8rem] font-medium tracking-tight text-[var(--muted)] transition-colors hover:text-[var(--text)]">
                  {item}
                </span>
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ background: 'var(--accent)', opacity: 0.55 }}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marquee
