import React from 'react';
import {Html5Audio, Sequence, getStaticFiles, interpolate, staticFile} from 'remotion';
import {CLAMP} from './anim';

export type Cue = {frame: number; sfx: string; note: string};

// Plays public/audio/music.mp3 and public/audio/sfx/<name>.mp3 when present.
// Without them the render is silent and the cue sheet carries the sound map.
export const Sound: React.FC<{cues: Cue[]; silence: [number, number]; fadeOut: [number, number]}> = ({
  cues,
  silence,
  fadeOut,
}) => {
  const files = new Set(getStaticFiles().map((f) => f.name));
  const impacts = cues.filter((c) => c.sfx === 'impact').map((c) => c.frame);
  const musicVolume = (f: number) => {
    let v = 1;
    for (const hit of impacts) {
      v *= 1 - 0.5 * interpolate(f, [hit - 2, hit, hit + 8, hit + 14], [0, 1, 1, 0], CLAMP); // -6 dB duck
    }
    v *= 1 - interpolate(f, [silence[0], silence[0] + 3, silence[1] - 2, silence[1]], [0, 1, 1, 0], CLAMP);
    v *= interpolate(f, fadeOut, [1, 0], CLAMP);
    return v;
  };
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
