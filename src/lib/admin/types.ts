/**
 * Canonical content model for the whole site, shared by the Admin dashboard and
 * (in Phase 2) the public pages once they read from the same source. Keep these
 * types as the single source of truth.
 */

export type ID = string;

export type GalleryTag = "Travels" | "Tours" | "Couple Nights" | "Adventures" | "Bike Rides" | "Festivals";

/** Bilingual long-form narrative for a chapter. */
export interface AdminStory {
  en: string;
  bn: string;
}

/** Editable Home / Genesis content. */
export interface AdminHomeContent {
  kicker: string;
  /** Two masked title lines. */
  titleLines: [string, string];
  subtitle: string;
  ctaLabel: string;
  heroImage: string;
}

/** A Roadmap chapter. `order` is the authoritative sort key (0-based). */
export interface AdminChapter {
  id: ID;
  order: number;
  kicker: string;
  title: string;
  teaser: string;
  story: AdminStory;
  images: string[];
  accent: [string, string];
}

/** A gallery photo. `chapterId` links it back to a chapter for /gallery?chapter focus. */
export interface AdminGalleryPhoto {
  id: ID;
  title: string;
  location: string;
  chapterId: ID | null;
  tags: GalleryTag[];
  image: string | null;
  accent: [string, string];
}

/** The full editable content tree. */
export interface AdminContentState {
  home: AdminHomeContent;
  chapters: AdminChapter[];
  gallery: AdminGalleryPhoto[];
}

/** Estimated free-tier usage, derived (never stored). */
export interface UsageStats {
  photoCount: number;
  estBytes: number;
  photoPct: number; // 0..1
  bytesPct: number; // 0..1
}

/** A field-keyed validation result. Empty object === valid. */
export type Errors<T extends string = string> = Partial<Record<T, string>>;
