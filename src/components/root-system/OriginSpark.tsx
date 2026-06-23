"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The "Symbol of Love" at the origin -- a softly glowing, gently beating heart
 * sitting at the peak of the black curve, right under the couple image. Every
 * root (trunk, connectors, capillaries) grows out from this exact point.
 * Kept subtle and ambient, never neon.
 */
export function OriginSpark() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
      {/* soft ambient halo */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(241,199,137,0.22), transparent 68%)" }}
        animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* expanding pulse ring on each beat */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--bloom-tip)]"
          animate={{ scale: [0.6, 2.1], opacity: [0.5, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {/* the heart */}
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        className="relative drop-shadow-[0_0_8px_rgba(241,199,137,0.5)]"
        animate={reduce ? undefined : { scale: [1, 1.16, 1, 1.16, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.3, 0.45, 1] }}
        aria-label="A glowing heart, the origin of the story"
      >
        <path
          d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.5 5c2 0 3.4 1.1 4.5 2.6C11.1 6.1 12.5 5 14.5 5 18 5 19.6 8.4 22 11.8 19.5 16.4 12 21 12 21z"
          fill="url(#heartGrad)"
        />
        <defs>
          <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bloom-tip)" />
            <stop offset="100%" stopColor="var(--bloom-mid)" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
