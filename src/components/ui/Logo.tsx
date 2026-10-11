import Image from "next/image";
import logo from "../../../public/logo.png";
import { SITE_NAME } from "@/data/site";

type LogoProps = { className?: string; sizes: string; eager?: boolean };

// Never preloaded: only each page's first photo is. `eager` skips lazy loading for a logo
// that is on the first screen (the home hero seal), so it doesn't pop in after the photo.
export function Logo({ className, sizes, eager = false }: LogoProps) {
  return (
    <Image
      src={logo}
      alt={`${SITE_NAME} logo`}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
