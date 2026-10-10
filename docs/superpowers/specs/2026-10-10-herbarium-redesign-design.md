# Bhutan Herbal Tea: "The Herbarium" redesign

Date: 2026-10-10 · Status: awaiting review · Supersedes the visual design in [2026-10-09-diagonal-visual-design.md](2026-10-09-diagonal-visual-design.md). Content, facts, routes, data files, SEO, accessibility and testing rules from [2026-10-09-bhutan-herbal-tea-site-design.md](2026-10-09-bhutan-herbal-tea-site-design.md) and [CLAUDE.md](../../../CLAUDE.md) still apply.

## 1. Why

The user's own site, [Tshering Tours & Treks](https://tsheringtoursandtrek.netlify.app/) ([source](https://github.com/TsheringToursAndTreks/TTT_Website.git)), is the quality benchmark: warm editorial layout, three typefaces with clear jobs, Bhutanese script as decoration, a signature photo frame, real photography, and a varied section rhythm (ticker, facts band, numbered rows, quote, dark closing panel).

The redesign takes that whole approach and makes it specific to an herbal tea brand. The signature idea is the **herbarium**: each herb is presented like a pressed specimen sheet from a botanical archive. It must read as Bhutan Herbal Tea, not as a sibling of the tour site.

Design read: editorial heritage site for an organic herbal tea brand, international and Bhutanese visitors, light and warm, built from botanical-archive cues. Dials: variance 6, motion 4, density 4.

## 2. What changes and what stays

| Changes | Stays |
| --- | --- |
| Light theme becomes the primary look (paper background) | Six routes, all content and facts, data files |
| Deep tea-leaf green replaces ink as the dark colour | Light and dark themes with the header toggle and pre-paint script |
| Specimen-plate frame replaces parallelograms and notched frames | Altitude counter and prayer-flag summit on Our Story |
| **All slanted section edges removed** (page heroes, home sections, story, 404, closing sections) | The flag split as an accent (button hover, closing panel, menu stripe) |
| Logo becomes an archive "seal" on the hero plate | Accessibility, reduced motion, SEO files, tests, Netlify setup |
| DM Mono labels, Noto Serif Tibetan accents, herb ticker, facts band, numbered rows | Placeholder images replaced by Unsplash photos (same file names) |

## 3. Visual system

### Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `#F4F1EA` (paper) | `#0F1712` (green-black) | Page |
| `foreground` | `#14201A` | `#F4F1EA` | Body text |
| `forest` | `#1E3A2B` | `#1E3A2B` | Headline accent words, dark panels, primary text links |
| `paper-deep` / `card` | `#EAE5D8` | `#16221B` | Plate sheets, ticker band |
| `muted-foreground` | `#4F4C46` | `#AFADA7` | Secondary text (≥ 7:1) |
| `saffron`, `bhutan` (orange) | unchanged | unchanged | Flag pair: button hover, closing panel, small marks |
| `leaf` | `#5DAE3B` | `#5DAE3B` | Small botanical marks only, never text on paper |
| `accent-text` | `#1E3A2B` | `#F2C230` | Links and highlighted words |

All text pairs must pass WCAG AA; `tests/contrast.test.ts` is updated to the new tokens.

### Type

- **Cormorant Garamond**: headlines. Each major headline may set **one word in italic** in `forest` (light) or `saffron` (dark), e.g. "Wellness in every *sip*." Italic words with descenders get `leading-[1.1]` and bottom clearance.
- **Geist**: body text.
- **DM Mono** (new, `next/font/google`): small uppercase specimen labels, the ticker and the facts band. Used only for labels, never for paragraphs.
- **Noto Serif Tibetan** (new): decorative Dzongkha. Text: འབྲུག་ཇ། (Druk ja, "Bhutanese tea"; chosen by the user 2026-10-10, replacing འབྲུག་ཡུལ། Druk Yul).

### Signature device: the specimen plate

`<SpecimenPlate>` wraps every content photo:
- a paper sheet (`card` colour) with a thin inner border and padding, the photo inside;
- four small **mounting corners** (translucent paper strips at each photo corner, CSS only);
- a monospace label row under the photo built from real data only, e.g. `MATRICARIA CHAMOMILLA · CHAMOMILE · THIMPHU, 2,750 M`. No invented plate numbers, dates or photo credits.

### Logo seal

The round logo sits over the bottom-left corner of the hero plate, slightly rotated, like an archive stamp. The header keeps the serif wordmark.

### Motion (all off under reduced motion)

Gentle only: hero fade-up, plates fade in on scroll (opacity and a 12px lift), the herb ticker (36s loop), the altitude counter and the prayer-flag flutter. No parallax, no clip-path wipes, no mist.

## 4. Content additions (data files)

- `teas.ts`: each tea gets `botanical: string` (Latin name for its label). Values: Chamomile `Matricaria chamomilla`, Peppermint `Mentha × piperita`, Lemon Verbena `Aloysia citrodora`, Sea Buckthorn `Hippophae` (genus only: the Himalayan species grown is unknown), Hypericum `Hypericum` (genus only). All marked `TODO: client to confirm species`.
- `site.ts`: `facts` for the facts band, each sourced from the Daily Bhutan article: `2016` founded, `2,750 m` growing altitude, `5` certified organic teas, `3` Brand Bhutan certified, `1st` herbal tea farm in Bhutan.
- `pages.ts` / `story.ts` / `grown.ts`: copy for the new sections (ticker uses tea names + botanical names; "why altitude" rows; quote uses the existing closing line). No testimonials until real ones exist.

## 5. Page compositions

Phone (< 768px), tablet (`md`), desktop (`xl`) each composed deliberately; every multi-column block collapses to one column on phones.

### Home
1. **Hero (split):** left: Dzongkha འབྲུག་ཡུལ། + mono `THIMPHU, BHUTAN · 2,750 M`, headline "Wellness in every *sip*.", subtext (≤ 20 words), "Discover our story" button, "See all teas" mono link. Right: large specimen plate (herb field) with the logo seal. Phone: plate first, text below; plate height capped so the button stays above the fold.
2. **Herb ticker:** "CHAMOMILE ✦ MATRICARIA CHAMOMILLA ✦ PEPPERMINT ✦ …", the only marquee on the page; static under reduced motion.
3. **Facts band:** five sourced facts in forest-green band with mono labels; 2 columns phone, 5 desktop.
4. **Why altitude:** three numbered rows (large italic serif numerals 01–03, title, one sentence): slow growth, volatile oils, flavour/aroma/nutrients. Links to Our Story.
5. **Specimen catalogue preview:** the three Brand Bhutan teas as plates (swipe row on phone, 3 columns from tablet), "See all teas".
6. **Quote:** "Drink tea that heals you and heals the earth." in large italic serif over a faded Dzongkha watermark.
7. **Closing panel:** forest green with the flag diagonal stripe, "Questions about our teas?", WhatsApp (when a number exists) and "Contact".

### Our Story (field journal)
Page hero (flat bottom), then stages as journal entries: mono marker ("NEW YORK, 2007"), heading, body, plate photo. Alternating sides on desktop, max two in a row before a full-width photo entry. Altitude counter unchanged in behaviour, restyled in forest/saffron. Ends at the prayer-flag summit (photo of prayer flags on a pass), "See all teas" and "How it's grown".

### Our Teas (catalogue)
Page hero, then five plates: 1 / 2 / 3 columns, each label with botanical name; card title in serif, one-line description.

### Tea detail (specimen sheet)
Desktop: large plate left (sticky), right: mono label block (botanical name, "Certified organic", "Thimphu, 2,750 m"), name, description, conditional benefits/taste/brewing, "Where to buy" panel. Other teas as a plate row.

### How It's Grown
Page hero, numbered practice rows (same component as home "why altitude"), farmer plates gallery (swipe row), closing line over a photo.

### Contact
Page hero, two columns (talk to us / where to buy), plate photo on desktop, closing forest panel removed here (the page itself is the contact).

### Shared
- **Header:** wordmark, mono-styled nav (uppercase, tracked, like the reference), theme toggle, hamburger below `xl`. Solid paper/green background.
- **Footer:** forest-green band (light theme) with logo, tagline, nav, socials, copyright.
- **404:** full-width photo, no slant, "See all teas" and "Back to home".
- **Page hero:** photo band with flat bottom edge, title and intro on a dark scrim.

## 6. Photography (Unsplash)

Downloaded into `public/images/` under the **existing file names** (so data paths do not change), resized to ≤ 2000px wide and ≤ 300 KB for the hero. A `public/images/CREDITS.md` lists photographer, Unsplash URL and file for every image (the Unsplash licence allows free use; credit is courtesy). Needed shots:

| File | Subject |
| --- | --- |
| `hero/thimphu-fields.jpg` | Green terraced hills or herb fields in a Himalayan valley |
| `fields/farm.jpg`, `fields/herb-rows.jpg`, `fields/drying.jpg` | Bhutan valley / Thimphu; rows of herbs; herbs drying |
| `story/stage-1..6.jpg`, `story/summit.jpg` | New York at dusk; Thimphu valley; young herb plants; high mountain slopes; leaf close-up; tea in a cup; prayer flags on a mountain pass |
| `teas/chamomile.jpg` … `teas/hypericum.jpg` | Close-up of each herb: chamomile flowers, peppermint leaves, lemon verbena, sea buckthorn berries, St John's wort flowers |
| `people/farmer-1..4.jpg` | Hands harvesting herbs; farm work (no identifiable faces presented as the client's staff) |

Alt text in the data files is updated to describe each actual photo. All are marked as stand-ins for the client's own photos.

## 7. Verification

- `npm run lint`, `npm test`, `npm run build` pass at every step; contrast and content tests updated for new tokens and `botanical`/`facts` data.
- Every page screenshotted at 375 / 768 / 1280 in both themes.
- No slanted edges anywhere (check: no `slant-*` utility in `src/`).
- Reduced motion: ticker static, no fades, flags still, counter works.
- Lighthouse on the live Netlify site after deploy: 90+ in every category, mobile and desktop.
- Hero image ≤ 300 KB; only each page's first image preloaded.
