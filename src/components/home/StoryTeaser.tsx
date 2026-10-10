import { homeCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function StoryTeaser() {
  const { eyebrow, heading, body, linkLabel } = homeCopy.teaser;
  return (
    <Section id="story-teaser" aria-labelledby="story-teaser-heading" className="scroll-mt-16">
      <div className="grid gap-8 xl:grid-cols-[1.25fr_1fr] xl:items-end xl:gap-20">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="story-teaser-heading" className="mt-4 max-w-3xl font-serif text-title text-mist">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col items-start gap-6">
          <p className="max-w-xl text-lead text-mist/80">{body}</p>
          <ArrowLink href="/our-story">{linkLabel}</ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}
