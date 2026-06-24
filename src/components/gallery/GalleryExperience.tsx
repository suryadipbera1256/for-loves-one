"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GrainOverlay } from "@/components/ambient/GrainOverlay";
import { Particles } from "@/components/ambient/Particles";
import { PencilSearch } from "./PencilSearch";
import { TagFilters } from "./TagFilters";
import { PhotoCarousel } from "./PhotoCarousel";
import { Lightbox } from "./Lightbox";
import { PHOTOS, arrangePhotos, chapterLabel, type GalleryPhoto, type GalleryTag } from "./gallery.content";

/**
 * The Gallery / Travels ecosystem. Reads ?chapter=NN from the Roadmap's "View
 * More Photos", floats that chapter to the front, and lets the user search
 * (pencil-style), filter by tag, and explore a physics carousel with a cinematic
 * lightbox. The ambient glow adapts to the centred photo's dominant accent.
 */
export function GalleryExperience() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<GalleryTag | null>(null);
  const [chapterFocus, setChapterFocus] = useState<string | null>(null);
  const [lightIndex, setLightIndex] = useState<number | null>(null);
  const [accent, setAccent] = useState(PHOTOS[0]?.accent[0] ?? "#9c763f");

  // read the deep-link chapter from the URL (auto-focus that chapter)
  useEffect(() => {
    const ch = searchParams.get("chapter");
    setChapterFocus(ch && ch.trim() ? ch.trim() : null);
  }, [searchParams]);

  const items = useMemo(
    () => arrangePhotos(PHOTOS, { query, tag, chapter: chapterFocus }),
    [query, tag, chapterFocus]
  );

  // a changed arrangement closes any open photo
  useEffect(() => setLightIndex(null), [items]);

  const sig = `${tag ?? "all"}|${query}|${chapterFocus ?? ""}`;
  const n = items.length;
  const photo = lightIndex != null ? items[lightIndex] ?? null : null;

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--bg-void)] text-[var(--text-hi)]">
      <GrainOverlay />
      {/* ambient glow that adapts to the active photo's dominant colour */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12%] h-[72vmin] w-[72vmin] -translate-x-1/2 rounded-full blur-[140px]"
        animate={{ backgroundColor: accent, opacity: 0.16 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <Particles count={16} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-[7rem] pt-[clamp(4.5rem,11vh,7rem)] md:pb-12">
        {/* header */}
        <header className="text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.45em] text-[var(--bloom-core)] md:text-xs">
            The Travels
          </p>
          <h1 className="font-handwriting text-4xl tracking-wide text-white md:text-6xl">A glimpse of everywhere</h1>
        </header>

        {/* controls */}
        <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <PencilSearch value={query} onChange={setQuery} />
            <AnimatePresence>
              {chapterFocus && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setChapterFocus(null)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--bloom-core)]/45 bg-[var(--bloom-core)]/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--bloom-tip)]"
                  aria-label={`Clear ${chapterLabel(chapterFocus)} focus`}
                >
                  {chapterLabel(chapterFocus)}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <TagFilters active={tag} onChange={setTag} />
        </div>

        {/* carousel / empty state */}
        <div className="relative mt-8 flex flex-1 flex-col justify-center">
          {n > 0 ? (
            <PhotoCarousel
              key={sig}
              items={items}
              onOpen={(item) => setLightIndex(items.findIndex((p) => p.id === item.id))}
              onActiveChange={(item) => item && setAccent(item.accent[0])}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="font-handwriting text-3xl text-[var(--text-hi)]/80">No memories match that — yet.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTag(null);
                  setChapterFocus(null);
                }}
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-hi)] transition-colors hover:border-[var(--bloom-core)]/50"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* hint */}
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-lo)]/70">
          drag · flick · tap to expand
        </p>
      </div>

      <Lightbox
        photo={photo}
        index={lightIndex ?? 0}
        total={n}
        onClose={() => setLightIndex(null)}
        onPrev={() => setLightIndex((i) => (i == null ? null : (i - 1 + n) % n))}
        onNext={() => setLightIndex((i) => (i == null ? null : (i + 1) % n))}
      />
    </section>
  );
}
