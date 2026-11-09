// A figure that leaves its words to the lesson draws an empty `<text>` or `<tspan>` slot for each, marked with the word's
// key (`data-label="layer-1"`). The words come from the unit's `scene.labels`; this writes them into the slots.

const escape = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** An empty slot: its opening tag, with the key it carries, and its closing tag. */
const SLOT = /(<(text|tspan)\b[^>]*\sdata-label="([^"]+)"[^>]*>)(<\/\2>)/g;

/** Writes each word into every empty slot that carries its key, escaped; a slot whose key is not given stays empty. */
export function fillLabels(svg: string, labels: Readonly<Record<string, string>>): string {
  return svg.replace(SLOT, (slot, open: string, _tag: string, key: string, close: string) =>
    Object.hasOwn(labels, key) ? `${open}${escape(labels[key]!)}${close}` : slot,
  );
}
