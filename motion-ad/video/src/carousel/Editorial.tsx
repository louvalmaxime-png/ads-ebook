import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Book3D, Pose} from '../ui/Book3D';
import {BODY, HEAD, SERIF} from '../theme';
import {PHOTO_A, PREVIEW_MARKS} from './photos';

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

// Film grain over the whole card, so type, books, photo and ground share one print
// texture. Mid-grey noise in overlay mode lightens as much as it darkens, so the page
// still averages #F2EEE6.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>" +
  "<filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='1.17 1.17 1.17 0 -1.255  1.17 1.17 1.17 0 -1.255  1.17 1.17 1.17 0 -1.255  0 0 0 0 1'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const Wordmark: React.FC = () => (
  <div style={{position: 'absolute', left: M, top: 994, display: 'flex', alignItems: 'center', gap: 12}}>
    <span style={{fontFamily: SERIF, fontWeight: 700, fontSize: 29, lineHeight: 1, letterSpacing: '0.04em', color: E.ink}}>MAXIME</span>
    <span style={{background: E.ink, padding: '8px 9px 7px 13px', fontFamily: SERIF, fontWeight: 700, fontSize: 15, lineHeight: 1, letterSpacing: '0.32em', color: E.acid}}>
      CALISTHENICS
    </span>
  </div>
);

type P = {index: number; total: number};

const Card: React.FC<P & {children: React.ReactNode}> = ({index, total, children}) => (
  <AbsoluteFill style={{background: E.bg, overflow: 'hidden'}}>
    {children}
    <div style={{position: 'absolute', right: M, top: 58, ...small(24, E.muted, 600), letterSpacing: '0.08em'}}>
      {index}/{total}
    </div>
    <Wordmark />
    <AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.25, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
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

// 1 — Hook (5 words): a strong athlete, annotated like a coaching sheet he can't read.

// One loaded brush stroke under the word: blunt start, a slight rise to the right,
// bristles breaking up into dry streaks before a feathered tail.
const Brush: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    {children}
    <svg
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      style={{position: 'absolute', left: '-2%', width: '105%', top: '0.765em', height: '0.18em', overflow: 'visible'}}
    >
      <defs>
        <filter id="brush-edge" x="-5%" y="-80%" width="110%" height="260%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.9" numOctaves={2} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={3.5} />
        </filter>
        <mask id="brush-dry" maskUnits="userSpaceOnUse" x="-10" y="-10" width="440" height="50">
          <rect x="-10" y="-10" width="440" height="50" fill="#fff" />
          <g stroke="#000" strokeLinecap="round" fill="none">
            <path d="M262 13.5 C 310 11, 350 8, 402 5" strokeWidth={1.3} />
            <path d="M300 9 C 340 6.5, 370 4.5, 402 3" strokeWidth={0.9} />
            <path d="M236 18.5 C 290 16, 330 13, 380 10" strokeWidth={1.1} />
            <path d="M318 12.5 C 350 10.5, 375 8.5, 402 7.5" strokeWidth={1.6} />
            <path d="M282 6.5 C 320 4.5, 352 3, 380 2" strokeWidth={0.7} />
          </g>
        </mask>
      </defs>
      <g fill={E.acid} filter="url(#brush-edge)">
        <path
          mask="url(#brush-dry)"
          d="M5 16 C 4 9, 11 5.5, 24 6 C 120 4.5, 240 2.5, 330 1 C 362 0.5, 386 1, 400 3 C 384 6.5, 352 9.5, 320 12 C 240 16.5, 120 22, 26 25 C 11 25.5, 5 22, 5 16 Z"
        />
        <path d="M352 7.5 C 372 6.5, 392 5, 412 4.2 L 412 5 C 392 6.2, 372 7.6, 352 8.6 Z" opacity={0.85} />
        <path d="M340 3.2 C 365 2.4, 388 2, 408 1.8 L 408 2.4 C 388 2.7, 365 3.3, 340 4 Z" opacity={0.7} />
      </g>
    </svg>
  </span>
);

// Three different pencil question marks (not one glyph cloned): graphite double
// line, uneven pressure, grain, and a faint knock-out so they read on busy ground.
const QUESTION = [
  {stem: 'M9 17 C 9 5, 31 2, 32 15 C 33 25, 22 27, 20.5 38 L 21 45', ghost: 'M10.5 16 C 11 6.5, 29.5 4, 30.5 15.5 C 31 24, 23 26.5, 21.5 37', dot: 'M20 55.5 l 2 0.6 l -0.5 1.9 l -1.9 -0.4 Z'},
  {stem: 'M7 20 C 5 7, 22 1, 31 9 C 39 17, 30 26, 23 30 C 19 32.5, 19 37, 19.5 44', ghost: 'M8.5 18 C 8 8, 22 3.5, 29.5 10 C 36 16.5, 29 24.5, 22.5 28.5', dot: 'M18.6 54 l 2.4 -0.2 l 0.1 2.2 l -2.2 0.3 Z'},
  {stem: 'M10 14 C 13 5, 29 4, 31 14 C 32.5 22, 24 24, 21 31 C 19.5 35, 20 39, 20 43', ghost: 'M11.5 13 C 14.5 6.5, 27.5 5.5, 29.5 14 C 30.5 20.5, 24 23, 21.5 29', dot: 'M19 53 c 1.2 -0.6, 2.4 0, 2.2 1.2 c -0.3 1.1, -1.8 1.3, -2.3 0.3 Z'},
];
const PencilQ: React.FC<{x: number; y: number; rot: number; h: number; shape: number}> = ({x, y, rot, h, shape}) => {
  const q = QUESTION[shape];
  const id = `pencil${shape}`;
  const w = (h * 40) / 64;
  return (
    <svg width={w} height={h} viewBox="0 0 40 64" style={{position: 'absolute', left: x - w / 2, top: y - h / 2, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves={2} seed={shape + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.8} result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.95" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        <filter id={`${id}-halo`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={1.6} />
        </filter>
      </defs>
      <g stroke={E.bg} strokeWidth={7} strokeLinecap="round" fill={E.bg} opacity={0.7} filter={`url(#${id}-halo)`}>
        <path d={q.stem} fill="none" />
        <path d={q.dot} />
      </g>
      <g filter={`url(#${id})`} stroke="#3A3A3A" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={q.stem} strokeWidth={2.9} opacity={0.85} />
        <path d={q.ghost} strokeWidth={1.3} opacity={0.5} />
        <path d={q.dot} strokeWidth={2.6} fill="#3A3A3A" opacity={0.85} />
      </g>
    </svg>
  );
};

// The photo fills the right of the card under the headline and bleeds off the right
// and bottom edges; it starts clear of the wordmark so the footer stays on bone.
// Almost grayscale, levels set so the wall lands just under the page tone once
// multiplied with it (whites ~250, blacks lifted to ~22 so fabric keeps detail).
const FRAME = {x: 470, y: 500, w: S - 470, h: S - 500};
const Hook: React.FC<P> = (p) => {
  const ph = PHOTO_A;
  const at = (x: number, y: number) =>
    ph ? [FRAME.x + (x - ph.origin[0]) * ph.scale, FRAME.y + (y - ph.origin[1]) * ph.scale] : [FRAME.x + x * FRAME.w, FRAME.y + y * FRAME.h];
  const marks = ph?.marks ?? PREVIEW_MARKS;
  return (
    <Card {...p}>
      <div style={{position: 'absolute', left: FRAME.x, top: FRAME.y, width: FRAME.w, height: FRAME.h, overflow: 'hidden', background: E.block}}>
        {ph ? (
          <>
            <Img
              src={staticFile(ph.src)}
              style={{
                position: 'absolute',
                left: -ph.origin[0] * ph.scale,
                top: -ph.origin[1] * ph.scale,
                width: ph.size[0] * ph.scale,
                height: ph.size[1] * ph.scale,
                maxWidth: 'none',
                filter: 'grayscale(0.92) brightness(1.179) contrast(0.912)',
              }}
            />
            <div style={{position: 'absolute', inset: 0, background: E.bg, mixBlendMode: 'multiply'}} />
          </>
        ) : (
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...small(22, E.muted, 600), letterSpacing: '0.16em'}}>
            PHOTO A
          </div>
        )}
      </div>
      {marks.map(([x, y, rot], i) => {
        const [cx, cy] = at(x, y);
        return <PencilQ key={i} x={cx} y={cy} rot={rot} h={[76, 84, 72][i % 3]} shape={i % 3} />;
      })}
      <div style={{position: 'absolute', left: M - 5, top: 112, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={head(124)}>DISCIPLINED…</div>
        <div style={head(124)}>
          BUT TRAINING <Brush>WITHOUT</Brush>
        </div>
        <div style={head(124)}>UNDERSTANDING?</div>
      </div>
    </Card>
  );
};

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
