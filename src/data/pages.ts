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
