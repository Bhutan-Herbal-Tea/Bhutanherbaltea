import type { Photo } from "./site";

type Hero = { title: string; intro: string; image: Photo };

export type AccentHeading = { lead: string; accent: string; tail?: string };

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

// Shared by the teas list and every tea page. Client's catalogue (2026-10-11).
const PRICE_NOTE = "Prices in Bhutanese Ngultrum (Nu.). Message us to confirm current availability and ordering.";

export const teasPage = {
  meta: {
    title: "Our Teas",
    description: "Six single-herb teas grown in Bhutan, from our farm in Bumthang, plus specialty blends and gift boxes.",
  },
  hero: {
    title: "Six teas, grown higher",
    intro: "Single-herb, naturally caffeine-free infusions, grown in Bhutan and dried in Bumthang.",
    image: { src: "/images/fields/drying.jpg", alt: "Bunches of herbs hung up to dry" },
  } satisfies Hero,
  priceNote: PRICE_NOTE,
  specialty: {
    eyebrow: "Specialty teas and gifts",
    heading: "Blends and gift boxes",
    body: "Formats, prices and availability are confirmed on enquiry.",
    linkLabel: "Ask about specialty teas",
    message: "Hello Bhutan Herbal Tea, I would like information about specialty teas and gift boxes.",
  },
};

export const teaDetailCopy = {
  eyebrow: "Grown in Bhutan",
  organicLabel: "Certified organic",
  benefitsHeading: "Benefits",
  tasteHeading: "Taste notes",
  brewingHeading: "Brewing",
  cautionHeading: "Important",
  order: {
    heading: "Order this tea",
    packLabel: "Pack",
    priceLabel: "Price",
    note: PRICE_NOTE,
    whatsappLabel: "Enquire on WhatsApp",
    contactLabel: "Other ways to buy",
    message: (teaName: string) => `Hello Bhutan Herbal Tea, I would like to enquire about ${teaName} Tea.`,
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
  getInTouchBody:
    "Whether you are choosing a tea, buying a gift, planning a farm visit or sourcing for your business, message us directly.",
  comingSoon: "Contact details coming soon.",
  followHeading: "Follow us",
  enquiriesHeading: "Start a WhatsApp message about",
  // Each opens WhatsApp with the message filled in; nothing is collected by the site.
  enquiries: [
    { label: "Buying herbal tea", message: "Hello Bhutan Herbal Tea, I am interested in buying herbal tea." },
    { label: "Wholesale and export", message: "Hello Bhutan Herbal Tea, I am interested in wholesale and export." },
    { label: "Gift boxes", message: "Hello Bhutan Herbal Tea, I am interested in gift boxes." },
    { label: "Visiting the farm", message: "Hello Bhutan Herbal Tea, I would like to ask about a farm visit." },
  ],
  whereToBuyHeading: "Where to buy",
  whereToBuyComingSoon: "Buy directly from us: message us on WhatsApp and we will help you order. Stockists coming soon.",
  whatsappLabel: "Message us on WhatsApp",
  wholesale: {
    eyebrow: "Wholesale and export",
    heading: "Bring Bhutan-grown herbal tea to your customers",
    paragraphs: [
      "We welcome enquiries from specialty tea retailers, importers, distributors, hotels, resorts, wellness businesses and gift buyers.",
      "Tell us your market, the teas you are interested in, an estimated quantity and your preferred packaging. We can discuss availability, pricing, documentation and shipping.",
    ],
    audienceHeading: "Who we work with",
    audience: [
      "Importers and distributors",
      "Specialty tea shops",
      "Hotels and resorts",
      "Wellness businesses",
      "Corporate gift buyers",
    ],
    note: "Export eligibility and food labelling or import requirements are confirmed for each market.",
    emailLabel: "Send a wholesale enquiry",
    whatsappMessage: "Hello Bhutan Herbal Tea, I am interested in wholesale and export.",
    email: {
      subject: "Wholesale and Export Enquiry - Bhutan Herbal Tea",
      body: "Company:\nCountry:\nProducts of interest:\nEstimated quantity:\nPackaging requirements:",
    },
  },
  visit: {
    eyebrow: "Visit our farm",
    heading: "Experience the story behind your tea",
    body: "Visiting Bumthang? Ask us about a farm visit and see how our herbal teas are grown, harvested and prepared.",
    note: "Visits depend on staff availability and farm conditions, and need to be arranged in advance. Seasonal activities vary through the year.",
    linkLabel: "Ask about a visit",
    message: "Hello Bhutan Herbal Tea, I would like to ask about a farm visit.",
    image: { src: "/images/people/farmer-3.jpg", alt: "A basket of freshly cut herbs" },
  },
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
