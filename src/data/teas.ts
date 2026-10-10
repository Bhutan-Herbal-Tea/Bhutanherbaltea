export type Tea = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  benefits: string[]; // empty until the client supplies approved wording
  tasteNotes?: string; // only if the client provides it
  brewing?: string; // only if the client provides it
  image: string; // path under /public/images/teas/
  accent?: string; // optional colour from the box design
  featured?: boolean; // shown on the home page
};

// Descriptions use only facts from the Daily Bhutan (2023) article. TODO: client to supply final copy.
export const teas: Tea[] = [
  {
    slug: "chamomile",
    name: "Chamomile",
    shortDescription: "Chamomile flowers, grown slowly above 2,750 m in Thimphu.",
    description:
      "Chamomile flowers from our farm in Thimphu, grown above 2,750 m, hand-harvested at their peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/chamomile.jpg",
    featured: true,
  },
  {
    slug: "peppermint",
    name: "Peppermint",
    shortDescription: "Peppermint leaves, grown slowly above 2,750 m in Thimphu.",
    description:
      "Peppermint from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/peppermint.jpg",
    featured: true,
  },
  {
    slug: "lemon-verbena",
    name: "Lemon Verbena",
    shortDescription: "Lemon verbena leaves, grown slowly above 2,750 m in Thimphu.",
    description:
      "Lemon verbena from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/lemon-verbena.jpg",
    featured: true,
  },
  {
    slug: "sea-buckthorn",
    name: "Sea Buckthorn",
    shortDescription: "Sea buckthorn, grown slowly above 2,750 m in Thimphu.",
    description:
      "Sea buckthorn from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and packaged without chemical additives.",
    benefits: [],
    image: "/images/teas/sea-buckthorn.jpg",
  },
  {
    slug: "hypericum",
    name: "Hypericum",
    shortDescription: "Hypericum, grown slowly above 2,750 m in Thimphu.",
    description:
      "Hypericum from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and packaged without chemical additives.",
    benefits: [],
    image: "/images/teas/hypericum.jpg",
  },
];

export const featuredTeas: Tea[] = teas.filter((tea) => tea.featured);

export function getTea(slug: string): Tea | undefined {
  return teas.find((tea) => tea.slug === slug);
}

export function otherTeas(slug: string): Tea[] {
  return teas.filter((tea) => tea.slug !== slug);
}
