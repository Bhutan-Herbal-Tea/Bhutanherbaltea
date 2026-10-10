import type { Tea } from "@/data/teas";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SpecimenCard } from "@/components/teas/SpecimenCard";

// Staggered catalogue: on tablet every second plate drops; on desktop the middle column drops.
// The drop uses Tailwind's `translate` property, so it doesn't clash with Reveal's transform.
export function TeaGrid({ teas }: { teas: Tea[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:pb-14 xl:grid-cols-3 xl:gap-x-12 xl:pb-20">
      {teas.map((tea, index) => (
        <Reveal
          as="li"
          key={tea.slug}
          className={cn(
            index % 2 === 1 && "md:translate-y-14",
            "xl:translate-y-0",
            index % 3 === 1 && "xl:translate-y-20",
          )}
        >
          <SpecimenCard tea={tea} headingLevel={2} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" />
        </Reveal>
      ))}
    </ul>
  );
}
