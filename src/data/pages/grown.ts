// How It's Grown page copy: farm-to-cup steps, certifications and the people.
import { FARM_VILLAGE } from "../site.ts";
import type { Photo } from "../types";

export type Practice = { title: string; body: string };
export type Person = { image: Photo; caption: string };

export const grownPage = {
  meta: {
    title: "How It's Grown",
    description:
      "From field to cup in Bumthang: organic growing, hand-harvesting, careful drying and certified quality, by the people who grow our herbs.",
  },
  hero: {
    title: "Grown with care",
    intro: "Organic, hand-harvested and carefully dried on Bhutan's first herbal tea farm.",
    image: { src: "/images/fields/herb-rows.jpg", alt: "Rows of young plants in a field below mountains" },
  },
  practicesSection: {
    heading: "From soil to cup",
    intro: "Every cup begins in the field. Our process is guided by careful cultivation and responsible handling.",
  },
  peopleSection: {
    heading: "The hands behind every cup",
    intro: "The people who plant, tend and harvest our herbs.",
  },
  closingImage: { src: "/images/fields/drying.jpg", alt: "Bunches of herbs hung up to dry" },
};

// The client's farm-to-cup steps (2026-10-11), with the article's facts folded in.
export const farmSteps: Practice[] = [
  {
    title: "Growing",
    body: `Herbs are cultivated and cared for on our farm in ${FARM_VILLAGE}, Bumthang, using organic practices and regenerative care for the soil.`,
  },
  { title: "Harvesting", body: "Plants are selected and harvested by hand at the right stage." },
  { title: "Drying", body: "Harvested herbs are carefully dried under controlled processing procedures." },
  { title: "Quality", body: "We keep hygiene standards, batch records and quality checks, with no chemical additives." },
  { title: "Packing", body: "Herbs are packed in small batches for customers in Bhutan and abroad." },
];

// As reported on the client's page (2026-10-11), which itself notes the scope should be
// checked against the latest certificates. TODO: client to confirm before launch.
export const certifications = {
  eyebrow: "Quality and recognition",
  heading: "Built on quality and trust",
  body: "Bhutan Herbal Tea holds certification and recognition for its certified product range from:",
  items: ["LOAS", "BFDA Organic", "BFDA GHP/GMP", "BFDA product certification", "Brand Bhutan / Grown in Bhutan"],
  tradeNote:
    "For buyers and importers we can share product specifications, ingredient declarations, certification copies, batch and testing information, and export documents where applicable.",
  tradeLinkLabel: "Wholesale and export",
};

// TODO: replace with the client's photos of the farmers and add their captions.
// Captions render only when filled in.
export const people: Person[] = [
  { image: { src: "/images/people/farmer-1.jpg", alt: "A person working among rows of tea bushes" }, caption: "" },
  { image: { src: "/images/people/farmer-2.jpg", alt: "Hands holding freshly picked herbs" }, caption: "" },
  { image: { src: "/images/people/farmer-3.jpg", alt: "A basket of freshly cut herbs" }, caption: "" },
  { image: { src: "/images/people/farmer-4.jpg", alt: "Hands sorting herbs on a wooden table" }, caption: "" },
];
