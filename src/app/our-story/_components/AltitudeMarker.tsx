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
      {/* Desktop: thin bar on the right edge with level ticks, like a survey staff. */}
      <div className="pointer-events-none fixed top-1/2 right-6 z-30 hidden h-[56vh] -translate-y-1/2 items-start gap-4 xl:flex">
        <motion.span className="-mt-3 border border-border bg-background/90 px-2.5 py-1 font-mono text-sm tracking-[0.15em] text-foreground tabular-nums">
          {label}
        </motion.span>
        <div className="relative h-full w-0.5 bg-foreground/15">
          <motion.div className="absolute inset-0 origin-bottom bg-linear-to-t from-bhutan to-saffron" style={{ scaleY: source }} />
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -left-1.5 h-px w-3.5 bg-foreground/40"
              style={{ bottom: `${tick}%` }}
            />
          ))}
        </div>
      </div>
      {/* Phone and tablet: line along the bottom edge, value in a tag. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 xl:hidden">
        <motion.span className="absolute right-4 bottom-3 border border-border bg-background/90 px-3 py-1 font-mono text-xs tracking-[0.15em] text-foreground tabular-nums">
          {label}
        </motion.span>
        <div className="h-1 w-full bg-foreground/10">
          <motion.div className="h-full origin-left bg-linear-to-r from-saffron to-bhutan" style={{ scaleX: source }} />
        </div>
      </div>
    </div>
  );
}
