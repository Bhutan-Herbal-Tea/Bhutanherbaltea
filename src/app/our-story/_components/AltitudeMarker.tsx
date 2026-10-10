"use client";

import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { altitudeAt, formatAltitude } from "@/lib/altitude";

type AltitudeMarkerProps = { progress: MotionValue<number>; summit: number };

const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

// Decorative: the altitude fact (2,750 m) is stated in the page text, so this is aria-hidden.
export function AltitudeMarker({ progress, summit }: AltitudeMarkerProps) {
  const reduce = useReducedMotion();
  const smooth = useSpring(progress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const source = reduce ? progress : smooth;
  const label = useTransform(source, (p) => formatAltitude(altitudeAt(p, summit)));

  return (
    <div aria-hidden>
      {/* Desktop: thin bar on the right edge with flag-angled ticks. */}
      <div className="pointer-events-none fixed top-1/2 right-6 z-30 hidden h-[56vh] -translate-y-1/2 items-start gap-4 xl:flex">
        <motion.span className="-mt-4 bg-background/85 px-2 py-1 font-serif text-2xl text-foreground tabular-nums">
          {label}
        </motion.span>
        <div className="relative h-full w-0.5 bg-foreground/15">
          <motion.div className="absolute inset-0 origin-bottom bg-linear-to-t from-bhutan to-saffron" style={{ scaleY: source }} />
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -left-1.5 h-px w-3.5 rotate-[-34deg] bg-foreground/40"
              style={{ bottom: `${tick}%` }}
            />
          ))}
        </div>
      </div>
      {/* Phone and tablet: line along the bottom edge, value in a tag. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 xl:hidden">
        <motion.span className="notch absolute right-4 bottom-3 bg-background/90 px-3 py-1 font-serif text-lg text-foreground tabular-nums">
          {label}
        </motion.span>
        <div className="h-1 w-full bg-foreground/10">
          <motion.div className="h-full origin-left bg-linear-to-r from-saffron to-bhutan" style={{ scaleX: source }} />
        </div>
      </div>
    </div>
  );
}
