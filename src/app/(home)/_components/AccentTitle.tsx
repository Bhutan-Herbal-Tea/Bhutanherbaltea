import type { AccentHeading } from "@/data/types";
import { cn } from "@/lib/utils";

type AccentTitleProps = {
  heading: AccentHeading;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  onPhoto?: boolean;
};

// Serif headline with one italic accent word, as in the reference site.
export function AccentTitle({ heading, as: Tag = "h2", id, className, onPhoto = false }: AccentTitleProps) {
  return (
    <Tag id={id} className={cn("font-serif", onPhoto ? "text-mist" : "text-foreground", className)}>
      {heading.lead}{" "}
      <em className={cn("pb-1 italic", onPhoto ? "text-saffron" : "text-forest dark:text-saffron")}>{heading.accent}</em>
      {heading.tail && <> {heading.tail}</>}
    </Tag>
  );
}
