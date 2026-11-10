import { stampWords, type LessonStamp } from '../lib/stamp';
import './site.css';

interface Props {
  stamp: LessonStamp;
  /** A card has less room and leaves the count out. */
  sources?: boolean;
  /** Where the stamp is explained; without it the stamp is plain words. */
  href?: string;
}

/**
 * A lesson's stamp: a ringed tick and "Checked 8 Nov 2026, 6 sources", or a dashed ring and "Not checked yet,
 * 2 sources". The words carry it; the mark is for the eye.
 */
export function Stamp({ stamp, sources = true, href }: Props) {
  const checked = stamp.checked !== null;
  const body = (
    <>
      <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <circle cx="7" cy="7" r="5.75" strokeDasharray={checked ? undefined : '2.3 2.2'} />
        {checked ? <path d="M4.3 7.3l1.9 1.9 3.6-4" /> : null}
      </svg>
      {stampWords(stamp, { sources })}
    </>
  );
  const state = { 'data-checked': checked ? '' : undefined };
  return href === undefined ? (
    <span className="stamp" {...state}>
      {body}
    </span>
  ) : (
    <a className="stamp" href={href} {...state}>
      {body}
    </a>
  );
}

export default Stamp;
