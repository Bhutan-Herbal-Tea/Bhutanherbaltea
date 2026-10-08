export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-saffron focus:px-5 focus:py-3 focus:text-ink"
    >
      {label}
    </a>
  );
}
