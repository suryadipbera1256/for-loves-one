/**
 * Color tokens for the Root Network experience -- the original subtle
 * cyan / sky-blue "Neon Bloom" palette. Mirrors the CSS custom properties
 * in globals.css so the same palette is available to Tailwind arbitrary
 * values (var(--token)) and inline SVG fills / JS gradients.
 */
export const COLORS = {
  bgVoid: "#060504", // near-black soil base
  bgSoil: "#0b0907", // slightly lifted soil panel
  canopyHi: "#f6f1e6", // bright canopy (hero top)
  canopyLo: "#ece2cc", // warm canopy mid
  rootIdleFrom: "#322a20", // dormant root stroke (gradient start)
  rootIdleTo: "#4a3d2c", // dormant root stroke (gradient end)
  bloomTip: "#fde8c4", // brightest leading edge (cyan-200)
  bloomCore: "#f1c789", // primary neon bloom (cyan-400)
  bloomMid: "#d9a566", // cyan-500
  bloomDeep: "#b9824a", // sky-600
  bloomHalo: "#e8b977", // soft outer glow tint
  textHi: "#e2e8f0",
  textLo: "#94a3b8",
} as const;

export type ColorToken = keyof typeof COLORS;
