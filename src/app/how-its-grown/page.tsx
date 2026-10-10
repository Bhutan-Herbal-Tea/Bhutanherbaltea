import type { Metadata } from "next";
import Image from "next/image";
import { CLOSING_LINE } from "@/data/site";
import { grownPage, people, practices } from "@/data/grown";
import { NumberedRows } from "@/components/ui/NumberedRows";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

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
        </Reveal>
        <NumberedRows rows={practices} />
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
