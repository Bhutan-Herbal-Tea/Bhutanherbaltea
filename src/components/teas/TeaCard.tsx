import Image from "next/image";
import Link from "next/link";
import type { Tea } from "@/data/teas";
import { teaDetailCopy } from "@/data/pages";
import { ImageReveal } from "@/components/ui/ImageReveal";

type TeaCardProps = { tea: Tea; sizes: string };

export function TeaCard({ tea, sizes }: TeaCardProps) {
  return (
    <Link href={`/teas/${tea.slug}`} className="group block">
      <ImageReveal>
        <div className="notch relative aspect-4/5 overflow-hidden bg-card">
          <Image
            src={tea.image}
            alt={`${tea.name} ${teaDetailCopy.imageAltSuffix}`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      </ImageReveal>
      <h3 className="mt-5 font-serif text-2xl text-foreground decoration-accent-mark decoration-2 underline-offset-8 group-hover:underline md:text-[1.75rem]">
        {tea.name}
      </h3>
      <p className="mt-2 text-muted-foreground">{tea.shortDescription}</p>
    </Link>
  );
}
