import type { Metadata } from "next";
import Image from "next/image";
import { CLOSING_LINE } from "@/data/site";
import { grownPage, people, practices } from "@/data/grown";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

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
        <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
          {practices.map((practice, index) => (
            <Reveal as="li" key={practice.title} delay={(index % 4) * 0.08}>
              <span aria-hidden className="block h-0.5 w-12 origin-left rotate-[-34deg] bg-accent-mark" />
              <h3 className="mt-6 font-serif text-2xl text-foreground">{practice.title}</h3>
              <p className="mt-3 text-muted-foreground">{practice.body}</p>
            </Reveal>
          ))}
        </ul>
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
          className="scroll-row mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 md:scroll-px-10 md:px-10 xl:scroll-px-16 xl:px-16"
        >
          {people.map((person) => (
            <li key={person.image.src} className="w-[72%] shrink-0 snap-start md:w-[40%] xl:w-[26%]">
              <figure>
                <ImageReveal>
                  <div className="notch relative aspect-3/4 overflow-hidden bg-card">
                    <Image
                      src={person.image.src}
                      alt={person.image.alt}
                      fill
                      sizes="(min-width: 1280px) 26vw, (min-width: 768px) 40vw, 72vw"
                      className="object-cover"
                    />
                  </div>
                </ImageReveal>
                {person.caption && (
                  <figcaption className="mt-3 text-sm text-muted-foreground">{person.caption}</figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="slant-top relative overflow-hidden py-[calc(var(--slant)+6rem)] text-center md:py-[calc(var(--slant)+8rem)] xl:py-[calc(var(--slant)+11rem)]">
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
