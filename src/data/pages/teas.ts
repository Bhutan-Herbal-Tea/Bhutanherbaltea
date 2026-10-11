// Our Teas list and the tea detail pages. The teas themselves live in src/data/teas.ts.
import type { PageHeroContent } from "../types";

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
  } satisfies PageHeroContent,
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
  allTeasLabel: "See all teas",
};
