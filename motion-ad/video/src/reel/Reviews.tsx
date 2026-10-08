import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, body, head} from '../theme';
import {CLAMP, lerp, prog, spr} from '../anim';
import {Words} from '../ui/Words';

const STAR = 'M12 2.5 L14.9 8.6 L21.5 9.4 L16.6 13.9 L17.9 20.5 L12 17.3 L6.1 20.5 L7.4 13.9 L2.5 9.4 L9.1 8.6 Z';

// Verbatim reviews from maximecalisthenics.com; `hl` marks the phrase to highlight.
const REVIEWS = [
  {
    name: 'Ilian',
    at: 534,
    hl: [13, 18],
    text: '“These e-books were just the push I needed to reevaluate my approach and stop trying to move forward blindly. I’ve made great progress ever since!!”',
  },
  {
    name: 'KingOfCalisthenics',
    at: 556,
    hl: [16, 20],
    text: '“I recommend this to beginners as well as already strong athletes, because these 3 ebooks teach fundamentals that EVERYONE should know”',
  },
];

const Quote: React.FC<{text: string; at: number; hl: number[]}> = ({text, at, hl}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const hlAt = at + words.length + 12;
  return (
    <div style={{...body(32, '#F3F1EC'), whiteSpace: 'normal', lineHeight: 1.36, marginTop: 18}}>
      {words.map((w, i) => {
        const inT = prog(f, at + 8 + i, 10);
        const key = i >= hl[0] && i <= hl[1];
        const mark = key ? prog(f, hlAt + (i - hl[0]) * 2, 6) : 0;
        return (
          <React.Fragment key={i}>
            {i > 0 ? ' ' : null}
            <span style={{position: 'relative', display: 'inline-block'}}>
              {key && (
                <span
                  style={{
                    position: 'absolute',
                    left: -5,
                    right: -5,
                    top: '6%',
                    bottom: '2%',
                    background: C.red,
                    borderRadius: 5,
                    transform: `scaleX(${mark})`,
                    transformOrigin: '0 50%',
                  }}
                />
              )}
              <span style={{position: 'relative', display: 'inline-block', overflow: 'hidden', verticalAlign: 'top'}}>
                <span style={{display: 'inline-block', transform: `translateY(${(1 - inT) * 108}%)`}}>{w}</span>
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Card: React.FC<{r: (typeof REVIEWS)[number]}> = ({r}) => {
  const f = useCurrentFrame();
  const e = spr(f, r.at, {stiffness: 170, damping: 20});
  return (
    <div
      style={{
        background: C.ink,
        borderRadius: 26,
        padding: '34px 40px 32px',
        opacity: interpolate(f, [r.at, r.at + 4], [0, 1], CLAMP),
        transform: `translateY(${lerp(40, 0, e)}px) scale(${lerp(0.97, 1, e)})`,
      }}
    >
      <div style={{display: 'flex', gap: 6}}>
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            width={34}
            height={34}
            viewBox="0 0 24 24"
            style={{transform: `scale(${spr(f, r.at + 4 + 2 * i, {stiffness: 300, damping: 16})})`}}
          >
            <path d={STAR} fill="#F2B705" />
          </svg>
        ))}
      </div>
      <Quote text={r.text} at={r.at} hl={r.hl} />
      <Words words={[{t: r.name, at: r.at + 12}]} style={{...body(28, '#A9A69F', 600), marginTop: 20}} />
    </div>
  );
};

// 525-660 PROOF: two 5-star reviews, key phrase highlighted.
export const Reviews: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Words
        words={[{t: 'WHAT', at: 525}, {t: 'READERS', at: 528}, {t: 'SAY', at: 531, color: C.red}]}
        style={{position: 'absolute', left: -5, top: 0, ...head(124)}}
      />
      <div style={{position: 'absolute', left: 0, top: 168, width: 900, display: 'flex', flexDirection: 'column', gap: 26}}>
        {REVIEWS.map((r) => (f >= r.at ? <Card key={r.name} r={r} /> : <div key={r.name} />))}
      </div>
      <div style={{position: 'absolute', right: 0, top: 939, ...body(34, C.muted)}}>Reviews: maximecalisthenics.com</div>
    </>
  );
};
