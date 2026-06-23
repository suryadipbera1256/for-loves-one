"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Pt } from "./geometry";

/**
 * Per-chapter Level 2 GLOW layer. The dim base branches live in the masked
 * field (MainRoot); here we only fade a soft Bloom overlay over those same
 * branch shapes -- and light the multi-point nodes -- once the chapter is in
 * view (i.e. after the branches have connected). Each chapter animates
 * independently. Only the active chapter's few paths animate => cheap.
 */
function ConnectorsImpl({
  paths,
  points,
  active,
  reduce,
}: {
  paths: string[];
  points: Pt[];
  active: boolean;
  reduce: boolean;
}) {
  return (
    <g>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="url(#rn-bloom)"
          strokeWidth={i === 0 ? 1.8 : 1.3}
          strokeLinecap="round"
          filter="url(#rn-glow-soft)"
          initial={false}
          animate={{ opacity: active ? 0.7 : 0 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: "easeOut", delay: reduce ? 0 : i * 0.05 }}
        />
      ))}

      {points.map((p, i) => (
        <g key={`n${i}`}>
          {!reduce && (
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill="none"
              stroke="var(--bloom-tip)"
              strokeWidth={1}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={false}
              animate={active ? { scale: [0.7, 1.7], opacity: [0.3, 0] } : { opacity: 0 }}
              transition={active ? { duration: 2, repeat: Infinity, ease: "easeOut", delay: i * 0.18 } : { duration: 0.3 }}
            />
          )}
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={3.4}
            fill="var(--bloom-tip)"
            filter="url(#rn-glow-soft)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={false}
            animate={{ opacity: active ? 0.95 : 0.1, scale: active ? 1 : 0.5 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
          />
        </g>
      ))}
    </g>
  );
}

export const Connectors = memo(ConnectorsImpl);
