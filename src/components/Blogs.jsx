import { Section, SectionHeading } from './primitives/SectionHeading'
import { GlowCard } from './primitives/Card'
import { Stagger, StaggerItem } from './primitives/motion'
import { BookOpen, ArrowRight, Calendar, Clock } from 'lucide-react'
import content from '../data/content.json'

/**
 * Every post is a full standalone article, served by this site itself at
 * /blog/<slug> — the same build the author wrote it in, with its own layout,
 * video and data table. The card is therefore a plain link: no overlay, no
 * scroll lock, no modal to get stuck in. The reader scrolls with the browser
 * like any other page, and the back button returns to the portfolio exactly
 * where it was left (#blogs in the URL re-lands on this section).
 */
export function Blogs() {
  const { intro, items } = content.blogs

  return (
    <Section id="blogs">
      <SectionHeading num="06" title="Blogs" />

      <p className="mb-8 max-w-2xl text-[0.92rem] leading-relaxed text-[var(--body)]">
        {intro}
      </p>

      <Stagger
        stagger={0.12}
        // One post alone in a grid leaves a hole beside it, so a single entry
        // centres at a readable measure instead. Two or more grow into the
        // same md/xl grid the Recommendations section uses, which keeps an
        // odd count balanced at both breakpoints.
        className={
          items.length === 1
            ? 'mx-auto max-w-2xl'
            : 'grid gap-5 md:grid-cols-2 xl:grid-cols-3'
        }
      >
        {items.map((post) => (
          <StaggerItem key={post.slug} className="h-full">
            <BlogCard post={post} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

function BlogCard({ post }) {
  return (
    <GlowCard className="group h-full overflow-hidden">
      <a
        href={`/blog/${post.slug}`}
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
      </a>
    </GlowCard>
  )
}

export default Blogs
