import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {CLAMP, EASE_IO, prog, spr} from '../anim';
import {ORBIT, POSE} from '../layout';
import {Book3D, lerpPose} from '../ui/Book3D';

const DROP = 306;
const MOVE = 405;
const MOVE_DUR = 15;

// One-beat glow on the book's cue, then a low steady halo.
export const glow = (f: number, at: number) =>
  f < at ? 0 : interpolate(f, [at, at + 4, at + 30], [0, 1, 0.14], CLAMP);

// Ground shadow, plus the coloured glow when it is on.
export const bookFilter = (rgb: string, a: number) => {
  const ground = 'drop-shadow(0 16px 18px rgba(18,21,24,0.30))';
  return a <= 0.001
    ? ground
    : `${ground} drop-shadow(0 0 12px rgba(${rgb},${(0.8 * a).toFixed(3)})) drop-shadow(0 0 32px rgba(${rgb},${(0.45 * a).toFixed(3)}))`;
};

const Book: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, MOVE, MOVE_DUR, EASE_IO);
  const d = spr(f, DROP, {stiffness: 170, damping: 17});
  const life = prog(f, 318, 14) * (1 - t);
  const phase = (2 * Math.PI * (f - 320)) / 60;
  const landed = lerpPose(POSE.s4Drop, POSE.s4, d);
  const floating = {
    ...landed,
    cy: landed.cy + 6 * Math.sin(phase) * life,
    ry: landed.ry + 3 * Math.sin(phase / 2) * life,
  };
  const pose = lerpPose(floating, POSE.intensity, t);
  const appear = interpolate(f, [DROP, DROP + 4], [0, 1], CLAMP);
  const shadow = 0.22 * d * (1 - t) * appear;
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
            transform: `scale(${1 - (6 * Math.sin(phase) * life) / 60})`,
          }}
        />
      )}
      <Book3D
        src="covers/intensity.webp"
        pose={pose}
        opacity={appear}
        filter={bookFilter('216,86,50', glow(f, 420))}
      />
    </AbsoluteFill>
  );
};

// 306-600: drops into the orbit (S4), then turns into the pack's left slot (S5).
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
