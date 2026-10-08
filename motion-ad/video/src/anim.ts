import {Easing, interpolate, spring} from 'remotion';

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const prog = (f: number, start: number, dur: number, easing = EASE) =>
  interpolate(f, [start, start + dur], [0, 1], {...CLAMP, easing});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type SpringCfg = {stiffness?: number; damping?: number; mass?: number};
export const spr = (f: number, start: number, cfg: SpringCfg = {}) =>
  spring({
    frame: f - start,
    fps: 30,
    config: {mass: 1, stiffness: 200, damping: 21, ...cfg},
  });

// pop: spring .7 -> 1 with ~3% overshoot
export const pop = (f: number, start: number) => lerp(0.7, 1, spr(f, start));

// slow push-in for holds
export const pushIn = (f: number, start: number, end: number, amount = 0.02) =>
  1 + amount * interpolate(f, [start, end], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});

// decaying micro-shake
export const shake = (f: number, start: number, dur = 6, amp = 4) => {
  const t = (f - start) / dur;
  if (t < 0 || t > 1) return {x: 0, y: 0};
  const k = amp * (1 - t);
  return {x: k * Math.sin(f * 2.9), y: k * Math.cos(f * 3.7)};
};

// slam: scale 1.15 -> 1 in 6f, hidden before start
export const slam = (f: number, start: number) =>
  f < start ? null : lerp(1.15, 1, prog(f, start, 6));
