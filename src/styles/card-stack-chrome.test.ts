// The header and footer block at the end of card-stack.css, read from the file as it is (job 24, prototypes/d23-cases.md
// case 5). The built site's CSS is minified (the clamp is rewritten, the prefixed pairs folded), so only the source is read.
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const css = readFileSync('src/styles/card-stack.css', 'utf8');

const SELECTOR_START = /^(a\.skip-link|header\.site-head|\.site-head|footer\.site-foot|\.site-foot)\b/;

/** The block, from its BEGIN comment to the end of the file. */
const blockOf = (text: string): string => text.slice(text.indexOf('/* HEADER AND FOOTER BEGIN'));

/** What is wrong with the block in `text`: each entry a sentence; empty when it is as the spec writes it. */
function problems(text: string): string[] {
  const out: string[] = [];
  const begin = text.split('HEADER AND FOOTER BEGIN').length - 1;
  const end = text.split('HEADER AND FOOTER END */').length - 1;
  if (begin !== 1) out.push(`BEGIN appears ${begin} times`);
  if (end !== 1) out.push(`END appears ${end} times`);
  if (!text.endsWith('/* HEADER AND FOOTER END */\n')) out.push('END is not the last line');
  const block = blockOf(text);
  const bare = block.replace(/\/\*[\s\S]*?\*\//g, '');
  if (/!important/.test(bare)) out.push('an !important');
  const rules = [...bare.matchAll(/([^{}]+)\{([^{}]*)\}?/g)].map((m) => ({ at: m.index!, prelude: m[1]!.trim(), body: m[2]! }));
  const opens = [...bare.matchAll(/([^{};]+)\{/g)].map((m) => m[1]!.trim());
  const medias = opens.filter((p) => p.startsWith('@media'));
  for (const m of medias) if (m !== '@media (max-width: 959px)' && m !== '@media (max-width: 720px)') out.push(`a media query: ${m}`);
  for (const p of opens) {
    if (p.startsWith('@media')) continue;
    for (const part of p.split(',')) if (!SELECTOR_START.test(part.trim())) out.push(`a selector outside the header and footer: ${part.trim()}`);
  }
  const clamps = bare.split('clamp(16px, (100vw - 278px) / 2, 32px)').length - 1;
  if (clamps !== 2) out.push(`the clamp appears ${clamps} times`);
  // A `display` on these three would unhide the menu button from 960px, the strip below it, or the panel without its [hidden].
  for (const r of rules) {
    if (/^\.site-head \.(icon-btn|pillnav|menu-panel)(:[\w-]+)?$/.test(r.prelude) && /\bdisplay\s*:/.test(r.body)) out.push(`a display in ${r.prelude}`);
  }
  const hover = bare.indexOf('.site-head .icon-btn:hover');
  const open = bare.indexOf(".site-head .menu-btn[aria-expanded='true']");
  if (hover < 0 || open < 0 || open < hover) out.push('the open menu button rule does not come after the button hover rule');
  return out;
}

test('the header and footer block is as the spec writes it: marked, no !important, every selector inside the header and the footer, two clamps, two media queries, no display on the three hidden parts, the open button after the hover', () => {
  expect(problems(css)).toEqual([]);
});

test('the checks can fail: an !important, a stray selector, a display on the strip, a rule after END, a third clamp or the open rule first are each found', () => {
  const seed = (from: string, to: string): string => {
    expect(css, from).toContain(from);
    return css.replace(from, to);
  };
  expect(problems(seed('color: var(--ink-strong);\n}\n.site-head .pillnav a[aria-current]', 'color: var(--ink-strong) !important;\n}\n.site-head .pillnav a[aria-current]'))).toContain('an !important');
  expect(problems(css.replace('/* HEADER AND FOOTER END */', '.pillnav a {\n  color: red;\n}\n/* HEADER AND FOOTER END */'))).toContain('a selector outside the header and footer: .pillnav a');
  expect(problems(seed('.site-head .pillnav {\n  gap: 2px;', '.site-head .pillnav {\n  display: flex;\n  gap: 2px;'))).toContain('a display in .site-head .pillnav');
  expect(problems(css + '.site-head a {\n  color: red;\n}\n')).toContain('END is not the last line');
  expect(problems(seed('padding: 1px clamp(16px, (100vw - 278px) / 2, 32px) 0;', 'padding: 1px 32px 0;'))).toContain('the clamp appears 1 times');
  const hoverAt = css.indexOf('.site-head .icon-btn:hover {');
  const openRule = ".site-head .menu-btn[aria-expanded='true'] {\n  background: var(--cs-edge);\n  color: var(--cs-card);\n}\n";
  const moved = css.replace(openRule, '').replace('.site-head .icon-btn:hover {', `${openRule}.site-head .icon-btn:hover {`);
  expect(hoverAt).toBeGreaterThan(0);
  expect(problems(moved)).toContain('the open menu button rule does not come after the button hover rule');
});
