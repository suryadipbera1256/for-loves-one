"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The Root Crown -- a realistic, textured tree-stump base the whole root system
 * grows out of. Purely botanical: layered wood lobes, buttress roots flaring into
 * the soil, bark striations and heartwood rings. No glow, no icon.
 *
 * Permanent, very slow ambient "breath": the crown swells a hair and its shadow
 * deepens, so the wood feels alive without ever looking neon.
 *
 * `variant`:
 *   "hero" -> planted in the dark band at the bottom of the Hero (Phase 1),
 *             behind the couple (z below the couple), as a background layer.
 *   "soil" -> sat on the soil line at the top of the root section.
 * Rendered as its own fixed-aspect SVG (the root canvas uses
 * preserveAspectRatio="none", which would distort fine bark detail) and sized
 * with CSS so no measurement is needed.
 */
export function RootCrown({ variant = "soil" }: { variant?: "hero" | "soil" }) {
  const reduce = useReducedMotion() ?? false;

  const wrap =
    variant === "hero"
      ? "pointer-events-none absolute bottom-0 left-1/2 z-[15] w-[150px] -translate-x-1/2 translate-y-[16%] md:w-[230px]"
      : "pointer-events-none absolute left-1/2 top-0 z-20 w-[150px] -translate-x-1/2 -translate-y-[38%] md:w-[230px]";

  return (
    <div className={wrap} aria-hidden>
      <motion.svg
        viewBox="0 0 230 124"
        width="100%"
        height="auto"
        fill="none"
        style={{ transformOrigin: "50% 92%", display: "block" }}
        animate={reduce ? undefined : { scaleX: [1, 1.012, 1], scaleY: [1, 0.99, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id="rc-top" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#8a6a40" />
            <stop offset="55%" stopColor="#6b5232" />
            <stop offset="100%" stopColor="#3f3120" />
          </radialGradient>
          <linearGradient id="rc-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b5232" />
            <stop offset="60%" stopColor="#4a3a24" />
            <stop offset="100%" stopColor="#221a10" />
          </linearGradient>
          <linearGradient id="rc-buttress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3a24" />
            <stop offset="100%" stopColor="#160f08" />
          </linearGradient>
          <radialGradient id="rc-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft contact shadow where the crown meets the soil (breathes too) */}
        <motion.ellipse
          cx="115"
          cy="116"
          rx="104"
          ry="14"
          fill="url(#rc-shadow)"
          animate={reduce ? undefined : { opacity: [0.7, 0.92, 0.7], rx: [104, 110, 104] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* buttress / surface roots flaring out into the soil */}
        <path
          d="M115 70
             C 78 74 54 92 16 116 C 52 104 80 100 104 98
             C 92 108 70 112 44 122 C 84 112 104 106 115 104
             C 126 106 146 112 186 122 C 160 112 138 108 126 98
             C 150 100 178 104 214 116 C 176 92 152 74 115 70 Z"
          fill="url(#rc-buttress)"
        />

        {/* main stump body */}
        <path
          d="M70 44
             C 70 22 96 12 115 12 C 134 12 160 22 160 44
             C 168 64 156 86 138 96 C 126 102 104 102 92 96
             C 74 86 62 64 70 44 Z"
          fill="url(#rc-body)"
        />

        {/* sawn top surface (lighter, catches the canopy light) */}
        <ellipse cx="115" cy="40" rx="46" ry="22" fill="url(#rc-top)" />

        {/* heartwood growth rings */}
        <g stroke="#2c2114" strokeOpacity="0.5" fill="none">
          <ellipse cx="115" cy="40" rx="34" ry="15.5" />
          <ellipse cx="116" cy="41" rx="23" ry="10.5" />
          <ellipse cx="117" cy="41.5" rx="12" ry="5.5" />
          <ellipse cx="117" cy="42" rx="4" ry="2" stroke="#1c1409" />
        </g>
        {/* a couple of natural cracks across the rings */}
        <g stroke="#19110a" strokeOpacity="0.55" strokeLinecap="round">
          <path d="M117 40 L 150 36" strokeWidth="1.2" />
          <path d="M117 41 L 96 52" strokeWidth="1" />
        </g>

        {/* bark striations down the body */}
        <g stroke="#241a10" strokeOpacity="0.45" fill="none" strokeLinecap="round">
          <path d="M80 52 C 78 70 84 84 92 94" strokeWidth="1.4" />
          <path d="M96 56 C 95 72 98 86 102 96" strokeWidth="1.2" />
          <path d="M134 56 C 136 72 133 86 128 96" strokeWidth="1.2" />
          <path d="M150 52 C 153 70 147 84 138 94" strokeWidth="1.4" />
        </g>
        {/* bark highlights */}
        <g stroke="#7d6038" strokeOpacity="0.4" fill="none" strokeLinecap="round">
          <path d="M88 54 C 87 70 91 84 97 94" strokeWidth="0.8" />
          <path d="M142 54 C 144 70 139 84 132 94" strokeWidth="0.8" />
        </g>
      </motion.svg>
    </div>
  );
}
