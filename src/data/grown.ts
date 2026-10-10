import type { Photo } from "./site";

export type Practice = { title: string; body: string };
export type Person = { image: Photo; caption: string };

export const grownPage = {
  meta: {
    title: "How It's Grown",
    description:
      "Organic and regenerative farming in Thimphu: hand-harvested herbs, carefully dried and packaged without chemical additives.",
  },
  hero: {
    title: "Grown with care",
    intro: "Organic, hand-harvested and carefully dried on Bhutan's first herbal tea farm.",
    image: { src: "/images/fields/herb-rows.jpg", alt: "Rows of young plants in a field below mountains" },
  },
  practicesSection: { heading: "From soil to cup" },
  peopleSection: {
    heading: "The hands behind every cup",
    intro: "The people who plant, tend and harvest our herbs.",
  },
  closingImage: { src: "/images/fields/drying.jpg", alt: "Bunches of herbs hung up to dry" },
};

export const practices: Practice[] = [
  {
    title: "Organic and regenerative",
    body: "We farm organically and regeneratively, protecting soil health, biodiversity and the purity of the land. All five teas are certified organic.",
  },
  { title: "Hand-harvested", body: "Every herb is picked by hand, at its peak." },
  { title: "Carefully dried", body: "Herbs are carefully dried, then packaged without any chemical additives." },
  { title: "Small batches", body: "Each tea is crafted in small batches on our farm in Thimphu." },
];

// TODO: replace with the client's photos of the farmers and add their captions.
// Captions render only when filled in.
export const people: Person[] = [
  { image: { src: "/images/people/farmer-1.jpg", alt: "A person working among rows of tea bushes" }, caption: "" },
  { image: { src: "/images/people/farmer-2.jpg", alt: "Hands holding freshly picked herbs" }, caption: "" },
  { image: { src: "/images/people/farmer-3.jpg", alt: "A basket of freshly cut herbs" }, caption: "" },
  { image: { src: "/images/people/farmer-4.jpg", alt: "Hands sorting herbs on a wooden table" }, caption: "" },
];
