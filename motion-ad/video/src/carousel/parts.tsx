import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, HEAD, body, head} from '../theme';

export const S = 1080; // square card
export const M = 72; // outer margin
export const INNER = S - 2 * M;

export const Arrow: React.FC<{color?: string; w?: number}> = ({color = C.red, w = 52}) => (
  <svg width={w} height={w * 0.56} viewBox="0 0 52 29" style={{display: 'block'}}>
    <path d="M3 14.5 H44 M31 3.5 L45 14.5 L31 25.5" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check: React.FC<{size?: number}> = ({size = 34}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', flexShrink: 0}}>
    <path d="M4 12.5 L9.5 18 L20 6.5" stroke={C.red} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const STAR = 'M12 2.5 L14.9 8.6 L21.5 9.4 L16.6 13.9 L17.9 20.5 L12 17.3 L6.1 20.5 L7.4 13.9 L2.5 9.4 L9.1 8.6 Z';
export const Stars: React.FC<{n: number; size?: number}> = ({n, size = 34}) => (
  <div style={{display: 'flex', gap: 6}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <path d={STAR} fill={i < n ? '#F2B705' : 'none'} stroke="#F2B705" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    ))}
  </div>
);

// Card shell: cream ground, counter bottom-left, URL or swipe cue bottom-right.
export const Card: React.FC<{index: number; total: number; swipe?: boolean; right?: string; children: React.ReactNode}> = ({
  index,
  total,
  swipe,
  right = 'maximecalisthenics.com',
  children,
}) => (
  <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
    {children}
    <div style={{position: 'absolute', left: M, top: 1000, ...body(30, C.muted)}}>
      {index} / {total}
    </div>
    {swipe ? (
      <div style={{position: 'absolute', right: M, top: 994, display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{...head(46, C.red), lineHeight: 1, letterSpacing: '0.04em', transform: 'translateY(3px)'}}>SWIPE</span>
        <Arrow />
      </div>
    ) : (
      <div style={{position: 'absolute', right: M, top: 1000, ...body(30, C.muted)}}>{right}</div>
    )}
  </AbsoluteFill>
);

export const Eyebrow: React.FC<{top?: number}> = ({top = M}) => (
  <div style={{position: 'absolute', left: M, top, ...body(30, C.muted, 600), letterSpacing: '0.16em'}}>
    PLANCHE · FRONT LEVER
  </div>
);

// Static staircase with the 2->3 dimension bracket (true proportions of steps.jpg).
const TRUE = [0.209, 0.362, 0.842, 1];
export const Stairs: React.FC<{x: number; base: number; w: number; h: number; labels?: boolean; stroke?: number}> = ({
  x,
  base,
  w,
  h,
  labels,
  stroke = 3,
}) => {
  const col = w / 4;
  const hs = TRUE.map((k) => k * h);
  const bx = x + 2 * col - Math.max(12, w * 0.022);
  const tick = Math.max(10, w * 0.017);
  const LABELS: Array<[string, string[]]> = [
    ['1 —', ['TUCK']],
    ['2 —', ['ADVANCED', 'TUCK']],
    ['3 —', ['STRADDLE', 'PLANCHE']],
    ['4 —', ['FULL', 'PLANCHE']],
  ];
  return (
    <>
      <svg width={S} height={S} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {hs.map((hi, i) => (
          <rect key={i} x={x + col * i} y={base - hi} width={col + (i < 3 ? 1 : 0)} height={hi} fill={C.surface} />
        ))}
        <g stroke={C.red} strokeWidth={stroke} fill="none" strokeLinecap="square">
          <line x1={bx} y1={base - hs[1]} x2={bx} y2={base - hs[2]} />
          <line x1={bx} y1={base - hs[1]} x2={bx + tick} y2={base - hs[1]} />
          <line x1={bx} y1={base - hs[2]} x2={bx + tick} y2={base - hs[2]} />
        </g>
      </svg>
      {labels &&
        LABELS.map(([num, lines], i) => (
          <div
            key={num}
            style={{position: 'absolute', left: x + col * i + 22, top: base - hs[i] + 20, display: 'flex', gap: 10, ...head(42), lineHeight: 1}}
          >
            <span style={{color: C.red}}>{num}</span>
            <span>
              {lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </span>
          </div>
        ))}
    </>
  );
};

// Static ruler (10 segments, 4 floating minors) with a red marker and optional ghosts.
export const Ruler: React.FC<{x: number; top: number; w: number; marker: number; ghosts?: number[]}> = ({x, top, w, marker, ghosts = []}) => {
  const seg = w / 10;
  const base = top + 64;
  const ticks: React.ReactNode[] = [];
  for (let k = 0; k <= 10; k++) {
    ticks.push(<line key={`M${k}`} x1={x + seg * k} y1={top} x2={x + seg * k} y2={base} />);
    if (k < 10) {
      for (let j = 1; j <= 4; j++) {
        const tx = x + seg * (k + j / 5);
        ticks.push(<line key={`m${k}${j}`} x1={tx} y1={top + 18} x2={tx} y2={top + 48} />);
      }
    }
  }
  const tri = (u: number, o: number, key: string) => (
    <path key={key} d={`M${x + w * u - 17} ${top - 36} h34 l-17 30 Z`} fill={C.red} opacity={o} />
  );
  return (
    <svg width={S} height={S} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g stroke={C.lines} strokeWidth={2.5}>
        {ticks}
        <line x1={x} y1={base} x2={x + w} y2={base} />
      </g>
      {ghosts.map((g, i) => tri(g, 0.16, `g${i}`))}
      {tri(marker, 1, 'main')}
    </svg>
  );
};

export const centerText = (top: number): React.CSSProperties => ({position: 'absolute', left: 0, width: S, top, textAlign: 'center'});
export {C, HEAD, body, head};
