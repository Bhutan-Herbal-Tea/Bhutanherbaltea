// Shapes shared by the content files in src/data.

export type Photo = { src: string; alt: string };

// The photo band that opens each inner page (components/herbarium/PageHero).
export type PageHeroContent = { title: string; intro: string; image: Photo };

// A serif headline with one italic accent word: { lead: "Why", accent: "altitude", tail: "matters" }.
export type AccentHeading = { lead: string; accent: string; tail?: string };
