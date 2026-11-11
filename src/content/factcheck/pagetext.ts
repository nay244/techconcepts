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
const UNSEEN = new Set(['script', 'style', 'template', 'noscript']);
const SVG = 'http://www.w3.org/2000/svg';
/** Marked as not shown: the `hidden` attribute, or a style of its own that hides it. `aria-hidden` text is still seen. */
const hidden = (el: Element): boolean => el.hasAttribute('hidden') || /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(el.getAttribute('style') ?? '');
/** An SVG's own name and description are for a screen reader or a tooltip, not on the page. */
const svgLabel = (el: Element, name: string): boolean => el.namespaceURI === SVG && (name === 'title' || name === 'desc');

/**
 * The text of `node` and everything inside it that a reader sees; `html` says whether HTML's rules (block elements,
 * unseen ones) apply, and `pre` whether line breaks are kept. Outside `<pre>` a line break in a page's source is only
 * a space, so a hyphen before it does not break a word. A superscript is written after `^` and a subscript after `_`,
 * so 2<sup>32</sup> reads 2^32 and never 232.
 */
function collect(node: Node, html: boolean, pre: boolean, out: string[]): void {
  for (const child of Array.from(node.childNodes)) {
    // Text and CDATA; comments, processing instructions and the rest give nothing.
    if (child.nodeType === 3 || child.nodeType === 4) {
      const text = child.nodeValue ?? '';
      out.push(html && !pre ? text.replace(/[\r\n]+/g, ' ') : text);
    } else if (child.nodeType === 1) {
      const el = child as Element;
      const name = el.localName.toLowerCase();
      if (html && (UNSEEN.has(name) || hidden(el) || svgLabel(el, name))) continue;
      const spaced = !html || BLOCK.has(name);
      if (spaced) out.push(' ');
      if (html && name === 'sup') out.push('^');
      if (html && name === 'sub') out.push('_');
      collect(el, html, pre || name === 'pre' || name === 'textarea', out);
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
  if (root !== null) collect(xml ? dom.window.document : root, !xml, false, out);
  dom.window.close();
  return out.join('');
}
