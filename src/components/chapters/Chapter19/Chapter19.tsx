"use client";

import { ChapterCard } from "../ChapterCard";
import type { ChapterComponentProps } from "../types";
import { content } from "./content";

/** Chapter 19 module -- binds its content to the shared glass card. */
export function Chapter19({ active, side }: ChapterComponentProps) {
  return <ChapterCard chapter={content} active={active} side={side} />;
}
