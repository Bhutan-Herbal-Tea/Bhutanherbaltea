import Image from "next/image";
import type { ClimbStageData } from "@/data/pages/story";
import type { StageLayout } from "@/lib/story";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SpecimenPlate } from "@/components/herbarium/SpecimenPlate";

type ClimbStageProps = { stage: ClimbStageData; layout: StageLayout };

export function ClimbStage({ stage, layout }: ClimbStageProps) {
  const headingId = `stage-${stage.id}`;

  if (layout === "full-bleed") {
    return (
      <section aria-labelledby={headingId} className="relative my-14 flex min-h-[78svh] items-end overflow-hidden py-16 md:my-20">
        <Image src={stage.image.src} alt={stage.image.alt} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/45 to-ink/15" />
        <div className="container-page relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-saffron">{stage.marker}</p>
            <h2 id={headingId} className="mt-4 font-serif text-title text-mist">
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
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-12 xl:gap-20">
        <Reveal className={cn(layout === "image-right" && "md:order-2")}>
          <SpecimenPlate
            image={stage.image}
            frameClassName="aspect-4/3 md:aspect-4/5"
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </Reveal>
        <Reveal className="max-w-xl">
          <p className="eyebrow text-accent-text">{stage.marker}</p>
          <h2 id={headingId} className="mt-4 font-serif text-title text-foreground">
            {stage.heading}
          </h2>
          <p className="mt-5 text-lead text-muted-foreground">{stage.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
