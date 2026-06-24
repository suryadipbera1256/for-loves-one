/**
 * Data-access seam. Phase 1 persists to localStorage so the dashboard is fully
 * functional offline; every function is async and shaped exactly like a real
 * API client, so Phase 2 only needs to swap the bodies for `fetch()` calls.
 *
 *   PHASE 2 →  loadContent()  ===  GET  /api/content
 *              saveContent()  ===  PUT  /api/content
 *              uploadImage()  ===  POST /api/upload  (Cloudinary/Supabase)
 */

import { SEED_STATE } from "./seed";
import type { AdminContentState } from "./types";

const STORAGE_KEY = "lovesone:admin:content:v1";

/** Stable id generator (crypto when available, else a timestamp-random combo). */
export function generateId(prefix = "id"): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}_${crypto.randomUUID()}`;
  } catch {
    /* ignore */
  }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const isBrowser = () => typeof window !== "undefined";

/** Load the full content tree (seeded on first run; resilient to bad JSON). */
export async function loadContent(): Promise<AdminContentState> {
  if (!isBrowser()) return structuredCloneSafe(SEED_STATE);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredCloneSafe(SEED_STATE);
    const parsed = JSON.parse(raw) as Partial<AdminContentState>;
    // shallow shape-guard: fall back to seed for any missing slice
    return {
      home: parsed.home ?? SEED_STATE.home,
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : SEED_STATE.chapters,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : SEED_STATE.gallery,
    };
  } catch {
    return structuredCloneSafe(SEED_STATE);
  }
}

/** Persist the full content tree. Throws on quota/serialization errors. */
export async function saveContent(state: AdminContentState): Promise<void> {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Reset to the seeded baseline (used by the "restore defaults" affordance). */
export async function resetContent(): Promise<AdminContentState> {
  if (isBrowser()) window.localStorage.removeItem(STORAGE_KEY);
  return structuredCloneSafe(SEED_STATE);
}

/**
 * Phase-1 image handling: turn a File into a local object URL so previews work
 * instantly. PHASE 2: upload to Cloudinary/Supabase and return the CDN URL.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!isBrowser()) throw new Error("uploadImage must run in the browser");
  return URL.createObjectURL(file);
}

function structuredCloneSafe<T>(value: T): T {
  try {
    if (typeof structuredClone === "function") return structuredClone(value);
  } catch {
    /* ignore */
  }
  return JSON.parse(JSON.stringify(value)) as T;
}
