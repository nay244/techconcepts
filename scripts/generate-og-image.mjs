// Renders public/og-default.png (1200x630): the TechConcepts wordmark on the dark
// background token, in IBM Plex Sans. Regenerate with: node scripts/generate-og-image.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { tokens } from '../src/styles/tokens.ts';

const font = await readFile(
  fileURLToPath(new URL('../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2', import.meta.url)),
);
const dark = tokens.dark;

const html = `<!doctype html>
<style>
  @font-face {
    font-family: 'IBM Plex Sans';
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
    font-family: 'IBM Plex Sans', sans-serif;
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
  const png = await page.screenshot({ type: 'png' });
  await writeFile(fileURLToPath(new URL('../public/og-default.png', import.meta.url)), png);
} finally {
  await browser.close();
}
