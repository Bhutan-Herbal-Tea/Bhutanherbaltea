import Image from "next/image";
import type { Photo } from "@/data/site";

type PageHeroProps = { title: string; intro?: string; image: Photo };

// Flat photo band. Text sits on the photo, so it is mist in both themes.
export function PageHero({ title, intro, image }: PageHeroProps) {
  return (
    <div className="relative flex h-[56svh] min-h-96 items-end overflow-hidden md:h-[58svh] xl:h-[64svh]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/35" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-ink/80 to-transparent" />
      <div className="container-page relative pb-12 md:pb-16 xl:pb-20">
        <h1 className="font-serif text-display text-mist">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lead text-mist/85">{intro}</p>}
      </div>
    </div>
  );
}
