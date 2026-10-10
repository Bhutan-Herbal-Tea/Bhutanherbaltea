import type { Metadata } from "next";
import Image from "next/image";
import { notFoundCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: notFoundCopy.title };

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh items-center overflow-hidden py-28">
      <Image
        src={notFoundCopy.image.src}
        alt={notFoundCopy.image.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-ink/65" />
      <div className="container-page relative">
        <p className="eyebrow">{notFoundCopy.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-display text-mist">{notFoundCopy.heading}</h1>
        <p className="mt-6 max-w-xl text-lead text-mist/80">{notFoundCopy.body}</p>
        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          <ButtonLink href="/">{notFoundCopy.homeLabel}</ButtonLink>
          <ButtonLink href="/teas" variant="ink">
            {notFoundCopy.teasLabel}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
