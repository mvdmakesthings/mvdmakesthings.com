// Tiny axonometric drawing kit for the hero remote. Everything here runs at build
// time; the browser only receives the finished SVG path data.
//
// World axes: x across the remote, y along it (y = 0 is the IR end), z up.

export type P2 = [number, number];
export type P3 = [number, number, number];

const X: P2 = [0.42, 0.44];
const Y: P2 = [0.95, -0.27];
const Z = 0.92;

export function project([x, y, z]: P3): P2 {
  return [x * X[0] + y * Y[0], x * X[1] + y * Y[1] - z * Z];
}

const n = (v: number) => (Math.round(v * 10) / 10).toString();

/** Closed path through projected points. */
export function poly(points: P2[]): string {
  return 'M' + points.map(([x, y]) => `${n(x)} ${n(y)}`).join('L') + 'Z';
}

/** Open path through projected points. */
export function line(points: P2[]): string {
  return 'M' + points.map(([x, y]) => `${n(x)} ${n(y)}`).join('L');
}

/** Outline of a rounded rectangle lying flat at height z. */
export function roundRect(x0: number, y0: number, w: number, h: number, r: number, z: number): P3[] {
  const out: P3[] = [];
  const corners: [number, number, number][] = [
    [x0 + w - r, y0 + r, -90],
    [x0 + w - r, y0 + h - r, 0],
    [x0 + r, y0 + h - r, 90],
    [x0 + r, y0 + r, 180],
  ];
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= 3; i++) {
      const a = ((start + i * 30) * Math.PI) / 180;
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]);
    }
  }
  return out;
}

/** Circle lying flat at height z. */
export function circle(cx: number, cy: number, r: number, z: number, steps = 16): P3[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z] as P3;
  });
}

/** Circle standing upright, facing along y (the cross-section of a cylinder lying along y). */
export function ring(cx: number, y: number, cz: number, r: number, steps = 16): P3[] {
  return Array.from({ length: steps }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)] as P3;
  });
}

export function lift(outline: P3[], dz: number): P3[] {
  return outline.map(([x, y, z]) => [x, y, z + dz]);
}

/** Convex hull (monotone chain) of projected points. */
export function hull(points: P2[]): P2[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: P2[] = [];
  for (const pt of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) lower.pop();
    lower.push(pt);
  }
  const upper: P2[] = [];
  for (const pt of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) upper.pop();
    upper.push(pt);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

export interface Solid {
  /** Visible side walls: the silhouette with the top face cut out (use fill-rule evenodd). */
  side: string;
  top: string;
  topOutline: P2[];
}

/** Extrude a flat outline upward by t. */
export function extrude(outline: P3[], t: number): Solid {
  const bottom = outline.map(project);
  const topOutline = lift(outline, t).map(project);
  return {
    side: poly(hull([...bottom, ...topOutline])) + poly(topOutline),
    top: poly(topOutline),
    topOutline,
  };
}

/** A cylinder lying along y, from y0 to y1. Returns its body silhouette and its near cap. */
export function cylinder(cx: number, cz: number, r: number, y0: number, y1: number) {
  const near = ring(cx, y0, cz, r).map(project);
  const far = ring(cx, y1, cz, r).map(project);
  return { body: poly(hull([...near, ...far])), cap: poly(near) };
}

export function bounds(points: P2[]) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}
