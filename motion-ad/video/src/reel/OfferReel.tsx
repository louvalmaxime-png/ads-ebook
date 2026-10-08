import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {C, HEAD, body, head} from '../theme';
import {CLAMP, lerp, pop, prog, slam, spr} from '../anim';
import {Book3D, Pose} from '../ui/Book3D';
import {Words, seq} from '../ui/Words';
import {bookFilter} from '../scenes/IntensityBook';

const T0 = 660;
const BOOKS: Array<{src: string; at: number; ry0: number; pose: Pose}> = [
  {src: 'covers/intensity.webp', at: T0, ry0: 40, pose: {cx: 280, cy: 168, h: 262, rx: 0, ry: 18, rz: 0}},
  {src: 'covers/periodization.webp', at: T0 + 3, ry0: -40, pose: {cx: 620, cy: 168, h: 262, rx: 0, ry: -18, rz: 0}},
  {src: 'covers/volume.webp', at: T0 + 6, ry0: 0, pose: {cx: 450, cy: 163, h: 270, rx: 0, ry: 0, rz: 0}},
];

const Trio: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {BOOKS.map((b) => {
        if (f < b.at) return null;
        const r = spr(f, b.at, {stiffness: 170, damping: 20});
        const pose = {...b.pose, cy: b.pose.cy + lerp(320, 0, r), ry: lerp(b.ry0, b.pose.ry, r)};
        return <Book3D key={b.src} src={b.src} pose={pose} filter={bookFilter('0,0,0', 0)} />;
      })}
    </AbsoluteFill>
  );
};

const PRICE_W = 6.17 * 100;
const TAG_W = 190;
const ROW_X = (900 - (PRICE_W + 26 + TAG_W)) / 2;
const ITEMS = [
  'Intensity, Volume & Periodization ebooks',
  'Volume calculator (Excel)',
  'Private Discord',
  '14-day money-back guarantee',
  'Instant download · English, French, Italian',
];
const CL_X = 119;

// 660-825 OFFER, the carousel's last card in motion; static from ~f770.
export const OfferReel: React.FC = () => {
  const f = useCurrentFrame();
  const price = slam(f, 690);
  const strike = prog(f, 682, 8);
  const tagAng = lerp(-70, -7, spr(f, 705, {stiffness: 120, damping: 8}));
  const pulse = 1 + 0.04 * Math.sin(Math.PI * prog(f, 810, 12, (x) => x));
  const sheen = prog(f, 785, 14);
  const blur = f >= T0 && f <= T0 + 20;
  return (
    <>
      {blur ? (
        <CameraMotionBlur samples={8} shutterAngle={180}>
          <Trio />
        </CameraMotionBlur>
      ) : (
        <Trio />
      )}
      <div style={{position: 'absolute', left: ROW_X, top: 308, display: 'flex', gap: 9, ...body(30, C.muted)}}>
        <span style={{position: 'relative'}}>
          <Words words={[{t: '$99.99', at: 676}]} style={{}} />
          <span
            style={{
              position: 'absolute',
              left: -3,
              right: -3,
              top: '52%',
              height: 3,
              background: C.red,
              transform: `scaleX(${strike})`,
              transformOrigin: '0 50%',
            }}
          />
        </span>
        <Words words={seq('bought separately', 678, 2)} style={{}} />
      </div>
      {price !== null && (
        <div style={{position: 'absolute', left: ROW_X, top: 348, ...head(100), transform: `scale(${price})`, transformOrigin: '50% 60%'}}>
          ALL THREE — <span style={{color: C.red}}>$44.99</span>
        </div>
      )}
      {f >= 705 && (
        <svg
          width={TAG_W}
          height={92}
          viewBox="0 0 190 92"
          style={{
            position: 'absolute',
            left: ROW_X + PRICE_W + 26,
            top: 352,
            transform: `rotate(${tagAng}deg)`,
            transformOrigin: '20px 46px',
            opacity: interpolate(f, [705, 708], [0, 1], CLAMP),
            overflow: 'visible',
          }}
        >
          <path d="M27 2 H178 Q188 2 188 12 V80 Q188 90 178 90 H27 L3 46 Z" fill={C.red} stroke={C.red} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={19} cy={46} r={6} fill={C.bg} />
          <text x={109} y={64} textAnchor="middle" fontFamily={HEAD} fontSize={50} fill="#fff">
            SAVE 55%
          </text>
        </svg>
      )}
      <div style={{position: 'absolute', left: CL_X, top: 468, display: 'flex', flexDirection: 'column', gap: 10}}>
        {ITEMS.map((t, i) => {
          const at = 716 + 6 * i;
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, height: 37}}>
              <svg width={32} height={32} viewBox="0 0 24 24" style={{flexShrink: 0}}>
                <path
                  d="M4 12.5 L9.5 18 L20 6.5"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - prog(f, at, 8)}
                  stroke={C.red}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Words words={seq(t, at + 2, 1)} style={body(31)} />
            </div>
          );
        })}
      </div>
      <Words
        words={[{t: 'FOUNDING SEATS, LIMITED', at: 748, color: C.red}]}
        style={{position: 'absolute', left: 0, width: 900, top: 718, textAlign: 'center', ...body(27, C.red, 600), letterSpacing: '0.06em'}}
      />
      {f >= 755 && (
        <div
          style={{
            position: 'absolute',
            left: 210,
            top: 770,
            width: 480,
            height: 100,
            transform: `scale(${pop(f, 755) * pulse})`,
            opacity: interpolate(f, [755, 758], [0, 1], CLAMP),
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
            <span style={{...head(66, '#FFFFFF'), lineHeight: 1, letterSpacing: '0.02em', transform: 'translateY(3px)'}}>GET THE PACK</span>
            {sheen > 0 && sheen < 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '45%',
                  left: `${lerp(-50, 110, sheen)}%`,
                  background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 100%)',
                }}
              />
            )}
          </div>
        </div>
      )}
      <Words
        words={[{t: 'maximecalisthenics.com', at: 760}]}
        style={{position: 'absolute', left: 0, width: 900, top: 898, textAlign: 'center', ...body(32, C.muted)}}
      />
    </>
  );
};
