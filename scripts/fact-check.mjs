// Prints a lesson's claim sheet for the fact-checker, or checks the report it wrote (docs/content-model.md §8):
//   npm run fact-check -- <slug>           the claim sheet, then where to write the report
//   npm run fact-check -- <slug> --check   "Report OK: <path>", or every issue with the report, one per line
//   npm run fact-check -- <slug> --quotes <folder>   looks for every quoted passage in the folder's source files;
//                                          "Quotes OK: ...", with the record written into the report, or every problem
//   npm run fact-check -- <slug> --stamp   writes the items record into a full report that predates it (only when its
//                                          hash is the lesson's hash now), and changes nothing else
//   npm run fact-check -- <slug> --recheck            the targeted re-check's sheet, or why there can be none
//   npm run fact-check -- <slug> --recheck --quotes <folder>   the quote check on the re-check report
//   npm run fact-check -- <slug> --recheck --check    the gate's rules on the full report and its re-check
// The work is in src/content/factcheck/cli.ts. Lessons are TypeScript that Node cannot load on its own, so this script
// starts Vite with no config file and no server, loads that module through it, prints its output, and exits with its
// code (0 when all is well, 1 otherwise).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vite = await createServer({
  configFile: false,
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
// The folder's source files and the report are read and written here; src/content/factcheck/cli.ts does the rest.
const readFolder = (folder) =>
  existsSync(folder) && statSync(folder).isDirectory()
    ? readdirSync(folder)
        .filter((name) => /\.(txt|html|xml)$/.test(name) && statSync(join(folder, name)).isFile())
        .map((name) => ({ name, text: readFileSync(join(folder, name), 'utf8') }))
    : undefined;
const writeFile = (path, text) => writeFileSync(resolve(root, path), text);
let code = 1;
try {
  const { runFactCheck, DEFAULT_DEPS } = await vite.ssrLoadModule('/src/content/factcheck/cli.ts');
  const result = await runFactCheck(process.argv.slice(2), { ...DEFAULT_DEPS, readFolder, writeFile });
  console.log(result.out);
  code = result.code;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  await vite.close();
}
process.exit(code);
