"use client";

import { memo } from "react";

/**
 * The default (unlit) soil field + the trunk vein.
 *
 * Level 3 (capillaries) is a faint, sparse, blurred ambient haze, always visible
 * (outside the scroll mask) so the dark never looks dead -- intentionally dim so
 * it never competes with the glowing roots.
 *
 * Levels 1, 2 and 2.5 share ONE scroll-driven growth front, url(#rn-reveal):
 * a Y-based reveal tied directly to scroll (freezes on pause). Because trunk,
 * connector ribbons and the trunk vein are all revealed by this single front,
 * a branch can never appear before the trunk's growth reaches its split-off Y --
 * the synchronization is structural. Tapered roots are filled ribbons (a stroke
 * can't taper), so the shared Y-front replaces per-path pathLength. Only fully
 * connected Level 2 branches bloom (see Connectors).
 */

export type BranchBase = { d: string };

function MainRootImpl({
  trunkFill,
  trunkCore,
  capillaries,
  connectorRibbons,
  subBranches,
  mobile,
  reduce,
}: {
  trunkFill: string;
  trunkCore: string;
  capillaries: string[];
  connectorRibbons: BranchBase[];
  subBranches: BranchBase[];
  mobile: boolean;
  reduce: boolean;
}) {
  const capStyle = [
    { w: 0.6, o: 0.08 },
    { w: 0.8, o: 0.1 },
    { w: 1.0, o: 0.13 },
  ];

  return (
    <g>
      {/* ---- LEVEL 3 -- a faint, blurred ambient depth haze (intentionally
            sparse + dim so it never competes with the glowing roots) ---- */}
      <g className={reduce ? "" : "root-breathe"} filter="url(#rn-soft-blur)">
        {capillaries.map((d, i) =>
          d ? (
            <path
              key={`cap-${i}`}
              d={d}
              fill="none"
              stroke="url(#rn-idle)"
              strokeWidth={capStyle[i]?.w ?? 0.8}
              strokeLinecap="round"
              opacity={capStyle[i]?.o ?? 0.1}
            />
          ) : null
        )}
      </g>

      {/* ---- MASKED FIELD: grows strictly with scroll (freezes on pause) ---- */}
      <g mask="url(#rn-reveal)">
        {/* Level 2.5 -- tiny non-connecting rootlets, same soil colour, tapering away */}
        {subBranches.map((b, i) => (
          <path key={`sub-${i}`} d={b.d} fill="url(#rn-idle)" opacity={0.85} />
        ))}

        {/* Level 1 -- tapered trunk body (filled, thick -> thread) */}
        <path d={trunkFill} fill="url(#rn-trunk)" opacity={0.97} />
        <path d={trunkFill} fill="url(#rn-idle)" opacity={0.22} />
        {/* trunk centre vein -- revealed by the SAME growth front (no lag, so the
            trunk's visible tip never falls behind the branches) */}
        <path
          d={trunkCore}
          fill="none"
          stroke="url(#rn-trunk)"
          strokeWidth={mobile ? 2 : 3}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Level 2 -- connector BASE ribbons, default unlit colour */}
        {connectorRibbons.map((b, i) => (
          <path key={`con-${i}`} d={b.d} fill="url(#rn-idle)" opacity={0.55} />
        ))}
      </g>
    </g>
  );
}

export const MainRoot = memo(MainRootImpl);
