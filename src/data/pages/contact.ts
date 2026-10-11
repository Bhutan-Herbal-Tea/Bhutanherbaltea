// Contact page copy. Contact details themselves live in src/data/site.ts.
import type { PageHeroContent } from "../types";

export const contactPage = {
  meta: {
    title: "Contact",
    description: "Where to buy Bhutan Herbal Tea and how to get in touch.",
  },
  hero: {
    title: "Get in touch",
    intro: "Where to find our teas, and how to reach us.",
    image: { src: "/images/fields/farm.jpg", alt: "Golden fields below a Bhutanese building and forested mountains" },
  } satisfies PageHeroContent,
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
