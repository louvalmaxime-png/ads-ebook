// Design box: every scene is laid out in a 900 x 980 space, i.e. the Reels
// text-safe zone of the 1080 x 1920 master (x 90-990, y 270-1250).
export const BOX = {w: 900, h: 980};

export type Fmt = '916' | '45';
const S45 = 960 / 900;
export const PLACE: Record<Fmt, {x: number; y: number; s: number}> = {
  '916': {x: 90, y: 270, s: 1},
  '45': {x: 60, y: (1350 - BOX.h * S45) / 2, s: S45},
};

// S4 orbit
export const ORBIT = {cx: 450, cy: 600, r: 198};
export const DIAG = ORBIT.r * Math.SQRT1_2;

// S5 pack: pack.jpg pixels -> box pixels
export const PACK = {x0: 71.5, y0: 100, s: 0.846, sx: 55, sy: 222};
export const packX = (sx: number) => PACK.x0 + (sx - PACK.sx) * PACK.s;
export const packY = (sy: number) => PACK.y0 + (sy - PACK.sy) * PACK.s;

// Intensity cut-out (from problem.jpg, crop origin 1085,575, 840 x 1190):
// silhouette centre (1500, 1161.5) -> (415, 586.5) in the image, height 1075.
export const INT_IMG = {w: 840, h: 1190, cx: 415, cy: 586.5, silH: 1075};
// In the pack its front cover (1141,640 / 1033 px tall) sits on the left
// book of pack.jpg (85,244 / 473 px tall).
const K5 = (473 / 1033) * PACK.s;
const LEFT5 = packX(85) - (1141 - 1085) * K5;
const TOP5 = packY(244) - (640 - 575) * K5;
export const INT_S4 = {cx: ORBIT.cx, cy: ORBIT.cy, h: 372, rot: 6};
export const INT_S5 = {
  cx: LEFT5 + INT_IMG.cx * K5,
  // 14px up: keeps the hardcover's page block hidden behind Volume
  cy: TOP5 + INT_IMG.cy * K5 - 14,
  h: INT_IMG.silH * K5,
  rot: 0,
};
