// Home's header sits clear over the hero and turns solid once the page has scrolled a little (SiteHeader.astro).

/** How far the page scrolls before the header turns solid, in CSS pixels. */
const SOLID_AFTER = 24;

/** Keeps `head`'s `solid` class in step with the page's scroll, starting now. Returns a function that stops it. */
export function solidOnScroll(head: HTMLElement, win: Window = window): () => void {
  const onScroll = (): void => {
    head.classList.toggle('solid', win.scrollY > SOLID_AFTER);
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => win.removeEventListener('scroll', onScroll);
}
