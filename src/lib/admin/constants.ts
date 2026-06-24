/**
 * Tunable limits + upload guidance. These are the numbers the Command Center
 * watches so we never trip a free-tier billing limit, plus the exact aspect /
 * resolution / size rules surfaced next to every upload zone.
 */

import type { GalleryTag } from "./types";

export const GALLERY_TAGS: readonly GalleryTag[] = [
  "Travels",
  "Tours",
  "Couple Nights",
  "Adventures",
  "Bike Rides",
  "Festivals",
] as const;

/** Free-tier ceilings (edit to match your real Cloudinary/Supabase plan). */
export const FREE_TIER = {
  /** Max number of stored photos before we consider upgrading. */
  maxPhotos: 500,
  /** Max total storage in bytes (here: 1 GiB). */
  maxBytes: 1 * 1024 * 1024 * 1024,
  /** Used to estimate storage when real byte sizes aren't known yet. */
  avgPhotoBytes: 1.6 * 1024 * 1024,
  /** Warn (amber) at this fraction, danger (red) above `dangerAt`. */
  warnAt: 0.7,
  dangerAt: 0.9,
} as const;

/** A strict upload spec shown beside a file input and used for validation. */
export interface UploadGuide {
  label: string;
  ratio: string;
  resolution: string;
  maxMB: number;
  accept: string[];
}

export const UPLOAD_GUIDES = {
  hero: { label: "Hero image", ratio: "16:9", resolution: "≥ 1920×1080", maxMB: 2, accept: ["image/jpeg", "image/png", "image/webp"] },
  chapter: { label: "Chapter photo", ratio: "1:1 square", resolution: "≥ 1080×1080", maxMB: 2, accept: ["image/jpeg", "image/png", "image/webp"] },
  gallery: { label: "Gallery photo", ratio: "3:4 portrait", resolution: "≥ 1080×1440", maxMB: 3, accept: ["image/jpeg", "image/png", "image/webp"] },
} as const satisfies Record<string, UploadGuide>;

export type UploadGuideKey = keyof typeof UPLOAD_GUIDES;

/** Default accent gradients offered when creating content. */
export const ACCENT_PRESETS: [string, string][] = [
  ["#9c763f", "#0b0907"],
  ["#b9824a", "#0a0807"],
  ["#d9a566", "#0b0907"],
  ["#a85b32", "#0a0706"],
  ["#6b5232", "#0b0907"],
];
