import { expect, test } from 'vitest';
import headers from '../../public/_headers?raw';
import config from '../../wrangler.jsonc?raw';
import { canonicalUrl } from './url';

const SITE = 'https://techconcepts.app';

test('canonicalUrl drops the trailing slash Astro gives directory pages', () => {
  expect(canonicalUrl('/networking/', SITE)).toBe('https://techconcepts.app/networking');
  expect(canonicalUrl('/networking/dhcp/', SITE)).toBe('https://techconcepts.app/networking/dhcp');
  expect(canonicalUrl('/about/', SITE)).toBe('https://techconcepts.app/about');
});

test('canonicalUrl keeps slash-less paths and the home page as they are', () => {
  expect(canonicalUrl('/networking/subnetting', SITE)).toBe('https://techconcepts.app/networking/subnetting');
  expect(canonicalUrl('/', SITE)).toBe('https://techconcepts.app/');
});

// Cloudflare reads these two files at deploy time, and the local preview server
// ignores both, so no e2e test can see them. Pin them here instead.
test('Cloudflare serves the slash-less addresses the site links to', () => {
  expect(config).toMatch(/"html_handling":\s*"drop-trailing-slash"/);
});

test('hashed build files are cached for a year', () => {
  expect(headers).toMatch(/^\/_astro\/\*\n\s+Cache-Control: public, max-age=31536000, immutable$/m);
});
