"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { GalleryPhoto } from "./gallery.content";

/**
 * Cinematic photo modal. Glass backdrop, spring-scaled entrance, drag-down to
 * dismiss (native feel), prev/next, and keyboard (Esc / ← / →). The image gets a
 * slow ambient drift. `photo === null` keeps it closed (AnimatePresence handles
 * the exit).
 */
export function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: GalleryPhoto | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [photo?.id]);

  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden
          />
          {/* adaptive halo */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            animate={{ backgroundColor: photo.accent[0], opacity: 0.22 }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            key={photo.id}
            role="dialog"
            aria-modal="true"
            aria-label={`${photo.title}, ${photo.location}`}
            className="relative z-10 w-full max-w-3xl"
            initial={{ scale: reduce ? 1 : 0.92, y: reduce ? 0 : 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: reduce ? 1 : 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140 || info.velocity.y > 600) onClose();
            }}
          >
            <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.05] shadow-[0_50px_140px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10]">
                <div className="absolute inset-0" style={{ background: `linear-gradient(140deg, ${photo.accent[0]} 0%, ${photo.accent[1]} 100%)` }} />
                {photo.image && !failed && (
                  <motion.div
                    className="absolute inset-0"
                    animate={reduce ? undefined : { scale: [1.05, 1.12, 1.05] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Image src={photo.image} alt={photo.title} fill priority sizes="(max-width: 768px) 92vw, 768px" className="object-cover" onError={() => setFailed(true)} />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                {/* caption */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {photo.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--text-hi)]/85 backdrop-blur-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-handwriting text-4xl leading-tight text-white md:text-5xl">{photo.title}</h2>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-lo)]">{photo.location}</p>
                </div>
              </div>
            </div>

            {/* close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 right-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-[var(--text-hi)] backdrop-blur-md transition-colors hover:border-[var(--bloom-core)]/50 md:-right-4 md:-top-4"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>

            {/* prev / next */}
            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={onPrev} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[var(--text-hi)] backdrop-blur-md transition-colors hover:border-[var(--bloom-core)]/50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <span className="font-mono text-[11px] tabular-nums tracking-[0.24em] text-[var(--text-lo)]">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <button type="button" onClick={onNext} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[var(--text-hi)] backdrop-blur-md transition-colors hover:border-[var(--bloom-core)]/50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
