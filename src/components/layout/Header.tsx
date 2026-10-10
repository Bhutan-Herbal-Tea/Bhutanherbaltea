"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";

// Always solid: a transparent header cannot stay readable over photos in both themes.
export function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between xl:h-20">
        <Wordmark />
        <div className="flex items-center gap-1 xl:gap-8">
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex gap-10">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "py-2 text-sm tracking-wide transition-colors hover:text-foreground",
                        active
                          ? "text-foreground underline decoration-accent-mark decoration-2 underline-offset-10"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
