"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Pt } from "./geometry";

/**
 * One chapter's connection: a child branch that draws itself outward when
 * the chapter enters view, then gently dims back (never snaps) on leave so
 * re-scrolling re-blooms it. Adds a junction node, an expanding ring pulse,
 * and a couple of spark motes while active.
 */
function ChildBranchImpl({
  d,
  end,
  active,
  reduce,
}: {
  d: string;
  end: Pt;
  active: boolean;
  reduce: boolean;
}) {
  return (
    <g>
      {/* idle track */}
      <path d={d} fill="none" stroke="url(#rn-idle)" strokeWidth={2.4} strokeLinecap="round" opacity={0.35} />

      {/* glow underlay */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#rn-bloom-h)"
        strokeWidth={7}
        strokeLinecap="round"
        filter="url(#rn-glow)"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.4 : 0 }}
        transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* crisp bloom */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#rn-bloom-h)"
        strokeWidth={2.6}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* expanding ring pulse at the junction (loops gently while active) */}
      {!reduce && (
        <motion.circle
          cx={end.x}
          cy={end.y}
          r={7}
          fill="none"
          stroke="var(--bloom-tip)"
          strokeWidth={1.5}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={false}
          animate={active ? { scale: [0.6, 1.9], opacity: [0.7, 0] } : { opacity: 0 }}
          transition={active ? { duration: 1.7, repeat: Infinity, ease: "easeOut" } : { duration: 0.3 }}
        />
      )}

      {/* spark motes */}
      {!reduce &&
        active &&
        [0, 1].map((s) => (
          <motion.circle
            key={s}
            cx={end.x}
            cy={end.y}
            r={1.6}
            fill="var(--bloom-tip)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, (s === 0 ? -1 : 1) * (8 + s * 6)],
              y: [0, -10 - s * 6],
            }}
            transition={{ duration: 1.4, repeat: Infinity, delay: s * 0.5, ease: "easeOut" }}
          />
        ))}

      {/* the connection node itself */}
      <motion.circle
        cx={end.x}
        cy={end.y}
        r={5}
        fill="var(--bloom-tip)"
        filter="url(#rn-glow)"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={false}
        animate={{ opacity: active ? 1 : 0.18, scale: active ? 1 : 0.5 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      />
    </g>
  );
}

export const ChildBranch = memo(ChildBranchImpl);
