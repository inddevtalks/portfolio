# Peter Kumar — Portfolio (React + FastAPI)

Animated single-page portfolio. React + Vite + Tailwind on the front,
a real FastAPI + SQLite backend behind the contact form.

**Live:** https://peter-kumar-react.vercel.app

> Your original static portfolio is untouched in `../portfolio/` and still
> live at https://peter-kumar.vercel.app. This is a separate build.

## Layout

The frontend and backend are **separate folders on purpose**:

```
portfolio-react/          <- you are here. Static React site (deploys to Vercel)
  src/data/content.json   <- single source of truth for ALL content
  vercel.json
portfolio-backend/        <- FastAPI + SQLite (runs locally, or on Render/Railway)
```

Vercel scans a project root and treats any Python app it finds as a second
deployable service, which breaks the static site's build config. Keeping
them apart reflects reality too — one is a static site, the other a stateful
API with a database.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 + custom design tokens |
| Animation | Framer Motion 12, Lenis smooth scroll |
| Icons | lucide-react (explicit imports, tree-shaken) |
| Backend | FastAPI + Uvicorn + Pydantic v2 |
| Database | SQLite (stdlib `sqlite3`, no ORM) |
| Fonts | Inter + JetBrains Mono |

Zero CSS frameworks, no component library, no template.

---

## Run it

Two terminals:

```bash
# terminal 1 — API on :8000
cd ..\portfolio-backend
pip install -r requirements.txt
python main.py

# terminal 2 — UI on :5180
npm run dev -- --port 5180 --strictPort
```

Open **http://localhost:5180** — Vite proxies `/api/*` to the backend.

> **Port 5180, not the Vite default 5173.** Other projects on this machine
> already hold 5173 (the `lotus` ERP frontend lives there). Pick any free
> port and pass it explicitly. `--strictPort` makes Vite *fail loudly*
> instead of silently hopping to the next port — that silent hop is what
> caused a confusing "why is my old code still showing" session.

### Just want to look, not edit?

The backend serves the built `dist/` itself, so one command gives you the
complete production site including the working contact form:

```bash
npm run build
cd ..\portfolio-backend && python main.py
```

Then open **http://127.0.0.1:8000**

### Other commands

```bash
npm run build      # production bundle -> dist/
npm run preview    # serve the built bundle
```

Interactive API docs: **http://127.0.0.1:8000/docs**

---

## Editing content

**All copy lives in one file: `src/data/content.json`.**

That's the single source of truth. React imports it directly, and the
FastAPI backend serves the *same file* at `/api/content` — so there's
never a second copy to keep in sync.

At runtime the frontend tries `/api/content` first and falls back to the
bundled copy, which means **the site works perfectly with no backend
running** (e.g. on Vercel static hosting). The contact form detects this
and offers a `mailto:` fallback instead of failing silently.

To add an icon, import it in `src/components/primitives/Icon.jsx` and
add its name to the `REGISTRY` map. A namespace import would drag in all
~1500 icons and add ~500 kB — that was measured and is why it's explicit.

---

## Theming

Every colour is a CSS variable at the top of `src/index.css`:

```css
.dark {                     /* default */
  --bg: #070a14;
  --accent: #5b8cff;
  ...
}
.light {
  --bg: #f6f8fc;
  --accent: #2563eb;
}
```

Change `--accent` and the whole site re-themes. Dark is the default;
the nav toggle switches themes and persists the choice under
`pk-theme-v1` (versioned so an old preference can't survive a redesign
and pin the site to the wrong palette).

---

## API

Base URL `/api`. Full schema at `/docs`.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | liveness probe |
| `GET` | `/health` | same probe, bare path for host platforms |
| `GET` | `/api/content` | entire content document |
| `GET` | `/api/projects?category=` | projects, optionally filtered |
| `GET` | `/api/projects/{index}` | one project |
| `GET` | `/api/roles` | the "what I can do" catalogue |
| `GET` | `/api/ai` | AI tooling content |
| `GET` | `/api/strengths` | strengths content |
| `POST` | `/api/contact` | submit a message |
| `GET` | `/api/contact` | list messages *(admin)* |
| `DELETE` | `/api/contact/{id}` | delete a message *(admin)* |

### Contact form hardening

- **Validation** — Pydantic bounds every field, plus an email regex and
  control-character stripping.
- **Honeypot** — a hidden `company` field. Bots that fill it get a normal
  `201` back (so they learn nothing) but nothing is written to the DB.
  Verified: bot → `201 id=-1`, real submission → `201 id=4`.
- **Rate limit** — 5 posts per IP per 10 minutes, returns `429` with a
  `Retry-After` header.
- **Admin routes** — guarded by an `X-Admin-Token` header. Set
  `PK_ADMIN_TOKEN` in production; without it they stay open for local dev.

### Environment variables

| Var | Default | Purpose |
|---|---|---|
| `PK_ALLOWED_ORIGINS` | localhost:5173, localhost:4173 | CORS origins |
| `PK_ADMIN_TOKEN` | *(unset)* | guards `GET`/`DELETE /api/contact` |
| `PK_HOST` / `PK_PORT` | 127.0.0.1 / 8000 | bind address |
| `PK_RELOAD` | `1` | uvicorn auto-reload |

---

## Animations

Everything respects `prefers-reduced-motion`, in three independent
places: the CSS `@media` block, Framer Motion's
`<MotionConfig reducedMotion="user">`, and the JS hooks that check
`matchMedia` before animating. Lenis smooth scroll is also disabled.

| Where | What |
|---|---|
| Preloader | name assembles char-by-char, counter to 100, curtain wipes up |
| Cursor | custom dot + lagging spring ring that swells over interactives |
| Nav | animated pill via `layoutId`, magnetic links, slide-in drawer |
| Hero | gradient mesh drift, mask-revealed headline, rotating role, 3D tilt portrait, parallax badge floats, scroll-linked fade |
| Marquee | dual counter-rotating tickers, pause on hover |
| Strengths / Skills | staggered bento grid, cursor-following glow + gradient border |
| Experience | accent rail fills as you scroll past each node |
| Projects | filterable grid, `layoutId` tab pill, pop-in/out, 3D tilt |
| Roles | accordion with staggered bullet reveals |
| AI | live-typing prompt terminal, orbiting rings |
| Contact | focus-glow fields, sending/success/error/offline states |

Reusable pieces live in `src/components/primitives/` (`Reveal`,
`Stagger`, `RichText`, `TiltCard`, `GlowCard`, `Magnetic`, `Counter`).

---

## Deploying

**Already live:** https://peter-kumar-react.vercel.app

Redeploy after any change:

```bash
npx vercel deploy --prod --yes
```

> ⚠️ **If a new deployment suddenly returns 404 to visitors, check
> Deployment Protection.** Vercel enables `ssoProtection:
> all_except_custom_domains` on new projects under this team, which puts
> the `*.vercel.app` URL behind a Vercel login wall. This happened on first
> deploy — it was 404 for anonymous visitors while looking perfectly fine
> when logged in. Fix:
>
> ```bash
> npx vercel project protection disable peter-kumar-react --sso
> ```
>
> You then need to **redeploy** for it to take effect.

**Contact form on Vercel:** there is no Python runtime there, so the form
detects the missing API and falls back to a `mailto:` link rather than
failing silently. To get real form submissions on the live site, deploy
`../portfolio-backend` to Render/Railway/Fly and point `src/lib/api.js` at
that URL.

**Full stack on one service (Render / Railway / Fly / VPS):**

```
build:  npm install && npm run build
start:  cd ../portfolio-backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

The backend serves `dist/` itself, so one service runs both.

---

## Notes & known state

- **Live at https://peter-kumar-react.vercel.app**, verified returning 200
  to anonymous visitors.
- Bundle: **333 kB** JS (102 kB gzip) + 54 kB CSS (11 kB gzip). An earlier
  `import * as Icons` pulled in the whole icon set at 568 kB — fixed with
  explicit imports.
- Nav collapses to a hamburger below 1280px.
- Render cost: the hero's gradient mesh was `filter: blur(90px)` across
  three ~46vw animated elements, re-rasterising a huge blurred surface every
  frame. Reduced to 40px with `will-change`, and `backdrop-filter` is
  dropped entirely on phones/coarse pointers where it cost the most.
- Verified at 900px and 1200px viewports with zero console errors, both
  themes. Mobile widths still want a visual pass.
- The contact form's **server side is verified** by HTTP (`201`, `422`
  validation, honeypot drop, `429` rate limit, SQLite persistence). The
  browser-side submit button wasn't clicked through — the accessibility
  tooling couldn't reach the fields, as they sit below the fold.
- **Port 5173 belongs to your `lotus` ERP** on this machine. Keep this
  project on 5180 so the two never collide.
