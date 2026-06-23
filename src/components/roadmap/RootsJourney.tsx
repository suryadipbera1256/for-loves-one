"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import type { TimelineEvent } from "@/lib/constants";
import { ChapterCard } from "./ChapterCard";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

type Pt = { x: number; y: number };

/** Catmull-Rom → cubic-bézier: turns sampled points into one smooth path. */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(
      1
    )} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

type Geo = {
  w: number;
  h: number;
  mobile: boolean;
  mainPath: string;
  /** x of the main root at a given y (used as each branch's origin). */
  branches: { d: string; end: Pt }[];
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export function RootsJourney({ chapters }: { chapters: TimelineEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainPathRef = useRef<SVGPathElement>(null);

  const reduce = useReducedMotion();
  const [geo, setGeo] = useState<Geo | null>(null);
  const [active, setActive] = useState<boolean[]>(() =>
    chapters.map(() => false)
  );

  /* ---- scroll-driven "neon bloom" growth down the main root ---- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const bloom = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  /* ---- traveling glowing head that rides the tip of the bloom ---- */
  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const headOpacity = useMotionValue(0);
  const lenRef = useRef(0);

  useEffect(() => {
    // measure path length whenever the geometry changes
    const p = mainPathRef.current;
    if (p) lenRef.current = p.getTotalLength();
  }, [geo?.mainPath]);

  useMotionValueEvent(bloom, "change", (v) => {
    const p = mainPathRef.current;
    if (!p || !lenRef.current) return;
    const pt = p.getPointAtLength(Math.min(v, 0.999) * lenRef.current);
    headX.set(pt.x);
    headY.set(pt.y);
    headOpacity.set(v > 0.01 && v < 0.99 ? 1 : 0);
  });

  /* ---- measure section + node positions, build all paths ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      const sr = section.getBoundingClientRect();
      const W = sr.width;
      const H = section.scrollHeight;
      const mobile = W < 768;

      // Main root spine: gentle winding column.
      const railX = mobile ? Math.max(24, W * 0.08) : W / 2;
      const amp = mobile ? 12 : Math.min(Math.max(W * 0.05, 26), 90);
      const waves = 5;
      const rootX = (y: number) =>
        railX + amp * Math.sin((y / H) * Math.PI * waves);

      const pts: Pt[] = [];
      const step = Math.max(20, H / 60);
      for (let y = 0; y <= H; y += step) pts.push({ x: rootX(y), y });
      pts.push({ x: rootX(H), y: H });
      const mainPath = smoothPath(pts);

      // One auto-generated child branch per node, from the spine to the card.
      const branches = nodeRefs.current.map((el, i) => {
        if (!el) return { d: "", end: { x: 0, y: 0 } };
        const nr = el.getBoundingClientRect();
        const top = nr.top - sr.top + section.scrollTop;
        const cy = top + nr.height / 2;
        const leftCard = !mobile && i % 2 === 0;
        // inner edge of the card (the side facing the spine)
        const endX = mobile
          ? nr.left - sr.left + 6
          : leftCard
          ? nr.right - sr.left - 6
          : nr.left - sr.left + 6;
        const sx = rootX(cy);
        const end = { x: endX, y: cy };
        const dx = end.x - sx;
        // organic S-curve with a slight vertical dip
        const c1 = { x: sx + dx * 0.32, y: cy + 26 };
        const c2 = { x: sx + dx * 0.7, y: cy - 26 };
        const d = `M ${sx.toFixed(1)},${cy.toFixed(1)} C ${c1.x.toFixed(
          1
        )},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(
          1
        )} ${end.x.toFixed(1)},${end.y.toFixed(1)}`;
        return { d, end };
      });

      setGeo({ w: W, h: H, mobile, mainPath, branches });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    // fonts/images can shift layout after first paint
    const t = setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [chapters.length]);

  /* ---- intersection state drives card + branch + node glow ---- */
  useEffect(() => {
    const observers = nodeRefs.current.map((el, i) => {
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) =>
          setActive((prev) => {
            if (prev[i] === entry.isIntersecting) return prev;
            const next = [...prev];
            next[i] = entry.isIntersecting;
            return next;
          }),
        { rootMargin: "-38% 0px -38% 0px", threshold: 0 }
      );
      o.observe(el);
      return o;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [chapters.length]);

  const viewBox = useMemo(
    () => (geo ? `0 0 ${geo.w} ${geo.h}` : "0 0 100 100"),
    [geo]
  );

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-black">
      {/* Ambient sprawling roots texture (static asset, GPU-cheap) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] mix-blend-screen"
        style={{
          backgroundImage: "url('/image/roots.svg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      />
      {/* Depth: soil vignette + faint cyan bloom from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(6,182,212,0.12), transparent 55%), radial-gradient(100% 100% at 50% 100%, rgba(0,0,0,0.9), transparent 60%)",
        }}
      />

      {/* DYNAMIC ROOT SYSTEM — measured overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={viewBox}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="rootCore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="branchCore" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ecfeff" stopOpacity="1" />
            <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {geo && (
          <>
            {/* faint static track for the spine */}
            <path
              d={geo.mainPath}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={geo.mobile ? 4 : 6}
              strokeLinecap="round"
            />
            {/* animated glowing core that grows with scroll */}
            <motion.path
              ref={mainPathRef}
              d={geo.mainPath}
              fill="none"
              stroke="url(#rootCore)"
              strokeWidth={geo.mobile ? 4 : 6}
              strokeLinecap="round"
              filter="url(#soft)"
              style={{ pathLength: reduce ? scrollYProgress : bloom }}
              className="drop-shadow-[0_0_16px_rgba(6,182,212,0.75)]"
            />

            {/* auto-generated child branches */}
            {geo.branches.map((br, i) => (
              <g key={i}>
                <path
                  d={br.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <motion.path
                  d={br.d}
                  fill="none"
                  stroke="url(#branchCore)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  filter="url(#soft)"
                  className="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  initial={false}
                  animate={{
                    pathLength: active[i] ? 1 : 0,
                    opacity: active[i] ? 1 : 0,
                  }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: "easeInOut" }}
                />
                {/* node junction that lights up at the card edge */}
                <motion.circle
                  cx={br.end.x}
                  cy={br.end.y}
                  r={6}
                  fill="#ecfeff"
                  filter="url(#soft)"
                  initial={false}
                  animate={{
                    opacity: active[i] ? 1 : 0,
                    scale: active[i] ? 1 : 0.4,
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  transition={{ duration: reduce ? 0 : 0.5 }}
                  className="drop-shadow-[0_0_12px_rgba(34,211,238,0.95)]"
                />
              </g>
            ))}

            {/* traveling neon-bloom head riding the tip */}
            {!reduce && (
              <motion.circle
                r={geo.mobile ? 9 : 13}
                fill="url(#headGlow)"
                cx={headX}
                cy={headY}
                style={{ opacity: headOpacity }}
              />
            )}
          </>
        )}
      </svg>

      {/* CHAPTER CARDS (normal flow) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-[22vh] pt-[14vh] md:pl-10 md:pr-24">
        {chapters.map((event, i) => {
          const leftCard = i % 2 === 0; // desktop alternation
          return (
            <div
              key={event.id}
              className={`flex ${
                leftCard ? "md:justify-start" : "md:justify-end"
              } justify-end`}
              style={{ marginTop: i === 0 ? 0 : "clamp(7rem, 14vh, 13rem)" }}
            >
              <div
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="w-[78%] md:w-[44%]"
              >
                <ChapterCard event={event} index={i} active={!!active[i]} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
