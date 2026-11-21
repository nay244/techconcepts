import { flushSync } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AvailableSummary, LessonSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import { resumeLabel } from '../engine/timeline';
import type { LessonDefinition } from '../lib/glossary';
import { buildStamp } from '../lib/build-stamp';
import { figureOfKey } from '../lib/lesson-figures';
import { canonicalUrl } from '../lib/url';

/**
 * A lesson change without a page load (job 30, D26). When a press (an outline row, the Up next card, "Next lesson") or the
 * browser's Back or Forward names another lesson of the same track that draws the same figure, the lesson's own data
 * (`/<track>/<slug>.json`, B43) is fetched and the console shows that lesson in place, the address moved with
 * `history.pushState`. Anything else is the browser's own page load, as is every swap that cannot be made (the data does
 * not come, is not a 200, is another build's, or is later than the limit).
 */

/** What a lesson page's island is given and a swap replaces. */
export interface LessonView {
  lesson: Lesson;
  entry: AvailableSummary;
  next: AvailableSummary | null;
  nextFigure: string | null;
  definitions?: Record<string, LessonDefinition>;
}

/** A lesson's data file (`[lesson].json.ts`). */
interface LessonFile extends LessonView {
  stamp: string;
}

/** The change in progress, for the marks (D26 section 3): which row is going, how far into the wait, and the words. */
export interface Wait {
  /** The key of the outline row that was pressed, or null for a card, the forward button or Back and Forward. */
  going: string | null;
  /** `idle` until 100 ms, `signal` from 100 ms, `tape` from 400 ms. */
  phase: 'idle' | 'signal' | 'tape';
  /** The new lesson's title as the outline lists it. */
  title: string;
}

/** The lesson line a swap says, and which swap it was. */
export interface Arrived {
  text: string;
  id: number;
}

export const SIGNAL_MS = 100;
export const TAPE_MS = 400;
export const LIMIT_MS = 2000;

type How = 'row' | 'sheet' | 'card' | 'next' | 'history';

interface Job {
  controller: AbortController;
  timers: ReturnType<typeof setTimeout>[];
}

/** The path as the site serves it: no trailing slash. */
const pathOf = (path: string): string => (path === '/' ? path : path.replace(/\/+$/, ''));

/** The address the lesson line names: "UDP. Lesson 4 of 14. Overview." */
export function lessonLine(view: LessonView, total: number): string {
  return `${view.lesson.title}. Lesson ${view.entry.number} of ${total}. ${resumeLabel(view.lesson, 0)}.`;
}

function setMeta(selector: string, attribute: string, value: string): void {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

/** The head of the new lesson, as BaseLayout writes it for that lesson's own page. */
function writeHead(view: LessonView): void {
  const fullTitle = `${view.lesson.title} · TechConcepts`;
  document.title = fullTitle;
  setMeta('meta[name="description"]', 'content', view.lesson.summary);
  setMeta('meta[property="og:title"]', 'content', fullTitle);
  setMeta('meta[property="og:description"]', 'content', view.lesson.summary);
  // The site's own origin, read from the page's own canonical address (never `location`: this runs on localhost too).
  const base = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content;
  if (base === undefined) return;
  const page = canonicalUrl(view.entry.canonical, base);
  setMeta('link[rel="canonical"]', 'href', page);
  setMeta('meta[property="og:url"]', 'content', page);
}

/** The page's `h1` that is on screen: the column's from 1100px wide, the bar's under it. */
function visibleName(): HTMLElement | null {
  return [...document.querySelectorAll<HTMLElement>('.console h1.top__name')].find((h) => h.getClientRects().length > 0) ?? null;
}

/** Focus the new lesson's name; it joins the Tab order only while it holds focus. */
function focusName(): void {
  const h1 = visibleName();
  if (h1 === null) return;
  h1.setAttribute('tabindex', '-1');
  h1.addEventListener('blur', () => h1.removeAttribute('tabindex'), { once: true });
  h1.focus();
}

export interface LessonChange {
  view: LessonView;
  wait: Wait | null;
  arrived: Arrived | null;
  /** What "Next lesson" calls: a swap when the lesson draws the same figure, else `navigate`. */
  navigate(url: string): void;
}

/** Holds the lesson the console shows and carries out a change to another. See the file's comment. */
export function useLessonChange(initial: LessonView, trackId: string, entries: LessonSummary[], navigate: (url: string) => void): LessonChange {
  const [view, setView] = useState<LessonView>(initial);
  const [wait, setWait] = useState<Wait | null>(null);
  const [arrived, setArrived] = useState<Arrived | null>(null);

  // What the listeners below read: the latest, without making them again.
  const latest = useRef({ view, wait, trackId, entries, navigate });
  latest.current = { view, wait, trackId, entries, navigate };
  const job = useRef<Job | null>(null);
  const swaps = useRef(0);
  /** The last click's keys: "Next lesson" is a button, and a modified press of it stays the browser's own load. */
  const lastClick = useRef({ modified: false });

  const cancel = useCallback(() => {
    const running = job.current;
    if (running === null) return;
    job.current = null;
    running.controller.abort();
    for (const timer of running.timers) clearTimeout(timer);
  }, []);

  /** The lesson's entry when a change to `path` can be made in place: this track, written, another lesson, the same drawing. */
  const target = useCallback((path: string): AvailableSummary | null => {
    const { view: shown, entries: all } = latest.current;
    const found = all.find((e): e is AvailableSummary => e.available && e.url === path);
    if (found === undefined || found.key === shown.entry.key) return null;
    return figureOfKey(found.key) === shown.lesson.figure ? found : null;
  }, []);

  const fallBack = useCallback((url: string, how: How) => {
    cancel();
    if (how === 'history') window.location.reload();
    else if (how === 'next') latest.current.navigate(url);
    else window.location.assign(url);
  }, [cancel]);

  const commit = useCallback(
    (file: LessonFile, how: How, url: string) => {
      cancel();
      const next: LessonView = { lesson: file.lesson, entry: file.entry, next: file.next, nextFigure: file.nextFigure, definitions: file.definitions };
      const total = latest.current.entries.length;
      swaps.current += 1;
      flushSync(() => {
        setView(next);
        setWait(null);
        setArrived({ text: lessonLine(next, total), id: swaps.current });
      });
      // The address, then the head, in the swap's frame; Back and Forward are already at the new address.
      if (how === 'history') {
        if (window.location.search !== '' || pathOf(window.location.pathname) !== url) window.history.replaceState(window.history.state, '', url);
      } else window.history.pushState(null, '', url);
      writeHead(next);
      // Focus: the control pressed when it is still on the page, else the lesson's name (D26 section 4).
      if (how === 'row') {
        const row = document.querySelector<HTMLElement>('.console__track a.outline__lesson[aria-current="page"]');
        if (row === null) focusName();
        else row.focus();
      } else if (how !== 'next') focusName();
    },
    [cancel],
  );

  const begin = useCallback(
    (url: string, entry: AvailableSummary, how: How) => {
      cancel();
      const controller = new AbortController();
      const running: Job = { controller, timers: [] };
      job.current = running;
      const carried = latest.current.wait !== null && latest.current.wait.phase !== 'idle';
      setWait({ going: how === 'row' || how === 'sheet' ? entry.key : null, phase: carried ? 'signal' : 'idle', title: entry.title });
      const at = (ms: number, run: () => void) => running.timers.push(setTimeout(() => job.current === running && run(), ms));
      at(SIGNAL_MS, () => setWait((w) => (w === null ? w : { ...w, phase: w.phase === 'tape' ? 'tape' : 'signal' })));
      at(TAPE_MS, () => setWait((w) => (w === null ? w : { ...w, phase: 'tape' })));
      at(LIMIT_MS, () => fallBack(url, how));
      void (async () => {
        try {
          const response = await fetch(`${url}.json`, { signal: controller.signal });
          if (response.status !== 200) throw new Error(`${response.status}`);
          const file = (await response.json()) as LessonFile;
          if (job.current !== running) return;
          // Another build's data, or another drawing than the open page's: the browser's own load.
          const shown = latest.current.view.lesson;
          if (file.stamp !== buildStamp || file.lesson?.figure !== shown.figure || file.entry?.url !== url) throw new Error('not this page');
          commit(file, how, url);
        } catch {
          if (job.current === running) fallBack(url, how);
        }
      })();
    },
    [cancel, commit, fallBack],
  );

  // The press: a plain primary click or Enter on a link of the console that names a lesson this page can open in place.
  useEffect(() => {
    const note = (e: MouseEvent) => {
      lastClick.current = { modified: e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 };
    };
    const press = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (link === null || link.closest('.console') === null) return;
      if ((link.target !== '' && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.search !== '' || url.hash !== '') return;
      const path = pathOf(url.pathname);
      const entry = target(path);
      if (entry === null) return;
      const how: How | null = link.closest('.outline__dialog') !== null ? 'sheet' : link.closest('.console__track') !== null ? 'row' : link.closest('.upnext') !== null ? 'card' : null;
      if (how === null) return;
      e.preventDefault();
      begin(path, entry, how);
    };
    document.addEventListener('click', note, true);
    document.addEventListener('click', press);
    return () => {
      document.removeEventListener('click', note, true);
      document.removeEventListener('click', press);
    };
  }, [begin, target]);

  // Back and Forward: the browser has already moved the address; the lesson follows (at its Overview, 2.150).
  useEffect(() => {
    const onPop = () => {
      const path = pathOf(window.location.pathname);
      const { view: shown, entries: all } = latest.current;
      // A hash entry (the skip link) is not a lesson change; a change still on its way to another lesson is dropped.
      if (path === shown.entry.url) {
        if (job.current !== null) {
          cancel();
          setWait(null);
        }
        return;
      }
      const entry = all.find((e): e is AvailableSummary => e.available && e.url === path);
      if (entry === undefined || figureOfKey(entry.key) !== shown.lesson.figure) {
        window.location.reload();
        return;
      }
      begin(path, entry, 'history');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [begin, cancel]);

  // A change still on its way when the console goes is dropped.
  useEffect(() => cancel, [cancel]);

  /** "Next lesson": a plain press or key opens the lesson in place when the drawing is the same; a modified press is the browser's. */
  const forward = useCallback(
    (url: string) => {
      const modified = lastClick.current.modified;
      lastClick.current = { modified: false };
      const path = pathOf(url);
      const entry = modified ? null : target(path);
      if (entry === null) latest.current.navigate(url);
      else begin(path, entry, 'next');
    },
    [begin, target],
  );

  return { view, wait, arrived, navigate: forward };
}
