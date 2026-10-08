import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN, prog} from '../anim';

export type Word = {t: string; at: number; color?: string};

// Mask reveal: each word rises from its baseline inside an overflow-hidden box.
// Exit is the same move downwards, one frame apart per word.
export const Words: React.FC<{
  words: Word[];
  style: React.CSSProperties;
  dur?: number;
  exitAt?: number;
  exitDur?: number;
}> = ({words, style, dur = 12, exitAt, exitDur = 6}) => {
  const f = useCurrentFrame();
  return (
    <div style={style}>
      {words.map((w, i) => {
        const inT = prog(f, w.at, dur);
        const outT = exitAt === undefined ? 0 : prog(f, exitAt + i, exitDur, EASE_IN);
        const y = (1 - inT) * 108 + outT * 108;
        return (
          <React.Fragment key={i}>
            {i > 0 ? ' ' : null}
            <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top'}}>
              <span style={{display: 'inline-block', transform: `translateY(${y}%)`, color: w.color}}>
                {w.t}
              </span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Helper: split "A B C" into words starting at `at`, `stagger` frames apart.
export const seq = (text: string, at: number, stagger = 3, color?: string): Word[] =>
  text.split(' ').map((t, i) => ({t, at: at + i * stagger, color}));
