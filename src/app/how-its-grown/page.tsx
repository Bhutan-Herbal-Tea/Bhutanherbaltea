import type { Metadata } from "next";
import Image from "next/image";
import { CLOSING_LINE } from "@/data/site";
import { certifications, farmSteps, grownPage, people } from "@/data/pages/grown";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { NumberedRows } from "@/components/herbarium/NumberedRows";
import { PageHero } from "@/components/herbarium/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecimenPlate } from "@/components/herbarium/SpecimenPlate";

export const metadata: Metadata = {
  title: grownPage.meta.title,
  description: grownPage.meta.description,
};

export default function HowItsGrownPage() {
  return (
    <>
      <PageHero {...grownPage.hero} />

      <Section aria-labelledby="practices-heading">
        <Reveal className="max-w-2xl">
          <h2 id="practices-heading" className="font-serif text-title text-foreground">
            {grownPage.practicesSection.heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{grownPage.practicesSection.intro}</p>
        </Reveal>
        <NumberedRows rows={farmSteps} />
      </Section>

      <section aria-labelledby="people-heading" className="pb-20 md:pb-28 xl:pb-36">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <h2 id="people-heading" className="font-serif text-title text-foreground">
              {grownPage.peopleSection.heading}
            </h2>
            <p className="mt-5 text-lead text-muted-foreground">{grownPage.peopleSection.intro}</p>
          </Reveal>
        </div>
        <ul
          aria-label={grownPage.peopleSection.heading}
          className="scroll-row mt-12 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pt-2 pb-2 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16"
        >
          {people.map((person) => (
            <li key={person.image.src} className="w-[74%] shrink-0 snap-start md:w-[42%] xl:w-[27%]">
              <SpecimenPlate
                image={person.image}
                label={person.caption ? [person.caption] : undefined}
                frameClassName="aspect-3/4"
                sizes="(min-width: 1280px) 27vw, (min-width: 768px) 42vw, 74vw"
              />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="certifications-heading" className="bg-card py-20 md:py-24 xl:py-28">
        <div className="container-page grid gap-10 xl:grid-cols-[6fr_5fr] xl:gap-20">
          <Reveal>
            <p className="eyebrow text-accent-text">{certifications.eyebrow}</p>
            <h2 id="certifications-heading" className="mt-4 font-serif text-title text-foreground">
              {certifications.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-lead text-muted-foreground">{certifications.body}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {certifications.items.map((item) => (
                <li
                  key={item}
                  className="border border-forest/30 px-3 py-2 font-mono text-[0.72rem] tracking-[0.15em] text-foreground uppercase dark:border-saffron/40"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="self-end">
            <p className="text-muted-foreground">{certifications.tradeNote}</p>
            <ArrowLink href="/contact#wholesale" className="mt-6">
              {certifications.tradeLinkLabel}
            </ArrowLink>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-28 text-center md:py-36 xl:py-48">
        <Image
          src={grownPage.closingImage.src}
          alt={grownPage.closingImage.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/65" />
        <div className="container-page relative">
          <Reveal>
            <p className="mx-auto max-w-4xl pb-1 font-serif text-title leading-[1.15] text-mist italic xl:text-display xl:leading-[1.1]">
              {CLOSING_LINE}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
