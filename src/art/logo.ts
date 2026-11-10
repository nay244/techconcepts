// The TechConcepts mark, "Lifted lid": a lid lifted clear of its tray, with one message between them. The site
// opens things up so you can see inside. It is the one drawing of the logo: the header, the lesson's top bar, the
// footer and the favicon all take it from here (docs/direction.md §8).

/** The drawing's box: a 48-unit square. */
export const LOGO_BOX = 48;

// Three shapes on a 2:1 isometric grid. The lid and the tray share one width, so they read as two halves of one case.
const LID = 'M24 3.5 43.5 13.25 24 23 4.5 13.25Z';
const MESSAGE = 'M24 25.65 29.5 28.4 24 31.15 18.5 28.4Z';
const TRAY = 'M5.5 29.6 24 38.85 42.5 29.6V35.4L24 44.65 5.5 35.4Z';

/** The ink and accent a tile carries with it, whatever page or browser tab it sits on. */
export const TILE = { ground: '#12171b', ink: '#f3f5f6', accent: '#f0702e' } as const;

const shapes = (ink: string, accent: string): string =>
  // The strokes round the corners; each matches its fill.
  `<path d="${LID}" fill="${ink}" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>` +
  `<path d="${MESSAGE}" fill="${accent}" stroke="${accent}" stroke-width="1.2" stroke-linejoin="round"/>` +
  `<path d="${TRAY}" fill="${ink}" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>`;

export interface LogoOptions {
  /** Words for a screen reader when the mark stands alone. Beside the site's name it needs none and is hidden. */
  label?: string;
  /** One colour throughout, for places that print a single ink. */
  mono?: boolean;
}

/**
 * The mark as inline SVG. Its ink is the text colour around it; the message is `--logo-accent`, which the page sets
 * for each theme, with the light theme's orange as the fallback.
 */
export function logoMark({ label, mono = false }: LogoOptions = {}): string {
  const a11y = label === undefined ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${label}"`;
  return `<svg class="logo" viewBox="0 0 ${LOGO_BOX} ${LOGO_BOX}" fill="none" ${a11y}>${shapes('currentColor', mono ? 'currentColor' : 'var(--logo-accent, #c8501a)')}</svg>`;
}

/**
 * The mark on its own dark tile, as a whole SVG file: the favicon and the app icon. Its colours are fixed, because
 * a browser tab can be light or dark and the file cannot ask.
 */
export function logoTile(): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOGO_BOX} ${LOGO_BOX}">` +
    `<rect width="${LOGO_BOX}" height="${LOGO_BOX}" rx="10.5" fill="${TILE.ground}"/>` +
    // The mark at three quarters of the tile, centred.
    `<g transform="translate(6 6) scale(.75)">${shapes(TILE.ink, TILE.accent)}</g></svg>`
  );
}
