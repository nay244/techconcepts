/**
 * Where the lesson's shortcuts (Space, ← and →) must not fire: form controls,
 * buttons and links, ARIA widgets that use those keys themselves, and a
 * disclosure's summary. On all of them Space or an arrow key already does
 * something, and taking it over would break that.
 */
const OWNS_ITS_KEYS = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="slider"]',
  '[role="radio"]',
  'details > summary',
].join(', ');

/** True when a key pressed on `target` belongs to the target, not to the lesson. */
export function shouldIgnoreShortcut(target: EventTarget | null): boolean {
  // `closest` also covers what sits inside one of these, such as a button's icon.
  return target instanceof Element && target.closest(OWNS_ITS_KEYS) !== null;
}
