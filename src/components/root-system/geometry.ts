/**
 * Pure SVG path math for the hyper-realistic subterranean root ecosystem.
 * No React here so every result can be memoized cheaply.
 *
 * Tapering is the heart of the look: a stroked path has ONE width, so a root
 * that thins as it travels must be a FILLED ribbon. Every primary/connecting
 * root is therefore built as a closed polygon whose half-width eases from thick
 * (at its origin) to thin (at its tip) -- `ribbonFromCenterline`. Snaking comes
 * from Catmull-Rom-sampled Bezier centre lines (`catmullPoints` / `smoothPath`).
 *
 * Anatomy (top -> bottom of the dark-soil section):
 *   buildTrunk        Level 1   the trunk: slithers down centre, tapers to the floor
 *   buildBranches     Level 2   per-chapter connectors -- tapered, snaking ribbons
 *                     Level 2.5 each connector sprouts tiny non-connecting rootlets
 *   buildCapillaries  Level 3   dense dim hair-root background (never connects)
 *
 * Growth is revealed by a single scroll-linked mask in the components, so the
 * whole field grows 1:1 with scroll and freezes the instant scrolling stops.
 */

export type Pt = { x: number; y: number };

/** One chapter box, measured in section-local px. */
export type CardBox = {
  topY: number;
  height: number;
  innerX: number; // the edge that faces the central trunk
  centerX: number;
  side: "left" | "right";
};

/** Deterministic LCG so the field is identical across renders for one size. */
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Catmull-Rom -> cubic Bezier ("C") smoothing: organic, never-straight curves. */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Densely sample a Catmull-Rom spline through `pts` (so ribbons read smooth). */
export function catmullPoints(pts: Pt[], perSeg = 14): Pt[] {
  if (pts.length < 2) return pts.slice();
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    for (let s = 0; s < perSeg; s++) {
      const t = s / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      out.push({ x, y });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/**
 * Closed, filled ribbon along a dense centre line, half-width easing from
 * `hw0` (origin) to `hw1` (tip) by arc-length. This is what makes roots TAPER.
 */
export function ribbonFromCenterline(pts: Pt[], hw0: number, hw1: number, pow = 0.9): string {
  const n = pts.length;
  if (n < 2) return "";
  const cum = [0];
  for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  const total = cum[n - 1] || 1;

  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[i - 1] ?? pts[i];
    const next = pts[i + 1] ?? pts[i];
    let tx = next.x - prev.x;
    let ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    const nx = -ty; // unit normal
    const ny = tx;
    const hw = lerp(hw0, hw1, Math.pow(cum[i] / total, pow));
    left.push({ x: pts[i].x + nx * hw, y: pts[i].y + ny * hw });
    right.push({ x: pts[i].x - nx * hw, y: pts[i].y - ny * hw });
  }

  let d = `M ${left[0].x.toFixed(1)},${left[0].y.toFixed(1)}`;
  for (let i = 1; i < n; i++) d += ` L ${left[i].x.toFixed(1)},${left[i].y.toFixed(1)}`;
  // round the tip
  d += ` L ${right[n - 1].x.toFixed(1)},${right[n - 1].y.toFixed(1)}`;
  for (let i = n - 2; i >= 0; i--) d += ` L ${right[i].x.toFixed(1)},${right[i].y.toFixed(1)}`;
  d += " Z";
  return d;
}

/* ----------------------------------------------------------------------------
 * LEVEL 1 -- the tapering trunk
 * ------------------------------------------------------------------------- */

export type Trunk = {
  fillPath: string; // tapered ribbon body
  corePath: string; // centre line (thin pathLength stroke)
  xAt: (y: number) => number;
  topHalfWidth: number;
};

export function buildTrunk(originX: number, w: number, h: number, mobile: boolean): Trunk {
  const amp = mobile ? 14 : Math.min(Math.max(w * 0.04, 34), 64);
  const rng = makeRng(4242);
  const phase = rng() * Math.PI * 2;
  const phase2 = rng() * Math.PI * 2;

  const xAt = (y: number) => {
    const t = Math.max(0, Math.min(1, y / h));
    const ease = Math.min(1, t * 4);
    return (
      originX +
      amp * Math.sin(t * Math.PI * 3.2 + phase) * ease +
      amp * 0.34 * Math.sin(t * Math.PI * 8.5 + phase2) * ease
    );
  };

  const topHW = mobile ? 9 : 15;
  const botHW = mobile ? 1 : 1.6;

  const step = Math.max(12, h / 140);
  const center: Pt[] = [];
  for (let y = 0; y <= h; y += step) center.push({ x: xAt(y), y });
  if (center[center.length - 1].y < h) center.push({ x: xAt(h), y: h });

  return {
    fillPath: ribbonFromCenterline(center, topHW, botHW, 0.8),
    corePath: smoothPath(center),
    xAt,
    topHalfWidth: topHW,
  };
}

/* ----------------------------------------------------------------------------
 * LEVEL 2 + 2.5 -- per-chapter connectors and their sub-branch rootlets
 * ------------------------------------------------------------------------- */

export type Branches = {
  /** Level 2 connector ribbons (tapered, snaking) -- bloom on connection. */
  ribbons: string[];
  /** Level 2 centre lines (for the 1:1 pathLength bloom stroke). */
  cores: string[];
  /** Docking points where each connector physically touches the box. */
  points: Pt[];
  /** Level 2.5 non-connecting capillary rootlets sprouting off the connectors. */
  subBranches: string[];
};

/**
 * 4-5 connectors that peel from the trunk cluster just above a chapter and snake
 * to its box. Directional docking rule:
 *   LEFT card  -> top edge + RIGHT (inner) edge
 *   RIGHT card -> top edge + LEFT  (inner) edge
 * Each connector also sprouts 1-2 tiny rootlets (Level 2.5) that slither into
 * the soil and taper away without connecting to anything.
 */
export function buildBranches(trunk: Trunk, card: CardBox, index: number, mobile: boolean): Branches {
  const count = 4 + (index % 2); // 4 or 5
  const lead = mobile ? 24 : 48;
  const junctionY = Math.max(0, card.topY - lead);
  const junctionX = trunk.xAt(junctionY);

  // docking points: half across the top edge, half down the inner edge
  const onTop = Math.ceil(count / 2);
  const onEdge = count - onTop;
  const points: Pt[] = [];
  for (let k = 0; k < onTop; k++) {
    const frac = (k + 1) / (onTop + 1);
    points.push({ x: lerp(card.innerX, card.centerX, frac * 0.78), y: card.topY + 1 });
  }
  for (let k = 0; k < onEdge; k++) {
    const frac = (k + 1) / (onEdge + 1);
    points.push({ x: card.innerX, y: card.topY + card.height * (0.14 + frac * 0.5) });
  }

  const ribbons: string[] = [];
  const cores: string[] = [];
  const subBranches: string[] = [];

  const hw0 = mobile ? 3.4 : 5; // thick where it leaves the trunk cluster
  const hw1 = mobile ? 0.8 : 1.1; // thin where it docks

  points.forEach((end, k) => {
    const rng = makeRng(Math.round(end.x) * 13 + Math.round(end.y) * 7 + index * 131 + k * 17 + 5);
    // each connector grafts from a slightly different spot in the cluster
    const start: Pt = { x: junctionX + (k - (count - 1) / 2) * (mobile ? 3 : 5), y: junctionY };
    const span = mobile ? 26 : 46;
    const segs = 3 + Math.floor(rng() * 2);
    const way: Pt[] = [start];
    for (let s = 1; s < segs; s++) {
      const tt = s / segs;
      const baseX = lerp(start.x, end.x, tt);
      const baseY = lerp(start.y, end.y, tt);
      const swing = (rng() - 0.5) * 2 * span * Math.sin(tt * Math.PI);
      way.push({ x: baseX + swing, y: baseY + (rng() - 0.5) * 18 });
    }
    way.push(end);

    const dense = catmullPoints(way, 16);
    ribbons.push(ribbonFromCenterline(dense, hw0, hw1, 0.85));
    cores.push(smoothPath(way));

    // Level 2.5: sprout 1-2 rootlets partway along this connector
    const sprouts = 1 + (rng() < 0.5 ? 1 : 0);
    for (let sp = 0; sp < sprouts; sp++) {
      const at = Math.floor(dense.length * (0.35 + rng() * 0.4));
      const base = dense[Math.min(at, dense.length - 1)];
      const dir = rng() < 0.5 ? -1 : 1;
      const rlen = mobile ? 34 + rng() * 26 : 54 + rng() * 50;
      const rseg = 2 + Math.floor(rng() * 2);
      const rway: Pt[] = [base];
      let a = (rng() - 0.5) * 0.8 + (dir > 0 ? 0.5 : Math.PI - 0.5); // out & slightly down
      let cx = base.x;
      let cy = base.y;
      for (let r = 1; r <= rseg; r++) {
        a += (rng() - 0.5) * 0.9;
        cx += Math.cos(a) * (rlen / rseg);
        cy += Math.abs(Math.sin(a)) * (rlen / rseg) + (rlen / rseg) * 0.25; // bias downward into soil
        rway.push({ x: cx, y: cy });
      }
      subBranches.push(ribbonFromCenterline(catmullPoints(rway, 10), mobile ? 1.4 : 1.9, 0.15, 0.7));
    }
  });

  return { ribbons, cores, points, subBranches };
}

/* ----------------------------------------------------------------------------
 * LEVEL 3 -- ambient capillary network (background only, never connects)
 * ------------------------------------------------------------------------- */

export function buildCapillaries(
  originX: number,
  w: number,
  h: number,
  mobile: boolean
): { layers: string[]; segments: number } {
  const rng = makeRng(99173);
  const LAYERS = 3;
  const buckets: string[][] = Array.from({ length: LAYERS }, () => []);
  let segments = 0;

  const maxDepth = mobile ? 5 : 6;
  const grow = (
    x: number,
    y: number,
    ang: number,
    len: number,
    depth: number,
    layer: number,
    spread: number
  ) => {
    if (depth > maxDepth || y > h + 20 || len < 4) return;
    const segs = 2 + Math.floor(rng() * 2);
    let cx = x;
    let cy = y;
    let a = ang;
    let d = `M${cx.toFixed(1)} ${cy.toFixed(1)}`;
    const step = len / segs;
    for (let i = 0; i < segs; i++) {
      a += (rng() - 0.5) * spread;
      const nx = cx + Math.cos(a) * step + (rng() - 0.5) * 5;
      const ny = cy + Math.abs(Math.sin(a)) * step + step * 0.3;
      const mx = (cx + nx) / 2 + (rng() - 0.5) * 7;
      const my = (cy + ny) / 2;
      d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      cx = nx;
      cy = ny;
      segments++;
      if (rng() < 0.7) {
        grow(cx, cy, a + (rng() < 0.5 ? -1 : 1) * (0.45 + rng() * 0.6), len * 0.66, depth + 1, layer, spread * 1.06);
      }
    }
    buckets[layer].push(d);
  };

  const strands = mobile ? 28 : 50;
  for (let i = 0; i < strands; i++) {
    const sx = ((i + 0.5) / strands) * w + (rng() - 0.5) * 24;
    const sy = rng() * h * 0.08;
    const baseAng = (rng() - 0.5) * Math.PI;
    grow(sx, sy, baseAng, (mobile ? 60 : 92) + rng() * 70, 0, i % LAYERS, 0.7);
  }

  return { layers: buckets.map((b) => b.join(" ")), segments };
}
