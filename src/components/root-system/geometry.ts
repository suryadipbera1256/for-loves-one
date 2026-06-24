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

  // Thick, heavy and mature at the crown, tapering to a thread at the floor --
  // a real main root. (Half-widths: full stroke is ~2x these.)
  const topHW = mobile ? 15 : 26;
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
 * DYNAMIC TRUNK SYSTEM -- scales to any chapter count
 * ------------------------------------------------------------------------- */

/**
 * Beyond this many chapters a single trunk would have to taper toward nothing to
 * serve them all, so we spawn a major sub-trunk to share the load. Tuned so the
 * current roadmap (<= this) is byte-for-byte the existing single trunk.
 */
export const MAX_CHAPTERS_PER_TRUNK = 22;
/** Chapters each trunk comfortably serves once we've decided to split. */
const TRUNK_BLOCK = 14;
/** Hard minimum half-width: a trunk never tapers below this (stays visible). */
const MIN_HALF_WIDTH = 1.6;

export type TrunkSegment = {
  id: string;
  fillPath: string;
  corePath: string;
  xAt: (y: number) => number;
  /** Inclusive-exclusive chapter index range this trunk feeds. */
  serves: [number, number];
};

/** Build a filled+core trunk ribbon from an arbitrary centre-line function. */
function ribbonFromXAt(
  xAt: (y: number) => number,
  yStart: number,
  yEnd: number,
  hw0: number,
  hw1: number,
  pow: number
): { fillPath: string; corePath: string } {
  const span = Math.max(1, yEnd - yStart);
  const step = Math.max(12, span / 120);
  const center: Pt[] = [];
  for (let y = yStart; y <= yEnd; y += step) center.push({ x: xAt(y), y });
  if (center[center.length - 1].y < yEnd) center.push({ x: xAt(yEnd), y: yEnd });
  return { fillPath: ribbonFromCenterline(center, hw0, hw1, pow), corePath: smoothPath(center) };
}

/**
 * The dynamic root engine. Returns one trunk for normal counts (identical to the
 * existing single trunk) and, once the count exceeds the threshold on desktop,
 * a primary trunk plus one or more sub-trunks that branch off it, slither out to
 * one side and take over the overflow chapters -- each tapering to a visible
 * floor (never invisible). Mobile keeps a single floored left-rail trunk.
 *
 * @returns `trunks` to render and `trunkForIndex(i)` to pick which trunk a given
 *          chapter grafts its connectors from.
 */
export function buildTrunkSystem(
  originX: number,
  count: number,
  w: number,
  h: number,
  mobile: boolean
): { trunks: TrunkSegment[]; trunkForIndex: (i: number) => TrunkSegment } {
  const n = Math.max(1, Math.floor(count));

  // Single trunk (current behaviour) — small counts, or always on mobile.
  if (mobile || n <= MAX_CHAPTERS_PER_TRUNK) {
    const t = buildTrunk(originX, w, h, mobile);
    const seg: TrunkSegment = { id: "trunk-0", fillPath: t.fillPath, corePath: t.corePath, xAt: t.xAt, serves: [0, n] };
    return { trunks: [seg], trunkForIndex: () => seg };
  }

  // Overflow → primary trunk + sub-trunk(s).
  const k = Math.ceil(n / TRUNK_BLOCK);
  const block = Math.ceil(n / k);
  const amp = Math.min(Math.max(w * 0.04, 34), 64);
  const topHW = 26;

  const main = buildTrunk(originX, w, h, mobile);
  const segs: TrunkSegment[] = [
    { id: "trunk-0", fillPath: main.fillPath, corePath: main.corePath, xAt: main.xAt, serves: [0, Math.min(block, n)] },
  ];

  for (let j = 1; j < k; j++) {
    const start = j * block;
    const end = Math.min((j + 1) * block, n);
    if (start >= n) break;

    const yBranch = h * (start / n); // depth where this sub-trunk leaves the main
    const side = j % 2 === 1 ? 1 : -1;
    const offset = side * Math.min(w * 0.2, 200);
    const rng = makeRng(7000 + j * 131);
    const phase = rng() * Math.PI * 2;
    const branchX = main.xAt(yBranch);
    const targetX = originX + offset;

    const subXAt = (y: number) => {
      if (y <= yBranch) return main.xAt(y);
      const t = Math.min(1, (y - yBranch) / Math.max(1, h - yBranch));
      const ease = 1 - Math.pow(1 - Math.min(1, t * 2.2), 3); // ease out to the offset early
      const baseX = branchX + (targetX - branchX) * ease;
      return baseX + amp * 0.5 * Math.sin(t * Math.PI * 3 + phase); // keep slithering
    };

    // start as thick as the main trunk is at the branch, taper to the floor
    const hwAtBranch = Math.max(MIN_HALF_WIDTH, topHW * (1 - (yBranch / h) * 0.7));
    const ribbon = ribbonFromXAt(subXAt, yBranch, h, Math.max(12, hwAtBranch * 0.85), MIN_HALF_WIDTH, 0.85);
    segs.push({ id: `trunk-${j}`, fillPath: ribbon.fillPath, corePath: ribbon.corePath, xAt: subXAt, serves: [start, end] });
  }

  const trunkForIndex = (i: number) => segs.find((s) => i >= s.serves[0] && i < s.serves[1]) ?? segs[0];
  return { trunks: segs, trunkForIndex };
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
export function buildBranches(trunk: Pick<Trunk, "xAt">, card: CardBox, index: number, mobile: boolean): Branches {
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
    // On mobile the trunk runs down a left rail, so keep top docks near the
    // inner edge (less reach across the card) for clean, fully-visible roots.
    points.push({ x: lerp(card.innerX, card.centerX, frac * (mobile ? 0.45 : 0.92)), y: card.topY + 1 });
  }
  for (let k = 0; k < onEdge; k++) {
    const frac = (k + 1) / (onEdge + 1);
    points.push({ x: card.innerX, y: card.topY + card.height * (0.14 + frac * 0.5) });
  }

  const ribbons: string[] = [];
  const cores: string[] = [];
  const subBranches: string[] = [];

  const hw0 = mobile ? 4 : 7; // medium where it splits off the trunk
  const hw1 = mobile ? 0.35 : 0.5; // fine tip exactly at the chapter

  points.forEach((end, k) => {
    const rng = makeRng(Math.round(end.x) * 13 + Math.round(end.y) * 7 + index * 131 + k * 17 + 5);
    // each connector grafts from a slightly different spot in the cluster
    const start: Pt = { x: junctionX + (k - (count - 1) / 2) * (mobile ? 4 : 9), y: junctionY };
    // gentler horizontal swing on mobile so connectors stay inside the narrow viewport
    const span = mobile ? 26 : 66;
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
    ribbons.push(ribbonFromCenterline(dense, hw0, hw1, 0.9));
    cores.push(smoothPath(way));

    // Level 2.5: sprout 1-2 rootlets partway along this connector
    const sprouts = 1 + (rng() < 0.5 ? 1 : 0);
    for (let sp = 0; sp < sprouts; sp++) {
      const at = Math.floor(dense.length * (0.35 + rng() * 0.4));
      const base = dense[Math.min(at, dense.length - 1)];
      const dir = rng() < 0.5 ? -1 : 1;
      const rlen = mobile ? 46 + rng() * 32 : 72 + rng() * 64;
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
      subBranches.push(ribbonFromCenterline(catmullPoints(rway, 10), mobile ? 2 : 2.7, 0.2, 0.7));
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

  // Kept deliberately shallow + sparse: Level 3 is a faint ambient depth haze,
  // not a dense web -- so the glowing Level 1 / Level 2 roots stay the heroes.
  const maxDepth = mobile ? 2 : 3;
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
      // sparse, occasional forking only
      if (depth < maxDepth && rng() < 0.32) {
        grow(cx, cy, a + (rng() < 0.5 ? -1 : 1) * (0.45 + rng() * 0.6), len * 0.62, depth + 1, layer, spread * 1.06);
      }
    }
    buckets[layer].push(d);
  };

  // Sparse network spread EVENLY across the entire width (left, centre, right).
  // Few strands, evenly-slotted then jittered, so the haze is balanced and calm.
  const strands = mobile ? 9 : 16;
  const slotW = w / strands;
  const slots = Array.from({ length: strands }, (_, i) => (i + 0.5) * slotW);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = slots[i];
    slots[i] = slots[j];
    slots[j] = tmp;
  }
  for (let i = 0; i < strands; i++) {
    const sx = slots[i] + (rng() - 0.5) * slotW; // jitter within its slot -> even but organic
    const sy = rng() * h * 0.14;
    // symmetric horizontal launch so strands fan both ways equally
    const baseAng = (rng() - 0.5) * Math.PI;
    grow(sx, sy, baseAng, (mobile ? 80 : 120) + rng() * 90, 0, i % LAYERS, 0.74);
  }

  return { layers: buckets.map((b) => b.join(" ")), segments };
}
