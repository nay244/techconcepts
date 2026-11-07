import { expect, test } from 'vitest';
import { cropViewBox, scopeIds } from './ids';

test('scopeIds gives every id and reference the tag, and keeps lm- gradients shared', () => {
  const out = scopeIds('<g id="a" data-part="x"><use href="#a"/><path fill="url(#a)"/><path fill="url(#lm-top)"/></g>', 't');
  expect(out).toBe('<g id="a-t"><use href="#a-t"/><path fill="url(#a-t)"/><path fill="url(#lm-top)"/></g>');
});

test('scopeIds leaves lm- ids untouched even when declared', () => {
  expect(scopeIds('<linearGradient id="lm-s1"/><use href="#lm-s1"/>', 't')).toBe('<linearGradient id="lm-s1"/><use href="#lm-s1"/>');
});

test('cropViewBox swaps the full-canvas view box', () => {
  expect(cropViewBox('<svg viewBox="0 0 600 420"><g/></svg>', '100 50 400 300')).toBe('<svg viewBox="100 50 400 300"><g/></svg>');
  expect(cropViewBox('<svg viewBox="0 0 10 10"/>', '1 1 2 2')).toBe('<svg viewBox="0 0 10 10"/>');
});
