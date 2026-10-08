# Bhutan Herbal Tea website: design spec

Date: 2026-10-09 · Status: awaiting review · Brief: [CLAUDE.md](../../../CLAUDE.md)

CLAUDE.md is the product brief and stays the source of truth for scope, pages, tokens and requirements. This spec records the decisions made on top of it during brainstorming, and how each page is composed at each screen size.

## 1. Goal and success criteria

A static showcase site that makes visitors feel transported to the Himalayas, tells the altitude story, and is easy to navigate on any device.

The site is done when:

- All six routes (`/`, `/our-story`, `/teas`, `/teas/[slug]` ×5, `/how-its-grown`, `/contact`) plus the 404 render statically.
- Every page has been reviewed at **375, 768 and 1280 px** and looks deliberately composed at each one.
- `npm run lint` and `npm run build` pass with zero errors.
- Lighthouse scores 90+ on mobile and desktop for every page.
- Nothing on the page is invented: every fact comes from the client or the Daily Bhutan 2023 article, and missing content is hidden, not faked.

## 2. Decisions taken in brainstorming

| Topic | Decision |
| --- | --- |
| Content source | The Daily Bhutan 2023 article wins over the original brief: farm in **Thimphu**; five teas: **Chamomile, Peppermint, Lemon Verbena, Sea Buckthorn, Hypericum**. CLAUDE.md updated to match. |
| Altitude | `SUMMIT_ALTITUDE_M = 2750` (article: "above 9,000 ft"). The counter climbs from 0 m ("you start at sea level") so no valley altitude has to be invented. Flagged for client confirmation. |
| Missing content | Neutral copy built only from known facts. Benefits, taste notes, brewing tips and every contact detail render **only when filled in**. The Contact page shows "Contact details coming soon" while all contact fields are empty. All gaps are `TODO`s in `src/data/`. |
| Health claims | None. Hypericum (St John's wort) interacts with medications, so no benefit text appears without client-approved wording. |
| Logo | Source `public/images/Herbal tea.jpg` stays untouched. A script produces `public/logo.png`: white background removed by flood fill from the edges, screenshot icon cropped off, resized to 800 px wide. Used large in the home hero and the footer. The header uses a serif text wordmark. |
| Screen sizes | Phone, tablet and desktop get **equal design attention** (see §5). CSS is written mobile-first, but every breakpoint has its own composition. |
| `priority` prop | Deprecated in Next 16. Use `preload` on each page's first image only. |
| Page transitions | A CSS fade-in in `app/template.tsx`. It works before JS loads, costs nothing and is switched off by `prefers-reduced-motion`. |
| Photos | Generated placeholder JPGs (labelled "PLACEHOLDER") under `public/images/`, named for their final role so real photos can replace them file by file. |

## 3. Architecture

Next.js 16.4 App Router, TypeScript strict, Tailwind v4, framer-motion 14. Every route is statically generated. There is no backend.

### Content (`src/data/`)

| File | Holds |
| --- | --- |
| `site.ts` | Name, tagline, description, closing line, `SITE_URL`, `SUMMIT_ALTITUDE_M`, `nav`, `contact`, shared image paths and alt text |
| `teas.ts` | `Tea` type (as in CLAUDE.md), the five teas, `getTea(slug)`, `featuredTeas` |
| `story.ts` | The Our Story climb stages (eyebrow, heading, body, image, altitude fraction) |
| `grown.ts` | Farming practices and the people gallery (image, alt, caption) |

Components never contain user-facing copy, only layout.

### Components (`src/components/`)

Client components are marked ●. Everything else is a Server Component.

- `layout/`: `Header` ●, `MobileMenu` ●, `Footer`, `SkipLink`
- `home/`: `Hero` ●, `StoryTeaser`, `FeaturedTeas` (scroll-snap row on phone, grid from tablet), `GrownStrip`, `ContactCta`
- `story/`: `AltitudeMarker` ●, `ClimbStage`
- `teas/`: `TeaCard`, `TeaGrid`, `TeaDetail`
- `ui/`: `PageHero`, `Section`, `Reveal` ●, `ButtonLink`, `WhatsAppButton`, `SocialIcons`, `Wordmark`

### Routes (`src/app/`)

`layout.tsx` (fonts, header, footer, default metadata with `metadataBase`), `template.tsx` (page fade), `page.tsx`, `our-story/`, `teas/`, `teas/[slug]/` (`generateStaticParams`, `generateMetadata`, `dynamicParams = false`), `how-its-grown/`, `contact/`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` (1200×630, brand colours), `icon.svg`.

`SITE_URL` comes from Netlify's build-time `URL` variable, falling back to `http://localhost:3000`.

## 4. Visual system

- **Colours:** the six CLAUDE.md tokens as Tailwind theme colours (`bg-ink`, `text-saffron`, …). Body text uses `mist`, and secondary text uses `mist` at 70% (about 8:1 contrast on ink). Buttons are `bhutan` with **ink** text (6:1). Mist on bhutan fails AA, so it is never used.
- **Type:** Cormorant Garamond for headings (`font-serif`) and Inter for body (`font-sans`), via `next/font/google`. A fluid heading scale uses `clamp()`, so headings grow smoothly from phone to desktop instead of jumping at breakpoints.
- **Eyebrows:** small uppercase tracked labels in saffron above section headings, e.g. "Stage 03 · 2,750 m".
- **Containers:** `max-w-6xl` content width; side padding 20 px (phone), 40 px (tablet), 64 px (desktop).
- **Imagery:** full-bleed photos with a light ink overlay for text legibility. No drop shadows, no decorative gradients beyond the photo overlays and the mist.

## 5. Page compositions per breakpoint

Breakpoints: phone < 768 px, tablet 768–1279 px, desktop ≥ 1280 px.

### Shared

| | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Header | Wordmark + hamburger; full-screen menu with large serif links | Same as phone (four links crowd the bar at this width) | Wordmark left, four inline links right; active link underlined in saffron |
| Header behaviour | Transparent over the page hero; turns solid ink after 40 px of scroll | same | same |
| Page hero | 55vh photo band, title bottom-left | 60vh | 65vh, title larger, eyebrow above |
| Footer | Logo, tagline, nav, socials stacked and centred | Two columns: logo + tagline / nav + socials | Three columns: logo + tagline / nav / socials + copyright |

### Home `/`

| Section | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Hero | Full `100svh` photo with mist; logo 160 px, tagline below, scroll hint | Logo 220 px | Logo 260 px, centred; soft parallax on the photo |
| Story teaser | Single column: eyebrow, two lines, link | Same, wider measure | Two columns: large serif statement left, body + link right |
| Featured teas | The three Brand Bhutan certified teas (Chamomile, Peppermint, Lemon Verbena) in a horizontal scroll-snap row (cards 78% wide, next card peeking) | 3-column grid, compact cards | 3-column grid, full cards; "See all teas →" under every layout |
| Grown strip | Photo on top, text below | Photo and text side by side, 50/50 | Wide photo (60%) with text panel (40%) |
| Contact CTA | Centred heading, WhatsApp button full width | Button auto width | Same, more vertical space |

### Our Story `/our-story`

| | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Altitude marker | Slim saffron line fixed to the bottom edge filling left → right, altitude in a small pill at bottom-right | Same as phone | Thin vertical bar fixed to the right edge filling bottom → top, altitude value beside its top |
| Stages | Each stage: photo band (40vh) then text | Photo band then text, larger type | Alternating 2-column rows: photo one side, text the other, swapping sides per stage |
| Summit | Centred "You've reached the summit", two stacked buttons | Buttons side by side | Same, full-width summit photo behind |

### Our Teas `/teas`

1 column (phone) → 2 columns (tablet) → 3 columns (desktop). Cards use a 4:5 photo, name in leaf green and the one-line description.

### Tea detail `/teas/[slug]`

| Phone | Tablet | Desktop |
| --- | --- | --- |
| Photo (4:5) on top, then name, description, conditional sections, CTA, "Other teas" scroll row | Same as phone, photo capped at 70% width and centred | Two columns: sticky photo left (45%), content right; "Other teas" as a 4-column row |

### How It's Grown `/how-its-grown`

| | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Practices | Stacked list, saffron number and serif title | 2×2 grid | 4 columns |
| People gallery | 1 column, captions under photos | 2 columns | 4 columns |
| Closing line | Large centred serif | same | Larger, with herb-rows photo behind |

### Contact `/contact`

| Phone | Tablet | Desktop |
| --- | --- | --- |
| Stacked: WhatsApp button, then phone/email, then where to buy, then socials (each only if filled in) | Two columns: get in touch / where to buy | Same two columns with a tall field photo on the left third |

## 6. Motion and accessibility

- **Mist:** two absolutely positioned layers of soft radial gradients drifting slowly with CSS keyframes (40 s and 60 s). No blur filters (expensive on phones).
- **Parallax:** hero only, via `useScroll` + `useTransform` (translateY up to 15%). Disabled by `useReducedMotion`.
- **Reveals:** `Reveal` fades and lifts by 16 px on enter, once. Used only below the fold, so no above-the-fold content waits for JS.
- **Altitude marker:** `useScroll` → `useTransform` to metres → `useSpring` smoothing → rounded and rendered with `toLocaleString`. With reduced motion the number still updates (it carries information) but without the spring. `aria-hidden`, because the same altitude is written in each stage's eyebrow text.
- **Reduced motion:** one `@media (prefers-reduced-motion: reduce)` block stops the mist and the page fade. `useReducedMotion` handles parallax, reveals and the spring.
- **Mobile menu:** `aria-expanded` and `aria-controls` on the toggle, focus moves into the menu on open and back to the toggle on close, Tab cycles inside (focus trap), Escape closes, body scroll locks, closes on route change.
- **Featured teas row:** a native scroll container; cards are links, so Tab moves through them and scroll-snap brings each into view. The row has `aria-label` and a visible focus ring.
- **General:** skip-to-content link, one `h1` per page, landmarks (`header`, `nav`, `main`, `footer`), saffron 2 px focus ring on every interactive element, meaningful `alt` text from the data files.

## 7. SEO

A unique `title` and `description` per page via `metadata`; a `"%s · Bhutan Herbal Tea"` title template in the root layout. `generateMetadata` for each tea. A generated OG image (ink background, saffron rule, serif title and tagline). `sitemap.ts` lists all static routes and teas; `robots.ts` allows everything and points to the sitemap.

## 8. Verification

At each build-plan step: `npm run lint` and `npm run build` must pass. For each finished page: Playwright screenshots at 375, 768 and 1280 px, reviewed against §5, plus a keyboard-only pass. Before deploy: Lighthouse (mobile and desktop) on every page, and a reduced-motion check with emulated `prefers-reduced-motion: reduce`.

## 9. Out of scope

Shop, cart, forms, CMS, analytics, i18n (Dzongkha), dark/light theme toggle, blog. Any of these needs a new request.

## 10. Open items for the client

- Confirm: Thimphu location, the five teas, 2,750 m altitude, founders' names as published.
- Supply: real photos, an original transparent or vector logo, tea descriptions, approved benefit wording, phone, WhatsApp, email, social links, stockists, the custom domain.
