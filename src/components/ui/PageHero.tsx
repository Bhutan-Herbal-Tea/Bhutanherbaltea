import Image from "next/image";
import type { Photo } from "@/data/site";

type PageHeroProps = { title: string; intro?: string; image: Photo };

// Text sits on the photo, so it is mist in both themes.
export function PageHero({ title, intro, image }: PageHeroProps) {
  return (
    <div className="slant-bottom relative flex h-[60svh] min-h-96 items-end overflow-hidden md:h-[62svh] xl:h-[68svh]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink/85 to-transparent" />
      <div className="container-page relative pb-[calc(var(--slant)+2.5rem)] xl:pb-[calc(var(--slant)+3.5rem)]">
        <h1 className="font-serif text-display text-mist">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lead text-mist/85">{intro}</p>}
      </div>
    </div>
  );
}
