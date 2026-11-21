// @ts-expect-error - no @types/node in this project; the build runs under node
import { execSync } from 'node:child_process';

/** One string for a whole build: the commit it was made from, else the build's time when git is not there. */
export const buildStamp: string = (() => {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return new Date().toISOString();
  }
})();
