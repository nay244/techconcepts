/**
 * Words are whitespace-separated tokens. `**` marks a key term and is not a
 * word: it counts as a space, so the punctuation after a key term ("**client**,")
 * is a word of its own.
 */
export function countWords(text: string): number {
  const trimmed = text.replaceAll('**', ' ').trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}
