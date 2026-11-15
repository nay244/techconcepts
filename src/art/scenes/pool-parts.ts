// What the Load Balancers figure (src/art/scenes/pool.ts) draws, as data only, so the lesson validator (parts.ts) and the
// driver (src/scenes/drivers/pool.ts) can read it without drawing it.

/** The servers in the pool, in the order the balancer takes them. */
export const POOL_SERVERS = ['a', 'b', 'c'] as const;
/** The readers, front left to front right: your laptop, then two others. */
export const POOL_READERS = ['laptop', 'reader2', 'reader3'] as const;
export const POOL_PLACES = [...POOL_READERS, 'balancer', ...POOL_SERVERS];
/** How many chips a server's top holds: a request count above it shows this many. */
export const POOL_CHIPS = 4;

/**
 * The only ways a message rides: a reader's request through the balancer to a server, a health check from the balancer
 * to a server, and a server's answer back to the balancer.
 */
export const POOL_ROUTES = [
  ...POOL_READERS.flatMap((r) => POOL_SERVERS.map((s) => `${r}>${s}`)),
  ...POOL_SERVERS.flatMap((s) => [`balancer>${s}`, `${s}>balancer`]),
];

/** The panel table the figure reads, its key column (A, B or C) and the columns it shows. */
export const POOL_TABLE = 'pool';
export const POOL_KEY = 'server';
export const POOL_HEALTH = 'health';
export const POOL_REQUESTS = 'requests';

/**
 * Each word the Health column may hold, and what the figure shows for it: the server's two lamps (its last two checks,
 * the older first), and its health line: the balancer's verdict (`state`), and whether the last check has gone the
 * other way without changing it yet (`turning`). Any other word leaves the lamps dark and the line empty.
 */
export const POOL_HEALTH_WORDS: Readonly<Record<string, { lamps: readonly ['ok' | 'miss', 'ok' | 'miss']; state: 'healthy' | 'unhealthy'; turning: boolean }>> = {
  Healthy: { lamps: ['ok', 'ok'], state: 'healthy', turning: false },
  '1 check missed': { lamps: ['ok', 'miss'], state: 'healthy', turning: true },
  Unhealthy: { lamps: ['miss', 'miss'], state: 'unhealthy', turning: false },
  '1 check passed': { lamps: ['miss', 'ok'], state: 'unhealthy', turning: true },
};
