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

const SCROLLS = new Set(['auto', 'scroll']);

/**
 * True when `target` sits in a focusable scroll region (the nearest element
 * with a tabindex, such as the event log or the explanation) that can scroll in
 * the direction of `key`: sideways for ← and →, downwards for Space. There the
 * key scrolls the region, as it would on any page. A region with nothing to
 * scroll that way leaves the key to the lesson, so a click into a panel does
 * not switch the shortcuts off.
 */
export function scrollRegionOwnsKey(target: EventTarget | null, key: string): boolean {
  if (!(target instanceof Element)) return false;
  const region = target.closest('[tabindex]');
  if (region === null) return false;
  const style = getComputedStyle(region);
  if (key === 'ArrowLeft' || key === 'ArrowRight') return SCROLLS.has(style.overflowX) && region.scrollWidth > region.clientWidth;
  if (key === ' ') return SCROLLS.has(style.overflowY) && region.scrollHeight > region.clientHeight;
  return false;
}

/**
 * True when a key pressed on `target` belongs to the target, not to the lesson:
 * always on the elements above, and, given the key, in a scroll region that the
 * key would scroll.
 */
export function shouldIgnoreShortcut(target: EventTarget | null, key?: string): boolean {
  if (!(target instanceof Element)) return false;
  // `closest` also covers what sits inside one of these, such as a button's icon.
  if (target.closest(OWNS_ITS_KEYS) !== null) return true;
  return key !== undefined && scrollRegionOwnsKey(target, key);
}
