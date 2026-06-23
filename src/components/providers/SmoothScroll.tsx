"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/**
 * App-wide buttery/inertia scrolling via Lenis.
 * Lenis drives the native scroll position, so Framer Motion's useScroll
 * keeps working unchanged. Disabled entirely when the user prefers
 * reduced motion (falls back to the browser's native scrolling).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09, // inertia: lower = smoother/heavier
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
