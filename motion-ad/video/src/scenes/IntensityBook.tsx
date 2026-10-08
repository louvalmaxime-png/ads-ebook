import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {CLAMP, EASE_IO, lerp, prog, spr} from '../anim';
import {INT_IMG, INT_S4, INT_S5, ORBIT} from '../layout';

const DROP = 306;
const MOVE = 405;
const MOVE_DUR = 15;

// One-beat glow on the book's cue, then a low steady halo.
export const glow = (f: number, at: number) =>
  f < at ? 0 : interpolate(f, [at, at + 4, at + 30], [0, 1, 0.14], CLAMP);

export const glowFilter = (rgb: string, a: number) =>
  a <= 0.001
    ? undefined
    : `drop-shadow(0 0 12px rgba(${rgb},${(0.8 * a).toFixed(3)})) drop-shadow(0 0 32px rgba(${rgb},${(0.45 * a).toFixed(3)}))`;

const Book: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, MOVE, MOVE_DUR, EASE_IO);
  const d = spr(f, DROP, {stiffness: 180, damping: 18});
  const float = 6 * Math.sin((2 * Math.PI * (f - 320)) / 60) * prog(f, 318, 12) * (1 - t);
  const cx = lerp(INT_S4.cx, INT_S5.cx, t);
  const cy = lerp(INT_S4.cy + lerp(-150, 0, d) + float, INT_S5.cy, t);
  const h = lerp(INT_S4.h * lerp(0.94, 1, d), INT_S5.h, t);
  const rot = lerp(INT_S4.rot, INT_S5.rot, t);
  const k = h / INT_IMG.silH;
  const appear = interpolate(f, [DROP, DROP + 4], [0, 1], CLAMP);
  const shadow = 0.24 * d * (1 - t) * appear;
  return (
    <AbsoluteFill>
      {shadow > 0.002 && (
        <div
          style={{
            position: 'absolute',
            left: ORBIT.cx - 130,
            top: ORBIT.cy + 228,
            width: 260,
            height: 38,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(18,21,24,1), rgba(18,21,24,0))',
            opacity: shadow,
            transform: `scale(${1 - float / 60})`,
          }}
        />
      )}
      <Img
        src={staticFile('img/intensity.png')}
        style={{
          position: 'absolute',
          left: cx - INT_IMG.cx * k,
          top: cy - INT_IMG.cy * k,
          width: INT_IMG.w * k,
          height: INT_IMG.h * k,
          transform: `rotate(${rot}deg)`,
          transformOrigin: `${INT_IMG.cx * k}px ${INT_IMG.cy * k}px`,
          opacity: appear,
          filter: glowFilter('216,86,50', glow(f, 420)),
        }}
      />
    </AbsoluteFill>
  );
};

// 306-600: drops into the orbit (S4), then slides into the pack's left slot (S5).
export const IntensityBook: React.FC = () => {
  const f = useCurrentFrame();
  if (f < DROP) return null;
  const blur = (f >= DROP && f <= DROP + 12) || (f >= MOVE && f <= MOVE + MOVE_DUR + 1);
  return blur ? (
    <CameraMotionBlur samples={8} shutterAngle={180}>
      <Book />
    </CameraMotionBlur>
  ) : (
    <Book />
  );
};
