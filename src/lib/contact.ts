import type { Contact } from "@/data/site";

export type SocialLink = { network: "facebook" | "instagram"; label: string; href: string };

// `message` prefills the chat, e.g. "Mint Tea enquiry".
export function whatsappHref(number: string, message?: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return message ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : `https://wa.me/${digits}`;
}

export function telHref(phone: string): string | null {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.replace(/\D/g, "").length >= 6 ? `tel:${cleaned}` : null;
}

export function mailtoHref(email: string, prefill?: { subject?: string; body?: string }): string | null {
  const trimmed = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  const params = [
    prefill?.subject && `subject=${encodeURIComponent(prefill.subject)}`,
    prefill?.body && `body=${encodeURIComponent(prefill.body)}`,
  ].filter(Boolean);
  return params.length > 0 ? `mailto:${trimmed}?${params.join("&")}` : `mailto:${trimmed}`;
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
