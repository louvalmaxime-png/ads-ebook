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

// Book poses (box px, degrees). S4 copies the tilt of instrument.jpg,
// S5 the pack of pack.jpg: spine shows on the left book, pages on the right one.
export const POSE = {
  s4: {cx: ORBIT.cx, cy: ORBIT.cy, h: 380, rx: 6, ry: -30, rz: 7},
  s4Drop: {cx: ORBIT.cx, cy: ORBIT.cy - 170, h: 360, rx: 14, ry: -52, rz: -6},
  intensity: {cx: 218, cy: 330, h: 398, rx: 0, ry: 20, rz: 0},
  volume: {cx: 450, cy: 322, h: 410, rx: 0, ry: 0, rz: 0},
  periodization: {cx: 682, cy: 330, h: 398, rx: 0, ry: -20, rz: 0},
};
