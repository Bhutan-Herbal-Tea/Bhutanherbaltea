import { featuredTeas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SpecimenCard } from "@/components/teas/SpecimenCard";

export function FeaturedTeas() {
  const { eyebrow, title, body, linkLabel } = homeCopy.featured;
  return (
    <Section aria-labelledby="featured-heading" className="pt-0 md:pt-0 xl:pt-0">
      <Reveal className="max-w-3xl">
        <p className="eyebrow text-accent-text">{eyebrow}</p>
        <AccentTitle id="featured-heading" heading={title} className="mt-4 text-title" />
        <p className="mt-5 text-lead text-muted-foreground">{body}</p>
      </Reveal>
      <ul
        aria-label={`${title.lead} ${title.accent} ${title.tail ?? ""}`.trim()}
        className="scroll-row -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 xl:gap-10"
      >
        {featuredTeas.map((tea) => (
          <li key={tea.slug} className="w-[80%] shrink-0 snap-start md:w-auto">
            <SpecimenCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 33vw, 80vw" />
          </li>
        ))}
      </ul>
      <ArrowLink href="/teas" className="mt-10">
        {linkLabel}
      </ArrowLink>
    </Section>
  );
}
