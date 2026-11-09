// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

/*
 * The site's source names its files by their place in the repository. The brainstorm workspace is git-ignored and
 * lives only on one machine, so a path into it says nothing to anyone else; a mockup is named by its file instead.
 * The folder's name is built here, so this file does not match itself.
 */
const IGNORED_WORKSPACE = ['.super', 'powers/'].join('');

/** Every file under src/, as a path from the project root. */
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry: { name: string; isDirectory(): boolean }) =>
    entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`],
  );
}

test('no source file points into the git-ignored brainstorm workspace', () => {
  const pointing = files('src').filter((path) => readFileSync(path, 'utf8').includes(IGNORED_WORKSPACE));
  expect(pointing).toEqual([]);
});
