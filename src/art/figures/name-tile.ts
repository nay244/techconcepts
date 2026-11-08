/**
 * A How the Internet Works lesson card's picture (design 2026-11-08, mockup option A): the protocol's name set large
 * on the blueprint plate, a short rule in our blue under it, and its full name below. The look (type, colours, the dot
 * grid behind it) is the track page's CSS, so the drawing carries no ids and any number of tiles share one page.
 */

const W = 528;
const H = 372;
const MID = W / 2;
/** A full name longer than this takes two lines. */
const ONE_LINE = 30;

const escape = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The full name as one line, or two broken at the space nearest the middle when it is long. */
function fullLines(fullName: string): string[] {
  if (fullName.length <= ONE_LINE) return [fullName];
  const half = fullName.length / 2;
  let best = -1;
  for (let i = fullName.indexOf(' '); i !== -1; i = fullName.indexOf(' ', i + 1)) {
    if (best === -1 || Math.abs(i - half) < Math.abs(best - half)) best = i;
  }
  return best === -1 ? [fullName] : [fullName.slice(0, best), fullName.slice(best + 1)];
}

export function nameTile(name: string, fullName: string): string {
  const size = name.length > 5 ? 74 : 92;
  const lines = fullLines(fullName);
  const ys = lines.length === 1 ? [262] : [254, 282];
  const full = lines.map((line, i) => `<text class="nt-full" x="${MID}" y="${ys[i]}" text-anchor="middle">${escape(line)}</text>`).join('');
  return (
    `<svg class="name-tile" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(fullName)}">` +
    `<text class="nt-name" x="${MID}" y="186" text-anchor="middle" font-size="${size}">${escape(name)}</text>` +
    `<rect class="nt-rule" x="214" y="212" width="100" height="5" rx="2.5"/>` +
    full +
    `</svg>`
  );
}
