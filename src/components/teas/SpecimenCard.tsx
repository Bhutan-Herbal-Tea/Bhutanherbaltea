import Link from "next/link";
import type { Tea } from "@/data/teas";
import { PLATE_PLACE } from "@/data/site";
import { SpecimenPlate } from "@/components/ui/SpecimenPlate";

// headingLevel keeps the outline valid: h3 under a section h2, h2 directly under the page h1.
type SpecimenCardProps = { tea: Tea; sizes: string; headingLevel?: 2 | 3 };

export function SpecimenCard({ tea, sizes, headingLevel = 3 }: SpecimenCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={`/teas/${tea.slug}`} className="group block">
      {/* Tablet columns are narrow enough to wrap a botanical name; reserving three
          label lines there keeps the tea names in a row level. */}
      <SpecimenPlate
        labelClassName="md:max-xl:min-h-[3lh]"
        image={{ src: tea.image, alt: tea.imageAlt }}
        sizes={sizes}
        label={[tea.botanical, PLATE_PLACE]}
        imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <Heading className="mt-5 font-serif text-2xl text-foreground transition-colors group-hover:text-forest md:text-[1.75rem] dark:group-hover:text-saffron">
        {tea.name}
      </Heading>
      <p className="mt-2 text-muted-foreground">{tea.shortDescription}</p>
    </Link>
  );
}
