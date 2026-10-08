import Image from "next/image";
import type { Photo } from "@/data/site";

type PageHeroProps = { eyebrow?: string; title: string; intro?: string; image: Photo };

export function PageHero({ eyebrow, title, intro, image }: PageHeroProps) {
  return (
    <div className="relative flex h-[55svh] min-h-96 items-end overflow-hidden md:h-[60svh] xl:h-[65svh]">
      <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-ink/40" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink to-transparent" />
      <div className="container-page relative pb-10 md:pb-14 xl:pb-20">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-serif text-display text-mist">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lead text-mist/80">{intro}</p>}
      </div>
    </div>
  );
}
