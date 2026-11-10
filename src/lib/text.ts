// Small helpers for words worked out from the content when a page is built. Nothing here runs in the browser.

/** The first sentence: up to the first full stop that a space follows, or all of it when there is no such stop. */
export function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}
