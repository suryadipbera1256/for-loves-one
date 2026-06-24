"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MainRoot, type BranchBase } from "./MainRoot";
import { Connectors } from "./Connectors";
import { Particles } from "@/components/ambient/Particles";
import { buildTrunkSystem, buildBranches, buildCapillaries, type Branches, type CardBox } from "./geometry";
import type { ChapterModule } from "@/components/chapters";

/**
 * Master canvas (the dark soil). A botanical root ecosystem grows from a textured
 * Root Crown at the soil surface down into "...to be continued":
 *
 *   Level 1    a tapered trunk that slithers down the centre
 *   Level 2    4-5 tapered, snaking connectors per chapter -> dock to the box
 *              (LEFT card -> top + right edge ; RIGHT card -> top + left edge)
 *   Level 2.5  tiny non-connecting rootlets sprouting off the connectors
 *   Level 3    a dense, dim capillary background that never connects
 *
 * GROWTH IS STRICTLY 1:1 WITH SCROLL. `drive` is a direct, non-spring transform
 * of scrollYProgress, and the reveal mask height is drive * sectionHeight. Pause
 * scrolling and growth freezes on the exact frame. A chapter blooms (and its card
 * lights) ONLY when the reveal has physically reached its docking points.
 */
export function RootSystem({ chapters }: { chapters: ChapterModule[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heightRef = useRef(0);

  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Scroll-driven growth front (pure function of scroll -> freezes on pause).
  // Canonical array transform: the front LEADS during the first ~20% of scroll
  // (so Chapters 1-3 connect/bloom mid-screen), then tracks the original p/0.9
  // line from ~0.2 onward, leaving Chapter 4+ timing effectively unchanged.
  const drive = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.9], [0, 0.12, 0.22, 1], {
    clamp: true,
  });
  const revealH = useTransform(drive, (v) => v * heightRef.current);

  type Built = {
    w: number;
    h: number;
    mobile: boolean;
    trunks: { id: string; fillPath: string; corePath: string }[];
    capillaries: string[];
    branches: Branches[];
    connectAt: number[]; // scroll-drive value at which each chapter connects
  };

  const [built, setBuilt] = useState<Built | null>(null);
  const [connected, setConnected] = useState<boolean[]>(() => chapters.map(() => false));

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
      // Mobile: run the trunk along a left "root rail" so the stacked cards (on
      // the right) never sit on top of the roots. Desktop keeps the centre trunk.
      const originX = mobile ? Math.max(34, w * 0.12) : w / 2;

      const { trunks, trunkForIndex } = buildTrunkSystem(originX, chapters.length, w, h, mobile);
      const { layers } = buildCapillaries(originX, w, h, mobile);

      const branches: Branches[] = [];
      const connectAt: number[] = [];
      nodeRefs.current.forEach((el, i) => {
        if (!el) {
          branches[i] = { ribbons: [], cores: [], points: [], subBranches: [] };
          connectAt[i] = 1;
          return;
        }
        const nr = el.getBoundingClientRect();
        const top = nr.top - sr.top + section.scrollTop;
        const leftEdge = nr.left - sr.left;
        const rightEdge = nr.right - sr.left;
        const side: "left" | "right" = !mobile && i % 2 === 0 ? "left" : "right";
        const card: CardBox = {
          topY: top,
          height: nr.height,
          innerX: side === "left" ? rightEdge - 4 : leftEdge + 4,
          centerX: (leftEdge + rightEdge) / 2,
          side,
        };
        const b = buildBranches(trunkForIndex(i), card, i, mobile);
        branches[i] = b;
        // Bloom on physical connection: when the growth front reaches this
        // chapter's deepest dock, i.e. the branch has fully snaked in and arrived.
        const maxDockY = b.points.reduce((m, p) => Math.max(m, p.y), top);
        connectAt[i] = Math.min(1, maxDockY / h);
      });

      setBuilt({
        w,
        h,
        mobile,
        trunks: trunks.map((t) => ({ id: t.id, fillPath: t.fillPath, corePath: t.corePath })),
        capillaries: layers,
        branches,
        connectAt,
      });
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

  // Bloom strictly on physical connection: connected[i] = drive >= connectAt[i].
  useEffect(() => {
    if (!built) return;
    const evaluate = (v: number) => {
      setConnected((prev) => {
        let changed = false;
        const next = prev.length === built.connectAt.length ? prev.slice() : built.connectAt.map(() => false);
        for (let i = 0; i < built.connectAt.length; i++) {
          const on = v >= built.connectAt[i];
          if (next[i] !== on) {
            next[i] = on;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };
    evaluate(drive.get());
    const unsub = drive.on("change", evaluate);
    return unsub;
  }, [built, drive]);

  const viewBox = useMemo(() => (built ? `0 0 ${built.w} ${built.h}` : "0 0 100 100"), [built]);
  const connectorRibbons = useMemo<BranchBase[]>(
    () => (built ? built.branches.flatMap((b) => b.ribbons.map((d) => ({ d }))) : []),
    [built]
  );
  const subBranches = useMemo<BranchBase[]>(
    () => (built ? built.branches.flatMap((b) => b.subBranches.map((d) => ({ d }))) : []),
    [built]
  );

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[var(--bg-void)]">
      <Particles count={22} />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={viewBox}
        preserveAspectRatio="none"
        aria-hidden
        shapeRendering="optimizeSpeed"
      >
        <defs>
          {/* dim idle (default unlit roots) */}
          <linearGradient id="rn-idle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--root-idle-from)" />
            <stop offset="100%" stopColor="var(--root-idle-to)" />
          </linearGradient>
          {/* woody trunk body */}
          <linearGradient id="rn-trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3d2c" />
            <stop offset="65%" stopColor="#7a5f3a" />
            <stop offset="100%" stopColor="#9c763f" />
          </linearGradient>
          {/* the warm Bloom -- only connected Level 2 roots use this */}
          <linearGradient id="rn-bloom" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--bloom-tip)" />
            <stop offset="50%" stopColor="var(--bloom-core)" />
            <stop offset="100%" stopColor="var(--bloom-mid)" />
          </linearGradient>
          {/* tight glow: small blur radius so the bloom reads sharp + contained */}
          <filter id="rn-glow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rn-soft-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
          {/* feathered tip so the scroll-reveal edge isn't a hard line */}
          <linearGradient id="rn-feather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="90%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
          {/* top emerge blend: dissolves the root tops into the Phase 1->2 gradient
              so roots grow organically out of the soil with no starting shape */}
          <linearGradient id="rn-emerge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-void)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--bg-void)" stopOpacity="0" />
          </linearGradient>
          <mask id="rn-reveal" maskUnits="userSpaceOnUse">
            <motion.rect x="0" y="0" width={built?.w ?? 0} height={revealH} fill="url(#rn-feather)" />
          </mask>
        </defs>

        {built && (
          <>
            <MainRoot
              trunks={built.trunks}
              capillaries={built.capillaries}
              connectorRibbons={connectorRibbons}
              subBranches={subBranches}
              mobile={built.mobile}
              reduce={reduce}
            />

            {/* Bloom overlay shares the SAME growth-front mask, so a branch can
                never light up / connect before the trunk's front reaches it. */}
            <g mask="url(#rn-reveal)">
              {built.branches.map((b, i) =>
                b.ribbons.length ? (
                  <Connectors key={i} ribbons={b.ribbons} points={b.points} connected={!!connected[i]} reduce={reduce} />
                ) : null
              )}
            </g>

            {/* dissolve the very top of the field into the soil blend */}
            <rect x="0" y="0" width={built.w} height={built.h * 0.035} fill="url(#rn-emerge)" />
          </>
        )}
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-[18vh] pt-[12vh] md:pb-[24vh] md:pl-10 md:pr-24 md:pt-[18vh]">
        {chapters.map((c, i) => {
          const leftCard = i % 2 === 0;
          const Comp = c.Component;
          // Big empty intro so the root drawing is fully visible alone first, and
          // extra room around Chapters 1 & 2. Tighter, proportioned on mobile.
          const gapClass =
            i === 0
              ? "mt-[34vh] md:mt-[58vh]"
              : i <= 2
              ? "mt-[15vh] md:mt-[clamp(16rem,34vh,30rem)]"
              : "mt-[9vh] md:mt-[clamp(6rem,13vh,12rem)]";
          return (
            <div
              key={c.id}
              className={`flex justify-end ${leftCard ? "md:justify-start" : "md:justify-end"} ${gapClass}`}
            >
              <div
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="w-[82%] md:w-[44%]"
              >
                {/* card blooms exactly when its roots connect */}
                <Comp active={!!connected[i]} side={leftCard ? "left" : "right"} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
