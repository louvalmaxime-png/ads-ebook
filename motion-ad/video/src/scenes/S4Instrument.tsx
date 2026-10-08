import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, body, head} from '../theme';
import {pop, prog} from '../anim';
import {DIAG, ORBIT} from '../layout';
import {Words, seq} from '../ui/Words';
import {MARKER_LAND} from './RulerOrbit';

const EXIT = 405;
const CALLOUTS = [
  {dx: -1, dy: -1, lines: ['A 1–10 scale', 'for static holds'], at: 330, dotAt: MARKER_LAND - 2},
  {dx: 1, dy: -1, lines: ['Know exactly', 'when to progress'], at: 345},
  {dx: -1, dy: 1, lines: ['Planche and', 'front lever only'], at: 360},
  {dx: 1, dy: 1, lines: ['Private Discord', 'access included'], at: 375},
];
const GAP = 22;
const LINE = 41; // 34px * 1.2

// 300-420 INSTRUMENT: headline + callouts (orbit and book are separate layers).
export const S4Instrument: React.FC = () => {
  const f = useCurrentFrame();
  const out = prog(f, EXIT, 6);
  return (
    <>
      <Words
        words={seq('AN INSTRUMENT', 303, 3, C.red)}
        exitAt={EXIT}
        style={{position: 'absolute', left: 0, top: 0, width: 900, textAlign: 'center', ...head(150)}}
      />
      <Words
        words={seq('NOT A GUESS', 309)}
        exitAt={EXIT + 2}
        style={{position: 'absolute', left: 0, top: 135, width: 900, textAlign: 'center', ...head(150)}}
      />
      {CALLOUTS.map((c, i) => {
        const x = ORBIT.cx + c.dx * DIAG;
        const y = ORBIT.cy + c.dy * DIAG;
        const dotAt = c.dotAt ?? c.at;
        const dotScale = f < dotAt ? 0 : pop(f, dotAt) * (1 - out);
        const textPos: React.CSSProperties =
          c.dx < 0
            ? {right: 900 - (x - GAP), textAlign: 'right'}
            : {left: x + GAP, textAlign: 'left'};
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: x - 9,
                top: y - 9,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: C.red,
                transform: `scale(${dotScale})`,
              }}
            />
            <div style={{position: 'absolute', top: y - LINE, ...textPos}}>
              {c.lines.map((l, j) => (
                <Words
                  key={l}
                  words={seq(l, c.at + j * 6, 2)}
                  exitAt={EXIT}
                  style={body(34)}
                />
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
