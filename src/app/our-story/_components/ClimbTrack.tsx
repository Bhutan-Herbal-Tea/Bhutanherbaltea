"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "framer-motion";
import { AltitudeMarker } from "./AltitudeMarker";

type ClimbTrackProps = { children: ReactNode; summit: number };

// Progress runs from the first stage reaching mid-screen (0) to the summit's end reaching the bottom (1).
export function ClimbTrack({ children, summit }: ClimbTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end end"] });
  return (
    <div ref={ref} className="relative">
      {children}
      <AltitudeMarker progress={scrollYProgress} summit={summit} />
    </div>
  );
}
