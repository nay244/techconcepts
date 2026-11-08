// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { nameTile } from './name-tile';

const parse = (svg: string): SVGSVGElement => new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement as unknown as SVGSVGElement;
const lines = (svg: SVGSVGElement): string[] => [...svg.querySelectorAll('text.nt-full')].map((t) => t.textContent ?? '');

test('draws the name, a rule in our blue and the full name, labelled for screen readers by the full name', () => {
  const s = nameTile('HTTP', 'HyperText Transfer Protocol');
  expect(s).toMatch(/^<svg class="name-tile" viewBox="0 0 528 372" role="img" aria-label="HyperText Transfer Protocol"/);
  expect(s).not.toMatch(/\sid="/);
  const svg = parse(s);
  const name = svg.querySelector('text.nt-name')!;
  expect(name.textContent).toBe('HTTP');
  expect(name.getAttribute('font-size')).toBe('92');
  expect(svg.querySelector('rect.nt-rule')).not.toBeNull();
  expect(lines(svg)).toEqual(['HyperText Transfer Protocol']);
});

test('a name longer than five characters is set smaller', () => {
  expect(parse(nameTile('TLS/SSL', 'Transport Layer Security')).querySelector('text.nt-name')!.getAttribute('font-size')).toBe('74');
  expect(parse(nameTile('HTTPS', 'HTTP Secure')).querySelector('text.nt-name')!.getAttribute('font-size')).toBe('92');
});

test('a full name over 30 characters takes two lines, broken at the space nearest the middle', () => {
  expect(lines(parse(nameTile('DHCP', 'Dynamic Host Configuration Protocol')))).toEqual(['Dynamic Host', 'Configuration Protocol']);
  expect(lines(parse(nameTile('TLS/SSL', 'Transport Layer Security (SSL is its old name)')))).toEqual([
    'Transport Layer Security',
    '(SSL is its old name)',
  ]);
  // Thirty characters still fit on one line.
  expect(lines(parse(nameTile('X', 'Abcdefghijklmn Opqrstuvwxyzabc')))).toHaveLength(1);
});

test('text is escaped', () => {
  const s = nameTile('A&B <x>', 'A&B <x> "quoted"');
  expect(s).toContain('A&amp;B &lt;x&gt;');
  expect(s).toContain('aria-label="A&amp;B &lt;x&gt; &quot;quoted&quot;"');
  expect(s).not.toContain('<x>');
});
