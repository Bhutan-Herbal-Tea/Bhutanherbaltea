import type { Metadata } from "next";
import { specialtyTeas, teas } from "@/data/teas";
import { teasPage } from "@/data/pages/teas";
import { PageHero } from "@/components/herbarium/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { TeaGrid } from "./_components/TeaGrid";

export const metadata: Metadata = {
  title: teasPage.meta.title,
  description: teasPage.meta.description,
};

export default function TeasPage() {
  const { specialty } = teasPage;
  return (
    <>
      <PageHero {...teasPage.hero} />
      <Section aria-label={teasPage.hero.title}>
        <TeaGrid teas={teas} />
        <p className="mt-16 max-w-2xl text-sm text-muted-foreground md:mt-10 xl:mt-4">{teasPage.priceNote}</p>
      </Section>

      <section aria-labelledby="specialty-heading" className="bg-card py-20 md:py-24 xl:py-28">
        <div className="container-page grid gap-12 xl:grid-cols-[5fr_7fr] xl:gap-20">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-accent-text">{specialty.eyebrow}</p>
            <h2 id="specialty-heading" className="mt-4 font-serif text-title text-foreground">
              {specialty.heading}
            </h2>
            <p className="mt-5 text-lead text-muted-foreground">{specialty.body}</p>
            <WhatsAppButton label={specialty.linkLabel} message={specialty.message} className="mt-8 w-full md:w-auto" />
          </Reveal>
          <ul className="divide-y divide-border border-y border-border">
            {specialtyTeas.map((item) => (
              <li key={item.name} className="flex flex-col gap-1 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <h3 className="font-serif text-2xl text-foreground">{item.name}</h3>
                {item.description && <p className="text-muted-foreground md:text-right">{item.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
