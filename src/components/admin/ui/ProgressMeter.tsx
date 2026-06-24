"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FREE_TIER } from "@/lib/admin/constants";

/**
 * A sleek usage bar that turns amber near the warn threshold and red near the
 * danger threshold — the visual heartbeat of the free-tier monitor.
 */
export function ProgressMeter({
  label,
  value,
  pct,
  limitLabel,
}: {
  label: string;
  value: string;
  pct: number; // 0..1
  limitLabel: string;
}) {
  const clamped = Math.max(0, Math.min(1, pct));
  const state = clamped >= FREE_TIER.dangerAt ? "danger" : clamped >= FREE_TIER.warnAt ? "warn" : "ok";

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]">{label}</span>
        <span className="font-mono text-[12px] tabular-nums text-[var(--text-hi)]">{value}</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            state === "ok" && "bg-gradient-to-r from-[var(--bloom-mid)] to-[var(--bloom-tip)]",
            state === "warn" && "bg-gradient-to-r from-amber-500 to-amber-300",
            state === "danger" && "bg-gradient-to-r from-red-600 to-red-400"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${(clamped * 100).toFixed(1)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--text-lo)]/70">{(clamped * 100).toFixed(0)}% used</span>
        <span className="font-mono text-[10px] text-[var(--text-lo)]/70">{limitLabel}</span>
      </div>
    </div>
  );
}
