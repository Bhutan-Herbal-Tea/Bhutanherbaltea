import { ContactPanel } from "./_components/ContactPanel";
import { FeaturedTeas } from "./_components/FeaturedTeas";
import { GrownStrip } from "./_components/GrownStrip";
import { Hero } from "./_components/Hero";
import { StatementBand } from "./_components/StatementBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatementBand />
      <FeaturedTeas />
      <GrownStrip />
      <ContactPanel />
    </>
  );
}
