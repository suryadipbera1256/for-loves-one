"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { UI_SPRING } from "@/lib/motion";

/**
 * "View More Photos" -> /gallery?chapter=<id> (so the gallery can later filter
 * to this chapter). Magnetic hover: the button eases toward the cursor and a
 * warm bloom glow swells behind it.
 */
export function GalleryButton({ chapterId, active }: { chapterId: string; active: boolean }) {
  const reduce = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, UI_SPRING);
  const sy = useSpring(y, UI_SPRING);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: sx, y: sy }} className="relative inline-flex w-full md:w-auto">
      {/* bloom glow that swells on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-full bg-[var(--bloom-halo)] opacity-0 blur-xl transition-opacity duration-500 group-hover/btn:opacity-40"
      />
      <Link
        href={`/gallery?chapter=${chapterId}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label="View more photos from this chapter"
        className={`group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] outline-none backdrop-blur-md transition-all duration-500 focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)] md:w-auto md:justify-start md:py-2 ${
          active
            ? "border-[var(--bloom-core)]/50 bg-[var(--bloom-core)]/10 text-[var(--bloom-tip)]"
            : "border-white/15 bg-white/[0.04] text-[var(--text-hi)] hover:border-white/30"
        }`}
      >
        <span>View More Photos</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        >
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.div>
  );
}
