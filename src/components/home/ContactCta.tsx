import { contactPage, homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ContactCta() {
  const { heading, body, linkLabel } = homeCopy.cta;
  return (
    <Section aria-labelledby="contact-cta-heading" className="border-t border-border text-center">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <h2 id="contact-cta-heading" className="font-serif text-title text-mist">
          {heading}
        </h2>
        <p className="text-lead text-mist/80">{body}</p>
        <div className="mt-2 flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <WhatsAppButton label={contactPage.whatsappLabel} className="w-full md:w-auto" />
          <ButtonLink href="/contact" variant="outline" className="w-full md:w-auto">
            {linkLabel}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
