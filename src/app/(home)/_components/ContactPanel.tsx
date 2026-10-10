import { contactPage, homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

// The one block filled with the flag split. Ink text passes contrast on both halves.
export function ContactPanel() {
  const { heading, body, linkLabel } = homeCopy.contactPanel;
  return (
    <section
      aria-labelledby="contact-panel-heading"
      className="flag-split slant-top py-[calc(var(--slant)+4.5rem)] text-ink md:py-[calc(var(--slant)+6rem)]"
    >
      <div className="container-page">
        <Reveal className="flex flex-col items-start gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h2 id="contact-panel-heading" className="font-serif text-title">
              {heading}
            </h2>
            <p className="mt-4 text-lead">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <WhatsAppButton variant="ink" label={contactPage.whatsappLabel} className="w-full md:w-auto" />
            <ButtonLink href="/contact" variant="ink" className="w-full md:w-auto">
              {linkLabel}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
