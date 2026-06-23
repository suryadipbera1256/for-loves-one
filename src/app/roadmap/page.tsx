"use client";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GrainOverlay } from "@/components/ambient/GrainOverlay";
import { Hero } from "@/components/hero/Hero";
import { RootSystem } from "@/components/root-system/RootSystem";
import { CHAPTERS } from "@/components/chapters";

/**
 * The Root Network roadmap.
 * Hero (couple dissolving into soil) -> RootSystem (scroll-bloom + branches).
 * Lenis provides inertia scrolling; a faint grain keeps the dark from
 * looking like dead black.
 */
export default function RoadmapPage() {
  return (
    <SmoothScroll>
      <GrainOverlay />
      <main className="relative w-full select-none bg-[var(--bg-void)]">
        <Hero />
        <RootSystem chapters={CHAPTERS} />
        <footer className="relative z-10 bg-[var(--bg-void)] pb-28 pt-10 text-center">
          <p className="font-handwriting text-3xl text-[var(--text-lo)] md:text-4xl">
            ...to be continued
          </p>
        </footer>
      </main>
    </SmoothScroll>
  );
}
