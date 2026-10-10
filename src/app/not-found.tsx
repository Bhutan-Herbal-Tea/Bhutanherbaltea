import type { Metadata } from "next";
import Image from "next/image";
import { notFoundCopy } from "@/data/pages";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = { title: notFoundCopy.title };

export default function NotFound() {
  return (
    <div className="slant-bottom relative flex min-h-dvh items-center overflow-hidden pt-24 pb-[calc(var(--slant)+5rem)]">
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
        <p className="eyebrow text-saffron">{notFoundCopy.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-serif text-display text-mist">{notFoundCopy.heading}</h1>
        <p className="mt-6 max-w-xl text-lead text-mist/85">{notFoundCopy.body}</p>
        <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
          <ButtonLink href="/">{notFoundCopy.homeLabel}</ButtonLink>
          <ArrowLink href="/teas" tone="photo">
            {notFoundCopy.teasLabel}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}
