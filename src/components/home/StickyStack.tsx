"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Frame } from "./Frame";
import { STACK } from "./home.content";

/**
 * Sticky "card-deck" stacking. Each panel pins to the top with an increasing
 * offset (so the cards behind peek through), and as the next panel scrolls over
 * it the covered card scales down and dims slightly -- the trending stacked-cards
 * effect, done with pure scroll-linked transforms.
 */
function Panel({
  panel,
  index,
  total,
}: {
  panel: (typeof STACK)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.5]);
  const isLast = index === total - 1;

  return (
    <div
      ref={ref}
      className="sticky px-4"
      style={{ top: `calc(7vh + ${index * 1.6}rem)` }}
    >
      <motion.article
        style={reduce ? undefined : { scale }}
        className="relative mx-auto grid h-[72vh] max-h-[660px] w-full max-w-4xl origin-top grid-rows-[auto] overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.04] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur-2xl md:grid-cols-2"
      >
        {/* media side (gradient/photo) */}
        <div className="relative min-h-[34%] md:min-h-0">
          <Frame
            src={panel.image}
            accent={panel.accent}
            index={index}
            alt={panel.title}
            className="absolute inset-2 rounded-[1.4rem] md:inset-3"
            sizes="(max-width: 768px) 92vw, 42vw"
          />
        </div>

        {/* text side */}
        <div className="relative flex flex-col justify-center gap-4 p-7 md:p-12">
          <div className="flex items-center gap-3">
            <span className="font-handwriting text-4xl leading-none text-[var(--bloom-core)] md:text-5xl">
              {panel.numeral}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--text-lo)] md:text-[11px]">
              {panel.kicker}
            </span>
          </div>

          <h2 className="font-handwriting text-3xl leading-tight tracking-wide text-white md:text-4xl">
            {panel.title}
          </h2>
          <p className="max-w-md text-[13px] leading-relaxed text-[var(--text-hi)]/80 md:text-[15px]">
            {panel.body}
          </p>

          {isLast && (
            <span className="mt-2 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--bloom-core)]">
              continued below the surface
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>

        {/* dimming wash as this card gets covered */}
        {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[var(--bg-void)]" style={{ opacity: dim }} />}
      </motion.article>
    </div>
  );
}

export function StickyStack() {
  return (
    <section className="relative z-10 bg-[var(--bg-void)] pb-[12vh] pt-[14vh]">
      <header className="mx-auto mb-[8vh] max-w-5xl px-6 text-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)] md:text-xs">
          Three movements
        </p>
        <h2 className="font-handwriting text-3xl tracking-wide text-white md:text-5xl">How the surface became forever</h2>
      </header>

      <div className="flex flex-col gap-[12vh]">
        {STACK.map((panel, i) => (
          <Panel key={panel.id} panel={panel} index={i} total={STACK.length} />
        ))}
      </div>
    </section>
  );
}
