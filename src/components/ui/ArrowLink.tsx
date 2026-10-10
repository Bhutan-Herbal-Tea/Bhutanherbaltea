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

export function ArrowLink({ href, children, tone = "default", className }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-medium underline decoration-2 underline-offset-8 transition-colors",
        tone === "photo"
          ? "text-mist decoration-saffron hover:text-saffron focus-visible:outline-saffron"
          : "text-accent-text decoration-accent-mark hover:decoration-bhutan",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
