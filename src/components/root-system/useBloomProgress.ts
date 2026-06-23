"use client";

import { useScroll, useSpring, type MotionValue } from "framer-motion";
import { SCROLL_SPRING } from "@/lib/motion";
import type { RefObject } from "react";

/**
 * Shared scroll hook: maps a section's scroll progress (0 -> 1) to a
 * spring-smoothed MotionValue so the bloom travels without jitter.
 */
export function useBloomProgress(ref: RefObject<HTMLElement | null>): {
  scrollYProgress: MotionValue<number>;
  bloom: MotionValue<number>;
} {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const bloom = useSpring(scrollYProgress, SCROLL_SPRING);
  return { scrollYProgress, bloom };
}
