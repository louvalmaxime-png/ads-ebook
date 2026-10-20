import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Book3D, Pose} from '../ui/Book3D';
import {BODY, HAND, HEAD, SERIF} from '../theme';
import {PHOTO_A, PHOTO_B, PREVIEW_MARKS} from './photos';

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
    <span
      style={{
        background: E.ink,
        padding: '8px 7px 7px 11px',
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 1,
        letterSpacing: '0.24em',
        color: E.acid,
        transform: 'translateY(2px)',
      }}
    >
      CALISTHENICS
    </span>
  </div>
);

type P = {index: number; total: number};

// Overlay grain is strongest on midtones, so photos and covers sit in `front`, above
// the page grain: covers stay clean, the hook photo gets its own lighter grain.
const Card: React.FC<P & {children: React.ReactNode; front?: React.ReactNode}> = ({index, total, children, front}) => (
  <AbsoluteFill style={{background: E.bg, overflow: 'hidden'}}>
    {children}
    <div style={{position: 'absolute', right: M, top: 58, ...small(24, E.muted, 600), letterSpacing: '0.08em'}}>
      {index}/{total}
    </div>
    <Wordmark />
    <AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.25, mixBlendMode: 'overlay', pointerEvents: 'none'}} />
    {front}
  </AbsoluteFill>
);

// Thin rule with a short label: the "grid" of the editorial page.
const Kicker: React.FC<{top: number; text: string}> = ({top, text}) => (
  <div style={{position: 'absolute', left: M, top, width: INNER}}>
    <div style={{height: 2, background: E.rule}} />
    <div style={{...small(22, E.ink, 600), letterSpacing: '0.2em', marginTop: 14}}>{text}</div>
  </div>
);

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
      style={{position: 'absolute', left: '-2%', width: '105%', top: '0.76em', height: '0.24em', overflow: 'visible'}}
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
  {stem: 'M9 17 C 9 5, 31 2, 32 15 C 33 25, 22 27, 20.5 38 L 21 45', ghost: 'M10.5 16 C 11 6.5, 29.5 4, 30.5 15.5 C 31 24, 23 26.5, 21.5 37', dot: 'M19.6 55 c 1.4 -0.8, 2.9 0.2, 2.5 1.5 c -0.4 1.3, -2.2 1.5, -2.8 0.3 c -0.2 -0.6, -0.1 -1.3, 0.3 -1.8 Z'},
  {stem: 'M7 20 C 5 7, 22 1, 31 9 C 39 17, 30 26, 23 30 C 19 32.5, 19 37, 19.5 44', ghost: 'M8.5 18 C 8 8, 22 3.5, 29.5 10 C 36 16.5, 29 24.5, 22.5 28.5', dot: 'M18.8 53.6 c 1 -0.5, 2.5 -0.3, 2.6 0.9 c 0.1 1.4, -1.3 1.9, -2.4 1.4 c -0.8 -0.4, -1 -1.6, -0.2 -2.3 Z'},
  {stem: 'M10 14 C 13 5, 29 4, 31 14 C 32.5 22, 24 24, 21 31 C 19.5 35, 20 39, 20 43', ghost: 'M11.5 13 C 14.5 6.5, 27.5 5.5, 29.5 14 C 30.5 20.5, 24 23, 21.5 29', dot: 'M19 53 c 1.2 -0.6, 2.4 0, 2.2 1.2 c -0.3 1.1, -1.8 1.3, -2.3 0.3 Z'},
];
const GRAPHITE = '#2C2C2C';
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
      <g stroke={E.bg} strokeWidth={9} strokeLinecap="round" fill={E.bg} opacity={0.85} filter={`url(#${id}-halo)`}>
        <path d={q.stem} fill="none" />
        <path d={q.dot} />
      </g>
      <g filter={`url(#${id})`} stroke={GRAPHITE} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={q.stem} strokeWidth={3.6} opacity={0.9} />
        <path d={q.ghost} strokeWidth={1.4} opacity={0.65} />
        <path d={q.dot} strokeWidth={2.2} fill={GRAPHITE} opacity={0.9} />
      </g>
    </svg>
  );
};

// The photo fills the right of the card under the headline and bleeds off the right
// and bottom edges; it starts clear of the wordmark so the footer stays on bone.
// Almost grayscale, then a tone curve that lifts the wall to just under the page tone
// once multiplied with it, rolling the highlights off instead of clipping them, and
// lifting the blacks a little so the fabric keeps its detail.
const FRAME = {x: 470, y: 505, w: S - 470, h: S - 505};
const TONE = '0.075 0.15 0.27 0.4 0.52 0.64 0.75 0.855 0.94 0.985 1';
const Hook: React.FC<P> = (p) => {
  const ph = PHOTO_A;
  const at = (x: number, y: number) =>
    ph ? [FRAME.x + (x - ph.origin[0]) * ph.scale, FRAME.y + (y - ph.origin[1]) * ph.scale] : [FRAME.x + x * FRAME.w, FRAME.y + y * FRAME.h];
  const marks = ph?.marks ?? PREVIEW_MARKS;
  const photo = (
    <>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="photo-tone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0.08" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={TONE} />
            <feFuncG type="table" tableValues={TONE} />
            <feFuncB type="table" tableValues={TONE} />
          </feComponentTransfer>
        </filter>
      </svg>
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
                filter: 'url(#photo-tone)',
              }}
            />
            <div style={{position: 'absolute', inset: 0, background: E.bg, mixBlendMode: 'multiply'}} />
            <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.1, mixBlendMode: 'overlay'}} />
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
    </>
  );
  return (
    <Card {...p} front={photo}>
      <div style={{position: 'absolute', left: M - 5, top: 119, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={head(124)}>DISCIPLINED…</div>
        <div style={{...head(124), marginBottom: 10}}>
          BUT TRAINING <Brush>WITHOUT</Brush>
        </div>
        <div style={head(124)}>UNDERSTANDING?</div>
      </div>
    </Card>
  );
};

// 2 — The mirror (15 words): the reader's own training log, shot from above on
// concrete. Every session written down, none of it measured.

// Seeded so every render draws the same concrete, handwriting jitter and strikes.
const rand = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const gray = '0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1';
const contrast = (slope: number) => {
  const intercept = 0.5 - slope / 2;
  return (['R', 'G', 'B'] as const).map((c) => React.createElement(`feFunc${c}`, {key: c, type: 'linear', slope, intercept}));
};

// Poured concrete in daylight: broad cloudy mottling, a softer trowel-scale layer,
// fine sand, sparse aggregate flecks and pores, lit from the top left. It sits above
// the page grain (which would tile on a mid-grey) and carries its own, untiled.
const Concrete: React.FC<{w: number; h: number}> = ({w, h}) => {
  const r = rand(42);
  const pores = Array.from({length: 70}, () => ({
    x: r() * w,
    y: r() * h,
    rx: 0.8 + r() * r() * 3.2,
    k: 0.5 + r() * 0.5,
    a: r() * 180,
    o: 0.22 + r() * 0.3,
  }));
  const flecks = Array.from({length: 60}, () => ({
    x: r() * w,
    y: r() * h,
    rx: 1.2 + r() * 2.4,
    k: 0.55 + r() * 0.45,
    a: r() * 180,
    c: r() < 0.5 ? '#D9D4CB' : r() < 0.5 ? '#6F6B66' : '#B9B3A8',
    o: 0.25 + r() * 0.3,
  }));
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <filter id="concrete" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood floodColor="#ADA9A2" result="base" />
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={4} seed={9} result="t1" />
          <feColorMatrix in="t1" type="matrix" values={gray} result="g1" />
          <feComponentTransfer in="g1" result="m1">{contrast(1.5)}</feComponentTransfer>
          <feBlend in="m1" in2="base" mode="soft-light" result="b1" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={3} seed={4} result="t2" />
          <feColorMatrix in="t2" type="matrix" values={gray} result="g2" />
          <feComponentTransfer in="g2" result="m2">{contrast(0.8)}</feComponentTransfer>
          <feBlend in="m2" in2="b1" mode="soft-light" result="b2" />
          <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves={2} seed={13} result="t3" />
          <feColorMatrix in="t3" type="matrix" values={gray} result="g3" />
          <feComponentTransfer in="g3" result="m3">{contrast(0.9)}</feComponentTransfer>
          <feBlend in="m3" in2="b2" mode="soft-light" result="b3" />
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={1} seed={27} result="t4" />
          <feColorMatrix in="t4" type="matrix" values={gray} result="g4" />
          <feComponentTransfer in="g4" result="m4">{contrast(0.5)}</feComponentTransfer>
          <feBlend in="m4" in2="b3" mode="overlay" />
        </filter>
        <radialGradient id="daylight" cx="0.18" cy="0.05" r="1.15">
          <stop offset="0" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.08} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} filter="url(#concrete)" />
      {flecks.map((f, i) => (
        <ellipse key={`f${i}`} cx={f.x} cy={f.y} rx={f.rx} ry={f.rx * f.k} transform={`rotate(${f.a} ${f.x} ${f.y})`} fill={f.c} opacity={f.o} />
      ))}
      {pores.map((p, i) => (
        <g key={`p${i}`} transform={`rotate(${p.a} ${p.x} ${p.y})`}>
          <ellipse cx={p.x + 0.5} cy={p.y + 0.7} rx={p.rx} ry={p.rx * p.k} fill="#fff" opacity={p.o * 0.35} />
          <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.rx * p.k} fill="#3E3B37" opacity={p.o} />
        </g>
      ))}
      <rect width={w} height={h} fill="url(#daylight)" />
    </svg>
  );
};

// One line of the log: what was written, optionally crossed out and rewritten after.
type Entry = {text: string; struck?: 'line' | 'scribble'; then?: string};
const LOG: Entry[][] = [
  [
    {text: 'hard'},
    {text: 'very hard'},
    {text: 'hard', struck: 'line', then: 'very hard'},
    {text: 'felt hard again'},
    {text: 'very hard', struck: 'scribble', then: 'hard'},
    {text: 'felt hard again'},
    {text: 'hard'},
  ],
  [
    {text: 'very hard'},
    {text: 'felt hard again'},
    {text: 'hard', struck: 'line', then: 'very hard'},
    {text: 'hard'},
    {text: 'hard', struck: 'scribble', then: 'very hard'},
  ],
];
const INK = '#20242C';
const CHAR_W = 0.42; // Caveat's average advance, in em, to size strikes before layout

// Handwriting from a font: each word stays one text run so Caveat's contextual
// alternates change repeated letters, and each word gets its own lift, tilt and
// width, so the same phrase never comes out twice the same.
const Hand: React.FC<{text: string; r: () => number}> = ({text, r}) => (
  <>
    {text.split(' ').map((word, i) => (
      <span
        key={i}
        style={{
          display: 'inline-block',
          marginLeft: i === 0 ? 0 : `${0.3 + r() * 0.08}em`,
          transform: `translateY(${(r() - 0.5) * 3}px) rotate(${(r() - 0.5) * 4}deg) scaleX(${0.94 + r() * 0.12})`,
          letterSpacing: `${(r() - 0.5) * 0.04}em`,
        }}
      >
        {word}
      </span>
    ))}
  </>
);

// A pen correction drawn fresh for every word: one or two quick strokes through it,
// or a scribble whose loops keep a hand-sized pitch whatever the word's length.
const Strike: React.FC<{kind: 'line' | 'scribble'; text: string; size: number; r: () => number; children: React.ReactNode}> = ({
  kind,
  text,
  size,
  r,
  children,
}) => {
  const w = text.length * CHAR_W * size;
  const j = (a: number) => (r() - 0.5) * a;
  let d: string;
  if (kind === 'line') {
    d = `M0 ${12 + j(4)} C 30 ${11 + j(3)}, 64 ${9 + j(3)}, 100 ${7.5 + j(4)}`;
    if (r() < 0.5) d += ` M4 ${14 + j(3)} C 40 ${12 + j(3)}, 70 ${11 + j(3)}, 97 ${9.5 + j(3)}`;
  } else {
    const pass = (y0: number, amp: number) => {
      let x = 0;
      let up = true;
      let path = `M0 ${y0}`;
      while (x < 100) {
        const step = ((5 + r() * 6) / w) * 100; // 5-11 px per half-loop, whatever the word
        const nx = Math.min(100, x + step);
        const ny = up ? 10 - amp * (0.7 + r() * 0.6) : 10 + amp * (0.7 + r() * 0.6);
        path += ` Q ${(x + step * 0.5).toFixed(1)} ${(ny + (up ? -1.5 : 1.5)).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
        x = nx;
        up = !up;
      }
      return path;
    };
    d = `${pass(10 + j(3), 6)} ${pass(11 + j(3), 4.5)}`;
  }
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {children}
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        style={{position: 'absolute', left: '-2%', width: '104%', top: '0.32em', height: '0.5em', overflow: 'visible'}}
      >
        <path d={d} stroke={INK} strokeWidth={kind === 'line' ? 2.4 : 2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
};

const NB = {w: 690, h: 392, cover: 8, rule0: 58, pitch: 46};
const PW = NB.w / 2 - NB.cover;
const PH = NB.h - 2 * NB.cover;
const DIP = 46; // the last px before the spine where the page curves down into it

// A page seen from straight above: head and tail edges and the rules dip slightly as
// the paper bends into the spine; the fold is a soft valley, not a drawn line.
const Page: React.FC<{side: 0 | 1}> = ({side}) => {
  const mx = (x: number) => (side === 0 ? x : PW - x); // mirror for the right page
  const edge = `M${mx(0)} 0 L${mx(PW - DIP)} 0 Q${mx(PW - 12)} 1 ${mx(PW)} 4 L${mx(PW)} ${PH - 4} Q${mx(PW - 12)} ${PH - 1} ${mx(PW - DIP)} ${PH} L${mx(0)} ${PH} Z`;
  const r = rand(7 + side * 13);
  const toGutter = side === 0 ? 'to right' : 'to left';
  return (
    <div
      style={{
        position: 'absolute',
        left: side === 0 ? NB.cover : NB.w / 2,
        top: NB.cover,
        width: PW,
        height: PH,
        clipPath: `path('${edge}')`,
        background: `linear-gradient(${toGutter}, rgba(70,60,50,0.07) 0%, rgba(0,0,0,0) 8%, rgba(255,255,255,0.16) 62%, rgba(0,0,0,0) 74%, rgba(60,48,36,0.16) 86%, rgba(40,30,20,0.46) 100%), #F2EEE6`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.18, mixBlendMode: 'overlay'}} />
      <svg width={PW} height={PH} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: 8}, (_, i) => {
          const y = NB.rule0 + i * NB.pitch;
          if (y > PH - 6) return null;
          return (
            <path
              key={i}
              d={`M${mx(0)} ${y} L${mx(PW - DIP)} ${y} Q${mx(PW - 14)} ${y + 0.6} ${mx(PW)} ${y + 2.4}`}
              stroke="#8C8A86"
              strokeOpacity={0.34}
              strokeWidth={1}
              fill="none"
            />
          );
        })}
      </svg>
      {LOG[side].map((e, i) => {
        const size = 38 + r() * 6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (side === 0 ? 22 : 50) + r() * 14,
              top: NB.rule0 + i * NB.pitch - size * 0.76 + (r() - 0.5) * 4,
              transform: `rotate(${-1.4 + r() * 2}deg) skewX(${-4 + r() * 6}deg)`,
              transformOrigin: '0 100%',
              fontFamily: HAND,
              fontWeight: 500,
              fontSize: size,
              lineHeight: 1,
              color: INK,
              opacity: 0.82 + r() * 0.13,
              whiteSpace: 'nowrap',
              filter: `url(#ink${i % 3})`,
            }}
          >
            {e.struck ? (
              <Strike kind={e.struck} text={e.text} size={size} r={r}>
                <Hand text={e.text} r={r} />
              </Strike>
            ) : (
              <Hand text={e.text} r={r} />
            )}
            {e.then && (
              <span style={{marginLeft: 22}}>
                <Hand text={e.then} r={r} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Open hardcover notebook from straight above: black boards with a faint lit edge,
// page blocks on the outer edges, and a soft daylight shadow down and to the right.
const Notebook: React.FC<{cx: number; cy: number; rot: number}> = ({cx, cy, rot}) => (
  <div
    style={{
      position: 'absolute',
      left: cx - NB.w / 2,
      top: cy - NB.h / 2,
      width: NB.w,
      height: NB.h,
      transform: `rotate(${rot}deg)`,
      borderRadius: 7,
      background: '#1B1B1C',
      boxShadow:
        'inset 1.5px 1.5px 0 rgba(255,255,255,0.24), 1px 2px 2px rgba(20,18,16,0.45), 8px 12px 18px rgba(20,18,16,0.32), 18px 26px 44px rgba(20,18,16,0.16)',
    }}
  >
    <svg width={0} height={0} style={{position: 'absolute'}}>
      {[0, 1, 2].map((k) => (
        <filter key={k} id={`ink${k}`} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={5 + k * 11} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.3} result="d" />
          <feGaussianBlur in="d" stdDeviation={0.25} />
        </filter>
      ))}
    </svg>
    <div style={{position: 'absolute', inset: 0, borderRadius: 7, backgroundImage: GRAIN, opacity: 0.35, mixBlendMode: 'overlay'}} />
    {[0, 1].map((side) => (
      <div
        key={side}
        style={{
          position: 'absolute',
          top: NB.cover,
          bottom: NB.cover,
          width: 5,
          [side === 0 ? 'left' : 'right']: NB.cover - 2,
          background: 'repeating-linear-gradient(to right, #D9D3C8 0 1px, #F1ECE3 1px 2px)',
          borderRadius: 2,
        }}
      />
    ))}
    <div style={{position: 'absolute', left: NB.w / 2 - 3, top: NB.cover + 3, width: 6, height: NB.h - 2 * NB.cover - 6, background: '#CFC9BE'}} />
    <Page side={0} />
    <Page side={1} />
    <div
      style={{
        position: 'absolute',
        left: NB.w / 2 - 9,
        top: NB.cover,
        width: 18,
        height: NB.h - 2 * NB.cover,
        background: 'linear-gradient(to right, rgba(30,24,18,0) 0%, rgba(30,24,18,0.22) 50%, rgba(30,24,18,0) 100%)',
      }}
    />
    <div style={{position: 'absolute', inset: 0, borderRadius: 7, background: 'linear-gradient(150deg, rgba(255,255,255,0.04), rgba(0,0,0,0.07))'}} />
  </div>
);

const BAND = {y: 376, h: 492};
const Mirror: React.FC<P> = (p) => (
  <Card
    {...p}
    front={
      <div style={{position: 'absolute', left: 0, top: BAND.y, width: S, height: BAND.h, overflow: 'hidden'}}>
        <Concrete w={S} h={BAND.h} />
        <Notebook cx={544} cy={BAND.h / 2 - 5} rot={-1.6} />
      </div>
    }
  >
    <div style={{position: 'absolute', left: M - 5, top: 119, display: 'flex', flexDirection: 'column', gap: 14}}>
      <div style={head(124)}>YOU SHOW UP.</div>
      <div style={head(124)}>EVERY SESSION.</div>
    </div>
    <div style={{position: 'absolute', left: M, top: BAND.y + BAND.h + 16, ...small(34, E.muted, 500)}}>
      But you can’t say <b style={{color: E.ink, fontWeight: 700}}>how hard</b>, <b style={{color: E.ink, fontWeight: 700}}>how much</b>, or{' '}
      <b style={{color: E.ink, fontWeight: 700}}>when</b>.
    </div>
  </Card>
);

// 3 — The switch (11 words): the same athlete and the same hold, twice. Left, seen
// without understanding: grey, soft. Right, seen with it: colour, sharp.
const SPLIT = {y: 376, h: 478}; // top aligned with card 2's band
const Half: React.FC<{side: 0 | 1}> = ({side}) => {
  const ph = PHOTO_B;
  return (
    <div style={{position: 'absolute', left: side * (S / 2), top: SPLIT.y, width: S / 2, height: SPLIT.h, overflow: 'hidden'}}>
      <Img
        src={staticFile(ph.src)}
        style={{
          position: 'absolute',
          left: -ph.origin[0] * ph.scale,
          top: -ph.origin[1] * ph.scale,
          width: ph.size[0] * ph.scale,
          height: ph.size[1] * ph.scale,
          maxWidth: 'none',
          // the soft side overhangs its half a little so the blur never feathers into the bone
          filter: side === 0 ? 'grayscale(1) sepia(0.12) contrast(0.92) brightness(1.06) blur(2.4px)' : undefined,
          transform: side === 0 ? 'scale(1.02)' : undefined,
          transformOrigin: '0 0',
        }}
      />
      {side === 0 && <div style={{position: 'absolute', inset: 0, background: E.bg, mixBlendMode: 'multiply'}} />}
      <div style={{position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.1, mixBlendMode: 'overlay'}} />
    </div>
  );
};

const LABEL = 96;
// A black tab hugging the caps of a Bebas word (caps sit 0.032-0.742em in its 0.88em
// line box), the same device as the wordmark's CALISTHENICS tab.
const Tab: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate', color: E.acid, marginRight: '0.09em'}}>
    <span style={{position: 'absolute', zIndex: -1, left: '-0.09em', right: '-0.09em', top: '-0.05em', bottom: '0.07em', background: E.ink}} />
    {children}
  </span>
);
const Switch: React.FC<P> = (p) => (
  <Card
    {...p}
    front={
      <>
        <Half side={0} />
        <Half side={1} />
        {/* stops at the band: the footer is the series strip, not part of either side */}
        <div style={{position: 'absolute', left: S / 2 - 1, top: 0, width: 2, height: SPLIT.y + SPLIT.h, background: E.ink}} />
      </>
    }
  >
    <div style={{position: 'absolute', left: M - 4, top: 119}}>
      <div style={head(LABEL)}>DUMB &amp;</div>
      <div style={{...head(LABEL), marginTop: 4}}>DISCIPLINED</div>
      <div style={{...small(34, E.muted, 600), marginTop: 16, textDecoration: 'line-through', textDecorationThickness: 3, textDecorationColor: E.ink}}>
        train hard. hope.
      </div>
    </div>
    <div style={{position: 'absolute', left: S / 2 + M - 4, top: 119}}>
      <div style={head(LABEL)}>
        <Tab>SMART</Tab> &amp;
      </div>
      <div style={{...head(LABEL), marginTop: 4}}>DISCIPLINED</div>
      <div style={{...small(34, E.ink, 600), marginTop: 16}}>train hard. know why.</div>
    </div>
  </Card>
);

// 4 — Three questions, three answers (11 words): the three books standing on the bone
// ground, each under the question it answers. Cover artwork untouched: no tint, sheen,
// crease or grain over it.
const SHELF = {
  base: 884, // where the books stand
  h: 418,
  persp: 3.5,
  books: [
    {src: 'covers/intensity.webp', cx: 223, ry: 22, q: 'HOW HARD?'},
    {src: 'covers/volume.webp', cx: 540, ry: 0, q: 'HOW MUCH?'},
    {src: 'covers/periodization.webp', cx: 860, ry: -22, q: 'WHEN?'},
  ],
};
// Contact shadow where a book meets the ground: a wide ambient pool, and a dark line the
// full width of the base so the corners sit down too.
const Contact: React.FC<{cx: number; w: number; tilt: number}> = ({cx, w, tilt}) => (
  <div style={{position: 'absolute', left: cx - w * 0.68, top: SHELF.base - 26, width: w * 1.36, height: 52, transform: `rotate(${tilt}deg)`}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(closest-side, rgba(28,22,16,0.30), rgba(28,22,16,0.12) 60%, rgba(28,22,16,0) 100%)'}} />
    <div
      style={{
        position: 'absolute',
        left: w * 0.18 - 3,
        width: w + 6,
        top: 24,
        height: 5,
        background: 'linear-gradient(to right, rgba(12,10,8,0), rgba(12,10,8,0.6) 4%, rgba(12,10,8,0.6) 96%, rgba(12,10,8,0))',
        filter: 'blur(1.5px)',
      }}
    />
  </div>
);
// Slope of a turned book's base on screen (deg): Book3D's perspective makes the near
// corner of the front board drop and the far one rise, so the contact line follows it.
const baseSlope = (ry: number, w: number) => {
  const a = (ry * Math.PI) / 180;
  const d = SHELF.h * SHELF.persp;
  const z = (SHELF.h * 0.075) / 2; // front board sits half a book thickness forward
  const corner = (x: number) => {
    const X = x * Math.cos(a) + z * Math.sin(a);
    const Z = -x * Math.sin(a) + z * Math.cos(a);
    const k = d / (d - Z);
    return [X * k, (SHELF.h / 2) * k];
  };
  const [x0, y0] = corner(-w / 2);
  const [x1, y1] = corner(w / 2);
  return (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
};
const Q_TRACK = 0.12;
const Questions: React.FC<P> = (p) => {
  const w = (SHELF.h * 2) / 3;
  return (
    <Card
      {...p}
      front={SHELF.books.map((b) => (
        <React.Fragment key={b.src}>
          <Contact cx={b.cx} w={w * Math.cos((b.ry * Math.PI) / 180) + 10} tilt={baseSlope(b.ry, w)} />
          <Book3D
            src={b.src}
            pose={{cx: b.cx, cy: SHELF.base - SHELF.h / 2, h: SHELF.h, rx: 0, ry: b.ry, rz: 0}}
            persp={SHELF.persp}
            sheen={false}
            hinge={false}
            paper={['#D2CABD', '#B5AD9F']}
          />
        </React.Fragment>
      ))}
    >
      <div style={{position: 'absolute', left: M - 5, top: 119, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div style={head(124)}>EVERY SESSION STOPS</div>
        <div style={head(124)}>BEING A GUESS.</div>
      </div>
      {SHELF.books.map((b) => (
        <div
          key={b.q}
          style={{
            position: 'absolute',
            left: b.cx - 160,
            width: 320,
            top: SHELF.base - SHELF.h - 72,
            textAlign: 'center',
            ...small(34, E.ink, 700),
            letterSpacing: `${Q_TRACK}em`,
            paddingLeft: `${Q_TRACK}em`, // balance the trailing tracking so it centres on the book
          }}
        >
          {b.q}
        </div>
      ))}
    </Card>
  );
};

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
  <Card
    {...p}
    front={TRIO(310, 330, [330, 540, 750], 16).map((b) => (
      <Book3D key={b.src} src={b.src} pose={b.pose} filter={covers} />
    ))}
  >
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

export const DECK_C: React.FC<P>[] = [Hook, Mirror, Switch, Questions, Proof, Offer];
