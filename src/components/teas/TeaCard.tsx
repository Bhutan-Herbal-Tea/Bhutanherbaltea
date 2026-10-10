import Image from "next/image";
import Link from "next/link";
import type { Tea } from "@/data/teas";
import { teaDetailCopy } from "@/data/pages";
import { ImageReveal } from "@/components/ui/ImageReveal";

// headingLevel keeps the outline valid: h3 under a section h2, h2 directly under the page h1.
type TeaCardProps = { tea: Tea; sizes: string; headingLevel?: 2 | 3 };

export function TeaCard({ tea, sizes, headingLevel = 3 }: TeaCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
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
      <Heading className="mt-5 font-serif text-2xl text-foreground decoration-accent-mark decoration-2 underline-offset-8 group-hover:underline md:text-[1.75rem]">
        {tea.name}
      </Heading>
      <p className="mt-2 text-muted-foreground">{tea.shortDescription}</p>
    </Link>
  );
}
