import React from 'react';
import {C, body} from '../theme';

export const Bubble: React.FC<{
  text: string;
  tail: 'left' | 'right';
  style: React.CSSProperties;
}> = ({text, tail, style}) => (
  <div style={{position: 'absolute', ...style}}>
    <div
      style={{
        position: 'relative',
        background: C.surface,
        borderRadius: 38,
        padding: '27px 38px 27px',
        ...body(40),
      }}
    >
      <svg
        width={46}
        height={36}
        viewBox="0 0 46 36"
        style={{
          position: 'absolute',
          bottom: -7,
          [tail]: -10,
          transform: tail === 'right' ? 'scaleX(-1)' : undefined,
        }}
      >
        <path d="M24 0 C25 15 18 26 0 33 C17 35 33 30 46 18 L46 0 Z" fill={C.surface} />
      </svg>
      <span style={{position: 'relative'}}>{text}</span>
    </div>
  </div>
);
