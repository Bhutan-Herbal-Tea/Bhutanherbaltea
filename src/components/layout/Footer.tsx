import Link from "next/link";
import { mainNav, SITE_NAME, TAGLINE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  // Fixed at build time (next.config.ts); every deploy rebuilds, so it stays current.
  const year = process.env.BUILD_YEAR;
  return (
    <footer className="border-t border-mist/15 bg-forest text-mist dark:border-border dark:bg-card">
      <div className="container-page grid gap-12 py-16 text-center md:grid-cols-2 md:gap-x-12 md:text-left xl:grid-cols-3 xl:py-20">
        <div className="flex flex-col items-center gap-5 md:row-span-2 md:items-start xl:row-span-1">
          <Logo className="h-auto w-28" sizes="112px" />
          <p className="font-serif text-2xl">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[0.72rem] tracking-[0.2em] text-mist/80 uppercase transition-colors hover:text-saffron focus-visible:outline-saffron"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-5 md:items-start">
          <SocialLinks tone="onDark" />
          <p className="font-mono text-[0.68rem] tracking-[0.2em] text-mist/70 uppercase">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
