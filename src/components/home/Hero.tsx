"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { heroPhoto, TAGLINE } from "@/data/site";
import { homeCopy } from "@/data/pages";
import { Logo } from "@/components/ui/Logo";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  return (
    <section
      ref={ref}
      className="relative flex h-svh min-h-136 items-center justify-center overflow-hidden short:min-h-0"
    >
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-ink/45" />
      <div aria-hidden className="mist-layer" />
      <div aria-hidden className="mist-layer mist-layer--slow" />
      <div className="relative flex flex-col items-center px-5 pt-16 text-center">
        <Logo
          eager
          className="h-auto w-40 md:w-55 xl:w-65 short:w-24"
          sizes="(min-width: 1280px) 260px, (min-width: 768px) 220px, 160px"
        />
        <h1 className="mt-8 font-serif text-display text-mist short:mt-4">{TAGLINE}</h1>
      </div>
      <a
        href="#story-teaser"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.25em] text-mist/80 uppercase transition-colors hover:text-saffron"
      >
        {homeCopy.scrollHint}
        <ChevronDown className="size-5" aria-hidden />
      </a>
    </section>
  );
}
