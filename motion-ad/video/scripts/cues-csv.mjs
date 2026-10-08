// Prints the sound map as CSV (frame, seconds, sfx, note) from src/cues.json.
import fs from 'node:fs';

const cues = JSON.parse(fs.readFileSync(new URL('../src/cues.json', import.meta.url), 'utf8'));
console.log('frame,time_s,sfx,note');
for (const c of cues) {
  console.log(`${c.frame},${(c.frame / 30).toFixed(2)},${c.sfx},"${c.note.replace(/"/g, '""')}"`);
}
