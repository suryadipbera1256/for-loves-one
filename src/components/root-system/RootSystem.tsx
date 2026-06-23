"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MainRoot } from "./MainRoot";
import { Connectors } from "./Connectors";
import { OriginSpark } from "./OriginSpark";
import { Particles } from "@/components/ambient/Particles";
import { buildMain, buildCapillaries, buildConnectors, buildDecoys, type Pt } from "./geometry";
import type { ChapterModule } from "@/components/chapters";

type Built = {
  w: number;
  h: number;
  mobile: boolean;
  mainPath: string;
  capillaries: string[];
  decoys: string[];
  connectors: { paths: string[]; points: Pt[] }[];
};

/**
 * Master canvas. Everything grows from the origin heart at (w/2, 0):
 *   Level 1  one snake-walking trunk (pathLength) -- never touches the cards
 *   Level 2  per-chapter branches to DISTINCT points on each box (+ decoys
 *            that grow but never connect); bloom only once in view
 *   Level 3  a dense capillary fan
 * The trunk draws with pathLength; everything else is a static field revealed
 * by ONE scroll mask -> 20 chapters stay smooth. Draw finishes by ~78% scroll.
 */
export function RootSystem({ chapters }: { chapters: ChapterModule[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bloomPathRef = useRef<SVGPathElement>(null);
  const heightRef = useRef(0);

  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const drive = useTransform(scrollYProgress, [0, 0.78], [0, 1], { clamp: true });

  const [built, setBuilt] = useState<Built | null>(null);
  const [active, setActive] = useState<boolean[]>(() => chapters.map(() => false));

  const revealH = useTransform(drive, (v) => v * heightRef.current);

  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const headOpacity = useMotionValue(0);
  const lenRef = useRef(0);

  useEffect(() => {
    const p = bloomPathRef.current;
    if (p) lenRef.current = p.getTotalLength();
  }, [built?.mainPath]);

  useMotionValueEvent(drive, "change", (v) => {
    const p = bloomPathRef.current;
    if (!p || !lenRef.current) return;
    const pt = p.getPointAtLength(Math.min(v, 0.999) * lenRef.current);
    headX.set(pt.x);
    headY.set(pt.y);
    headOpacity.set(v > 0.015 && v < 0.99 ? 1 : 0);
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      const sr = section.getBoundingClientRect();
      const w = sr.width;
      const h = section.scrollHeight;
      if (!w || !h) return;
      heightRef.current = h;
      const mobile = w < 768;
      const originX = w / 2;
      const geo = buildMain(originX, w, h, mobile);
      const { layers } = buildCapillaries(originX, w, h, mobile);
      const decoys = buildDecoys(originX, w, h, mobile);

      const connectors = nodeRefs.current.map((el, i) => {
        if (!el) return { paths: [], points: [] as Pt[] };
        const nr = el.getBoundingClientRect();
        const top = nr.top - sr.top + section.scrollTop;
        const leftCard = !mobile && i % 2 === 0;
        const innerX = mobile
          ? nr.left - sr.left + 6
          : leftCard
          ? nr.right - sr.left - 6
          : nr.left - sr.left + 6;
        // 3-4 DISTINCT attach points spread down this box's inner edge
        const count = 3 + (i % 2);
        const points: Pt[] = Array.from({ length: count }, (_, k) => ({
          x: innerX,
          y: top + (nr.height * (k + 1)) / (count + 1),
        }));
        return { paths: buildConnectors(originX, points), points };
      });

      setBuilt({ w, h, mobile, mainPath: geo.mainPath, capillaries: layers, decoys, connectors });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    const t = setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [chapters.length]);

  useEffect(() => {
    const observers = nodeRefs.current.map((el, i) => {
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) =>
          setActive((prev) => {
            const on = entry.isIntersecting && entry.intersectionRatio >= 0.4;
            if (prev[i] === on) return prev;
            const next = [...prev];
            next[i] = on;
            return next;
          }),
        { threshold: [0, 0.4, 0.6, 1], rootMargin: "-8% 0px -8% 0px" }
      );
      o.observe(el);
      return o;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [chapters.length]);

  const viewBox = useMemo(() => (built ? `0 0 ${built.w} ${built.h}` : "0 0 100 100"), [built]);
  const connectorBases = useMemo(
    () => (built ? built.connectors.flatMap((c) => c.paths) : []),
    [built]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[var(--bg-void)]"
      style={{
        background:
          "radial-gradient(120% 42% at 50% 0%, rgba(241,199,137,0.05), transparent 55%), var(--bg-void)",
      }}
    >
      <Particles count={22} />
      <OriginSpark />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={viewBox}
        preserveAspectRatio="none"
        aria-hidden
        shapeRendering="optimizeSpeed"
      >
        <defs>
          <linearGradient id="rn-idle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--root-idle-from)" />
            <stop offset="100%" stopColor="var(--root-idle-to)" />
          </linearGradient>
          {/* trunk: dim earthy -> warm, low-key by default */}
          <linearGradient id="rn-trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3d2c" />
            <stop offset="70%" stopColor="#7a5f3a" />
            <stop offset="100%" stopColor="#9c763f" />
          </linearGradient>
          {/* soft warm Bloom (matches the canopy) */}
          <linearGradient id="rn-bloom" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--bloom-tip)" />
            <stop offset="50%" stopColor="var(--bloom-core)" />
            <stop offset="100%" stopColor="var(--bloom-mid)" />
          </linearGradient>
          <radialGradient id="rn-head" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6e6" stopOpacity="0.75" />
            <stop offset="45%" stopColor="var(--bloom-tip)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--bloom-core)" stopOpacity="0" />
          </radialGradient>
          <filter id="rn-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rn-soft-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
          <linearGradient id="rn-feather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="88%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          <mask id="rn-reveal" maskUnits="userSpaceOnUse">
            <motion.rect x="0" y="0" width={built?.w ?? 0} height={revealH} fill="url(#rn-feather)" />
          </mask>
        </defs>

        {built && (
          <>
            <MainRoot
              mainPath={built.mainPath}
              capillaries={built.capillaries}
              decoys={built.decoys}
              connectorBases={connectorBases}
              drive={drive}
              bloomPathRef={bloomPathRef}
              mobile={built.mobile}
              reduce={reduce}
            />

            {built.connectors.map((c, i) =>
              c.paths.length ? (
                <Connectors key={i} paths={c.paths} points={c.points} active={!!active[i]} reduce={reduce} />
              ) : null
            )}

            {!reduce && (
              <motion.circle
                r={built.mobile ? 6 : 9}
                fill="url(#rn-head)"
                cx={headX}
                cy={headY}
                style={{ opacity: headOpacity }}
              />
            )}
          </>
        )}
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-[24vh] pt-[18vh] md:pl-10 md:pr-24">
        {chapters.map((c, i) => {
          const leftCard = i % 2 === 0;
          const Comp = c.Component;
          return (
            <div
              key={c.id}
              className={`flex ${leftCard ? "md:justify-start" : "md:justify-end"} justify-end`}
              style={{ marginTop: i === 0 ? 0 : "clamp(6rem, 13vh, 12rem)" }}
            >
              <div
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="w-[80%] md:w-[44%]"
              >
                <Comp active={!!active[i]} side={leftCard ? "left" : "right"} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
