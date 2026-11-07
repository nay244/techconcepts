/**
 * Comparing a drawn figure with the mockup it was ported from. A figure test
 * hashes the site's drawing after one of these normalisations and compares it
 * with the hash of the mockup's drawing after the same one, recorded once by a
 * one-off script. Tests never read the mockups.
 */

/** The figure without film grain (ruling R2): the `#lm-grain` filter, the attributes that point at it, and the grain group. */
export function withoutGrain(svg: string): string {
  return svg
    .replace(/<filter id="lm-grain"[\s\S]*?<\/filter>/g, '')
    .replace(/ filter="url\(#lm-grain\)"/g, '')
    .replace(/<g class="lm-grain">/g, '<g>');
}

/**
 * A scene figure reduced to its drawing: no grain, no `id` or `data-figure` on
 * the root `<svg>` (they name the figure on its page), and the figure's own ids
 * renamed `id-0`, `id-1`, … in the order they are defined, with every
 * `url(#…)` and `href="#…"` that points at them. So the site may prefix a
 * figure's ids to keep them unique on the page and still match its mockup.
 * Ids the figure only points at, such as the shared `lm-` gradients, keep their names.
 */
export function normaliseFigure(svg: string): string {
  const drawing = withoutGrain(svg).replace(
    /^<svg\b([^>]*)>/,
    (_, attrs: string) => `<svg${attrs.replace(/ (?:id|data-figure)="[^"]*"/g, '')}>`,
  );
  const names = new Map<string, string>();
  for (const [, id] of drawing.matchAll(/ id="([^"]+)"/g)) if (!names.has(id!)) names.set(id!, `id-${names.size}`);
  const rename = (id: string): string => names.get(id) ?? id;
  return drawing
    .replace(/ id="([^"]+)"/g, (_, id: string) => ` id="${rename(id)}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${rename(id)})`)
    .replace(/href="#([^"]+)"/g, (_, id: string) => `href="#${rename(id)}"`);
}

/** The SHA-256 of `text`, in hex. */
export async function sha256(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}
