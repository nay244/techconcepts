import ThemeToggle from '../components/ThemeToggle';
import type { Lesson } from '../content/schema';

export interface TopBarProps {
  lesson: Lesson;
  trackTitle: string;
  trackUrl: string;
  /** The lesson's number in the track, counting planned lessons too. */
  number: number;
  /** Every lesson the track plans, written or not. */
  total: number;
  position: number;
  /** Whether the outline drawer is open (it is only offered below 1200 px). */
  outlineOpen: boolean;
  onOpenOutline(): void;
}

/** "OSI L7", or "OSI L3–L4" for a lesson that spans layers. Null when the lesson names none. */
export function osiChip(layers: number[]): { text: string; spoken: string } | null {
  if (layers.length === 0) return null;
  const low = Math.min(...layers);
  const high = Math.max(...layers);
  return low === high
    ? { text: `OSI L${low}`, spoken: `OSI layer ${low}` }
    : { text: `OSI L${low}–L${high}`, spoken: `OSI layers ${low} to ${high}` };
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * The lesson page's header: the wordmark home, where the learner is (track,
 * lesson, "Lesson 9 of 19"), one segment per step, the OSI chip and the theme
 * toggle. Below 1200 px it also has the button that opens the outline drawer.
 * Filled segments differ from empty ones by fill, not by hue, and the row is
 * read out as "Step progress: 2 of 5".
 */
export function TopBar({ lesson, trackTitle, trackUrl, number, total, position, outlineOpen, onOpenOutline }: TopBarProps) {
  const stepCount = lesson.steps.length;
  const reached = Math.min(Math.max(position, 0), stepCount);
  const chip = osiChip(lesson.osiLayers);

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu"
        aria-haspopup="dialog"
        aria-expanded={outlineOpen}
        onClick={onOpenOutline}
      >
        <MenuIcon />
        <span>Contents</span>
      </button>
      <a className="topbar__wordmark" href="/">
        TechConcepts
      </a>
      <div className="topbar__where">
        <div className="topbar__crumbs">
          <a href={trackUrl}>{trackTitle}</a>
          <span className="topbar__sep" aria-hidden="true">
            {' › '}
          </span>
          <h1 className="topbar__title">{lesson.title}</h1>
        </div>
        <p className="topbar__position">{`Lesson ${number} of ${total}`}</p>
      </div>
      <div className="topbar__meta">
        <div className="topbar__steps" role="img" aria-label={`Step progress: ${reached} of ${stepCount}`}>
          {lesson.steps.map((step, i) => (
            <span key={step.id} className="topbar__step" data-filled={position > i ? 'true' : 'false'} />
          ))}
        </div>
        {chip === null ? null : (
          <span className="topbar__chip">
            <span aria-hidden="true">{chip.text}</span>
            <span className="sr-only">{chip.spoken}</span>
          </span>
        )}
      </div>
      <div className="topbar__theme">
        <ThemeToggle />
      </div>
    </header>
  );
}

export default TopBar;
