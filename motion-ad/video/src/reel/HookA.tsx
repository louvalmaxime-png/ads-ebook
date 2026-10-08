import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, body, head} from '../theme';
import {lerp, prog, pushIn, shake, slam} from '../anim';
import {Bubble} from '../ui/Bubble';
import {Words} from '../ui/Words';

const HIT = 30;
const TRUE = [0.209, 0.362, 0.842, 1];

// Mini staircase: rises on beat 3, the 2->3 riser gets its bracket.
const MiniStairs: React.FC<{f: number}> = ({f}) => {
  const x = 452;
  const w = 448;
  const base = 905;
  const h = 300;
  const col = w / 4;
  const hs = TRUE.map((k, i) => k * h * prog(f, 42 + 4 * i, 12));
  const draw = prog(f, 58, 12);
  const bx = x + 2 * col - 14;
  const yLow = base - TRUE[1] * h;
  const yTop = lerp(yLow, base - TRUE[2] * h, draw);
  return (
    <svg width={900} height={980} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {hs.map((hi, i) => (
        <rect key={i} x={x + col * i} y={base - hi} width={col + (i < 3 ? 1 : 0)} height={hi} fill={C.surface} />
      ))}
      {draw > 0 && (
        <g stroke={C.red} strokeWidth={4.5} fill="none" strokeLinecap="square">
          <line x1={bx} y1={yLow} x2={bx} y2={yTop} />
          <line x1={bx} y1={yLow} x2={bx + 12} y2={yLow} />
          {draw > 0.92 && <line x1={bx} y1={yTop} x2={bx + 12} y2={yTop} />}
        </g>
      )}
    </svg>
  );
};

// 0-105 HOOK A: the prospect's words, then the validation. Frame 0 reads.
export const HookA: React.FC = () => {
  const f = useCurrentFrame();
  const s = slam(f, HIT);
  const k = shake(f, HIT);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${k.x}px, ${k.y}px) scale(${pushIn(f, 0, 105)})`,
        transformOrigin: '450px 490px',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, ...body(34, C.muted, 600), letterSpacing: '0.16em'}}>
        PLANCHE · FRONT LEVER
      </div>
      <Bubble
        text="Tuck to straddle feels like a wall"
        tail="left"
        style={{left: 0, top: 64, transform: `scale(${lerp(1.06, 1, prog(f, 0, 8))})`, transformOrigin: '0% 100%'}}
      />
      <Words words={[{t: 'BECAUSE', at: -12}]} style={{position: 'absolute', left: -6, top: 232, ...head(205)}} />
      {s !== null && (
        <div style={{position: 'absolute', left: -6, top: 232 + 184.5, ...head(205, C.red), transform: `scale(${s})`, transformOrigin: '0% 60%'}}>
          IT IS ONE.
        </div>
      )}
      <MiniStairs f={f} />
    </div>
  );
};
