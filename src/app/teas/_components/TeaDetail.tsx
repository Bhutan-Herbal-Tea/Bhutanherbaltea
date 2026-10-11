import { Leaf } from "lucide-react";
import type { Tea } from "@/data/teas";
import { PLATE_PLACE } from "@/data/site";
import { teaDetailCopy } from "@/data/pages/teas";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SpecimenPlate } from "@/components/herbarium/SpecimenPlate";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SpecimenCard } from "@/components/herbarium/SpecimenCard";

type TeaDetailProps = { tea: Tea; others: Tea[] };

export function TeaDetail({ tea, others }: TeaDetailProps) {
  const copy = teaDetailCopy;
  return (
    <article className="pt-24 xl:pt-32">
      {/* Side by side from tablet up, so the name is on the first screen next to the photo;
          the plate's height is capped by the viewport so its label stays visible while sticky. */}
      <div className="container-page grid gap-10 md:grid-cols-[5fr_6fr] md:gap-10 xl:grid-cols-[45fr_55fr] xl:gap-20">
        <SpecimenPlate
          image={{ src: tea.image, alt: tea.imageAlt }}
          preload
          label={[tea.botanical, ...(tea.certifiedOrganic ? [copy.organicLabel] : []), PLATE_PLACE]}
          frameClassName="aspect-4/3 w-full md:aspect-4/5 md:max-h-[60svh]"
          sizes="(min-width: 1280px) 42vw, (min-width: 768px) 45vw, 100vw"
          className="w-full md:sticky md:top-24 md:self-start xl:top-28"
        />
        <div className="flex flex-col gap-10 md:py-2 xl:py-6">
          <header>
            <p className="eyebrow text-accent-text">{copy.eyebrow}</p>
            <h1 className="mt-4 font-serif text-display text-foreground">{tea.name}</h1>
            <p className="mt-2 pb-1 font-serif text-2xl text-muted-foreground italic">{tea.botanical}</p>
            <p className="mt-6 text-lead text-muted-foreground">{tea.description}</p>
          </header>
          {tea.caution && (
            <aside aria-labelledby="caution-heading" className="border-l-2 border-bhutan bg-card p-5 md:p-6">
              <h2 id="caution-heading" className="eyebrow text-foreground">
                {copy.cautionHeading}
              </h2>
              <p className="mt-3 text-foreground">{tea.caution}</p>
            </aside>
          )}
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
          <section aria-labelledby="order-heading" className="border-l-2 border-forest pl-6 dark:border-saffron">
            <h2 id="order-heading" className="font-serif text-3xl text-foreground">
              {copy.order.heading}
            </h2>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
              <dt className="eyebrow self-center text-muted-foreground">{copy.order.packLabel}</dt>
              <dd className="text-foreground">{tea.pack}</dd>
              <dt className="eyebrow self-center text-muted-foreground">{copy.order.priceLabel}</dt>
              <dd className="font-serif text-2xl text-foreground">{tea.price}</dd>
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">{copy.order.note}</p>
            <div className="mt-6 flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-8">
              <WhatsAppButton
                label={copy.order.whatsappLabel}
                message={copy.order.message(tea.name)}
                className="w-full md:w-auto"
              />
              <ArrowLink href="/contact#where-to-buy">{copy.order.contactLabel}</ArrowLink>
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="other-teas-heading" className="py-20 md:py-28">
        <div className="container-page">
          <h2 id="other-teas-heading" className="font-serif text-title text-foreground">
            {copy.otherTeasHeading}
          </h2>
          {/* Swipeable on phones; three across from tablet up, matching the catalogue grid. */}
          <ul className="scroll-row -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 xl:gap-10">
            {others.map((other) => (
              <li key={other.slug} className="w-[72%] shrink-0 snap-start md:w-auto">
                <SpecimenCard tea={other} sizes="(min-width: 1280px) 380px, (min-width: 768px) 33vw, 72vw" />
              </li>
            ))}
          </ul>
          <ArrowLink href="/teas" className="mt-10">
            {copy.allTeasLabel}
          </ArrowLink>
        </div>
      </section>
    </article>
  );
}
