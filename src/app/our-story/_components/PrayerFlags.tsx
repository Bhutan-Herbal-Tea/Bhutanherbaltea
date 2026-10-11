import { LUNGTA_COLORS } from "@/data/pages/story";
import { cn } from "@/lib/utils";

// A string of lungta across the summit: three runs of the five colours (two on phones).
const RUNS = 3;

export function PrayerFlags({ className }: { className?: string }) {
  const flags = Array.from({ length: RUNS }, () => LUNGTA_COLORS).flat();
  return (
    <div aria-hidden className={cn("relative h-24 md:h-28", className)}>
      <div className="absolute inset-x-0 top-4 h-px -rotate-2 bg-mist/60" />
      <ul className="absolute inset-x-0 top-4 flex -rotate-2 justify-between px-[4%]">
        {flags.map((flag, index) => (
          <li
            key={index}
            className={cn("lungta h-14 w-[7%] md:h-20 md:w-[5%]", index >= 10 && "hidden md:block")}
            style={{ backgroundColor: flag.hex, animationDelay: `${(index % 5) * -0.7}s` }}
          />
        ))}
      </ul>
    </div>
  );
}
