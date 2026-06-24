/**
 * Content for the Home ("Genesis / The Surface") experience. Everything here is
 * data so the page stays declarative and easy to re-edit. Photos fall back to
 * the accent gradient when a file is missing, so the page is never broken.
 */

export type Accent = [from: string, to: string];

export const HERO = {
  kicker: "Genesis — the surface of a love story",
  // each line animates up behind a mask, in order
  lines: ["Before the roots,", "there was light."],
  subtitle:
    "Every deep thing begins at the surface. This is where ours did — two paths, one quiet spark, the first warmth before everything grew downward.",
  cta: "Begin the descent",
  scrollHint: "scroll to grow",
  image: "/image/home header.jpg",
} as const;

/** Sticky "card-deck" movements that stack as you scroll. */
export const STACK: {
  id: string;
  numeral: string;
  kicker: string;
  title: string;
  body: string;
  accent: Accent;
  image?: string;
}[] = [
  {
    id: "surface",
    numeral: "I",
    kicker: "The Surface",
    title: "Where the light first touched us",
    body: "A glance that lasted a second too long. A conversation that refused to end. On the surface it looked like chance — but something was already reaching for the dark, looking for somewhere to take hold.",
    accent: ["#9c763f", "#0b0907"],
    image: "/image/home header.jpg",
  },
  {
    id: "growth",
    numeral: "II",
    kicker: "The Growth",
    title: "A thousand small days, becoming one life",
    body: "Shared mornings, wrong turns, inside jokes, ordinary Tuesdays. None of it looked monumental. All of it was. The surface filled with warmth while, beneath it, we quietly became inseparable.",
    accent: ["#b9824a", "#0a0807"],
    image: "/image/roadmap header.jpg",
  },
  {
    id: "descent",
    numeral: "III",
    kicker: "The Descent",
    title: "Then we grew downward — into roots",
    body: "What began as light became something deeper and unshakeable. Below the surface, the real story spreads out in the dark. Follow it into the Roadmap, where the roots remember everything.",
    accent: ["#d9a566", "#0b0907"],
  },
];

/** Animated stat counters. `daysSince` computes live from a start date. */
export const TOGETHER_SINCE = "2019-06-23"; // edit to your real anniversary

export const STATS: { label: string; value: number; suffix?: string; daysSince?: boolean }[] = [
  { label: "Days together", value: 0, daysSince: true },
  { label: "Memories made", value: 1240, suffix: "+" },
  { label: "Adventures shared", value: 86 },
  { label: "Cups of coffee", value: 2300, suffix: "+" },
];

/** Frames for the auto-scrolling "A Glimpse of Us" marquee. */
export const GALLERY: { accent: Accent; image?: string }[] = [
  { accent: ["#9c763f", "#0b0907"], image: "/image/home header.jpg" },
  { accent: ["#7a5f3a", "#0a0807"] },
  { accent: ["#b9824a", "#0b0907"], image: "/image/roadmap header.jpg" },
  { accent: ["#d9a566", "#0a0807"] },
  { accent: ["#8a6a40", "#0b0907"] },
  { accent: ["#b9824a", "#060504"], image: "/image/home header.jpg" },
  { accent: ["#9c763f", "#0a0807"] },
  { accent: ["#6b5232", "#0b0907"] },
  { accent: ["#d9a566", "#060504"], image: "/image/roadmap header.jpg" },
  { accent: ["#7a5f3a", "#0b0907"] },
];

export const QUOTE =
  "Some love grows on the surface. Ours grew downward — into roots nothing could pull apart.";

/** Days between a YYYY-MM-DD date and today (computed on the client). */
export function daysSince(iso: string): number {
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}
