import { CLOSING_LINE } from "@/data/site";
import { teas } from "@/data/teas";
import { homeCopy } from "@/data/pages/home";
import { FactsBand } from "./_components/FactsBand";
import { QuoteBlock } from "./_components/QuoteBlock";
import { Ticker } from "./_components/Ticker";
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
