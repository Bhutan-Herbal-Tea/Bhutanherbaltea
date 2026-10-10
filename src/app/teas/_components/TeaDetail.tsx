import { Leaf } from "lucide-react";
import type { Tea } from "@/data/teas";
import { PLATE_PLACE } from "@/data/site";
import { teaDetailCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";
import { SpecimenCard } from "@/components/teas/SpecimenCard";

type TeaDetailProps = { tea: Tea; others: Tea[] };

export function TeaDetail({ tea, others }: TeaDetailProps) {
  const copy = teaDetailCopy;
  return (
    <article className="pt-24 xl:pt-32">
      <div className="container-page grid gap-12 xl:grid-cols-[45fr_55fr] xl:gap-20">
        <SpecimenPlate
          image={{ src: tea.image, alt: tea.imageAlt }}
          preload
          label={[tea.botanical, copy.organicLabel, PLATE_PLACE]}
          sizes="(min-width: 1280px) 42vw, (min-width: 768px) 70vw, 100vw"
          className="mx-auto w-full md:w-[70%] xl:sticky xl:top-28 xl:w-full xl:self-start"
        />
        <div className="flex flex-col gap-10 xl:py-6">
          <header>
            <p className="eyebrow text-accent-text">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-display text-foreground">{tea.name}</h1>
            <p className="mt-2 pb-1 font-serif text-2xl text-muted-foreground italic">{tea.botanical}</p>
            <p className="mt-6 text-lead text-muted-foreground">{tea.description}</p>
          </header>
          {tea.benefits.length > 0 && (
            <section aria-labelledby="benefits-heading">
              <h2 id="benefits-heading" className="font-serif text-3xl text-foreground">
                {copy.benefitsHeading}
              </h2>
              <ul className="mt-4 space-y-3">
                {tea.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-muted-foreground">
                    <Leaf className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {tea.tasteNotes && (
            <section aria-labelledby="taste-heading">
              <h2 id="taste-heading" className="font-serif text-3xl text-foreground">
                {copy.tasteHeading}
              </h2>
              <p className="mt-4 text-muted-foreground">{tea.tasteNotes}</p>
            </section>
          )}
          {tea.brewing && (
            <section aria-labelledby="brewing-heading">
              <h2 id="brewing-heading" className="font-serif text-3xl text-foreground">
                {copy.brewingHeading}
              </h2>
              <p className="mt-4 text-muted-foreground">{tea.brewing}</p>
            </section>
          )}
          <section aria-labelledby="buy-heading" className="border-l-2 border-forest pl-6 dark:border-saffron">
            <h2 id="buy-heading" className="font-serif text-3xl text-foreground">
              {copy.whereToBuy.heading}
            </h2>
            <p className="mt-3 text-muted-foreground">{copy.whereToBuy.body}</p>
            <ButtonLink href="/contact#where-to-buy" className="mt-6 w-full md:w-auto">
              {copy.whereToBuy.linkLabel}
            </ButtonLink>
          </section>
        </div>
      </div>

      <section aria-labelledby="other-teas-heading" className="py-20 md:py-28">
        <div className="container-page">
          <h2 id="other-teas-heading" className="font-serif text-title text-foreground">
            {copy.otherTeasHeading}
          </h2>
          <ul className="scroll-row -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 xl:mx-0 xl:grid xl:grid-cols-4 xl:gap-8 xl:overflow-visible xl:px-0">
            {others.map((other) => (
              <li key={other.slug} className="w-[66%] shrink-0 snap-start md:w-[40%] xl:w-auto">
                <SpecimenCard tea={other} sizes="(min-width: 1280px) 280px, (min-width: 768px) 40vw, 66vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
