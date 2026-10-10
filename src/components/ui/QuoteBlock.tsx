import { DRUK_JA } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

type QuoteBlockProps = { quote: string; label: string };

export function QuoteBlock({ quote, label }: QuoteBlockProps) {
  return (
    <section aria-label={label} className="relative overflow-hidden bg-card py-24 md:py-32">
      <span
        aria-hidden
        lang="dz"
        className="pointer-events-none absolute -right-4 -bottom-6 font-tibetan text-[8rem] leading-none text-forest/[0.07] select-none md:text-[13rem] dark:text-mist/5"
      >
        {DRUK_JA}
      </span>
      <div className="container-page relative">
        <Reveal className="max-w-3xl">
          <span aria-hidden lang="dz" className="font-tibetan text-2xl text-forest dark:text-saffron">
            {DRUK_JA}
          </span>
          <blockquote className="mt-6 pb-1 font-serif text-title leading-[1.2] text-foreground italic">
            “{quote}”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
