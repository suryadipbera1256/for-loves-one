import type { FC } from "react";

/** Content for a single chapter (lives in each chapter's own folder). */
export interface ChapterContent {
  id: string;
  kicker: string;
  title: string;
  body: string;
  meta: string;
  image?: string;
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
