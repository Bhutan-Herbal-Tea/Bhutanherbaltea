import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type Row = { title: string; body: string };

export function NumberedRows({ rows, className }: { rows: Row[]; className?: string }) {
  return (
    <ol className={cn("mt-12 divide-y divide-border border-y border-border", className)}>
      {rows.map((row, index) => (
        <Reveal
          as="li"
          key={row.title}
          className="grid gap-3 py-8 md:grid-cols-[7rem_1fr] md:gap-x-8 xl:grid-cols-[9rem_1fr_1.4fr] xl:items-baseline xl:py-10"
        >
          <span
            aria-hidden
            className="pb-1 font-serif text-5xl leading-[1.1] text-forest/35 italic xl:text-6xl dark:text-saffron/45"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-serif text-2xl text-foreground xl:text-3xl">{row.title}</h3>
          <p className="text-muted-foreground md:col-start-2 xl:col-start-auto">{row.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
