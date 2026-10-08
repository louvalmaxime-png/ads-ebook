import React from 'react';
import {Composition} from 'remotion';
import {Ad} from './Ad';
import {DURATION, FPS} from './timeline';
import './theme';

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
  </>
);
