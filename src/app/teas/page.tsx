import type { Metadata } from "next";
import { teas } from "@/data/teas";
import { teasPage } from "@/data/pages";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { TeaGrid } from "./_components/TeaGrid";

export const metadata: Metadata = {
  title: teasPage.meta.title,
  description: teasPage.meta.description,
};

export default function TeasPage() {
  return (
    <>
      <PageHero {...teasPage.hero} />
      <Section aria-label={teasPage.hero.title}>
        <TeaGrid teas={teas} />
      </Section>
    </>
  );
}
