import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/data/types";
import { cn } from "@/lib/utils";

type SpecimenPlateProps = {
  image: Photo;
  sizes: string;
  label?: string[];
  preload?: boolean;
  frameClassName?: string;
  imageClassName?: string;
  labelClassName?: string;
  className?: string;
  children?: ReactNode;
};

// A photo mounted on a herbarium sheet: paper mount, tape corners, monospace label of real data.
export function SpecimenPlate({
  image,
  sizes,
  label,
  preload = false,
  frameClassName = "aspect-4/5",
  imageClassName,
  labelClassName,
  className,
  children,
}: SpecimenPlateProps) {
  return (
    <figure className={cn("relative border border-border bg-card p-3 md:p-4", className)}>
      <div className="relative">
        <div className={cn("relative overflow-hidden", frameClassName)}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload={preload}
            sizes={sizes}
            className={cn("object-cover", imageClassName)}
          />
        </div>
        <span aria-hidden className="plate-tape plate-tape--tl" />
        <span aria-hidden className="plate-tape plate-tape--tr" />
        <span aria-hidden className="plate-tape plate-tape--bl" />
        <span aria-hidden className="plate-tape plate-tape--br" />
      </div>
      {label && label.length > 0 && (
        // One line per item, like a herbarium label; keeps neighbouring plates the same height.
        <figcaption
          className={cn("mt-3 font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground uppercase", labelClassName)}
        >
          {label.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </figcaption>
      )}
      {children}
    </figure>
  );
}
