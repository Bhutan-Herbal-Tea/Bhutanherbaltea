import Image from "next/image";
import { SUMMIT_ALTITUDE_M } from "@/data/site";
import { storyPage } from "@/data/pages/story";
import { formatAltitude } from "@/lib/altitude";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { PrayerFlags } from "./PrayerFlags";

export function Summit() {
  const { heading, body, teasLabel, grownLabel, image } = storyPage.summit;
  return (
    <section
      aria-labelledby="summit-heading"
      className="relative flex min-h-[90svh] flex-col overflow-hidden text-center xl:min-h-dvh"
    >
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/60" />
      <PrayerFlags className="relative mt-10 md:mt-14" />
      <div className="container-page relative my-auto py-20">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="eyebrow text-saffron">{formatAltitude(SUMMIT_ALTITUDE_M)}</p>
          <h2 id="summit-heading" className="max-w-3xl font-serif text-display text-mist">
            {heading}
          </h2>
          <p className="max-w-xl text-lead text-mist/85">{body}</p>
          <div className="mt-4 flex w-full flex-col items-center gap-6 md:w-auto md:flex-row md:gap-8">
            <ButtonLink href="/teas" variant="light" className="w-full md:w-auto">
              {teasLabel}
            </ButtonLink>
            <ArrowLink href="/how-its-grown" tone="photo">
              {grownLabel}
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
