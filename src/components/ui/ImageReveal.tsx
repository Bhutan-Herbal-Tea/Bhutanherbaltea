"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Wipes an image in from the top-left corner along the flag's diagonal.
// The polygons share a vertex count so they interpolate; the noscript rule in layout.tsx clears the clip.
const HIDDEN = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)";
const SHOWN = "polygon(0% 0%, 200% 0%, 0% 200%, 0% 0%)";

type ImageRevealProps = { children: ReactNode; className?: string };

// The outer element is what the viewport observer watches: a fully clipped element
// has no visible area, so observing the clipped element itself never fires.
export function ImageReveal({ children, className }: ImageRevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
      <motion.div
        data-reveal=""
        variants={{ hidden: { clipPath: HIDDEN }, shown: { clipPath: SHOWN } }}
        transition={{ duration: reduce ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
