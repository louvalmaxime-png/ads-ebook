// Renders every Card<deck><nn> composition to ../../carousel/<deck>/<nn>.png
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';

const outRoot = path.resolve(process.argv[2] ?? '../../carousel');
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl, {browserExecutable})).filter((c) => /^Card[AB]\d\d$/.test(c.id));
for (const composition of comps) {
  const deck = composition.id[4];
  const nn = composition.id.slice(5);
  fs.mkdirSync(path.join(outRoot, deck), {recursive: true});
  const output = path.join(outRoot, deck, `${nn}.png`);
  await renderStill({composition, serveUrl, output, frame: 0, browserExecutable, imageFormat: 'png'});
  console.log(output);
}
