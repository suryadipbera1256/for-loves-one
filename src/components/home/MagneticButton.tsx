"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { UI_SPRING } from "@/lib/motion";

/**
 * A magnetic, glowing pill button. The label eases toward the cursor and a warm
 * bloom glow swells behind it on hover. Renders a Next <Link> when `href` is
 * given, otherwise a <button>. Pure transform/opacity -> GPU-friendly.
 */
export function MagneticButton({
  href,
  onClick,
  children,
  className,
  ariaLabel,
  strength = 18,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, UI_SPRING);
  const sy = useSpring(y, UI_SPRING);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full bg-[var(--bloom-halo)] opacity-0 blur-2xl transition-opacity duration-500 group-hover/mag:opacity-40"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  const cls = cn(
    "group/mag relative inline-flex items-center justify-center rounded-full border border-[var(--bloom-core)]/40 bg-white/[0.04] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--bloom-tip)] outline-none backdrop-blur-md transition-colors duration-500 hover:border-[var(--bloom-core)]/70 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)]",
    className
  );

  if (href) {
    return (
      <motion.div style={{ x: sx, y: sy }} className="inline-flex">
        <Link href={href} aria-label={ariaLabel} onMouseMove={onMove} onMouseLeave={reset} className={cls}>
          {inner}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-flex">
      <button type="button" aria-label={ariaLabel} onClick={onClick} onMouseMove={onMove} onMouseLeave={reset} className={cls}>
        {inner}
      </button>
    </motion.div>
  );
}
