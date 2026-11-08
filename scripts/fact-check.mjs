// Prints a lesson's claim sheet for the fact-checker, or checks the report it wrote (docs/content-model.md §8):
//   npm run fact-check -- <slug>           the claim sheet, then where to write the report
//   npm run fact-check -- <slug> --check   "Report OK: <path>", or every issue with the report, one per line
// The work is in src/content/factcheck/cli.ts. Lessons are TypeScript that Node cannot load on its own, so this script
// starts Vite with no config file and no server, loads that module through it, prints its output, and exits with its
// code (0 when all is well, 1 otherwise).
import { dirname, resolve } from 'node:path';
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
let code = 1;
try {
  const { runFactCheck } = await vite.ssrLoadModule('/src/content/factcheck/cli.ts');
  const result = await runFactCheck(process.argv.slice(2));
  console.log(result.out);
  code = result.code;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  await vite.close();
}
process.exit(code);
