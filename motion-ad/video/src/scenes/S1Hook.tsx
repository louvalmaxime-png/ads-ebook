import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, body, head} from '../theme';
import {CLAMP, lerp, pop, prog, pushIn} from '../anim';
import {Bubble} from '../ui/Bubble';

const BUBBLES = [
  {text: 'I hold, but nothing improves', x: 0, y: 432, tail: 'left' as const, at: 0},
  {text: 'Tuck to straddle feels like a wall', x: 70, y: 552, tail: 'right' as const, at: 15},
  {text: 'Every session is a guess', x: 0, y: 672, tail: 'left' as const, at: 30},
  {text: 'I never know when to move up', x: 50, y: 792, tail: 'right' as const, at: 45},
];
const WALL = 1;

// 0-105 HOOK. Frame 0 already reads: eyebrow, headline, bubble 1.
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const dim = prog(f, 75, 8);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${pushIn(f, 0, 105)})`,
        transformOrigin: '450px 490px',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, ...body(34, C.muted, 600), letterSpacing: '0.16em'}}>
        PLANCHE · FRONT LEVER
      </div>
      <div style={{position: 'absolute', left: -5, top: 52}}>
        <div style={head(190)}>YOUR</div>
        <div style={head(190, C.red)}>PROBLEM</div>
      </div>
      {BUBBLES.map((b, i) => {
        if (f < b.at) return null;
        const scale = i === 0 ? lerp(1.06, 1, prog(f, 0, 8)) : pop(f, b.at);
        const appear = i === 0 ? 1 : interpolate(f, [b.at, b.at + 3], [0, 1], CLAMP);
        const focus = i === WALL;
        return (
          <Bubble
            key={b.text}
            text={b.text}
            tail={b.tail}
            style={{
              left: b.x,
              top: b.y,
              opacity: appear * (focus ? 1 : lerp(1, 0.35, dim)),
              transform: `scale(${scale * (focus ? lerp(1, 1.04, dim) : 1)})`,
              transformOrigin: b.tail === 'left' ? '0% 100%' : '100% 100%',
            }}
          />
        );
      })}
    </div>
  );
};
