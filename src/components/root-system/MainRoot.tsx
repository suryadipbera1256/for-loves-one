"use client";

import { memo, type RefObject } from "react";
import { motion, type MotionValue } from "framer-motion";

/**
 * Level 1 trunk + the masked static "field" (Level 3 capillaries, Level 2
 * decoys, and all Level 2 connector BASE paths).
 *
 * Performance: the field is hundreds/thousands of static paths revealed by a
 * single scroll-driven mask (url(#rn-reveal)) -- nothing per-path animates, so
 * 20 chapters stay cheap. Only the trunk uses pathLength (1-2 paths) for the
 * literal draw + energy flow. The trunk start cap is "butt" (no rounded blob).
 */
function MainRootImpl({
  mainPath,
  capillaries,
  decoys,
  connectorBases,
  drive,
  bloomPathRef,
  mobile,
  reduce,
}: {
  mainPath: string;
  capillaries: string[];
  decoys: string[];
  connectorBases: string[];
  drive: MotionValue<number>;
  bloomPathRef: RefObject<SVGPathElement | null>;
  mobile: boolean;
  reduce: boolean;
}) {
  const trunkW = mobile ? 5 : 8;
  const capStyle = [
    { w: 0.6, o: 0.1, blur: true },
    { w: 0.9, o: 0.15, blur: false },
    { w: 1.3, o: 0.22, blur: false },
  ];

  return (
    <g>
      {/* MASKED STATIC FIELD -- revealed top-down by scroll, all in dim idle */}
      <g mask="url(#rn-reveal)" className={reduce ? "" : "root-breathe"}>
        {capillaries.map((d, i) =>
          d ? (
            <path
              key={`c${i}`}
              d={d}
              fill="none"
              stroke="url(#rn-idle)"
              strokeWidth={capStyle[i]?.w ?? 1}
              strokeLinecap="round"
              opacity={capStyle[i]?.o ?? 0.15}
              filter={capStyle[i]?.blur ? "url(#rn-soft-blur)" : undefined}
            />
          ) : null
        )}
        {decoys.map((d, i) => (
          <path
            key={`d${i}`}
            d={d}
            fill="none"
            stroke="url(#rn-idle)"
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.4}
          />
        ))}
        {connectorBases.map((d, i) => (
          <path
            key={`b${i}`}
            d={d}
            fill="none"
            stroke="url(#rn-idle)"
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.42}
          />
        ))}
      </g>

      {/* LEVEL 1 trunk -- straight-cut start (no rounded blob), draws downward */}
      <path d={mainPath} fill="none" stroke="url(#rn-idle)" strokeWidth={trunkW} strokeLinecap="butt" opacity={0.4} />
      <motion.path
        d={mainPath}
        fill="none"
        stroke="url(#rn-trunk)"
        strokeWidth={trunkW + 4}
        strokeLinecap="butt"
        filter="url(#rn-glow-soft)"
        style={{ pathLength: drive }}
        opacity={0.12}
      />
      <motion.path
        ref={bloomPathRef}
        d={mainPath}
        fill="none"
        stroke="url(#rn-trunk)"
        strokeWidth={trunkW}
        strokeLinecap="butt"
        style={{ pathLength: drive }}
        opacity={0.7}
      />
    </g>
  );
}

export const MainRoot = memo(MainRootImpl);
