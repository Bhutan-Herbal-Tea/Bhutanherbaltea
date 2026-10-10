# "The Herbarium" Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the live Bhutan Herbal Tea site into the editorial "Herbarium" design (paper and tea-green palette, specimen-plate photos, DM Mono labels, Dzongkha accents, herb ticker, facts band, numbered rows, quote, closing panel) with Unsplash stand-in photography, without changing routes or content facts.

**Architecture:** Same Next.js 16.4 App Router app; every route stays static. New shared presentational components (`SpecimenPlate`, `AccentTitle`, `Ticker`, `FactsBand`, `NumberedRows`, `QuoteBlock`) live in `src/components/ui/`; page-specific sections stay in each route's `_components/`. Theme tokens in `globals.css` are rewritten for the paper/forest palette; all slanted, notched and parallelogram geometry is removed.

**Tech Stack:** Next.js 16.4.0, React 19.3, TypeScript strict, Tailwind CSS v4, framer-motion 14 (reveals and altitude marker only), shadcn Sheet, lucide-react, `next/font/google` (Cormorant Garamond, Geist, DM Mono, Noto Serif Tibetan), sharp (asset script only), Node test runner.

**Spec:** [docs/superpowers/specs/2026-10-10-herbarium-redesign-design.md](../specs/2026-10-10-herbarium-redesign-design.md). Read it and [CLAUDE.md](../../../CLAUDE.md) before starting.

## Global Constraints

- Work on a new branch `herbarium` created from `development`; merge back into `development` only in Task 11.
- No new npm dependencies. Fonts come from `next/font/google`; photos are downloaded files, not remote URLs.
- Next 16: `preload` (never `priority`) on each page's first image only; no `quality` prop; `cacheComponents` stays off.
- Breakpoints: phone `< 768px` (no prefix), tablet `md:`, desktop `xl:`.
- Palette tokens: paper `#F4F1EA`, text `#14201A`, forest `#1E3A2B`, card `#EAE5D8` (light) / `#16221B` (dark), dark background `#0F1712`, muted `#4F4C46` (light) / `#AFADA7` (dark), saffron `#F2C230`, orange `#E86A1C`, leaf `#5DAE3B`. `accent-text` is forest in light, saffron in dark. Saffron and orange are never text on paper.
- Text on photos is always `text-mist` over an ink scrim, in both themes.
- **No slanted edges, notches or parallelograms anywhere.** Corners are square (radius 0).
- Specimen-plate labels carry real data only: tea botanical names, "Thimphu, 2,750 m", "Certified organic", or brand facts. Never a location claim about a stand-in photo, never plate numbers, dates or photo credits.
- Dzongkha: only `འབྲུག་ཡུལ།` (Druk Yul), always with `lang="dz"`.
- Copy: no em or en dashes; one label per CTA intent ("Discover our story", "See all teas", "Contact", "How it's grown", "Where to buy").
- Each task ends with `npm run lint`, `npm test`, `npm run build` passing, then a commit ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Browser checks: Playwright MCP against `npm run start` (production). Kill any stray server on port 3000 first (`Get-NetTCPConnection -LocalPort 3000`). The test browser runs at about 1 frame per second: wait ≥ 2.5 s after scrolling before reading reveal state.
- Windows: PowerShell from `C:\Users\asusb\Desktop\Bhutanherbaltea`; use bash for one-off `curl`/`grep` pipelines.

## Review Focus

1. **Stand-in photos must not make false claims:** a plate label under an Unsplash photo of some other valley must not say "Thimphu farm". Pinned by the content test on `homeCopy.hero.plateLabel` (Task 2) and the label rule in `SpecimenCard`/`TeaDetail` (Tasks 5, 7).
2. **Phone hero button above the fold (375×812):** the specimen plate sits on top on phones, so its height must leave room. Pinned in Task 5 Step 8.
3. **Dzongkha actually renders:** if Noto Serif Tibetan fails to load, the script shows as boxes. Pinned in Task 5 Step 9 (`document.fonts.check`).
4. **Light-theme contrast of the new palette:** forest, muted and accent text on paper; mist on forest. Pinned by `tests/contrast.test.ts` (Task 3).
5. **Reduced motion:** ticker static, reveals instant, prayer flags still, altitude counter still works. Pinned in Task 10 Step 2.

---

## File map

```
scripts/fetch-unsplash.mjs                 # Task 1 (replaces scripts/make-placeholders.mjs)
public/images/CREDITS.md                   # Task 1
public/images/**.jpg                       # Task 1 (same file names, real photos)
tests/photos.test.ts                       # Task 1
src/data/{site,teas,story,grown,pages}.ts  # Tasks 1-2
tests/content.test.ts                      # Task 2
src/app/globals.css, src/app/layout.tsx    # Task 3
src/components/ui/button.tsx               # Task 3
tests/contrast.test.ts, tests/design.test.ts  # Tasks 3, 9
src/components/ui/{AccentTitle,SpecimenPlate,Ticker,FactsBand,NumberedRows,QuoteBlock}.tsx  # Task 4
src/components/ui/{ArrowLink,PageHero,WhatsAppButton,SocialLinks,Reveal}.tsx              # Task 4
src/components/layout/{Header,Footer}.tsx  # Task 4
src/components/teas/SpecimenCard.tsx       # Task 5 (replaces TeaCard.tsx in Task 7)
src/app/(home)/page.tsx + _components/{Hero,WhyAltitude,FeaturedTeas,ClosingPanel}.tsx  # Task 5
src/app/our-story/_components/{ClimbStage,Summit,AltitudeMarker}.tsx                     # Task 6
src/app/teas/_components/{TeaGrid,TeaDetail}.tsx                                         # Task 7
src/app/how-its-grown/page.tsx             # Task 8
src/app/contact/page.tsx, src/app/not-found.tsx, src/app/opengraph-image.tsx            # Task 9
```

---

### Task 1: Unsplash photography with credits

**Files:**
- Create: `scripts/fetch-unsplash.mjs`, `public/images/CREDITS.md` (generated), `tests/photos.test.ts`
- Delete: `scripts/make-placeholders.mjs`
- Modify: `package.json` (scripts), `src/data/site.ts`, `src/data/teas.ts`, `src/data/story.ts`, `src/data/grown.ts`, `src/data/pages.ts` (alt texts; `imageAlt` on teas)
- Replace (generated): every JPG under `public/images/{hero,fields,story,teas,people}/`

**Interfaces:**
- Produces: `Tea.imageAlt: string` (alt text describing the actual photo); the same 20 image paths as before, now real photos.

- [ ] **Step 1: Create the branch**

```powershell
git checkout -b herbarium development
```

- [ ] **Step 2: Write the failing photo test**

`tests/photos.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const IMAGES = join(process.cwd(), "public", "images");

function photos(dir = IMAGES): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return photos(path);
    // The client's source logo lives at the top level and is not a stand-in photo.
    return dir !== IMAGES && entry.name.endsWith(".jpg") ? [relative(IMAGES, path).replaceAll("\\", "/")] : [];
  });
}

test("every stand-in photo is credited in CREDITS.md", () => {
  const credits = join(IMAGES, "CREDITS.md");
  assert.ok(existsSync(credits), "public/images/CREDITS.md is missing");
  const text = readFileSync(credits, "utf8");
  const files = photos();
  assert.equal(files.length, 20);
  for (const file of files) assert.ok(text.includes(`\`${file}\``), `${file} is not credited`);
});

test("the hero photo stays under 300 KB and no photo exceeds 450 KB", () => {
  assert.ok(statSync(join(IMAGES, "hero", "thimphu-fields.jpg")).size <= 300 * 1024, "hero over 300 KB");
  for (const file of photos()) {
    assert.ok(statSync(join(IMAGES, file)).size <= 450 * 1024, `${file} over 450 KB`);
  }
});
```

- [ ] **Step 3: Run it to confirm it fails**

Run: `npm test`
Expected: FAIL `public/images/CREDITS.md is missing`.

- [ ] **Step 4: Create `scripts/fetch-unsplash.mjs`**

```js
// Downloads free Unsplash photos used as stand-ins for the client's own photography,
// resizes them with sharp (ships with Next.js) and writes public/images/CREDITS.md.
// Replace any file with the client's photo of the same name; then update its line in CREDITS.md.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "public", "images");

// [file, Unsplash photo id, photographer, subject, max width]
const PHOTOS = [
  ["hero/thimphu-fields.jpg", "K32tIswSJTc", "PENDEN Wangchuk", "Terraced fields and farmhouses on a Bhutanese hillside", 1600],
  ["fields/farm.jpg", "QkbIxJhALtk", "Pema Gyamtsho", "Golden fields below a Bhutanese building", 1800],
  ["fields/herb-rows.jpg", "LUW-ROb7P9I", "David Guliciuc", "Rows of young plants below mountains", 1800],
  ["fields/drying.jpg", "UN-VxzWSmYc", "malwina nogaj", "Bunches of herbs hung up to dry", 1600],
  ["story/stage-1.jpg", "_QdFx92MO2U", "Luca Bravo", "New York skyline at dusk", 1600],
  ["story/stage-2.jpg", "7JvERsMVkCg", "Passang Tobgay", "Thimphu valley past a line of prayer flags", 1600],
  ["story/stage-3.jpg", "bdfozlEMQVI", "Erda Estremera", "Young seedlings in dark soil", 1600],
  ["story/stage-4.jpg", "GqNxNI0fivw", "Md Efthakhar Ul Alam", "Mountain ridges above the clouds", 1800],
  ["story/stage-5.jpg", "tbiV-yc903g", "Zoe Richardson", "A hand holding a young plant", 1400],
  ["story/stage-6.jpg", "qEcWgrTG578", "Drew Jemmett", "A cup of tea among dried herbs", 1600],
  ["story/summit.jpg", "9uylKZlgW_0", "Luc Santeramo", "Prayer flags at a snowy mountain pass", 1800],
  ["teas/chamomile.jpg", "m_osD-h26dI", "Chirag Saini", "Chamomile flowers in bloom", 1200],
  ["teas/peppermint.jpg", "bHWRSq8fUUE", "SIMON LEE", "Fresh mint leaves", 1200],
  ["teas/lemon-verbena.jpg", "_zdARSmCZh4", "Alejandro Piñero Amerio", "Leafy green herb stems", 1200],
  ["teas/sea-buckthorn.jpg", "UEsg8t4Oky4", "Juneta Jurgaityte", "Orange sea buckthorn berries", 1200],
  ["teas/hypericum.jpg", "1-Qg951Wwfs", "Ronin", "Yellow hypericum flowers", 1200],
  ["people/farmer-1.jpg", "Mw1bnPE4MI0", "一只猫的橘", "A person working among tea bushes", 1200],
  ["people/farmer-2.jpg", "9zVMF1HJiic", "Charlotte Thomas", "Hands holding freshly picked herbs", 1200],
  ["people/farmer-3.jpg", "TNtnoTSXJmg", "Jessie Maxwell", "A basket of freshly cut herbs", 1200],
  ["people/farmer-4.jpg", "JLpDkdcuceI", "Annie Spratt", "Hands sorting herbs on a table", 1200],
];

const lines = [
  "# Photo credits",
  "",
  "Stand-in photography from [Unsplash](https://unsplash.com/license), free to use under the Unsplash License.",
  "Replace each file with the client's own photo of the same name, then update or remove its line here.",
  "",
  "| File | Subject | Photographer | Source |",
  "| --- | --- | --- | --- |",
];

for (const [file, id, photographer, subject, width] of PHOTOS) {
  const response = await fetch(`https://unsplash.com/photos/${id}/download?force=true&w=2400`, {
    headers: { "User-Agent": "Mozilla/5.0 (asset script)" },
  });
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const path = join(OUT, file);
  await mkdir(dirname(path), { recursive: true });
  // The hero has a 300 KB budget, so it gets a lower quality setting.
  const quality = file.startsWith("hero/") ? 66 : 72;
  const info = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(path);
  lines.push(`| \`${file}\` | ${subject} | ${photographer} | https://unsplash.com/photos/${id} |`);
  console.log(`${file}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

await writeFile(join(OUT, "CREDITS.md"), lines.join("\n") + "\n");
console.log("wrote public/images/CREDITS.md");
```

- [ ] **Step 5: Swap the package script and remove the placeholder generator**

In `package.json`, replace the line
```json
    "assets:placeholders": "node scripts/make-placeholders.mjs",
```
with
```json
    "assets:photos": "node scripts/fetch-unsplash.mjs",
```
Then delete `scripts/make-placeholders.mjs`.

- [ ] **Step 6: Download the photos**

Run: `npm run assets:photos`
Expected: 20 lines with sizes, the hero line ≤ 300 KB, then `wrote public/images/CREDITS.md`. If the hero is over 300 KB, lower its quality from 66 to 60 in the script and re-run (record a ruling).

- [ ] **Step 7: Run the photo tests**

Run: `npm test`
Expected: both photo tests PASS (all other tests still pass).

- [ ] **Step 8: Update alt texts to describe the real photos**

`src/data/site.ts`: set
```ts
export const heroPhoto: Photo = {
  src: "/images/hero/thimphu-fields.jpg",
  alt: "Terraced fields and farmhouses on a hillside in Bhutan",
};
```

`src/data/teas.ts`: add `imageAlt: string; // describes the actual photo` to `type Tea` (after `image`), and add to each tea:
- chamomile: `imageAlt: "Chamomile flowers in bloom",`
- peppermint: `imageAlt: "Fresh mint leaves",`
- lemon-verbena: `imageAlt: "Leafy green herb stems",`
- sea-buckthorn: `imageAlt: "Orange sea buckthorn berries on a branch",`
- hypericum: `imageAlt: "Yellow hypericum flowers",`

`src/data/story.ts`: set the `alt` of each image:
- `storyPage.hero.image.alt`: `"Golden fields below a Bhutanese building and forested mountains"`
- `storyPage.summit.image.alt`: `"Prayer flags on a post at a snowy mountain pass"`
- stage-1: `"New York skyline at dusk across the river"`
- stage-2: `"The Thimphu valley seen past a line of prayer flags"`
- stage-3: `"Young seedlings growing in dark soil"`
- stage-4: `"Mountain ridges rising above the clouds"`
- stage-5: `"A hand holding a young plant with its roots"`
- stage-6: `"A cup of tea among dried herbs and spices"`

`src/data/grown.ts`:
- `grownPage.hero.image.alt`: `"Rows of young plants in a field below mountains"`
- `grownPage.closingImage.alt`: `"Bunches of herbs hung up to dry"`
- people: farmer-1 `"A person working among rows of tea bushes"`, farmer-2 `"Hands holding freshly picked herbs"`, farmer-3 `"A basket of freshly cut herbs"`, farmer-4 `"Hands sorting herbs on a wooden table"`

`src/data/pages.ts`:
- `teasPage.hero.image.alt`: `"Bunches of herbs hung up to dry"`
- `contactPage.hero.image.alt`: `"Golden fields below a Bhutanese building and forested mountains"`
- `contactPage.sideImage.alt`: `"Rows of young plants in a field below mountains"`
- `notFoundCopy.image.alt`: `"Prayer flags on a post at a snowy mountain pass"`

In `src/components/teas/TeaCard.tsx` and `src/app/teas/_components/TeaDetail.tsx`, change the image `alt` from `` `${tea.name} ${...imageAltSuffix}` `` to `tea.imageAlt` (both files are rewritten later; this keeps them correct meanwhile).

In `tests/content.test.ts`, inside the "every image referenced in content" test, change `teas.map((t) => ({ src: t.image, alt: t.name }))` to `teas.map((t) => ({ src: t.image, alt: t.imageAlt }))`.

- [ ] **Step 9: Lint, test, build, look**

Run: `npm run lint; npm test; npm run build`
Expected: all pass. Then Read `public/images/hero/thimphu-fields.jpg` and `public/images/teas/sea-buckthorn.jpg` to confirm the downloads are the intended photos.

- [ ] **Step 10: Commit**

```powershell
git add -A scripts public src tests package.json
git commit -m "Replace placeholder images with credited Unsplash stand-ins

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Content for the Herbarium design

**Files:**
- Modify: `src/data/site.ts`, `src/data/teas.ts`, `src/data/pages.ts`, `tests/content.test.ts`, `CLAUDE.md` (Tea type block)

**Interfaces:**
- Produces:
  - `DRUK_YUL = "འབྲུག་ཡུལ།"`, `PLATE_PLACE = "Thimphu, 2,750 m"`, `type Fact = { value: string; label: string }`, `facts: Fact[]` from `@/data/site`.
  - `Tea.botanical: string`.
  - `type AccentHeading = { lead: string; accent: string; tail?: string }` from `@/data/pages`.
  - `homeCopy = { hero: { place, title: AccentHeading, subtext, ctaLabel, teasLabel, plateLabel: string[] }, factsLabel, why: { eyebrow, title: AccentHeading, rows: {title, body}[], linkLabel }, featured: { eyebrow, title: AccentHeading, body, linkLabel }, quoteLabel, contactPanel: { heading, body, linkLabel } }`.
  - `teaDetailCopy` gains `organicLabel: "Certified organic"`; `imageAltSuffix` is removed.

- [ ] **Step 1: Write the failing content tests**

In `tests/content.test.ts`:

1. Change the site import to:
```ts
import { contact, DRUK_YUL, facts, heroPhoto, nav, SUMMIT_ALTITUDE_M, TAGLINE, type Photo } from "../src/data/site.ts";
```
2. Change `const allContent = { ... }` to include `facts`:
```ts
const allContent = { contact, facts, heroPhoto, nav, teas, stages, storyPage, grownPage, people, practices, contactPage, homeCopy, notFoundCopy, teaDetailCopy, teasPage };
```
3. Replace the whole `test("one label per CTA intent", ...)` block with:
```ts
test("one label per CTA intent", () => {
  assert.equal(homeCopy.hero.ctaLabel, "Discover our story");
  assert.equal(homeCopy.why.linkLabel, homeCopy.hero.ctaLabel);
  assert.equal(homeCopy.hero.teasLabel, "See all teas");
  assert.equal(homeCopy.featured.linkLabel, "See all teas");
  assert.equal(storyPage.summit.teasLabel, "See all teas");
  assert.equal(notFoundCopy.teasLabel, "See all teas");
  assert.equal(homeCopy.contactPanel.linkLabel, "Contact");
});
```
4. Append:
```ts
test("every tea has the botanical name for its specimen label", () => {
  assert.deepEqual(
    teas.map((t) => t.botanical),
    ["Matricaria chamomilla", "Mentha × piperita", "Aloysia citrodora", "Hippophae", "Hypericum"],
  );
});

test("the facts band shows the five sourced facts", () => {
  assert.deepEqual(facts.map((f) => f.value), ["2016", "2,750 m", "5", "3", "1st"]);
  for (const fact of facts) assert.ok(fact.label.length > 0);
});

test("the Dzongkha accent is the verified name of Bhutan", () => {
  assert.equal(DRUK_YUL, "འབྲུག་ཡུལ།");
});

test("the home headline joins back into the brand tagline", () => {
  assert.equal(`${homeCopy.hero.title.lead} ${homeCopy.hero.title.accent}`, TAGLINE);
});

test("the hero plate label states brand facts, not a claim about the stand-in photo", () => {
  assert.deepEqual(homeCopy.hero.plateLabel, ["Bhutan Herbal Tea", "Est. 2016"]);
});

test("why altitude has three rows, each with a title and body", () => {
  assert.equal(homeCopy.why.rows.length, 3);
  for (const row of homeCopy.why.rows) assert.ok(row.title && row.body);
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test`
Expected: FAIL: `does not provide an export named 'DRUK_YUL'`.

- [ ] **Step 3: Add to `src/data/site.ts`** (after `HOME_NAV_LABEL`)

```ts
// "Druk Yul", the name of Bhutan in Dzongkha. Verified; any other Dzongkha waits for the client.
export const DRUK_YUL = "འབྲུག་ཡུལ།";

// Second line of every tea specimen label: true of every tea, whatever the photo.
export const PLATE_PLACE = "Thimphu, 2,750 m";

export type Fact = { value: string; label: string };

// Daily Bhutan (2023). TODO: client to confirm.
export const facts: Fact[] = [
  { value: "2016", label: "Founded in Thimphu" },
  { value: "2,750 m", label: "Grown and harvested above" },
  { value: "5", label: "Certified organic teas" },
  { value: "3", label: "Brand Bhutan certified" },
  { value: "1st", label: "Herbal tea farm in Bhutan" },
];
```

- [ ] **Step 4: Add `botanical` to `src/data/teas.ts`**

In `type Tea`, after `name: string;` add:
```ts
  botanical: string; // Latin name for the specimen label. TODO: client to confirm species
```
Add to each tea, after its `name`:
- chamomile: `botanical: "Matricaria chamomilla",`
- peppermint: `botanical: "Mentha × piperita",`
- lemon-verbena: `botanical: "Aloysia citrodora",`
- sea-buckthorn: `botanical: "Hippophae", // genus only: the Himalayan species grown is unknown`
- hypericum: `botanical: "Hypericum", // genus only: species unknown`

- [ ] **Step 5: Replace `homeCopy` and `teaDetailCopy` in `src/data/pages.ts`**

Add, after `type Hero = ...`:
```ts
export type AccentHeading = { lead: string; accent: string; tail?: string };
```
Replace the whole `export const homeCopy = { ... };` with:
```ts
export const homeCopy = {
  hero: {
    place: "Thimphu, Bhutan · 2,750 m",
    title: { lead: "Wellness in Every", accent: "Sip." } satisfies AccentHeading,
    subtext: "Certified organic herbal teas, grown slowly above 2,750 metres on Bhutan's first herbal tea farm.",
    ctaLabel: "Discover our story",
    teasLabel: "See all teas",
    plateLabel: ["Bhutan Herbal Tea", "Est. 2016"],
  },
  factsLabel: "Bhutan Herbal Tea in numbers",
  why: {
    eyebrow: "Grown higher",
    title: { lead: "Why", accent: "altitude", tail: "matters" } satisfies AccentHeading,
    rows: [
      { title: "Slow growth", body: "In the cool mountain air above 2,750 metres, our herbs grow slowly." },
      {
        title: "More volatile oils",
        body: "Growing slowly, the plants build up more of the volatile oils that carry flavour and fragrance.",
      },
      { title: "Richer in the cup", body: "That shows in every cup: richer flavour, deeper aroma and more nutrients." },
    ],
    linkLabel: "Discover our story",
  },
  featured: {
    eyebrow: "Brand Bhutan certified",
    title: { lead: "Three teas carry", accent: "Brand Bhutan", tail: "certification" } satisfies AccentHeading,
    body: "Chamomile, Peppermint and Lemon Verbena. All five of our teas are certified organic.",
    linkLabel: "See all teas",
  },
  quoteLabel: "Our promise",
  contactPanel: {
    heading: "Questions about our teas?",
    body: "Ask us anything, from which tea to try first to where to find us.",
    linkLabel: "Contact",
  },
};
```
Replace `teaDetailCopy` with:
```ts
export const teaDetailCopy = {
  eyebrow: "Certified organic, Thimphu",
  organicLabel: "Certified organic",
  benefitsHeading: "Benefits",
  tasteHeading: "Taste notes",
  brewingHeading: "Brewing",
  whereToBuy: {
    heading: "Where to buy",
    body: "Find our teas at our stockists, or get in touch with us directly.",
    linkLabel: "Where to buy",
  },
  otherTeasHeading: "Other teas",
};
```

- [ ] **Step 6: Keep the build compiling until Tasks 5 and 7 replace these files**

Old home components still read removed fields. Delete the superseded home components now (Task 5 replaces them) and stub the home page:
```powershell
Remove-Item "src\app\(home)\_components\StatementBand.tsx", "src\app\(home)\_components\GrownStrip.tsx", "src\app\(home)\_components\FeaturedTeas.tsx", "src\app\(home)\_components\ContactPanel.tsx", "src\app\(home)\_components\Hero.tsx"
```
`src/app/(home)/page.tsx` (temporary):
```tsx
import { TAGLINE } from "@/data/site";

export default function HomePage() {
  return (
    <div className="container-page pt-32 pb-24">
      <h1 className="font-serif text-display text-foreground">{TAGLINE}</h1>
    </div>
  );
}
```
Nothing else reads `imageAltSuffix` after Task 1 Step 8.

- [ ] **Step 7: Update the Tea type in `CLAUDE.md`**

In the `src/data/teas.ts` code block, replace the type with:
```ts
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

- [ ] **Step 8: Test, lint, build, commit**

Run: `npm test; npm run lint; npm run build`
Expected: all pass (content tests including the six new ones).
```powershell
git add -A src tests CLAUDE.md
git commit -m "Add botanical names, facts and Herbarium home copy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Palette, fonts and buttons

**Files:**
- Modify: `src/app/globals.css` (full rewrite), `src/app/layout.tsx`, `src/components/ui/button.tsx`, `tests/contrast.test.ts` (full rewrite)
- Create: `tests/design.test.ts`

**Interfaces:**
- Produces: Tailwind colours `forest`, `card`, `accent-text`, `accent-mark` plus existing; fonts `font-serif`, `font-sans`, `font-mono` (DM Mono), `font-tibetan`; utilities `container-page eyebrow scroll-row flag-split flag-sweep`; CSS classes `plate-tape plate-tape--tl|tr|bl|br`, `ticker-track`, `lungta`, `page-fade`; `buttonVariants` variants `default | light | ghost`.

- [ ] **Step 1: Write the failing tests**

Replace `tests/contrast.test.ts` with:
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

const PAPER = "#f4f1ea";
const TEXT = "#14201a";
const FOREST = "#1e3a2b";
const DARK_BG = "#0f1712";
const MIST = "#f4f1ea";
const INK = "#0e0e0c";
const SAFFRON = "#f2c230";
const ORANGE = "#e86a1c";
const MUTED_LIGHT = "#4f4c46";
const MUTED_DARK = "#afada7";

test("contrast helper matches the WCAG reference", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
});

test("light theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(TEXT, PAPER) >= 7, "body text");
  assert.ok(contrast(MUTED_LIGHT, PAPER) >= 7, "muted text");
  assert.ok(contrast(FOREST, PAPER) >= 7, "accent text, links and focus ring");
});

test("dark theme text pairs pass WCAG AA", () => {
  assert.ok(contrast(MIST, DARK_BG) >= 7, "body text");
  assert.ok(contrast(MUTED_DARK, DARK_BG) >= 7, "muted text");
  assert.ok(contrast(SAFFRON, DARK_BG) >= 4.5, "accent text");
});

test("buttons and forest panels keep their text readable", () => {
  assert.ok(contrast(MIST, FOREST) >= 7, "primary button, facts band, closing panel, footer");
  assert.ok(contrast(INK, SAFFRON) >= 4.5, "hover sweep, saffron half; dark primary button");
  assert.ok(contrast(INK, ORANGE) >= 4.5, "hover sweep, orange half");
  assert.ok(contrast(FOREST, MIST) >= 4.5, "light button on forest panels");
});

test("saffron and orange are never text on paper", () => {
  assert.ok(contrast(SAFFRON, PAPER) < 3);
  assert.ok(contrast(ORANGE, PAPER) < 3);
  assert.match(css, /--accent-text:\s*#1e3a2b/, "light accent-text must be forest");
});

test("globals.css declares the tested token values", () => {
  assert.match(css, /--background:\s*#f4f1ea/);
  assert.match(css, /--background:\s*#0f1712/);
  assert.match(css, /--foreground:\s*#14201a/);
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_LIGHT}`));
  assert.match(css, new RegExp(`--muted-foreground:\\s*${MUTED_DARK}`));
  assert.match(css, /--accent-text:\s*#f2c230/);
  assert.match(css, /--ring:\s*#1e3a2b/);
  assert.match(css, /--ring:\s*#f2c230/);
});
```

`tests/design.test.ts`:
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

test("the stylesheet no longer defines slanted, notched or parallelogram geometry", () => {
  assert.doesNotMatch(css, /@utility (slant-|notch|parallelogram)/);
  assert.doesNotMatch(css, /mist-layer/);
});

test("the stylesheet defines the Herbarium devices", () => {
  assert.match(css, /\.plate-tape/);
  assert.match(css, /\.ticker-track/);
  assert.match(css, /@utility flag-sweep/);
  assert.match(css, /--color-forest:\s*#1e3a2b/);
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm test`
Expected: FAIL in contrast (`light accent-text must be forest`, token values) and design (`@utility slant-` present, `.plate-tape` missing).

- [ ] **Step 3: Replace `src/app/globals.css`**

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
  --color-forest: #1e3a2b;
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
  --font-mono: var(--font-dm-mono), ui-monospace, monospace;
  --font-tibetan: var(--font-noto-tibetan), serif;
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

/* Light theme: paper and tea-leaf green (default when nothing else applies). */
:root {
  color-scheme: light;
  --radius: 0rem;
  --background: #f4f1ea;
  --foreground: #14201a;
  --card: #eae5d8;
  --card-foreground: #14201a;
  --popover: #f4f1ea;
  --popover-foreground: #14201a;
  --primary: #1e3a2b;
  --primary-foreground: #f4f1ea;
  --secondary: #eae5d8;
  --secondary-foreground: #14201a;
  --muted: #eae5d8;
  --muted-foreground: #4f4c46;
  --accent: #eae5d8;
  --accent-foreground: #14201a;
  --accent-text: #1e3a2b;
  --accent-mark: #f2c230;
  --destructive: #b42318;
  --border: rgb(20 32 26 / 0.14);
  --input: rgb(20 32 26 / 0.2);
  --ring: #1e3a2b;
  --tape: rgb(244 241 234 / 0.78);
}

/* Dark theme: system preference without a stored choice (also the no-JS path). */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --background: #0f1712;
    --foreground: #f4f1ea;
    --card: #16221b;
    --card-foreground: #f4f1ea;
    --popover: #0f1712;
    --popover-foreground: #f4f1ea;
    --primary: #f2c230;
    --primary-foreground: #0e0e0c;
    --secondary: #16221b;
    --secondary-foreground: #f4f1ea;
    --muted: #16221b;
    --muted-foreground: #afada7;
    --accent: #16221b;
    --accent-foreground: #f4f1ea;
    --accent-text: #f2c230;
    --destructive: #e5484d;
    --border: rgb(244 241 234 / 0.12);
    --input: rgb(244 241 234 / 0.16);
    --ring: #f2c230;
    --tape: rgb(244 241 234 / 0.16);
  }
}

/* Dark theme: explicit choice. */
:root[data-theme="dark"] {
  color-scheme: dark;
  --background: #0f1712;
  --foreground: #f4f1ea;
  --card: #16221b;
  --card-foreground: #f4f1ea;
  --popover: #0f1712;
  --popover-foreground: #f4f1ea;
  --primary: #f2c230;
  --primary-foreground: #0e0e0c;
  --secondary: #16221b;
  --secondary-foreground: #f4f1ea;
  --muted: #16221b;
  --muted-foreground: #afada7;
  --accent: #16221b;
  --accent-foreground: #f4f1ea;
  --accent-text: #f2c230;
  --destructive: #e5484d;
  --border: rgb(244 241 234 / 0.12);
  --input: rgb(244 241 234 / 0.16);
  --ring: #f2c230;
  --tape: rgb(244 241 234 / 0.16);
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

/* Small uppercase specimen-style label. Colour is set separately (text-accent-text, or text-saffron on photos). */
@utility eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

@utility scroll-row {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

/* Bhutan's flag: saffron over orange, split on the diagonal. */
@utility flag-split {
  background-image: linear-gradient(to bottom right, var(--color-saffron) 50%, var(--color-bhutan) 50%);
}

/* Primary button: forest at rest; on hover the flag split sweeps in from the left. */
@utility flag-sweep {
  background-color: var(--color-forest);
  background-image: linear-gradient(to bottom right, var(--color-saffron) 50%, var(--color-bhutan) 50%);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition:
    background-size 500ms ease-out,
    color 300ms ease-out;
  &:hover {
    background-size: 100% 100%;
    color: var(--color-ink);
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

/* Specimen plate: paper-tape mounting corners over each photo's corners. */
.plate-tape {
  position: absolute;
  width: 2.5rem;
  height: 0.95rem;
  background: var(--tape);
  pointer-events: none;
}
.plate-tape--tl {
  top: -0.2rem;
  left: -0.85rem;
  transform: rotate(-45deg);
}
.plate-tape--tr {
  top: -0.2rem;
  right: -0.85rem;
  transform: rotate(45deg);
}
.plate-tape--bl {
  bottom: -0.2rem;
  left: -0.85rem;
  transform: rotate(45deg);
}
.plate-tape--br {
  bottom: -0.2rem;
  right: -0.85rem;
  transform: rotate(-45deg);
}

/* Herb ticker on the home page. */
.ticker-track {
  animation: ticker 36s linear infinite;
}

@keyframes ticker {
  to {
    transform: translateX(-50%);
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
  .ticker-track,
  .lungta,
  .page-fade {
    animation: none;
  }
}
```

- [ ] **Step 4: Add the two fonts in `src/app/layout.tsx`**

Change the font import line to:
```tsx
import { Cormorant_Garamond, DM_Mono, Geist, Noto_Serif_Tibetan } from "next/font/google";
```
Add after the `cormorant` declaration:
```tsx
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

// Decorative Dzongkha only; not preloaded so it never delays the first paint.
const notoTibetan = Noto_Serif_Tibetan({
  subsets: ["tibetan"],
  variable: "--font-noto-tibetan",
  display: "swap",
  preload: false,
});
```
Change the `<html>` className to:
```tsx
className={`${geist.variable} ${cormorant.variable} ${dmMono.variable} ${notoTibetan.variable}`}
```
If the build rejects the `tibetan` subset name, check `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` for `"Noto Serif Tibetan"` and use the subset it lists (record a ruling).

- [ ] **Step 5: Replace `src/components/ui/button.tsx`**

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Forest with mist text; flag sweep and ink text on hover. Saffron with ink text in dark mode.
        default: "flag-sweep text-mist dark:bg-saffron dark:text-ink",
        // For forest panels: mist with forest text.
        light: "bg-mist text-forest transition-colors hover:bg-saffron hover:text-ink focus-visible:outline-saffron",
        ghost: "text-foreground transition-colors hover:bg-foreground/10",
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

`src/components/ui/WhatsAppButton.tsx` still passes `variant: "ink"` from callers; change its prop type line to:
```tsx
type WhatsAppButtonProps = { label: string; variant?: "default" | "light"; className?: string };
```
(Its only `ink` caller, the old ContactPanel, was deleted in Task 2.)

- [ ] **Step 6: Run tests, lint, build**

Run: `npm test; npm run lint; npm run build`
Expected: all pass (contrast 6, design 2). Pages still using `slant-*`/`notch` classes simply lose those styles until their tasks.

- [ ] **Step 7: Commit**

```powershell
git add -A src tests
git commit -m "Herbarium palette, DM Mono and Noto Serif Tibetan, forest buttons

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Shared Herbarium components and layout

**Files:**
- Create: `src/components/ui/{AccentTitle,SpecimenPlate,Ticker,FactsBand,NumberedRows,QuoteBlock}.tsx`
- Modify: `src/components/ui/{ArrowLink,PageHero,SocialLinks,Reveal}.tsx`, `src/components/layout/{Header,Footer}.tsx`

**Interfaces:**
- Consumes: Task 2 data (`AccentHeading`, `facts`, `DRUK_YUL`), Task 3 classes.
- Produces:
  - `<AccentTitle heading as? id? className? onPhoto? />`
  - `<SpecimenPlate image sizes label? preload? frameClassName? imageClassName? className?>{overlay}</SpecimenPlate>`
  - `<Ticker items: string[] />` (decorative, `aria-hidden`)
  - `<FactsBand label />`
  - `<NumberedRows rows: { title: string; body: string }[] className? />`
  - `<QuoteBlock quote label />`
  - `<ArrowLink href tone? className?>` (now mono, uppercase, bottom border)
  - `<PageHero title intro? image />` (flat bottom)
  - `<SocialLinks className? tone?: "default" | "onDark" />`

- [ ] **Step 1: Create the new components**

`src/components/ui/AccentTitle.tsx`:
```tsx
import type { AccentHeading } from "@/data/pages";
import { cn } from "@/lib/utils";

type AccentTitleProps = {
  heading: AccentHeading;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  onPhoto?: boolean;
};

// Serif headline with one italic accent word, as in the reference site.
export function AccentTitle({ heading, as: Tag = "h2", id, className, onPhoto = false }: AccentTitleProps) {
  return (
    <Tag id={id} className={cn("font-serif", onPhoto ? "text-mist" : "text-foreground", className)}>
      {heading.lead}{" "}
      <em className={cn("pb-1 italic", onPhoto ? "text-saffron" : "text-forest dark:text-saffron")}>{heading.accent}</em>
      {heading.tail && <> {heading.tail}</>}
    </Tag>
  );
}
```

`src/components/ui/SpecimenPlate.tsx`:
```tsx
import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/data/site";
import { cn } from "@/lib/utils";

type SpecimenPlateProps = {
  image: Photo;
  sizes: string;
  label?: string[];
  preload?: boolean;
  frameClassName?: string;
  imageClassName?: string;
  className?: string;
  children?: ReactNode;
};

// A photo mounted on a herbarium sheet: paper mount, tape corners, monospace label of real data.
export function SpecimenPlate({
  image,
  sizes,
  label,
  preload = false,
  frameClassName = "aspect-4/5",
  imageClassName,
  className,
  children,
}: SpecimenPlateProps) {
  return (
    <figure className={cn("relative border border-border bg-card p-3 md:p-4", className)}>
      <div className="relative">
        <div className={cn("relative overflow-hidden", frameClassName)}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload={preload}
            sizes={sizes}
            className={cn("object-cover", imageClassName)}
          />
        </div>
        <span aria-hidden className="plate-tape plate-tape--tl" />
        <span aria-hidden className="plate-tape plate-tape--tr" />
        <span aria-hidden className="plate-tape plate-tape--bl" />
        <span aria-hidden className="plate-tape plate-tape--br" />
      </div>
      {label && label.length > 0 && (
        <figcaption className="mt-3 font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase">
          {label.join(" · ")}
        </figcaption>
      )}
      {children}
    </figure>
  );
}
```

`src/components/ui/Ticker.tsx`:
```tsx
// Decorative: every item also appears as real content elsewhere on the page.
export function Ticker({ items }: { items: string[] }) {
  return (
    <div aria-hidden className="overflow-hidden border-y border-border bg-card py-3">
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <li
                key={`${copy}-${index}`}
                className="flex items-center font-mono text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
              >
                <span className="px-6">{item}</span>
                <span className="text-leaf">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
```

`src/components/ui/FactsBand.tsx`:
```tsx
import { facts } from "@/data/site";
import { cn } from "@/lib/utils";

export function FactsBand({ label }: { label: string }) {
  return (
    <section aria-label={label} className="bg-forest text-mist dark:bg-card">
      <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-3 xl:grid-cols-5 xl:py-16">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={cn(
              "flex flex-col-reverse border-l border-mist/20 pl-5",
              index === facts.length - 1 && "col-span-2 md:col-span-1",
            )}
          >
            <dt className="mt-3 font-mono text-[0.68rem] tracking-[0.2em] text-mist/80 uppercase">{fact.label}</dt>
            <dd className="font-serif text-4xl md:text-5xl">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

`src/components/ui/NumberedRows.tsx`:
```tsx
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type Row = { title: string; body: string };

export function NumberedRows({ rows, className }: { rows: Row[]; className?: string }) {
  return (
    <ol className={cn("mt-12 divide-y divide-border border-y border-border", className)}>
      {rows.map((row, index) => (
        <Reveal
          as="li"
          key={row.title}
          className="grid gap-3 py-8 md:grid-cols-[7rem_1fr] md:gap-x-8 xl:grid-cols-[9rem_1fr_1.4fr] xl:items-baseline xl:py-10"
        >
          <span
            aria-hidden
            className="pb-1 font-serif text-5xl leading-[1.1] text-forest/35 italic xl:text-6xl dark:text-saffron/45"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-2xl text-foreground xl:text-3xl">{row.title}</h3>
          <p className="text-muted-foreground md:col-start-2 xl:col-start-auto">{row.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
```

`src/components/ui/QuoteBlock.tsx`:
```tsx
import { DRUK_YUL } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

type QuoteBlockProps = { quote: string; label: string };

export function QuoteBlock({ quote, label }: QuoteBlockProps) {
  return (
    <section aria-label={label} className="relative overflow-hidden bg-card py-24 md:py-32">
      <span
        aria-hidden
        lang="dz"
        className="pointer-events-none absolute -right-4 -bottom-6 font-tibetan text-[8rem] leading-none text-forest/[0.07] select-none md:text-[13rem] dark:text-mist/[0.05]"
      >
        {DRUK_YUL}
      </span>
      <div className="container-page relative">
        <Reveal className="max-w-3xl">
          <span aria-hidden lang="dz" className="font-tibetan text-2xl text-forest dark:text-saffron">
            {DRUK_YUL}
          </span>
          <blockquote className="mt-6 pb-1 font-serif text-title leading-[1.2] text-foreground italic">
            “{quote}”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Restyle the existing shared pieces**

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

// Secondary action in the specimen-label style: mono, uppercase, bottom rule.
export function ArrowLink({ href, children, tone = "default", className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 border-b pb-1 font-mono text-[0.72rem] tracking-[0.2em] uppercase transition-colors",
        tone === "photo"
          ? "border-saffron text-mist hover:text-saffron focus-visible:outline-saffron"
          : "border-forest/40 text-foreground hover:border-forest hover:text-forest dark:border-saffron/50 dark:hover:border-saffron dark:hover:text-saffron",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
```

`src/components/ui/PageHero.tsx`:
```tsx
import Image from "next/image";
import type { Photo } from "@/data/site";

type PageHeroProps = { title: string; intro?: string; image: Photo };

// Flat photo band. Text sits on the photo, so it is mist in both themes.
export function PageHero({ title, intro, image }: PageHeroProps) {
  return (
    <div className="relative flex h-[56svh] min-h-96 items-end overflow-hidden md:h-[58svh] xl:h-[64svh]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/35" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-ink/80 to-transparent" />
      <div className="container-page relative pb-12 md:pb-16 xl:pb-20">
        <h1 className="font-serif text-display text-mist">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lead text-mist/85">{intro}</p>}
      </div>
    </div>
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

type SocialLinksProps = { className?: string; tone?: "default" | "onDark" };

export function SocialLinks({ className, tone = "default" }: SocialLinksProps) {
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
              className={cn(
                "inline-flex size-11 items-center justify-center border transition-colors",
                tone === "onDark"
                  ? "border-mist/30 text-mist hover:border-saffron hover:text-saffron focus-visible:outline-saffron"
                  : "border-border text-foreground hover:border-forest hover:text-forest dark:hover:border-saffron dark:hover:text-saffron",
              )}
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

In `src/components/ui/Reveal.tsx`, change `initial={{ opacity: 0, y: 16 }}` to `initial={{ opacity: 0, y: 12 }}`.

- [ ] **Step 3: Restyle the header and footer**

In `src/components/layout/Header.tsx`, replace the `className={cn(...)}` of the nav `Link` with:
```tsx
                      className={cn(
                        "border-b-2 py-1 font-mono text-[0.72rem] tracking-[0.2em] uppercase transition-colors hover:text-foreground",
                        active
                          ? "border-forest font-medium text-foreground dark:border-saffron"
                          : "border-transparent text-muted-foreground",
                      )}
```

Replace `src/components/layout/Footer.tsx` with:
```tsx
import Link from "next/link";
import { nav, SITE_NAME, TAGLINE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  // Fixed at build time (next.config.ts); every deploy rebuilds, so it stays current.
  const year = process.env.BUILD_YEAR;
  return (
    <footer className="border-t border-mist/15 bg-forest text-mist dark:border-border dark:bg-card">
      <div className="container-page grid gap-12 py-16 text-center md:grid-cols-2 md:gap-x-12 md:text-left xl:grid-cols-3 xl:py-20">
        <div className="flex flex-col items-center gap-5 md:row-span-2 md:items-start xl:row-span-1">
          <Logo className="h-auto w-28" sizes="112px" />
          <p className="font-serif text-2xl">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[0.72rem] tracking-[0.2em] text-mist/80 uppercase transition-colors hover:text-saffron focus-visible:outline-saffron"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-5 md:items-start">
          <SocialLinks tone="onDark" />
          <p className="font-mono text-[0.68rem] tracking-[0.2em] text-mist/70 uppercase">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass.

- [ ] **Step 5: Look at the shell**

`npm run start` (background), Playwright at 1280×800 and 375×812 on `/teas`, both themes: header mono nav (desktop) with the active item underlined in forest (light) / saffron (dark); flat page hero; footer forest band with mist text and the logo. Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add -A src
git commit -m "Add Herbarium shared components and restyle header, footer, page hero

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Home page

**Files:**
- Create: `src/components/teas/SpecimenCard.tsx`, `src/app/(home)/_components/{Hero,WhyAltitude,FeaturedTeas,ClosingPanel}.tsx`
- Modify: `src/app/(home)/page.tsx`

**Interfaces:**
- Consumes: Task 2 data, Task 4 components, `Logo`, `ButtonLink`, `WhatsAppButton`, `Section`, `Reveal`.
- Produces: `<SpecimenCard tea sizes headingLevel? />` (used in Task 7).

- [ ] **Step 1: Create `src/components/teas/SpecimenCard.tsx`**

```tsx
import Link from "next/link";
import type { Tea } from "@/data/teas";
import { PLATE_PLACE } from "@/data/site";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

// headingLevel keeps the outline valid: h3 under a section h2, h2 directly under the page h1.
type SpecimenCardProps = { tea: Tea; sizes: string; headingLevel?: 2 | 3 };

export function SpecimenCard({ tea, sizes, headingLevel = 3 }: SpecimenCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={`/teas/${tea.slug}`} className="group block">
      <SpecimenPlate
        image={{ src: tea.image, alt: tea.imageAlt }}
        sizes={sizes}
        label={[tea.botanical, PLATE_PLACE]}
        imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <Heading className="mt-5 font-serif text-2xl text-foreground transition-colors group-hover:text-forest md:text-[1.75rem] dark:group-hover:text-saffron">
        {tea.name}
      </Heading>
      <p className="mt-2 text-muted-foreground">{tea.shortDescription}</p>
    </Link>
  );
}
```

- [ ] **Step 2: Create `src/app/(home)/_components/Hero.tsx`**

```tsx
import { DRUK_YUL, heroPhoto } from "@/data/site";
import { homeCopy } from "@/data/pages";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

export function Hero() {
  const { place, title, subtext, ctaLabel, teasLabel, plateLabel } = homeCopy.hero;
  return (
    <section className="container-page grid gap-10 pt-24 pb-16 md:grid-cols-2 md:items-center md:gap-10 md:pt-28 xl:grid-cols-[7fr_5fr] xl:gap-16 xl:pt-32 xl:pb-24">
      <div className="md:order-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span lang="dz" aria-label="Druk Yul" className="font-tibetan text-xl text-forest dark:text-saffron">
            {DRUK_YUL}
          </span>
          <span className="eyebrow text-accent-text">{place}</span>
        </p>
        <AccentTitle as="h1" heading={title} className="mt-5 text-display md:mt-6" />
        <p className="mt-4 max-w-xl text-lead text-muted-foreground md:mt-6">{subtext}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-10">
          <ButtonLink href="/our-story">{ctaLabel}</ButtonLink>
          <ArrowLink href="/teas">{teasLabel}</ArrowLink>
        </div>
      </div>
      <div className="relative order-first md:order-2">
        <SpecimenPlate
          image={heroPhoto}
          preload
          label={plateLabel}
          frameClassName="aspect-16/10 md:aspect-4/5"
          sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
          className="mx-6 md:mx-0"
        >
          {/* The logo as an archive seal, stamped over the plate's lower corner. */}
          <Logo
            className="absolute -bottom-6 -left-5 h-auto w-20 -rotate-8 md:-bottom-8 md:-left-8 md:w-28 xl:w-32"
            sizes="(min-width: 1280px) 128px, (min-width: 768px) 112px, 80px"
          />
        </SpecimenPlate>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create the remaining home sections**

`src/app/(home)/_components/WhyAltitude.tsx`:
```tsx
import { homeCopy } from "@/data/pages";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { NumberedRows } from "@/components/ui/NumberedRows";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function WhyAltitude() {
  const { eyebrow, title, rows, linkLabel } = homeCopy.why;
  return (
    <Section aria-labelledby="why-heading">
      <Reveal className="max-w-3xl">
        <p className="eyebrow text-accent-text">{eyebrow}</p>
        <AccentTitle id="why-heading" heading={title} className="mt-4 text-title" />
      </Reveal>
      <NumberedRows rows={rows} />
      <ArrowLink href="/our-story" className="mt-10">
        {linkLabel}
      </ArrowLink>
    </Section>
  );
}
```

`src/app/(home)/_components/FeaturedTeas.tsx`:
```tsx
import { featuredTeas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecimenCard } from "@/components/teas/SpecimenCard";

export function FeaturedTeas() {
  const { eyebrow, title, body, linkLabel } = homeCopy.featured;
  return (
    <Section aria-labelledby="featured-heading" className="pt-0 md:pt-0 xl:pt-0">
      <Reveal className="max-w-3xl">
        <p className="eyebrow text-accent-text">{eyebrow}</p>
        <AccentTitle id="featured-heading" heading={title} className="mt-4 text-title" />
        <p className="mt-5 text-lead text-muted-foreground">{body}</p>
      </Reveal>
      <ul
        aria-label={`${title.lead} ${title.accent} ${title.tail ?? ""}`.trim()}
        className="scroll-row -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 xl:gap-10"
      >
        {featuredTeas.map((tea) => (
          <li key={tea.slug} className="w-[80%] shrink-0 snap-start md:w-auto">
            <SpecimenCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 33vw, 80vw" />
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

`src/app/(home)/_components/ClosingPanel.tsx`:
```tsx
import { contactPage, homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ClosingPanel() {
  const { heading, body, linkLabel } = homeCopy.contactPanel;
  return (
    <section aria-labelledby="closing-heading" className="bg-forest text-mist">
      <div aria-hidden className="flag-split h-2" />
      <div className="container-page py-20 md:py-24">
        <Reveal className="flex flex-col items-start gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h2 id="closing-heading" className="font-serif text-title">
              {heading}
            </h2>
            <p className="mt-4 text-lead text-mist/85">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <WhatsAppButton variant="light" label={contactPage.whatsappLabel} className="w-full md:w-auto" />
            <ButtonLink href="/contact" variant="light" className="w-full md:w-auto">
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
import { CLOSING_LINE } from "@/data/site";
import { teas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { FactsBand } from "@/components/ui/FactsBand";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { Ticker } from "@/components/ui/Ticker";
import { ClosingPanel } from "./_components/ClosingPanel";
import { FeaturedTeas } from "./_components/FeaturedTeas";
import { Hero } from "./_components/Hero";
import { WhyAltitude } from "./_components/WhyAltitude";

const tickerItems = teas.flatMap((tea) => [tea.name, tea.botanical]);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker items={tickerItems} />
      <FactsBand label={homeCopy.factsLabel} />
      <WhyAltitude />
      <FeaturedTeas />
      <QuoteBlock quote={CLOSING_LINE} label={homeCopy.quoteLabel} />
      <ClosingPanel />
    </>
  );
}
```

- [ ] **Step 5: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass.

- [ ] **Step 6: One image preload, server-rendered h1**

`npm run start` (background), then:
```powershell
$html = (Invoke-WebRequest http://localhost:3000/ -UseBasicParsing).Content
([regex]::Matches($html, '<link[^>]*rel="preload"[^>]*as="image"')).Count
[regex]::Match($html, '<h1[^>]*>.*?</h1>').Value
```
Expected: `1`; the `h1` contains "Wellness in Every" and `<em …>Sip.</em>`.

- [ ] **Step 7: Review both themes at 375, 768, 1280**

Scroll the page in 400 px steps with 900 ms pauses, wait 2.5 s, return to top, full-page screenshot per theme and width. Expected: hero plate with tape corners and the logo seal; Dzongkha + mono place line; italic "Sip." in forest (light) / saffron (dark); ticker band; forest facts band; numbered rows with large italic numerals; three specimen cards with botanical labels; quote with faded Dzongkha watermark; forest closing panel with flag stripe; forest footer. No horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`).

- [ ] **Step 8: Phone hero button above the fold (Review Focus 2)**

At 375×812, at scroll 0: `document.querySelector('section a[href="/our-story"]').getBoundingClientRect().bottom`.
Expected: `≤ 812`. If not, reduce the phone plate (`aspect-16/10` to `aspect-2/1`) and re-check; record a ruling.

- [ ] **Step 9: Dzongkha renders (Review Focus 3)**

After load: `await document.fonts.ready; document.fonts.check('20px "Noto Serif Tibetan"') || [...document.fonts].some(f => /Tibetan/.test(f.family) && f.status === 'loaded')` must be `true`, and a screenshot of the hero eyebrow shows the script, not boxes. Stop the server.

- [ ] **Step 10: Commit**

```powershell
git add -A src
git commit -m "Build the Herbarium home page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Our Story as a field journal

**Files:**
- Modify: `src/app/our-story/_components/{ClimbStage,Summit,AltitudeMarker}.tsx`

**Interfaces:**
- Consumes: `SpecimenPlate`, `Reveal`, `ButtonLink`, `ArrowLink`, `PrayerFlags`, `stageLayout`.

- [ ] **Step 1: Replace `src/app/our-story/_components/ClimbStage.tsx`**

```tsx
import Image from "next/image";
import type { ClimbStageData } from "@/data/story";
import type { StageLayout } from "@/lib/story";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

type ClimbStageProps = { stage: ClimbStageData; layout: StageLayout };

export function ClimbStage({ stage, layout }: ClimbStageProps) {
  const headingId = `stage-${stage.id}`;

  if (layout === "full-bleed") {
    return (
      <section aria-labelledby={headingId} className="relative my-14 flex min-h-[78svh] items-end overflow-hidden py-16 md:my-20">
        <Image src={stage.image.src} alt={stage.image.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/45 to-ink/15" />
        <div className="container-page relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-saffron">{stage.marker}</p>
            <h2 id={headingId} className="mt-4 font-serif text-title text-mist">
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
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-12 xl:gap-20">
        <Reveal className={cn(layout === "image-right" && "md:order-2")}>
          <SpecimenPlate
            image={stage.image}
            frameClassName="aspect-4/3 md:aspect-4/5"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </Reveal>
        <Reveal className="max-w-xl">
          <p className="eyebrow text-accent-text">{stage.marker}</p>
          <h2 id={headingId} className="mt-4 font-serif text-title text-foreground">
            {stage.heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{stage.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace `src/app/our-story/_components/Summit.tsx`**

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
      className="relative flex min-h-[90svh] flex-col overflow-hidden text-center xl:min-h-dvh"
    >
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/60" />
      <PrayerFlags className="relative mt-10 md:mt-14" />
      <div className="container-page relative my-auto py-20">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="eyebrow text-saffron">{formatAltitude(SUMMIT_ALTITUDE_M)}</p>
          <h2 id="summit-heading" className="max-w-3xl font-serif text-display text-mist">
            {heading}
          </h2>
          <p className="max-w-xl text-lead text-mist/85">{body}</p>
          <div className="mt-4 flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:gap-8">
            <ButtonLink href="/teas" variant="light" className="w-full md:w-auto">
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

- [ ] **Step 3: Restyle the altitude marker labels**

In `src/app/our-story/_components/AltitudeMarker.tsx`:
- Replace the desktop label class `"-mt-4 bg-background/85 px-2 py-1 font-serif text-2xl text-foreground tabular-nums"` with `"-mt-3 border border-border bg-background/90 px-2.5 py-1 font-mono text-sm tracking-[0.15em] text-foreground tabular-nums"`.
- Replace the phone label class `"notch absolute right-4 bottom-3 bg-background/90 px-3 py-1 font-serif text-lg text-foreground tabular-nums"` with `"absolute right-4 bottom-3 border border-border bg-background/90 px-3 py-1 font-mono text-xs tracking-[0.15em] text-foreground tabular-nums"`.

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass.

- [ ] **Step 5: Review both themes at three widths**

`npm run start`. On `/our-story`: stages image-left, image-right, full-bleed (flat edges), image-left, image-right, full-bleed; mono markers; plates with tape corners; marker reads `0 m` at top and `2,750 m` when the summit's bottom reaches the viewport bottom (scroll with `getBoundingClientRect`, wait 3 s); summit shows prayer flags over the pass photo with the light button. Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add -A src
git commit -m "Restyle Our Story as a field journal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Teas catalogue and specimen sheet

**Files:**
- Modify: `src/app/teas/_components/{TeaGrid,TeaDetail}.tsx`
- Delete: `src/components/teas/TeaCard.tsx`

**Interfaces:**
- Consumes: `SpecimenCard`, `SpecimenPlate`, `PLATE_PLACE`, `teaDetailCopy.organicLabel`.

- [ ] **Step 1: Replace `src/app/teas/_components/TeaGrid.tsx`**

```tsx
import type { Tea } from "@/data/teas";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SpecimenCard } from "@/components/teas/SpecimenCard";

// Staggered catalogue: on tablet every second plate drops; on desktop the middle column drops.
export function TeaGrid({ teas }: { teas: Tea[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:pb-14 xl:grid-cols-3 xl:gap-x-12 xl:pb-20">
      {teas.map((tea, index) => (
        <Reveal
          as="li"
          key={tea.slug}
          className={cn(
            index % 2 === 1 && "md:translate-y-14",
            "xl:translate-y-0",
            index % 3 === 1 && "xl:translate-y-20",
          )}
        >
          <SpecimenCard tea={tea} headingLevel={2} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" />
        </Reveal>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Replace `src/app/teas/_components/TeaDetail.tsx`**

```tsx
import { Leaf } from "lucide-react";
import type { Tea } from "@/data/teas";
import { PLATE_PLACE } from "@/data/site";
import { teaDetailCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";
import { SpecimenCard } from "@/components/teas/SpecimenCard";

type TeaDetailProps = { tea: Tea; others: Tea[] };

export function TeaDetail({ tea, others }: TeaDetailProps) {
  const copy = teaDetailCopy;
  return (
    <article className="pt-24 xl:pt-32">
      <div className="container-page grid gap-12 xl:grid-cols-[45fr_55fr] xl:gap-20">
        <SpecimenPlate
          image={{ src: tea.image, alt: tea.imageAlt }}
          preload
          label={[tea.botanical, copy.organicLabel, PLATE_PLACE]}
          sizes="(min-width: 1280px) 42vw, (min-width: 768px) 70vw, 100vw"
          className="mx-auto w-full md:w-[70%] xl:sticky xl:top-28 xl:w-full xl:self-start"
        />
        <div className="flex flex-col gap-10 xl:py-6">
          <header>
            <p className="eyebrow text-accent-text">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-display text-foreground">{tea.name}</h1>
            <p className="mt-2 pb-1 font-serif text-2xl text-muted-foreground italic">{tea.botanical}</p>
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
          <section aria-labelledby="buy-heading" className="border-l-2 border-forest pl-6 dark:border-saffron">
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
          <ul className="scroll-row -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 xl:mx-0 xl:grid xl:grid-cols-4 xl:gap-8 xl:overflow-visible xl:px-0">
            {others.map((other) => (
              <li key={other.slug} className="w-[66%] shrink-0 snap-start md:w-[40%] xl:w-auto">
                <SpecimenCard tea={other} sizes="(min-width: 1280px) 280px, (min-width: 768px) 40vw, 66vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
```

- [ ] **Step 3: Delete the old card**

```powershell
Remove-Item src\components\teas\TeaCard.tsx
```

- [ ] **Step 4: Lint, test, build**

Run: `npm run lint; npm test; npm run build`
Expected: all pass; `● /teas/[slug]` with 5 paths.

- [ ] **Step 5: Review**

`npm run start`. `/teas` and `/teas/sea-buckthorn` at three widths, both themes: catalogue plates with botanical labels (`HIPPOPHAE · THIMPHU, 2,750 M`); detail page with the label `HIPPOPHAE · CERTIFIED ORGANIC · THIMPHU, 2,750 M`, italic botanical line under the name, sticky plate on desktop. `curl.exe -s -o NUL -w "%{http_code}" http://localhost:3000/teas/green-tea` prints `404`. Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add -A src
git commit -m "Restyle the teas catalogue and specimen sheet

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: How It's Grown

**Files:**
- Modify: `src/app/how-its-grown/page.tsx`

- [ ] **Step 1: Replace `src/app/how-its-grown/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { CLOSING_LINE } from "@/data/site";
import { grownPage, people, practices } from "@/data/grown";
import { NumberedRows } from "@/components/ui/NumberedRows";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

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
        <NumberedRows rows={practices} />
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
          className="scroll-row mt-12 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pt-2 pb-2 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16"
        >
          {people.map((person) => (
            <li key={person.image.src} className="w-[74%] shrink-0 snap-start md:w-[42%] xl:w-[27%]">
              <SpecimenPlate
                image={person.image}
                label={person.caption ? [person.caption] : undefined}
                frameClassName="aspect-3/4"
                sizes="(min-width: 1280px) 27vw, (min-width: 768px) 42vw, 74vw"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="relative overflow-hidden py-28 text-center md:py-36 xl:py-48">
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

- [ ] **Step 2: Lint, test, build, review, commit**

Run: `npm run lint; npm test; npm run build`. `npm run start`; check `/how-its-grown` at three widths, both themes: numbered practice rows 01–04, farmer plates row with tape corners (no captions), flat closing photo with italic mist line. Stop the server.
```powershell
git add -A src
git commit -m "Restyle How It's Grown with numbered practices and farmer plates

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Contact, 404, Open Graph, geometry clean-up

**Files:**
- Modify: `src/app/contact/page.tsx`, `src/app/not-found.tsx`, `src/app/opengraph-image.tsx`, `tests/design.test.ts`
- Delete: `src/components/ui/ImageReveal.tsx`

- [ ] **Step 1: Add the failing clean-up test**

Append to `tests/design.test.ts`:
```ts
import { existsSync, readdirSync } from "node:fs";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(tsx|ts)$/.test(entry.name) ? [path] : [];
  });
}

test("no component uses the removed slanted, notched or wipe-reveal geometry", () => {
  const offenders = sourceFiles(join(process.cwd(), "src")).filter((file) =>
    /\bslant-(top|bottom|both)\b|\bparallelogram\b|["'\s]notch["'\s]|ImageReveal/.test(readFileSync(file, "utf8")),
  );
  assert.deepEqual(offenders, []);
  assert.equal(existsSync(join(process.cwd(), "src", "components", "ui", "ImageReveal.tsx")), false);
});
```
(Merge the new `node:fs` names into the file's existing `import { readFileSync } from "node:fs";` line instead of adding a second import.)

- [ ] **Step 2: Run to confirm failure**

Run: `npm test`
Expected: FAIL listing `not-found.tsx` (slant-bottom), `contact/page.tsx` (notch) and `ImageReveal.tsx`.

- [ ] **Step 3: Contact page**

In `src/app/contact/page.tsx`:
- Add `import { SpecimenPlate } from "@/components/ui/SpecimenPlate";` and remove the `import Image from "next/image";` line.
- Replace the side-photo block (the `<div className="notch relative hidden aspect-3/4 …">…</div>`) with:
```tsx
          <SpecimenPlate
            image={contactPage.sideImage}
            frameClassName="aspect-3/4"
            sizes="25vw"
            className="hidden self-start xl:block"
          />
```
- Change the "Follow us" heading class to `"eyebrow text-accent-text"`.

- [ ] **Step 4: 404 page**

Replace `src/app/not-found.tsx` with:
```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFoundCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: notFoundCopy.title };

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh items-center overflow-hidden pt-24 pb-20">
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
          <ButtonLink href="/" variant="light">
            {notFoundCopy.homeLabel}
          </ButtonLink>
          <ArrowLink href="/teas" tone="photo">
            {notFoundCopy.teasLabel}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Delete `ImageReveal` and recolour the OG image**

```powershell
Remove-Item src\components\ui\ImageReveal.tsx
```
In `src/app/opengraph-image.tsx`, change the outer `background: "#0E0E0C"` to `background: "#1E3A2B"` and the subline colour `"#AFADA7"` to `"#D6E3D9"`.

- [ ] **Step 6: Tests, lint, build**

Run: `npm test; npm run lint; npm run build`
Expected: all pass including the clean-up test.

- [ ] **Step 7: Review and check contact links**

`npm run start`. `/contact`, `/nope`, `/opengraph-image` at three widths, both themes: contact plate on desktop; 404 flat photo with light button; OG image on forest green with the flag stripe. Then:
```powershell
Get-ChildItem -Recurse .next\server\app -Filter *.html | Select-String -Pattern 'wa\.me/|href="tel:|href="mailto:' | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: `0`. Stop the server.

- [ ] **Step 8: Commit**

```powershell
git add -A src tests
git commit -m "Restyle contact and 404, recolour OG image, remove old geometry

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Quality pass

- [ ] **Step 1:** `npm run build; npm run start` (background, after freeing port 3000).
- [ ] **Step 2: Reduced motion (Review Focus 5):** `browser_emulate_media reducedMotion: "reduce"`; on `/` the `.ticker-track` `animationName` is `"none"`; reveals are visible within 1 s of load; on `/our-story` `.lungta` `animationName` is `"none"` and the altitude value still changes between top and bottom.
- [ ] **Step 3: No-JS:** a JavaScript-disabled browser context on `/`, `/teas`, `/how-its-grown` shows no `[data-reveal]` element with opacity 0, and each page's `h1`.
- [ ] **Step 4: Hydration:** for every route, listen for `pageerror` for 3.5 s after load; expected 0. Also serve each page through a route that inserts `\n<!-- hosted on Netlify -->` after `<meta charSet="utf-8"/>` (as Netlify does) and expect 0.
- [ ] **Step 5: Structure:** 7 routes × 2 themes × 3 widths: one `h1`, one page-level `header`/`main`/`footer`, every `img` with non-empty alt (except `aria-hidden` ones), no horizontal scroll, no em/en dash in `document.body.innerText`.
- [ ] **Step 6: Lighthouse (local):** every route, mobile and desktop, all four categories ≥ 90 (a 85–89 performance score caused only by local server timing is re-checked live in Task 11).
- [ ] **Step 7:** `npm run lint; npm test; npm run build`; commit any fixes with a message describing them.

---

### Task 11: Merge and deploy to `development`

- [ ] **Step 1:** Run the full suite on `herbarium`. Then:
```powershell
git checkout development
git merge --no-ff herbarium -m "Merge herbarium: editorial Herbarium redesign

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
npm test; npm run build
git push origin development
```
(`development` is the branch the user set up for this work; `main` stays untouched.)
- [ ] **Step 2:** Poll `https://bhutanherbaltea.netlify.app/` until the HTML contains `font-tibetan` (new build live), at most 6 minutes.
- [ ] **Step 3:** Live checks: every route 200 (unknown tea 404), 0 `pageerror` events on every route in both themes, Lighthouse mobile and desktop ≥ 90 on every route (re-run any single outlier twice before treating it as real).
- [ ] **Step 4:** Report to the user with screenshots of the home page in both themes.
