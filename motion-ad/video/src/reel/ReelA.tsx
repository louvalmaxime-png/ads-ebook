import React from 'react';
import {AbsoluteFill, Freeze, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {CoreLayers} from '../CoreLayers';
import {DesignBox} from '../ui/DesignBox';
import {Footer} from '../ui/Footer';
import {Sound} from '../Sound';
import {HookA} from './HookA';
import {CauseCaption, SystemRows} from './Overlays';
import {Reviews} from './Reviews';
import {OfferReel} from './OfferReel';
import cues from './cues.json';

export const REEL_DURATION = 825; // 27.5 s

// Carousel A as a 9:16 Reel: hook -> steps -> cause -> instrument -> pack -> reviews -> offer.
export const ReelA: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Sound cues={cues} silence={[675, 690]} fadeOut={[795, 825]} />
      <DesignBox fmt="916">
        {f < 105 && <HookA />}
        {f >= 105 && f < 480 && <CoreLayers />}
        {f >= 480 && f < 525 && (
          <Freeze frame={479}>
            <CoreLayers />
          </Freeze>
        )}
        {f >= 210 && f < 300 && <CauseCaption />}
        {f >= 456 && f < 525 && <SystemRows />}
        {f >= 525 && f < 660 && <Reviews />}
        {f >= 660 && <OfferReel />}
        {f < 405 && <Footer />}
      </DesignBox>
    </AbsoluteFill>
  );
};
