// A lesson's stamp: whether it has been through the independent fact-check, and how many sources it rests on. The
// words are worked out here, with nothing from the content registry, so the lesson page's island can show them.

export interface LessonStamp {
  /** The day the lesson passed its fact-check, 'YYYY-MM-DD'; null when it has not been checked yet. */
  checked: string | null;
  /** How many sources the lesson lists, each counted once. */
  sources: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-11-08' as '8 Nov 2026'. */
export function stampDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const name = MONTHS[(month ?? 0) - 1];
  if (year === undefined || day === undefined || name === undefined) throw new RangeError(`"${iso}" is not a YYYY-MM-DD date.`);
  return `${day} ${name} ${year}`;
}

/**
 * The stamp in words: 'Checked 8 Nov 2026, 6 sources', or 'Not checked yet, 2 sources'. A lesson's card has less
 * room, and leaves the sources out: 'Checked 8 Nov 2026', 'Not checked yet'.
 */
export function stampWords(stamp: LessonStamp, { sources = true }: { sources?: boolean } = {}): string {
  const state = stamp.checked === null ? 'Not checked yet' : `Checked ${stampDate(stamp.checked)}`;
  return sources ? `${state}, ${stamp.sources} ${stamp.sources === 1 ? 'source' : 'sources'}` : state;
}
