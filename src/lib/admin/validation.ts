/**
 * Pure validation + formatting helpers. No React, no I/O — trivially testable.
 */

import { FREE_TIER, type UploadGuide } from "./constants";
import type { AdminChapter, AdminContentState, AdminGalleryPhoto, AdminHomeContent, Errors, UsageStats } from "./types";

export const isBlank = (v: string | null | undefined): boolean => !v || v.trim().length === 0;

const trimLen = (v: string) => v.trim().length;

/** Human-readable byte size. */
export function bytesToReadable(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Validate a chosen File against an upload guide (type + size). Dimensions are
 * advisory (we can't measure synchronously), so we surface the guide instead. */
export function validateImageFile(file: File, guide: UploadGuide): string | null {
  if (!guide.accept.includes(file.type)) {
    return `Unsupported type. Use ${guide.accept.map((t) => t.split("/")[1]).join(", ")}.`;
  }
  if (file.size > guide.maxMB * 1024 * 1024) {
    return `Too large (${bytesToReadable(file.size)}). Max ${guide.maxMB} MB.`;
  }
  return null;
}

export function validateHome(h: AdminHomeContent): Errors<keyof AdminHomeContent> {
  const e: Errors<keyof AdminHomeContent> = {};
  if (isBlank(h.kicker)) e.kicker = "Kicker is required.";
  if (isBlank(h.titleLines?.[0])) e.titleLines = "Both title lines are required.";
  else if (isBlank(h.titleLines?.[1])) e.titleLines = "Second title line is required.";
  if (trimLen(h.subtitle ?? "") < 10) e.subtitle = "Subtitle should be at least 10 characters.";
  if (isBlank(h.ctaLabel)) e.ctaLabel = "Button label is required.";
  return e;
}

export function validateChapter(c: AdminChapter): Errors<"title" | "kicker" | "teaser" | "storyEn"> {
  const e: Errors<"title" | "kicker" | "teaser" | "storyEn"> = {};
  if (isBlank(c.title)) e.title = "Title is required.";
  if (isBlank(c.kicker)) e.kicker = "Kicker is required.";
  if (trimLen(c.teaser ?? "") < 8) e.teaser = "Teaser should be at least 8 characters.";
  if (isBlank(c.story?.en)) e.storyEn = "English story is required.";
  return e;
}

export function validateGalleryPhoto(p: AdminGalleryPhoto): Errors<"title" | "location" | "tags"> {
  const e: Errors<"title" | "location" | "tags"> = {};
  if (isBlank(p.title)) e.title = "Title is required.";
  if (isBlank(p.location)) e.location = "Location is required.";
  if (!p.tags || p.tags.length === 0) e.tags = "Add at least one tag.";
  return e;
}

export const hasErrors = (e: Errors): boolean => Object.keys(e).length > 0;

/** Derive free-tier usage from the content tree (count + estimated bytes). */
export function computeUsage(state: AdminContentState): UsageStats {
  const photos = [
    ...state.gallery.filter((p) => !!p.image),
    ...state.chapters.flatMap((c) => c.images),
    state.home.heroImage,
  ].filter(Boolean);
  const photoCount = photos.length;
  const estBytes = photoCount * FREE_TIER.avgPhotoBytes;
  return {
    photoCount,
    estBytes,
    photoPct: Math.min(1, photoCount / FREE_TIER.maxPhotos),
    bytesPct: Math.min(1, estBytes / FREE_TIER.maxBytes),
  };
}
