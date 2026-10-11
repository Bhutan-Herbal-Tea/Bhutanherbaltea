import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";
import { SITE_NAME } from "@/data/site";
import { cn } from "@/lib/utils";

// Logo badge beside the serif name. The badge is decorative here: the link's label names it.
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME}, home`}
      className={cn(
        // Smaller on narrow phones so it clears the theme and menu buttons (checked down to 320 px).
        "flex items-center gap-2 font-serif text-lg tracking-wide whitespace-nowrap text-foreground max-[359px]:gap-1.5 max-[359px]:text-base max-[359px]:tracking-normal sm:gap-2.5 sm:text-xl md:gap-3 md:text-2xl",
        className,
      )}
    >
      <Image
        src={logo}
        alt=""
        sizes="(min-width: 1280px) 52px, (min-width: 640px) 40px, 32px"
        className="h-auto w-8 max-[359px]:w-7 sm:w-10 xl:w-13"
      />
      {SITE_NAME}
    </Link>
  );
}
