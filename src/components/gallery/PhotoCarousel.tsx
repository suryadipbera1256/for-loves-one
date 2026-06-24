"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { CarouselCard } from "./CarouselCard";
import type { GalleryPhoto } from "./gallery.content";

/**
 * The fluid, app-style photo carousel.
 *
 *   - A single shared MotionValue `x` drives the whole track (GPU transform).
 *   - Native drag/flick: Framer's pointer drag + momentum (dragMomentum) gives
 *     slow-pan-when-slow, fast-flick-when-fast inertia, tuned via dragTransition.
 *   - Gentle ping-pong autoplay when idle (pauses on hover / drag / reduced-motion).
 *   - Each card reads `x` to compute its own depth -> zero re-renders while moving.
 *
 * Layout maths: with side padding = (viewport - card)/2 the first/last cards
 * centre exactly at x=0 and x=-(n-1)*step, so `activeIndex = round(-x/step)`.
 */
export function PhotoCarousel({
  items,
  onOpen,
  onActiveChange,
}: {
  items: GalleryPhoto[];
  onOpen: (item: GalleryPhoto) => void;
  onActiveChange?: (item: GalleryPhoto, index: number) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const x = useMotionValue(0);

  const pausedRef = useRef(false);
  const dirRef = useRef(-1);
  const movedRef = useRef(false);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  // measure viewport width
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setVw(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mobile = vw > 0 && vw < 768;
  const cardW = vw === 0 ? 320 : mobile ? Math.min(vw * 0.8, 340) : 360;
  const gap = mobile ? 16 : 28;
  const step = cardW + gap;
  const padSide = Math.max(0, (vw - cardW) / 2);
  // internal vertical room so the centred card (lift + focus scale) is never
  // clipped by the viewport's top/bottom. Symmetric -> layout stays centred.
  const vpad = mobile ? 26 : 34;
  const n = items.length;
  const maxDrag = Math.max(0, n * cardW + (n - 1) * gap + padSide * 2 - vw);

  // reset to the front whenever the arrangement changes
  useEffect(() => {
    x.set(0);
    activeRef.current = 0;
    setActive(0);
    onActiveChange?.(items[0], 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // track the centred card
  useMotionValueEvent(x, "change", (v) => {
    if (step <= 0) return;
    const idx = Math.min(n - 1, Math.max(0, Math.round(-v / step)));
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
      onActiveChange?.(items[idx], idx);
    }
  });

  // gentle ping-pong autoplay
  useAnimationFrame((_, delta) => {
    if (reduce || pausedRef.current || maxDrag <= 0) return;
    const speed = 0.024; // px per ms
    let nx = x.get() + dirRef.current * speed * delta;
    if (nx <= -maxDrag) {
      nx = -maxDrag;
      dirRef.current = 1;
    } else if (nx >= 0) {
      nx = 0;
      dirRef.current = -1;
    }
    x.set(nx);
  });

  const nudge = (d: number) => {
    pausedRef.current = true;
    const target = Math.min(0, Math.max(-maxDrag, Math.round((x.get() + d) / step) * step));
    animate(x, target, { type: "spring", stiffness: 260, damping: 32 });
    window.setTimeout(() => (pausedRef.current = false), 2500);
  };

  const progress = useTransform(x, [-Math.max(1, maxDrag), 0], ["100%", "0%"]);

  return (
    <div className="relative w-full">
      <div ref={viewportRef} className="relative w-full overflow-hidden [perspective:1400px]" style={{ touchAction: "pan-y" }}>
        <motion.div
          className="flex cursor-grab items-center active:cursor-grabbing select-none"
          style={{ x, gap, paddingLeft: padSide, paddingRight: padSide, paddingTop: vpad, paddingBottom: vpad }}
          drag={maxDrag > 0 ? "x" : false}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.14}
          dragTransition={{ power: 0.32, timeConstant: 340, restDelta: 0.5, bounceStiffness: 220, bounceDamping: 32 }}
          onDragStart={() => {
            pausedRef.current = true;
            movedRef.current = false;
          }}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > 6) movedRef.current = true;
          }}
          onDragEnd={() => {
            window.setTimeout(() => (pausedRef.current = false), 2600);
          }}
          onPointerEnter={() => (pausedRef.current = true)}
          onPointerLeave={() => (pausedRef.current = false)}
        >
          {items.map((item, i) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={i}
              step={step}
              cardW={cardW}
              x={x}
              onOpen={() => {
                if (!movedRef.current) onOpen(item);
              }}
            />
          ))}
        </motion.div>

        {/* edge fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--bg-void)] to-transparent md:w-28" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--bg-void)] to-transparent md:w-28" />
      </div>

      {/* controls + progress */}
      <div className="mx-auto mt-6 flex w-full max-w-md items-center gap-4 px-4">
        <button
          type="button"
          onClick={() => nudge(step)}
          aria-label="Previous"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[var(--text-hi)] backdrop-blur-md transition-colors hover:border-[var(--bloom-core)]/50 md:flex"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--bloom-mid)] to-[var(--bloom-tip)]" style={{ width: progress }} />
        </div>

        <span className="shrink-0 font-mono text-[11px] tabular-nums tracking-[0.2em] text-[var(--text-lo)]">
          {String(Math.min(active + 1, n)).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={() => nudge(-step)}
          aria-label="Next"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[var(--text-hi)] backdrop-blur-md transition-colors hover:border-[var(--bloom-core)]/50 md:flex"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
