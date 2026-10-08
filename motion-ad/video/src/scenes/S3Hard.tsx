import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, head} from '../theme';
import {pushIn, slam} from '../anim';
import {Words, seq} from '../ui/Words';

const TYPED = '“IT WAS HARD”';

// 210-300 HARD (the ruler lives in RulerOrbit).
export const S3Hard: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(TYPED.length, Math.floor(f - 210) + 1));
  const s = slam(f, 240);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${pushIn(f, 210, 300)})`,
        transformOrigin: '450px 400px',
      }}
    >
      <div style={{position: 'absolute', left: -6, top: 0, ...head(182)}}>{TYPED.slice(0, n)}</div>
      <Words words={seq('IS NOT A', 224)} style={{position: 'absolute', left: -4, top: 164, ...head(182)}} />
      {s !== null && (
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: 328,
            ...head(182, C.red),
            transform: `scale(${s})`,
            transformOrigin: '0% 60%',
          }}
        >
          NUMBER
        </div>
      )}
    </div>
  );
};
