"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ImageRevealProps = { children: ReactNode; className?: string };

// A slow, plain fade. The earlier diagonal clip-path wipe read like a page being turned.
// The noscript rule in layout.tsx shows [data-reveal] content without JS.
export function ImageReveal({ children, className }: ImageRevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal=""
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 1.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
