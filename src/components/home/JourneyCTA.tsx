"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Particles } from "@/components/ambient/Particles";
import { MagneticButton } from "./MagneticButton";

/**
 * Closing gateway -- a quiet, glowing invitation to descend into the Roadmap
 * (the roots). Warm radial bloom, ambient motes, magnetic CTA.
 */
export function JourneyCTA() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative z-10 flex min-h-[90svh] items-center justify-center overflow-hidden bg-[var(--bg-void)] px-6 text-center">
      {/* warm bloom rising from the bottom -- the light of the roots below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] [background:radial-gradient(60%_100%_at_50%_120%,rgba(241,199,137,0.18),transparent_70%)]"
      />
      <Particles count={18} />

      <motion.div
        initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.45em] text-[var(--bloom-core)] md:text-xs">
          The journey awaits
        </p>
        <h2 className="font-handwriting text-4xl leading-[0.95] tracking-tight text-white md:text-7xl">
          Now, follow it<br />into the dark.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[13px] leading-relaxed text-[var(--text-hi)]/75 md:text-[15px]">
          The surface was only the beginning. Beneath it, every chapter of us has taken root — glowing, growing, waiting.
        </p>

        <div className="mt-10">
          <MagneticButton href="/roadmap" ariaLabel="Enter the roadmap" strength={24}>
            Enter the Roadmap
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover/mag:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}
