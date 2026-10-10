# Bhutan Herbal Tea — Website

Client showcase website for **Bhutan Herbal Tea**, a Bhutanese brand of organic, high-altitude herbal teas grown in Bumthang, Bhutan. Tagline: **"Wellness in Every Sip."**

## Known facts

Source: [Daily Bhutan, "Brand Bhutan: Bhutan Herbal Tea" (2023)](https://dailybhutan.com/article/brand-bhutan-bhutan-herbal-tea). Client to confirm before launch.

- Founded March 2016 by **Rinzin Wangchuk** and **Wangchuk Kuenga**, who first met in New York in 2007 and reconvened in Thimphu in 2015.
- Farm in **Bumthang** Dzongkhag, confirmed by the client (2026-10-10); the article itself names no farm location. Village: **Damphel Chokorteo / Shingkhar** (exact client spelling, `FARM_VILLAGE`), named on Our Story and How It's Grown; short labels just say Bumthang. "The first and only herbal tea farm in Bhutan." Thimphu appears only as where the founders reconvened in 2015 (and where Wangchuk Kuenga grew herbs at Yusipang, 2009 to 2015).
- Herbs grown and harvested **above 9,000 ft (2,750 m)**.
- Five certified organic teas: **Chamomile, Peppermint, Lemon Verbena, Sea Buckthorn, Hypericum**. Chamomile, Peppermint and Lemon Verbena carry Brand Bhutan certification.
- Herbs are hand-harvested at their peak, carefully dried and packaged without chemical additives. 100% organic.

This is a **showcase and brand-story site only**: no shop, cart, checkout, accounts, database or API routes. Keep it simple.

## Goals

1. **Wow moment.** Visitors should feel transported to the Himalayas ("Where am I? This is unbelievable.").
2. **Tell the altitude story.** At high altitude, herbs grow slowly and build up more volatile oils. That shows in the flavour, aroma and nutrient level of the tea.
3. **Simple, and equally good on every screen.** Many visitors are on phones, some on slower connections, but desktop and tablet matter just as much. The audience is both international and local (Bhutan).
4. **Easy to navigate.** Separate pages per topic, a clear menu, and no hunting for information.

## Tech stack

- **Next.js** (latest stable), **App Router**, **TypeScript** (strict mode)
- **Tailwind CSS**, with brand colours and fonts defined once as theme tokens
- **Framer Motion** for scroll-linked animation (`useScroll`, `useTransform`), reveals and gentle page transitions
- **next/image** for all photos; **next/font/google** for fonts
- **Netlify** hosting (Next.js is auto-detected). Do **not** use `output: 'export'`; Netlify's image CDN handles `next/image`.
- No backend, database, auth or API routes. Content is static and lives in typed data files. All pages are statically generated.

## Pages

| Route              | Page             | Purpose                                                        |
| ------------------ | ---------------- | -------------------------------------------------------------- |
| `/`                | Home             | The wow moment, a taste of the story, a teaser of the teas     |
| `/our-story`       | Our Story        | The "Grown Higher" altitude journey (signature page)           |
| `/teas`            | Our Teas         | All five teas                                                  |
| `/teas/[slug]`     | Tea detail       | One page per tea                                               |
| `/how-its-grown`   | How It's Grown   | Farming practices and the people who grow the herbs            |
| `/contact`         | Contact          | Where to buy and how to get in touch                           |

### Home `/`

- **Hero:** full-screen photo of the Thimphu fields, subtle drifting mist, logo, "Wellness in Every Sip".
- **Short altitude teaser:** one or two lines on why altitude matters, plus a "Discover our story →" link to `/our-story`.
- **Featured teas:** 3 to 5 tea cards (swipeable on mobile) linking to their detail pages, plus "See all teas →".
- **Grown with care:** a short strip with one photo of the farmers, linking to `/how-its-grown`.
- **Contact call-to-action:** a WhatsApp button and a link to `/contact`.

### Our Story `/our-story` — "Grown Higher"

The signature experience. **As the visitor scrolls down this page, they climb the mountain.**

- A fixed **altitude marker** shows a number counting upward with scroll progress, from 0 m ("you start at sea level") at the top of the page to the growing altitude at the end.
  - **Desktop:** a thin vertical bar on the right edge with the altitude value.
  - **Mobile:** a slim progress line with the number in a small pill.
- Content is revealed in stages along the climb: the founders meet in New York (2007) → Thimphu (2015) → the farm is founded (March 2016) → slow growth above 2,750 m → more volatile oils → richer flavour, aroma and nutrients.
- It ends at "the summit," with links to `/teas` and `/how-its-grown`.
- The growing altitude lives in one constant, `SUMMIT_ALTITUDE_M = 2750` in `src/data/site.ts`, marked as sourced from the 2023 article and awaiting client confirmation.

### Our Teas `/teas`

- A grid of all five teas (one column on mobile, two on tablet, three on desktop).
- Each card has a product photo, name and one-line description, and links to `/teas/[slug]`.
- The five teas: Chamomile, Peppermint, Lemon Verbena, Sea Buckthorn, Hypericum.
- **No health claims.** Hypericum (St John's wort) interacts with medications, so benefits are shown only when the client supplies approved wording.

### Tea detail `/teas/[slug]`

- Statically generated with `generateStaticParams` from `src/data/teas.ts`.
- Large product photo, name, description, benefits list, optional taste notes and brewing tips (only if provided).
- A "where to buy" call-to-action and links to other teas.
- Each page gets its own metadata title and description.

### How It's Grown `/how-its-grown`

- Organic and regenerative farming that protects soil health, biodiversity and purity.
- Hand-harvested at their peak, carefully dried, packaged without chemical additives, crafted in small batches.
- **The people:** a photo gallery of the farmers in the fields, with short captions.
- Closing line: "Drink tea that heals you and heals the earth."

### Contact `/contact`

- Where to buy (stockists or shops).
- A prominent WhatsApp button (`https://wa.me/<number>`), plus phone (`tel:`), email (`mailto:`) and social links.
- Any detail that is still empty is hidden, never shown as a broken link. If nothing is filled in yet, show "Contact details coming soon".
- **No contact form** for now: there is no backend.

### Shared layout

- **Header:** serif text wordmark (links home; the full logo is too detailed at header size), with nav links to Our Story, Our Teas, How It's Grown and Contact. On mobile it becomes a full-screen menu with a hamburger toggle that is keyboard and screen-reader accessible. Highlight the active page.
- **Footer:** short tagline, nav links, social icons, copyright.
- **Page transitions:** a gentle fade only, disabled under reduced motion.
- A custom `not-found.tsx` in the brand style.

## Visual design

### Colour tokens (from the client's logo)

| Token        | Hex       | Use                                   |
| ------------ | --------- | ------------------------------------- |
| `ink`        | `#0E0E0C` | Main background (deep black)          |
| `mist`       | `#F4F1EA` | Body text on dark backgrounds         |
| `saffron`    | `#F2C230` | Altitude marker, highlights, links    |
| `bhutan`     | `#E86A1C` | Buttons, accents                      |
| `leaf`       | `#5DAE3B` | Herbal cues, tea names                |
| `amber`      | `#D9822B` | Tea colour, soft glows                |

### Style rules

- **Photography leads.** Use large, full-width images. The UI stays calm and minimal.
- **Refined, not busy.** Use the logo's colours, but not its glossy clip-art style. No gradients-everywhere and no heavy shadows.
- **Typography:** an elegant serif for headings (e.g. Cormorant Garamond or Playfair Display) and a clean sans-serif for body (e.g. Inter). Load both via `next/font/google`.
- **Motion is gentle:** slow fades, soft parallax on mountain photos, drifting mist. Nothing bouncy or flashy.
- Each inner page opens with a short **page hero**: a photo band with the page title, using the same style everywhere.
- **Logo:** the source file is `public/images/Herbal tea.jpg` (white background, screenshot icon in the corner). Use the cleaned, transparent `public/logo.png` derived from it, large in the home hero and the footer. Ask the client for an original transparent or vector file.
- Maintain good contrast on the dark background (WCAG AA).

## Content and data

All editable content lives in `src/data/`, never hard-coded in components.

```ts
// src/data/teas.ts
export type Tea = {
  slug: string;          // e.g. "sea-buckthorn"
  name: string;
  botanical: string;     // Latin name on the specimen label (client to confirm species)
  shortDescription: string;
  description: string;
  benefits: string[];    // empty until the client supplies approved wording
  tasteNotes?: string;   // only if the client provides it
  brewing?: string;      // only if the client provides it
  image: string;         // path under /public/images/teas/
  imageAlt: string;      // describes the actual photo
  accent?: string;       // optional colour from the box design
  featured?: boolean;    // shown on the home page
};
```

```ts
// src/data/site.ts
export const SUMMIT_ALTITUDE_M = 2750; // Daily Bhutan 2023 ("above 9,000 ft"). TODO: client to confirm
export const nav = [
  { href: "/our-story", label: "Our Story" },
  { href: "/teas", label: "Our Teas" },
  { href: "/how-its-grown", label: "How It's Grown" },
  { href: "/contact", label: "Contact" },
];
export const contact = {
  phone: "",       // TODO
  whatsapp: "",    // TODO: international format, digits only
  email: "",       // TODO
  social: { facebook: "", instagram: "" }, // TODO
  whereToBuy: [] as string[],              // TODO
};
```

Missing client content is expected. Use clearly marked placeholders (`TODO`) and placeholder images rather than inventing facts, benefits or contact details.

## Suggested structure

```
src/
  app/
    layout.tsx               # fonts, header, footer, default metadata
    page.tsx                 # Home
    our-story/page.tsx
    teas/page.tsx
    teas/[slug]/page.tsx
    how-its-grown/page.tsx
    contact/page.tsx
    not-found.tsx
    sitemap.ts
    robots.ts
    opengraph-image.(png|tsx)
    globals.css
  components/
    layout/                  # Header, MobileMenu, Footer, PageTransition
    home/                    # Hero, StoryTeaser, FeaturedTeas, GrownStrip, ContactCta
    story/                   # AltitudeMarker, ClimbStage
    teas/                    # TeaCard, TeaGrid, TeaDetail
    ui/                      # PageHero, Section, Reveal, Button, WhatsAppButton
  data/
    teas.ts
    site.ts
public/
  images/                    # hero/, teas/, people/, fields/
  logo.png                   # cleaned from images/Herbal tea.jpg
```

## Requirements

- **Every screen size gets equal focus.** Phone (375 px), tablet (768 px) and desktop (1280 px+) each get a deliberately composed layout, not one stretched or squeezed from another. Write mobile-first CSS, but design and review all three with the same care. Check every page at 375, 768 and 1280 before calling it done.
- **Performance:** Lighthouse score of 90+ on mobile and desktop, on every page. Hero images under ~300 KB. Lazy-load everything below the fold. Use `preload` (Next 16's replacement for the deprecated `priority`) only on each page's first image.
- **Accessibility:** meaningful `alt` text on all images, semantic landmarks and headings (one `h1` per page), an accessible mobile menu (focus trap, Escape to close, `aria-expanded`), visible focus states, and a skip-to-content link. Respect `prefers-reduced-motion` by disabling parallax, mist, scroll-linked transforms and page transitions (Framer Motion `useReducedMotion`).
- **SEO:** a unique title and description for each page via the `metadata` export, `generateMetadata` for tea pages, an Open Graph image for good link previews on WhatsApp and Facebook, plus `sitemap.ts` and `robots.ts`.
- **Client components** only where needed (animation, scroll, mobile menu). Keep the rest as Server Components.
- No layout shift: always give images their dimensions or `fill` with a sized parent.

## Working conventions

- Build page by page. Get each one looking right on phone, tablet and desktop before moving on.
- Keep components small and typed. No `any`.
- Run `npm run lint` and `npm run build` before considering a step done.
- Don't add dependencies beyond the stack above without asking.
- Don't add pages, routes, forms or features outside this brief without asking.

## Build plan

1. Scaffold Next.js (TypeScript, App Router, Tailwind, ESLint). Add Framer Motion. Set up colour and font tokens.
2. Data files with placeholders, plus the shared UI components (`PageHero`, `Section`, `Reveal`, `Button`, `WhatsAppButton`).
3. Layout: header with responsive mobile menu, footer, page transition, `not-found`.
4. Home page.
5. Our Story page with the altitude marker (desktop and mobile versions).
6. Our Teas page and tea detail pages (`generateStaticParams`, `generateMetadata`).
7. How It's Grown page.
8. Contact page.
9. Metadata, Open Graph image, sitemap and robots.
10. Reduced-motion pass, accessibility pass, Lighthouse check on every page.
11. Deploy to Netlify from the GitHub repo.
