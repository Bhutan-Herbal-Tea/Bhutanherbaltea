import Image from "next/image";
import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";

export function GrownStrip() {
  const { heading, body, linkLabel, image } = homeCopy.grown;
  return (
    <section aria-labelledby="grown-heading" className="pb-20 md:pb-28 xl:pb-36">
      <ImageReveal>
        <div className="relative aspect-4/3 md:aspect-video xl:aspect-21/9">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
        </div>
      </ImageReveal>
      <div className="container-page mt-10 xl:mt-14 xl:grid xl:grid-cols-12">
        <Reveal className="max-w-xl xl:col-span-6 xl:col-start-6 xl:max-w-none">
          <h2 id="grown-heading" className="font-serif text-title text-foreground">
            {heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{body}</p>
          <ArrowLink href="/how-its-grown" className="mt-8">
            {linkLabel}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}
