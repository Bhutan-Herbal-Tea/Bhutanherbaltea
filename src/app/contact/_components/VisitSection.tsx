import { contactPage } from "@/data/pages/contact";
import { Reveal } from "@/components/ui/Reveal";
import { SpecimenPlate } from "@/components/herbarium/SpecimenPlate";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function VisitSection() {
  const copy = contactPage.visit;
  return (
    <section id="visit" aria-labelledby="visit-heading" className="scroll-mt-24 py-20 md:py-24 xl:py-28">
      <div className="container-page grid items-center gap-12 md:grid-cols-2 md:gap-12 xl:gap-20">
        <Reveal className="md:order-2">
          <SpecimenPlate
            image={copy.image}
            frameClassName="aspect-4/3 md:aspect-4/5"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </Reveal>
        <Reveal className="max-w-xl">
          <p className="eyebrow text-accent-text">{copy.eyebrow}</p>
          <h2 id="visit-heading" className="mt-4 font-serif text-title text-foreground">
            {copy.heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{copy.body}</p>
          <p className="mt-4 text-sm text-muted-foreground">{copy.note}</p>
          <WhatsAppButton label={copy.linkLabel} message={copy.message} className="mt-8 w-full md:w-auto" />
        </Reveal>
      </div>
    </section>
  );
}
