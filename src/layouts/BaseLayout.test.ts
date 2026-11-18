// BaseLayout's layout props, checked in its rendered markup: `footer={false}` leaves the footer out, and `main={false}`
// leaves its `<main>` to the page. The defaults keep the footer and the wrapper.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { expect, test } from 'vitest';
import BaseLayout from './BaseLayout.astro';

async function render(props: Record<string, unknown> = {}): Promise<Document> {
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  const html = await container.renderToString(BaseLayout, {
    props: { title: 'T', description: 'D', ...props },
    slots: { default: '<p>page</p>' },
  });
  return new JSDOM(html).window.document;
}

test('by default the footer follows the page and the body carries no class', async () => {
  const doc = await render();
  expect(doc.querySelector('footer')).not.toBeNull();
  expect(doc.body.hasAttribute('class')).toBe(false);
});

test('footer={false} leaves the footer out but keeps the header', async () => {
  const doc = await render({ footer: false });
  expect(doc.querySelector('footer')).toBeNull();
  expect(doc.querySelector('.site-head')).not.toBeNull();
});

test('by default the layout wraps the page in one <main id="main">; main={false} leaves its wrapper out and keeps the header (D19 case 50)', async () => {
  const wrapped = await render();
  expect(wrapped.querySelectorAll('main')).toHaveLength(1);
  expect(wrapped.querySelector('main#main p')).not.toBeNull();
  const own = await render({ main: false });
  expect(own.querySelectorAll('main')).toHaveLength(0);
  expect(own.querySelector('#main')).toBeNull();
  expect(own.querySelector('.site-head')).not.toBeNull();
  // The skip link still points at #main: the page marks its own.
  expect(own.querySelector('a.skip-link')!.getAttribute('href')).toBe('#main');
});
