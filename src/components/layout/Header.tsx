"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { nav } from "@/data/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500",
        solid ? "border-border bg-ink/95" : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between xl:h-20">
        <Wordmark />
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
                      "relative py-2 text-sm tracking-wide transition-colors hover:text-mist",
                      active
                        ? "text-mist after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-saffron"
                        : "text-mist/75",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <MobileMenu pathname={pathname} />
      </div>
    </header>
  );
}
