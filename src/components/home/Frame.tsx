"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Accent } from "./home.content";

/**
 * A glassy media frame with a graceful gradient fallback (varied per index) for
 * missing/failed photos, a fixed diagonal sheen, and a gentle hover zoom. Kept
 * lightweight (no per-frame mouse handlers) so dozens can run in the marquee.
 */
export function Frame({
  src,
  accent,
  index = 0,
  alt = "",
  className,
  sizes = "(max-width: 768px) 60vw, 22vw",
}: {
  src?: string;
  accent: Accent;
  index?: number;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [a, b] = accent;
  const angle = 125 + index * 47;

  return (
    <div className={cn("group/frame relative overflow-hidden rounded-2xl border border-white/10", className)}>
      <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(${angle}deg, ${a} 0%, ${b} 100%)` }}>
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
      </div>

      {src && !failed && (
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          onError={() => setFailed(true)}
          sizes={sizes}
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover/frame:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 30%, transparent 72%, rgba(255,255,255,0.05) 100%)",
        }}
      />
    </div>
  );
}
