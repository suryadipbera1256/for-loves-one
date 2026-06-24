"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { UI_SPRING } from "@/lib/motion";

/**
 * A single photo in the triple-photo array. Each tile is its own little 3D
 * stage: on hover it tilts toward the cursor (parallax), a holographic glare
 * tracks the pointer, and it scales up a touch. If the photo is missing or
 * fails to load it falls back to a refined accent gradient (varied per index)
 * so the array always looks deliberate -- never a broken frame.
 */
export function HoloPhoto({
  src,
  index,
  accent,
  alt,
  className,
  active,
}: {
  src?: string;
  index: number;
  accent: [string, string];
  alt: string;
  className?: string;
  active: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);
  const [a, b] = accent;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), UI_SPRING);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), UI_SPRING);
  const gx = useTransform(mx, [0, 1], [0, 100]);
  const gy = useTransform(my, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(120% 120% at ${gx}% ${gy}%, rgba(255,255,255,0.4), rgba(255,255,255,0.06) 35%, transparent 60%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  // per-tile gradient variation so 3 fallback frames read as distinct photos
  const angle = 120 + index * 55;

  return (
    <div className={cn("[perspective:700px]", className)}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        transition={UI_SPRING}
        className={cn(
          "group/photo relative h-full w-full overflow-hidden rounded-xl border",
          active ? "border-[var(--bloom-core)]/30" : "border-white/10"
        )}
      >
        {/* gradient base (also the fallback when no photo) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: `linear-gradient(${angle}deg, ${a} 0%, ${b} 100%)` }}
        >
          <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.3),transparent_50%)]" />
        </div>

        {src && !failed && (
          <Image
            src={src}
            alt={alt}
            fill
            loading="lazy"
            onError={() => setFailed(true)}
            sizes="(max-width: 768px) 30vw, 16vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover/photo:scale-110"
          />
        )}

        {/* readability + bloom tint */}
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-700",
            active ? "bg-gradient-to-t from-black/55 via-transparent to-transparent" : "bg-black/15"
          )}
        />

        {/* holographic glare follows the cursor */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover/photo:opacity-100"
            style={{ background: glare }}
          />
        )}

        {/* fixed diagonal sheen for a glassy edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.16) 0%, transparent 30%, transparent 72%, rgba(255,255,255,0.05) 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}
