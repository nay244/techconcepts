// The shared gradient defs every figure points at (from track-v2.html). No grain filter.
// Printed once per page by LumenDefs.astro, right after <body>.
const DEFS = "<svg class=\"lm-defs\" width=\"0\" height=\"0\" aria-hidden=\"true\" focusable=\"false\"><defs>\n  <linearGradient id=\"lm-top\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" class=\"la\"/><stop offset=\"1\" class=\"lb\"/></linearGradient>\n  <linearGradient id=\"lm-s0\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" class=\"la d3\"/><stop offset=\"1\" class=\"lb d3\"/></linearGradient>\n  <linearGradient id=\"lm-s1\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" class=\"la d2\"/><stop offset=\"1\" class=\"lb d2\"/></linearGradient>\n  <linearGradient id=\"lm-s2\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" class=\"la d1\"/><stop offset=\"1\" class=\"lb d1\"/></linearGradient>\n  <linearGradient id=\"lm-s3\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" class=\"la\"/><stop offset=\"1\" class=\"lb d1\"/></linearGradient>\n  <radialGradient id=\"lm-pool-g\"><stop offset=\"0\" class=\"lp\" stop-opacity=\".36\"/><stop offset=\".55\" class=\"lp\" stop-opacity=\".1\"/><stop offset=\"1\" class=\"lp\" stop-opacity=\"0\"/></radialGradient>\n</defs></svg>";

export function lumenDefs(): string {
  return DEFS;
}
