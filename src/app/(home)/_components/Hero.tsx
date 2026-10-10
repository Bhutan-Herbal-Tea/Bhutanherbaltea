"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { heroPhoto, TAGLINE } from "@/data/site";
import { homeCopy } from "@/data/pages";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const { subtext, ctaLabel } = homeCopy.hero;

  return (
    <section
      ref={ref}
      className="relative grid min-h-dvh pt-16 md:grid-cols-2 md:items-center xl:grid-cols-[5fr_7fr] xl:pt-20"
    >
      {/* Photo: a band with a slanted foot on phones, a flag-angled parallelogram from tablet up. */}
      <div className="slant-bottom relative h-[44svh] overflow-hidden short:h-[45svh] md:parallelogram md:order-2 md:h-full md:min-h-[calc(100dvh-4rem)] xl:min-h-[calc(100dvh-5rem)]">
        <motion.div className="absolute inset-0 scale-115" style={{ y }}>
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            fill
            preload
            sizes="(min-width: 1280px) 58vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-ink/15" />
        <div aria-hidden className="mist-layer" />
        <div aria-hidden className="mist-layer mist-layer--slow" />
      </div>

      <div className="container-page relative -mt-16 flex flex-col items-start pb-14 short:-mt-10 md:order-1 md:mt-0 md:py-16 xl:pl-16">
        {/* Left inset keeps the wider, tilted flag halo inside the page margin. */}
        <div className="relative ml-6 w-32 short:w-24 md:ml-8 md:w-44 xl:w-52">
          {/* Flag halo: Bhutan's flag proportions (3:2), tilted behind the round logo. */}
          <div
            aria-hidden
            className="flag-split notch absolute top-1/2 left-1/2 aspect-3/2 w-[135%] -translate-x-1/2 -translate-y-1/2 -rotate-6"
          />
          <Logo
            className="relative h-auto w-full"
            sizes="(min-width: 1280px) 208px, (min-width: 768px) 176px, 128px"
          />
        </div>
        <h1 className="mt-8 font-serif text-display text-foreground short:mt-6 md:mt-12">{TAGLINE}</h1>
        <p className="mt-5 max-w-md text-lead text-muted-foreground">{subtext}</p>
        <ButtonLink href="/our-story" className="mt-8">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
