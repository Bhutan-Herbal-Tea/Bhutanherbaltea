import { facts } from "@/data/site";
import { cn } from "@/lib/utils";

export function FactsBand({ label }: { label: string }) {
  return (
    <section aria-label={label} className="bg-forest text-mist dark:bg-card">
      <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-3 xl:grid-cols-5 xl:py-16">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={cn(
              "flex flex-col-reverse border-l border-mist/20 pl-5",
              index === facts.length - 1 && "col-span-2 md:col-span-1",
            )}
          >
            <dt className="mt-3 font-mono text-[0.68rem] tracking-[0.2em] text-mist/80 uppercase">{fact.label}</dt>
            <dd className="font-serif text-4xl md:text-5xl">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
