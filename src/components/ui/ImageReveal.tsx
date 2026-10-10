"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Wipes an image in from the top-left corner along the flag's diagonal.
// The polygons share a vertex count so they interpolate; the noscript rule in layout.tsx clears the clip.
const HIDDEN = "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)";
const SHOWN = "polygon(0% 0%, 200% 0%, 0% 200%, 0% 0%)";

type ImageRevealProps = { children: ReactNode; className?: string };

export function ImageReveal({ children, className }: ImageRevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ clipPath: HIDDEN }}
      whileInView={{ clipPath: SHOWN }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
