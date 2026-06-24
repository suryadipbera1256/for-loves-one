"use client";

import { HoloPhoto } from "./HoloPhoto";
import type { ChapterContent } from "../types";

/**
 * The triple-photo array (visual core of the card). A dynamic masonry: one
 * hero frame plus two stacked frames. The hero sits on the side facing the
 * trunk so the photos lean into the incoming roots. Each frame is a HoloPhoto
 * (3D tilt + holographic glare). Photos resolve from `images`, then `image`,
 * then a per-frame accent gradient.
 */
export function PhotoArray({
  chapter,
  side,
  active,
}: {
  chapter: ChapterContent;
  side: "left" | "right";
  active: boolean;
}) {
  const pool = chapter.images?.length ? chapter.images : chapter.image ? [chapter.image] : [];
  const srcAt = (i: number) => pool[i] ?? pool[i % Math.max(pool.length, 1)] ?? undefined;
  const heroLeft = side === "left"; // hero frame toward the trunk (inner) side

  return (
    <div className="grid h-[190px] grid-cols-5 grid-rows-2 gap-2 md:h-[216px]">
      <HoloPhoto
        src={srcAt(0)}
        index={0}
        accent={chapter.accent}
        alt={`${chapter.title} — photo 1`}
        active={active}
        className={heroLeft ? "col-span-3 row-span-2" : "col-span-3 col-start-3 row-span-2"}
      />
      <HoloPhoto
        src={srcAt(1)}
        index={1}
        accent={chapter.accent}
        alt={`${chapter.title} — photo 2`}
        active={active}
        className={heroLeft ? "col-span-2 col-start-4" : "col-span-2 col-start-1 row-start-1"}
      />
      <HoloPhoto
        src={srcAt(2)}
        index={2}
        accent={chapter.accent}
        alt={`${chapter.title} — photo 3`}
        active={active}
        className={heroLeft ? "col-span-2 col-start-4 row-start-2" : "col-span-2 col-start-1 row-start-2"}
      />
    </div>
  );
}
