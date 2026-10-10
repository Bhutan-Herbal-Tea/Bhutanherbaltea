import Image from "next/image";
import Link from "next/link";
import type { Tea } from "@/data/teas";
import { teaDetailCopy } from "@/data/pages";

type TeaCardProps = { tea: Tea; sizes: string };

export function TeaCard({ tea, sizes }: TeaCardProps) {
  return (
    <Link href={`/teas/${tea.slug}`} className="group block rounded-md">
      <div className="relative aspect-4/5 overflow-hidden rounded-md bg-card">
        <Image
          src={tea.image}
          alt={`${tea.name} ${teaDetailCopy.imageAltSuffix}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-5 font-serif text-2xl text-leaf md:text-[1.75rem]">{tea.name}</h3>
      <p className="mt-2 text-mist/75">{tea.shortDescription}</p>
    </Link>
  );
}
