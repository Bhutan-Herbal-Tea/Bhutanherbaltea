import { ArrowUpRight } from "lucide-react";
import { contact } from "@/data/site";
import { contactPage } from "@/data/pages";
import { whatsappHref } from "@/lib/contact";

// Prefilled WhatsApp messages, one per topic. Nothing is collected by the site.
export function EnquiryLinks() {
  const links = contactPage.enquiries.flatMap((enquiry) => {
    const href = whatsappHref(contact.whatsapp, enquiry.message);
    return href ? [{ ...enquiry, href }] : [];
  });
  if (links.length === 0) return null;
  return (
    <div>
      <h3 className="eyebrow text-accent-text">{contactPage.enquiriesHeading}</h3>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 py-4 font-serif text-xl text-foreground transition-colors hover:text-forest dark:hover:text-saffron"
            >
              {link.label}
              <ArrowUpRight
                className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
