import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {C, head} from '../theme';
import {lerp, prog, pushIn, shake, slam, spr} from '../anim';
import {Words, seq} from '../ui/Words';

const BASE = 920;
const COLW = 225;
const EQUAL = [100, 174, 248, 322];
const TRUE = [100, 174, 404, 480]; // riser 2->3 is ~3x the others
const HIT = 165;
const LABELS: Array<[string, string[]]> = [
  ['1 —', ['TUCK']],
  ['2 —', ['ADVANCED', 'TUCK']],
  ['3 —', ['STRADDLE', 'PLANCHE']],
  ['4 —', ['FULL', 'PLANCHE']],
];

const heights = (f: number) =>
  EQUAL.map((eq, i) => {
    const rise = eq * prog(f, 106 + 6 * i, 14);
    return i < 2 ? rise : lerp(rise, TRUE[i], spr(f, HIT, {stiffness: 260, damping: 24}));
  });

const Staircase: React.FC = () => {
  const f = useCurrentFrame();
  const h = heights(f);
  const draw = prog(f, HIT + 2, 10);
  const bx = 2 * COLW - 20;
  const yLow = BASE - TRUE[1];
  const yTop = lerp(yLow, BASE - h[2], draw);
  return (
    <AbsoluteFill>
      <svg width={900} height={980} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {h.map((hi, i) => (
          <rect key={i} x={COLW * i} y={BASE - hi} width={COLW + (i < 3 ? 1 : 0)} height={hi} fill={C.surface} />
        ))}
        {f >= HIT && (
          <g stroke={C.red} strokeWidth={3} fill="none" strokeLinecap="square">
            <line x1={bx} y1={yLow} x2={bx} y2={yTop} />
            <line x1={bx} y1={yLow} x2={bx + 14} y2={yLow} />
            {draw > 0.92 && <line x1={bx} y1={yTop} x2={bx + 14} y2={yTop} />}
          </g>
        )}
      </svg>
      {LABELS.map(([num, lines], i) => {
        const at = 114 + 6 * i;
        if (f < at) return null;
        const y = (1 - prog(f, at, 12)) * 108;
        return (
          <div key={num} style={{position: 'absolute', left: COLW * i + 22, top: BASE - h[i] + 22, overflow: 'hidden'}}>
            <div style={{display: 'flex', gap: 10, transform: `translateY(${y}%)`, ...head(40), lineHeight: 1}}>
              <span style={{color: C.red}}>{num}</span>
              <span>
                {lines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 105-210 STEPS: four equal steps, then the truth.
export const S2Steps: React.FC = () => {
  const f = useCurrentFrame();
  const s = slam(f, HIT);
  const k = shake(f, HIT);
  const blur = f >= HIT - 1 && f <= HIT + 13;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${k.x}px, ${k.y}px) scale(${pushIn(f, 105, 210)})`,
        transformOrigin: '450px 490px',
      }}
    >
      <Words words={seq('FOUR STEPS THAT', 102)} style={{position: 'absolute', left: -4, top: 0, ...head(150)}} />
      <Words words={seq('LOOK EQUAL.', 111)} style={{position: 'absolute', left: -4, top: 135, ...head(150)}} />
      {s !== null && (
        <div
          style={{
            position: 'absolute',
            left: -4,
            top: 270,
            ...head(150, C.red),
            transform: `scale(${s})`,
            transformOrigin: '0% 60%',
          }}
        >
          THEY AREN’T.
        </div>
      )}
      {blur ? (
        <CameraMotionBlur samples={8} shutterAngle={180}>
          <Staircase />
        </CameraMotionBlur>
      ) : (
        <Staircase />
      )}
    </div>
  );
};
