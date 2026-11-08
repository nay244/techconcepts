/**
 * The show sweep every lesson's test runs: one driver, shown the lesson's
 * moments in turn, must leave its figure at each position exactly as a fresh
 * driver shown only that moment does. A driver that forgets to clear something
 * an earlier moment drew (a light left on, a layer left showing, a callout's
 * old words) fails here, at the first compared moment where the leftover shows,
 * whichever lesson it is.
 *
 * Runs under jsdom: the caller's test file starts with
 * `// @vitest-environment jsdom`.
 */
import { expect } from 'vitest';
import { drawFigure } from '../art/scenes';
import type { FigureId } from '../art/scenes/types';
import type { Lesson } from '../content/schema';
import { deriveState, slotsFor, stepEvents } from '../engine/timeline';
import { sceneViewOf, type SceneDriver, type SceneView } from '../scenes/driver';
import { DRIVERS } from '../scenes/drivers';

/** One moment of the lesson: position `p` once `n` of its events have played. */
interface Moment {
  p: number;
  n: number;
}

/** A figure on the page, and its driver. */
interface MountedFigure {
  root: SVGSVGElement;
  driver: SceneDriver;
  /** Lets go of the driver and takes the figure off the page. */
  remove(): void;
}

/**
 * Puts copies of figure `id` on the page, each with its own driver, as the
 * lesson console does. The figure is drawn and read once, and each copy is
 * cloned from it: the sweep needs a fresh copy for every moment it compares.
 */
function mounter(id: FigureId): () => MountedFigure {
  const { svg, data } = drawFigure(id);
  const json = JSON.stringify(data);
  const template = document.createElement('template');
  template.innerHTML = svg;
  const drawn = template.content.querySelector<SVGSVGElement>(`svg[data-figure="${id}"]`);
  if (drawn === null) throw new Error(`The "${id}" figure has no svg[data-figure="${id}"].`);
  return () => {
    const host = document.createElement('div');
    const root = document.importNode(drawn, true);
    host.append(root);
    document.body.append(host);
    const driver = DRIVERS[id].create(root, JSON.parse(json));
    return {
      root,
      driver,
      remove() {
        driver.destroy();
        host.remove();
      },
    };
  };
}

/** The view at position `p` once `n` of its events have played. */
function viewAt(lesson: Lesson, { p, n }: Moment): SceneView {
  return sceneViewOf(lesson.units[slotsFor(lesson)[p]!.unit]!, deriveState(lesson, p, n));
}

/**
 * A style attribute's declarations, written one way. jsdom keeps a style
 * attribute as the figure wrote it ("opacity:0") until the driver sets a
 * value, and then writes it as the browser does ("opacity: 0;"), so a part that
 * was changed and changed back has the same style in other words. And a
 * property taken off and put back moves to the end of the list, which changes
 * nothing either. Every declaration and value is kept as written.
 */
function styleOf(style: string): string {
  return style
    .split(';')
    .map((d) => d.trim())
    .filter((d) => d !== '')
    .map((d) => {
      const colon = d.indexOf(':');
      return colon === -1 ? d : `${d.slice(0, colon).trim()}: ${d.slice(colon + 1).trim()}`;
    })
    .sort()
    .join('; ');
}

const escape = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The figure's markup, with two differences that are not the figure's state
 * written out of it: each style as `styleOf` writes it, and each element's
 * attributes in name order (an attribute the driver took off and put back is
 * written last, though it says the same). Classes, every other attribute,
 * transforms, text and hidden flags are compared exactly as they are.
 */
function figureMarkup(node: Node): string {
  if (node.nodeType === node.TEXT_NODE || node.nodeType === node.CDATA_SECTION_NODE) return escape(node.textContent ?? '');
  if (node.nodeType !== node.ELEMENT_NODE) return '';
  const el = node as Element;
  const attrs = [...el.attributes]
    .map((a) => [a.name, a.name === 'style' ? styleOf(a.value) : a.value] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([name, value]) => ` ${name}="${escape(value)}"`)
    .join('');
  return `<${el.tagName}${attrs}>${[...el.childNodes].map(figureMarkup).join('')}</${el.tagName}>`;
}

/** Where two figures' markup first differs, with a little of each around it, and the nearest id before it. */
function differenceAt(got: string, want: string): string {
  let i = 0;
  while (i < got.length && i < want.length && got[i] === want[i]) i++;
  const ids = [...got.slice(0, i).matchAll(/ id="([^"]+)"/g)];
  const near = ids.length > 0 ? `#${ids[ids.length - 1]![1]}` : 'the root';
  const around = (s: string) => s.slice(Math.max(0, i - 120), i + 120);
  return `near ${near}:\n  this driver: …${around(got)}…\n  a fresh one: …${around(want)}…`;
}

/**
 * Shows `lesson` on one driver of its figure, from the Overview through every
 * step to Learn and Practice (unit after unit), at every event of every step,
 * then back again the same way to the first Overview; then from the first
 * Overview to the end of each position and straight back.
 *
 * At every position, each way, the figure must be what a fresh driver shown
 * only that moment draws: at the position's first moment (nothing of its step
 * played yet) and at its last (all of it played), which for the Overview,
 * Learn and Practice are the same moment. So every move from one position to
 * the next, each way, lands on a moment that is compared. The moments in the
 * middle of a step are shown, so they must not throw and anything they leave
 * behind is carried on, but they are not compared: a fresh copy of the network
 * map and its driver takes about 30 ms under jsdom, and How the Internet Works' 429 moments
 * would triple the time the whole suite takes.
 *
 * Returns how many moments the lesson has (each position, plus each event of
 * each step once more), so a test can check that none was missed.
 */
export function showSweep(lesson: Lesson): number {
  const slots = slotsFor(lesson);
  const label = ({ p, n }: Moment) => {
    const slot = slots[p]!;
    const where = slot.kind === 'step' ? `step ${slot.step}` : slot.kind;
    return `${lesson.units[slot.unit]!.id} ${where} (position ${p}), ${n} of ${stepEvents(lesson, p).length} events played`;
  };

  const mount = mounter(lesson.figure);

  /**
   * What a fresh driver draws at each moment, worked out once per moment: the
   * figure's markup as the page holds it, and as `figureMarkup` writes it,
   * which is needed only when the two drivers' markup differs.
   */
  const fresh = new Map<string, { html: string; markup?: string }>();
  const freshAt = ({ p, n }: Moment) => {
    const key = `${p}/${n}`;
    let found = fresh.get(key);
    if (found === undefined) {
      const figure = mount();
      figure.driver.show(viewAt(lesson, { p, n }));
      found = { html: figure.root.outerHTML };
      figure.remove();
      fresh.set(key, found);
    }
    return found;
  };
  /** Whether the figure is what a fresh driver draws at `moment`, and if not, where it first differs. */
  const differenceFromFresh = (root: SVGSVGElement, moment: Moment): string | null => {
    const want = freshAt(moment);
    // The same markup is the same figure; only markup that differs is written out the one way.
    if (root.outerHTML === want.html) return null;
    if (want.markup === undefined) {
      const template = document.createElement('template');
      template.innerHTML = want.html;
      want.markup = figureMarkup(template.content.firstElementChild!);
    }
    const got = figureMarkup(root);
    return got === want.markup ? null : differenceAt(got, want.markup);
  };

  const moments: Moment[] = slots.flatMap((_, p) => Array.from({ length: stepEvents(lesson, p).length + 1 }, (_, n) => ({ p, n })));
  /** A position's first or last moment. */
  const compared = ({ p, n }: Moment) => n === 0 || n === stepEvents(lesson, p).length;
  const ends: Moment[] = slots.map((_, p) => ({ p, n: stepEvents(lesson, p).length }));
  const start: Moment = { p: 0, n: 0 };
  const path: [Moment, string][] = [
    ...moments.map((m): [Moment, string] => [m, 'forwards']),
    ...[...moments].reverse().map((m): [Moment, string] => [m, 'backwards']),
    ...ends.slice(1).flatMap((m): [Moment, string][] => [
      [m, 'jumping from the start'],
      [start, `jumping back from ${label(m)}`],
    ]),
  ];

  const figure = mount();
  try {
    for (const [moment, how] of path) {
      const name = `${label(moment)}, ${how}`;
      try {
        figure.driver.show(viewAt(lesson, moment));
      } catch (error) {
        throw new Error(`show threw at ${name}`, { cause: error });
      }
      if (compared(moment)) expect(differenceFromFresh(figure.root, moment), name).toBeNull();
    }
  } finally {
    figure.remove();
  }
  return moments.length;
}
