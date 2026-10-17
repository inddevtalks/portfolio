/**
 * Resolves an icon name from content.json to a lucide component.
 *
 * Icons are imported explicitly rather than via `import * as` so that
 * Rollup can tree-shake — a namespace import drags in the entire
 * ~1500 icon set and adds several hundred kB to the bundle.
 *
 * To add an icon: import it below, then map its name in REGISTRY.
 */
import {
  // strengths
  Flame,
  Infinity,
  Rocket,
  Zap,
  Target,
  Compass,
  Users,
  Timer,
  Crosshair,
  ShieldCheck,
  Eye,
  Layers,
  // skills
  Shield,
  Code2,
  Bug,
  LayoutGrid,
  Database,
  BrainCircuit,
  Terminal,
  Megaphone,
  // roles
  TrendingUp,
  Server,
  ClipboardList,
  Headset,
  // fallback
  Circle,
} from 'lucide-react'

const REGISTRY = {
  Flame,
  Infinity,
  Rocket,
  Zap,
  Target,
  Compass,
  Users,
  Timer,
  Crosshair,
  ShieldCheck,
  Eye,
  Layers,
  Shield,
  Code2,
  Bug,
  LayoutGrid,
  Database,
  BrainCircuit,
  Terminal,
  Megaphone,
  TrendingUp,
  Server,
  ClipboardList,
  Headset,
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8, ...rest }) {
  const Cmp = REGISTRY[name] || Circle

  return (
    <Cmp
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  )
}

export default Icon
