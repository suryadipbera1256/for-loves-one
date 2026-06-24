import { Suspense } from "react";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";

/**
 * Gallery / Travels. A physics carousel, pencil-style search, smart tags, and a
 * cinematic lightbox -- harmonised with the dark glassmorphic root theme.
 * Wrapped in Suspense because GalleryExperience reads ?chapter= via
 * useSearchParams (required by the Next app router).
 */
export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-void)]" />}>
      <GalleryExperience />
    </Suspense>
  );
}
