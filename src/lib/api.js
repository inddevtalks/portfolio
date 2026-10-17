import bundled from '../data/content.json'

/**
 * Content loader.
 *
 * The portfolio ships with its content bundled (so it renders instantly and
 * works on pure static hosting), but if the FastAPI backend is running we
 * fetch from /api/content so content can be swapped without a rebuild.
 *
 * The backend reads the SAME file (src/data/content.json), so there is only
 * ever one copy to edit.
 */

const TIMEOUT = 2500

export async function fetchContent() {
  try {
    const res = await fetch('/api/content', {
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { Accept: 'application/json' },
    })
    if (res.ok) return await res.json()
  } catch {
    // backend not running — expected in static-only mode
  }
  return bundled
}

export async function submitContact(payload) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  let body = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON error page */
  }

  if (!res.ok) {
    // surface the field-level detail from pydantic when we have it
    let message = body?.detail || `Request failed (${res.status})`
    if (Array.isArray(body?.detail)) {
      message = body.detail.map((d) => d.msg || String(d)).join('; ')
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }

  return body
}
