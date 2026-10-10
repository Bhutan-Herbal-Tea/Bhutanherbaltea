"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/data/site";
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
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "border-b-2 py-1 font-mono text-[0.72rem] tracking-[0.2em] uppercase transition-colors hover:text-foreground",
                        active
                          ? "border-forest font-medium text-foreground dark:border-saffron"
                          : "border-transparent text-muted-foreground",
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
