import Image from "next/image";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";

export function StatementBand() {
  const { heading, body, linkLabel, image } = homeCopy.statement;
  return (
    <section
      aria-labelledby="statement-heading"
      className="slant-both relative overflow-hidden py-[calc(var(--slant)+5rem)] md:py-[calc(var(--slant)+7rem)] xl:py-[calc(var(--slant)+9rem)]"
    >
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/60" />
      <div className="container-page relative">
        <Reveal className="max-w-4xl xl:ml-[8%]">
          <h2 id="statement-heading" className="font-serif text-title text-mist xl:text-[4.5rem] xl:leading-[1.05]">
            {heading}
          </h2>
          <p className="mt-6 max-w-xl text-lead text-mist/85">{body}</p>
          <ArrowLink href="/our-story" tone="photo" className="mt-8">
            {linkLabel}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
