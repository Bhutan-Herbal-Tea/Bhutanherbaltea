export const SITE_NAME = "Bhutan Herbal Tea";
export const TAGLINE = "Wellness in Every Sip.";
export const SITE_DESCRIPTION =
  "Certified organic herbal teas grown above 2,750 m in Thimphu, Bhutan. Hand-harvested at their peak and packaged without chemical additives.";
export const CLOSING_LINE = "Drink tea that heals you and heals the earth.";

// Netlify sets URL at build time. TODO: switch to the custom domain once the client has one.
export const SITE_URL = process.env.URL ?? "http://localhost:3000";

// Daily Bhutan (2023): herbs "grown and harvested above 9,000 feet (2750 meters)". TODO: client to confirm.
export const SUMMIT_ALTITUDE_M = 2750;

export const HOME_NAV_LABEL = "Home";

// "Druk Yul", the name of Bhutan in Dzongkha. Verified; any other Dzongkha waits for the client.
export const DRUK_YUL = "འབྲུག་ཡུལ།";

// Second line of every tea specimen label: true of every tea, whatever the photo.
export const PLATE_PLACE = "Thimphu, 2,750 m";

export type Fact = { value: string; label: string };

// Daily Bhutan (2023). TODO: client to confirm.
export const facts: Fact[] = [
  { value: "2016", label: "Founded in Thimphu" },
  { value: "2,750 m", label: "Grown and harvested above" },
  { value: "5", label: "Certified organic teas" },
  { value: "3", label: "Brand Bhutan certified" },
  { value: "1st", label: "Herbal tea farm in Bhutan" },
];

export type Photo = { src: string; alt: string };

// TODO: replace with the client's photo; update the alt text to describe the real image.
export const heroPhoto: Photo = {
  src: "/images/hero/thimphu-fields.jpg",
  alt: "Terraced fields and farmhouses on a hillside in Bhutan",
};

export type NavItem = { href: string; label: string };

export const nav: NavItem[] = [
  { href: "/our-story", label: "Our Story" },
  { href: "/teas", label: "Our Teas" },
  { href: "/how-its-grown", label: "How It's Grown" },
  { href: "/contact", label: "Contact" },
];

export type SocialLinks = { facebook: string; instagram: string };

export type Contact = {
  phone: string;
  whatsapp: string;
  email: string;
  social: SocialLinks;
  whereToBuy: string[];
};

export const contact: Contact = {
  phone: "", // TODO
  whatsapp: "", // TODO: international format, digits only, e.g. "975XXXXXXXX"
  email: "", // TODO
  social: {
    facebook: "https://www.facebook.com/herbaltea.bhutan/",
    instagram: "", // TODO
  },
  whereToBuy: [], // TODO: stockists or shops
};
