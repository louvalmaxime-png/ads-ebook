import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Book3D, Pose} from '../ui/Book3D';
import {BODY, HEAD} from '../theme';

// Deck C: the "sports-science editorial" art direction.
// Bone ground, black type, one acid-yellow mark per card (never a flood),
// counter top right, wordmark bottom left, max 15 words of copy per card.
export const E = {
  bg: '#F2EEE6',
  ink: '#0A0A0A',
  acid: '#EAFF00',
  rule: '#0A0A0A',
  muted: '#5E5B55',
  block: '#E3DED4',
};

const S = 1080;
const M = 84;
const INNER = S - 2 * M;

const head = (size: number): React.CSSProperties => ({
  fontFamily: HEAD,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 0.88,
  letterSpacing: '-0.005em',
  color: E.ink,
  whiteSpace: 'nowrap',
  textTransform: 'uppercase',
});

const small = (size = 28, color = E.ink, weight = 500): React.CSSProperties => ({
  fontFamily: BODY,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.2,
  color,
  whiteSpace: 'nowrap',
});

// The single accent: a yellow marker stripe sitting behind the lower half of a word.
// Acid yellow on bone has no contrast as type, so it is only ever used as a mark.
const Mark: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    <span style={{position: 'absolute', left: -6, right: -6, bottom: '0.02em', height: '0.36em', background: E.acid}} />
    <span style={{position: 'relative'}}>{children}</span>
  </span>
);

// Film grain over the whole card, so type, books and ground share one print texture.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const Wordmark: React.FC = () => (
  <div style={{position: 'absolute', left: M, top: 994, display: 'flex', alignItems: 'center', gap: 12}}>
    <span style={{fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: 30, letterSpacing: '0.02em', color: E.ink}}>
      MAXIME
    </span>
    <span style={{background: E.ink, padding: '7px 10px 6px 13px', ...small(17, E.acid, 600), letterSpacing: '0.34em'}}>
      CALISTHENICS
    </span>
  </div>
);

type P = {index: number; total: number};

const Card: React.FC<P & {swipe?: boolean; children: React.ReactNode}> = ({index, total, swipe, children}) => (
  <AbsoluteFill style={{background: E.bg, overflow: 'hidden'}}>
    {children}
    <div style={{position: 'absolute', right: M, top: 58, ...small(24, E.muted, 600), letterSpacing: '0.08em'}}>
      {index}/{total}
    </div>
    <Wordmark />
    {swipe && (
      <svg width={56} height={30} viewBox="0 0 52 29" style={{position: 'absolute', right: M, top: 998}}>
        <path d="M3 14.5 H44 M31 3.5 L45 14.5 L31 25.5" stroke={E.ink} strokeWidth={4} fill="none" strokeLinecap="square" />
      </svg>
    )}
    <AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.09, mixBlendMode: 'multiply', pointerEvents: 'none'}} />
  </AbsoluteFill>
);

// Thin rule with a short label: the "grid" of the editorial page.
const Kicker: React.FC<{top: number; text: string}> = ({top, text}) => (
  <div style={{position: 'absolute', left: M, top, width: INNER}}>
    <div style={{height: 2, background: E.rule}} />
    <div style={{...small(22, E.ink, 600), letterSpacing: '0.2em', marginTop: 14}}>{text}</div>
  </div>
);

// Staircase in true proportions (see Cards.tsx), black outline, no fill flood.
const TRUE = [0.209, 0.362, 0.842, 1];
const Stairs: React.FC<{x: number; base: number; w: number; h: number; labels?: string[][]}> = ({x, base, w, h, labels}) => {
  const col = w / 4;
  const hs = TRUE.map((k) => k * h);
  return (
    <>
      <svg width={S} height={S} style={{position: 'absolute', left: 0, top: 0}}>
        {hs.map((hi, i) => (
          <rect key={i} x={x + col * i} y={base - hi} width={col + (i < 3 ? 1 : 0)} height={hi} fill={E.block} />
        ))}
        <g stroke={E.ink} strokeWidth={3} fill="none">
          <line x1={x + 2 * col - 14} y1={base - hs[1]} x2={x + 2 * col - 14} y2={base - hs[2]} />
          <line x1={x + 2 * col - 14} y1={base - hs[1]} x2={x + 2 * col - 2} y2={base - hs[1]} />
          <line x1={x + 2 * col - 14} y1={base - hs[2]} x2={x + 2 * col - 2} y2={base - hs[2]} />
        </g>
        <line x1={x} y1={base} x2={x + w} y2={base} stroke={E.ink} strokeWidth={2} />
      </svg>
      {labels?.map((lines, i) => (
        <div key={i} style={{position: 'absolute', left: x + col * i + 18, top: base - hs[i] + 18, ...small(22, E.ink, 600), letterSpacing: '0.08em'}}>
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      ))}
    </>
  );
};

const covers = 'saturate(0.86) drop-shadow(0 18px 20px rgba(10,10,10,0.26))';
const TRIO = (cy: number, h: number, cx: [number, number, number], ry: number): Array<{src: string; pose: Pose}> => [
  {src: 'covers/intensity.webp', pose: {cx: cx[0], cy, h, rx: 0, ry, rz: 0}},
  {src: 'covers/periodization.webp', pose: {cx: cx[2], cy, h, rx: 0, ry: -ry, rz: 0}},
  {src: 'covers/volume.webp', pose: {cx: cx[1], cy: cy - h * 0.02, h: h * 1.03, rx: 0, ry: 0, rz: 0}},
];

// 1 — Hook (10 words)
const Hook: React.FC<P> = (p) => (
  <Card {...p} swipe>
    <div style={{position: 'absolute', left: M, top: 150, ...small(34, E.ink, 500)}}>Tuck to straddle feels like a wall.</div>
    <div style={{position: 'absolute', left: M - 6, top: 228}}>
      <div style={head(196)}>BECAUSE</div>
      <div style={head(196)}>
        IT IS <Mark>ONE.</Mark>
      </div>
    </div>
    <Stairs x={576} base={930} w={420} h={300} />
  </Card>
);

// 2 — The four steps (13 words)
const Steps: React.FC<P> = (p) => (
  <Card {...p}>
    <div style={{position: 'absolute', left: M - 5, top: 120}}>
      <div style={head(120)}>FOUR STEPS THAT</div>
      <div style={head(120)}>LOOK EQUAL.</div>
      <div style={head(120)}>
        THEY <Mark>AREN’T.</Mark>
      </div>
    </div>
    <Stairs
      x={M}
      base={930}
      w={INNER}
      h={430}
      labels={[['TUCK'], ['ADVANCED', 'TUCK'], ['STRADDLE', 'PLANCHE'], ['FULL', 'PLANCHE']]}
    />
  </Card>
);

// 3 — The cause (12 words)
const Ruler: React.FC<{top: number; marker: number}> = ({top, marker}) => {
  const seg = INNER / 10;
  const base = top + 56;
  const ticks: React.ReactNode[] = [];
  for (let k = 0; k <= 10; k++) {
    ticks.push(<line key={`M${k}`} x1={M + seg * k} y1={top} x2={M + seg * k} y2={base} strokeWidth={2.5} />);
    if (k < 10) {
      for (let j = 1; j <= 4; j++) {
        const tx = M + seg * (k + j / 5);
        ticks.push(<line key={`m${k}${j}`} x1={tx} y1={top + 28} x2={tx} y2={base} strokeWidth={1.5} />);
      }
    }
  }
  const mx = M + INNER * marker;
  return (
    <svg width={S} height={S} style={{position: 'absolute', left: 0, top: 0}}>
      <g stroke={E.ink}>
        {ticks}
        <line x1={M} y1={base} x2={M + INNER} y2={base} strokeWidth={2.5} />
      </g>
      <text x={mx} y={top - 26} textAnchor="middle" fontFamily={HEAD} fontSize={64} fill={E.ink}>
        ?
      </text>
    </svg>
  );
};
const Cause: React.FC<P> = (p) => (
  <Card {...p}>
    <div style={{position: 'absolute', left: M - 5, top: 120}}>
      <div style={head(168)}>“IT WAS HARD”</div>
      <div style={head(168)}>
        IS NOT A <Mark>NUMBER.</Mark>
      </div>
    </div>
    <Ruler top={660} marker={0.62} />
    <div style={{position: 'absolute', left: M, top: 790, ...small(34)}}>So when do you move up?</div>
  </Card>
);

// 4 — The system (12 words)
const SYSTEM = [
  {x: 246, text: '1–10 intensity scale'},
  {x: 540, text: 'Volume calculator'},
  {x: 834, text: 'Weeks & months, planned'},
];
const System: React.FC<P> = (p) => (
  <Card {...p}>
    <div style={{position: 'absolute', left: M - 4, top: 120, ...head(100)}}>
      HOW HARD. HOW MUCH. <Mark>WHEN.</Mark>
    </div>
    {TRIO(500, 400, [246, 540, 834], 14).map((b) => (
      <Book3D key={b.src} src={b.src} pose={b.pose} filter={covers} />
    ))}
    {SYSTEM.map((s) => (
      <div key={s.x} style={{position: 'absolute', left: s.x - 140, width: 280, top: 750, textAlign: 'center'}}>
        <div style={{height: 2, background: E.rule, width: 48, margin: '0 auto 16px'}} />
        <div style={{...small(26, E.ink, 600)}}>{s.text}</div>
      </div>
    ))}
  </Card>
);

// 5 — Proof (13 words; a verbatim excerpt of Ilian's 5-star review)
const STAR = 'M12 2.5 L14.9 8.6 L21.5 9.4 L16.6 13.9 L17.9 20.5 L12 17.3 L6.1 20.5 L7.4 13.9 L2.5 9.4 L9.1 8.6 Z';
const Proof: React.FC<P> = (p) => (
  <Card {...p}>
    <Kicker top={120} text="READER REVIEW" />
    <div style={{position: 'absolute', left: M, top: 270, display: 'flex', gap: 8}}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={40} height={40} viewBox="0 0 24 24">
          <path d={STAR} fill={E.ink} />
        </svg>
      ))}
    </div>
    <div style={{position: 'absolute', left: M - 5, top: 370}}>
      <div style={head(124)}>“JUST THE PUSH I NEEDED</div>
      <div style={head(124)}>TO STOP TRYING TO MOVE</div>
      <div style={head(124)}>
        FORWARD <Mark>BLINDLY.</Mark>”
      </div>
    </div>
    <div style={{position: 'absolute', left: M, top: 780, ...small(28, E.muted, 600), letterSpacing: '0.1em'}}>— ILIAN</div>
  </Card>
);

// 6 — Offer (11 words)
const Offer: React.FC<P> = (p) => (
  <Card {...p}>
    {TRIO(310, 330, [330, 540, 750], 16).map((b) => (
      <Book3D key={b.src} src={b.src} pose={b.pose} filter={covers} />
    ))}
    <div style={{position: 'absolute', left: 0, width: S, top: 512, textAlign: 'center', ...small(28, E.muted)}}>
      <span style={{textDecoration: 'line-through', textDecorationThickness: 2}}>$99.99</span> separately
    </div>
    <div style={{position: 'absolute', left: 0, width: S, top: 562, textAlign: 'center', ...head(150)}}>
      ALL THREE <Mark>$44.99</Mark>
    </div>
    <div style={{position: 'absolute', left: 0, width: S, top: 718, textAlign: 'center', ...small(28, E.ink, 500)}}>
      14-day money-back guarantee
    </div>
    <div
      style={{
        position: 'absolute',
        left: (S - 440) / 2,
        top: 808,
        width: 440,
        height: 96,
        background: E.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{...head(60), color: E.bg, lineHeight: 1, letterSpacing: '0.04em', transform: 'translateY(3px)'}}>GET THE PACK</span>
    </div>
  </Card>
);

export const DECK_C: React.FC<P>[] = [Hook, Steps, Cause, System, Proof, Offer];
