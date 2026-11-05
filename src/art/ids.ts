// Several copies of one figure can share a page, so each copy's own ids get a tag.
// The lm- gradients live in the shared defs (LumenDefs.astro) and stay as they are.

/** Drop `data-part`, suffix every `id="x"` with `-<tag>`, and point `url(#x)` and `href="#x"` at it. */
export function scopeIds(svg: string, tag: string): string {
  return svg
    .replace(/ data-part="[^"]*"/g, '')
    .replace(/ id="([^"]+)"/g, (whole, id: string) => (id.startsWith('lm-') ? whole : ` id="${id}-${tag}"`))
    .replace(/url\(#([^)]+)\)/g, (whole, id: string) => (id.startsWith('lm-') ? whole : `url(#${id}-${tag})`))
    .replace(/href="#([^"]+)"/g, (whole, id: string) => (id.startsWith('lm-') ? whole : `href="#${id}-${tag}"`));
}

/** Crop a 600 x 420 figure close to its plate. */
export function cropViewBox(svg: string, box: string): string {
  return svg.replace('viewBox="0 0 600 420"', `viewBox="${box}"`);
}
