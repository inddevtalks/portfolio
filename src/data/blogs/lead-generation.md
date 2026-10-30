We spent months trying to buy lists, scrape directories, and stitch together
APIs. The breakthrough was stopping the search for a "clean" source and just
reading what Google Maps already publishes — business names, phones, websites,
ratings, and addresses — at scale, with the messy parts handled.

Every number below is from a real run.

## Why every lead source we tried failed

The pattern was always the same: a source looks promising in the demo, then
production hits and the rate limits, missing fields, or stale records make it
unusable at scale. We weren't looking for a perfect source — we were looking
for one that didn't lie about what it could deliver.

| Source | Phone | Website | Address | At scale | Verdict |
| --- | --- | --- | --- | --- | --- |
| Bought lists | Sometimes | Rarely | Stale | Per seat | Rots in months |
| Yelp · YellowPages | Paywalled | Paywalled | Partial | Rate-limited | Fields locked |
| Apollo · Clearbit | Some | Yes | Yes | Credits | No local SMBs |
| Directory scrapers | Partial | Partial | Partial | Breaks often | Selector rot |
| **Google Maps — ours** | **Yes** | **Yes** | **Yes** | **Unlimited** | **Winner** |

Three findings sit behind that table:

- **Directories are stale the moment you buy them.** Businesses close, numbers
  change, owners retire. A list from six months ago is 30% wrong on day one. We
  kept paying for data that was already rotting.
- **APIs gatekeep the fields you actually need.** Yelp, YellowPages, Apollo —
  they all hide phone, website and address behind higher tiers or rate limits
  that make large collection impractical. The data exists; they just won't let
  you have it.
- **No single source has it all.** One directory has the phone. Another has the
  website. A third has the rating. Merging them by hand is a full-time job. We
  needed one pass that got everything.

## What actually worked

The fix was subtraction. Remove the API middleware, delete the pagination
assumption, and change almost nothing else. The real Chrome binary already has
the correct fingerprint. A visible window is the strongest signal. The locale
and timezone must agree with the search. Everything else is handling the messy
parts Google throws at you — rate limits, lazy loading, lazy rendering, and the
fact that the fields you need live on a different page.

**Search Google Maps directly — no API middleware.** The Maps website has every
field we need: name, category, rating, reviews, status, hours, address, phone,
website, coordinates. We drive the real Chrome browser and read the DOM the way
a person would — no API keys, no rate limits from a third party, no missing
fields.

**Neighbouring areas — the pagination Google doesn't have.** Google Maps caps
results per area, not per query. A single search returns ~40 listings. Our
engine takes the map centre, walks a grid of neighbouring centres (~4 km apart,
nearest first), and merges everything by CID. Verified lifting a throttled run
from 22 → 45 and an unthrottled run to 60/60.

**Incremental scroll — the only way to load the feed.** Jumping to the bottom
skips the lazy-load sentinel so Google stops loading. Stepping 70% of the feed
height keeps the sentinel in view. A 1440×2000 viewport renders more rows per
batch. This is the difference between 8 results and 120+ per area.

**Real Chrome, headful, persistent profile.** The installed Chrome binary has
the correct TLS/HTTP2 fingerprint, font stack, and media codecs. A visible
window is the strongest human signal. A persistent profile means Cloudflare's
`cf_clearance` cookie survives between runs — clearance is bound to the client
fingerprint, so stop changing the fingerprint and the clearance stops expiring.

**Locale and timezone that agree with the search.** `en-US` alongside
`America/New_York`, matching the storefront. An `Accept-Language` of `en-US`
from an address on another continent is a contradiction nobody needs to make.

**Loud failure instead of silence.** When Google rate-limits, the feed serves
~20 results no matter what. The engine waits 25s, 55s, 90s, restarts the feed,
widens to neighbouring areas — and streams every retry to the status bar. You
always know *why* the count is short, instead of staring at a short list
wondering if it's complete.

**Parallel detail tabs — automatic concurrency.** Phase 2 opens each place page
in N parallel tabs and reads the real record. Phone, website and address do not
exist on the search result cards — they only exist on the detail page.
Concurrency scales with request size: 3 tabs for 1–8, up to 10 for 150+. No
tuning required.

**Social from the business website — not Maps.** Google Maps does not publish
social profiles. The engine visits the business website once, scrolls to the
footer (where icons are often lazy-rendered), and collects social links.
Site-builder noise — Wix, GoDaddy, Shopify, Squarespace, Weebly, WordPress
share widgets — is discarded automatically.

### The clearance cookie — why persistence matters

A *persistent* profile means the `cf_clearance` cookie Cloudflare issues on a
successful pass is presented on the next run. Clearance is bound to the client
fingerprint — which is precisely why the patched client could never keep it.
Stop changing the fingerprint, and the clearance stops expiring.

## Two runs, one machine

The whole thing end to end, unedited: the search that gets throttled and
recovers, and the search that sails through. Same network, same browser, same
search term — only the code changes.

| | Result |
| --- | --- |
| Unique leads from one search | 147 |
| Collected on a clean run | 60/60 |
| End to end for 60 leads | 4m 16s |

**Run 1 — throttled, then recovered.** The feed stalls at ~20 results. Engine
waits 25s, restarts the feed, widens to neighbouring areas, and finishes at 45
leads.

**Run 2 — clean run.** No throttling. 60 leads collected in 4m 16s. Every lead
has phone, website, address, rating and social links.

The recording above is the run itself, not a reconstruction: real Chrome, real
keystrokes, real waiting. Nothing in it was edited, trimmed or re-ordered — the
throttled run is left in beside the clean one, because the contrast between
them is the entire point.

## Still frames

![The search — one query, one location, a lead limit](/blog/lead-generation/tool-search.jpg)

*Fig 01 — The search. One query, one location, a lead limit. The engine drives
Google Maps directly: no API keys, no middleware.*

![Live collection — leads streaming into the results table](/blog/lead-generation/tool-live.jpg)

*Fig 02 — Live collection. Each lead lands the moment its detail page is read:
phone, website, address, rating and socials.*

![Results — filtered, sorted, exported](/blog/lead-generation/tool-results.jpg)

*Fig 03 — Results. Filter by phone or socials, then export Excel or CSV with
one click.*

---

Recorded 14 Oct 2026 · Chrome · en-US · New York · built with Python,
Playwright, React and Flask.
