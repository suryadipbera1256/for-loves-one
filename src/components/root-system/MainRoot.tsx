"use client";

import { memo } from "react";
import { motion, type MotionValue } from "framer-motion";

/**
 * The default (unlit) soil field + the living trunk core.
 *
 * GROWTH IS 1:1 WITH SCROLL: the whole field is wrapped in url(#rn-reveal) -- a
 * mask whose height is a direct, non-spring transform of scrollYProgress. Scroll
 * down, the reveal line descends and the roots "grow"; stop scrolling and it
 * freezes on the exact frame, with zero residual easing. The trunk core also
 * carries a literal pathLength=scroll stroke for the same reason.
 *
 * Everything here stays in the dim, default soil colour. Only connected Level 2
 * branches bloom (see Connectors).
 */

export type BranchBase = { d: string };

function MainRootImpl({
  trunkFill,
  trunkCore,
  capillaries,
  connectorRibbons,
  subBranches,
  drive,
  mobile,
  reduce,
}: {
  trunkFill: string;
  trunkCore: string;
  capillaries: string[];
  connectorRibbons: BranchBase[];
  subBranches: BranchBase[];
  drive: MotionValue<number>;
  mobile: boolean;
  reduce: boolean;
}) {
  const capStyle = [
    { w: 0.5, o: 0.16, blur: true },
    { w: 0.8, o: 0.22, blur: false },
    { w: 1.1, o: 0.3, blur: false },
  ];

  return (
    <g>
      {/* ---- MASKED FIELD: revealed strictly by scroll (freezes on pause) ---- */}
      <g mask="url(#rn-reveal)">
        {/* Level 3 -- dense dim capillary background (never blooms) */}
        <g className={reduce ? "" : "root-breathe"}>
          {capillaries.map((d, i) =>
            d ? (
              <path
                key={`cap-glow-${i}`}
                d={d}
                fill="none"
                stroke="var(--root-idle-from)"
                strokeWidth={(capStyle[i]?.w ?? 1) + 1.4}
                strokeLinecap="round"
                opacity={(capStyle[i]?.o ?? 0.2) * 0.5}
                filter="url(#rn-soft-blur)"
              />
            ) : null
          )}
          {capillaries.map((d, i) =>
            d ? (
              <path
                key={`cap-${i}`}
                d={d}
                fill="none"
                stroke="url(#rn-cap)"
                strokeWidth={capStyle[i]?.w ?? 1}
                strokeLinecap="round"
                opacity={capStyle[i]?.o ?? 0.2}
                filter={capStyle[i]?.blur ? "url(#rn-soft-blur)" : undefined}
              />
            ) : null
          )}
        </g>

        {/* Level 2.5 -- tiny non-connecting rootlets, dim and tapering away */}
        {subBranches.map((b, i) => (
          <path key={`sub-${i}`} d={b.d} fill="url(#rn-cap)" opacity={0.5} />
        ))}

        {/* Level 1 -- tapered trunk body (filled, thick -> thread) */}
        <path d={trunkFill} fill="url(#rn-trunk)" opacity={0.95} />
        <path d={trunkFill} fill="url(#rn-idle)" opacity={0.25} />

        {/* Level 2 -- connector BASE ribbons, default unlit colour */}
        {connectorRibbons.map((b, i) => (
          <path key={`con-${i}`} d={b.d} fill="url(#rn-idle)" opacity={0.55} />
        ))}
      </g>

      {/* trunk centre line -- literal pathLength tied 1:1 to scroll */}
      <motion.path
        d={trunkCore}
        fill="none"
        stroke="url(#rn-trunk)"
        strokeWidth={mobile ? 1.2 : 1.8}
        strokeLinecap="round"
        opacity={0.5}
        style={{ pathLength: drive }}
      />
    </g>
  );
}

export const MainRoot = memo(MainRootImpl);
