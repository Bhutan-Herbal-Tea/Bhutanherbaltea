import { DRUK_JA, DRUK_JA_LATIN, heroPhoto } from "@/data/site";
import { homeCopy } from "@/data/pages";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

export function Hero() {
  const { place, title, subtext, ctaLabel, teasLabel, plateLabel } = homeCopy.hero;
  return (
    <section className="container-page grid gap-14 pt-24 pb-16 md:grid-cols-2 md:items-center md:gap-10 md:pt-28 xl:grid-cols-[7fr_5fr] xl:gap-16 xl:pt-32 xl:pb-24">
      <div className="md:order-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span lang="dz" aria-label={DRUK_JA_LATIN} className="font-tibetan text-xl text-forest dark:text-saffron">
            {DRUK_JA}
          </span>
          <span className="eyebrow text-accent-text">{place}</span>
        </p>
        <AccentTitle as="h1" heading={title} className="mt-5 text-display md:mt-6" />
        <p className="mt-4 max-w-xl text-lead text-muted-foreground md:mt-6">{subtext}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-10">
          <ButtonLink href="/our-story">{ctaLabel}</ButtonLink>
          <ArrowLink href="/teas">{teasLabel}</ArrowLink>
        </div>
      </div>
      <div className="relative order-first md:order-2">
        <SpecimenPlate
          image={heroPhoto}
          preload
          label={plateLabel}
          labelClassName="pl-14 md:pl-20 xl:pl-24"
          frameClassName="aspect-16/10 md:aspect-4/5"
          sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
          className="mx-6 md:mx-0"
        >
          {/* The logo as an archive seal, stamped over the plate's lower corner. */}
          <Logo
            className="absolute -bottom-6 -left-5 h-auto w-20 -rotate-8 md:-bottom-8 md:-left-8 md:w-28 xl:w-32"
            sizes="(min-width: 1280px) 128px, (min-width: 768px) 112px, 80px"
          />
        </SpecimenPlate>
      </div>
    </section>
  );
}
