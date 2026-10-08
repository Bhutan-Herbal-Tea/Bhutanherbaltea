import Image from "next/image";
import logo from "../../../public/logo.png";
import { SITE_NAME } from "@/data/site";

type LogoProps = { className?: string; sizes: string; eager?: boolean };

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
