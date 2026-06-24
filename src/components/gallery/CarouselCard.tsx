"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "./gallery.content";

/**
 * One photo in the physics carousel. Its scale / depth / opacity / parallax all
 * derive from how far the card's centre sits from the viewport centre -- read
 * straight off the shared track MotionValue `x`, so there are zero React
 * re-renders while panning. The centred card lifts, sharpens and faces forward
 * (coverflow); neighbours recede and tilt.
 */
export function CarouselCard({
  item,
  index,
  step,
  cardW,
  x,
  onOpen,
}: {
  item: GalleryPhoto;
  index: number;
  step: number;
  cardW: number;
  x: MotionValue<number>;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const s = Math.max(1, step);

  // distance of this card's centre from the viewport centre (px). 0 = centred.
  const dist = useTransform(x, (v) => v + index * s);
  const scale = useTransform(dist, [-s, 0, s], [0.84, 1, 0.84]);
  const rotateY = useTransform(dist, [-s, 0, s], [9, 0, -9]);
  const opacity = useTransform(dist, [-1.7 * s, -0.55 * s, 0, 0.55 * s, 1.7 * s], [0.18, 0.8, 1, 0.8, 0.18]);
  const lift = useTransform(dist, [-s, 0, s], [16, -10, 16]);
  const imgX = useTransform(dist, [-s, s], ["14%", "-14%"]);

  const [a, b] = item.accent;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      style={{ width: cardW, scale, rotateY, opacity, y: lift }}
      whileTap={{ scale: 0.97 }}
      aria-label={`${item.title}, ${item.location}. Open photo`}
      className="group relative aspect-[3/4] shrink-0 overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/[0.04] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)]"
    >
      {/* gradient base + parallax image */}
      <motion.div style={{ x: imgX }} className="absolute inset-0 scale-[1.18]">
        <div className="absolute inset-0" style={{ background: `linear-gradient(140deg, ${a} 0%, ${b} 100%)` }}>
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.25),transparent_55%)]" />
        </div>
        {item.image && !failed && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            loading="lazy"
            onError={() => setFailed(true)}
            sizes="(max-width: 768px) 80vw, 360px"
            className="object-cover"
          />
        )}
      </motion.div>

      {/* legibility wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
      {/* glassy diagonal sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 32%, transparent 70%, rgba(255,255,255,0.05) 100%)" }}
      />

      {/* caption */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-left">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--text-hi)]/80 backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-handwriting text-2xl leading-tight text-white md:text-3xl">{item.title}</h3>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]">{item.location}</p>
      </div>

      {/* focus ring + expand hint on hover */}
      <div className={cn("pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset transition-colors duration-500", "ring-white/0 group-hover:ring-[var(--bloom-core)]/40")} />
      <span className="pointer-events-none absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[var(--text-hi)] opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9 3H3v6M15 21h6v-6M3 21l7-7M21 3l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </motion.button>
  );
}
