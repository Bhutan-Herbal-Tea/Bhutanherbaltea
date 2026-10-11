export type Tea = {
  slug: string;
  name: string;
  botanical: string; // Latin name for the specimen label, as the client gives it
  shortDescription: string;
  description: string;
  benefits: string[]; // empty until the client supplies approved wording
  tasteNotes?: string; // only if the client provides it
  brewing?: string; // only if the client provides it
  pack: string; // pack size from the client's catalogue
  price: string; // in Bhutanese Ngultrum; the page says to confirm availability
  caution?: string; // safety note in the client's own wording, shown on the tea's page
  certifiedOrganic: boolean; // only where a source says so
  image: string; // path under /public/images/teas/
  imageAlt: string; // describes the actual photo
  accent?: string; // optional colour from the box design
  featured?: boolean; // shown on the home page
};

export type SpecialtyTea = { name: string; description?: string }; // description only where the client gives one

// Names, botanical names, one-liners, packs and prices: the client's catalogue (2026-10-11).
// Organic certification: Daily Bhutan (2023), which covers the original five. TODO: client to confirm Chrysanthemum.
export const teas: Tea[] = [
  {
    slug: "chamomile",
    name: "Chamomile",
    botanical: "Matricaria recutita",
    shortDescription: "Soft, floral and gently aromatic. A classic caffeine-free herbal infusion.",
    description:
      "Soft, floral and gently aromatic: a classic caffeine-free herbal infusion. Chamomile flowers from our farm in Bumthang, hand-harvested at their peak and carefully dried. One of our three Brand Bhutan certified teas.",
    benefits: [],
    pack: "20 tea bags × 1 g",
    price: "Nu. 300",
    certifiedOrganic: true,
    image: "/images/teas/chamomile.jpg",
    imageAlt: "Chamomile flowers in bloom",
    featured: true,
  },
  {
    slug: "mint",
    name: "Mint",
    botanical: "Mentha piperita",
    shortDescription: "Fresh, cooling peppermint aroma with a clean, refreshing finish.",
    description:
      "Fresh, cooling peppermint aroma with a clean, refreshing finish. Peppermint leaves from our farm in Bumthang, hand-harvested at their peak and carefully dried. One of our three Brand Bhutan certified teas.",
    benefits: [],
    pack: "20 tea bags × 1 g",
    price: "Nu. 300",
    certifiedOrganic: true,
    image: "/images/teas/mint.jpg",
    imageAlt: "Fresh mint leaves",
    featured: true,
  },
  {
    slug: "lemon-verbena",
    name: "Lemon Verbena",
    botanical: "Aloysia triphylla",
    shortDescription: "Bright citrus-like fragrance with a smooth herbal character.",
    description:
      "Bright citrus-like fragrance with a smooth herbal character. Lemon verbena leaves from our farm in Bumthang, hand-harvested at their peak and carefully dried. One of our three Brand Bhutan certified teas.",
    benefits: [],
    pack: "20 tea bags × 1 g",
    price: "Nu. 300",
    certifiedOrganic: true,
    image: "/images/teas/lemon-verbena.jpg",
    imageAlt: "Leafy green herb stems",
    featured: true,
  },
  {
    slug: "himalayan-sea-berry",
    name: "Himalayan Sea-Berry",
    botanical: "Hippophae salicifolia",
    shortDescription: "Distinctive Himalayan berry infusion with a naturally tangy character.",
    description:
      "A distinctive Himalayan berry infusion with a naturally tangy character, from the sea-berry (sea buckthorn) of the Himalaya. Grown in Bhutan, harvested at its peak and carefully dried in Bumthang.",
    benefits: [],
    pack: "20 tea bags × 2 g",
    price: "Nu. 300",
    certifiedOrganic: true,
    image: "/images/teas/himalayan-sea-berry.jpg",
    imageAlt: "Orange sea buckthorn berries on a branch",
  },
  {
    slug: "chrysanthemum",
    name: "Chrysanthemum",
    botanical: "Chrysanthemum × morifolium",
    shortDescription: "Delicate floral aroma and a light, pleasant infusion.",
    description:
      "Delicate floral aroma and a light, pleasant infusion. Chrysanthemum flowers grown in Bhutan, carefully dried and packed by us in Bumthang.",
    benefits: [],
    pack: "20 tea bags × 1 g",
    price: "Nu. 300",
    certifiedOrganic: false,
    image: "/images/teas/chrysanthemum.jpg",
    imageAlt: "Yellow chrysanthemum flowers in full bloom",
  },
  {
    slug: "hypericum",
    name: "Hypericum",
    botanical: "Hypericum perforatum",
    shortDescription: "A single-herb infusion made with Hypericum, also known as St. John's wort.",
    description:
      "A single-herb infusion made with Hypericum, also known as St. John's wort. Grown on our farm in Bumthang, hand-harvested at its peak and carefully dried. Sold as loose leaf.",
    benefits: [],
    pack: "Loose leaf, 10 g",
    price: "Nu. 200",
    caution:
      "St. John's wort can interact with many medicines, including antidepressants, hormonal contraceptives and other prescriptions. Seek medical advice before use; avoid during pregnancy or breastfeeding unless advised by a clinician.",
    certifiedOrganic: true,
    image: "/images/teas/hypericum.jpg",
    imageAlt: "Yellow hypericum flowers",
  },
];

// Blends and gifts: shown as a short list on Our Teas, enquiry only. Client's catalogue (2026-10-11).
export const specialtyTeas: SpecialtyTea[] = [
  { name: "Himalayan Ginseng Tea", description: "Ginseng, cinnamon and peppermint." },
  { name: "Cordyceps Ginseng Tea" },
  { name: "Inner Peace Tea", description: "Hypericum flower, cinnamon and cornflower." },
  { name: "Assorted Tea Gift Box" },
];

export const featuredTeas: Tea[] = teas.filter((tea) => tea.featured);

export function getTea(slug: string): Tea | undefined {
  return teas.find((tea) => tea.slug === slug);
}

export function otherTeas(slug: string): Tea[] {
  return teas.filter((tea) => tea.slug !== slug);
}
