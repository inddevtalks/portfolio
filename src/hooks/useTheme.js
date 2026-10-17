import { useCallback, useEffect, useState } from 'react'

// Versioned so a theme preference saved by an older build can never
// survive a redesign and silently pin the site to the wrong palette.
const KEY = 'pk-theme-v1'

function read() {
  if (typeof window === 'undefined') return 'dark'
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

/** Dark/light theme, persisted and applied to <html> as .dark / .light */
export function useTheme() {
  const [theme, setTheme] = useState(read)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
    root.classList.toggle('dark', theme !== 'light')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
