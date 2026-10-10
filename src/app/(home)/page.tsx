import { TAGLINE } from "@/data/site";

export default function HomePage() {
  return (
    <div className="container-page pt-32 pb-24">
      <h1 className="font-serif text-display text-foreground">{TAGLINE}</h1>
      <div className="mt-10 h-24 w-36 flag-split" />
    </div>
  );
}
