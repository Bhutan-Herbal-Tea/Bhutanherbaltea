import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  tone?: "default" | "photo";
  className?: string;
};

// Secondary action in the specimen-label style: mono, uppercase, bottom rule.
export function ArrowLink({ href, children, tone = "default", className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 border-b pb-1 font-mono text-[0.72rem] tracking-[0.2em] uppercase transition-colors",
        tone === "photo"
          ? "border-saffron text-mist hover:text-saffron focus-visible:outline-saffron"
          : "border-forest/40 text-foreground hover:border-forest hover:text-forest dark:border-saffron/50 dark:hover:border-saffron dark:hover:text-saffron",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
