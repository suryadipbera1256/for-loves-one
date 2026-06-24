"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TAGS, type GalleryTag } from "./gallery.content";

/**
 * Glass filter pills. `active === null` means "All". The active pill carries a
 * shared `layoutId` highlight that glides between tags. Horizontally scrollable
 * on mobile (no wrap, no overflow clipping of the page).
 */
export function TagFilters({
  active,
  onChange,
}: {
  active: GalleryTag | null;
  onChange: (t: GalleryTag | null) => void;
}) {
  const items: (GalleryTag | null)[] = [null, ...TAGS];

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
      {items.map((t) => {
        const isActive = active === t;
        const label = t ?? "All";
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(t)}
            aria-pressed={isActive}
            className={cn(
              "relative shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)]",
              isActive ? "border-[var(--bloom-core)]/50 text-[#241809]" : "border-white/10 bg-white/[0.03] text-[var(--text-lo)] hover:text-[var(--text-hi)]"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tag-active"
                className="absolute inset-0 -z-10 rounded-full bg-[var(--bloom-core)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
