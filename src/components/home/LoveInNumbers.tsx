"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { STATS, TOGETHER_SINCE, QUOTE, daysSince } from "./home.content";

function StatCard({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion() ?? false;
  const [display, setDisplay] = useState(0);
  const [target, setTarget] = useState(stat.daysSince ? 0 : stat.value);

  // live "days together" resolves on the client (avoids hydration mismatch)
  useEffect(() => {
    if (stat.daysSince) setTarget(daysSince(TOGETHER_SINCE));
  }, [stat.daysSince]);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors duration-500 hover:border-[var(--bloom-core)]/40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(241,199,137,0.12), transparent 70%)" }}
      />
      <div className="relative flex items-baseline gap-1">
        <span className="font-handwriting text-4xl leading-none text-[var(--bloom-tip)] md:text-5xl">
          {display.toLocaleString()}
        </span>
        {stat.suffix && <span className="font-handwriting text-2xl text-[var(--bloom-core)]">{stat.suffix}</span>}
      </div>
      <p className="relative mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--text-lo)] md:text-[11px]">
        {stat.label}
      </p>
    </motion.div>
  );
}

/**
 * "Love in Numbers" -- count-up stats (one live, from the anniversary date) in
 * glass cards, capped by the story's thesis quote.
 */
export function LoveInNumbers() {
  return (
    <section className="relative z-10 bg-[var(--bg-void)] px-6 py-[16vh]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-[7vh] text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)] md:text-xs">
            Love in numbers
          </p>
          <h2 className="font-handwriting text-3xl tracking-wide text-white md:text-5xl">Measured in moments</h2>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-[10vh] max-w-3xl text-center font-handwriting text-xl leading-snug text-[var(--text-hi)]/90 md:text-3xl"
        >
          “{QUOTE}”
        </motion.blockquote>
      </div>
    </section>
  );
}
