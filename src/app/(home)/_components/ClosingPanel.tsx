import { contactPage } from "@/data/pages/contact";
import { homeCopy } from "@/data/pages/home";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ClosingPanel() {
  const { heading, body, linkLabel } = homeCopy.contactPanel;
  return (
    <section aria-labelledby="closing-heading" className="bg-forest text-mist">
      {/* The flag's two colours as flat stripes: no diagonal edges in this design. */}
      <div aria-hidden className="grid h-2 grid-rows-2">
        <span className="bg-saffron" />
        <span className="bg-bhutan" />
      </div>
      <div className="container-page py-20 md:py-24">
        <Reveal className="flex flex-col items-start gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h2 id="closing-heading" className="font-serif text-title">
              {heading}
            </h2>
            <p className="mt-4 text-lead text-mist/85">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <WhatsAppButton variant="light" label={contactPage.whatsappLabel} className="w-full md:w-auto" />
            <ButtonLink href="/contact" variant="light" className="w-full md:w-auto">
              {linkLabel}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
