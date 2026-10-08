import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, body, head} from '../theme';
import {prog, slam} from '../anim';
import {Words, seq} from '../ui/Words';

// Under the ruler (frames 210-300): the carousel's cause line.
export const CauseCaption: React.FC = () => (
  <Words
    words={seq('Train by feel and you never know when to move up.', 248, 2)}
    style={{position: 'absolute', left: 0, top: 836, ...body(34)}}
  />
);

// Under the pack (frames 456-525): what each tome brings, then the Discord.
const ROWS = [
  {name: 'INTENSITY', color: C.glowI, text: 'The 1–10 scale for static holds', at: 456},
  {name: 'VOLUME', color: C.glowV, text: 'Volume calculator (Excel) included', at: 462},
  {name: 'PERIODIZATION', color: C.glowP, text: 'Weeks and months, structured', at: 468},
];
export const SystemRows: React.FC = () => {
  const f = useCurrentFrame();
  const discord = slam(f, 480);
  return (
    <>
      {ROWS.map((r, i) => {
        if (f < r.at) return null;
        return (
          <div key={r.name} style={{position: 'absolute', left: 48, top: 574 + 56 * i, display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 6, height: 36, background: r.color, transform: `scaleY(${prog(f, r.at, 6)})`}} />
            <Words words={[{t: r.name, at: r.at, color: r.color}]} style={{...head(42), width: 214}} />
            <Words words={seq(r.text, r.at + 2, 1)} style={body(32)} />
          </div>
        );
      })}
      {discord !== null && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 900,
            top: 770,
            textAlign: 'center',
            ...head(58),
            transform: `scale(${discord})`,
          }}
        >
          + PRIVATE DISCORD <span style={{color: C.red}}>INCLUDED</span>
        </div>
      )}
    </>
  );
};
