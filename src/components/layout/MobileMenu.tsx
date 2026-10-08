"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HOME_NAV_LABEL, nav, SITE_NAME, TAGLINE } from "@/data/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

const items = [{ href: "/", label: HOME_NAV_LABEL }, ...nav];

// shadcn Sheet (Base UI Dialog) provides the focus trap, Escape to close,
// scroll lock and focus return to the trigger.
export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex size-11 items-center justify-center rounded-full text-mist transition-colors hover:bg-mist/10 xl:hidden"
      >
        <Menu className="size-6" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="inset-0 h-svh w-full gap-0 border-0 bg-ink p-0 text-mist motion-reduce:transition-none data-[side=right]:w-full data-[side=right]:sm:max-w-none"
      >
        <div className="container-page flex h-16 shrink-0 items-center justify-between">
          <SheetTitle className="font-serif text-xl text-mist md:text-2xl">{SITE_NAME}</SheetTitle>
          <SheetClose
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-mist/10"
          >
            <X className="size-6" aria-hidden />
          </SheetClose>
        </div>
        <nav aria-label="Main" className="container-page flex flex-1 flex-col justify-center">
          <ul className="space-y-1 md:space-y-3">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-2 font-serif text-4xl transition-colors md:text-6xl",
                      active ? "text-saffron" : "text-mist hover:text-saffron",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="container-page pb-10 font-serif text-xl text-mist/70 italic">{TAGLINE}</p>
      </SheetContent>
    </Sheet>
  );
}
