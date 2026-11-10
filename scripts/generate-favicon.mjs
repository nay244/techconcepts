// Writes public/favicon.svg: the TechConcepts mark on its dark tile, from the one drawing in src/art/logo.ts.
// Run it after any change to the logo: node scripts/generate-favicon.mjs
// A test (src/art/logo.test.ts) fails when the file and the drawing differ.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { logoTile } from '../src/art/logo.ts';

await writeFile(fileURLToPath(new URL('../public/favicon.svg', import.meta.url)), `${logoTile()}\n`);
console.log('Wrote public/favicon.svg');
