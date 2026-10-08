import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {DURATION, FPS} from './timeline';
import './theme';
import {CarouselCard, DECKS} from './carousel/Cards';
import {REEL_DURATION, ReelA} from './reel/ReelA';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Ad916"
      component={Ad}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{fmt: '916' as const}}
    />
    <Composition
      id="Ad45"
      component={Ad}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1350}
      defaultProps={{fmt: '45' as const}}
    />
    <Composition id="ReelA" component={ReelA} durationInFrames={REEL_DURATION} fps={FPS} width={1080} height={1920} />
    {(['A', 'B'] as const).flatMap((deck) =>
      DECKS[deck].map((_, i) => (
        <Composition
          key={`${deck}${i + 1}`}
          id={`Card${deck}${String(i + 1).padStart(2, '0')}`}
          component={CarouselCard}
          durationInFrames={1}
          fps={FPS}
          width={1080}
          height={1080}
          defaultProps={{deck, index: i + 1}}
        />
      )),
    )}
  </>
);
