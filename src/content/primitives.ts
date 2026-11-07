import { z } from 'zod';

/**
 * Value primitives shared by `schema.ts` and `sources.ts`. They live here so the two files do not import each
 * other's values: `schema.ts` takes `citationSchema` from `sources.ts`, and `sources.ts` only needs these.
 */

/** Prose or a label: must contain something other than whitespace. */
export const text = z.string().regex(/\S/, 'must not be empty');

/** Lowercase words joined by hyphens: safe in a URL and a file name. */
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase words joined by hyphens');
