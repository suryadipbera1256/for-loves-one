"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChapterContent } from "../types";

type Lang = "en" | "bn";

/**
 * The back face of the flip card -- the "Story Vault". Holds the long-form
 * narrative ("Moral of the Story") in a fixed-height, gracefully scrollable
 * panel with premium typography (handwriting heading + drop cap), so the card's
 * compact footprint never grows no matter how long the story is.
 *
 * A minimal EN/BN language toggle sits beside the Back button; switching simply
 * cross-fades the text (no glow, no layout shift). The scroll area carries
 * `data-lenis-prevent` so the page's Lenis smooth-scroll yields while reading.
 */
export function StoryBack({
  chapter,
  active,
  onBack,
}: {
  chapter: ChapterContent;
  active: boolean;
  onBack: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [lang, setLang] = useState<Lang>("en");

  const raw = (chapter.story ? chapter.story[lang] : chapter.body).trim();
  const paragraphs = raw.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const seg = (l: Lang, label: string) => (
    <button
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      aria-label={l === "en" ? "Read in English" : "Read in Bengali"}
      className={cn(
        "rounded-full px-3 py-1.5 transition-colors duration-300",
        lang === l ? "bg-white/15 text-[var(--text-hi)]" : "text-[var(--text-lo)] hover:text-[var(--text-hi)]"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col p-5 md:p-6">
      {/* header (wraps gracefully on narrow cards) */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-[0.3em]",
              active ? "text-[var(--bloom-core)]" : "text-[var(--text-lo)]"
            )}
          >
            {chapter.id}
          </span>
          <span className="font-handwriting text-xl leading-none text-[var(--text-hi)] md:text-3xl">
            The Story
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* minimal language toggle -- no glow */}
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] p-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md">
            {seg("en", "EN")}
            {seg("bn", "বাং")}
          </div>

          <button
            type="button"
            onClick={onBack}
            aria-label="Flip back to photos"
            className="group/back inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-hi)] outline-none backdrop-blur-md transition-colors duration-300 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover/back:-translate-x-0.5">
              <path d="M10 19 3 12l7-7M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* hairline */}
      <div
        className={cn(
          "mb-3 h-px w-full transition-colors duration-700",
          active ? "bg-[var(--bloom-core)]/40" : "bg-white/10"
        )}
      />

      {/* scrollable narrative -- cross-fades on language switch */}
      <div
        data-lenis-prevent
        className="story-scroll min-h-0 flex-1 overflow-y-auto pr-3 [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_4%,#000_96%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_4%,#000_96%,transparent)]"
      >
        <motion.div
          key={lang}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={cn(
                "text-[13.5px] leading-relaxed text-[var(--text-hi)]/90 md:text-[15px]",
                i > 0 && "mt-3.5",
                i === 0 &&
                  "first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-handwriting first-letter:text-5xl first-letter:leading-[0.7] first-letter:text-[var(--bloom-core)]"
              )}
            >
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
