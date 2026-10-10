import Link from "next/link";
import { nav, SITE_NAME, TAGLINE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  // Fixed at build time (next.config.ts); every deploy rebuilds, so it stays current.
  const year = process.env.BUILD_YEAR;
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-12 py-16 text-center md:grid-cols-2 md:gap-x-12 md:text-left xl:grid-cols-3 xl:py-20">
        <div className="flex flex-col items-center gap-5 md:row-span-2 md:items-start xl:row-span-1">
          <Logo className="h-auto w-32" sizes="128px" />
          <p className="font-serif text-2xl text-foreground">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-5 md:items-start">
          <SocialLinks />
          <p className="text-sm text-muted-foreground">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
