import Image from "next/image";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function GrownStrip() {
  const { eyebrow, heading, body, linkLabel, image } = homeCopy.grown;
  return (
    <Section aria-labelledby="grown-strip-heading">
      <div className="grid overflow-hidden rounded-md bg-card md:grid-cols-2 xl:grid-cols-[3fr_2fr]">
        <div className="relative aspect-4/3 md:aspect-auto md:min-h-112 xl:min-h-136">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <Reveal className="flex flex-col items-start justify-center gap-5 p-8 md:p-10 xl:p-14">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="grown-strip-heading" className="font-serif text-title text-mist">
            {heading}
          </h2>
          <p className="text-lead text-mist/80">{body}</p>
          <ArrowLink href="/how-its-grown">{linkLabel}</ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}
