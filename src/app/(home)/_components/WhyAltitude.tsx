import { homeCopy } from "@/data/pages";
import { AccentTitle } from "@/components/ui/AccentTitle";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { NumberedRows } from "@/components/ui/NumberedRows";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function WhyAltitude() {
  const { eyebrow, title, rows, linkLabel } = homeCopy.why;
  return (
    <Section aria-labelledby="why-heading">
      <Reveal className="max-w-3xl">
        <p className="eyebrow text-accent-text">{eyebrow}</p>
        <AccentTitle id="why-heading" heading={title} className="mt-4 text-title" />
      </Reveal>
      <NumberedRows rows={rows} />
      <ArrowLink href="/our-story" className="mt-10">
        {linkLabel}
      </ArrowLink>
    </Section>
  );
}
