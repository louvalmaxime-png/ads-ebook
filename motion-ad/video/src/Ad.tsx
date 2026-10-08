import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {BOX, Fmt, PLACE} from './layout';
import {S2, S3, S4, S5} from './timeline';
import {S1Hook} from './scenes/S1Hook';
import {S2Steps} from './scenes/S2Steps';
import {S3Hard} from './scenes/S3Hard';
import {Marker, RulerOrbit} from './scenes/RulerOrbit';
import {S4Instrument} from './scenes/S4Instrument';
import {IntensityBook} from './scenes/IntensityBook';
import {S5Books, S5Text} from './scenes/S5Offer';
import {Footer} from './ui/Footer';
import {Sound} from './Sound';

export const Ad: React.FC<{fmt: Fmt}> = ({fmt}) => {
  const f = useCurrentFrame();
  const p = PLACE[fmt];
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sound />
      <div
        style={{
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: BOX.w,
          height: BOX.h,
          transform: `scale(${p.s})`,
          transformOrigin: '0 0',
        }}
      >
        {f < S2 && <S1Hook />}
        {f >= S2 && f < S3 && <S2Steps />}
        {f >= S3 && f < S4 && <S3Hard />}
        <RulerOrbit />
        {f >= S4 && f < S5 + 15 && <S4Instrument />}
        <IntensityBook />
        {f >= S5 && <S5Books />}
        {f >= S5 && <S5Text />}
        <Marker />
        {f < S5 && <Footer />}
      </div>
    </AbsoluteFill>
  );
};
