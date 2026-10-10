import { CLOSING_LINE } from "@/data/site";
import { teas } from "@/data/teas";
import { homeCopy } from "@/data/pages";
import { FactsBand } from "@/components/ui/FactsBand";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { Ticker } from "@/components/ui/Ticker";
import { ClosingPanel } from "./_components/ClosingPanel";
import { FeaturedTeas } from "./_components/FeaturedTeas";
import { Hero } from "./_components/Hero";
import { WhyAltitude } from "./_components/WhyAltitude";

const tickerItems = teas.flatMap((tea) => [tea.name, tea.botanical]);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker items={tickerItems} />
      <FactsBand label={homeCopy.factsLabel} />
      <WhyAltitude />
      <FeaturedTeas />
      <QuoteBlock quote={CLOSING_LINE} label={homeCopy.quoteLabel} />
      <ClosingPanel />
    </>
  );
}
