// Home page copy.
import type { AccentHeading } from "../types";

export const homeCopy = {
  hero: {
    place: "Bumthang, Bhutan · 2,750 m",
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
    body: "Chamomile, Mint and Lemon Verbena, three of our six single-herb teas grown in Bhutan.",
    linkLabel: "See all teas",
  },
  quoteLabel: "Our promise",
  contactPanel: {
    heading: "Questions about our teas?",
    body: "Ask us anything, from which tea to try first to where to find us.",
    linkLabel: "Contact",
  },
};
