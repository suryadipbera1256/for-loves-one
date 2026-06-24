"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Particles } from "@/components/ambient/Particles";
import { MagneticButton } from "./MagneticButton";
import { HERO } from "./home.content";

/**
 * Cinematic opening. The header photo drifts + scales with scroll (parallax),
 * warm vignettes blend it into the void, and the title reveals line-by-line from
 * behind a mask on load. Everything is transform/opacity for buttery GPU motion.
 */
export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // load orchestration
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const lineMask = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14 } },
  };
  const line = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] } },
  };
  const rise = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-[var(--bg-void)]">
      {/* parallax photo */}
      <motion.div style={{ y: reduce ? 0 : imgY, scale: reduce ? 1 : imgScale }} className="absolute inset-0">
        <Image
          src={HERO.image}
          alt="The surface of our story"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* cinematic grade + blend into the void below */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_30%,rgba(6,5,4,0.55)_75%,var(--bg-void)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/20 to-transparent" />

      {/* crisp premium shimmer along the very top -- sharp specular sweep, no haze */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--bloom-tip)] to-transparent opacity-70" />
        <div className="shine-sweep absolute -top-4 left-0 h-16 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <Particles count={20} />

      {/* content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : fade }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-end px-6 pb-[16vh] text-center md:justify-center md:pb-0"
      >
        <motion.p
          variants={rise}
          className="mb-5 font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--bloom-core)] md:text-xs"
        >
          {HERO.kicker}
        </motion.p>

        <motion.h1 variants={lineMask} className="font-handwriting leading-[0.95] tracking-tight text-white">
          {HERO.lines.map((l, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span variants={line} className="block text-5xl md:text-7xl lg:text-8xl">
                {l}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={rise}
          className="mx-auto mt-6 max-w-lg text-[13px] leading-relaxed text-[var(--text-hi)]/75 md:text-[15px]"
        >
          {HERO.subtitle}
        </motion.p>

        <motion.div variants={rise} className="mt-9">
          <MagneticButton href="/roadmap" ariaLabel="Begin the descent into the roadmap">
            {HERO.cta}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover/mag:translate-y-0.5">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ opacity: fade }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[var(--bloom-tip)]"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
