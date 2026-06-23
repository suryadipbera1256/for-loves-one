/**
 * Data-driven chapters. Add / remove / reorder freely -- the root system
 * measures whatever is rendered and wires a branch to each automatically.
 *
 * To go fully per-chapter (e.g. /chapters/Chapter01/Chapter01.content.ts),
 * split this array into one file per chapter and re-export them here.
 *
 * Drop real photos in /public/image and set `image`. If a photo is missing
 * or fails to load, the card shows the `accent` gradient -- never a broken image.
 */
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

export const CHAPTERS: ChapterContent[] = [
  {
    id: "01",
    kicker: "The Spark",
    title: "The Beginning",
    body: "Where two paths first crossed. The quiet spark that started everything -- our first trip to the rocky shores.",
    meta: "01 / Memory",
    image: "/image/chapter-1.jpg",
    accent: ["#1d4ed8", "#05070d"],
  },
  {
    id: "02",
    kicker: "The Road",
    title: "Adventures",
    body: "Motorcycle rides, wrong turns, and endless laughter. The world felt bigger and brighter with you on it.",
    meta: "02 / Memory",
    image: "/image/chapter-2.jpg",
    accent: ["#0e7490", "#05070d"],
  },
  {
    id: "03",
    kicker: "Growing",
    title: "Roots Take Hold",
    body: "Small rituals, shared mornings, a rhythm that became ours. Slowly, we grew into one another.",
    meta: "03 / Memory",
    image: "/image/chapter-3.jpg",
    accent: ["#0369a1", "#05070d"],
  },
  {
    id: "04",
    kicker: "Resilience",
    title: "Weathering Storms",
    body: "Not every season was gentle. But every hard day taught us how deep these roots really run.",
    meta: "04 / Memory",
    image: "/image/chapter-4.jpg",
    accent: ["#3b82f6", "#05070d"],
  },
  {
    id: "05",
    kicker: "Flourishing",
    title: "Blooming",
    body: "Everything we planted began to flower. Dreams turned into plans, and plans into a life.",
    meta: "05 / Memory",
    image: "/image/chapter-5.jpg",
    accent: ["#60a5fa", "#05070d"],
  },
  {
    id: "06",
    kicker: "Forever",
    title: "The Journey Continues",
    body: "Still writing it, page by page. Building our future together -- one memory at a time.",
    meta: "06 / Memory",
    image: "/image/chapter-6.jpg",
    accent: ["#a5f3fc", "#05070d"],
  },
];
