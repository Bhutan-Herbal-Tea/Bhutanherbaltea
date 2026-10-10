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
    image: { src: "/images/fields/drying.jpg", alt: "Bunches of herbs hung up to dry" },
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
    image: { src: "/images/fields/farm.jpg", alt: "Golden fields below a Bhutanese building and forested mountains" },
  } satisfies Hero,
  sideImage: { src: "/images/fields/herb-rows.jpg", alt: "Rows of young plants in a field below mountains" },
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
  image: { src: "/images/story/summit.jpg", alt: "Prayer flags on a post at a snowy mountain pass" },
};
