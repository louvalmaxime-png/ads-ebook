// Render QC stills: node scripts/stills.mjs <outDir> <f1,f2,...> [Ad916,Ad45]
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [, , outDir, framesArg, compsArg] = process.argv;
const frames = framesArg.split(',').map(Number);
const comps = (compsArg ?? 'Ad916,Ad45').split(',');
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const id of comps) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  for (const frame of frames) {
    const output = path.join(outDir, `${id}_${String(frame).padStart(3, '0')}.png`);
    await renderStill({composition, serveUrl, output, frame, browserExecutable, imageFormat: 'png'});
    console.log(output);
  }
}
