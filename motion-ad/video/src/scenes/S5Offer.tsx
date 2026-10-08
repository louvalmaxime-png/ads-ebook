import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {C, HEAD, body, head} from '../theme';
import {CLAMP, lerp, pop, prog, slam, spr} from '../anim';
import {PACK, packX, packY} from '../layout';
import {Words, seq} from '../ui/Words';
import {glow, glowFilter} from './IntensityBook';

type Rise = {x: number; y: number; w: number; h: number; at: number; rgb: string; src: string};
const VOL: Rise = {
  x: packX(330), y: packY(222), w: 370 * PACK.s, h: 520 * PACK.s, at: 435, rgb: '66,198,204', src: 'img/volume.png',
};
const PER: Rise = {
  x: packX(664), y: packY(222), w: 326 * PACK.s, h: 520 * PACK.s, at: 450, rgb: '158,101,203', src: 'img/periodization.png',
};
const FLOOR = 610; // books rise out from behind this line
const RISE = 520;

const Rising: React.FC<{b: Rise}> = ({b}) => {
  const f = useCurrentFrame();
  if (f < b.at) return null;
  const r = spr(f, b.at, {stiffness: 170, damping: 20});
  return (
    <Img
      src={staticFile(b.src)}
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y + lerp(RISE, 0, r),
        width: b.w,
        height: b.h,
        filter: glowFilter(b.rgb, glow(f, b.at)),
      }}
    />
  );
};

const Books: React.FC = () => (
  <AbsoluteFill style={{clipPath: `inset(0 0 ${980 - FLOOR}px 0)`}}>
    <Rising b={PER} />
    <Rising b={VOL} />
  </AbsoluteFill>
);

export const S5Books: React.FC = () => {
  const f = useCurrentFrame();
  const blur = f >= VOL.at && f <= PER.at + 14;
  return blur ? (
    <CameraMotionBlur samples={8} shutterAngle={180}>
      <Books />
    </CameraMotionBlur>
  ) : (
    <Books />
  );
};

// Price line + tag share one centred row.
const PRICE_W = 6.17 * 104;
const TAG_W = 196;
const ROW_X = (900 - (PRICE_W + 24 + TAG_W)) / 2;
const PRICE_Y = 556;

const Tag: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 495) return null;
  const ang = lerp(-70, -8, spr(f, 495, {stiffness: 120, damping: 8}));
  const appear = interpolate(f, [495, 498], [0, 1], CLAMP);
  return (
    <svg
      width={TAG_W}
      height={112}
      viewBox="0 0 196 112"
      style={{
        position: 'absolute',
        left: ROW_X + PRICE_W + 24,
        top: PRICE_Y + 4,
        transform: `rotate(${ang}deg)`,
        transformOrigin: '22px 56px',
        opacity: appear,
        overflow: 'visible',
      }}
    >
      <path
        d="M30 2 H184 Q194 2 194 12 V100 Q194 110 184 110 H30 L3 56 Z"
        fill={C.red}
        stroke={C.red}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <circle cx={22} cy={56} r={6} fill={C.bg} />
      <text x={113} y={45} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill="#fff" letterSpacing="1">
        UP TO
      </text>
      <text x={113} y={95} textAnchor="middle" fontFamily={HEAD} fontSize={52} fill="#fff">
        55% OFF
      </text>
    </svg>
  );
};

const Button: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 510) return null;
  const pulse = 1 + 0.04 * Math.sin(Math.PI * prog(f, 570, 12, (x) => x));
  const sheen = prog(f, 540, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: 230,
        top: 676,
        width: 440,
        height: 104,
        transform: `scale(${pop(f, 510) * pulse})`,
        transformOrigin: '50% 50%',
        opacity: interpolate(f, [510, 513], [0, 1], CLAMP),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.red,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 14px 30px rgba(214,60,30,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{...head(66, '#FFFFFF'), lineHeight: 1, letterSpacing: '0.02em', transform: 'translateY(3px)'}}>
          GET THE PACK
        </span>
        {sheen > 0 && sheen < 1 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '45%',
              left: `${lerp(-50, 110, sheen)}%`,
              background:
                'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
};

// 405-600 OFFER -> static end card from 525.
export const S5Text: React.FC = () => {
  const f = useCurrentFrame();
  const price = slam(f, 480);
  const center: React.CSSProperties = {position: 'absolute', left: 0, width: 900, textAlign: 'center'};
  return (
    <>
      <Words
        words={[
          {t: 'HOW', at: 420},
          {t: 'HARD.', at: 423},
          {t: 'HOW', at: 435},
          {t: 'MUCH.', at: 438},
          {t: 'WHEN.', at: 450, color: C.red},
        ]}
        style={{...center, top: 0, ...head(96)}}
      />
      {price !== null && (
        <div
          style={{
            position: 'absolute',
            left: ROW_X,
            top: PRICE_Y,
            ...head(104),
            transform: `scale(${price})`,
            transformOrigin: '50% 60%',
          }}
        >
          ALL THREE — <span style={{color: C.red}}>$44.99</span>
        </div>
      )}
      <Tag />
      <Button />
      <Words
        words={[...seq('Instant download', 514, 2), {t: '•', at: 518, color: C.red}, ...seq('Private Discord included', 520, 2)]}
        style={{...center, top: 802, ...body(34)}}
      />
      <Words words={seq('Founding seats, limited', 518, 2)} style={{...center, top: 843, ...body(34)}} />
      <Words words={[{t: 'maximecalisthenics.com', at: 522}]} style={{...center, top: 900, ...body(34, C.muted)}} />
    </>
  );
};
