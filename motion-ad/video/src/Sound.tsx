import React from 'react';
import {Html5Audio, Sequence, getStaticFiles, interpolate, staticFile} from 'remotion';
import {CLAMP} from './anim';
import cues from './cues.json';

// Plays public/audio/music.mp3 and public/audio/sfx/<name>.mp3 when present.
// Without them the render is silent and cues.csv carries the sound map.
const IMPACTS = cues.filter((c) => c.sfx === 'impact').map((c) => c.frame);

const musicVolume = (f: number) => {
  let v = 1;
  for (const hit of IMPACTS) {
    v *= 1 - 0.5 * interpolate(f, [hit - 2, hit, hit + 8, hit + 14], [0, 1, 1, 0], CLAMP); // -6 dB duck
  }
  v *= 1 - interpolate(f, [462, 465, 478, 480], [0, 1, 1, 0], CLAMP); // silence before the price
  v *= interpolate(f, [570, 600], [1, 0], CLAMP);
  return v;
};

export const Sound: React.FC = () => {
  const files = new Set(getStaticFiles().map((f) => f.name));
  return (
    <>
      {files.has('audio/music.mp3') && <Html5Audio src={staticFile('audio/music.mp3')} volume={musicVolume} />}
      {cues
        .filter((c) => c.sfx !== 'music' && files.has(`audio/sfx/${c.sfx}.mp3`))
        .map((c) => (
          <Sequence key={`${c.frame}-${c.sfx}`} from={c.frame} durationInFrames={45} layout="none">
            <Html5Audio src={staticFile(`audio/sfx/${c.sfx}.mp3`)} />
          </Sequence>
        ))}
    </>
  );
};
