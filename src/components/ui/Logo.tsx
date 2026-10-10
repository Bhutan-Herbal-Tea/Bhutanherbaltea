import Image from "next/image";
import logo from "../../../public/logo.png";
import { SITE_NAME } from "@/data/site";

type LogoProps = { className?: string; sizes: string };

// No eager/preload: only each page's first photo is preloaded.
export function Logo({ className, sizes }: LogoProps) {
  return <Image src={logo} alt={`${SITE_NAME} logo`} sizes={sizes} className={className} />;
}
