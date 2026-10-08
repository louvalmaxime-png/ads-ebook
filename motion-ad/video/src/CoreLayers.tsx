import React from 'react';
import {useCurrentFrame} from 'remotion';
import {S2, S3, S4, S5} from './timeline';
import {S2Steps} from './scenes/S2Steps';
import {S3Hard} from './scenes/S3Hard';
import {Marker, RulerOrbit} from './scenes/RulerOrbit';
import {S4Instrument} from './scenes/S4Instrument';
import {IntensityBook} from './scenes/IntensityBook';
import {S5Books, S5Text} from './scenes/S5Offer';

// Steps -> ruler -> instrument -> pack, on the motion ad's timeline (frames 105-600).
export const CoreLayers: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {f >= S2 && f < S3 && <S2Steps />}
      {f >= S3 && f < S4 && <S3Hard />}
      <RulerOrbit />
      {f >= S4 && f < S5 + 15 && <S4Instrument />}
      <IntensityBook />
      {f >= S5 && <S5Books />}
      {f >= S5 && <S5Text />}
      <Marker />
    </>
  );
};
