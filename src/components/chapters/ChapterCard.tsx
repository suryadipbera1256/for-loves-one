"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cardContainer, cardChild, UI_SPRING } from "@/lib/motion";
import type { ChapterContent } from "./types";

/**
 * Shared, optimized glassmorphism card primitive used by every chapter module.
 * - backdrop-blur glass with a 1px gradient-highlight border
 * - cursor-follow 3D tilt (desktop, +/-6deg), springy
 * - staggered inner reveal: kicker -> title -> divider -> body -> meta
 * - cyan "Neon Bloom" active state (kept subtle), driven by `active`
 * - graceful gradient fallback when the photo is missing
 */
export function ChapterCard({
  chapter,
  active,
  side,
}: {
  chapter: ChapterContent;
  active: boolean;
  side: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);
  const [a, b] = chapter.accent;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), UI_SPRING);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), UI_SPRING);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="[transform-style:preserve-3d]">
      <motion.article
        variants={cardContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={reduce ? undefined : { scale: 1.02 }}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        tabIndex={0}
        aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
        className={`group relative overflow-hidden rounded-[1.6rem] border bg-white/[0.05] backdrop-blur-xl outline-none
          transition-[box-shadow,border-color,background-color] duration-700 ease-out
          focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)]
          ${
            active
              ? "border-[var(--bloom-core)]/30 bg-white/[0.07] shadow-[0_0_22px_-12px_var(--bloom-halo)]"
              : "border-white/10 shadow-[0_14px_44px_-34px_rgba(0,0,0,0.85)]"
          }`}
      >
        {/* specular sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.04) 100%)",
          }}
        />
        {/* top hairline highlight */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-700 ${
            active ? "via-[var(--bloom-tip)] opacity-90" : "via-white/40 opacity-30"
          }`}
        />
        {/* active inner bloom wash (cyan, subtle) */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(135deg, rgba(241,199,137,0.10), transparent 62%)" }}
        />

        {/* media */}
        <div className="relative m-2 mb-0 h-56 overflow-hidden rounded-[1.2rem] md:h-64">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)` }}
          >
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
          </div>
          {chapter.image && !imgFailed && (
            <Image
              src={chapter.image}
              alt={chapter.title}
              fill
              loading="lazy"
              onError={() => setImgFailed(true)}
              sizes="(max-width: 768px) 90vw, 45vw"
              className={`object-cover transition-transform duration-[1200ms] ease-out ${active ? "scale-105" : "scale-100"}`}
            />
          )}
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              active
                ? "bg-gradient-to-t from-black/90 via-black/25 to-transparent"
                : "bg-gradient-to-t from-black/85 via-black/45 to-black/10"
            }`}
          />
          <motion.div variants={cardChild} className="absolute inset-x-5 bottom-5">
            <span
              className={`mb-2 inline-block rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-700 ${
                active
                  ? "bg-[var(--bloom-tip)] font-bold text-[#2a1d08] shadow-[0_0_10px_rgba(241,199,137,0.45)]"
                  : "border border-white/10 bg-black/50 text-[var(--text-lo)]"
              }`}
            >
              Chapter {chapter.id} / {chapter.kicker}
            </span>
            <motion.h3
              variants={cardChild}
              className={`font-handwriting text-3xl leading-tight tracking-wide transition-colors duration-700 md:text-4xl ${
                active ? "text-white drop-shadow-[0_0_8px_rgba(241,199,137,0.40)]" : "text-[var(--text-hi)]"
              }`}
            >
              {chapter.title}
            </motion.h3>
          </motion.div>
        </div>

        {/* body */}
        <div className="px-6 pb-6 pt-4">
          <motion.div
            variants={cardChild}
            className={`mb-3 h-px w-full transition-colors duration-700 ${active ? "bg-[var(--bloom-core)]/40" : "bg-white/10"}`}
          />
          <motion.p
            variants={cardChild}
            className={`text-sm leading-relaxed transition-colors duration-700 md:text-[15px] ${active ? "text-[var(--text-hi)]" : "text-[var(--text-lo)]"}`}
          >
            {chapter.body}
          </motion.p>
          <motion.div variants={cardChild} className="mt-4 flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-700 ${active ? "bg-[var(--bloom-tip)] shadow-[0_0_8px_rgba(241,199,137,0.45)]" : "bg-white/20"}`}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]">
              {chapter.meta}
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]/60">
              {side}
            </span>
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}
