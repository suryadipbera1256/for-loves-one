import type { Variants, Transition } from "framer-motion";

/**
 * Reusable spring configs + Framer variants so every component shares
 * one consistent motion language. Tuned for "liquid" premium feel:
 * gentle, slightly overshooting, never linear.
 */

/** Smooths scroll-linked MotionValues (bloom travel along the root). */
export const SCROLL_SPRING = {
  stiffness: 80,
  damping: 20,
  restDelta: 0.001,
} as const;

/** Springy micro-interactions (card tilt, hover lift). */
export const UI_SPRING: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 22,
  mass: 0.6,
};

/** Slow, soft reveal for sections entering the viewport. */
export const SOFT_SPRING: Transition = {
  type: "spring",
  stiffness: 60,
  damping: 18,
};

/** Card container: orchestrates the staggered reveal of its children. */
export const cardContainer: Variants = {
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...SOFT_SPRING,
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

/** Inner card elements: title -> divider -> body -> meta. */
export const cardChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

/** Branch / path self-draw helper (used with pathLength). */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } },
  },
};
