import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {Fmt} from './layout';
import {S2, S5} from './timeline';
import {S1Hook} from './scenes/S1Hook';
import {CoreLayers} from './CoreLayers';
import {DesignBox} from './ui/DesignBox';
import {Footer} from './ui/Footer';
import {Sound} from './Sound';
import cues from './cues.json';

export const Ad: React.FC<{fmt: Fmt}> = ({fmt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sound cues={cues} silence={[462, 480]} fadeOut={[570, 600]} />
      <DesignBox fmt={fmt}>
        {f < S2 && <S1Hook />}
        <CoreLayers />
        {f < S5 && <Footer />}
      </DesignBox>
    </AbsoluteFill>
  );
};
