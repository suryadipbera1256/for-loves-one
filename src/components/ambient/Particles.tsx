"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

type Spore = {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  opacity: number;
};

/** Module-level (pure) so no mutable state lives inside a render. */
function generateSpores(count: number): Spore[] {
  // deterministic pseudo-random so SSR and client agree (no hydration drift)
  let s = 9173;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    left: `${(rnd() * 100).toFixed(2)}%`,
    top: `${(rnd() * 100).toFixed(2)}%`,
    size: 1 + rnd() * 2.5,
    duration: 14 + rnd() * 16,
    delay: -rnd() * 20,
    dx: (rnd() - 0.5) * 60,
    dy: -(80 + rnd() * 160),
    opacity: 0.12 + rnd() * 0.28,
  }));
}

/**
 * Slow floating spore/dust motes drifting across the dark sections.
 * GPU-only (transform + opacity via the .spore keyframes in globals.css),
 * positions memoized so they never recompute on re-render.
 * Skipped entirely under prefers-reduced-motion.
 */
export function Particles({ count = 26 }: { count?: number }) {
  const reduce = useReducedMotion();
  const spores = useMemo(() => generateSpores(count), [count]);

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {spores.map((p, i) => (
        <span
          key={i}
          className="spore absolute rounded-full bg-[var(--bloom-tip)]"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px var(--bloom-core)",
              "--spore-duration": `${p.duration}s`,
              "--spore-dx": `${p.dx}px`,
              "--spore-dy": `${p.dy}px`,
              "--spore-opacity": p.opacity,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
