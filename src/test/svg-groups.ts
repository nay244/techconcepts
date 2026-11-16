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

/** D15's two layers, `proxies:site` and `proxies:proxy`: five groups each, taken out whole. */
export const PROXIES_OPENS = ['<g data-layer="proxies:site" display="none">', '<g data-layer="proxies:proxy" display="none">'];

/** D12's voice plate: the five groups of the layer `tcp-udp:voice`. */
export const VOICE_OPEN = '<g data-layer="tcp-udp:voice" display="none">';
/** D12's frames setup on the DHCP plate: the TV and the callouts, and the two tags that only MAC Address's frames carry. */
export const FRAMES_OPEN = '<g data-setup="frames" display="none">';
export const FRAME_TAG_OPEN = '<g class="dh-tag" id="dh-tag-frame" style="opacity:0">';
export const TO_ALL_TAG_OPEN = '<g class="dh-tag" id="dh-tag-to-all" style="opacity:0">';
export const ADDRESSES_OPEN = '<g data-setup="addresses">';

/** `groups` as they stand in `svg`, in document order (the order the scans found them in is the order of their opens). */
export function inDocumentOrder(svg: string, groups: string[]): string[] {
  return [...groups].sort((a, b) => svg.indexOf(a) - svg.indexOf(b));
}

/** `svg` with each group that opens with `open` replaced by what is inside it. */
export function unwrapGroups(svg: string, open: string): string {
  let out = svg;
  for (let at = out.indexOf(open); at !== -1; at = out.indexOf(open)) {
    let depth = 0;
    let i = at;
    do {
      i += out.slice(i).search(/<g[\s>]|<\/g>/);
      depth += out.startsWith('</g>', i) ? -1 : 1;
      i += out.startsWith('</g>', i) ? 4 : 2;
    } while (depth > 0);
    out = out.slice(0, at) + out.slice(at + open.length, i - 4) + out.slice(i);
  }
  return out;
}

/** The DHCP plate without D12's frames parts: what DHCP's mockup hash describes. */
export const withoutFrames = (svg: string): string =>
  unwrapGroups([FRAMES_OPEN, FRAME_TAG_OPEN, TO_ALL_TAG_OPEN].reduce((out, open) => groupsOf(out, open).rest, svg), ADDRESSES_OPEN);
