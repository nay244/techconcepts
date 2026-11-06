// Renders public/og-default.png (1200x630): the TechConcepts wordmark and a short rule on the dark
// background token, in Atkinson Hyperlegible Next 600. Regenerate with: node scripts/generate-og-image.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { tokens } from '../src/styles/tokens.ts';

const font = await readFile(
  fileURLToPath(
    new URL('../node_modules/@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-600-normal.woff2', import.meta.url),
  ),
);
const dark = tokens.dark;

const html = `<!doctype html>
<style>
  @font-face {
    font-family: 'Atkinson Hyperlegible Next';
    font-weight: 600;
    src: url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');
  }
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    background: ${dark.bg};
    color: ${dark['ink-strong']};
    font-family: 'Atkinson Hyperlegible Next', sans-serif;
  }
  .wordmark { font-size: 148px; font-weight: 600; letter-spacing: -0.02em; line-height: 1; }
  .rule { width: 96px; height: 4px; background: ${dark['line-strong']}; }
</style>
<div class="wordmark">TechConcepts</div>
<div class="rule"></div>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  // A font that fails to load falls back to sans-serif without a word, so check it took.
  const status = await page.evaluate(() => [...document.fonts].map((face) => face.status));
  if (status.join() !== 'loaded') throw new Error(`Atkinson Hyperlegible Next 600 did not load (${status.join() || 'no face'}).`);
  const png = await page.screenshot({ type: 'png' });
  await writeFile(fileURLToPath(new URL('../public/og-default.png', import.meta.url)), png);
} finally {
  await browser.close();
}
