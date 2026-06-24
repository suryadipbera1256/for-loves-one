/**
 * Seed content for the Admin dashboard, mirrored from the current public site so
 * the panel opens already populated with real data. In Phase 2 this is replaced
 * by the first fetch from the backend; until then it hydrates localStorage.
 */

import { HERO } from "@/components/home/home.content";
import { PHOTOS } from "@/components/gallery/gallery.content";
import { CHAPTERS as LEGACY_CHAPTERS } from "@/components/chapters/chapters.content";
import { ACCENT_PRESETS } from "./constants";
import type { AdminChapter, AdminContentState, AdminGalleryPhoto, AdminHomeContent } from "./types";

const home: AdminHomeContent = {
  kicker: HERO.kicker,
  titleLines: [HERO.lines[0] ?? "", HERO.lines[1] ?? ""],
  subtitle: HERO.subtitle,
  ctaLabel: HERO.cta,
  heroImage: HERO.image,
};

const chapters: AdminChapter[] = LEGACY_CHAPTERS.map((c, i) => ({
  id: c.id,
  order: i,
  kicker: c.kicker ?? "",
  title: c.title,
  teaser: c.body,
  story: { en: c.body, bn: "" },
  images: c.image ? [c.image] : [],
  accent: c.accent ?? ACCENT_PRESETS[i % ACCENT_PRESETS.length],
}));

const gallery: AdminGalleryPhoto[] = PHOTOS.map((p) => ({
  id: p.id,
  title: p.title,
  location: p.location,
  chapterId: p.chapter,
  tags: [...p.tags],
  image: p.image ?? null,
  accent: p.accent,
}));

export const SEED_STATE: AdminContentState = { home, chapters, gallery };
