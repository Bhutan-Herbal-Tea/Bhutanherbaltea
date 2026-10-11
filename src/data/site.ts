// Brand-wide facts and settings used on every page: name, place, facts, navigation, contact.
import type { Photo } from "./types";

export const SITE_NAME = "Bhutan Herbal Tea";
export const TAGLINE = "Wellness in Every Sip.";
export const SITE_DESCRIPTION =
  "Certified organic herbal teas grown above 2,750 m in Bumthang, Bhutan. Hand-harvested at their peak and packaged without chemical additives.";
export const CLOSING_LINE = "Drink tea that heals you and heals the earth.";

// Netlify sets URL at build time. TODO: switch to the custom domain once the client has one.
export const SITE_URL = process.env.URL ?? "http://localhost:3000";

// Daily Bhutan (2023): herbs "grown and harvested above 9,000 feet (2750 meters)". TODO: client to confirm.
export const SUMMIT_ALTITUDE_M = 2750;

export const HOME_NAV_LABEL = "Home";

// "Druk ja", Bhutanese tea, in Dzongkha (chosen by the user, 2026-10-10). Decorative accent.
export const DRUK_JA = "འབྲུག་ཇ།";
export const DRUK_JA_LATIN = "Druk ja";

// Where the herbs grow: Bumthang Dzongkhag, confirmed by the client (2026-10-10).
export const FARM_PLACE = "Bumthang";
// The village, spelled exactly as the client gives it. Used where the page tells the place story.
export const FARM_VILLAGE = "Damphel Chokorteo / Shingkhar";

// Second line of every tea specimen label: true of every tea, whatever the photo.
export const PLATE_PLACE = `${FARM_PLACE}, 2,750 m`;

export type Fact = { value: string; label: string };

// Daily Bhutan (2023). TODO: client to confirm.
export const facts: Fact[] = [
  { value: "2016", label: "Year founded" },
  { value: "2,750 m", label: "Grown and harvested above" },
  { value: "6", label: "Single-herb teas" }, // client's catalogue (2026-10-11)
  { value: "3", label: "Brand Bhutan certified" },
  { value: "1st", label: "Herbal tea farm in Bhutan" },
];

// TODO: replace with the client's photo; update the alt text to describe the real image.
export const heroPhoto: Photo = {
  src: "/images/hero/terraced-fields.jpg",
  alt: "Terraced fields and farmhouses on a hillside in Bhutan",
};

export type NavItem = { href: string; label: string };

export const nav: NavItem[] = [
  { href: "/our-story", label: "Our Story" },
  { href: "/teas", label: "Our Teas" },
  { href: "/how-its-grown", label: "How It's Grown" },
  { href: "/contact", label: "Contact" },
];

// What the header, mobile menu and footer show. `nav` stays page-only for the sitemap.
export const mainNav: NavItem[] = [{ href: "/", label: HOME_NAV_LABEL }, ...nav];

export type SocialLinks = { facebook: string; instagram: string };

export type Contact = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  social: SocialLinks;
  whereToBuy: string[];
};

// From the client's own page (2026-10-11).
export const contact: Contact = {
  phone: "+975 77863786",
  whatsapp: "97577863786", // international format, digits only
  email: "herbalboy27@gmail.com",
  address: "Bumthang, Bhutan",
  social: {
    facebook: "https://www.facebook.com/herbaltea.bhutan/",
    instagram: "https://www.instagram.com/bhutan_herbal_tea/",
  },
  whereToBuy: [], // TODO: stockists or shops; until then the page points to ordering directly
};
