import React from 'react';
import {BOX, Fmt, PLACE} from '../layout';

// Places the 900 x 980 design box inside the frame of the given format.
export const DesignBox: React.FC<{fmt: Fmt; children: React.ReactNode}> = ({fmt, children}) => {
  const p = PLACE[fmt];
  return (
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
      {children}
    </div>
  );
};
