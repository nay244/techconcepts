// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';

/**
 * The text of a saved web page (`.html`) or registry file (`.xml`), as a reader would see it, for the quote check. The
 * page is parsed, not stripped with a pattern, so entities are decoded as a browser decodes them and no attribute's
 * text leaks in. This module needs jsdom, so only the fact-check command imports it; the site's pages must not.
 */

/** Elements that begin and end a line of text: a space goes at each end, so the words either side do not run together. */
const BLOCK = new Set(
  ('address article aside blockquote body br caption center dd details dialog dir div dl dt fieldset figcaption figure footer form ' +
    'h1 h2 h3 h4 h5 h6 header hgroup hr legend li main menu nav ol optgroup option p pre search section summary table tbody td tfoot th thead title tr ul').split(' '),
);
/** Elements whose contents a reader does not see. */
const UNSEEN = new Set(['script', 'style', 'template']);

/** The text of `node` and everything inside it that a reader sees; `html` says whether HTML's rules (block elements, unseen ones) apply. */
function collect(node: Node, html: boolean, out: string[]): void {
  for (const child of Array.from(node.childNodes)) {
    // Text and CDATA; comments, processing instructions and the rest give nothing.
    if (child.nodeType === 3 || child.nodeType === 4) {
      out.push(child.nodeValue ?? '');
    } else if (child.nodeType === 1) {
      const el = child as Element;
      const name = el.localName.toLowerCase();
      if (html && (UNSEEN.has(name) || el.hasAttribute('hidden'))) continue;
      const spaced = !html || BLOCK.has(name);
      if (spaced) out.push(' ');
      collect(el, html, out);
      if (spaced) out.push(' ');
    }
  }
}

/** The text of a file's page, or of its XML for a name ending `.xml`. Throws when the file is not well-formed XML. */
export function pageText(name: string, raw: string): string {
  const xml = name.endsWith('.xml');
  const dom = new JSDOM(raw, xml ? { contentType: 'text/xml' } : {});
  const root = xml ? dom.window.document.documentElement : dom.window.document.body;
  const out: string[] = [];
  if (root !== null) collect(xml ? dom.window.document : root, !xml, out);
  dom.window.close();
  return out.join('');
}
