// Renders public/og-default.png (1200x630), the picture a chat app shows for any page (docs/direction.md §6, D4 variant A):
// the name with the Lifted lid mark, the site's line, and the `inside` figure, on the light theme's ground.
// The card is a page drawn from the site's own parts (the logo's shapes, the figure, lumen.css, the tokens) and
// photographed with Playwright. Regenerate with: node scripts/generate-og-image.mjs
// It imports .ts files directly, so it relies on Node's type stripping (on by default from Node 22.18).
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { tokens } from '../src/styles/tokens.ts';
import { LOGO_SHAPES, LOGO_BOX } from '../src/art/logo.ts';
import { PAGE_FIGURES } from '../src/art/figures/pages.ts';
import { lumenDefs } from '../src/art/defs.ts';

const theme = tokens.light;
const fromRoot = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const woff2 = async (family, weight) =>
  (await readFile(fromRoot(`node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`))).toString('base64');

/** The mark, drawn from the logo's own shapes: lid and tray in the ink, the message in the accent. */
const mark = () =>
  `<svg class="mark" viewBox="0 0 ${LOGO_BOX} ${LOGO_BOX}" fill="none" aria-hidden="true" focusable="false">` +
  LOGO_SHAPES.map((s) => {
    const paint = s.paint === 'ink' ? 'currentColor' : 'var(--logo-accent)';
    return `<path d="${s.d}" fill="${paint}" stroke="${paint}" stroke-width="${s.stroke}" stroke-linejoin="round"/>`;
  }).join('') +
  `</svg>`;

/** The card's page, as HTML. Exported so a test can read what it is made of. */
export async function cardPage() {
  const lumen = await readFile(fromRoot('src/art/lumen.css'), 'utf8');
  return `<!doctype html>
<html data-theme="light">
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Barlow Semi Condensed'; font-weight: 700; font-style: normal; font-display: block; src: url(data:font/woff2;base64,${await woff2('barlow-semi-condensed', 700)}) format('woff2'); }
  @font-face { font-family: 'Atkinson Hyperlegible Mono'; font-weight: 400; font-style: normal; font-display: block; src: url(data:font/woff2;base64,${await woff2('atkinson-hyperlegible-mono', 400)}) format('woff2'); }
  ${lumen}
  :root { --mono: 'Atkinson Hyperlegible Mono', ui-monospace, monospace; --logo-accent: ${theme.accent}; }
  html, body { margin: 0; width: 1200px; height: 630px; }
  .card {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background: ${theme['bg-soft']}; color: ${theme['ink-strong']};
    font-family: 'Barlow Semi Condensed', 'Arial Narrow', sans-serif; text-align: left;
  }
  .art { position: absolute; left: 552px; top: 80px; width: 640px; }
  .brand { position: absolute; left: 72px; top: 60px; display: flex; align-items: center; gap: 0.36em; margin: 0; font-size: 60px; font-weight: 700; letter-spacing: 0.005em; line-height: 1; }
  .brand b { font-weight: inherit; }
  .mark { width: 1.3em; height: 1.3em; flex: none; }
  .line { position: absolute; left: 72px; bottom: 64px; margin: 0; font-size: 108px; font-weight: 700; line-height: 0.9; letter-spacing: -0.01em; }
</style>
${lumenDefs()}
<div class="card" id="card">
  <div class="art">${PAGE_FIGURES.inside()}</div>
  <div class="brand">${mark()}<b>TechConcepts</b></div>
  <p class="line">See how<br>technology<br>really works.</p>
</div>`;
}

/** Opens the card at 1200x630 with the figure's fade-in switched off and the fonts checked as loaded. */
export async function openCard(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.setContent(await cardPage());
  await page.evaluate(() => document.fonts.ready);
  // A font that fails to load falls back without a word, so check each took.
  const status = await page.evaluate(() => [...document.fonts].map((face) => `${face.family} ${face.weight} ${face.status}`));
  const bad = status.filter((s) => !s.endsWith(' loaded'));
  if (status.length === 0 || bad.length) throw new Error(`Fonts did not load (${(bad.length ? bad : ['no face']).join(', ')}).`);
  return page;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const browser = await chromium.launch();
  try {
    const page = await openCard(browser);
    const png = await page.locator('#card').screenshot({ type: 'png' });
    await writeFile(fromRoot('public/og-default.png'), png);
  } finally {
    await browser.close();
  }
}
