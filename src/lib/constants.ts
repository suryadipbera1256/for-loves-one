// Defining the strict structure for the timeline events
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  /** Grid span classes - used by the gallery BentoGrid only. */
  className?: string;
  /** Two raw CSS colors for the graceful gradient fallback when the photo is missing. */
  accent?: [string, string];
  /** Short kicker shown above the chapter title. */
  kicker?: string;
}

// Pre-populated story sequence.
// Drop real photos into /public/image and point `mediaUrl` at them (e.g. "/image/chapter-1.jpg").
// Until a photo exists the card shows a polished gradient placeholder - never a broken image.
export const STORY_DATA: TimelineEvent[] = [
  {
    id: "1",
    title: "The Beginning",
    description:
      "Where two paths first crossed. The quiet spark that started everything - our first trip to the rocky shores.",
    kicker: "Chapter One / The Spark",
    mediaUrl: "/image/chapter-1.jpg",
    mediaType: "image",
    accent: ["#0e7490", "#0a0a0a"],
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "2",
    title: "Adventures",
    description:
      "Motorcycle rides, wrong turns, and endless laughter. The world felt bigger and brighter with you on it.",
    kicker: "Chapter Two / The Road",
    mediaUrl: "/image/chapter-2.jpg",
    mediaType: "image",
    accent: ["#155e75", "#0a0a0a"],
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "3",
    title: "Roots Take Hold",
    description:
      "Small rituals, shared mornings, a rhythm that became ours. Slowly, we grew into one another.",
    kicker: "Chapter Three / Growing",
    mediaUrl: "/image/chapter-3.jpg",
    mediaType: "image",
    accent: ["#0369a1", "#0a0a0a"],
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "4",
    title: "Weathering Storms",
    description:
      "Not every season was gentle. But every hard day taught us how deep these roots really run.",
    kicker: "Chapter Four / Resilience",
    mediaUrl: "/image/chapter-4.jpg",
    mediaType: "image",
    accent: ["#1e40af", "#0a0a0a"],
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "5",
    title: "Blooming",
    description:
      "Everything we planted began to flower. Dreams turned into plans, and plans into a life.",
    kicker: "Chapter Five / Flourishing",
    mediaUrl: "/image/chapter-5.jpg",
    mediaType: "image",
    accent: ["#0891b2", "#0a0a0a"],
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "6",
    title: "The Journey Continues",
    description:
      "Still writing it, page by page. Building our future together - one memory at a time.",
    kicker: "Chapter Six / Forever",
    mediaUrl: "/image/chapter-6.jpg",
    mediaType: "image",
    accent: ["#06b6d4", "#0a0a0a"],
    className: "md:col-span-2 md:row-span-2",
  },
];
