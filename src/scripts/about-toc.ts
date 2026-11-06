// About's "On this page" list marks the section being read (about-v1). The server renders the list as plain links to
// the sections, so without JavaScript they still work and nothing is marked; this only adds and moves the mark.

/**
 * How far down the window a section's top must come to be the one being read, in CSS pixels: just under the sticky
 * header (68px), a little below where a link to the section lands it (its scroll-margin-top, 92px).
 */
const READING_LINE = 140;

/** How close the window's foot must be to the page's foot to count as the bottom of the page, in CSS pixels. */
const BOTTOM_SLACK = 4;

/**
 * Marks with `aria-current="location"` the link to the section being read, and takes the mark off every other link,
 * so exactly one has it. The section being read is the last whose top has come up to the line under the header, or
 * the first when none has. At the bottom of the page it is the last section, which may be too short ever to reach
 * the line; on a page that fits the window, that is at once.
 *
 * Returns the index in `sections` of the section now marked, or -1 when there are none. `marked` is the index it
 * returned last time: while the same section is being read, nothing is written. Without it, the marks are written.
 */
export function markSectionInView(links: readonly HTMLAnchorElement[], sections: readonly HTMLElement[], marked = -1): number {
  const first = sections[0];
  if (first === undefined) return -1;
  const doc = first.ownerDocument;
  const win = doc.defaultView!;

  let current = 0;
  sections.forEach((section, i) => {
    if (section.getBoundingClientRect().top <= READING_LINE) current = i;
  });
  if (win.innerHeight + win.scrollY >= doc.documentElement.scrollHeight - BOTTOM_SLACK) current = sections.length - 1;
  if (current === marked) return current;

  const hash = `#${sections[current]!.id}`;
  for (const a of links) {
    if (a.hash === hash) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  }
  return current;
}

/**
 * Keeps the mark in `nav`'s list on the section being read, starting now and on every scroll, and writes it only when
 * it moves. Throws by name when a link points at no section on the page. Returns a function that stops it: it removes
 * the listener and takes the mark off, leaving the list as the server rendered it.
 */
export function followSections(nav: HTMLElement): () => void {
  const doc = nav.ownerDocument;
  const win = doc.defaultView!;
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const sections = links.map((a) => {
    const section = doc.getElementById(a.hash.slice(1));
    if (section === null) throw new Error(`"On this page" links to ${a.hash}, which is not on the page.`);
    return section;
  });

  let marked = -1;
  const onScroll = (): void => {
    marked = markSectionInView(links, sections, marked);
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => {
    win.removeEventListener('scroll', onScroll);
    for (const a of links) a.removeAttribute('aria-current');
  };
}
