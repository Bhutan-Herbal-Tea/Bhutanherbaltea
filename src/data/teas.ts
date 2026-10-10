export type Tea = {
  slug: string;
  name: string;
  botanical: string; // Latin name for the specimen label. TODO: client to confirm species
  shortDescription: string;
  description: string;
  benefits: string[]; // empty until the client supplies approved wording
  tasteNotes?: string; // only if the client provides it
  brewing?: string; // only if the client provides it
  image: string; // path under /public/images/teas/
  imageAlt: string; // describes the actual photo
  accent?: string; // optional colour from the box design
  featured?: boolean; // shown on the home page
};

// Descriptions use only facts from the Daily Bhutan (2023) article. TODO: client to supply final copy.
export const teas: Tea[] = [
  {
    slug: "chamomile",
    name: "Chamomile",
    botanical: "Matricaria chamomilla",
    shortDescription: "Chamomile flowers, grown slowly above 2,750 m in Thimphu.",
    description:
      "Chamomile flowers from our farm in Thimphu, grown above 2,750 m, hand-harvested at their peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/chamomile.jpg",
    imageAlt: "Chamomile flowers in bloom",
    featured: true,
  },
  {
    slug: "peppermint",
    name: "Peppermint",
    botanical: "Mentha × piperita",
    shortDescription: "Peppermint leaves, grown slowly above 2,750 m in Thimphu.",
    description:
      "Peppermint from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/peppermint.jpg",
    imageAlt: "Fresh mint leaves",
    featured: true,
  },
  {
    slug: "lemon-verbena",
    name: "Lemon Verbena",
    botanical: "Aloysia citrodora",
    shortDescription: "Lemon verbena leaves, grown slowly above 2,750 m in Thimphu.",
    description:
      "Lemon verbena from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and one of our three Brand Bhutan certified teas.",
    benefits: [],
    image: "/images/teas/lemon-verbena.jpg",
    imageAlt: "Leafy green herb stems",
    featured: true,
  },
  {
    slug: "sea-buckthorn",
    name: "Sea Buckthorn",
    botanical: "Hippophae", // genus only: the Himalayan species grown is unknown
    shortDescription: "Sea buckthorn, grown slowly above 2,750 m in Thimphu.",
    description:
      "Sea buckthorn from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and packaged without chemical additives.",
    benefits: [],
    image: "/images/teas/sea-buckthorn.jpg",
    imageAlt: "Orange sea buckthorn berries on a branch",
  },
  {
    slug: "hypericum",
    name: "Hypericum",
    botanical: "Hypericum", // genus only: species unknown
    shortDescription: "Hypericum, grown slowly above 2,750 m in Thimphu.",
    description:
      "Hypericum from our farm in Thimphu, grown above 2,750 m, hand-harvested at its peak and carefully dried. Certified organic and packaged without chemical additives.",
    benefits: [],
    image: "/images/teas/hypericum.jpg",
    imageAlt: "Yellow hypericum flowers",
  },
];

export const featuredTeas: Tea[] = teas.filter((tea) => tea.featured);

export function getTea(slug: string): Tea | undefined {
  return teas.find((tea) => tea.slug === slug);
}

export function otherTeas(slug: string): Tea[] {
  return teas.filter((tea) => tea.slug !== slug);
}
