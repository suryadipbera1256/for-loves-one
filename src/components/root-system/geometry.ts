/**
 * Pure SVG path math for the 3-level organic root system. No React here so
 * every result can be memoized cheaply.
 *
 * EVERYTHING originates from one point: the heart at (originX, 0), at the peak
 * of the black curve under the image. Nothing spawns mid-screen.
 *
 *   Level 1  buildMain        -> snake-walking central trunk (never touches nodes)
 *   Level 2  buildConnectors  -> per-chapter branches from origin -> distinct
 *                                points on that chapter's box
 *            buildDecoys      -> Level 2 branches that descend but never connect
 *   Level 3  buildCapillaries -> dense hair fan from the origin, flattened into
 *                                a FEW <path> strings for performance
 */

export type Pt = { x: number; y: number };

export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

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

export type Geometry = { w: number; h: number; mobile: boolean; originX: number; mainPath: string };

/** LEVEL 1 -- trunk: starts at origin, "snake walks" down the centre. */
export function buildMain(originX: number, w: number, h: number, mobile: boolean): Geometry {
  const amp = mobile ? 16 : Math.min(Math.max(w * 0.045, 36), 70);
  const rng = makeRng(4242);
  const phase = rng() * Math.PI;
  const pts: Pt[] = [{ x: originX, y: 0 }];
  const step = Math.max(16, h / 90);
  for (let y = step; y <= h; y += step) {
    const t = y / h;
    // serpentine wobble, eased in from the origin so the top stays anchored
    const x =
      originX +
      amp * Math.sin(t * Math.PI * 5 + phase) * Math.min(1, t * 5) +
      amp * 0.3 * Math.sin(t * Math.PI * 11 + phase * 1.7);
    pts.push({ x, y });
  }
  pts.push({ x: originX, y: h });
  return { w, h, mobile, originX, mainPath: smoothPath(pts) };
}

/**
 * LEVEL 2 (connecting) -- one branch per attach point. Each starts at the
 * origin, stays bundled near the trunk, then peels off in its lower portion
 * to a DISTINCT point on the chapter box.
 */
export function buildConnectors(originX: number, points: Pt[]): string[] {
  return points.map((end, i) => {
    const rng = makeRng(Math.round(end.x) * 13 + Math.round(end.y) * 7 + i * 101 + 5);
    const lateral = (i - (points.length - 1) / 2) * (12 + rng() * 8);
    const peel = end.y * (0.5 + rng() * 0.18);
    const c1 = { x: originX + lateral * 0.5, y: end.y * 0.32 };
    const c2 = { x: originX + (end.x - originX) * 0.42 + lateral, y: peel };
    return `M ${originX.toFixed(1)},0 C ${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${end.x.toFixed(1)},${end.y.toFixed(1)}`;
  });
}

/** LEVEL 2 (decoys) -- branches that grow from the origin but never connect. */
export function buildDecoys(originX: number, w: number, h: number, mobile: boolean): string[] {
  const rng = makeRng(2024);
  const n = mobile ? 5 : 9;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const dir = rng() < 0.5 ? -1 : 1;
    const endX = originX + dir * (w * (0.08 + rng() * 0.32));
    const endY = h * (0.4 + rng() * 0.55);
    const lateral = dir * (10 + rng() * 30);
    const c1 = { x: originX + lateral * 0.4, y: endY * 0.34 };
    const c2 = { x: originX + (endX - originX) * 0.5, y: endY * (0.6 + rng() * 0.15) };
    out.push(
      `M ${originX.toFixed(1)},0 C ${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`
    );
  }
  return out;
}

/**
 * LEVEL 3 -- dense capillary background, all fanning out FROM THE ORIGIN and
 * curling left/right ("snake walk"). Flattened into `layers` path strings.
 */
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

  const strands = mobile ? 28 : 52;
  const fan = 1.2;
  for (let s = 0; s < strands; s++) {
    const ang = Math.PI / 2 + (rng() * 2 - 1) * fan;
    const layer = rng() < 0.42 ? 0 : rng() < 0.72 ? 1 : 2;
    grow(originX, 0, ang, h * (0.5 + rng() * 0.55), 0, layer, 0.7 + rng() * 0.5);
  }

  return { layers: buckets.map((b) => b.join(" ")), segments };
}
