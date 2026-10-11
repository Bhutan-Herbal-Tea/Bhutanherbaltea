# Bhutan Herbal Tea Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static, six-route Bhutan Herbal Tea showcase site described in CLAUDE.md and the design spec, equally polished at 375, 768 and 1280 px.

**Architecture:** Next.js 16.4 App Router with every route statically generated. All copy lives in typed, import-free data files under `src/data/`; pure helpers in `src/lib/` are unit-tested with Node's built-in test runner. Server Components by default; client components only for scroll/motion (`Hero`, `Reveal`, `ClimbTrack`, `AltitudeMarker`), the header, and the shadcn `Sheet` mobile menu.

**Tech Stack:** Next.js 16.4.0, React 19.3, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/turbopack`), framer-motion 14, shadcn/ui 4.21 (Base UI primitives, `cn` package), lucide-react 1.x, sharp (already installed via Next, used only by asset scripts).

**Spec:** [docs/superpowers/specs/2026-10-09-bhutan-herbal-tea-site-design.md](../specs/2026-10-09-bhutan-herbal-tea-site-design.md). Brief: [CLAUDE.md](../../../CLAUDE.md). Read both before starting any task.

## Global Constraints

- Allowed runtime dependencies: `next`, `react`, `react-dom`, `framer-motion`, plus what `shadcn init`/`shadcn add` installs (`@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn`, `tw-animate-css`). Add nothing else without asking the user.
- Next.js 16: use the `preload` prop on `next/image`, never `priority` (deprecated). Only each page's first image gets `preload`.
- `images.qualities` defaults to `[75]`: never pass a `quality` prop.
- Route params are Promises: `const { slug } = await params`.
- `next lint` no longer exists; `npm run lint` runs ESLint directly. `next build` does not lint.
- Breakpoints: phone `< 768px` (no prefix), tablet `md:` (≥ 768px), desktop `xl:` (≥ 1280px). Do not use `sm:`/`lg:`/`2xl:` in our own components.
- Prefer Tailwind v4 canonical classes over arbitrary values when typing the code below (e.g. `aspect-4/5` not `aspect-[4/5]`, `min-h-96` not `min-h-[24rem]`, `z-60` not `z-[60]`); the IDE's `suggestCanonicalClasses` warnings list them. They render identically.
- Colour tokens (Tailwind classes): `ink #0E0E0C`, `mist #F4F1EA`, `saffron #F2C230`, `bhutan #E86A1C`, `leaf #5DAE3B`, `amber #D9822B`. Button text on `bhutan` is always `ink`, never `mist` (fails AA).
- Fonts: Cormorant Garamond (`font-serif`) for headings, Inter (`font-sans`) for body, via `next/font/google`.
- No user-facing copy in components; it lives in `src/data/`. Data files contain no value imports from each other (only `import type`), so Node can load them in tests.
- Facts come only from CLAUDE.md "Known facts". Never invent benefits, contact details or history. No health claims.
- `SUMMIT_ALTITUDE_M = 2750`.
- Every page must be checked at 375, 768 and 1280 px before its task is done.
- Each task ends with `npm run lint`, `npm test` and `npm run build` passing, then a commit.
- Commit messages end with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Windows machine: run commands in PowerShell from the repo root `C:\Users\asusb\Desktop\Bhutanherbaltea`. Browser checks use the Playwright MCP tools (`browser_resize`, `browser_navigate`, `browser_take_screenshot`, `browser_press_key`, `browser_snapshot`, `browser_emulate_media`).

## Review Focus

1. **Empty client data:** WhatsApp, phone, email and stockists are all blank today. Expected: no `wa.me/`, `tel:` or `mailto:` link with an empty target anywhere; Contact shows "Contact details coming soon" and "Stockists coming soon". Pinned by `tests/contact.test.ts` (Task 3) and the built-HTML grep in Task 9.
2. **Unknown tea slug** (`/teas/green-tea`): expected the branded 404 page with HTTP status 404, not a crash or empty page. Pinned in Task 7 Step 7.
3. **Short landscape phone (667×375):** expected hero content fully readable, nothing hidden under the fixed header, page scrolls normally. Pinned in Task 5 Step 8.
4. **Slow or no JavaScript:** expected the hero `h1` and page titles visible straight from the server HTML, and `Reveal` content visible when JS is disabled (via the `<noscript>` override). Pinned in Task 5 Step 9 and Task 11 Step 3.
5. **`prefers-reduced-motion: reduce`:** expected no mist drift, no parallax, no page fade, no menu slide, while the altitude number still updates on scroll. Pinned in Task 11 Step 2.

---

## File map

```
package.json                      # + test and asset scripts (Task 1)
tsconfig.json                     # + allowImportingTsExtensions (Task 1)
components.json                   # shadcn config (Task 1, generated)
scripts/
  make-placeholders.mjs           # placeholder JPGs (Task 2)
  make-logo.mjs                   # public/logo.png from the source JPG (Task 2)
tests/
  altitude.test.ts  contact.test.ts  nav.test.ts  content.test.ts  routes.test.ts
public/
  logo.png                        # generated (Task 2)
  images/Herbal tea.jpg           # client source logo — never modified
  images/{hero,story,fields,teas,people}/…  # placeholders (Task 2)
src/
  app/
    globals.css  layout.tsx  template.tsx  page.tsx  not-found.tsx  icon.svg
    our-story/page.tsx  teas/page.tsx  teas/[slug]/page.tsx
    how-its-grown/page.tsx  contact/page.tsx
    sitemap.ts  robots.ts  opengraph-image.tsx
  data/   site.ts  teas.ts  story.ts  grown.ts  pages.ts
  lib/    utils.ts (shadcn)  altitude.ts  contact.ts  nav.ts
  components/
    ui/      button.tsx sheet.tsx (shadcn)  ButtonLink.tsx ArrowLink.tsx Section.tsx Reveal.tsx
             PageHero.tsx WhatsAppButton.tsx SocialIcons.tsx SocialLinks.tsx Wordmark.tsx Logo.tsx
    layout/  Header.tsx MobileMenu.tsx Footer.tsx SkipLink.tsx MotionProvider.tsx
    home/    Hero.tsx StoryTeaser.tsx FeaturedTeas.tsx GrownStrip.tsx ContactCta.tsx
    story/   ClimbTrack.tsx AltitudeMarker.tsx ClimbStage.tsx Summit.tsx
    teas/    TeaCard.tsx TeaGrid.tsx TeaDetail.tsx
```

Note: the spec lists four data files; this plan adds `src/data/pages.ts` for the Home, Teas, tea-detail, Contact and 404 copy, so that no copy lives in components.

---

### Task 1: Foundation — shadcn, theme tokens, fonts, test runner

**Files:**
- Create (generated): `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`, `src/components/ui/sheet.tsx`
- Modify: `package.json`, `tsconfig.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/ui/button.tsx`
- Create: `src/app/icon.svg`
- Delete: `src/app/favicon.ico`

**Interfaces:**
- Produces: Tailwind classes `bg-ink text-mist text-saffron bg-bhutan text-leaf bg-amber`, `font-serif font-sans`, `text-display text-title text-lead`, utilities `container-page eyebrow scroll-row`, CSS classes `mist-layer mist-layer--slow page-fade`; `cn(...classes)` from `@/lib/utils`; `Button`, `buttonVariants` (variants `default|outline|ghost|link`, sizes `default|lg|icon|icon-sm`) from `@/components/ui/button`; `Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle` from `@/components/ui/sheet`; `npm test` script.

- [ ] **Step 1: Install shadcn and its components**

Run:
```powershell
npx --yes shadcn@latest init --defaults --yes
npx --yes shadcn@latest add button sheet --yes
```
Expected: "Project initialization completed", files `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`, `src/components/ui/sheet.tsx` created; `package.json` gains `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn`, `tw-animate-css`.

- [ ] **Step 2: Add scripts to `package.json`**

In the `"scripts"` block, keep the existing four and add three, so it reads:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --test \"tests/**/*.test.ts\"",
    "assets:placeholders": "node scripts/make-placeholders.mjs",
    "assets:logo": "node scripts/make-logo.mjs"
  },
```

- [ ] **Step 3: Allow `.ts` import extensions (needed by Node-run tests)**

In `tsconfig.json`, add after `"noEmit": true,`:
```json
    "allowImportingTsExtensions": true,
```

- [ ] **Step 4: Replace `src/app/globals.css` entirely**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme {
  --color-ink: #0e0e0c;
  --color-mist: #f4f1ea;
  --color-saffron: #f2c230;
  --color-bhutan: #e86a1c;
  --color-leaf: #5dae3b;
  --color-amber: #d9822b;

  --text-display: clamp(2.75rem, 1.75rem + 4.5vw, 6rem);
  --text-display--line-height: 1;
  --text-display--letter-spacing: -0.01em;
  --text-title: clamp(2rem, 1.5rem + 2.25vw, 3.5rem);
  --text-title--line-height: 1.08;
  --text-lead: clamp(1.0625rem, 1rem + 0.35vw, 1.3125rem);
  --text-lead--line-height: 1.6;
}

@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-cormorant), Georgia, "Times New Roman", serif;
  --font-heading: var(--font-cormorant), Georgia, serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}

/* The site is dark-only. shadcn tokens are mapped onto the brand palette. */
:root {
  color-scheme: dark;
  --radius: 0.375rem;
  --background: #0e0e0c;
  --foreground: #f4f1ea;
  --card: #171714;
  --card-foreground: #f4f1ea;
  --popover: #0e0e0c;
  --popover-foreground: #f4f1ea;
  --primary: #e86a1c;
  --primary-foreground: #0e0e0c;
  --secondary: #1f1f1b;
  --secondary-foreground: #f4f1ea;
  --muted: #1f1f1b;
  --muted-foreground: #afada7;
  --accent: #1f1f1b;
  --accent-foreground: #f4f1ea;
  --destructive: #e5484d;
  --border: rgb(244 241 234 / 0.12);
  --input: rgb(244 241 234 / 0.16);
  --ring: #f2c230;
}

@utility container-page {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: 1.25rem;
  @media (width >= 48rem) {
    padding-inline: 2.5rem;
  }
  @media (width >= 80rem) {
    padding-inline: 4rem;
  }
}

@utility eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-saffron);
}

@utility scroll-row {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background font-sans text-foreground antialiased;
  }
  :focus-visible {
    outline: 2px solid var(--color-saffron);
    outline-offset: 3px;
  }
  ::selection {
    background: var(--color-saffron);
    color: var(--color-ink);
  }
}

/* Drifting mist over the home hero. Pure CSS: no JS, cheap on phones. */
.mist-layer {
  position: absolute;
  inset: -10% -20%;
  pointer-events: none;
  background:
    radial-gradient(40% 30% at 30% 70%, rgb(244 241 234 / 0.16), transparent 70%),
    radial-gradient(35% 25% at 75% 55%, rgb(244 241 234 / 0.1), transparent 70%);
  animation: mist-drift 40s ease-in-out infinite alternate;
}

.mist-layer--slow {
  background: radial-gradient(50% 30% at 60% 85%, rgb(244 241 234 / 0.12), transparent 70%);
  animation-duration: 60s;
  animation-direction: alternate-reverse;
}

@keyframes mist-drift {
  from {
    transform: translate3d(-6%, 0, 0);
  }
  to {
    transform: translate3d(6%, -2%, 0);
  }
}

/* Gentle page fade, applied by app/template.tsx on every navigation. */
.page-fade {
  animation: page-fade 400ms ease-out both;
}

@keyframes page-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mist-layer,
  .page-fade {
    animation: none;
  }
}
```

- [ ] **Step 5: Replace `src/components/ui/button.tsx` with the brand variants**

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-medium tracking-wide whitespace-nowrap transition-colors duration-300 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-amber",
        outline: "border-mist/35 text-mist hover:border-mist hover:bg-mist/5",
        ghost: "text-mist hover:bg-mist/10",
        link: "text-saffron underline-offset-8 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-[0.95rem]",
        icon: "size-11",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

`sheet.tsx` stays exactly as generated (it uses `size="icon-sm"`, which is why that size is kept).

- [ ] **Step 6: Replace `src/app/layout.tsx` with fonts + minimal shell**

```tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhutan Herbal Tea",
};

export const viewport: Viewport = {
  themeColor: "#0E0E0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
```

(Task 4 replaces this with the full layout; this version exists so Task 1 builds.)

- [ ] **Step 7: Replace `src/app/page.tsx` with a token smoke page**

```tsx
export default function HomePage() {
  return (
    <main className="container-page py-24">
      <p className="eyebrow">Foundation check</p>
      <h1 className="mt-4 font-serif text-display text-mist">Wellness in Every Sip.</h1>
      <p className="mt-6 text-lead text-mist/80">
        <span className="text-saffron">saffron</span> · <span className="text-bhutan">bhutan</span> ·{" "}
        <span className="text-leaf">leaf</span> · <span className="text-amber">amber</span>
      </p>
    </main>
  );
}
```

- [ ] **Step 8: Replace the favicon with `src/app/icon.svg`**

Delete `src/app/favicon.ico`, then create `src/app/icon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#0E0E0C"/>
  <path d="M10 46 26 22l8 11 5-7 15 20Z" fill="#F2C230"/>
  <path d="M26 22l4 6-3.5 2.5L23 27Z" fill="#F4F1EA"/>
</svg>
```

- [ ] **Step 9: Verify lint and build**

Run: `npm run lint; npm run build`
Expected: lint prints no errors; build ends with the route list including `○ /` and `○ /icon.svg`, no errors. (`npm test` has no test files yet; it is first run in Task 3.)

- [ ] **Step 10: Visual check of tokens**

Run `npm run dev` (background), then with Playwright: `browser_navigate` to `http://localhost:3000`, `browser_take_screenshot`. Expected: near-black background, large serif heading in mist, the four coloured words in their colours. Stop the dev server.

- [ ] **Step 11: Commit (includes the earlier scaffold)**

```powershell
git add -A
git commit -m "Scaffold Next.js 16 with shadcn, brand tokens and fonts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Assets — placeholder photos and the cleaned logo

**Files:**
- Create: `scripts/make-placeholders.mjs`, `scripts/make-logo.mjs`
- Delete: directories `public/images/hero`, `public/images/fields`, `public/images/teas`, `public/images/people` (old placeholders from setup; `public/images/Herbal tea.jpg` must stay)
- Create (generated): `public/images/{hero,story,fields,teas,people}/*.jpg`, `public/logo.png`

**Interfaces:**
- Produces these exact files (Task 3 data references them):
  - `/images/hero/thimphu-fields.jpg`
  - `/images/story/stage-1.jpg` … `/images/story/stage-6.jpg`, `/images/story/summit.jpg`
  - `/images/fields/herb-rows.jpg`, `/images/fields/drying.jpg`, `/images/fields/farm.jpg`
  - `/images/teas/chamomile.jpg`, `peppermint.jpg`, `lemon-verbena.jpg`, `sea-buckthorn.jpg`, `hypericum.jpg`
  - `/images/people/farmer-1.jpg` … `farmer-4.jpg`
  - `/logo.png` (transparent background, 800 px wide)

- [ ] **Step 1: Remove the old placeholder directories**

```powershell
Remove-Item -Recurse -Force public\images\hero, public\images\fields, public\images\teas, public\images\people
Get-ChildItem public\images
```
Expected: only `Herbal tea.jpg` remains.

- [ ] **Step 2: Create `scripts/make-placeholders.mjs`**

```js
// Generates labelled placeholder photos. Replace any file with a real photo of the same name.
// sharp ships with Next.js; this script is a dev tool and is not part of the site build.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

// [file, width, height, sky, glow, land, label]
const scenes = [
  ["hero/thimphu-fields.jpg", 1920, 1280, "#1d2530", "#c98a4a", "#4f6b3a", "Hero · Thimphu herb fields"],
  ["story/stage-1.jpg", 1600, 1200, "#161c26", "#6a6f8a", "#3d4a5a", "Story 1 · New York, 2007"],
  ["story/stage-2.jpg", 1600, 1200, "#1a2028", "#8a6a4a", "#4a5d3a", "Story 2 · Thimphu, 2015"],
  ["story/stage-3.jpg", 1600, 1200, "#1c2420", "#9aa86a", "#4f6b3a", "Story 3 · The farm, 2016"],
  ["story/stage-4.jpg", 1600, 1200, "#202833", "#6f7a86", "#3f5a33", "Story 4 · Above 2,750 m"],
  ["story/stage-5.jpg", 1600, 1200, "#1f2620", "#b99a6a", "#5DAE3B", "Story 5 · Herbs up close"],
  ["story/stage-6.jpg", 1600, 1200, "#241e18", "#D9822B", "#6b5a3a", "Story 6 · Tea in the cup"],
  ["story/summit.jpg", 1920, 1280, "#2a3442", "#d9b27a", "#5a6650", "Summit"],
  ["fields/herb-rows.jpg", 1920, 1080, "#1c2420", "#9aa86a", "#5DAE3B", "Herb rows"],
  ["fields/drying.jpg", 1920, 1080, "#241e18", "#D9822B", "#6b5a3a", "Drying herbs"],
  ["fields/farm.jpg", 1920, 1080, "#1a2028", "#8a6a4a", "#4a5d3a", "The farm"],
  ["teas/chamomile.jpg", 1000, 1250, "#16130f", "#e9d27a", "#2a2a22", "Tea · Chamomile"],
  ["teas/peppermint.jpg", 1000, 1250, "#16130f", "#5DAE3B", "#2a2a22", "Tea · Peppermint"],
  ["teas/lemon-verbena.jpg", 1000, 1250, "#16130f", "#9fc25a", "#2a2a22", "Tea · Lemon Verbena"],
  ["teas/sea-buckthorn.jpg", 1000, 1250, "#16130f", "#E86A1C", "#2a2a22", "Tea · Sea Buckthorn"],
  ["teas/hypericum.jpg", 1000, 1250, "#16130f", "#F2C230", "#2a2a22", "Tea · Hypericum"],
  ["people/farmer-1.jpg", 1000, 1250, "#1f2620", "#b99a6a", "#4f6b3a", "Farmer photo 1"],
  ["people/farmer-2.jpg", 1000, 1250, "#1f2620", "#9aa86a", "#4f6b3a", "Farmer photo 2"],
  ["people/farmer-3.jpg", 1000, 1250, "#1f2620", "#c98a4a", "#4f6b3a", "Farmer photo 3"],
  ["people/farmer-4.jpg", 1000, 1250, "#1f2620", "#8a6a4a", "#4f6b3a", "Farmer photo 4"],
];

// Small deterministic PRNG so placeholders are identical on every run.
function random(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(w, h, base, amp, seed, fill, opacity) {
  const next = random(seed);
  const steps = 14;
  const points = [`0,${h}`];
  for (let i = 0; i <= steps; i++) {
    const x = Math.round((w * i) / steps);
    const y = Math.round(h * (base - amp * next()));
    points.push(`${x},${y}`);
  }
  points.push(`${w},${h}`);
  return `<polygon points="${points.join(" ")}" fill="${fill}" fill-opacity="${opacity}"/>`;
}

function svg(w, h, sky, glow, land, label, seed) {
  const fontSize = Math.max(18, Math.round(w / 55));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${glow}"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  ${ridge(w, h, 0.62, 0.3, seed, "#3a4048", 0.8)}
  ${ridge(w, h, 0.74, 0.2, seed + 1, land, 0.9)}
  ${ridge(w, h, 0.88, 0.12, seed + 2, "#141512", 1)}
  <text x="${Math.round(w * 0.05)}" y="${Math.round(h * 0.08)}" font-family="Segoe UI, Arial, sans-serif"
    font-size="${fontSize}" letter-spacing="2" fill="#F4F1EA" fill-opacity="0.6">PLACEHOLDER · ${label}</text>
</svg>`;
}

let seed = 11;
for (const [file, w, h, sky, glow, land, label] of scenes) {
  const path = join(OUT, file);
  await mkdir(dirname(path), { recursive: true });
  await sharp(Buffer.from(svg(w, h, sky, glow, land, label, seed)))
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(path);
  seed += 10;
  console.log(`wrote public/images/${file}`);
}
```

- [ ] **Step 3: Run it and check sizes**

Run: `npm run assets:placeholders; Get-ChildItem -Recurse public\images -File | Select-Object FullName, Length`
Expected: 20 `wrote …` lines; every file under 150 KB (hero must be under 300 KB). `Herbal tea.jpg` unchanged.

- [ ] **Step 4: Create `scripts/make-logo.mjs`**

```js
// Builds public/logo.png from the client's source logo:
// removes the white background, erases the screenshot "info" icon and bottom bar, trims, resizes.
import sharp from "sharp";

const SRC = "public/images/Herbal tea.jpg";
const OUT = "public/logo.png";
const WHITE = 225; // channel value above which a pixel counts as background white
const SOFT = 160; // edge pixels lighter than this get partial transparency (anti-halo)

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const at = (x, y) => (y * w + x) * 4;

function paintWhite(x0, y0, x1, y1) {
  for (let y = Math.floor(y0 * h); y < Math.ceil(y1 * h); y++) {
    for (let x = Math.floor(x0 * w); x < Math.ceil(x1 * w); x++) {
      const i = at(x, y);
      data[i] = data[i + 1] = data[i + 2] = 255;
    }
  }
}

// 1. Erase screenshot artefacts: the circled "!" icon (bottom-right) and the dark bar on the bottom edge.
paintWhite(0.892, 0.88, 0.958, 0.95);
paintWhite(0, 0.99, 1, 1);

// 2. Flood-fill from every edge pixel through near-white pixels and make them transparent.
const isWhite = (i) => data[i] > WHITE && data[i + 1] > WHITE && data[i + 2] > WHITE;
const removed = new Uint8Array(w * h);
const stack = [];
for (let x = 0; x < w; x++) stack.push(x, 0, x, h - 1);
for (let y = 0; y < h; y++) stack.push(0, y, w - 1, y);
while (stack.length) {
  const y = stack.pop();
  const x = stack.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const p = y * w + x;
  if (removed[p] || !isWhite(p * 4)) continue;
  removed[p] = 1;
  data[p * 4 + 3] = 0;
  stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}

// 3. Soften the halo: light pixels touching the removed area become partly transparent.
for (let y = 1; y < h - 1; y++) {
  for (let x = 1; x < w - 1; x++) {
    const p = y * w + x;
    if (removed[p]) continue;
    const touches = removed[p - 1] || removed[p + 1] || removed[p - w] || removed[p + w];
    if (!touches) continue;
    const i = p * 4;
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    if (min > SOFT) data[i + 3] = Math.round(((255 - min) / (255 - SOFT)) * 255);
  }
}

// 4. Trim transparent margins, resize, write.
const trimmed = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
const result = await sharp(trimmed).trim().resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${OUT} ${result.width}x${result.height}`);
```

- [ ] **Step 5: Run it**

Run: `npm run assets:logo`
Expected: `wrote public/logo.png 800x7xx` (height about 735).

- [ ] **Step 6: Verify the logo visually and by pixel**

Read `public/logo.png` with the Read tool (it renders the image). Expected: the round black badge with "BHUTAN HERBAL TEA", cup and leaves; no white box; no circled "!" at bottom-right; no dark line along the bottom; leaves and cup intact.
Then run:
```powershell
node -e "const s=require('sharp');s('public/logo.png').ensureAlpha().raw().toBuffer({resolveWithObject:true}).then(({data,info})=>{console.log('corner alpha',data[3],'size',info.width,info.height)})"
```
Expected: `corner alpha 0`.
If the "!" icon is still visible or a leaf is clipped, adjust the first `paintWhite` box (fractions of width/height) and re-run Steps 5–6.

- [ ] **Step 7: Commit**

```powershell
git add scripts public
git commit -m "Add placeholder photo and logo generation scripts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Content data and pure helpers (TDD)

**Files:**
- Create: `src/lib/altitude.ts`, `src/lib/contact.ts`, `src/lib/nav.ts`
- Create: `src/data/site.ts`, `src/data/teas.ts`, `src/data/story.ts`, `src/data/grown.ts`, `src/data/pages.ts`
- Test: `tests/altitude.test.ts`, `tests/contact.test.ts`, `tests/nav.test.ts`, `tests/content.test.ts`

**Interfaces:**
- Consumes: image paths from Task 2.
- Produces:
  - `altitudeAt(progress: number, summit: number): number` — clamps progress to 0..1 (NaN → 0), returns whole metres.
  - `stageAltitude(index: number, count: number, summit: number): number` — `index / count * summit`, rounded to the nearest 10.
  - `formatAltitude(metres: number): string` — `"2,750 m"`.
  - `whatsappHref(n: string): string | null`, `telHref(phone: string): string | null`, `mailtoHref(email: string): string | null`, `hasDirectContact(c: Contact): boolean`, `socialLinks(c: Contact): SocialLink[]` where `SocialLink = { network: "facebook" | "instagram"; label: string; href: string }`.
  - `isActive(pathname: string, href: string): boolean`.
  - From `site.ts`: `SITE_NAME`, `TAGLINE`, `SITE_DESCRIPTION`, `CLOSING_LINE`, `SITE_URL`, `SUMMIT_ALTITUDE_M`, `HOME_NAV_LABEL`, `type Photo = { src: string; alt: string }`, `heroPhoto: Photo`, `type NavItem`, `nav: NavItem[]`, `type Contact`, `contact: Contact`.
  - From `teas.ts`: `type Tea`, `teas: Tea[]`, `featuredTeas: Tea[]`, `getTea(slug): Tea | undefined`, `otherTeas(slug): Tea[]`.
  - From `story.ts`: `type ClimbStageData`, `stages`, `storyPage`.
  - From `grown.ts`: `type Practice`, `type Person`, `practices`, `people`, `grownPage`.
  - From `pages.ts`: `homeCopy`, `teasPage`, `teaDetailCopy`, `contactPage`, `notFoundCopy`.

- [ ] **Step 1: Write the failing helper tests**

`tests/altitude.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { altitudeAt, formatAltitude, stageAltitude } from "../src/lib/altitude.ts";

test("altitudeAt maps scroll progress to metres", () => {
  assert.equal(altitudeAt(0, 2750), 0);
  assert.equal(altitudeAt(0.5, 2750), 1375);
  assert.equal(altitudeAt(1, 2750), 2750);
});

test("altitudeAt clamps out-of-range and invalid progress", () => {
  assert.equal(altitudeAt(-0.2, 2750), 0);
  assert.equal(altitudeAt(1.4, 2750), 2750);
  assert.equal(altitudeAt(Number.NaN, 2750), 0);
});

test("stageAltitude spaces stages evenly below the summit, rounded to 10 m", () => {
  assert.equal(stageAltitude(0, 6, 2750), 0);
  assert.equal(stageAltitude(3, 6, 2750), 1380);
  assert.equal(stageAltitude(5, 6, 2750), 2290);
  assert.equal(stageAltitude(6, 6, 2750), 2750);
});

test("formatAltitude uses thousands separators and metres", () => {
  assert.equal(formatAltitude(0), "0 m");
  assert.equal(formatAltitude(2750), "2,750 m");
});
```

`tests/contact.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { hasDirectContact, mailtoHref, socialLinks, telHref, whatsappHref } from "../src/lib/contact.ts";
import type { Contact } from "../src/data/site.ts";

const empty: Contact = {
  phone: "",
  whatsapp: "",
  email: "",
  social: { facebook: "", instagram: "" },
  whereToBuy: [],
};

test("whatsappHref keeps digits only and rejects empty or too-short numbers", () => {
  assert.equal(whatsappHref(""), null);
  assert.equal(whatsappHref("123"), null);
  assert.equal(whatsappHref("+975 17 12 34 56"), "https://wa.me/97517123456");
});

test("telHref keeps a leading plus and rejects empty numbers", () => {
  assert.equal(telHref(""), null);
  assert.equal(telHref("+975 2 33 44 55"), "tel:+9752334455");
});

test("mailtoHref rejects empty or malformed addresses", () => {
  assert.equal(mailtoHref(""), null);
  assert.equal(mailtoHref("not-an-email"), null);
  assert.equal(mailtoHref(" hello@example.bt "), "mailto:hello@example.bt");
});

test("hasDirectContact is false when every direct channel is empty", () => {
  assert.equal(hasDirectContact(empty), false);
  assert.equal(hasDirectContact({ ...empty, email: "hello@example.bt" }), true);
});

test("socialLinks drops empty and non-https links", () => {
  assert.deepEqual(socialLinks(empty), []);
  const links = socialLinks({
    ...empty,
    social: { facebook: "https://www.facebook.com/herbaltea.bhutan/", instagram: "javascript:alert(1)" },
  });
  assert.deepEqual(links, [
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/herbaltea.bhutan/" },
  ]);
});
```

`tests/nav.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { isActive } from "../src/lib/nav.ts";

test("isActive matches the exact route and its children only", () => {
  assert.equal(isActive("/teas", "/teas"), true);
  assert.equal(isActive("/teas/peppermint", "/teas"), true);
  assert.equal(isActive("/teasing", "/teas"), false);
  assert.equal(isActive("/", "/teas"), false);
  assert.equal(isActive("/", "/"), true);
  assert.equal(isActive("/contact", "/"), false);
});
```

- [ ] **Step 2: Run them to confirm they fail**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/altitude.ts`, `src/lib/contact.ts`, `src/lib/nav.ts`.

- [ ] **Step 3: Implement the helpers**

`src/lib/altitude.ts`:
```ts
export function altitudeAt(progress: number, summit: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.round(p * summit);
}

export function stageAltitude(index: number, count: number, summit: number): number {
  if (count <= 0) return summit;
  return Math.round(((index / count) * summit) / 10) * 10;
}

export function formatAltitude(metres: number): string {
  return `${metres.toLocaleString("en-US")} m`;
}
```

`src/lib/contact.ts`:
```ts
import type { Contact } from "@/data/site";

export type SocialLink = { network: "facebook" | "instagram"; label: string; href: string };

export function whatsappHref(number: string): string | null {
  const digits = number.replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function telHref(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.replace(/\D/g, "").length >= 6 ? `tel:${cleaned}` : null;
}

export function mailtoHref(email: string): string | null {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? `mailto:${trimmed}` : null;
}

export function hasDirectContact(contact: Contact): boolean {
  return Boolean(whatsappHref(contact.whatsapp) || telHref(contact.phone) || mailtoHref(contact.email));
}

export function socialLinks(contact: Contact): SocialLink[] {
  const candidates: SocialLink[] = [
    { network: "facebook", label: "Facebook", href: contact.social.facebook },
    { network: "instagram", label: "Instagram", href: contact.social.instagram },
  ];
  return candidates.filter((link) => link.href.startsWith("https://"));
}
```

(`import type` is erased by Node's type stripping, so the `@/` alias never reaches Node.)

`src/lib/nav.ts`:
```ts
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

- [ ] **Step 4: Run the helper tests**

Run: `npm test`
Expected: the altitude, contact and nav tests PASS (content test not written yet).

- [ ] **Step 5: Write the failing content test**

`tests/content.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { contact, heroPhoto, nav, SUMMIT_ALTITUDE_M, type Photo } from "../src/data/site.ts";
import { featuredTeas, getTea, otherTeas, teas } from "../src/data/teas.ts";
import { stages, storyPage } from "../src/data/story.ts";
import { grownPage, people, practices } from "../src/data/grown.ts";
import { contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage } from "../src/data/pages.ts";

const allContent = { contact, heroPhoto, nav, teas, stages, storyPage, grownPage, people, practices, contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage };

function collectPhotos(value: unknown, found: Photo[] = []): Photo[] {
  if (Array.isArray(value)) value.forEach((v) => collectPhotos(v, found));
  else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && typeof record.alt === "string") found.push(record as Photo);
    Object.values(record).forEach((v) => collectPhotos(v, found));
  }
  return found;
}

test("the five teas from the source article, in order", () => {
  assert.deepEqual(
    teas.map((t) => t.name),
    ["Chamomile", "Peppermint", "Lemon Verbena", "Sea Buckthorn", "Hypericum"],
  );
});

test("tea slugs are unique kebab-case", () => {
  const slugs = teas.map((t) => t.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const slug of slugs) assert.match(slug, /^[a-z]+(-[a-z]+)*$/);
});

test("featured teas are the three Brand Bhutan certified teas", () => {
  assert.deepEqual(featuredTeas.map((t) => t.slug), ["chamomile", "peppermint", "lemon-verbena"]);
});

test("getTea and otherTeas", () => {
  assert.equal(getTea("peppermint")?.name, "Peppermint");
  assert.equal(getTea("green-tea"), undefined);
  const others = otherTeas("peppermint");
  assert.equal(others.length, 4);
  assert.ok(others.every((t) => t.slug !== "peppermint"));
});

test("benefits stay empty until the client approves wording (update this test when they do)", () => {
  for (const tea of teas) assert.deepEqual(tea.benefits, [], tea.name);
});

test("every image referenced in content exists in public/ and has alt text", () => {
  const photos = [...collectPhotos(allContent), ...teas.map((t) => ({ src: t.image, alt: t.name }))];
  assert.ok(photos.length >= 20, `expected at least 20 photos, found ${photos.length}`);
  for (const photo of photos) {
    assert.ok(existsSync(join(process.cwd(), "public", photo.src)), `missing file ${photo.src}`);
    assert.ok(photo.alt.trim().length > 0, `empty alt for ${photo.src}`);
  }
});

test("the summit altitude matches the source article", () => {
  assert.equal(SUMMIT_ALTITUDE_M, 2750);
});

test("no Bumthang references remain in content", () => {
  assert.doesNotMatch(JSON.stringify(allContent), /bumthang/i);
});

test("the story has at least four stages, each with a heading and body", () => {
  assert.ok(stages.length >= 4);
  for (const stage of stages) {
    assert.ok(stage.heading.length > 0 && stage.body.length > 0, stage.id);
  }
});
```

- [ ] **Step 6: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/data/site.ts`.

- [ ] **Step 7: Create `src/data/site.ts`**

```ts
export const SITE_NAME = "Bhutan Herbal Tea";
export const TAGLINE = "Wellness in Every Sip.";
export const SITE_DESCRIPTION =
  "Certified organic herbal teas grown above 2,750 m in Thimphu, Bhutan. Hand-harvested at their peak and packaged without chemical additives.";
export const CLOSING_LINE = "Drink tea that heals you and heals the earth.";

// Netlify sets URL at build time. TODO: switch to the custom domain once the client has one.
export const SITE_URL = process.env.URL ?? "http://localhost:3000";

// Daily Bhutan (2023): herbs "grown and harvested above 9,000 feet (2750 meters)". TODO: client to confirm.
export const SUMMIT_ALTITUDE_M = 2750;

export const HOME_NAV_LABEL = "Home";

export type Photo = { src: string; alt: string };

// TODO: replace with the client's photo; update the alt text to describe the real image.
export const heroPhoto: Photo = {
  src: "/images/hero/thimphu-fields.jpg",
  alt: "Herb fields on a mountainside above Thimphu, Bhutan",
};

export type NavItem = { href: string; label: string };

export const nav: NavItem[] = [
  { href: "/our-story", label: "Our Story" },
  { href: "/teas", label: "Our Teas" },
  { href: "/how-its-grown", label: "How It's Grown" },
  { href: "/contact", label: "Contact" },
];

export type SocialLinks = { facebook: string; instagram: string };

export type Contact = {
  phone: string;
  whatsapp: string;
  email: string;
  social: SocialLinks;
  whereToBuy: string[];
};

export const contact: Contact = {
  phone: "", // TODO
  whatsapp: "", // TODO: international format, digits only, e.g. "975XXXXXXXX"
  email: "", // TODO
  social: {
    facebook: "https://www.facebook.com/herbaltea.bhutan/",
    instagram: "", // TODO
  },
  whereToBuy: [], // TODO: stockists or shops
};
```

- [ ] **Step 8: Create `src/data/teas.ts`**

```ts
export type Tea = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  benefits: string[]; // empty until the client supplies approved wording
  tasteNotes?: string; // only if the client provides it
  brewing?: string; // only if the client provides it
  image: string; // path under /public/images/teas/
  accent?: string; // optional colour from the box design
  featured?: boolean; // shown on the home page
};

// Descriptions use only facts from the Daily Bhutan (2023) article. TODO: client to supply final copy.
export const teas: Tea[] = [
  {
    slug: "chamomile",
    name: "Chamomile",
    shortDescription: "Chamomile flowers, grown slowly above 2,750 m in Thimphu.",
    description:
      "Chamomile flowers from our farm in Thimphu, grown above 2,750 m, hand-harvested at their peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/chamomile.jpg",
    featured: true,
  },
  {
    slug: "peppermint",
    name: "Peppermint",
    shortDescription: "Peppermint leaves, grown slowly above 2,750 m in Thimphu.",
    description:
      "Peppermint from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/peppermint.jpg",
    featured: true,
  },
  {
    slug: "lemon-verbena",
    name: "Lemon Verbena",
    shortDescription: "Lemon verbena leaves, grown slowly above 2,750 m in Thimphu.",
    description:
      "Lemon verbena from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/lemon-verbena.jpg",
    featured: true,
  },
  {
    slug: "sea-buckthorn",
    name: "Sea Buckthorn",
    shortDescription: "Sea buckthorn, grown slowly above 2,750 m in Thimphu.",
    description:
      "Sea buckthorn from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and packaged without chemical additives.",
    benefits: [],
    image: "/images/teas/sea-buckthorn.jpg",
  },
  {
    slug: "hypericum",
    name: "Hypericum",
    shortDescription: "Hypericum, grown slowly above 2,750 m in Thimphu.",
    description:
      "Hypericum from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and packaged without chemical additives.",
    benefits: [],
    image: "/images/teas/hypericum.jpg",
  },
];

export const featuredTeas: Tea[] = teas.filter((tea) => tea.featured);

export function getTea(slug: string): Tea | undefined {
  return teas.find((tea) => tea.slug === slug);
}

export function otherTeas(slug: string): Tea[] {
  return teas.filter((tea) => tea.slug !== slug);
}
```

- [ ] **Step 9: Create `src/data/story.ts`**

```ts
import type { Photo } from "./site";

export type ClimbStageData = {
  id: string;
  heading: string;
  body: string;
  image: Photo;
};

export const storyPage = {
  meta: {
    title: "Our Story",
    description:
      "From a meeting in New York to Bhutan's first herbal tea farm: climb from sea level to our fields above 2,750 m in Thimphu.",
  },
  hero: {
    eyebrow: "Our story",
    title: "Grown higher",
    intro: "Scroll to climb, from sea level to our fields above 2,750 metres.",
    image: { src: "/images/fields/farm.jpg", alt: "The Bhutan Herbal Tea farm in the hills of Thimphu" },
  },
  stageLabel: "Stage",
  summit: {
    eyebrow: "The summit",
    heading: "You've reached the summit",
    body: "This is where our herbs grow: slowly, in the clean mountain air above Thimphu.",
    teasLabel: "Meet our teas",
    grownLabel: "How it's grown",
    image: { src: "/images/story/summit.jpg", alt: "Mountain ridges above the herb fields at sunset" },
  },
};

// Facts from Daily Bhutan (2023). TODO: client to review wording.
export const stages: ClimbStageData[] = [
  {
    id: "new-york",
    heading: "It began in New York",
    body: "Rinzin Wangchuk and Wangchuk Kuenga first crossed paths in New York, at a Bhutanese New Year gathering in 2007.",
    image: { src: "/images/story/stage-1.jpg", alt: "City lights at dusk" },
  },
  {
    id: "thimphu",
    heading: "Back home in Thimphu",
    body: "In 2015 they met again in Thimphu, and the idea of growing herbal tea in Bhutan began to take shape.",
    image: { src: "/images/story/stage-2.jpg", alt: "The Thimphu valley" },
  },
  {
    id: "founded",
    heading: "Bhutan's first herbal tea farm",
    body: "Bhutan Herbal Tea was founded in March 2016: the first and only herbal tea farm in Bhutan.",
    image: { src: "/images/story/stage-3.jpg", alt: "Young herb plants in rows on the farm" },
  },
  {
    id: "altitude",
    heading: "Above 2,750 metres",
    body: "Our herbs are grown and harvested above 9,000 feet. Up here, in the cool mountain air, they grow slowly.",
    image: { src: "/images/story/stage-4.jpg", alt: "High slopes above the farm" },
  },
  {
    id: "volatile-oils",
    heading: "Slow growth builds character",
    body: "Growing slowly, the plants build up more of the volatile oils that carry their flavour and fragrance.",
    image: { src: "/images/story/stage-5.jpg", alt: "Close-up of herb leaves" },
  },
  {
    id: "in-the-cup",
    heading: "Richer in every cup",
    body: "You can taste the altitude: richer flavour, deeper aroma and more nutrients in every cup.",
    image: { src: "/images/story/stage-6.jpg", alt: "A cup of herbal tea" },
  },
];
```

- [ ] **Step 10: Create `src/data/grown.ts`**

```ts
import type { Photo } from "./site";

export type Practice = { title: string; body: string };
export type Person = { image: Photo; caption: string };

export const grownPage = {
  meta: {
    title: "How It's Grown",
    description:
      "Organic and regenerative farming in Thimphu: hand-harvested herbs, carefully dried and packaged without chemical additives.",
  },
  hero: {
    eyebrow: "How it's grown",
    title: "Grown with care",
    intro: "Organic, hand-harvested and carefully dried on Bhutan's first herbal tea farm.",
    image: { src: "/images/fields/herb-rows.jpg", alt: "Rows of herbs growing on the farm" },
  },
  practicesSection: { eyebrow: "Our practices", heading: "From soil to sip" },
  peopleSection: {
    eyebrow: "The people",
    heading: "The hands behind every cup",
    intro: "The people who plant, tend and harvest our herbs.",
  },
  closingImage: { src: "/images/fields/drying.jpg", alt: "Herbs laid out to dry" },
};

export const practices: Practice[] = [
  {
    title: "Organic and regenerative",
    body: "We farm organically and regeneratively, protecting soil health, biodiversity and the purity of the land. All five teas are certified organic.",
  },
  { title: "Hand-harvested", body: "Every herb is picked by hand, at its peak." },
  { title: "Carefully dried", body: "Herbs are carefully dried, then packaged without any chemical additives." },
  { title: "Small batches", body: "Each tea is crafted in small batches on our farm in Thimphu." },
];

// TODO: replace with the client's photos of the farmers and add their captions.
// Captions render only when filled in.
export const people: Person[] = [
  { image: { src: "/images/people/farmer-1.jpg", alt: "A farmer harvesting herbs by hand" }, caption: "" },
  { image: { src: "/images/people/farmer-2.jpg", alt: "A farmer tending young herb plants" }, caption: "" },
  { image: { src: "/images/people/farmer-3.jpg", alt: "A farmer carrying a basket of herbs" }, caption: "" },
  { image: { src: "/images/people/farmer-4.jpg", alt: "Farmers working in the herb fields" }, caption: "" },
];
```

- [ ] **Step 11: Create `src/data/pages.ts`**

```ts
import type { Photo } from "./site";

type Hero = { eyebrow: string; title: string; intro: string; image: Photo };

export const homeCopy = {
  scrollHint: "Scroll to begin",
  teaser: {
    eyebrow: "Grown higher",
    heading: "Above 2,750 metres, everything grows a little slower.",
    body: "Slow growth lets our herbs build up more of the volatile oils that carry flavour, aroma and nutrients.",
    linkLabel: "Discover our story",
  },
  featured: {
    eyebrow: "Our teas",
    heading: "Brand Bhutan certified",
    body: "Chamomile, Peppermint and Lemon Verbena carry Brand Bhutan certification. All five of our teas are certified organic.",
    linkLabel: "See all teas",
  },
  grown: {
    eyebrow: "Grown with care",
    heading: "Hand-harvested at their peak",
    body: "Organic and regenerative farming, carefully dried herbs, and nothing added.",
    linkLabel: "How it's grown",
    image: { src: "/images/people/farmer-1.jpg", alt: "A farmer harvesting herbs by hand" },
  },
  cta: {
    heading: "Get in touch",
    body: "Questions about our teas, or where to find them? We'd love to hear from you.",
    linkLabel: "Contact us",
  },
};

export const teasPage: { meta: { title: string; description: string }; hero: Hero } = {
  meta: {
    title: "Our Teas",
    description: "Five certified organic herbal teas grown above 2,750 m in Thimphu, Bhutan.",
  },
  hero: {
    eyebrow: "Our teas",
    title: "Five teas, grown higher",
    intro: "Certified organic herbal teas from our farm in Thimphu.",
    image: { src: "/images/fields/drying.jpg", alt: "Herbs laid out to dry" },
  },
};

export const teaDetailCopy = {
  eyebrow: "Certified organic · Thimphu",
  benefitsHeading: "Benefits",
  tasteHeading: "Taste notes",
  brewingHeading: "Brewing",
  imageAltSuffix: "tea",
  whereToBuy: {
    heading: "Where to buy",
    body: "Find our teas at our stockists, or get in touch with us directly.",
    linkLabel: "Where to buy",
  },
  otherTeasHeading: "Other teas",
};

export const contactPage = {
  meta: {
    title: "Contact",
    description: "Where to buy Bhutan Herbal Tea and how to get in touch.",
  },
  hero: {
    eyebrow: "Contact",
    title: "Get in touch",
    intro: "Where to find our teas, and how to reach us.",
    image: { src: "/images/fields/farm.jpg", alt: "The Bhutan Herbal Tea farm in the hills of Thimphu" },
  } satisfies Hero,
  sideImage: { src: "/images/fields/herb-rows.jpg", alt: "Rows of herbs growing on the farm" },
  getInTouchHeading: "Talk to us",
  comingSoon: "Contact details coming soon.",
  followHeading: "Follow us",
  whereToBuyHeading: "Where to buy",
  whereToBuyComingSoon: "Stockists coming soon.",
  whatsappLabel: "Message us on WhatsApp",
};

export const notFoundCopy = {
  title: "Page not found",
  eyebrow: "404 · Off the trail",
  heading: "This path doesn't lead anywhere",
  body: "The page you were looking for isn't here. Let's get you back on the trail.",
  homeLabel: "Back to home",
  teasLabel: "See our teas",
  image: { src: "/images/story/summit.jpg", alt: "Mountain ridges above the herb fields at sunset" },
};
```

- [ ] **Step 12: Run all tests**

Run: `npm test`
Expected: all tests in `altitude`, `contact`, `nav`, `content` PASS (a `MODULE_TYPELESS_PACKAGE_JSON` warning is harmless).

- [ ] **Step 13: Lint, build, commit**

Run: `npm run lint; npm run build`
Expected: no errors.
```powershell
git add src/lib src/data tests
git commit -m "Add typed content data and tested helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Shared UI and the site layout (header, mobile menu, footer, 404)

**Files:**
- Create: `src/components/ui/{ButtonLink,ArrowLink,Section,Reveal,PageHero,WhatsAppButton,SocialIcons,SocialLinks,Wordmark,Logo}.tsx`
- Create: `src/components/layout/{Header,MobileMenu,Footer,SkipLink,MotionProvider}.tsx`
- Create: `src/app/template.tsx`, `src/app/not-found.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Task 1 classes, `cn`, `buttonVariants`, `Sheet*`; Task 3 data and helpers.
- Produces (used by Tasks 5–9):
  - `<ButtonLink href variant? size?>` (internal links styled as buttons; default `size="lg"`)
  - `<ArrowLink href>{label}</ArrowLink>`
  - `<Section className? bleed? id? aria-labelledby?>` (vertical rhythm `py-20 md:py-28 xl:py-36`, wraps children in `container-page` unless `bleed`)
  - `<Reveal className? delay? as?: "div" | "li">`
  - `<PageHero eyebrow? title intro? image />` (renders the page `h1`, preloads its image)
  - `<WhatsAppButton className? label />` (renders nothing when no number)
  - `<SocialLinks className? />` (renders nothing when no links)
  - `<Logo className sizes eager? />`, `<Wordmark className? />`

- [ ] **Step 1: Create the small UI pieces**

`src/components/ui/ButtonLink.tsx`:
```tsx
import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size = "lg", ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

`src/components/ui/ArrowLink.tsx`:
```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ArrowLinkProps = { href: string; children: ReactNode; className?: string };

export function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-saffron underline-offset-8 hover:underline",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
```

`src/components/ui/Section.tsx`:
```tsx
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section"> & { bleed?: boolean };

export function Section({ className, bleed = false, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 md:py-28 xl:py-36", className)} {...props}>
      {bleed ? children : <div className="container-page">{children}</div>}
    </section>
  );
}
```

`src/components/ui/Reveal.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
};

// Fades content in as it enters the viewport. Use below the fold only:
// server HTML starts at opacity 0 (the <noscript> rule in layout.tsx covers no-JS visitors).
// MotionConfig reducedMotion="user" (MotionProvider) drops the lift for reduced-motion users.
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}
```

`src/components/ui/PageHero.tsx`:
```tsx
import Image from "next/image";
import type { Photo } from "@/data/site";

type PageHeroProps = { eyebrow?: string; title: string; intro?: string; image: Photo };

export function PageHero({ eyebrow, title, intro, image }: PageHeroProps) {
  return (
    <div className="relative flex h-[55svh] min-h-[24rem] items-end overflow-hidden md:h-[60svh] xl:h-[65svh]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink to-transparent" />
      <div className="container-page relative pb-10 md:pb-14 xl:pb-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-serif text-display text-mist">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lead text-mist/80">{intro}</p>}
      </div>
    </div>
  );
}
```

`src/components/ui/SocialIcons.tsx`:
```tsx
import type { SVGProps } from "react";

// lucide-react 1.x no longer ships brand icons; these match its 24px stroke style.
const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
```

`src/components/ui/SocialLinks.tsx`:
```tsx
import { contact, SITE_NAME } from "@/data/site";
import { socialLinks } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const icons = { facebook: FacebookIcon, instagram: InstagramIcon };

export function SocialLinks({ className }: { className?: string }) {
  const links = socialLinks(contact);
  if (links.length === 0) return null;
  return (
    <ul className={cn("flex gap-3", className)}>
      {links.map((link) => {
        const Icon = icons[link.network];
        return (
          <li key={link.network}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE_NAME} on ${link.label}`}
              className="inline-flex size-11 items-center justify-center rounded-full border border-mist/25 text-mist transition-colors hover:border-saffron hover:text-saffron"
            >
              <Icon className="size-5" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
```

`src/components/ui/WhatsAppButton.tsx`:
```tsx
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { contact } from "@/data/site";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = { label: string; className?: string };

export function WhatsAppButton({ label, className }: WhatsAppButtonProps) {
  const href = whatsappHref(contact.whatsapp);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size: "lg" }), className)}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}
```

`src/components/ui/Wordmark.tsx`:
```tsx
import Link from "next/link";
import { SITE_NAME } from "@/data/site";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME}, home`}
      className={cn("font-serif text-xl tracking-wide text-mist md:text-2xl", className)}
    >
      {SITE_NAME}
    </Link>
  );
}
```

`src/components/ui/Logo.tsx`:
```tsx
import Image from "next/image";
import logo from "../../../public/logo.png";
import { SITE_NAME } from "@/data/site";

type LogoProps = { className?: string; sizes: string; eager?: boolean };

export function Logo({ className, sizes, eager = false }: LogoProps) {
  return (
    <Image
      src={logo}
      alt={`${SITE_NAME} logo`}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
```

- [ ] **Step 2: Create the layout pieces**

`src/components/layout/MotionProvider.tsx`:
```tsx
"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

`src/components/layout/SkipLink.tsx`:
```tsx
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-3 focus:text-ink"
    >
      {label}
    </a>
  );
}
```

`src/components/layout/MobileMenu.tsx`:
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HOME_NAV_LABEL, nav, SITE_NAME, TAGLINE } from "@/data/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

const items = [{ href: "/", label: HOME_NAV_LABEL }, ...nav];

// shadcn Sheet (Base UI Dialog) provides the focus trap, Escape to close,
// scroll lock and focus return to the trigger.
export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex size-11 items-center justify-center rounded-full text-mist transition-colors hover:bg-mist/10 xl:hidden"
      >
        <Menu className="size-6" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="inset-0 h-svh w-full gap-0 border-0 bg-ink p-0 text-mist motion-reduce:transition-none data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <div className="container-page flex h-16 shrink-0 items-center justify-between">
          <SheetTitle className="font-serif text-xl text-mist md:text-2xl">{SITE_NAME}</SheetTitle>
          <SheetClose
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-mist/10"
          >
            <X className="size-6" aria-hidden />
          </SheetClose>
        </div>
        <nav aria-label="Main" className="container-page flex flex-1 flex-col justify-center">
          <ul className="space-y-1 md:space-y-3">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-2 font-serif text-4xl transition-colors md:text-6xl",
                      active ? "text-saffron" : "text-mist hover:text-saffron",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="container-page pb-10 font-serif text-xl text-mist/70 italic">{TAGLINE}</p>
      </SheetContent>
    </Sheet>
  );
}
```

`src/components/layout/Header.tsx`:
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { nav } from "@/data/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500",
        solid ? "border-border bg-ink/95" : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between xl:h-20">
        <Wordmark />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex gap-10">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-sm tracking-wide transition-colors hover:text-mist",
                      active
                        ? "text-mist after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-saffron"
                        : "text-mist/75",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <MobileMenu pathname={pathname} />
      </div>
    </header>
  );
}
```

`src/components/layout/Footer.tsx`:
```tsx
import Link from "next/link";
import { nav, SITE_NAME, TAGLINE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-12 py-16 text-center md:grid-cols-2 md:gap-x-12 md:text-left xl:grid-cols-3 xl:py-20">
        <div className="flex flex-col items-center gap-5 md:row-span-2 md:items-start xl:row-span-1">
          <Logo className="h-auto w-32" sizes="128px" />
          <p className="font-serif text-2xl text-mist">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-mist/75 transition-colors hover:text-saffron">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-5 md:items-start">
          <SocialLinks />
          <p className="text-sm text-muted-foreground">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Replace `src/app/layout.tsx` with the full layout**

```tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from "@/data/site";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SkipLink } from "@/components/layout/SkipLink";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · ${TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_GB" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-svh">
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <MotionProvider>
          <SkipLink label="Skip to content" />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create `src/app/template.tsx`**

```tsx
import type { ReactNode } from "react";

// Re-mounts on every navigation, replaying the CSS fade (disabled under reduced motion).
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
```

- [ ] **Step 5: Create `src/app/not-found.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFoundCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: notFoundCopy.title };

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh items-center overflow-hidden py-28">
      <Image
        src={notFoundCopy.image.src}
        alt={notFoundCopy.image.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/65" />
      <div className="container-page relative">
        <p className="eyebrow">{notFoundCopy.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-display text-mist">{notFoundCopy.heading}</h1>
        <p className="mt-6 max-w-xl text-lead text-mist/80">{notFoundCopy.body}</p>
        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <ButtonLink href="/">{notFoundCopy.homeLabel}</ButtonLink>
          <ButtonLink href="/teas" variant="outline">
            {notFoundCopy.teasLabel}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: no errors; tests pass; build lists `○ /` and `○ /_not-found`.

- [ ] **Step 7: Browser checks (header, menu, footer, 404)**

Run `npm run dev` in the background. With Playwright:
1. `browser_resize` 375×812, `browser_navigate` `http://localhost:3000/does-not-exist`, `browser_take_screenshot`. Expected: branded 404 with photo, serif heading, two buttons stacked full width; header shows the wordmark and a hamburger.
2. `browser_press_key` Tab once. Expected (`browser_snapshot`): the "Skip to content" link is focused and visible.
3. Click "Open menu". Expected: full-screen ink menu, links Home / Our Story / Our Teas / How It's Grown / Contact in large serif; `browser_snapshot` shows the trigger with `aria-expanded="true"` and a dialog.
4. Press Tab repeatedly (8×). Expected: focus stays inside the menu (focus trap). Press Escape. Expected: menu closes, focus returns to the hamburger.
5. Resize to 768×1024 and repeat step 3. Expected: same menu, larger link sizes.
6. Resize to 1280×800, navigate to `/does-not-exist`. Expected: inline nav links visible, no hamburger; buttons side by side; footer in three columns.
7. Screenshot the footer at 375, 768 and 1280. Expected: stacked and centred / two columns / three columns; Facebook icon present (the only filled social link).
Stop the dev server.

- [ ] **Step 8: Commit**

```powershell
git add src
git commit -m "Add site layout, mobile menu, shared UI and 404 page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Home page

**Files:**
- Create: `src/components/home/{Hero,StoryTeaser,FeaturedTeas,GrownStrip,ContactCta}.tsx`, `src/components/teas/TeaCard.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: Task 4 UI pieces; `heroPhoto`, `TAGLINE`, `homeCopy`, `featuredTeas`, `contactPage.whatsappLabel`.
- Produces: `<TeaCard tea sizes />` (used again in Task 7).

- [ ] **Step 1: Create `src/components/teas/TeaCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Tea } from "@/data/teas";
import { teaDetailCopy } from "@/data/pages";

type TeaCardProps = { tea: Tea; sizes: string };

export function TeaCard({ tea, sizes }: TeaCardProps) {
  return (
    <Link href={`/teas/${tea.slug}`} className="group block rounded-md">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-card">
        <Image
          src={tea.image}
          alt={`${tea.name} ${teaDetailCopy.imageAltSuffix}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-5 font-serif text-2xl text-leaf md:text-[1.75rem]">{tea.name}</h3>
      <p className="mt-2 text-mist/75">{tea.shortDescription}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Create `src/components/home/Hero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { heroPhoto, TAGLINE } from "@/data/site";
import { homeCopy } from "@/data/pages";
import { Logo } from "@/components/ui/Logo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-svh min-h-[34rem] items-center justify-center overflow-hidden"
    >
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div aria-hidden className="mist-layer" />
      <div aria-hidden className="mist-layer mist-layer--slow" />
      <div className="relative flex flex-col items-center px-5 pt-16 text-center">
        <Logo
          eager
          className="h-auto w-40 md:w-[13.75rem] xl:w-[16.25rem]"
          sizes="(min-width: 1280px) 260px, (min-width: 768px) 220px, 160px"
        />
        <h1 className="mt-8 font-serif text-display text-mist">{TAGLINE}</h1>
      </div>
      <a
        href="#story-teaser"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.25em] text-mist/80 uppercase transition-colors hover:text-saffron"
      >
        {homeCopy.scrollHint}
        <ChevronDown className="size-5" aria-hidden />
      </a>
    </section>
  );
}
```

- [ ] **Step 3: Create the other home sections**

`src/components/home/StoryTeaser.tsx`:
```tsx
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function StoryTeaser() {
  const { eyebrow, heading, body, linkLabel } = homeCopy.teaser;
  return (
    <Section id="story-teaser" aria-labelledby="story-teaser-heading" className="scroll-mt-16">
      <div className="grid gap-8 xl:grid-cols-[1.25fr_1fr] xl:items-end xl:gap-20">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="story-teaser-heading" className="mt-4 max-w-3xl font-serif text-title text-mist">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col items-start gap-6">
          <p className="max-w-xl text-lead text-mist/80">{body}</p>
          <ArrowLink href="/our-story">{linkLabel}</ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}
```

`src/components/home/FeaturedTeas.tsx`:
```tsx
import { featuredTeas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TeaCard } from "@/components/teas/TeaCard";

export function FeaturedTeas() {
  const { eyebrow, heading, body, linkLabel } = homeCopy.featured;
  return (
    <Section aria-labelledby="featured-heading" className="border-t border-border">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="featured-heading" className="mt-4 font-serif text-title text-mist">
          {heading}
        </h2>
        <p className="mt-5 text-lead text-mist/80">{body}</p>
      </Reveal>
      <ul
        aria-label={heading}
        className="scroll-row -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 xl:gap-8"
      >
        {featuredTeas.map((tea) => (
          <li key={tea.slug} className="w-[78%] shrink-0 snap-start md:w-auto">
            <TeaCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 33vw, 78vw" />
          </li>
        ))}
      </ul>
      <ArrowLink href="/teas" className="mt-10">
        {linkLabel}
      </ArrowLink>
    </Section>
  );
}
```

`src/components/home/GrownStrip.tsx`:
```tsx
import Image from "next/image";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function GrownStrip() {
  const { eyebrow, heading, body, linkLabel, image } = homeCopy.grown;
  return (
    <Section aria-labelledby="grown-strip-heading">
      <div className="grid overflow-hidden rounded-md bg-card md:grid-cols-2 xl:grid-cols-[3fr_2fr]">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[28rem] xl:min-h-[34rem]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <Reveal className="flex flex-col items-start justify-center gap-5 p-8 md:p-10 xl:p-14">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="grown-strip-heading" className="font-serif text-title text-mist">
            {heading}
          </h2>
          <p className="text-lead text-mist/80">{body}</p>
          <ArrowLink href="/how-its-grown">{linkLabel}</ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}
```

`src/components/home/ContactCta.tsx`:
```tsx
import { contactPage, homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ContactCta() {
  const { heading, body, linkLabel } = homeCopy.cta;
  return (
    <Section aria-labelledby="contact-cta-heading" className="border-t border-border text-center">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h2 id="contact-cta-heading" className="font-serif text-title text-mist">
          {heading}
        </h2>
        <p className="text-lead text-mist/80">{body}</p>
        <div className="mt-2 flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <WhatsAppButton label={contactPage.whatsappLabel} className="w-full md:w-auto" />
          <ButtonLink href="/contact" variant="outline" className="w-full md:w-auto">
            {linkLabel}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 4: Replace `src/app/page.tsx`**

```tsx
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedTeas } from "@/components/home/FeaturedTeas";
import { GrownStrip } from "@/components/home/GrownStrip";
import { Hero } from "@/components/home/Hero";
import { StoryTeaser } from "@/components/home/StoryTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StoryTeaser />
      <FeaturedTeas />
      <GrownStrip />
      <ContactCta />
    </>
  );
}
```

- [ ] **Step 5: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: no errors.

- [ ] **Step 6: Phone review (375×812)**

`npm run dev` in background; Playwright `browser_resize` 375×812, navigate to `/`, full-page screenshot.
Expected: full-height hero with logo (~160 px), tagline in large serif, "Scroll to begin" at the bottom; teaser single column; three tea cards in a horizontal row with the next card peeking; grown strip photo above text; CTA with a full-width "Contact us" button (WhatsApp hidden because the number is empty).

- [ ] **Step 7: Tablet and desktop review**

Resize to 768×1024 and 1280×800, full-page screenshot each.
Expected tablet: logo ~220 px; three tea cards in a 3-column grid; grown strip 50/50 side by side.
Expected desktop: logo ~260 px; teaser in two columns (heading left, body + link right); grown strip 60/40; inline header nav, header turns solid ink after scrolling.

- [ ] **Step 8: Short landscape phone (Review Focus 3)**

Resize to 667×375, navigate to `/`, screenshot, then scroll down 400 px and screenshot.
Expected: hero is taller than the viewport (min-height 34rem) so the logo and tagline are fully visible and not under the header; the page scrolls normally to the teaser.

- [ ] **Step 9: Server HTML shows the hero heading (Review Focus 4)**

Stop dev; run `npm run build; npm run start` (background), then:
```powershell
$html = (Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).Content
[regex]::Match($html, '<h1[^>]*>[^<]*</h1>').Value
```
Expected: prints `<h1 class="mt-8 font-serif text-display text-mist">Wellness in Every Sip.</h1>`, with no `style="opacity:0"` on the tag. Stop the server.

- [ ] **Step 10: Commit**

```powershell
git add src
git commit -m "Build the home page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Our Story page with the altitude marker

**Files:**
- Create: `src/components/story/{ClimbTrack,AltitudeMarker,ClimbStage,Summit}.tsx`, `src/app/our-story/page.tsx`

**Interfaces:**
- Consumes: `altitudeAt`, `stageAltitude`, `formatAltitude`, `SUMMIT_ALTITUDE_M`, `stages`, `storyPage`, `PageHero`, `Reveal`, `ButtonLink`.

- [ ] **Step 1: Create `src/components/story/AltitudeMarker.tsx`**

```tsx
"use client";

import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { altitudeAt, formatAltitude } from "@/lib/altitude";

type AltitudeMarkerProps = { progress: MotionValue<number>; summit: number };

// Decorative: each stage's eyebrow states its altitude in text, so this is aria-hidden.
export function AltitudeMarker({ progress, summit }: AltitudeMarkerProps) {
  const reduce = useReducedMotion();
  const smooth = useSpring(progress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const source = reduce ? progress : smooth;
  const label = useTransform(source, (p) => formatAltitude(altitudeAt(p, summit)));

  return (
    <div aria-hidden>
      {/* Desktop: thin vertical bar on the right edge, value beside its top */}
      <div className="pointer-events-none fixed top-1/2 right-8 z-30 hidden h-[50vh] -translate-y-1/2 items-start gap-4 xl:flex">
        <motion.span className="-mt-2 font-serif text-xl text-saffron tabular-nums">{label}</motion.span>
        <div className="relative h-full w-px bg-mist/20">
          <motion.div className="absolute inset-0 origin-bottom bg-saffron" style={{ scaleY: source }} />
        </div>
      </div>
      {/* Phone and tablet: slim line along the bottom, value in a pill */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 xl:hidden">
        <motion.span className="absolute right-4 bottom-3 rounded-full bg-ink/85 px-3 py-1 text-sm text-saffron tabular-nums ring-1 ring-saffron/40">
          {label}
        </motion.span>
        <div className="h-0.5 w-full bg-mist/15">
          <motion.div className="h-full origin-left bg-saffron" style={{ scaleX: source }} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/story/ClimbTrack.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "framer-motion";
import { AltitudeMarker } from "@/components/story/AltitudeMarker";

type ClimbTrackProps = { children: ReactNode; summit: number };

// Progress runs from the first stage reaching mid-screen (0) to the summit's end reaching the bottom (1).
export function ClimbTrack({ children, summit }: ClimbTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end end"] });
  return (
    <div ref={ref} className="relative">
      {children}
      <AltitudeMarker progress={scrollYProgress} summit={summit} />
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/story/ClimbStage.tsx`**

```tsx
import Image from "next/image";
import type { ClimbStageData } from "@/data/story";
import { storyPage } from "@/data/story";
import { formatAltitude } from "@/lib/altitude";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type ClimbStageProps = { stage: ClimbStageData; index: number; altitude: number };

export function ClimbStage({ stage, index, altitude }: ClimbStageProps) {
  const headingId = `stage-${stage.id}`;
  const number = String(index + 1).padStart(2, "0");
  return (
    <section aria-labelledby={headingId} className="py-14 md:py-20 xl:py-28">
      <div className="container-page grid items-center gap-8 md:gap-10 xl:grid-cols-2 xl:gap-20">
        <div
          className={cn(
            "relative h-[40svh] overflow-hidden rounded-md md:h-[45svh] xl:h-[70svh]",
            index % 2 === 1 && "xl:order-2",
          )}
        >
          <Image
            src={stage.image.src}
            alt={stage.image.alt}
            fill
            sizes="(min-width: 1280px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <Reveal className="max-w-xl">
          <p className="eyebrow">{`${storyPage.stageLabel} ${number} · ${formatAltitude(altitude)}`}</p>
          <h2 id={headingId} className="mt-4 font-serif text-title text-mist">
            {stage.heading}
          </h2>
          <p className="mt-5 text-lead text-mist/80">{stage.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/components/story/Summit.tsx`**

```tsx
import Image from "next/image";
import { SUMMIT_ALTITUDE_M } from "@/data/site";
import { storyPage } from "@/data/story";
import { formatAltitude } from "@/lib/altitude";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";

export function Summit() {
  const { eyebrow, heading, body, teasLabel, grownLabel, image } = storyPage.summit;
  return (
    <section
      aria-labelledby="summit-heading"
      className="relative flex min-h-[80svh] items-center overflow-hidden py-24 text-center xl:min-h-svh"
    >
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/60" />
      <Reveal className="container-page relative flex flex-col items-center gap-6">
        <p className="eyebrow">{`${eyebrow} · ${formatAltitude(SUMMIT_ALTITUDE_M)}`}</p>
        <h2 id="summit-heading" className="max-w-3xl font-serif text-display text-mist">
          {heading}
        </h2>
        <p className="max-w-xl text-lead text-mist/85">{body}</p>
        <div className="mt-4 flex w-full flex-col gap-4 md:w-auto md:flex-row">
          <ButtonLink href="/teas">{teasLabel}</ButtonLink>
          <ButtonLink href="/how-its-grown" variant="outline">
            {grownLabel}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/app/our-story/page.tsx`**

```tsx
import type { Metadata } from "next";
import { SUMMIT_ALTITUDE_M } from "@/data/site";
import { stages, storyPage } from "@/data/story";
import { stageAltitude } from "@/lib/altitude";
import { PageHero } from "@/components/ui/PageHero";
import { ClimbStage } from "@/components/story/ClimbStage";
import { ClimbTrack } from "@/components/story/ClimbTrack";
import { Summit } from "@/components/story/Summit";

export const metadata: Metadata = {
  title: storyPage.meta.title,
  description: storyPage.meta.description,
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero {...storyPage.hero} />
      <ClimbTrack summit={SUMMIT_ALTITUDE_M}>
        {stages.map((stage, index) => (
          <ClimbStage
            key={stage.id}
            stage={stage}
            index={index}
            altitude={stageAltitude(index, stages.length, SUMMIT_ALTITUDE_M)}
          />
        ))}
        <Summit />
      </ClimbTrack>
    </>
  );
}
```

- [ ] **Step 6: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: no errors; build lists `○ /our-story`.

- [ ] **Step 7: Review at all three widths**

`npm run dev`; Playwright at 375×812, 768×1024, 1280×800 on `/our-story`:
- At the top: marker reads `0 m`.
- Scroll to the middle (`browser_evaluate` `window.scrollTo(0, document.body.scrollHeight / 2)`, wait 1 s): marker reads roughly 1,200–1,600 m; on phone/tablet the bottom line is about half filled; on desktop the right-edge bar is about half filled.
- Scroll to the bottom: marker reads `2,750 m`; summit section shows "You've reached the summit · 2,750 m" eyebrow and two buttons.
- Desktop: stages alternate image left/right. Phone/tablet: image band above text.
- Stage eyebrows read `Stage 01 · 0 m` … `Stage 06 · 2,290 m`.

- [ ] **Step 8: Commit**

```powershell
git add src
git commit -m "Build the Our Story climb with altitude marker

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Our Teas and tea detail pages

**Files:**
- Create: `src/components/teas/{TeaGrid,TeaDetail}.tsx`, `src/app/teas/page.tsx`, `src/app/teas/[slug]/page.tsx`

**Interfaces:**
- Consumes: `TeaCard`, `teas`, `getTea`, `otherTeas`, `teasPage`, `teaDetailCopy`, `PageHero`, `Section`, `Reveal`, `ButtonLink`.

- [ ] **Step 1: Create `src/components/teas/TeaGrid.tsx`**

```tsx
import type { Tea } from "@/data/teas";
import { Reveal } from "@/components/ui/Reveal";
import { TeaCard } from "@/components/teas/TeaCard";

export function TeaGrid({ teas }: { teas: Tea[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
      {teas.map((tea, index) => (
        <Reveal as="li" key={tea.slug} delay={(index % 3) * 0.08}>
          <TeaCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" />
        </Reveal>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Create `src/components/teas/TeaDetail.tsx`**

```tsx
import Image from "next/image";
import { Leaf } from "lucide-react";
import type { Tea } from "@/data/teas";
import { teaDetailCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TeaCard } from "@/components/teas/TeaCard";

type TeaDetailProps = { tea: Tea; others: Tea[] };

export function TeaDetail({ tea, others }: TeaDetailProps) {
  const copy = teaDetailCopy;
  return (
    <article className="pt-24 xl:pt-32">
      <div className="container-page grid gap-10 md:gap-12 xl:grid-cols-[45fr_55fr] xl:gap-20">
        <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-md bg-card md:w-[70%] xl:sticky xl:top-28 xl:w-full xl:self-start">
          <Image
            src={tea.image}
            alt={`${tea.name} ${copy.imageAltSuffix}`}
            fill
            preload
            sizes="(min-width: 1280px) 45vw, (min-width: 768px) 70vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-10 xl:py-8">
          <header>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-display text-leaf">{tea.name}</h1>
            <p className="mt-6 text-lead text-mist/85">{tea.description}</p>
          </header>
          {tea.benefits.length > 0 && (
            <section aria-labelledby="benefits-heading">
              <h2 id="benefits-heading" className="font-serif text-3xl text-mist">
                {copy.benefitsHeading}
              </h2>
              <ul className="mt-4 space-y-3">
                {tea.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-mist/85">
                    <Leaf className="mt-1 size-4 shrink-0 text-leaf" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {tea.tasteNotes && (
            <section aria-labelledby="taste-heading">
              <h2 id="taste-heading" className="font-serif text-3xl text-mist">
                {copy.tasteHeading}
              </h2>
              <p className="mt-4 text-mist/85">{tea.tasteNotes}</p>
            </section>
          )}
          {tea.brewing && (
            <section aria-labelledby="brewing-heading">
              <h2 id="brewing-heading" className="font-serif text-3xl text-mist">
                {copy.brewingHeading}
              </h2>
              <p className="mt-4 text-mist/85">{tea.brewing}</p>
            </section>
          )}
          <section aria-labelledby="buy-heading" className="rounded-md border border-border p-6 md:p-8">
            <h2 id="buy-heading" className="font-serif text-3xl text-mist">
              {copy.whereToBuy.heading}
            </h2>
            <p className="mt-3 text-mist/80">{copy.whereToBuy.body}</p>
            <ButtonLink href="/contact#where-to-buy" className="mt-6 w-full md:w-auto">
              {copy.whereToBuy.linkLabel}
            </ButtonLink>
          </section>
        </div>
      </div>

      <section aria-labelledby="other-teas-heading" className="py-20 md:py-28">
        <div className="container-page">
          <h2 id="other-teas-heading" className="font-serif text-title text-mist">
            {copy.otherTeasHeading}
          </h2>
          <ul className="scroll-row -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:scroll-px-10 md:gap-5 md:px-10 xl:mx-0 xl:grid xl:grid-cols-4 xl:gap-8 xl:overflow-visible xl:px-0">
            {others.map((other) => (
              <li key={other.slug} className="w-[62%] shrink-0 snap-start md:w-[38%] xl:w-auto">
                <TeaCard tea={other} sizes="(min-width: 1280px) 280px, (min-width: 768px) 38vw, 62vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
```

- [ ] **Step 3: Create `src/app/teas/page.tsx`**

```tsx
import type { Metadata } from "next";
import { teas } from "@/data/teas";
import { teasPage } from "@/data/pages";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TeaGrid } from "@/components/teas/TeaGrid";

export const metadata: Metadata = {
  title: teasPage.meta.title,
  description: teasPage.meta.description,
};

export default function TeasPage() {
  return (
    <>
      <PageHero {...teasPage.hero} />
      <Section aria-label={teasPage.hero.title}>
        <TeaGrid teas={teas} />
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Create `src/app/teas/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTea, otherTeas, teas } from "@/data/teas";
import { TeaDetail } from "@/components/teas/TeaDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return teas.map((tea) => ({ slug: tea.slug }));
}

export async function generateMetadata({ params }: PageProps<"/teas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tea = getTea(slug);
  if (!tea) return {};
  return { title: tea.name, description: tea.shortDescription };
}

export default async function TeaPage({ params }: PageProps<"/teas/[slug]">) {
  const { slug } = await params;
  const tea = getTea(slug);
  if (!tea) notFound();
  return <TeaDetail tea={tea} others={otherTeas(slug)} />;
}
```

- [ ] **Step 5: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: no errors; build lists `○ /teas` and `● /teas/[slug]` with the five slugs.

- [ ] **Step 6: Review at all three widths**

`npm run dev`; Playwright at 375, 768, 1280 on `/teas` and `/teas/sea-buckthorn`:
- `/teas`: 1 / 2 / 3 columns; five cards with leaf-green names.
- `/teas/sea-buckthorn`: phone photo on top then text; tablet photo at 70 % width centred; desktop two columns with the photo sticky while the text scrolls. No "Benefits", "Taste notes" or "Brewing" headings (all empty). "Other teas" shows four cards: a scroll row on phone/tablet, a 4-column row on desktop.
- Page title tab reads `Sea Buckthorn · Bhutan Herbal Tea`.

- [ ] **Step 7: Unknown slug returns the branded 404 (Review Focus 2)**

Stop dev; `npm run build; npm run start` (background), then:
```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3000/teas/green-tea
curl.exe -s http://localhost:3000/teas/green-tea | Select-String -SimpleMatch "Off the trail" | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `404`, then a count of at least `1`. Stop the server.

- [ ] **Step 8: Commit**

```powershell
git add src
git commit -m "Build the teas listing and tea detail pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: How It's Grown page

**Files:**
- Create: `src/app/how-its-grown/page.tsx`

**Interfaces:**
- Consumes: `grownPage`, `practices`, `people`, `CLOSING_LINE`, `PageHero`, `Section`, `Reveal`.

- [ ] **Step 1: Create `src/app/how-its-grown/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { CLOSING_LINE } from "@/data/site";
import { grownPage, people, practices } from "@/data/grown";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: grownPage.meta.title,
  description: grownPage.meta.description,
};

export default function HowItsGrownPage() {
  return (
    <>
      <PageHero {...grownPage.hero} />

      <Section aria-labelledby="practices-heading">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{grownPage.practicesSection.eyebrow}</p>
          <h2 id="practices-heading" className="mt-4 font-serif text-title text-mist">
            {grownPage.practicesSection.heading}
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12 xl:grid-cols-4 xl:gap-10">
          {practices.map((practice, index) => (
            <Reveal as="li" key={practice.title} delay={index * 0.08} className="border-t border-border pt-6">
              <span className="font-serif text-4xl text-saffron">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-2xl text-mist">{practice.title}</h3>
              <p className="mt-3 text-mist/75">{practice.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="people-heading" className="border-t border-border">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{grownPage.peopleSection.eyebrow}</p>
          <h2 id="people-heading" className="mt-4 font-serif text-title text-mist">
            {grownPage.peopleSection.heading}
          </h2>
          <p className="mt-5 text-lead text-mist/80">{grownPage.peopleSection.intro}</p>
        </Reveal>
        <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {people.map((person) => (
            <li key={person.image.src}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-card">
                  <Image
                    src={person.image.src}
                    alt={person.image.alt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {person.caption && (
                  <figcaption className="mt-3 text-sm text-mist/75">{person.caption}</figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      <section className="relative overflow-hidden py-28 text-center md:py-36 xl:py-48">
        <Image
          src={grownPage.closingImage.src}
          alt={grownPage.closingImage.alt}
          fill
          sizes="100vw"
          className="hidden object-cover xl:block"
        />
        <div aria-hidden className="absolute inset-0 hidden bg-ink/65 xl:block" />
        <Reveal className="container-page relative">
          <p className="mx-auto max-w-4xl font-serif text-title text-mist italic xl:text-display">{CLOSING_LINE}</p>
        </Reveal>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: no errors; build lists `○ /how-its-grown`.

- [ ] **Step 3: Review at all three widths**

`npm run dev`; Playwright at 375, 768, 1280 on `/how-its-grown`:
- Practices: stacked / 2×2 / 4 columns, saffron numbers 01–04.
- People: 1 / 2 / 4 columns, no captions (all empty).
- Closing line: large italic serif; on desktop a photo sits behind it, on phone/tablet plain ink background.

- [ ] **Step 4: Commit**

```powershell
git add src
git commit -m "Build the How It's Grown page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Contact page

**Files:**
- Create: `src/app/contact/page.tsx`
- Test: `tests/routes.test.ts`

**Interfaces:**
- Consumes: `contact`, `contactPage`, `hasDirectContact`, `telHref`, `mailtoHref`, `WhatsAppButton`, `SocialLinks`, `PageHero`, `Section`.

- [ ] **Step 1: Write the failing route test**

`tests/routes.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { nav } from "../src/data/site.ts";

test("every nav link points at an existing page", () => {
  for (const item of nav) {
    const page = join(process.cwd(), "src", "app", ...item.href.split("/").filter(Boolean), "page.tsx");
    assert.ok(existsSync(page), `missing ${page} for ${item.href}`);
  }
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL with `missing …\src\app\contact\page.tsx for /contact`.

- [ ] **Step 3: Create `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/data/site";
import { contactPage } from "@/data/pages";
import { hasDirectContact, mailtoHref, socialLinks, telHref } from "@/lib/contact";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: contactPage.meta.title,
  description: contactPage.meta.description,
};

export default function ContactPage() {
  const tel = telHref(contact.phone);
  const mail = mailtoHref(contact.email);
  const hasSocials = socialLinks(contact).length > 0;

  return (
    <>
      <PageHero {...contactPage.hero} />
      <Section>
        <div className="grid gap-14 md:grid-cols-2 md:gap-12 xl:grid-cols-[1fr_1.4fr_1.4fr] xl:gap-16">
          <div className="relative hidden aspect-[3/4] overflow-hidden rounded-md xl:block">
            <Image
              src={contactPage.sideImage.src}
              alt={contactPage.sideImage.alt}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>

          <section aria-labelledby="get-in-touch-heading">
            <h2 id="get-in-touch-heading" className="font-serif text-title text-mist">
              {contactPage.getInTouchHeading}
            </h2>
            {hasDirectContact(contact) ? (
              <div className="mt-8 flex flex-col items-start gap-5">
                <WhatsAppButton label={contactPage.whatsappLabel} className="w-full md:w-auto" />
                {tel && (
                  <a href={tel} className="flex items-center gap-3 text-lg text-mist hover:text-saffron">
                    <Phone className="size-5 text-saffron" aria-hidden />
                    {contact.phone}
                  </a>
                )}
                {mail && (
                  <a href={mail} className="flex items-center gap-3 text-lg text-mist hover:text-saffron">
                    <Mail className="size-5 text-saffron" aria-hidden />
                    {contact.email}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-8 text-lead text-mist/75">{contactPage.comingSoon}</p>
            )}
            {hasSocials && (
              <div className="mt-12">
                <h3 className="eyebrow">{contactPage.followHeading}</h3>
                <SocialLinks className="mt-4" />
              </div>
            )}
          </section>

          <section id="where-to-buy" aria-labelledby="where-to-buy-heading" className="scroll-mt-24">
            <h2 id="where-to-buy-heading" className="font-serif text-title text-mist">
              {contactPage.whereToBuyHeading}
            </h2>
            {contact.whereToBuy.length > 0 ? (
              <ul className="mt-8 space-y-4">
                {contact.whereToBuy.map((place) => (
                  <li key={place} className="flex gap-3 text-lg text-mist/85">
                    <MapPin className="mt-1 size-5 shrink-0 text-saffron" aria-hidden />
                    {place}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-lead text-mist/75">{contactPage.whereToBuyComingSoon}</p>
            )}
          </section>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests PASS, including `every nav link points at an existing page`.

- [ ] **Step 5: Lint and build**

Run: `npm run lint; npm run build`
Expected: no errors; build lists `○ /contact`.

- [ ] **Step 6: No empty contact links anywhere (Review Focus 1)**

Run:
```powershell
Get-ChildItem -Recurse .next\server\app -Filter *.html | Select-String -Pattern 'href="(https://wa\.me/|tel:|mailto:)"' | Measure-Object | Select-Object -ExpandProperty Count
Get-ChildItem -Recurse .next\server\app -Filter *.html | Select-String -Pattern 'wa\.me/|href="tel:|href="mailto:' | Measure-Object | Select-Object -ExpandProperty Count
Select-String -Path .next\server\app\contact.html -Pattern "Contact details coming soon", "Stockists coming soon" | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `0`, `0`, `2` (no contact data yet, so no contact links, and both "coming soon" messages present).

- [ ] **Step 7: Review at all three widths**

`npm run dev`; Playwright at 375, 768, 1280 on `/contact`:
- Phone: "Talk to us" → "Contact details coming soon." → Follow us (Facebook icon) → "Where to buy" → "Stockists coming soon.", stacked.
- Tablet: two columns (talk to us / where to buy).
- Desktop: tall photo on the left third, then the two columns.
- Navigate to `/teas/chamomile`, click "Where to buy". Expected: lands on `/contact` scrolled to the "Where to buy" heading, not hidden under the header.

- [ ] **Step 8: Commit**

```powershell
git add src tests
git commit -m "Build the contact page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: SEO — Open Graph image, sitemap, robots

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

**Interfaces:**
- Consumes: `SITE_NAME`, `TAGLINE`, `SITE_URL`, `SUMMIT_ALTITUDE_M`, `nav`, `teas`, `formatAltitude`.

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { nav, SITE_URL } from "@/data/site";
import { teas } from "@/data/teas";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...nav.map((item) => item.href), ...teas.map((tea) => `/teas/${tea.slug}`)];
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
```

- [ ] **Step 2: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
```

- [ ] **Step 3: Create `src/app/opengraph-image.tsx`**

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SUMMIT_ALTITUDE_M, TAGLINE } from "@/data/site";
import { formatAltitude } from "@/lib/altitude";

export const alt = `${SITE_NAME}: ${TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const line = `Organic herbal teas grown above ${formatAltitude(SUMMIT_ALTITUDE_M)} in Thimphu, Bhutan`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: 80,
          background: "#0E0E0C",
          color: "#F4F1EA",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
        <img src={logoSrc} width={300} height={276} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 96, height: 4, background: "#F2C230" }} />
          <div style={{ marginTop: 36, fontSize: 76, lineHeight: 1 }}>{SITE_NAME}</div>
          <div style={{ marginTop: 20, fontSize: 40, color: "#F2C230" }}>{TAGLINE}</div>
          <div style={{ marginTop: 36, fontSize: 26, color: "#AFADA7" }}>{line}</div>
        </div>
      </div>
    ),
    size,
  );
}
```

(The `<img>` height assumes the logo's ~800×735 ratio; if Task 2 printed a different ratio, set `height = round(300 × height / width)`.)

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: no errors; build lists `○ /opengraph-image`, `○ /robots.txt`, `○ /sitemap.xml`.

- [ ] **Step 5: Check the generated files**

`npm run start` (background), then:
```powershell
(Invoke-WebRequest http://localhost:3000/sitemap.xml -UseBasicParsing).Content
(Invoke-WebRequest http://localhost:3000/robots.txt -UseBasicParsing).Content
Invoke-WebRequest http://localhost:3000/opengraph-image -OutFile "$env:TEMP\og.png"
(Invoke-WebRequest http://localhost:3000/teas/hypericum -UseBasicParsing).Content -match 'property="og:image"'
```
Expected: sitemap lists 10 URLs (`/`, four nav pages, five teas); robots allows `/` and points at `/sitemap.xml`; `og.png` exists (Read it: ink background, logo left, title, saffron tagline); last line prints `True`. Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add src
git commit -m "Add Open Graph image, sitemap and robots

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Quality pass — reduced motion, no-JS, accessibility, Lighthouse

**Files:**
- Modify: only files where a check below fails (record each fix in the commit message).

- [ ] **Step 1: Production server**

Run: `npm run build; npm run start` (background).

- [ ] **Step 2: Reduced motion (Review Focus 5)**

Playwright: `browser_emulate_media` with `reducedMotion: "reduce"`, resize 1280×800.
- `/`: run `browser_evaluate` → `getComputedStyle(document.querySelector('.mist-layer')).animationName`. Expected `"none"`. Scroll 400 px and evaluate the hero image wrapper's `style.transform`. Expected: `none` or `translateY(0%)`-equivalent (no parallax shift).
- Navigate `/` → `/teas`: evaluate `getComputedStyle(document.querySelector('.page-fade')).animationName`. Expected `"none"`.
- `/our-story`: scroll to the middle. Expected: the altitude value still changes (read the marker's text before and after scrolling).
- At 375×812: open the menu. Expected: it appears without sliding.

- [ ] **Step 3: No-JavaScript rendering (Review Focus 4)**

Playwright `browser_run_code_unsafe`:
```js
const context = await page.context().browser().newContext({ javaScriptEnabled: false });
const p = await context.newPage();
await p.goto("http://localhost:3000/how-its-grown");
const hidden = await p.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity === "0").length);
const h1 = await p.textContent("h1");
await context.close();
return { hidden, h1 };
```
Expected: `{ hidden: 0, h1: "Grown with care" }`.

- [ ] **Step 4: Keyboard and landmarks on every page**

For each route (`/`, `/our-story`, `/teas`, `/teas/chamomile`, `/how-its-grown`, `/contact`, `/nope`) at 1280×800: `browser_snapshot` and confirm exactly one `h1`, landmarks `banner`, `main`, `contentinfo`, and every image has a non-empty name (alt). Tab through the first 10 stops: each focused element shows the saffron outline (screenshot one). Fix any page that fails.

- [ ] **Step 5: Final three-width review**

Screenshot every route at 375×812, 768×1024 and 1280×800 (21 screenshots). Compare against spec §5. Check specifically: no horizontal page scroll (`document.documentElement.scrollWidth === innerWidth` via `browser_evaluate`), no text over busy photo areas without the overlay, consistent page-hero style.

- [ ] **Step 6: Lighthouse on every page, mobile and desktop**

For each route:
```powershell
npx --yes lighthouse http://localhost:3000/ --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$env:TEMP\lh-home-mobile.json"
npx --yes lighthouse http://localhost:3000/ --quiet --preset=desktop --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$env:TEMP\lh-home-desktop.json"
node -e "const r=require(process.env.TEMP+'/lh-home-mobile.json');console.log(Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])))"
```
Repeat for `/our-story`, `/teas`, `/teas/chamomile`, `/how-its-grown`, `/contact`.
Expected: every category ≥ 90 on mobile and desktop. A local server lacks Netlify's CDN, so if performance is 85–89 only because of server response time, note it and re-check after deploy; any other shortfall must be fixed (common fixes: missing `sizes`, an extra `preload`, a large image).

- [ ] **Step 7: Stop the server, run the full check, commit fixes**

Run: `npm run lint; npm test; npm run build`
```powershell
git add -A
git commit -m "Quality pass: reduced motion, accessibility and performance fixes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
(Skip the commit if nothing changed.)

---

### Task 12: Deploy to Netlify (needs the user)

Pushing to GitHub and connecting Netlify are outward-facing actions. **Ask the user before each step.**

- [ ] **Step 1:** Ask the user to confirm pushing `main` to `origin` (`https://github.com/Bhutan-Herbal-Tea/Bhutanherbaltea.git`). On yes: `git push -u origin main`.
- [ ] **Step 2:** The user connects the repo in Netlify (Add new site → Import from Git). Build command `npm run build`; publish directory left as detected (Next.js runtime). No `output: 'export'`.
- [ ] **Step 3:** After the first deploy, re-run Task 11 Step 6 against the Netlify URL and check a WhatsApp/Facebook link preview of the URL shows the OG image.
- [ ] **Step 4:** Report open client items from spec §10.
