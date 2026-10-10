"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
};

// Fades content in as it enters the viewport. Use below the fold only:
// server HTML starts at opacity 0 (the <noscript> rule in layout.tsx covers no-JS visitors).
// MotionConfig reducedMotion="user" (MotionProvider) drops the lift for reduced-motion users.
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}
