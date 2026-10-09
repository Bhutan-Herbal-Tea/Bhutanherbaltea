# Bhutan Herbal Tea: "The Diagonal" visual redesign

Date: 2026-10-09 · Status: awaiting review · Supersedes the visual sections (§4, §5, §6 motion) of [2026-10-09-bhutan-herbal-tea-site-design.md](2026-10-09-bhutan-herbal-tea-site-design.md). Everything else in that spec (content decisions, architecture, data files, SEO, verification) still applies.

## 1. Why

The first build read as a generic premium-tea template: dark background, centred serif hero, fade-ins, equal cards. Nothing in it was specifically Bhutanese. The redesign takes its visual language from two real sources tied to the brand:

- **Bhutan's flag**: saffron yellow over orange, split on a diagonal. The logo's ring is exactly black, saffron and orange.
- **Lungta (prayer flags)**: hung on high mountain passes in five colours. This matches the altitude story: the climb ends at a pass with prayer flags.

Design read: premium heritage brand-story site for international visitors and Bhutanese locals, with a geometric, flag-derived language, built in Tailwind v4 + Motion. Dials: variance 7, motion 6, density 3.

## 2. Signature devices

| Device | Rule |
| --- | --- |
| **Diagonal edges** | Section boundaries are slanted (`clip-path`, rise ≈ 5vw across the width), alternating direction down the page like switchbacks. Never more than one slanted edge per section boundary. |
| **Flag split** | Two-tone diagonal: saffron top-left, orange bottom-right. Used in exactly four places: hero logo halo, button hover fill, altitude marker fill, the home contact panel. |
| **Diagonal reveal** | Images enter with a `clip-path` wipe along the flag angle (once, on entering the viewport). |
| **Clipped corners** | All radii are 0. Buttons and image frames have one clipped corner (top-right, ~10px) via `clip-path`. |
| **Prayer-flag summit** | One string of five-colour lungta flags (blue, white, red, green, yellow) at the end of Our Story, fluttering with a CSS skew loop. The only place these five colours appear. |

## 3. Themes: light and dark

Both themes ship. The default follows `prefers-color-scheme`. A toggle in the header overrides it and is remembered in `localStorage`. An inline script in `<head>` applies the stored theme before first paint, so there's no flash. No new dependency.

| Token | Dark | Light | Notes |
| --- | --- | --- | --- |
| `--background` | `#0E0E0C` (ink) | `#F4F1EA` (mist) | Both are brand tokens from CLAUDE.md |
| `--foreground` | `#F4F1EA` | `#0E0E0C` | |
| `--muted-foreground` | `#AFADA7` | `#57544D` | ≥ 7:1 on its background |
| `--card` | `#171714` | `#EAE6DC` | |
| `--border` | mist / 12% | ink / 14% | |
| `--accent-text` | saffron `#F2C230` | ink `#0E0E0C` | Saffron text fails contrast on mist (1.6:1), so light mode uses ink text with a saffron underline/mark |
| `--accent-mark` | saffron | saffron | Decorative bars, underlines and fills only, never body text on light |
| `--ring` (focus) | saffron | ink | Saffron focus outline fails 3:1 on mist |
| Primary button | orange fill, ink text (6:1) | same | Works in both themes |

Photography keeps its own dark scrim in both themes. Text placed **on photos** is always mist-on-scrim, regardless of theme. The logo (black badge, saffron ring) works on both backgrounds.

## 4. Type

- Headings: **Cormorant Garamond** (heritage brand, and the brief asks for a serif). Display sizes use `leading-[1.05]` minimum, and italic words with descenders get extra bottom clearance.
- Body: **Geist** (replaces Inter).
- No Dzongkha script until the client supplies or approves the text.

## 5. Page compositions

Layout families are never repeated within one page. Phone, tablet and desktop are each composed deliberately.

### Home
1. **Hero (asymmetric split):** left: logo with the flag halo, "Wellness in Every Sip.", one line of subtext (≤ 20 words), and the "Discover our story" button. Right: tall photo in a diagonal parallelogram frame with drifting mist and gentle parallax. Phone: photo on top with a slanted bottom edge, text below. Tablet: 50/50. No eyebrow, no scroll cue.
2. **Altitude statement (full-bleed band):** photo between two diagonal edges, one large sentence about growing above 2,750 m, and a "Read the story" link.
3. **Featured teas (offset row):** the three Brand Bhutan teas, staggered vertically (middle card lower) on tablet and desktop; a swipe row on phone. "See all teas" link.
4. **Grown with care (wide image band + text below):** a different family from section 2: the image is a wide 21:9 crop, with text in a narrow column beneath it.
5. **Contact panel (flag split):** the one block filled with the saffron/orange diagonal, ink text, with the WhatsApp button (when a number exists) and a "Contact" link.

### Our Story
Page hero; then stages alternate photo/text on desktop **at most twice in a row** before a full-width break stage (photo full-bleed, text overlaid on a scrim). The altitude marker has diagonal tick marks with the number in Cormorant; desktop: right-edge vertical bar; phone/tablet: bottom line plus pill. Ends at the **prayer-flag summit**: flags across the top, the "You've reached the summit" heading, and links to Teas and How It's Grown.

### Our Teas
A staggered grid (1 column phone, 2 tablet, 3 desktop with the middle column offset down). Photos in clipped-corner frames with the diagonal reveal.

### Tea detail
The tea name at display size; desktop: photo pinned on the left while the text scrolls; phone: photo then text. "Where to buy" panel and other teas as a swipe row.

### How It's Grown
The four practices as a 2×2 grid of large numbers and short text (desktop 4 across), a people gallery as a horizontal swipe row of tall portraits (not another grid), and the closing line on a full-bleed photo.

### Contact
Two columns (talk to us / where to buy) with a tall clipped-corner photo on desktop. Empty details stay hidden, with "coming soon" text.

### Shared
- **Header:** wordmark, nav (desktop inline), theme toggle, hamburger (phone/tablet).
- **Footer:** logo, tagline, nav, socials.
- **404:** full-bleed photo, a slanted bottom edge, two buttons.

## 6. Taste rules adopted

- At most one small uppercase label per three sections. Most are removed.
- No scroll cues, no long dashes in copy, no repeated layouts within a page, no three equal cards.
- One label per CTA intent: "Discover our story" (story), "See all teas" (teas), "Contact" (contact) everywhere.
- Icons stay lucide (already a project dependency, approved by the user).

## 7. Motion (all disabled or static under `prefers-reduced-motion`)

| Motion | Why |
| --- | --- |
| Hero parallax + mist | The "transported to the Himalayas" moment |
| Diagonal image reveal | Echoes the flag; draws attention to each photo once |
| Button diagonal hover fill | Feedback |
| Altitude marker | The story's core metaphor |
| Prayer flags fluttering | Arrival at the summit |
| Page fade | Gentle continuity between pages |

## 8. Verification additions

On top of the original spec's checks: every page is screenshotted at 375, 768 and 1280 **in both themes**; the theme toggle persists across reloads with no flash of the wrong theme; contrast is checked in light mode for links, focus rings and muted text.
