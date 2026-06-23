"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { TimelineEvent } from "@/lib/constants";

/**
 * A single glassmorphic memory card.
 * `active` is driven by the parent (intersection state) so the card glow,
 * the connecting branch and the root node light up in perfect sync — and
 * dim again on reverse scroll.
 */
export function ChapterCard({
  event,
  index,
  active,
}: {
  event: TimelineEvent;
  index: number;
  active: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const [a, b] = event.accent ?? ["#0e7490", "#0a0a0a"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ type: "spring", stiffness: 60, damping: 18 }}
      className={`group relative overflow-hidden rounded-[1.6rem] border backdrop-blur-2xl
        transition-[transform,box-shadow,border-color,background-color] duration-700 ease-out
        ${
          active
            ? "scale-[1.015] border-cyan-300/70 bg-white/[0.09] shadow-[0_0_42px_-4px_rgba(6,182,212,0.55)]"
            : "scale-100 border-white/10 bg-white/[0.035] shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)]"
        }`}
    >
      {/* Active inner bloom wash */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-transparent to-sky-600/10 transition-opacity duration-700 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Thin top hairline that brightens when active */}
      <div
        className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent transition-opacity duration-700 ${
          active ? "opacity-90" : "opacity-20"
        }`}
      />

      {/* Media */}
      <div className="relative m-2 mb-0 h-56 overflow-hidden rounded-[1.2rem] md:h-64">
        {/* Gradient fallback — always rendered underneath the photo */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
          }}
          aria-hidden
        >
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_45%)]" />
        </div>

        {!imgFailed && (
          <Image
            src={event.mediaUrl}
            alt={event.title}
            fill
            onError={() => setImgFailed(true)}
            sizes="(max-width: 768px) 90vw, 45vw"
            className={`object-cover transition-transform duration-[1200ms] ease-out ${
              active ? "scale-105" : "scale-100"
            }`}
          />
        )}

        <div
          className={`absolute inset-0 transition-colors duration-700 ${
            active
              ? "bg-gradient-to-t from-black/90 via-black/30 to-transparent"
              : "bg-gradient-to-t from-black/85 via-black/45 to-black/10"
          }`}
        />

        <div className="absolute inset-x-5 bottom-5">
          {event.kicker && (
            <span
              className={`mb-2 inline-block rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-700 ${
                active
                  ? "bg-cyan-300 font-bold text-cyan-950 shadow-[0_0_18px_rgba(6,182,212,0.75)]"
                  : "border border-white/10 bg-black/50 text-neutral-400"
              }`}
            >
              {event.kicker}
            </span>
          )}
          <h3
            className={`font-handwriting text-3xl leading-tight tracking-wide transition-all duration-700 md:text-4xl ${
              active
                ? "text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.55)]"
                : "text-neutral-300"
            }`}
          >
            {event.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 pt-4">
        <p
          className={`text-sm leading-relaxed transition-colors duration-700 md:text-[15px] ${
            active ? "text-neutral-100" : "text-neutral-400"
          }`}
        >
          {event.description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-all duration-700 ${
              active ? "bg-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.9)]" : "bg-white/20"
            }`}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            {String(index + 1).padStart(2, "0")} / Memory
          </span>
        </div>
      </div>
    </motion.article>
  );
}
