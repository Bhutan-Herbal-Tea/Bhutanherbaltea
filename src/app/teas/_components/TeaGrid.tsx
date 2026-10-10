import type { Tea } from "@/data/teas";
import { cn } from "@/lib/utils";
import { TeaCard } from "@/components/teas/TeaCard";

// Staggered: on tablet every second card drops; on desktop the middle column drops.
export function TeaGrid({ teas }: { teas: Tea[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 md:gap-x-8 md:pb-14 xl:grid-cols-3 xl:gap-x-10 xl:pb-20">
      {teas.map((tea, index) => (
        <li
          key={tea.slug}
          className={cn(
            index % 2 === 1 && "md:translate-y-14",
            "xl:translate-y-0",
            index % 3 === 1 && "xl:translate-y-20",
          )}
        >
          <TeaCard tea={tea} headingLevel={2} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" />
        </li>
      ))}
    </ul>
  );
}
