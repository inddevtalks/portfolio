import { useCountUp } from '../../hooks/useCountUp'

/**
 * Statistic number that animates up when scrolled into view.
 * The final value is written as text, so it is correct without JS.
 */
export function Counter({ value, suffix = '', duration = 1700 }) {
  const decimals = Number.isInteger(value) ? 0 : 1
  const [ref, current] = useCountUp(value, { duration, decimals })

  return (
    <b ref={ref} className="block text-[clamp(1.6rem,3.4vw,2.2rem)] font-extrabold leading-none tracking-tight">
      {current.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </b>
  )
}
