"use client";

import { ChapterCard } from "../ChapterCard";
import type { ChapterComponentProps } from "../types";
import { content } from "./content";

/** Chapter 07 module -- binds its content to the shared glass card. */
export function Chapter07({ active, side }: ChapterComponentProps) {
  return <ChapterCard chapter={content} active={active} side={side} />;
}
