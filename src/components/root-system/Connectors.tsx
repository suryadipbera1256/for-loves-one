"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Pt } from "./geometry";

/**
 * The BLOOM layer for one chapter. The connector ribbons themselves already grew
 * (dim) in the masked field; here we only swap their colour to the warm Bloom
 * gradient -- and ONLY when `connected` is true, i.e. the moment the scroll-driven
 * growth has physically reached this chapter's box. It is a colour change on
 * contact, not a second growth animation, so it never "finishes connecting" on
 * its own after the user stops scrolling.
 */
function ConnectorsImpl({
  ribbons,
  points,
  connected,
  reduce,
}: {
  ribbons: string[];
  points: Pt[];
  connected: boolean;
  reduce: boolean;
}) {
  return (
    <g>
      {ribbons.map((d, i) => (
        <g key={i}>
          {/* soft radiant halo under the connected root */}
          <motion.path
            d={d}
            fill="url(#rn-bloom)"
            filter="url(#rn-glow-soft)"
            initial={false}
            animate={{ opacity: connected ? 0.5 : 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          />
          {/* crisp bloom fill */}
          <motion.path
            d={d}
            fill="url(#rn-bloom)"
            initial={false}
            animate={{ opacity: connected ? 0.92 : 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut", delay: reduce ? 0 : i * 0.04 }}
          />
        </g>
      ))}

      {/* docking nodes where the roots touch the box -- light only on contact */}
      {points.map((p, i) => (
        <motion.circle
          key={`n${i}`}
          cx={p.x}
          cy={p.y}
          r={3}
          fill="var(--bloom-tip)"
          filter="url(#rn-glow-soft)"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={false}
          animate={{ opacity: connected ? 0.95 : 0, scale: connected ? 1 : 0.4 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.04 }}
        />
      ))}
    </g>
  );
}

export const Connectors = memo(ConnectorsImpl);
