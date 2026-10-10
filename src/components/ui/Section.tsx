import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section"> & { bleed?: boolean };

export function Section({ className, bleed = false, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-20 md:py-28 xl:py-36", className)} {...props}>
      {bleed ? children : <div className="container-page">{children}</div>}
    </section>
  );
}
