"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { CoupleTransition } from "./CoupleTransition";

/**
 * Light / bright "canopy" hero. The couple blends into the canopy, and the
 * section resolves into the black soil through a CURVED, BANDED wave edge
 * (not a flat line) -- the roots grow out of that band below.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] w-full flex-col items-center justify-start overflow-hidden pt-[12vh]"
      style={{
        background:
          "linear-gradient(to bottom, var(--canopy-hi) 0%, var(--canopy-lo) 46%, #d9cdb0 64%, var(--bg-void) 100%)",
      }}
    >
      {/* soft sun bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 40% at 50% 6%, rgba(255,255,255,0.9), transparent 60%), radial-gradient(45% 28% at 50% 0%, rgba(241,199,137,0.12), transparent 70%)",
        }}
      />

      {/* title */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-30 px-4 text-center"
      >
        <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.42em] text-neutral-600 md:text-sm">
          Roots of our Memories
        </p>
        <h1 className="font-handwriting text-6xl tracking-tight text-neutral-900 drop-shadow-sm md:text-8xl">
          Our Beautiful Journey
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm text-neutral-700 md:text-base">
          Scroll gently. Watch our story take root below the surface and bloom,
          chapter by chapter, with light.
        </p>
      </motion.div>

      {/* couple, blended into the canopy */}
      <CoupleTransition progress={scrollYProgress} />

      {/* CURVED, BANDED transition into the black soil */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[34vh] w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* upper soft band (warm highlight following the wave) */}
          <path
            d="M0,150 C 240,70 480,70 720,130 C 960,190 1200,150 1440,90 L1440,360 L0,360 Z"
            fill="#cdbf9f"
            opacity="0.55"
          />
          {/* mid band */}
          <path
            d="M0,196 C 240,120 480,120 720,178 C 960,236 1200,196 1440,140 L1440,360 L0,360 Z"
            fill="#6b6354"
            opacity="0.5"
          />
          {/* the black soil */}
          <path
            d="M0,236 C 240,164 480,164 720,220 C 960,276 1200,238 1440,184 L1440,360 L0,360 Z"
            fill="var(--bg-void)"
          />
          {/* faint cyan rim where light meets soil (subtle) */}
          <path
            d="M0,236 C 240,164 480,164 720,220 C 960,276 1200,238 1440,184"
            fill="none"
            stroke="var(--bloom-mid)"
            strokeWidth="1.5"
            opacity="0.18"
          />
        </svg>
      </div>
    </section>
  );
}
