import type { FC } from "react";

/** Content for a single chapter (lives in each chapter's own folder). */
export interface ChapterContent {
  id: string;
  kicker: string;
  title: string;
  body: string;
  meta: string;
  image?: string;
  /**
   * Up to 3 photos for the triple-photo array. Missing/failed photos fall back
   * to the accent gradient, so the array always looks intentional. If omitted,
   * `image` is used for all three frames.
   */
  images?: string[];
  /**
   * Long-form "Moral of the Story" narrative (any length) shown on the flip
   * side, in English and Bengali. Paragraphs split on blank lines. Falls back
   * to `body` when absent.
   */
  story?: { en: string; bn: string };
  /** [from, to] raw CSS colors for the graceful gradient fallback. */
  accent: [string, string];
}

/** Props the RootSystem injects into every chapter module. */
export interface ChapterComponentProps {
  active: boolean;
  side: "left" | "right";
}

/** A registered chapter: an id (for keys/measuring) + its component. */
export interface ChapterModule {
  id: string;
  Component: FC<ChapterComponentProps>;
}
