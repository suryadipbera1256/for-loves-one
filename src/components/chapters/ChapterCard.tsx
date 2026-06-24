"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SOFT_SPRING } from "@/lib/motion";
import type { ChapterContent } from "./types";
import { PhotoArray } from "./card/PhotoArray";
import { GalleryButton } from "./card/GalleryButton";
import { StoryBack } from "./card/StoryBack";

/**
 * The premium Chapter node -- a 3D glass FLIP card, harmonised with the
 * subterranean root theme.
 *
 *   FRONT  triple-photo array (holographic 3D-tilt) + title + actions
 *   BACK   the "Story Vault": a scrollable long-form narrative
 *
 * "Read Story" flips the whole card in 3D; the back scrolls internally so the
 * card's footprint never grows. Glassmorphism throughout, and the whole card
 * blooms warm when `active` (the roots have physically connected to it).
 *
 * Contract preserved exactly: `{ chapter, active, side }`. The card keeps a
 * fixed height so the RootSystem's measured docking points stay stable.
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
  const [flipped, setFlipped] = useState(false);

  // shared glass + bloom skin for both faces
  const face = (extra?: string) =>
    cn(
      // sharper, lighter blur on mobile (razor-sharp on high-DPI + faster); richer on desktop
      "absolute inset-0 overflow-hidden rounded-[1.75rem] border bg-white/[0.05] backdrop-blur-xl md:backdrop-blur-2xl",
      "transition-[box-shadow,border-color,background-color] duration-700 ease-out",
      "[backface-visibility:hidden] [transform:translateZ(0)]",
      active
        ? "border-[var(--bloom-core)]/45 bg-white/[0.07] shadow-[0_0_14px_-9px_var(--bloom-halo)]"
        : "border-white/10 shadow-[0_22px_60px_-32px_rgba(0,0,0,0.9)]",
      extra
    );

  // glassy overlays shared by both faces (sheen + hairline + bloom wash)
  const Overlays = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 26%, transparent 72%, rgba(255,255,255,0.04) 100%)",
        }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-700",
          active ? "via-[var(--bloom-tip)] opacity-90" : "via-white/40 opacity-30"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-700",
          active ? "opacity-100" : "opacity-0"
        )}
        style={{ background: "linear-gradient(150deg, rgba(241,199,137,0.10), transparent 60%)" }}
      />
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={SOFT_SPRING}
      style={{ perspective: 1800 }}
    >
      <motion.div
        className="relative h-[32rem] w-full will-change-transform [transform-style:preserve-3d] md:h-[33rem]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
      >
        {/* ---------------- FRONT ---------------- */}
        <div className={face(flipped ? "pointer-events-none" : "")}>
          {Overlays}
          <div className="relative flex h-full flex-col p-4 md:p-5">
            {/* eyebrow */}
            <div className="mb-3 flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-700",
                  active
                    ? "bg-[var(--bloom-tip)] font-bold text-[#2a1d08] shadow-[0_0_6px_-1px_rgba(241,199,137,0.3)]"
                    : "border border-white/10 bg-black/40 text-[var(--text-lo)]"
                )}
              >
                {chapter.id} · {chapter.kicker}
              </span>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-700",
                  active ? "bg-[var(--bloom-tip)] shadow-[0_0_4px_rgba(241,199,137,0.35)]" : "bg-white/20"
                )}
              />
            </div>

            {/* triple-photo array */}
            <PhotoArray chapter={chapter} side={side} active={active} />

            {/* title + teaser */}
            <h3
              className={cn(
                "mt-4 font-handwriting text-3xl leading-tight tracking-wide transition-colors duration-700 md:text-4xl",
                active ? "text-white drop-shadow-[0_0_4px_rgba(241,199,137,0.3)]" : "text-[var(--text-hi)]"
              )}
            >
              {chapter.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--text-lo)] md:text-sm">
              {chapter.body}
            </p>

            {/* actions pinned to the bottom -- stacked + full-width on mobile for easy taps */}
            <div className="mt-auto flex flex-col gap-2.5 pt-4 md:flex-row md:items-center md:justify-between md:gap-3">
              <button
                type="button"
                onClick={() => setFlipped(true)}
                aria-label="Read the full story"
                className={cn(
                  "group/read inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)] md:w-auto md:justify-start md:py-2",
                  active
                    ? "bg-[var(--bloom-core)] text-[#2a1d08] shadow-[0_0_9px_-5px_var(--bloom-halo)] hover:brightness-110"
                    : "bg-white/10 text-[var(--text-hi)] hover:bg-white/15"
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5A1.5 1.5 0 0 0 20 18.5z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
                Read Story
              </button>

              <GalleryButton chapterId={chapter.id} active={active} />
            </div>
          </div>
        </div>

        {/* ---------------- BACK ---------------- */}
        <div className={face("[transform:rotateY(180deg)]" + (flipped ? "" : " pointer-events-none"))}>
          {Overlays}
          <div className="relative h-full">
            <StoryBack chapter={chapter} active={active} onBack={() => setFlipped(false)} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
