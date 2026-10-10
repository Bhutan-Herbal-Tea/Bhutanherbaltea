import { featuredTeas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { cn } from "@/lib/utils";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TeaCard } from "@/components/teas/TeaCard";

export function FeaturedTeas() {
  const { eyebrow, heading, body, linkLabel } = homeCopy.featured;
  return (
    <Section aria-labelledby="featured-heading">
      <Reveal className="max-w-2xl">
        <p className="eyebrow text-accent-text">{eyebrow}</p>
        <h2 id="featured-heading" className="mt-4 font-serif text-title text-foreground">
          {heading}
        </h2>
        <p className="mt-5 text-lead text-muted-foreground">{body}</p>
      </Reveal>
      <ul
        aria-label={heading}
        className="scroll-row -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-20 xl:gap-10"
      >
        {featuredTeas.map((tea, index) => (
          <li key={tea.slug} className={cn("w-[78%] shrink-0 snap-start md:w-auto", index === 1 && "md:translate-y-16")}>
            <TeaCard tea={tea} sizes="(min-width: 1280px) 380px, (min-width: 768px) 33vw, 78vw" />
          </li>
        ))}
      </ul>
      <ArrowLink href="/teas" className="mt-10 md:mt-0">
        {linkLabel}
      </ArrowLink>
    </Section>
  );
}
