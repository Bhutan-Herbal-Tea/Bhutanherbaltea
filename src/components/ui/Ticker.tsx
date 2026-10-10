// Decorative: every item also appears as real content elsewhere on the page.
export function Ticker({ items }: { items: string[] }) {
  return (
    <div aria-hidden className="overflow-hidden border-y border-border bg-card py-3">
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item, index) => (
              <li
                key={`${copy}-${index}`}
                className="flex items-center font-mono text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase"
              >
                <span className="px-6">{item}</span>
                <span className="text-leaf">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
