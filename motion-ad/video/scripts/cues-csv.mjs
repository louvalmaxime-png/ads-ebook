// Prints a sound map as CSV (frame, seconds, sfx, note). Default: src/cues.json.
import fs from 'node:fs';

const file = process.argv[2] ?? new URL('../src/cues.json', import.meta.url);
const cues = JSON.parse(fs.readFileSync(file, 'utf8'));
console.log('frame,time_s,sfx,note');
for (const c of cues) {
  console.log(`${c.frame},${(c.frame / 30).toFixed(2)},${c.sfx},"${c.note.replace(/"/g, '""')}"`);
}
