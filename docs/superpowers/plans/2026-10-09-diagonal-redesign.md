# "The Diagonal" Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Bhutan Herbal Tea site's visual layer in the flag-derived "Diagonal" language, with light and dark themes, on top of the existing data, helpers and tests.

**Architecture:** Next.js 16.4 App Router, all routes static. Theme lives on `<html data-theme>`, set before first paint by a tested inline script; CSS custom properties carry both palettes, and a `dark:` variant keys off the attribute. Brand geometry (slanted edges, notched corners, flag split, parallelogram) is a small set of Tailwind `@utility` classes; motion stays in client leaf components (`Hero`, `Reveal`, `ImageReveal`, `ClimbTrack`, `AltitudeMarker`, `Header`, `MobileMenu`, `ThemeToggle`).

**Tech Stack:** Next.js 16.4.0, React 19.3, TypeScript strict, Tailwind CSS v4, framer-motion 14, shadcn 4.21 (Base UI Sheet), lucide-react 1.x, Node's built-in test runner.

**Spec:** [docs/superpowers/specs/2026-10-09-diagonal-visual-design.md](../specs/2026-10-09-diagonal-visual-design.md), which supersedes the visual sections of [docs/superpowers/specs/2026-10-09-bhutan-herbal-tea-site-design.md](../specs/2026-10-09-bhutan-herbal-tea-site-design.md). Brief: [CLAUDE.md](../../../CLAUDE.md).

## Global Constraints

- No new dependencies. Allowed: `next`, `react`, `react-dom`, `framer-motion`, and what shadcn installed (`@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn`, `tw-animate-css`).
- Next 16: `preload` (never `priority`) on each page's first image only; no `quality` prop; route `params` are Promises; `npm run lint` is plain ESLint; `cacheComponents` is on, so no `new Date()` during render.
- Breakpoints: phone `< 768px` (no prefix), tablet `md:`, desktop `xl:`. Short viewports: `short:` (max-height 30rem).
- Themes: both light and dark ship. Default follows `prefers-color-scheme`; the header toggle overrides and persists in `localStorage` under the key `bht-theme`.
- Saffron is never used as text on a light background. Use the `text-accent-text` token for accent text (saffron in dark, ink in light) and `accent-mark` for decorative saffron.
- Text placed on photos is always `text-mist` over an ink scrim, in both themes.
- The flag split (`flag-split` / `flag-hover`) appears only on: the hero logo halo, primary button hover, the altitude marker fill, the home contact panel.
- The five lungta colours appear only in the Our Story summit prayer flags.
- All corner radii are 0. Clipped corners use the `notch` utility. Buttons: primary (orange, flag hover) and `ink` (only on the flag panel); secondary actions are `ArrowLink`, never outline buttons.
- Slanted edges all rise to the right, following the flag's diagonal. (Spec §2 said "alternating"; a mirrored slant no longer reads as the flag, so this plan keeps one direction.)
- Copy: no em dash or en dash characters anywhere; one label per CTA intent: "Discover our story", "See all teas", "Contact", "How it's grown", "Where to buy".
- At most one small uppercase `eyebrow` per three sections on a page.
- Fonts: Cormorant Garamond (`font-serif`) headings, Geist (`font-sans`) body.
- Each task ends with `npm run lint`, `npm test`, `npm run build` passing, then a commit ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Browser checks use Playwright MCP tools against `npm run start` (production server). Restart it after each build. Every page check covers 375×812, 768×1024 and 1280×800 **in both themes**.
- Windows: PowerShell from `C:\Users\asusb\Desktop\Bhutanherbaltea`.
- Folder convention (user request): each page owns a folder under `src/app/`, and components used by only that page live in its private `_components/` folder (Next.js ignores `_`-prefixed folders for routing). The home page lives in the route group `src/app/(home)/` so its URL stays `/`. Only components shared by several pages stay in `src/components/` (`ui/`, `layout/`, `teas/TeaCard.tsx`).

## Review Focus

1. **Light theme contrast:** muted text, accent text, links and focus rings must stay readable on mist. Pinned by `tests/contrast.test.ts` (Task 1) and the light-theme screenshots in every page task.
2. **First paint uses the right theme:** a stored "dark" with a light system setting must paint dark from the first frame; blocked `localStorage` falls back to the system setting. Pinned by `tests/theme.test.ts` (Task 1) and Task 3 Step 9.
3. **Text on photos in light theme:** page heroes, the statement band, full-bleed stages, the summit and the closing line must stay mist-on-scrim when the page is light. Pinned by light-theme screenshots in Tasks 3, 4, 5, 7.
4. **Reduced motion:** image reveals appear instantly, prayer flags stand still, no parallax, no page fade, altitude number still updates. Pinned by Task 10 Step 2.
5. **Missing data:** unknown tea slug returns the branded 404 with status 404 (Task 6 Step 6); empty contact details produce no `wa.me`/`tel:`/`mailto:` links (Task 8 Step 6).

---

## File map

```
src/app/globals.css                 # tokens for both themes, utilities (Task 1)
src/app/layout.tsx                  # Geist, theme script, viewport colours (Task 1)
src/lib/theme.ts                    # resolveTheme, nextTheme, themeInitScript (Task 1)
src/lib/story.ts                    # stageLayout (Task 2)
src/lib/altitude.ts                 # stageAltitude removed (Task 2)
src/data/{story,grown,pages}.ts     # copy for the redesign (Task 2)
src/components/ui/button.tsx        # primary + ink variants (Task 1)
src/components/ui/{ThemeToggle,ImageReveal}.tsx   # new (Task 3)
src/components/ui/{ArrowLink,PageHero,WhatsAppButton,Wordmark,SocialLinks,Logo}.tsx  # restyled (Task 3)
src/components/ui/sheet.tsx         # cn import from @/lib/utils (Task 3)
src/components/layout/{Header,MobileMenu,Footer}.tsx  # restyled (Task 3)
src/app/not-found.tsx               # restyled (Task 3)
src/app/(home)/page.tsx             # Home (route group keeps URL "/") (Tasks 1, 4)
src/app/(home)/_components/{Hero,StatementBand,FeaturedTeas,GrownStrip,ContactPanel}.tsx  # Task 4
src/components/teas/TeaCard.tsx     # shared by Home and Teas (Task 4)
src/app/our-story/page.tsx + _components/{ClimbTrack,AltitudeMarker,ClimbStage,PrayerFlags,Summit}.tsx  # Task 5
src/app/teas/page.tsx, src/app/teas/[slug]/page.tsx + src/app/teas/_components/{TeaGrid,TeaDetail}.tsx  # Task 6
src/app/{how-its-grown,contact}/page.tsx  # Tasks 7-8
src/app/{sitemap,robots}.ts, src/app/opengraph-image.tsx  # Task 9
tests/{theme,contrast,story,routes}.test.ts  # new; content/altitude tests updated
```

---

### Task 1: Theme foundation (tokens, theme script, buttons, fonts)

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/button.tsx`
- Move: `src/app/page.tsx` → `src/app/(home)/page.tsx`
- Create: `src/lib/theme.ts`
- Delete: `src/components/home/`, `src/components/teas/` (superseded Task 5 work of the old plan; committed first so history keeps it)
- Test: `tests/theme.test.ts`, `tests/contrast.test.ts`

**Interfaces:**
- Produces:
  - `type Theme = "light" | "dark"`, `THEME_STORAGE_KEY = "bht-theme"`, `resolveTheme(stored: string | null, prefersDark: boolean): Theme`, `nextTheme(current: string | undefined): Theme`, `themeInitScript: string` from `@/lib/theme`.
  - Tailwind colours `background foreground card muted-foreground border accent-text accent-mark ring ink mist saffron bhutan`; variants `dark:` (attribute-based) and `short:`; utilities `container-page eyebrow scroll-row slant-top slant-bottom slant-both notch parallelogram flag-split flag-hover`; CSS classes `mist-layer mist-layer--slow page-fade lungta`; CSS var `--slant`.
  - `buttonVariants` variants `default | ink | ghost`, sizes `default | lg | icon | icon-sm`.

- [ ] **Step 1: Preserve and remove the superseded home work**

```powershell
git add src/components/home src/components/teas src/app/page.tsx src/app/globals.css
git commit -m "wip: first home page draft (superseded by the Diagonal redesign)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
Remove-Item -Recurse -Force src\components\home, src\components\teas
```
Expected: one commit; the two directories are gone.

- [ ] **Step 2: Write the failing theme test**

`tests/theme.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { nextTheme, resolveTheme, THEME_STORAGE_KEY, themeInitScript } from "../src/lib/theme.ts";

function runInitScript(stored: string | null, prefersDark: boolean, storageBlocked = false) {
  const root = { dataset: {} as Record<string, string> };
  const context = {
    localStorage: {
      getItem: (key: string) => {
        if (storageBlocked) throw new Error("storage blocked");
        return key === THEME_STORAGE_KEY ? stored : null;
      },
    },
    window: { matchMedia: () => ({ matches: prefersDark }) },
    document: { documentElement: root },
  };
  vm.runInNewContext(themeInitScript, context);
  return root.dataset.theme;
}

test("resolveTheme prefers a valid stored choice, else the system setting", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme("purple", false), "light");
});

test("nextTheme flips between light and dark", () => {
  assert.equal(nextTheme("dark"), "light");
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme(undefined), "dark");
});

test("the inline script applies the stored theme before paint", () => {
  assert.equal(runInitScript("dark", false), "dark");
  assert.equal(runInitScript("light", true), "light");
});

test("the inline script falls back to the system setting", () => {
  assert.equal(runInitScript(null, true), "dark");
  assert.equal(runInitScript(null, false), "light");
  assert.equal(runInitScript("dark", false, true), "light");
});
```

- [ ] **Step 3: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/theme.ts`.

- [ ] **Step 4: Implement `src/lib/theme.ts`**

```ts
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "bht-theme";

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

export function nextTheme(current: string | undefined): Theme {
  return current === "dark" ? "light" : "dark";
}

// Runs in <head> before first paint. Mirrors resolveTheme; tests/theme.test.ts keeps them in step.
export const themeInitScript = `(function(){var s=null;try{s=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}var d=false;try{d=window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}document.documentElement.dataset.theme=(s==="light"||s==="dark")?s:(d?"dark":"light")})();`;
```

- [ ] **Step 5: Run the theme tests**

Run: `npm test`
Expected: all tests pass (theme: 4 new).

- [ ] **Step 6: Write the failing contrast test**

`tests/contrast.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

const INK = "#0e0e0c";
const MIST = "#f4f1ea";
const SAFFRON = "#f2c230";
const ORANGE = "#e86a1c";
const MUTED_LIGHT = "#4f4c46";
const MUTED_DARK = "#afada7";

test("contrast helper matches the WCAG reference", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("light theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(INK, MIST) >= 7, "body text");
  assert.ok(contrast(MUTED_LIGHT, MIST) >= 7, "muted text");
  assert.ok(contrast(INK, MIST) >= 3, "focus ring (ink)");
});

test("dark theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(MIST, INK) >= 7, "body text");
  assert.ok(contrast(MUTED_DARK, INK) >= 7, "muted text");
  assert.ok(contrast(SAFFRON, INK) >= 4.5, "accent text");
});

test("buttons and the flag panel keep ink text readable", () => {
  assert.ok(contrast(INK, ORANGE) >= 4.5, "primary button");
  assert.ok(contrast(INK, SAFFRON) >= 4.5, "primary hover and flag panel saffron half");
  assert.ok(contrast(MIST, INK) >= 4.5, "ink button");
});

test("saffron is never accent text in the light theme", () => {
  assert.ok(contrast(SAFFRON, MIST) < 3, "this is why light uses ink for accent text");
  assert.match(css, /--accent-text:\s*#0e0e0c/, "light accent-text must be ink");
});

test("globals.css declares the tested token values", () => {
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_LIGHT}`));
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_DARK}`));
  assert.match(css, /--accent-text:\s*#f2c230/);
  assert.match(css, /--ring:\s*#0e0e0c/);
  assert.match(css, /--ring:\s*#f2c230/);
});
```

- [ ] **Step 7: Run it to confirm it fails**

Run: `npm test`
Expected: the helper and pair tests pass; `saffron is never accent text…` and `globals.css declares…` FAIL (the current CSS has no `--accent-text` and a different light palette).

- [ ] **Step 8: Replace `src/app/globals.css`**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* Theme lives on <html data-theme>, set before first paint by the script in layout.tsx. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
/* Short viewports, e.g. phones held sideways (667x375). */
@custom-variant short (@media (max-height: 30rem));

@theme {
  --color-ink: #0e0e0c;
  --color-mist: #f4f1ea;
  --color-saffron: #f2c230;
  --color-bhutan: #e86a1c;
  --color-leaf: #5dae3b;
  --color-amber: #d9822b;

  --text-display: clamp(2.75rem, 1.75rem + 4.5vw, 6rem);
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.01em;
  --text-title: clamp(2rem, 1.5rem + 2.25vw, 3.5rem);
  --text-title--line-height: 1.1;
  --text-lead: clamp(1.0625rem, 1rem + 0.35vw, 1.3125rem);
  --text-lead--line-height: 1.6;
}

@theme inline {
  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
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
  --color-accent-text: var(--accent-text);
  --color-accent-mark: var(--accent-mark);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
}

/* Light theme (default when nothing else applies). */
:root {
  color-scheme: light;
  --radius: 0rem;
  --slant: clamp(2rem, 5vw, 5rem);
  --background: #f4f1ea;
  --foreground: #0e0e0c;
  --card: #eae6dc;
  --card-foreground: #0e0e0c;
  --popover: #f4f1ea;
  --popover-foreground: #0e0e0c;
  --primary: #e86a1c;
  --primary-foreground: #0e0e0c;
  --secondary: #eae6dc;
  --secondary-foreground: #0e0e0c;
  --muted: #eae6dc;
  --muted-foreground: #4f4c46;
  --accent: #eae6dc;
  --accent-foreground: #0e0e0c;
  --accent-text: #0e0e0c;
  --accent-mark: #f2c230;
  --destructive: #b42318;
  --border: rgb(14 14 12 / 0.14);
  --input: rgb(14 14 12 / 0.2);
  --ring: #0e0e0c;
}

/* Dark theme: system preference without a stored choice (also the no-JS path). */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --background: #0e0e0c;
    --foreground: #f4f1ea;
    --card: #171714;
    --card-foreground: #f4f1ea;
    --popover: #0e0e0c;
    --popover-foreground: #f4f1ea;
    --secondary: #1f1f1b;
    --secondary-foreground: #f4f1ea;
    --muted: #1f1f1b;
    --muted-foreground: #afada7;
    --accent: #1f1f1b;
    --accent-foreground: #f4f1ea;
    --accent-text: #f2c230;
    --destructive: #e5484d;
    --border: rgb(244 241 234 / 0.12);
    --input: rgb(244 241 234 / 0.16);
    --ring: #f2c230;
  }
}

/* Dark theme: explicit choice. */
:root[data-theme="dark"] {
  color-scheme: dark;
  --background: #0e0e0c;
  --foreground: #f4f1ea;
  --card: #171714;
  --card-foreground: #f4f1ea;
  --popover: #0e0e0c;
  --popover-foreground: #f4f1ea;
  --secondary: #1f1f1b;
  --secondary-foreground: #f4f1ea;
  --muted: #1f1f1b;
  --muted-foreground: #afada7;
  --accent: #1f1f1b;
  --accent-foreground: #f4f1ea;
  --accent-text: #f2c230;
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

/* Small uppercase label. Colour is set separately (text-accent-text, or text-saffron on photos). */
@utility eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

@utility scroll-row {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

/* Slanted edges. All rise to the right, like the diagonal on Bhutan's flag. */
@utility slant-top {
  clip-path: polygon(0 var(--slant), 100% 0, 100% 100%, 0 100%);
}
@utility slant-bottom {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--slant)), 0 100%);
}
@utility slant-both {
  clip-path: polygon(0 var(--slant), 100% 0, 100% calc(100% - var(--slant)), 0 100%);
}

/* One clipped corner (top right) for frames and buttons. */
@utility notch {
  clip-path: polygon(0 0, calc(100% - 0.75rem) 0, 100% 0.75rem, 100% 100%, 0 100%);
}

@utility parallelogram {
  clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
}

/* Bhutan's flag: saffron over orange, split on the diagonal. */
@utility flag-split {
  background-image: linear-gradient(to bottom right, var(--color-saffron) 50%, var(--color-bhutan) 50%);
}

/* Orange at rest; on hover the saffron half sweeps across along the flag's diagonal. */
@utility flag-hover {
  background-image: linear-gradient(to bottom right, var(--color-saffron) 50%, var(--color-bhutan) 50%);
  background-size: 250% 250%;
  background-position: 100% 100%;
  &:hover {
    background-position: 0% 0%;
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
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }
  ::selection {
    background: var(--color-saffron);
    color: var(--color-ink);
  }
}

/* Drifting mist over the home hero photo. */
.mist-layer {
  position: absolute;
  inset: -10% -20%;
  pointer-events: none;
  background:
    radial-gradient(40% 30% at 30% 70%, rgb(244 241 234 / 0.18), transparent 70%),
    radial-gradient(35% 25% at 75% 55%, rgb(244 241 234 / 0.12), transparent 70%);
  animation: mist-drift 40s ease-in-out infinite alternate;
}

.mist-layer--slow {
  background: radial-gradient(50% 30% at 60% 85%, rgb(244 241 234 / 0.14), transparent 70%);
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

/* Prayer flags at the Our Story summit. */
.lungta {
  transform-origin: top center;
  animation: lungta-flutter 3.2s ease-in-out infinite alternate;
}

@keyframes lungta-flutter {
  from {
    transform: skewX(-6deg) scaleY(0.96);
  }
  to {
    transform: skewX(5deg) scaleY(1);
  }
}

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
  .lungta,
  .page-fade {
    animation: none;
  }
}
```

- [ ] **Step 9: Run tests**

Run: `npm test`
Expected: all tests pass, including the 6 contrast tests.

- [ ] **Step 10: Replace `src/components/ui/button.tsx`**

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Focus uses an inset ring: the notch clip-path would cut off an outside outline.
const buttonVariants = cva(
  "notch inline-flex shrink-0 items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap outline-none select-none transition-[background-position,background-color,color] duration-500 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "flag-hover text-ink focus-visible:shadow-[inset_0_0_0_3px_var(--color-ink)]",
        ink: "bg-ink text-mist hover:bg-ink/85 focus-visible:shadow-[inset_0_0_0_3px_var(--color-saffron)]",
        ghost: "text-foreground hover:bg-foreground/10 focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]",
      },
      size: {
        default: "h-11 px-6 text-sm",
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

- [ ] **Step 11: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TAGLINE } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SkipLink } from "@/components/layout/SkipLink";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0C" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${cormorant.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-svh">
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
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

- [ ] **Step 12: Temporary home page in its own folder (replaced in Task 4)**

Delete `src/app/page.tsx` and create `src/app/(home)/page.tsx` (the `(home)` route group gives the home page its own folder without changing its URL):
```tsx
import { TAGLINE } from "@/data/site";

export default function HomePage() {
  return (
    <div className="container-page pt-32 pb-24">
      <h1 className="font-serif text-display text-foreground">{TAGLINE}</h1>
      <div className="mt-10 h-24 w-36 flag-split" />
    </div>
  );
}
```

- [ ] **Step 13: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass. (`not-found.tsx` still references `variant="outline"`, which no longer exists: if the type check fails on it, change that `ButtonLink` to `variant="ink"` for now; Task 3 rewrites the file.)

- [ ] **Step 14: Check both themes in the browser**

`npm run start` (background). Playwright at 1280×800:
1. `browser_emulate_media` `colorScheme: "light"`, navigate `/`. Expected: mist background, ink heading, flag rectangle (saffron top-left, orange bottom-right).
2. `browser_emulate_media` `colorScheme: "dark"`, reload. Expected: ink background, mist heading.
3. `browser_evaluate` `() => document.documentElement.dataset.theme` in each case. Expected: `"light"` then `"dark"`.
Stop the server.

- [ ] **Step 15: Commit**

```powershell
git add -A
git commit -m "Add light and dark theme foundation with flag geometry utilities

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Content for the redesign

**Files:**
- Modify: `src/data/story.ts`, `src/data/grown.ts`, `src/data/pages.ts`, `src/lib/altitude.ts`
- Create: `src/lib/story.ts`
- Test: `tests/story.test.ts` (new), `tests/content.test.ts`, `tests/altitude.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `type StageLayout = "image-left" | "image-right" | "full-bleed"`, `stageLayout(index: number): StageLayout` from `@/lib/story`.
  - `ClimbStageData` gains `marker: string`; `storyPage` loses `stageLabel` and `hero.eyebrow`; `storyPage.summit.teasLabel = "See all teas"`; `LUNGTA_COLORS: { name: "blue" | "white" | "red" | "green" | "yellow"; hex: string }[]` from `@/data/story`.
  - `homeCopy = { hero: { subtext, ctaLabel }, statement: { heading, body, linkLabel, image }, featured: { eyebrow, heading, body, linkLabel }, grown: { heading, body, linkLabel, image }, contactPanel: { heading, body, linkLabel } }`.
  - Page heroes (`storyPage.hero`, `teasPage.hero`, `grownPage.hero`, `contactPage.hero`) are `{ title, intro, image }` (no eyebrow).
  - `grownPage.practicesSection = { heading }`, `grownPage.peopleSection = { heading, intro }`.
  - `notFoundCopy.teasLabel = "See all teas"`.
  - `stageAltitude` is removed from `@/lib/altitude` (stages no longer print altitudes).

- [ ] **Step 1: Write the failing story-layout test**

`tests/story.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { stageLayout } from "../src/lib/story.ts";

test("split stages alternate sides, then a full-bleed break", () => {
  assert.equal(stageLayout(0), "image-left");
  assert.equal(stageLayout(1), "image-right");
  assert.equal(stageLayout(2), "full-bleed");
  assert.equal(stageLayout(3), "image-left");
});

test("never more than two image+text splits in a row", () => {
  let run = 0;
  for (let i = 0; i < 12; i++) {
    run = stageLayout(i) === "full-bleed" ? 0 : run + 1;
    assert.ok(run <= 2, `three splits in a row ending at stage ${i}`);
  }
});
```

- [ ] **Step 2: Update the content and altitude tests**

In `tests/altitude.test.ts`, change the import line to:
```ts
import { altitudeAt, formatAltitude } from "../src/lib/altitude.ts";
```
and delete the whole `test("stageAltitude spaces stages evenly…", …)` block.

Replace `tests/content.test.ts` with:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { contact, heroPhoto, nav, SUMMIT_ALTITUDE_M, type Photo } from "../src/data/site.ts";
import { featuredTeas, getTea, otherTeas, teas } from "../src/data/teas.ts";
import { LUNGTA_COLORS, stages, storyPage } from "../src/data/story.ts";
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

test("no em or en dashes in any visible content", () => {
  assert.doesNotMatch(JSON.stringify(allContent), /[\u2013\u2014]/);
});

test("every story stage has a heading, body and marker", () => {
  assert.ok(stages.length >= 4);
  for (const stage of stages) {
    assert.ok(stage.heading && stage.body && stage.marker, stage.id);
  }
});

test("one label per CTA intent", () => {
  assert.equal(homeCopy.hero.ctaLabel, "Discover our story");
  assert.equal(homeCopy.statement.linkLabel, homeCopy.hero.ctaLabel);
  assert.equal(homeCopy.featured.linkLabel, "See all teas");
  assert.equal(storyPage.summit.teasLabel, "See all teas");
  assert.equal(notFoundCopy.teasLabel, "See all teas");
  assert.equal(homeCopy.contactPanel.linkLabel, "Contact");
});

test("lungta has the five element colours in traditional order", () => {
  assert.deepEqual(
    LUNGTA_COLORS.map((c) => c.name),
    ["blue", "white", "red", "green", "yellow"],
  );
});

test("home hero subtext stays within 20 words", () => {
  assert.ok(homeCopy.hero.subtext.split(/\s+/).length <= 20);
});
```

- [ ] **Step 3: Run tests to confirm they fail**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/story.ts`, and content failures for `LUNGTA_COLORS`, `homeCopy.hero`, `marker`.

- [ ] **Step 4: Create `src/lib/story.ts`**

```ts
export type StageLayout = "image-left" | "image-right" | "full-bleed";

// Two image+text splits (alternating sides), then a full-bleed break, repeating.
export function stageLayout(index: number): StageLayout {
  const position = index % 3;
  if (position === 0) return "image-left";
  if (position === 1) return "image-right";
  return "full-bleed";
}
```

- [ ] **Step 5: Remove `stageAltitude` from `src/lib/altitude.ts`**

The file becomes:
```ts
export function altitudeAt(progress: number, summit: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.round(p * summit);
}

export function formatAltitude(metres: number): string {
  return `${metres.toLocaleString("en-US")} m`;
}
```

- [ ] **Step 6: Replace `src/data/story.ts`**

```ts
import type { Photo } from "./site";

export type ClimbStageData = {
  id: string;
  marker: string; // short place or time, shown above the heading
  heading: string;
  body: string;
  image: Photo;
};

export type LungtaColor = { name: "blue" | "white" | "red" | "green" | "yellow"; hex: string };

// Prayer flags, in the traditional order of the five elements: sky, air, fire, water, earth.
export const LUNGTA_COLORS: LungtaColor[] = [
  { name: "blue", hex: "#2F5DA8" },
  { name: "white", hex: "#F4F1EA" },
  { name: "red", hex: "#C8322B" },
  { name: "green", hex: "#3F8F3A" },
  { name: "yellow", hex: "#F2C230" },
];

export const storyPage = {
  meta: {
    title: "Our Story",
    description:
      "From a meeting in New York to Bhutan's first herbal tea farm: climb from sea level to our fields above 2,750 m in Thimphu.",
  },
  hero: {
    title: "Grown higher",
    intro: "Climb from sea level to our fields above 2,750 metres.",
    image: { src: "/images/fields/farm.jpg", alt: "The Bhutan Herbal Tea farm in the hills of Thimphu" },
  },
  summit: {
    heading: "You've reached the summit",
    body: "This is where our herbs grow: slowly, in the clean mountain air above Thimphu.",
    teasLabel: "See all teas",
    grownLabel: "How it's grown",
    image: { src: "/images/story/summit.jpg", alt: "Mountain ridges above the herb fields at sunset" },
  },
};

// Facts from Daily Bhutan (2023). TODO: client to review wording.
export const stages: ClimbStageData[] = [
  {
    id: "new-york",
    marker: "New York, 2007",
    heading: "It began far from the mountains",
    body: "Rinzin Wangchuk and Wangchuk Kuenga first crossed paths in New York, at a Bhutanese New Year gathering in 2007.",
    image: { src: "/images/story/stage-1.jpg", alt: "City lights at dusk" },
  },
  {
    id: "thimphu",
    marker: "Thimphu, 2015",
    heading: "Back home in Thimphu",
    body: "In 2015 they met again in Thimphu, and the idea of growing herbal tea in Bhutan began to take shape.",
    image: { src: "/images/story/stage-2.jpg", alt: "The Thimphu valley" },
  },
  {
    id: "founded",
    marker: "March 2016",
    heading: "Bhutan's first herbal tea farm",
    body: "Bhutan Herbal Tea was founded in March 2016: the first and only herbal tea farm in Bhutan.",
    image: { src: "/images/story/stage-3.jpg", alt: "Young herb plants in rows on the farm" },
  },
  {
    id: "altitude",
    marker: "Above 9,000 feet",
    heading: "Above 2,750 metres",
    body: "Our herbs are grown and harvested above 9,000 feet. Up here, in the cool mountain air, they grow slowly.",
    image: { src: "/images/story/stage-4.jpg", alt: "High slopes above the farm" },
  },
  {
    id: "volatile-oils",
    marker: "Slow growth",
    heading: "Time builds flavour",
    body: "Growing slowly, the plants build up more of the volatile oils that carry their flavour and fragrance.",
    image: { src: "/images/story/stage-5.jpg", alt: "Close-up of herb leaves" },
  },
  {
    id: "in-the-cup",
    marker: "In every cup",
    heading: "Richer in every cup",
    body: "You can taste the altitude: richer flavour, deeper aroma and more nutrients in every cup.",
    image: { src: "/images/story/stage-6.jpg", alt: "A cup of herbal tea" },
  },
];
```

- [ ] **Step 7: Replace `src/data/grown.ts`**

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
    title: "Grown with care",
    intro: "Organic, hand-harvested and carefully dried on Bhutan's first herbal tea farm.",
    image: { src: "/images/fields/herb-rows.jpg", alt: "Rows of herbs growing on the farm" },
  },
  practicesSection: { heading: "From soil to cup" },
  peopleSection: {
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

- [ ] **Step 8: Replace `src/data/pages.ts`**

```ts
import type { Photo } from "./site";

type Hero = { title: string; intro: string; image: Photo };

export const homeCopy = {
  hero: {
    subtext: "Certified organic herbal teas, grown slowly above 2,750 metres on Bhutan's first herbal tea farm.",
    ctaLabel: "Discover our story",
  },
  statement: {
    heading: "Above 2,750 metres, everything grows a little slower.",
    body: "Slow growth lets our herbs build up more of the volatile oils that carry flavour, aroma and nutrients.",
    linkLabel: "Discover our story",
    image: { src: "/images/story/stage-4.jpg", alt: "High slopes above the farm" },
  },
  featured: {
    eyebrow: "Our teas",
    heading: "Brand Bhutan certified",
    body: "Chamomile, Peppermint and Lemon Verbena carry Brand Bhutan certification. All five of our teas are certified organic.",
    linkLabel: "See all teas",
  },
  grown: {
    heading: "Hand-harvested at their peak",
    body: "Organic and regenerative farming, carefully dried herbs, and nothing added.",
    linkLabel: "How it's grown",
    image: { src: "/images/fields/herb-rows.jpg", alt: "Rows of herbs growing on the farm" },
  },
  contactPanel: {
    heading: "Questions about our teas?",
    body: "Ask us anything, from which tea to try first to where to find us.",
    linkLabel: "Contact",
  },
};

export const teasPage: { meta: { title: string; description: string }; hero: Hero } = {
  meta: {
    title: "Our Teas",
    description: "Five certified organic herbal teas grown above 2,750 m in Thimphu, Bhutan.",
  },
  hero: {
    title: "Five teas, grown higher",
    intro: "Certified organic herbal teas from our farm in Thimphu.",
    image: { src: "/images/fields/drying.jpg", alt: "Herbs laid out to dry" },
  },
};

export const teaDetailCopy = {
  eyebrow: "Certified organic, Thimphu",
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
  eyebrow: "404, off the trail",
  heading: "This path doesn't lead anywhere",
  body: "The page you were looking for isn't here. Let's get you back on the trail.",
  homeLabel: "Back to home",
  teasLabel: "See all teas",
  image: { src: "/images/story/summit.jpg", alt: "Mountain ridges above the herb fields at sunset" },
};
```

- [ ] **Step 9: Run tests**

Run: `npm test`
Expected: all pass (story: 2, content: 13, altitude: 3, contact: 5, nav: 1, theme: 4, contrast: 6).

- [ ] **Step 10: Lint, build, commit**

Run: `npm run lint; npm run build`
Expected: no errors (no component consumes the changed fields yet except `not-found.tsx`, which uses `teasLabel`, `eyebrow` and others that still exist).
```powershell
git add src tests
git commit -m "Rewrite content for the Diagonal redesign

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Shared UI and layout in the new language

**Files:**
- Create: `src/components/ui/ThemeToggle.tsx`, `src/components/ui/ImageReveal.tsx`
- Modify: `src/components/ui/{ArrowLink,PageHero,WhatsAppButton,Wordmark,SocialLinks,Logo,sheet}.tsx`, `src/components/layout/{Header,MobileMenu,Footer}.tsx`, `src/app/not-found.tsx`

**Interfaces:**
- Consumes: Task 1 tokens/utilities/`buttonVariants`/`nextTheme`/`THEME_STORAGE_KEY`; Task 2 content.
- Produces:
  - `<ArrowLink href tone?: "default" | "photo" className?>`
  - `<ImageReveal className?>{frame}</ImageReveal>` (diagonal wipe; wrap a `notch` frame inside it, never put `notch` on it)
  - `<PageHero title intro? image />` (renders the page `h1`, preloads, slanted bottom edge, mist text)
  - `<WhatsAppButton label variant?: "default" | "ink" className? />`
  - `<Logo className sizes />` (no `eager`; never preloads)
  - `<ThemeToggle />`

- [ ] **Step 1: Create `src/components/ui/ThemeToggle.tsx`**

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { nextTheme, THEME_STORAGE_KEY } from "@/lib/theme";

// The icon is chosen by CSS (dark: variant), so server and client render the same markup.
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const theme = nextTheme(root.dataset.theme);
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="inline-flex size-11 items-center justify-center text-foreground transition-colors hover:bg-foreground/10"
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/ImageReveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Wipes an image in from the top-left corner along the flag's diagonal.
// The polygons share a vertex count so they interpolate; the noscript rule in layout.tsx clears the clip.
const HIDDEN = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)";
const SHOWN = "polygon(0% 0%, 200% 0%, 0% 200%, 0% 0%)";

type ImageRevealProps = { children: ReactNode; className?: string };

export function ImageReveal({ children, className }: ImageRevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ clipPath: HIDDEN }}
      whileInView={{ clipPath: SHOWN }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Restyle the small UI pieces**

`src/components/ui/ArrowLink.tsx`:
```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  tone?: "default" | "photo";
  className?: string;
};

export function ArrowLink({ href, children, tone = "default", className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-medium underline decoration-2 underline-offset-8 transition-colors",
        tone === "photo"
          ? "text-mist decoration-saffron hover:text-saffron"
          : "text-accent-text decoration-accent-mark hover:decoration-bhutan",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
```

`src/components/ui/PageHero.tsx`:
```tsx
import Image from "next/image";
import type { Photo } from "@/data/site";

type PageHeroProps = { title: string; intro?: string; image: Photo };

// Text sits on the photo, so it is mist in both themes.
export function PageHero({ title, intro, image }: PageHeroProps) {
  return (
    <div className="slant-bottom relative flex h-[60svh] min-h-96 items-end overflow-hidden md:h-[62svh] xl:h-[68svh]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink/85 to-transparent" />
      <div className="container-page relative pb-[calc(var(--slant)+2.5rem)] xl:pb-[calc(var(--slant)+3.5rem)]">
        <h1 className="font-serif text-display text-mist">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lead text-mist/85">{intro}</p>}
      </div>
    </div>
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

type WhatsAppButtonProps = { label: string; variant?: "default" | "ink"; className?: string };

export function WhatsAppButton({ label, variant = "default", className }: WhatsAppButtonProps) {
  const href = whatsappHref(contact.whatsapp);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size: "lg" }), className)}
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
      className={cn("font-serif text-xl tracking-wide text-foreground md:text-2xl", className)}
    >
      {SITE_NAME}
    </Link>
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
              className="notch inline-flex size-11 items-center justify-center bg-foreground/5 text-foreground transition-colors hover:bg-foreground/10 hover:text-accent-text"
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

`src/components/ui/Logo.tsx`:
```tsx
import Image from "next/image";
import logo from "../../../public/logo.png";
import { SITE_NAME } from "@/data/site";

type LogoProps = { className?: string; sizes: string };

// No eager/preload: only each page's first photo is preloaded.
export function Logo({ className, sizes }: LogoProps) {
  return <Image src={logo} alt={`${SITE_NAME} logo`} sizes={sizes} className={className} />;
}
```

In `src/components/ui/sheet.tsx`, replace the line `import { cn } from "cn"` with:
```tsx
import { cn } from "@/lib/utils"
```

- [ ] **Step 4: Restyle the layout**

`src/components/layout/Header.tsx`:
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";

// Always solid: a transparent header cannot stay readable over photos in both themes.
export function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between xl:h-20">
        <Wordmark />
        <div className="flex items-center gap-1 xl:gap-8">
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
                        "py-2 text-sm tracking-wide transition-colors hover:text-foreground",
                        active
                          ? "text-foreground underline decoration-accent-mark decoration-2 underline-offset-[10px]"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
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
        className="inline-flex size-11 items-center justify-center text-foreground transition-colors hover:bg-foreground/10 xl:hidden"
      >
        <Menu className="size-6" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="inset-0 h-svh w-full gap-0 border-0 bg-background p-0 text-foreground motion-reduce:transition-none data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <div className="container-page flex h-16 shrink-0 items-center justify-between">
          <SheetTitle className="font-serif text-xl text-foreground md:text-2xl">{SITE_NAME}</SheetTitle>
          <SheetClose
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center transition-colors hover:bg-foreground/10"
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
                      "inline-block py-2 font-serif text-4xl transition-colors md:text-6xl",
                      active
                        ? "text-accent-text underline decoration-accent-mark decoration-2 underline-offset-8"
                        : "text-foreground hover:text-accent-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div aria-hidden className="flag-split h-2 w-full" />
        <p className="container-page py-8 font-serif text-xl text-muted-foreground italic">{TAGLINE}</p>
      </SheetContent>
    </Sheet>
  );
}
```

Note: the menu's 2px flag stripe is decorative and counts as part of the header's flag usage; it is the only exception to the four flag-split locations and is recorded as a ruling when executed.

`src/components/layout/Footer.tsx`:
```tsx
import Link from "next/link";
import { nav, SITE_NAME, TAGLINE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  // Fixed at build time (next.config.ts); every deploy rebuilds, so it stays current.
  const year = process.env.BUILD_YEAR;
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-12 py-16 text-center md:grid-cols-2 md:gap-x-12 md:text-left xl:grid-cols-3 xl:py-20">
        <div className="flex flex-col items-center gap-5 md:row-span-2 md:items-start xl:row-span-1">
          <Logo className="h-auto w-32" sizes="128px" />
          <p className="font-serif text-2xl text-foreground">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
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

- [ ] **Step 5: Restyle `src/app/not-found.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFoundCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: notFoundCopy.title };

export default function NotFound() {
  return (
    <div className="slant-bottom relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-[calc(var(--slant)+5rem)]">
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
        <p className="eyebrow text-saffron">{notFoundCopy.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-display text-mist">{notFoundCopy.heading}</h1>
        <p className="mt-6 max-w-xl text-lead text-mist/85">{notFoundCopy.body}</p>
        <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
          <ButtonLink href="/">{notFoundCopy.homeLabel}</ButtonLink>
          <ArrowLink href="/teas" tone="photo">
            {notFoundCopy.teasLabel}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass; build lists `○ /`, `○ /_not-found`, `○ /icon.svg`.

- [ ] **Step 7: Review the 404, header, menu and footer in both themes**

`npm run start` (background). For each theme (`browser_emulate_media colorScheme light`, then `dark`, clearing `localStorage` first with `browser_evaluate () => localStorage.clear()`), at 375×812, 768×1024 and 1280×800 on `/does-not-exist`, full-page screenshot. Expected:
- 404 photo with slanted bottom edge; heading and body mist on the scrim in **both** themes; orange notched "Back to home" button; "See all teas" mist link with saffron underline.
- Header solid (mist in light, ink in dark); wordmark, toggle icon (moon in light, sun in dark), hamburger below 1280, inline nav at 1280.
- Footer: stacked (375), 2 columns (768), 3 columns (1280); text readable in both themes.

- [ ] **Step 8: Menu and toggle behaviour**

At 375×812, light theme: click "Open menu". Expected: full-screen mist panel, ink links, flag stripe above the tagline, `aria-expanded="true"`. Press Escape. Expected: closes, focus back on the trigger.
Hover the "Back to home" button and take a screenshot mid-transition (`browser_run_code_unsafe` hovering, waiting 250 ms, screenshot). Expected: the saffron/orange diagonal visible across the button.

- [ ] **Step 9: Theme persistence and first paint (Review Focus 2)**

`browser_emulate_media colorScheme: "light"`. Click the theme toggle. Expected: page turns dark; `localStorage.getItem("bht-theme")` is `"dark"`. Then:
```js
async (page) => {
  await page.reload();
  return await page.evaluate(() => ({
    attr: document.documentElement.dataset.theme,
    bg: getComputedStyle(document.body).backgroundColor,
  }));
}
```
Expected: `{ attr: "dark", bg: "rgb(14, 14, 12)" }`. Then view the raw HTML (`curl.exe -s http://localhost:3000/does-not-exist | Select-String -SimpleMatch "bht-theme"`). Expected: the inline script is present in `<head>`. Clear storage (`localStorage.clear()`) and stop the server.

- [ ] **Step 10: Commit**

```powershell
git add src
git commit -m "Restyle shared UI and layout with theme toggle and diagonal reveals

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Home page

**Files:**
- Create: `src/app/(home)/_components/{Hero,StatementBand,FeaturedTeas,GrownStrip,ContactPanel}.tsx`, `src/components/teas/TeaCard.tsx` (shared)
- Modify: `src/app/(home)/page.tsx`

**Interfaces:**
- Consumes: `homeCopy`, `heroPhoto`, `TAGLINE`, `featuredTeas`, `contactPage.whatsappLabel`, `teaDetailCopy.imageAltSuffix`, `ButtonLink`, `ArrowLink`, `Reveal`, `ImageReveal`, `Section`, `Logo`, `WhatsAppButton`.
- Produces: `<TeaCard tea sizes />` (reused in Task 6).

- [ ] **Step 1: Create `src/components/teas/TeaCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Tea } from "@/data/teas";
import { teaDetailCopy } from "@/data/pages";
import { ImageReveal } from "@/components/ui/ImageReveal";

type TeaCardProps = { tea: Tea; sizes: string };

export function TeaCard({ tea, sizes }: TeaCardProps) {
  return (
    <Link href={`/teas/${tea.slug}`} className="group block">
      <ImageReveal>
        <div className="notch relative aspect-4/5 overflow-hidden bg-card">
          <Image
            src={tea.image}
            alt={`${tea.name} ${teaDetailCopy.imageAltSuffix}`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      </ImageReveal>
      <h3 className="mt-5 font-serif text-2xl text-foreground decoration-accent-mark decoration-2 underline-offset-8 group-hover:underline md:text-[1.75rem]">
        {tea.name}
      </h3>
      <p className="mt-2 text-muted-foreground">{tea.shortDescription}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Create `src/app/(home)/_components/Hero.tsx`**

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { heroPhoto, TAGLINE } from "@/data/site";
import { homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const { subtext, ctaLabel } = homeCopy.hero;

  return (
    <section
      ref={ref}
      className="relative grid min-h-[100dvh] pt-16 md:grid-cols-2 md:items-center xl:grid-cols-[5fr_7fr] xl:pt-20"
    >
      {/* Photo: a band with a slanted foot on phones, a flag-angled parallelogram from tablet up. */}
      <div className="slant-bottom relative h-[52svh] overflow-hidden short:h-[45svh] md:parallelogram md:order-2 md:h-full md:min-h-[calc(100dvh-4rem)] xl:min-h-[calc(100dvh-5rem)]">
        <motion.div className="absolute inset-0 scale-115" style={{ y }}>
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            fill
            preload
            sizes="(min-width: 1280px) 58vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-ink/15" />
        <div aria-hidden className="mist-layer" />
        <div aria-hidden className="mist-layer mist-layer--slow" />
      </div>

      <div className="container-page relative -mt-16 flex flex-col items-start pb-14 short:-mt-10 md:order-1 md:mt-0 md:py-16 xl:pl-16">
        <div className="relative w-32 short:w-24 md:w-44 xl:w-52">
          {/* Flag halo: Bhutan's flag proportions (3:2), tilted behind the round logo. */}
          <div
            aria-hidden
            className="flag-split notch absolute top-1/2 left-1/2 aspect-3/2 w-[135%] -translate-x-1/2 -translate-y-1/2 -rotate-6"
          />
          <Logo
            className="relative h-auto w-full"
            sizes="(min-width: 1280px) 208px, (min-width: 768px) 176px, 128px"
          />
        </div>
        <h1 className="mt-12 font-serif text-display text-foreground short:mt-6">{TAGLINE}</h1>
        <p className="mt-5 max-w-md text-lead text-muted-foreground">{subtext}</p>
        <ButtonLink href="/our-story" className="mt-8">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create the other home sections**

`src/app/(home)/_components/StatementBand.tsx`:
```tsx
import Image from "next/image";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";

export function StatementBand() {
  const { heading, body, linkLabel, image } = homeCopy.statement;
  return (
    <section
      aria-labelledby="statement-heading"
      className="slant-both relative overflow-hidden py-[calc(var(--slant)+5rem)] md:py-[calc(var(--slant)+7rem)] xl:py-[calc(var(--slant)+9rem)]"
    >
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/60" />
      <div className="container-page relative">
        <Reveal className="max-w-4xl xl:ml-[8%]">
          <h2 id="statement-heading" className="font-serif text-title text-mist xl:text-[4.5rem] xl:leading-[1.05]">
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-lead text-mist/85">{body}</p>
          <ArrowLink href="/our-story" tone="photo" className="mt-8">
            {linkLabel}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
```

`src/app/(home)/_components/FeaturedTeas.tsx`:
```tsx
import { featuredTeas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { cn } from "@/lib/utils";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TeaCard } from "@/components/teas/TeaCard";

export function FeaturedTeas() {
  const { eyebrow, heading, body, linkLabel } = homeCopy.featured;
  return (
    <Section aria-labelledby="featured-heading">
      <Reveal className="max-w-2xl">
        <p className="eyebrow text-accent-text">{eyebrow}</p>
        <h2 id="featured-heading" className="mt-4 font-serif text-title text-foreground">
          {heading}
        </h2>
        <p className="mt-5 text-lead text-muted-foreground">{body}</p>
      </Reveal>
      <ul
        aria-label={heading}
        className="scroll-row -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-20 xl:gap-10"
      >
        {featuredTeas.map((tea, index) => (
          <li key={tea.slug} className={cn("w-[78%] shrink-0 snap-start md:w-auto", index === 1 && "md:translate-y-16")}>
            <TeaCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 33vw, 78vw" />
          </li>
        ))}
      </ul>
      <ArrowLink href="/teas" className="mt-10 md:mt-0">
        {linkLabel}
      </ArrowLink>
    </Section>
  );
}
```

`src/app/(home)/_components/GrownStrip.tsx`:
```tsx
import Image from "next/image";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";

export function GrownStrip() {
  const { heading, body, linkLabel, image } = homeCopy.grown;
  return (
    <section aria-labelledby="grown-heading" className="pb-20 md:pb-28 xl:pb-36">
      <ImageReveal>
        <div className="relative aspect-4/3 md:aspect-video xl:aspect-21/9">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
        </div>
      </ImageReveal>
      <div className="container-page mt-10 xl:mt-14 xl:grid xl:grid-cols-12">
        <Reveal className="max-w-xl xl:col-span-6 xl:col-start-6 xl:max-w-none">
          <h2 id="grown-heading" className="font-serif text-title text-foreground">
            {heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{body}</p>
          <ArrowLink href="/how-its-grown" className="mt-8">
            {linkLabel}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
```

`src/app/(home)/_components/ContactPanel.tsx`:
```tsx
import { contactPage, homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

// The one block filled with the flag split. Ink text passes contrast on both halves.
export function ContactPanel() {
  const { heading, body, linkLabel } = homeCopy.contactPanel;
  return (
    <section
      aria-labelledby="contact-panel-heading"
      className="flag-split slant-top py-[calc(var(--slant)+4.5rem)] text-ink md:py-[calc(var(--slant)+6rem)]"
    >
      <div className="container-page">
        <Reveal className="flex flex-col items-start gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h2 id="contact-panel-heading" className="font-serif text-title">
              {heading}
            </h2>
            <p className="mt-4 text-lead">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <WhatsAppButton variant="ink" label={contactPage.whatsappLabel} className="w-full md:w-auto" />
            <ButtonLink href="/contact" variant="ink" className="w-full md:w-auto">
              {linkLabel}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace `src/app/(home)/page.tsx`**

```tsx
import { ContactPanel } from "./_components/ContactPanel";
import { FeaturedTeas } from "./_components/FeaturedTeas";
import { GrownStrip } from "./_components/GrownStrip";
import { Hero } from "./_components/Hero";
import { StatementBand } from "./_components/StatementBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatementBand />
      <FeaturedTeas />
      <GrownStrip />
      <ContactPanel />
    </>
  );
}
```

- [ ] **Step 5: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass.

- [ ] **Step 6: One image preload only**

`npm run start` (background), then:
```powershell
$html = (Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).Content
([regex]::Matches($html, '<link[^>]*rel="preload"[^>]*as="image"')).Count
[regex]::Match($html, '<h1[^>]*>[^<]*</h1>').Value
```
Expected: `1` (the hero photo), and the `h1` "Wellness in Every Sip." with no `opacity:0`.

- [ ] **Step 7: Review in both themes at all three widths**

For light and dark (`browser_emulate_media`, storage cleared), at 375×812, 768×1024, 1280×800 on `/`: scroll the full page in 400 px steps (so reveals fire), back to top, full-page screenshot. Expected:
- 375: photo band with slanted foot, logo with tilted flag halo overlapping it, tagline (≤ 2 lines), subtext, orange button; statement band with slanted top and bottom and mist text; tea swipe row; wide image then text; flag panel with ink text and black "Contact" button.
- 768: hero 50/50 with the parallelogram photo; teas in 3 columns, middle card lower.
- 1280: hero 5:7; statement text offset right of the edge; grown text in the right half under the image.
- Light theme: everything on photos stays mist; muted text readable; no saffron text on mist.

- [ ] **Step 8: Sideways phone**

At 667×375 on `/`: measure `h1` bottom and button bottom (`getBoundingClientRect`) after scrolling 0 and screenshot. Expected: the hero photo band is ≈ 45% of the height, and the tagline and button are reachable within one short scroll; nothing overlaps the header. Stop the server.

- [ ] **Step 9: Commit**

```powershell
git add src
git commit -m "Build the Diagonal home page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Our Story with altitude marker and prayer-flag summit

**Files:**
- Create: `src/app/our-story/page.tsx`, `src/app/our-story/_components/{ClimbTrack,AltitudeMarker,ClimbStage,PrayerFlags,Summit}.tsx`

**Interfaces:**
- Consumes: `stageLayout`, `StageLayout`, `stages`, `storyPage`, `LUNGTA_COLORS`, `SUMMIT_ALTITUDE_M`, `altitudeAt`, `formatAltitude`, `PageHero`, `Reveal`, `ImageReveal`, `ButtonLink`, `ArrowLink`.

- [ ] **Step 1: Create `src/app/our-story/_components/AltitudeMarker.tsx`**

```tsx
"use client";

import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { altitudeAt, formatAltitude } from "@/lib/altitude";

type AltitudeMarkerProps = { progress: MotionValue<number>; summit: number };

const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

// Decorative: the altitude fact (2,750 m) is stated in the page text, so this is aria-hidden.
export function AltitudeMarker({ progress, summit }: AltitudeMarkerProps) {
  const reduce = useReducedMotion();
  const smooth = useSpring(progress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const source = reduce ? progress : smooth;
  const label = useTransform(source, (p) => formatAltitude(altitudeAt(p, summit)));

  return (
    <div aria-hidden>
      {/* Desktop: thin bar on the right edge with flag-angled ticks. */}
      <div className="pointer-events-none fixed top-1/2 right-6 z-30 hidden h-[56vh] -translate-y-1/2 items-start gap-4 xl:flex">
        <motion.span className="-mt-4 bg-background/85 px-2 py-1 font-serif text-2xl text-foreground tabular-nums">
          {label}
        </motion.span>
        <div className="relative h-full w-0.5 bg-foreground/15">
          <motion.div className="absolute inset-0 origin-bottom bg-linear-to-t from-bhutan to-saffron" style={{ scaleY: source }} />
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -left-1.5 h-px w-3.5 -rotate-[34deg] bg-foreground/40"
              style={{ bottom: `${tick}%` }}
            />
          ))}
        </div>
      </div>
      {/* Phone and tablet: line along the bottom edge, value in a tag. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 xl:hidden">
        <motion.span className="notch absolute right-4 bottom-3 bg-background/90 px-3 py-1 font-serif text-lg text-foreground tabular-nums">
          {label}
        </motion.span>
        <div className="h-1 w-full bg-foreground/10">
          <motion.div className="h-full origin-left bg-linear-to-r from-saffron to-bhutan" style={{ scaleX: source }} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/our-story/_components/ClimbTrack.tsx`**

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "framer-motion";
import { AltitudeMarker } from "./AltitudeMarker";

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

- [ ] **Step 3: Create `src/app/our-story/_components/ClimbStage.tsx`**

```tsx
import Image from "next/image";
import type { ClimbStageData } from "@/data/story";
import type { StageLayout } from "@/lib/story";
import { cn } from "@/lib/utils";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";

type ClimbStageProps = { stage: ClimbStageData; layout: StageLayout };

export function ClimbStage({ stage, layout }: ClimbStageProps) {
  const headingId = `stage-${stage.id}`;

  if (layout === "full-bleed") {
    return (
      <section
        aria-labelledby={headingId}
        className="slant-both relative my-14 flex min-h-[80svh] items-end overflow-hidden py-[calc(var(--slant)+3rem)] md:my-20"
      >
        <Image src={stage.image.src} alt={stage.image.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/45 to-ink/15" />
        <div className="container-page relative">
          <Reveal className="max-w-3xl">
            <p className="font-serif text-xl text-saffron italic">{stage.marker}</p>
            <h2 id={headingId} className="mt-3 font-serif text-title text-mist">
              {stage.heading}
            </h2>
            <p className="mt-5 text-lead text-mist/85">{stage.body}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId} className="py-14 md:py-20 xl:py-24">
      <div className="container-page grid items-center gap-8 md:grid-cols-2 md:gap-12 xl:gap-20">
        <ImageReveal className={cn(layout === "image-right" && "md:order-2")}>
          <div className="notch relative aspect-4/3 overflow-hidden bg-card md:aspect-4/5">
            <Image
              src={stage.image.src}
              alt={stage.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ImageReveal>
        <Reveal className="max-w-xl">
          <p className="font-serif text-xl text-muted-foreground italic">{stage.marker}</p>
          <h2 id={headingId} className="mt-3 font-serif text-title text-foreground">
            {stage.heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{stage.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/app/our-story/_components/PrayerFlags.tsx`**

```tsx
import { LUNGTA_COLORS } from "@/data/story";
import { cn } from "@/lib/utils";

// A string of lungta across the summit: three runs of the five colours (two on phones).
const RUNS = 3;

export function PrayerFlags({ className }: { className?: string }) {
  const flags = Array.from({ length: RUNS }, () => LUNGTA_COLORS).flat();
  return (
    <div aria-hidden className={cn("relative h-24 md:h-28", className)}>
      <div className="absolute inset-x-0 top-4 h-px -rotate-2 bg-mist/60" />
      <ul className="absolute inset-x-0 top-4 flex -rotate-2 justify-between px-[4%]">
        {flags.map((flag, index) => (
          <li
            key={index}
            className={cn("lungta h-14 w-[7%] md:h-20 md:w-[5%]", index >= 10 && "hidden md:block")}
            style={{ backgroundColor: flag.hex, animationDelay: `${(index % 5) * -0.7}s` }}
          />
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/our-story/_components/Summit.tsx`**

```tsx
import Image from "next/image";
import { SUMMIT_ALTITUDE_M } from "@/data/site";
import { storyPage } from "@/data/story";
import { formatAltitude } from "@/lib/altitude";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { PrayerFlags } from "./PrayerFlags";

export function Summit() {
  const { heading, body, teasLabel, grownLabel, image } = storyPage.summit;
  return (
    <section
      aria-labelledby="summit-heading"
      className="slant-top relative flex min-h-[90svh] flex-col overflow-hidden pt-[var(--slant)] text-center xl:min-h-[100dvh]"
    >
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/60" />
      <PrayerFlags className="relative mt-10 md:mt-14" />
      <div className="container-page relative my-auto py-20">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="font-serif text-xl text-saffron italic">{formatAltitude(SUMMIT_ALTITUDE_M)}</p>
          <h2 id="summit-heading" className="max-w-3xl font-serif text-display text-mist">
            {heading}
          </h2>
          <p className="max-w-xl text-lead text-mist/85">{body}</p>
          <div className="mt-4 flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:gap-8">
            <ButtonLink href="/teas" className="w-full md:w-auto">
              {teasLabel}
            </ButtonLink>
            <ArrowLink href="/how-its-grown" tone="photo">
              {grownLabel}
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create `src/app/our-story/page.tsx`**

```tsx
import type { Metadata } from "next";
import { SUMMIT_ALTITUDE_M } from "@/data/site";
import { stages, storyPage } from "@/data/story";
import { stageLayout } from "@/lib/story";
import { PageHero } from "@/components/ui/PageHero";
import { ClimbStage } from "./_components/ClimbStage";
import { ClimbTrack } from "./_components/ClimbTrack";
import { Summit } from "./_components/Summit";

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
          <ClimbStage key={stage.id} stage={stage} layout={stageLayout(index)} />
        ))}
        <Summit />
      </ClimbTrack>
    </>
  );
}
```

- [ ] **Step 7: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass; build lists `○ /our-story`.

- [ ] **Step 8: Review in both themes at all three widths**

`npm run start`. For each theme and width on `/our-story`, scroll in 400 px steps to the bottom, then full-page screenshot, and read the marker text at top, middle and bottom (`browser_evaluate` on the marker span's `textContent`). Expected:
- Marker reads `0 m` at the top, roughly 1,000–1,700 m in the middle, `2,750 m` at the bottom; desktop bar with ticks on the right, phone/tablet bottom line plus tag.
- Stage order: image left, image right, full-bleed, image left, image right, full-bleed; markers ("New York, 2007" …) in italic serif.
- Summit: prayer flags in blue, white, red, green, yellow across the top (15 on tablet/desktop, 10 on phone), "2,750 m", heading, orange "See all teas" button and "How it's grown" link.
- Light theme: split-stage text ink/muted on mist; full-bleed and summit text mist on scrim.

- [ ] **Step 9: Commit**

```powershell
git add src
git commit -m "Build Our Story with the altitude marker and prayer-flag summit

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Our Teas and tea detail pages

**Files:**
- Create: `src/app/teas/_components/{TeaGrid,TeaDetail}.tsx`, `src/app/teas/page.tsx`, `src/app/teas/[slug]/page.tsx`

**Interfaces:**
- Consumes: `TeaCard`, `teas`, `getTea`, `otherTeas`, `teasPage`, `teaDetailCopy`, `PageHero`, `Section`, `ButtonLink`.

- [ ] **Step 1: Create `src/app/teas/_components/TeaGrid.tsx`**

```tsx
import type { Tea } from "@/data/teas";
import { cn } from "@/lib/utils";
import { TeaCard } from "@/components/teas/TeaCard";

// Staggered: on tablet every second card drops; on desktop the middle column drops.
export function TeaGrid({ teas }: { teas: Tea[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-x-8 md:pb-14 xl:grid-cols-3 xl:gap-x-10 xl:pb-20">
      {teas.map((tea, index) => (
        <li
          key={tea.slug}
          className={cn(
            index % 2 === 1 && "md:translate-y-14",
            "xl:translate-y-0",
            index % 3 === 1 && "xl:translate-y-20",
          )}
        >
          <TeaCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Create `src/app/teas/_components/TeaDetail.tsx`**

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
        <div className="notch relative mx-auto aspect-4/5 w-full overflow-hidden bg-card md:w-[70%] xl:sticky xl:top-28 xl:w-full xl:self-start">
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
            <p className="eyebrow text-accent-text">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-display text-foreground">{tea.name}</h1>
            <p className="mt-6 text-lead text-muted-foreground">{tea.description}</p>
          </header>
          {tea.benefits.length > 0 && (
            <section aria-labelledby="benefits-heading">
              <h2 id="benefits-heading" className="font-serif text-3xl text-foreground">
                {copy.benefitsHeading}
              </h2>
              <ul className="mt-4 space-y-3">
                {tea.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-muted-foreground">
                    <Leaf className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {tea.tasteNotes && (
            <section aria-labelledby="taste-heading">
              <h2 id="taste-heading" className="font-serif text-3xl text-foreground">
                {copy.tasteHeading}
              </h2>
              <p className="mt-4 text-muted-foreground">{tea.tasteNotes}</p>
            </section>
          )}
          {tea.brewing && (
            <section aria-labelledby="brewing-heading">
              <h2 id="brewing-heading" className="font-serif text-3xl text-foreground">
                {copy.brewingHeading}
              </h2>
              <p className="mt-4 text-muted-foreground">{tea.brewing}</p>
            </section>
          )}
          <section aria-labelledby="buy-heading" className="border-l-2 border-accent-mark pl-6">
            <h2 id="buy-heading" className="font-serif text-3xl text-foreground">
              {copy.whereToBuy.heading}
            </h2>
            <p className="mt-3 text-muted-foreground">{copy.whereToBuy.body}</p>
            <ButtonLink href="/contact#where-to-buy" className="mt-6 w-full md:w-auto">
              {copy.whereToBuy.linkLabel}
            </ButtonLink>
          </section>
        </div>
      </div>

      <section aria-labelledby="other-teas-heading" className="py-20 md:py-28">
        <div className="container-page">
          <h2 id="other-teas-heading" className="font-serif text-title text-foreground">
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

- [ ] **Step 3: Create the two routes**

`src/app/teas/page.tsx`:
```tsx
import type { Metadata } from "next";
import { teas } from "@/data/teas";
import { teasPage } from "@/data/pages";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TeaGrid } from "./_components/TeaGrid";

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

`src/app/teas/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTea, otherTeas, teas } from "@/data/teas";
import { TeaDetail } from "../_components/TeaDetail";

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

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass; build lists `○ /teas` and `● /teas/[slug]` with 5 paths.

- [ ] **Step 5: Review in both themes at all three widths**

`npm run start`. On `/teas` and `/teas/sea-buckthorn`, both themes, three widths, scrolled through then full-page screenshot. Expected: `/teas` 1 / 2 (second column lower) / 3 (middle column lower) columns, notched photos revealed diagonally; detail page: photo then text (phone), centred 70% photo (tablet), sticky photo left (desktop); no Benefits/Taste/Brewing headings (empty data); "Where to buy" with a saffron left rule and orange button; other teas row of four. Tab title `Sea Buckthorn · Bhutan Herbal Tea`.

- [ ] **Step 6: Unknown slug (Review Focus 5)**

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3000/teas/green-tea
curl.exe -s http://localhost:3000/teas/green-tea | Select-String -SimpleMatch "off the trail" | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `404`, then a count of at least `1`. Stop the server.

- [ ] **Step 7: Commit**

```powershell
git add src
git commit -m "Build the teas listing and tea detail pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: How It's Grown page

**Files:**
- Create: `src/app/how-its-grown/page.tsx`

**Interfaces:**
- Consumes: `grownPage`, `practices`, `people`, `CLOSING_LINE`, `PageHero`, `Section`, `Reveal`, `ImageReveal`.

- [ ] **Step 1: Create `src/app/how-its-grown/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { CLOSING_LINE } from "@/data/site";
import { grownPage, people, practices } from "@/data/grown";
import { ImageReveal } from "@/components/ui/ImageReveal";
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
          <h2 id="practices-heading" className="font-serif text-title text-foreground">
            {grownPage.practicesSection.heading}
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
          {practices.map((practice, index) => (
            <Reveal as="li" key={practice.title} delay={(index % 4) * 0.08}>
              <span aria-hidden className="block h-0.5 w-12 origin-left -rotate-[34deg] bg-accent-mark" />
              <h3 className="mt-6 font-serif text-2xl text-foreground">{practice.title}</h3>
              <p className="mt-3 text-muted-foreground">{practice.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="people-heading" className="pb-20 md:pb-28 xl:pb-36">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <h2 id="people-heading" className="font-serif text-title text-foreground">
              {grownPage.peopleSection.heading}
            </h2>
            <p className="mt-5 text-lead text-muted-foreground">{grownPage.peopleSection.intro}</p>
          </Reveal>
        </div>
        <ul
          aria-label={grownPage.peopleSection.heading}
          className="scroll-row mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16"
        >
          {people.map((person) => (
            <li key={person.image.src} className="w-[72%] shrink-0 snap-start md:w-[40%] xl:w-[26%]">
              <figure>
                <ImageReveal>
                  <div className="notch relative aspect-3/4 overflow-hidden bg-card">
                    <Image
                      src={person.image.src}
                      alt={person.image.alt}
                      fill
                      sizes="(min-width: 1280px) 26vw, (min-width: 768px) 40vw, 72vw"
                      className="object-cover"
                    />
                  </div>
                </ImageReveal>
                {person.caption && (
                  <figcaption className="mt-3 text-sm text-muted-foreground">{person.caption}</figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="slant-top relative overflow-hidden py-[calc(var(--slant)+6rem)] text-center md:py-[calc(var(--slant)+8rem)] xl:py-[calc(var(--slant)+11rem)]">
        <Image
          src={grownPage.closingImage.src}
          alt={grownPage.closingImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/65" />
        <div className="container-page relative">
          <Reveal>
            <p className="mx-auto max-w-4xl pb-1 font-serif text-title leading-[1.15] text-mist italic xl:text-display xl:leading-[1.1]">
              {CLOSING_LINE}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass; build lists `○ /how-its-grown`.

- [ ] **Step 3: Review in both themes at all three widths**

`npm run start`. On `/how-its-grown`, both themes, three widths, scrolled then full-page screenshot. Expected: practices 1 / 2×2 / 4 across, each with a saffron slash at the flag angle; people as a swipe row of tall notched portraits (next one peeking at every width); closing line in large italic mist on the photo with a slanted top, descenders not clipped. Stop the server.

- [ ] **Step 4: Commit**

```powershell
git add src
git commit -m "Build the How It's Grown page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Contact page

**Files:**
- Create: `src/app/contact/page.tsx`
- Test: `tests/routes.test.ts`

**Interfaces:**
- Consumes: `contact`, `contactPage`, `hasDirectContact`, `telHref`, `mailtoHref`, `socialLinks`, `WhatsAppButton`, `SocialLinks`, `PageHero`, `Section`.

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
          <div className="notch relative hidden aspect-3/4 overflow-hidden xl:block">
            <Image
              src={contactPage.sideImage.src}
              alt={contactPage.sideImage.alt}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>

          <section aria-labelledby="get-in-touch-heading">
            <h2 id="get-in-touch-heading" className="font-serif text-title text-foreground">
              {contactPage.getInTouchHeading}
            </h2>
            {hasDirectContact(contact) ? (
              <div className="mt-8 flex flex-col items-start gap-5">
                <WhatsAppButton label={contactPage.whatsappLabel} className="w-full md:w-auto" />
                {tel && (
                  <a href={tel} className="flex items-center gap-3 text-lg text-foreground hover:text-accent-text">
                    <Phone className="size-5" aria-hidden />
                    {contact.phone}
                  </a>
                )}
                {mail && (
                  <a href={mail} className="flex items-center gap-3 text-lg text-foreground hover:text-accent-text">
                    <Mail className="size-5" aria-hidden />
                    {contact.email}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-8 text-lead text-muted-foreground">{contactPage.comingSoon}</p>
            )}
            {hasSocials && (
              <div className="mt-12">
                <h3 className="font-serif text-2xl text-foreground">{contactPage.followHeading}</h3>
                <SocialLinks className="mt-4" />
              </div>
            )}
          </section>

          <section id="where-to-buy" aria-labelledby="where-to-buy-heading" className="scroll-mt-24">
            <h2 id="where-to-buy-heading" className="font-serif text-title text-foreground">
              {contactPage.whereToBuyHeading}
            </h2>
            {contact.whereToBuy.length > 0 ? (
              <ul className="mt-8 space-y-4">
                {contact.whereToBuy.map((place) => (
                  <li key={place} className="flex gap-3 text-lg text-foreground">
                    <MapPin className="mt-1 size-5 shrink-0" aria-hidden />
                    {place}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 text-lead text-muted-foreground">{contactPage.whereToBuyComingSoon}</p>
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
Expected: all pass, including `every nav link points at an existing page`.

- [ ] **Step 5: Lint and build**

Run: `npm run lint; npm run build`
Expected: no errors; build lists `○ /contact`.

- [ ] **Step 6: No empty contact links (Review Focus 5)**

```powershell
Get-ChildItem -Recurse .next\server\app -Filter *.html | Select-String -Pattern 'wa\.me/|href="tel:|href="mailto:' | Measure-Object | Select-Object -ExpandProperty Count
Get-ChildItem -Recurse .next\server\app -Filter *.html | Select-String -Pattern "Contact details coming soon|Stockists coming soon" | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `0`, then at least `2`. (If the HTML lives elsewhere in `.next`, locate it with `Get-ChildItem -Recurse .next -Filter contact*.html` and adjust the path; record the actual path in the ledger.)

- [ ] **Step 7: Review in both themes at all three widths**

`npm run start`. On `/contact`, both themes, three widths, full-page screenshot. Expected: stacked (phone), two columns (tablet), side photo + two columns (desktop); "Contact details coming soon.", Facebook under "Follow us", "Stockists coming soon.". From `/teas/chamomile`, click "Where to buy": lands on `/contact` with the "Where to buy" heading below the header. Stop the server.

- [ ] **Step 8: Commit**

```powershell
git add src tests
git commit -m "Build the contact page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: SEO: Open Graph image, sitemap, robots

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

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
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0E0E0C", color: "#F4F1EA" }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56, padding: 72 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
          <img src={logoSrc} width={280} height={254} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{SITE_NAME}</div>
            <div style={{ marginTop: 20, fontSize: 40, color: "#F2C230" }}>{TAGLINE}</div>
            <div style={{ marginTop: 32, fontSize: 24, color: "#AFADA7" }}>{line}</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 150,
            height: "100%",
            backgroundImage: "linear-gradient(to bottom right, #F2C230 50%, #E86A1C 50%)",
          }}
        />
      </div>
    ),
    size,
  );
}
```

(`254` = 280 × 727 / 800, the logo's real ratio from Task 2 of the original plan.)

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass; build lists `/opengraph-image`, `/robots.txt`, `/sitemap.xml`.

- [ ] **Step 5: Check the generated files**

`npm run start`, then:
```powershell
(Invoke-WebRequest http://localhost:3000/sitemap.xml -UseBasicParsing).Content
(Invoke-WebRequest http://localhost:3000/robots.txt -UseBasicParsing).Content
Invoke-WebRequest http://localhost:3000/opengraph-image -OutFile "$env:TEMP\og.png"
(Invoke-WebRequest http://localhost:3000/teas/hypericum -UseBasicParsing).Content -match 'property="og:image"'
```
Expected: 10 sitemap URLs; robots allows `/` and points to the sitemap; `og.png` (Read it) shows ink background, logo, title, saffron tagline, a flag-split stripe on the right; last line `True`. Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add src
git commit -m "Add Open Graph image, sitemap and robots

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Quality pass: themes, reduced motion, accessibility, Lighthouse

**Files:**
- Modify: only files where a check fails (each fix recorded in the ledger).

- [ ] **Step 1: Production server**

Run: `npm run build; npm run start` (background).

- [ ] **Step 2: Reduced motion (Review Focus 4)**

`browser_emulate_media` `reducedMotion: "reduce"`, 1280×800.
- `/`: `getComputedStyle(document.querySelector('.mist-layer')).animationName` → `"none"`. Scroll 600 px; the hero image wrapper's `style.transform` shows no translate beyond 0.
- `/teas`: right after load, scroll to the grid and read a reveal wrapper's computed `clip-path` within 100 ms: fully shown (`polygon(0% 0%, 200% 0%, 0% 200%, 0% 0%)` or `none`).
- `/our-story`: `.lungta` `animationName` → `"none"`; the altitude value still changes between top and bottom.
- Navigate `/` → `/teas`: `.page-fade` `animationName` → `"none"`.

- [ ] **Step 3: No-JavaScript rendering**

```js
async (page) => {
  const context = await page.context().browser().newContext({ javaScriptEnabled: false });
  const p = await context.newPage();
  await p.goto("http://localhost:3000/teas");
  const hidden = await p.$$eval("[data-reveal]", (els) =>
    els.filter((e) => { const s = getComputedStyle(e); return s.opacity === "0" || (s.clipPath !== "none" && s.clipPath.includes("0% 0%, 0% 0%")); }).length);
  const h1 = await p.textContent("h1");
  await context.close();
  return { hidden, h1 };
}
```
Expected: `{ hidden: 0, h1: "Five teas, grown higher" }`.

- [ ] **Step 4: Keyboard and landmarks**

For every route (`/`, `/our-story`, `/teas`, `/teas/chamomile`, `/how-its-grown`, `/contact`, `/nope`) at 1280×800 in both themes: `browser_snapshot` shows exactly one `h1`, `banner`, `main`, `contentinfo`, every image named. Tab through the first 10 stops in light theme; screenshot one focused link (ink outline) and one focused primary button (inset ink ring). Fix any failure.

- [ ] **Step 5: Final review: every page, both themes, three widths**

42 full-page screenshots (7 routes × 2 themes × 3 widths). For each, check: no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`), no text over a photo without a scrim, no saffron text on mist, flag split only in the four allowed places (plus the menu stripe), lungta only at the summit, slanted edges all rising to the right.

- [ ] **Step 6: Lighthouse on every page, mobile and desktop**

For each route:
```powershell
npx --yes lighthouse http://localhost:3000/ --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$env:TEMP\lh-home-mobile.json"
npx --yes lighthouse http://localhost:3000/ --quiet --preset=desktop --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$env:TEMP\lh-home-desktop.json"
node -e "const r=require(process.env.TEMP+'/lh-home-mobile.json');console.log(Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])))"
```
Repeat for `/our-story`, `/teas`, `/teas/chamomile`, `/how-its-grown`, `/contact`. Expected: every category ≥ 90 on mobile and desktop. A performance score of 85–89 caused only by local server response time is noted for re-checking after deploy; anything else is fixed.

- [ ] **Step 7: Full check and commit fixes**

Stop the server. Run: `npm run lint; npm test; npm run build`
```powershell
git add -A
git commit -m "Quality pass: themes, reduced motion, accessibility and performance fixes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
(Skip the commit if nothing changed.)

---

### Task 11: Deploy to Netlify (needs the user)

Pushing and connecting Netlify are outward-facing. **Ask the user before each step.**

- [ ] **Step 1:** Ask before merging `build-site` into `main` and pushing to `origin` (`https://github.com/Bhutan-Herbal-Tea/Bhutanherbaltea.git`).
- [ ] **Step 2:** The user imports the repo in Netlify (build command `npm run build`, Next.js runtime auto-detected, no `output: 'export'`).
- [ ] **Step 3:** Re-run Task 10 Step 6 against the Netlify URL; check a WhatsApp or Facebook link preview shows the OG image.
- [ ] **Step 4:** Report the open client items: photos, transparent/vector logo, tea descriptions, approved benefits, phone, WhatsApp, email, Instagram, stockists, domain, confirmation of Thimphu, the five teas, 2,750 m and the founders' names.
