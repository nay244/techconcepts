import { expect, test } from 'vitest';
import { sha256 } from './sha256';

// FIPS 180-2's examples ('abc' and the two-block message), the empty string, a long one, and UTF-8 text.
test.each([
  ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
  ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],
  ['✅ ⚠️ ❌ é', 'e68fab860ecd7e1e15630359a72d226ca1d0070f7130bbcc3eee4f4e3172eade'],
  ['a'.repeat(1000), '41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3'],
])('sha256 of %j', (text, hex) => {
  expect(sha256(text)).toBe(hex);
});
