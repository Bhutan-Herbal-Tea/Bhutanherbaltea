import type { Contact } from "@/data/site";

export type SocialLink = { network: "facebook" | "instagram"; label: string; href: string };

export function whatsappHref(number: string): string | null {
  const digits = number.replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function telHref(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.replace(/\D/g, "").length >= 6 ? `tel:${cleaned}` : null;
}

export function mailtoHref(email: string): string | null {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? `mailto:${trimmed}` : null;
}

export function hasDirectContact(contact: Contact): boolean {
  return Boolean(whatsappHref(contact.whatsapp) || telHref(contact.phone) || mailtoHref(contact.email));
}

export function socialLinks(contact: Contact): SocialLink[] {
  const candidates: SocialLink[] = [
    { network: "facebook", label: "Facebook", href: contact.social.facebook },
    { network: "instagram", label: "Instagram", href: contact.social.instagram },
  ];
  return candidates.filter((link) => link.href.startsWith("https://"));
}
