import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Github, X, ArrowRight, Calendar, Clock } from 'lucide-react'
import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Stagger, StaggerItem } from './primitives/motion'
import content from '../data/content.json'

/**
 * Markdown sources, keyed by slug.
 *
 * `?raw` inlines the file at build time. Because Blogs.jsx is only imported
 * by a lazy() in App.jsx, the markdown — and marked/dompurify below — all
 * sit in a chunk that is fetched when the section nears the viewport and
 * nothing is downloaded when a reader is not looking at this section.
 */
const POST_BODIES = {
  'cloudflare-bypass': () => import('../data/blogs/cloudflare-bypass.md?raw'),
}

export function Blogs() {
  const [open, setOpen] = useState(null)

  const { intro, items } = content.blogs

  return (
    <Section id="blogs">
      <SectionHeading num="06" title="Blogs" />

      <p className="mb-8 max-w-2xl text-[0.92rem] leading-relaxed text-[var(--body)]">
        {intro}
      </p>

      <Stagger stagger={0.12} className="grid gap-5 md:grid-cols-2">
        {items.map((post) => (
          <StaggerItem key={post.slug} className="h-full">
            <BlogCard post={post} onOpen={() => setOpen(post)} />
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {open && <Reader post={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </Section>
  )
}

function BlogCard({ post, onOpen }) {
  return (
    <GlowCard className="group h-full overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full w-full flex-col text-left"
      >
        {/* cover — lazy so it costs nothing until it nears the viewport */}
        <span className="relative block aspect-[16/9] w-full overflow-hidden bg-[var(--surface-2)]">
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,color-mix(in_srgb,var(--bg)_88%,transparent))]"
          />
        </span>

        <span className="flex flex-1 flex-col p-6">
          <span className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="chip !px-2.5 !py-1 !text-[0.7rem]">
                {t}
              </span>
            ))}
          </span>

          <span className="text-[1.06rem] leading-snug text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)]">
            {post.title}
          </span>

          <span className="mt-2.5 flex-1 text-[0.885rem] leading-relaxed text-[var(--muted)]">
            {post.excerpt}
          </span>

          <span className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--line)] pt-4">
            <span className="mono flex items-center gap-1.5 text-[0.72rem] text-[var(--muted)]">
              <Calendar className="h-3 w-3" />
              {post.date}
            </span>
            <span className="mono flex items-center gap-1.5 text-[0.72rem] text-[var(--muted)]">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
            <span className="group/read ml-auto flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--accent)]">
              <BookOpen className="h-3.5 w-3.5" />
              Read
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/read:translate-x-0.5" />
            </span>
          </span>
        </span>
      </button>
    </GlowCard>
  )
}

/**
 * Full-viewport reader. Owns its own scroll and locks the page behind it,
 * so the article can be long without the portfolio scrolling underneath.
 */
function Reader({ post, onClose }) {
  const [html, setHtml] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const [rawMod, markedMod, purifyMod] = await Promise.all([
          POST_BODIES[post.slug](),
          import('marked'),
          import('dompurify'),
        ])
        if (cancelled) return

        const { marked } = markedMod
        const DOMPurify = purifyMod.default

        // gfm on per-call options rather than marked.setOptions(), which is
        // deprecated and global state we would share across posts.
        const cleaned = DOMPurify.sanitize(marked.parse(rawMod.default, { gfm: true }))

        // Sanitising strips target/rel. Open links in a new tab rather than
        // navigating the reader — and the portfolio — away to another site.
        const doc = new DOMParser().parseFromString(cleaned, 'text/html')
        doc.querySelectorAll('a').forEach((a) => {
          a.target = '_blank'
          a.rel = 'noopener noreferrer'
        })

        setHtml(doc.body.innerHTML)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [post.slug])

  // lock the page behind the overlay, and allow Esc to close
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      {/* backdrop — click to dismiss */}
      <button
        type="button"
        aria-label="Close article"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-zoom-out bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-xl"
      />

      <motion.article
        className="relative h-full w-full overflow-y-auto overscroll-contain"
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* sticky bar */}
        <div className="sticky top-0 z-10 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-xl">
          <div className="wrap flex items-center gap-3 py-3.5">
            <span className="mono text-[0.7rem] text-[var(--muted)]">
              {post.date} · {post.readTime}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
              aria-label="Close article"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="wrap max-w-3xl pb-24 pt-10 md:pt-14">
          <h1 className="text-balance text-[clamp(1.7rem,5vw,2.7rem)] font-bold leading-[1.12] tracking-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--accent),var(--accent-3))]">
              <span className="mono text-[0.68rem] font-bold text-white">PK</span>
            </span>
            <span className="text-[0.86rem] font-medium text-[var(--text)]">
              Peter Kumar
            </span>
            {post.source && (
              <a
                href={post.source}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link ml-2 flex items-center gap-1.5 text-[0.8rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <Github className="h-3.5 w-3.5" />
                Source
              </a>
            )}
          </div>

          {post.demo && (
            <video
              controls
              preload="none"
              poster={post.cover}
              className="mt-8 aspect-video w-full rounded-2xl border border-[var(--line)] bg-black object-cover"
            >
              <source src={post.demo} type="video/mp4" />
            </video>
          )}

          <div className="mt-10 blog-prose">
            {failed ? (
              <p className="text-[0.92rem] text-[var(--muted)]">
                This article could not be loaded.{' '}
                {post.source && (
                  <a
                    href={post.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[var(--accent)]"
                  >
                    Read it on GitHub instead.
                  </a>
                )}
              </p>
            ) : html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="mono text-[0.8rem] text-[var(--muted)]">Loading article…</p>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}

export default Blogs
