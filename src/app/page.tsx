"use client";

import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GrainOverlay } from "@/components/ambient/GrainOverlay";
import { CinematicHero } from "@/components/home/CinematicHero";
import { StickyStack } from "@/components/home/StickyStack";
import { LoveInNumbers } from "@/components/home/LoveInNumbers";
import { GlimpseGallery } from "@/components/home/GlimpseGallery";
import { JourneyCTA } from "@/components/home/JourneyCTA";

/**
 * Home — "Genesis / The Surface" of the love story. A cinematic, glassmorphic
 * descent that harmonises with the Roadmap's subterranean root world:
 *
 *   CinematicHero  parallax photo + line-masked title reveal (the surface)
 *   StickyStack    sticky card-deck: three movements of how it grew
 *   LoveInNumbers  count-up stats (incl. live days together) + thesis quote
 *   GlimpseGallery dual-row infinite marquee of memories
 *   JourneyCTA     magnetic gateway down into the Roadmap (the roots)
 *
 * Lenis powers buttery scroll; a faint grain keeps the dark alive. All motion is
 * transform/opacity and reduced-motion aware.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <GrainOverlay />
      <main className="relative w-full select-none overflow-hidden bg-[var(--bg-void)] text-[var(--text-hi)]">
        <CinematicHero />
        <StickyStack />
        <LoveInNumbers />
        <GlimpseGallery />
        <JourneyCTA />
      </main>
    </SmoothScroll>
  );
}
