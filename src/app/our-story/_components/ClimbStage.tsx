import Image from "next/image";
import type { ClimbStageData } from "@/data/story";
import type { StageLayout } from "@/lib/story";
import { cn } from "@/lib/utils";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";

type ClimbStageProps = { stage: ClimbStageData; layout: StageLayout };

export function ClimbStage({ stage, layout }: ClimbStageProps) {
  const headingId = `stage-${stage.id}`;

  if (layout === "full-bleed") {
    return (
      <section
        aria-labelledby={headingId}
        className="slant-both relative my-14 flex min-h-[80svh] items-end overflow-hidden py-[calc(var(--slant)+3rem)] md:my-20"
      >
        <Image src={stage.image.src} alt={stage.image.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/45 to-ink/15" />
        <div className="container-page relative">
          <Reveal className="max-w-3xl">
            <p className="font-serif text-xl text-saffron italic">{stage.marker}</p>
            <h2 id={headingId} className="mt-3 font-serif text-title text-mist">
              {stage.heading}
            </h2>
            <p className="mt-5 text-lead text-mist/85">{stage.body}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId} className="py-14 md:py-20 xl:py-24">
      <div className="container-page grid items-center gap-8 md:grid-cols-2 md:gap-12 xl:gap-20">
        <ImageReveal className={cn(layout === "image-right" && "md:order-2")}>
          <div className="notch relative aspect-4/3 overflow-hidden bg-card md:aspect-4/5">
            <Image
              src={stage.image.src}
              alt={stage.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ImageReveal>
        <Reveal className="max-w-xl">
          <p className="font-serif text-xl text-muted-foreground italic">{stage.marker}</p>
          <h2 id={headingId} className="mt-3 font-serif text-title text-foreground">
            {stage.heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{stage.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
