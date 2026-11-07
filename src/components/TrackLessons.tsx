import { useEffect, useState, type ReactNode } from 'react';
import { CERT_TAGS, type CertTag } from '../content/certs';
import type { CardPlace, ReadyLesson, SoonLesson, TrackPart } from '../lib/track';
import { resumePosition, type ProgressData } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import './site.css';

const ARROW = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CHECK = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NOT_STARTED: CardPlace = { parts: ['', '', ''], note: '' };
/** The page's parts list: the sidebar's links to each part (`#part-N`), which follow the part being read. */
const PARTS_LINKS = '.toc a[href^="#part-"]';
const WLP = ['Watch', 'Learn', 'Practice'] as const;

interface Props {
  parts: TrackPart[];
  /** The exams some ready lesson helps with, one chip each (`presentTags(entries)`). */
  tags: CertTag[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
  /** Each ready lesson's figure, static HTML the page passes in as a slot named after the lesson's number. */
  [art: `art${number}`]: ReactNode;
}

/**
 * The track's lessons (track-v2): "Show lessons for" chips, then the parts. A ready lesson is a card with its figure,
 * words and exams, and, for a returning visitor, Finished or In progress with its Watch, Learn and Practice
 * marks; a lesson still to come is a compact row.
 *
 * The chips follow `?for=<tag>`, kept in step with `history.replaceState`, so filtering adds no history. The server
 * cannot see the query, so the server render (and the first render here, which must match it) shows everything; the
 * tag is applied once the island has started. An unknown tag shows everything.
 *
 * While the page scrolls, the sidebar's link to a part shown here (the page's parts list, `.toc` links to `#part-N`)
 * is marked as the current one while that part is in the middle of the window; a part the filter hides loses its
 * mark. A live region, on the page from the start, says how many lessons a filter shows.
 */
export function TrackLessons(props: Props) {
  const { parts, tags, known } = props;
  const { ready, available, data } = useProgress(known);
  const [filter, setFilter] = useState<CertTag | null>(null);

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('for');
    setFilter(tags.find((tag) => tag === wanted) ?? null);
  }, [tags]);

  function choose(tag: CertTag | null): void {
    setFilter(tag);
    const url = new URL(window.location.href);
    if (tag === null) url.searchParams.delete('for');
    else url.searchParams.set('for', tag);
    window.history.replaceState(window.history.state, '', url);
  }

  const progress = ready && available ? data : null;
  const shownParts = parts
    .map((part) => ({ part, items: part.lessons.filter((l) => filter === null || (l.ready && l.tags.includes(filter))) }))
    .filter(({ items }) => items.length > 0);
  const shown = shownParts.reduce((sum, { items }) => sum + items.filter((l) => l.ready).length, 0);
  const shownIds = shownParts.map(({ part }) => `part-${part.n}`).join(' ');
  const sentence = filter === null ? '' : `Showing ${shown} ${shown === 1 ? 'lesson' : 'lessons'} for ${CERT_TAGS[filter]}.`;

  // The parts list follows the part being read, as the mockup's does; it watches only the parts shown.
  // Contract with the page: its parts list is the sidebar's (.toc) links to #part-N.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const links = [...document.querySelectorAll<HTMLAnchorElement>(PARTS_LINKS)];
    const mark = (a: HTMLAnchorElement, on: boolean): void => {
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    };
    // A part the filter has just hidden is no longer the one being read.
    const ids = new Set(shownIds.split(' '));
    for (const a of links) if (!ids.has(a.hash.slice(1))) mark(a, false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) for (const a of links) mark(a, a.hash === `#${entry.target.id}`);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section !== null) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [shownIds]);

  return (
    <>
      <div className="toolbar" role="group" aria-labelledby="filter-lbl">
        <span className="toolbar-lbl" id="filter-lbl">
          Show lessons for
        </span>
        <ul className="chips">
          {[null, ...tags].map((tag) => (
            <li key={tag ?? 'all'}>
              <button type="button" className="chip" aria-pressed={filter === tag} onClick={() => choose(tag)}>
                {tag === null ? 'All' : CERT_TAGS[tag]}
              </button>
            </li>
          ))}
        </ul>
        {/* The line the eye reads; the live region beside it, always on the page, says the same to assistive tech. */}
        <p className="showing" aria-hidden="true">
          {sentence}
        </p>
        <p className="sr-only" role="status">
          {sentence}
        </p>
      </div>
      {shownParts.map(({ part, items }) => {
        const allSoon = part.ready === 0;
        return (
          <section key={part.n} className={allSoon ? 'part all-soon' : 'part'} id={`part-${part.n}`} aria-labelledby={`part-${part.n}-t`}>
            <div className="part-head">
              <div>
                <p className="part-n">{`Part ${part.n}`}</p>
                <h2 id={`part-${part.n}-t`}>{part.title}</h2>
              </div>
              <span className="part-c">
                {allSoon ? (
                  `${part.lessons.length} lessons, coming soon`
                ) : (
                  <>
                    <b>{part.ready}</b> of {part.lessons.length} ready
                  </>
                )}
              </span>
            </div>
            {allSoon ? (
              <ol className="soon-list" role="list">
                {items.map((l) => (
                  <li key={l.key}>
                    <span className="num">{l.n}</span>
                    {l.title}
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="lessons" role="list">
                {items.map((l) => (l.ready ? <LessonCard key={l.key} lesson={l} progress={progress} art={props[`art${l.number}`]} /> : <SoonRow key={l.key} lesson={l} />))}
              </ol>
            )}
          </section>
        );
      })}
    </>
  );
}

function SoonRow({ lesson }: { lesson: SoonLesson }) {
  return (
    <li className="soon-row">
      <span className="num">{lesson.n}</span>
      <span className="t">{lesson.title}</span>
      <span className="badge soon">Coming soon</span>
    </li>
  );
}

/** One ready lesson. `progress` is null until saved progress has loaded, and while storage is blocked. */
function LessonCard({ lesson, progress, art }: { lesson: ReadyLesson; progress: ProgressData | null; art: ReactNode }) {
  const status = progress !== null && Object.hasOwn(progress.lessons, lesson.key) ? progress.lessons[lesson.key]!.status : null;
  const position = status === 'in-progress' ? (resumePosition(progress!, lesson.key) ?? 0) : 0;
  const place: CardPlace =
    status === 'finished' ? { parts: ['done', 'done', 'done'], note: '' } : status === 'in-progress' ? lesson.places[position]! : NOT_STARTED;
  // Continue goes on from the saved step, as the hero's Continue does.
  const href = position > 0 ? `${lesson.url}?step=${position}` : lesson.url;

  return (
    <li className="card lesson">
      <div className="l-art">{art}</div>
      <div className="l-body">
        <div className="l-top">
          <span className="l-num">{`Lesson ${lesson.n}`}</span>
          {status === 'finished' ? (
            <span className="badge done">
              {CHECK}
              Finished
            </span>
          ) : status === 'in-progress' ? (
            <span className="badge prog">In progress</span>
          ) : null}
        </div>
        <h3>
          <a className="l-link" href={href}>
            {lesson.title}
          </a>
        </h3>
        <p className="l-sub">{lesson.subtitle}</p>
        <p className="l-say">{lesson.summary}</p>
        <ul className="l-meta" aria-label={lesson.metaLabel}>
          {lesson.meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="l-foot">
          <span className="wlp" aria-hidden="true">
            {WLP.map((w, i) => (
              <span key={w} className={place.parts[i]}>
                <i />
                {w}
              </span>
            ))}
          </span>
          {status === 'in-progress' ? (
            <>
              <span className="wlp-note" aria-hidden="true">
                {place.note}
              </span>
              <span className="sr-only">{`In progress: ${place.note}.`}</span>
            </>
          ) : status === 'finished' ? (
            <span className="sr-only">Finished.</span>
          ) : null}
          <span className="l-go" aria-hidden="true">
            {status === 'finished' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start lesson'}
            {ARROW}
          </span>
        </div>
      </div>
    </li>
  );
}

export default TrackLessons;
