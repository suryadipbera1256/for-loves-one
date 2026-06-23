"use client";

import { useMemo } from "react";

/**
 * A barely-visible film grain so dark sections never read as dead #000.
 * Pure CSS/SVG (feTurbulence) baked into a data URI -> zero runtime cost,
 * no network request. Fixed, non-interactive, decorative.
 */
export function GrainOverlay({ opacity = 0.035 }: { opacity?: number }) {
  const url = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
      <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{ backgroundImage: url, backgroundSize: "160px 160px", opacity }}
    />
  );
}
