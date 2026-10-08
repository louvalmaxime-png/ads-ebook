import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {C, body} from '../theme';
import {CLAMP, EASE_IN, EASE_IO, lerp, pop, prog, spr} from '../anim';
import {DIAG, ORBIT} from '../layout';

// Ruler as in hard.jpg: 10 segments, full-height majors, 4 floating minors.
export const RULER = {x0: 20, seg: 86, top: 676, base: 740};
const MINOR = {y0: 694, y1: 724};
type Tick = {x: number; y0: number; y1: number; major: boolean};
const TICKS: Tick[] = [];
for (let k = 0; k <= 10; k++) {
  TICKS.push({x: RULER.x0 + RULER.seg * k, y0: RULER.top, y1: RULER.base, major: true});
  if (k < 10) {
    for (let j = 1; j <= 4; j++) {
      TICKS.push({x: RULER.x0 + RULER.seg * (k + j / 5), y0: MINOR.y0, y1: MINOR.y1, major: false});
    }
  }
}
const N = TICKS.length;
const orbitPoint = (n: number) => {
  const a = Math.PI + (2 * Math.PI * n) / N;
  return {x: ORBIT.cx + ORBIT.r * Math.cos(a), y: ORBIT.cy + ORBIT.r * Math.sin(a)};
};

const LOCK = 7; // the marker locks on MIC 7
const DOT = 7;

// 226-420: ruler (S3) -> dotted orbit (S4) -> collapse (S5).
export const RulerOrbit: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 226 || f > 425) return null;
  const baseIn = prog(f, 226, 16);
  const baseOut = prog(f, 300, 6, EASE_IN);
  return (
    <>
      <svg width={900} height={980} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {baseOut < 1 && (
          <line
            x1={RULER.x0 + 430 * baseOut}
            y1={RULER.base}
            x2={RULER.x0 + 860 * baseIn - 430 * baseOut}
            y2={RULER.base}
            stroke={C.lines}
            strokeWidth={2.5}
          />
        )}
        {TICKS.map((t, n) => {
          const grow = prog(f, 228 + n * 0.32, 8);
          if (grow <= 0) return null;
          const m = prog(f, 300 + n * 0.2, 12, EASE_IO);
          const out = prog(f, 405 + n * 0.2, 8, EASE_IN);
          if (out >= 1) return null;
          const p = orbitPoint(n);
          const fullLen = t.y1 - t.y0;
          const len0 = fullLen * grow;
          const cy0 = t.major ? t.y1 - len0 / 2 : (t.y0 + t.y1) / 2;
          const cx = lerp(t.x, p.x, m);
          const cy = lerp(cy0, p.y, m);
          const w = lerp(2.5, DOT, m) * (1 - out);
          const len = lerp(len0, DOT, m) * (1 - out);
          return (
            <rect
              key={n}
              x={cx - w / 2}
              y={cy - len / 2}
              width={w}
              height={len}
              rx={Math.min(w, len) / 2}
              fill={interpolateColors(m, [0, 1], [C.lines, C.dots])}
            />
          );
        })}
      </svg>
      {f < 307 &&
        Array.from({length: 10}, (_, i) => i + 1).map((k) => {
          const at = 274 + (k - 1) * 0.5;
          if (f < at) return null;
          const inT = prog(f, at, 8);
          const outT = prog(f, 300, 6, EASE_IN);
          const locked = k === LOCK ? prog(f, 286, 5) : 0;
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: RULER.x0 + RULER.seg * k,
                top: RULER.base + 12,
                transform: 'translateX(-50%)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  ...body(34, interpolateColors(locked, [0, 1], [C.muted, C.red]), 600),
                  transform: `translateY(${(1 - inT) * 108 + outT * 108}%) scale(${1 + 0.15 * locked})`,
                }}
              >
                {k}
              </div>
            </div>
          );
        })}
    </>
  );
};

// Red marker: wanders over the ruler, locks on 7, then flies to callout dot 1.
const JUMPS: Array<[number, number]> = [
  [244, 0.5],
  [251, 0.74],
  [258, 0.31],
  [264, 0.62],
  [270, 0.43],
  [276, 0.81],
  [281, 0.55],
];
export const MARKER_LAND = 316;

export const Marker: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 244 || f >= MARKER_LAND) return null;
  let u = JUMPS[0][1];
  for (let i = 1; i < JUMPS.length; i++) {
    if (f >= JUMPS[i][0]) u = lerp(JUMPS[i - 1][1], JUMPS[i][1], prog(f, JUMPS[i][0], 5));
  }
  if (f >= 285) u = lerp(JUMPS[JUMPS.length - 1][1], LOCK / 10, spr(f, 285, {stiffness: 400, damping: 22}));
  const jitter = f < 285 ? 2.5 * Math.sin(f * 1.9) : 0;
  const rx = RULER.x0 + 860 * u + jitter;
  const ry = RULER.top - 21; // triangle centre, tip 6px above the ruler
  const fly = prog(f, 300, MARKER_LAND - 300, EASE_IO);
  const tx = ORBIT.cx - DIAG;
  const ty = ORBIT.cy - DIAG;
  const x = lerp(rx, tx, fly);
  const y = lerp(ry, ty, fly) - 70 * Math.sin(Math.PI * fly);
  const scale = pop(f, 244) * lerp(1, 0.45, fly);
  const appear = interpolate(f, [244, 247], [0, 1], CLAMP);
  return (
    <svg
      width={34}
      height={30}
      viewBox="0 0 34 30"
      style={{
        position: 'absolute',
        left: x - 17,
        top: y - 15,
        opacity: appear,
        transform: `scale(${scale})`,
        overflow: 'visible',
      }}
    >
      <path d="M0 0 H34 L17 30 Z" fill={C.red} />
    </svg>
  );
};
