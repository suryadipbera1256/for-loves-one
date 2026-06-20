"use client";

import { BentoItem } from "./BentoItem";
import { STORY_DATA } from "@/lib/constants";

// Master container orchestrating the CSS Grid layout
export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 p-4 max-w-7xl mx-auto">
      {STORY_DATA.map((item) => (
        <BentoItem key={item.id} item={item} />
      ))}
    </div>
  );
}