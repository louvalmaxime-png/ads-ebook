import React from 'react';
import {Bubble} from '../ui/Bubble';
import {Book3D, Pose} from '../ui/Book3D';
import {bookFilter} from '../scenes/IntensityBook';
import {C, Card, Check, Eyebrow, INNER, M, Ruler, S, Stairs, Stars, body, centerText, head} from './parts';

type P = {index: number; total: number};

// Hook A: the prospect's own words, then the validation.
export const HookWall: React.FC<P> = (p) => (
  <Card {...p} swipe>
    <Eyebrow />
    <Bubble text="Tuck to straddle feels like a wall" tail="left" style={{left: M, top: 132}} />
    <div style={{position: 'absolute', left: M - 6, top: 300}}>
      <div style={head(212)}>BECAUSE</div>
      <div style={head(212, C.red)}>IT IS ONE.</div>
    </div>
    <Stairs x={560} base={960} w={448} h={320} stroke={4.5} />
  </Card>
);

// Hook B and the A deck's "cause" card share this layout.
const NumberCard: React.FC<P & {hook?: boolean; line: string}> = ({hook, line, ...p}) => (
  <Card {...p} swipe={hook}>
    {hook && <Eyebrow />}
    <div style={{position: 'absolute', left: M - 6, top: hook ? 128 : 96}}>
      <div style={head(186)}>“IT WAS HARD”</div>
      <div style={head(186)}>IS NOT A</div>
      <div style={head(186, C.red)}>NUMBER.</div>
    </div>
    <Ruler x={M} top={hook ? 760 : 740} w={INNER} marker={0.62} ghosts={[0.27, 0.45, 0.83]} />
    <div style={{position: 'absolute', left: M, top: hook ? 868 : 848, ...body(36)}}>{line}</div>
  </Card>
);
export const HookNumber: React.FC<P> = (p) => <NumberCard {...p} hook line="So when are you ready to move up?" />;
export const Cause: React.FC<P> = (p) => <NumberCard {...p} line="Train by feel and you never know when to move up." />;

export const Steps: React.FC<P> = (p) => (
  <Card {...p}>
    <div style={{position: 'absolute', left: M - 5, top: M}}>
      <div style={head(150)}>FOUR STEPS THAT</div>
      <div style={head(150)}>LOOK EQUAL.</div>
      <div style={head(150, C.red)}>THEY AREN’T.</div>
    </div>
    <Stairs x={M} base={960} w={INNER} h={436} labels />
  </Card>
);

const ORB = {cx: 540, cy: 650, r: 214};
const DIAG = ORB.r * Math.SQRT1_2;
const CALLOUTS = [
  {dx: -1, dy: -1, lines: ['A 1–10 scale', 'for static holds']},
  {dx: 1, dy: -1, lines: ['Know exactly', 'when to progress']},
  {dx: -1, dy: 1, lines: ['Planche and', 'front lever only']},
  {dx: 1, dy: 1, lines: ['Private Discord', 'access included']},
];
export const Instrument: React.FC<P> = (p) => (
  <Card {...p}>
    <div style={{...centerText(M), ...head(140, C.red)}}>AN INSTRUMENT</div>
    <div style={{...centerText(M + 126), ...head(140)}}>NOT A GUESS</div>
    <svg width={S} height={S} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: 51}, (_, n) => {
        const a = Math.PI + (2 * Math.PI * n) / 51;
        return <circle key={n} cx={ORB.cx + ORB.r * Math.cos(a)} cy={ORB.cy + ORB.r * Math.sin(a)} r={3.5} fill={C.dots} />;
      })}
    </svg>
    <div
      style={{
        position: 'absolute',
        left: ORB.cx - 140,
        top: ORB.cy + 236,
        width: 280,
        height: 40,
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(18,21,24,0.22), rgba(18,21,24,0))',
      }}
    />
    <Book3D src="covers/intensity.webp" pose={{cx: ORB.cx, cy: ORB.cy, h: 392, rx: 6, ry: -30, rz: 7}} filter={bookFilter('0,0,0', 0)} />
    {CALLOUTS.map((c, i) => {
      const x = ORB.cx + c.dx * DIAG;
      const y = ORB.cy + c.dy * DIAG;
      const pos: React.CSSProperties = c.dx < 0 ? {right: S - (x - 20), textAlign: 'right'} : {left: x + 20};
      return (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: 10, background: C.red}} />
          <div style={{position: 'absolute', top: y - 41, ...pos, ...body(34)}}>
            {c.lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </React.Fragment>
      );
    })}
  </Card>
);

const TRIO = (cy: number, h: number, cx: [number, number, number], ry = 20): Array<{src: string; pose: Pose}> => [
  {src: 'covers/intensity.webp', pose: {cx: cx[0], cy, h, rx: 0, ry, rz: 0}},
  {src: 'covers/periodization.webp', pose: {cx: cx[2], cy, h, rx: 0, ry: -ry, rz: 0}},
  {src: 'covers/volume.webp', pose: {cx: cx[1], cy: cy - h * 0.02, h: h * 1.03, rx: 0, ry: 0, rz: 0}},
];

const SYSTEM = [
  {x: 240, color: C.glowI, lines: ['The 1–10 scale', 'for static holds']},
  {x: 540, color: C.glowV, lines: ['Volume calculator', '(Excel) included']},
  {x: 840, color: C.glowP, lines: ['Weeks and months,', 'structured']},
];
export const System: React.FC<P> = (p) => (
  <Card {...p}>
    <div style={{...centerText(M), ...head(100)}}>
      HOW HARD. HOW MUCH. <span style={{color: C.red}}>WHEN.</span>
    </div>
    {TRIO(430, 392, [240, 540, 840], 16).map((b) => (
      <Book3D key={b.src} src={b.src} pose={b.pose} filter={bookFilter('0,0,0', 0)} />
    ))}
    {SYSTEM.map((s) => (
      <div key={s.x} style={{position: 'absolute', left: s.x - 150, width: 300, top: 668, textAlign: 'center'}}>
        <div style={{width: 64, height: 4, background: s.color, margin: '0 auto 18px'}} />
        {s.lines.map((l) => (
          <div key={l} style={body(30)}>
            {l}
          </div>
        ))}
      </div>
    ))}
    <div style={{...centerText(840), ...head(52)}}>
      + PRIVATE DISCORD <span style={{color: C.red}}>INCLUDED</span>
    </div>
  </Card>
);

const REVIEWS = [
  {
    name: 'Ilian',
    stars: 5,
    text: 'These e-books were just the push I needed to reevaluate my approach and stop trying to move forward blindly. I’ve made great progress ever since!!',
  },
  {
    name: 'KingOfCalisthenics',
    stars: 5,
    text: 'I recommend this to beginners as well as already strong athletes, because these 3 ebooks teach fundamentals that EVERYONE should know',
  },
];
export const Proof: React.FC<P> = (p) => (
  <Card {...p} right="Reviews: maximecalisthenics.com">
    <div style={{position: 'absolute', left: M - 5, top: M, ...head(130)}}>
      WHAT READERS <span style={{color: C.red}}>SAY</span>
    </div>
    <div style={{position: 'absolute', left: M, top: 236, width: INNER, display: 'flex', flexDirection: 'column', gap: 26}}>
      {REVIEWS.map((r) => (
        <div key={r.name} style={{background: C.ink, borderRadius: 26, padding: '36px 42px 34px'}}>
          <Stars n={r.stars} />
          <div style={{...body(33, '#F3F1EC'), whiteSpace: 'normal', textWrap: 'pretty', lineHeight: 1.36, marginTop: 18} as React.CSSProperties}>“{r.text}”</div>
          <div style={{...body(28, '#A9A69F', 600), marginTop: 20}}>{r.name}</div>
        </div>
      ))}
    </div>
  </Card>
);

const INCLUDED = [
  'Intensity, Volume & Periodization ebooks',
  'Volume calculator (Excel)',
  'Private Discord',
  '14-day money-back guarantee',
  'Instant download · English, French, Italian',
];
const PRICE_W = 6.17 * 104;
const TAG_W = 200;
const ROW_X = (S - (PRICE_W + 26 + TAG_W)) / 2;
export const Offer: React.FC<P> = (p) => (
  <Card {...p}>
    {TRIO(222, 286, [358, 540, 722], 18).map((b) => (
      <Book3D key={b.src} src={b.src} pose={b.pose} filter={bookFilter('0,0,0', 0)} />
    ))}
    <div style={{position: 'absolute', left: ROW_X, top: 392, ...body(30, C.muted)}}>
      <span style={{position: 'relative'}}>
        $99.99
        <span style={{position: 'absolute', left: -3, right: -3, top: '52%', height: 3, background: C.red}} />
      </span>{' '}
      bought separately
    </div>
    <div style={{position: 'absolute', left: ROW_X, top: 432, ...head(104)}}>
      ALL THREE — <span style={{color: C.red}}>$44.99</span>
    </div>
    <svg
      width={TAG_W}
      height={96}
      viewBox="0 0 200 96"
      style={{position: 'absolute', left: ROW_X + PRICE_W + 26, top: 438, transform: 'rotate(-7deg)', transformOrigin: '20px 48px', overflow: 'visible'}}
    >
      <path d="M28 2 H188 Q198 2 198 12 V84 Q198 94 188 94 H28 L3 48 Z" fill={C.red} stroke={C.red} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={20} cy={48} r={6} fill={C.bg} />
      <text x={114} y={66} textAnchor="middle" fontFamily="'Bebas Neue'" fontSize={52} fill="#fff">
        SAVE 55%
      </text>
    </svg>
    <div style={{position: 'absolute', left: 166, top: 560, display: 'flex', flexDirection: 'column', gap: 10}}>
      {INCLUDED.map((t) => (
        <div key={t} style={{display: 'flex', alignItems: 'center', gap: 16, ...body(32)}}>
          <Check />
          {t}
        </div>
      ))}
    </div>
    <div style={{...centerText(806), ...body(28, C.red, 600), letterSpacing: '0.06em'}}>FOUNDING SEATS, LIMITED</div>
    <div
      style={{
        position: 'absolute',
        left: (S - 520) / 2,
        top: 856,
        width: 520,
        height: 104,
        background: C.red,
        borderRadius: 14,
        boxShadow: '0 14px 30px rgba(214,60,30,0.28)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{...head(68, '#FFFFFF'), lineHeight: 1, letterSpacing: '0.02em', transform: 'translateY(3px)'}}>GET THE PACK</span>
    </div>
  </Card>
);

// Two decks for the A/B hook test: only the opening differs.
export const DECKS: Record<'A' | 'B', React.FC<P>[]> = {
  A: [HookWall, Steps, Cause, Instrument, System, Proof, Offer],
  B: [HookNumber, Steps, Instrument, System, Proof, Offer],
};

export const CarouselCard: React.FC<{deck: 'A' | 'B'; index: number}> = ({deck, index}) => {
  const cards = DECKS[deck];
  const Comp = cards[index - 1];
  return <Comp index={index} total={cards.length} />;
};
