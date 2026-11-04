import { useEffect, useMemo, useState } from 'react';
import { CERT_TAGS } from '../content/certs';
import type { CertTag } from '../content/certs';
import type { LessonSummary } from '../content/registry';
import { byPart, STATUS_TEXT } from '../lib/entries';
import { ProgressSummary, useTrackProgress } from './TrackProgress';
import './site.css';

/**
 * The track's progress line, cert filter chips and every part with its
 * lessons. The server render shows everything unfiltered with empty markers;
 * after mount it reads `?for=` and the saved progress. Its root elements are
 * direct children of the island, so the page can lay them out in a grid.
 */
export function TrackLessonList({ entries, planned }: { trackId: string; entries: LessonSummary[]; planned: number }) {
  const { ready, available, data } = useTrackProgress(entries);

  // Chips for each tag some available lesson carries, in the catalog's tag order.
  const tags = useMemo(() => {
    const present = new Set(entries.flatMap((e) => (e.available ? e.certTags : [])));
    return (Object.keys(CERT_TAGS) as CertTag[]).filter((tag) => present.has(tag));
  }, [entries]);

  const [filter, setFilter] = useState<CertTag | null>(null);
  useEffect(() => {
    // After mount, so the first client render matches the server's.
    const wanted = new URLSearchParams(window.location.search).get('for');
    setFilter(tags.find((tag) => tag === wanted) ?? null);
  }, [tags]);

  function choose(tag: CertTag | null) {
    setFilter(tag);
    const url = new URL(window.location.href);
    if (tag === null) url.searchParams.delete('for');
    else url.searchParams.set('for', tag);
    window.history.replaceState(window.history.state, '', url);
  }

  const shown = entries.filter((e) => filter === null || (e.available && e.certTags.includes(filter)));
  const parts = byPart(shown);

  return (
    <>
      <div className="track-progress">
        <ProgressSummary entries={entries} planned={planned} data={data} shown={ready && available} />
      </div>

      <div className="track-filter" role="group" aria-label="Show lessons for">
        <ul className="chips" role="list">
          <li>
            <button type="button" className="chip" aria-pressed={filter === null} onClick={() => choose(null)}>
              All
            </button>
          </li>
          {tags.map((tag) => (
            <li key={tag}>
              <button type="button" className="chip" aria-pressed={filter === tag} onClick={() => choose(tag)}>
                {CERT_TAGS[tag]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only" role="status">
        {filter === null ? '' : `Showing ${shown.length} ${shown.length === 1 ? 'lesson' : 'lessons'} for ${CERT_TAGS[filter]}`}
      </p>

      <div className="track-parts">
        {parts.map((part) => (
          <section key={part.title} className="track-part" aria-labelledby={`part-${part.entries[0]!.number}`}>
            <h2 id={`part-${part.entries[0]!.number}`} className="track-part__title">
              {part.title}
            </h2>
            <ol className="lesson-list" role="list">
              {part.entries.map((entry) => {
                const status = entry.available && Object.hasOwn(data.lessons, entry.key) ? data.lessons[entry.key]!.status : null;
                return (
                  <li key={entry.key} className="lesson-row" data-available={entry.available}>
                    <span className="lesson-row__num" aria-hidden="true">
                      {entry.number}
                    </span>
                    <div>
                      <div className="lesson-row__head">
                        <h3 className="lesson-row__title">{entry.available ? <a href={entry.url}>{entry.title}</a> : entry.title}</h3>
                        <span className="lesson-row__marker" data-status={entry.available ? (status ?? 'none') : 'soon'}>
                          {entry.available ? (status === null ? '' : STATUS_TEXT[status]) : 'Coming soon'}
                        </span>
                      </div>
                      {entry.available ? (
                        <>
                          <p className="lesson-row__summary">{entry.summary}</p>
                          <ul className="lesson-row__meta" role="list">
                            <li>{`${entry.minutes} min`}</li>
                            {entry.certTags.map((tag) => (
                              <li key={tag}>{CERT_TAGS[tag]}</li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}

export default TrackLessonList;
