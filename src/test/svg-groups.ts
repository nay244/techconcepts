/**
 * The whole `<g>` groups of `svg` that open with `open`, in document order, found by a balanced scan; and the svg
 * without them. Test-only: D11 added parts (the phone, the stranger's and Ports' server) that the older prototypes
 * and hashes never drew, so those tests take them out whole first.
 */
export function groupsOf(svg: string, open: string): { groups: string[]; rest: string } {
  const groups: string[] = [];
  let rest = svg;
  for (let at = rest.indexOf(open); at !== -1; at = rest.indexOf(open)) {
    let depth = 0;
    let i = at;
    do {
      i += rest.slice(i).search(/<g[\s>]|<\/g>/);
      depth += rest.startsWith('</g>', i) ? -1 : 1;
      i += rest.startsWith('</g>', i) ? 4 : 2;
    } while (depth > 0);
    groups.push(rest.slice(at, i));
    rest = rest.slice(0, at) + rest.slice(i);
  }
  return { groups, rest };
}

export const PHONE_OPEN = '<g data-base="phone" data-hidden="">';
export const STRANGER_OPEN = '<g data-layer="nat:stranger" display="none">';
export const SERVER_OPEN = '<g data-layer="ports:server" display="none">';

/** The map without D11's parts: what the mockup's hash and Router's prototype describe. */
export const withoutD11 = (svg: string): string => [PHONE_OPEN, STRANGER_OPEN, SERVER_OPEN].reduce((out, open) => groupsOf(out, open).rest, svg);
