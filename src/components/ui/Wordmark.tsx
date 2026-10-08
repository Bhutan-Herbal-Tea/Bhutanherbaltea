import Link from "next/link";
import { SITE_NAME } from "@/data/site";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME}, home`}
      className={cn("font-serif text-xl tracking-wide text-mist md:text-2xl", className)}
    >
      {SITE_NAME}
    </Link>
  );
}
