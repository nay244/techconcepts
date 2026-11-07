import type { LessonSummary } from '../content/registry';
import type { Lesson, Unit } from '../content/schema';
import { holding, type PlaybackState } from '../engine/playback';
import { positionOf, type Slot } from '../engine/timeline';
import { createSafeStorage } from '../lib/storage';
import { THEME_KEY, applyTheme, useTheme, type Theme } from '../lib/theme';
import type { ProgressData } from '../progress/store';
import { placeLabel } from './placeLabel';

export interface TopBarProps {
  lesson: Lesson;
  trackTitle: string;
  trackUrl: string;
  /** The lesson's number in the track, counting planned lessons too. */
  number: number;
  /** Every lesson the track plans, written or not: the "20" in "Lesson 10 of 20". */
  total: number;
  state: PlaybackState;
  /** What the current position shows, and its unit (the console's derived state). */
  slot: Slot;
  unit: Unit;
  /** With less motion asked for, a hold does not fill the next step's segment. */
  reducedMotion: boolean;
  /** Every entry of the track, in order. */
  entries: LessonSummary[];
  /** The key of the lesson on this page. */
  currentKey: string;
  progress: ProgressData;
}

const OSI_NAMES = ['Physical', 'Data link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'];

/**
 * 'OSI layer 7, Application', or 'OSI layers 3 and 4'. Null when the unit names no layer. With `named: false`, a
 * single layer is only its number, 'OSI layer 7': a lesson of many units says it that way (internet-v2), which
 * leaves its long title room in the bar at 1280 px; the one-unit lessons' mockups name the layer.
 */
export function osiHeading(layers: number[], { named = true }: { named?: boolean } = {}): string | null {
  const sorted = [...new Set(layers)].sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  if (sorted.length === 1) return named ? `OSI layer ${sorted[0]}, ${OSI_NAMES[sorted[0]! - 1]}` : `OSI layer ${sorted[0]}`;
  return `OSI layers ${sorted.slice(0, -1).join(', ')} and ${sorted.at(-1)}`;
}

// ---------------------------------------------------------------- theme switch

// Created at module scope, which is safe: storage is only touched when a button is pressed.
const themeStorage = createSafeStorage();

/** Light and Dark as one segmented switch. With no saved choice the page follows the system, and the switch shows that. */
function ThemeSwitch() {
  // Null on the server, so neither button is pressed until the island hydrates.
  const theme = useTheme();
  function choose(next: Theme): void {
    applyTheme(next);
    themeStorage.set(THEME_KEY, next);
  }
  return (
    <div className="topbar__seg" role="group" aria-label="Theme">
      <button type="button" aria-pressed={theme === 'light'} onClick={() => choose('light')}>
        Light
      </button>
      <button type="button" aria-pressed={theme === 'dark'} onClick={() => choose('dark')}>
        Dark
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- the bar

function Logo() {
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true" focusable="false">
      <polygon points="17,3 31,11 17,19 3,11" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
      <polyline points="3,11 3,15 17,23 31,15 31,11" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="11" y1="11" x2="23" y2="11" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="11" cy="11" r="2.6" fill="var(--here)" />
      <circle cx="23" cy="11" r="2.6" fill="var(--accent)" />
    </svg>
  );
}

/**
 * The lesson's top bar: the logo; where the learner is (track › lesson, "Lesson
 * 10 of 20", a segment per step of the current unit plus Learn and Practice,
 * and "Step 2 of 5", never the step's title, which can be too long); the unit's
 * OSI layers; the track's progress; and the Light/Dark switch. The segments and
 * the 20 places are drawn for the eye and said in words beside them.
 */
export function TopBar({ lesson, trackTitle, trackUrl, number, total, state, slot, unit, reducedMotion, entries, currentKey, progress }: TopBarProps) {
  const start = positionOf(lesson, slot.unit, 'overview');
  const here = state.position - start;
  const hold = reducedMotion ? null : holding(state);

  /** The segment for the unit's part `i` (1 to n for the steps, then Learn, then Practice). */
  function segment(i: number) {
    const status = i < here ? 'done' : i === here ? 'current' : undefined;
    const filling = hold !== null && hold.next === start + i ? hold : null;
    return (
      <span key={i} className="topbar__step" data-state={status}>
        {filling === null ? null : <span className="topbar__fill" style={{ animationDuration: `${filling.ms}ms` }} />}
      </span>
    );
  }

  const n = unit.steps.length;
  const osi = osiHeading(unit.osiLayers, { named: lesson.units.length === 1 });
  const finished = new Set(
    entries.filter((e) => Object.hasOwn(progress.lessons, e.key) && progress.lessons[e.key]!.status === 'finished').map((e) => e.key),
  );

  return (
    <header className="console__panel console__top">
      <a className="topbar__brand" href="/" aria-label="TechConcepts home">
        <Logo />
        <span>
          <b>TechConcepts</b>
          <small>See how technology works</small>
        </span>
      </a>

      <div className="topbar__now">
        <div className="topbar__crumb">
          <a href={trackUrl}>{trackTitle}</a>
          <span aria-hidden="true">{' › '}</span>
          {/* A title too long for the bar is cut short with an ellipsis; the whole of it stays in the heading. */}
          <h1 title={lesson.title}>{lesson.title}</h1>
          <em>{`Lesson ${number} of ${total}`}</em>
        </div>
        <div className="topbar__steps">
          <span className="topbar__segments" aria-hidden="true">
            <span className="topbar__group">{unit.steps.map((_, i) => segment(i + 1))}</span>
            <span className="topbar__group">{segment(n + 1)}</span>
            <span className="topbar__group">{segment(n + 2)}</span>
          </span>
          <span className="topbar__where">{placeLabel(unit, slot)}</span>
        </div>
      </div>

      {osi === null ? null : (
        <div className="topbar__osi">
          <p className="console__ptitle">{osi}</p>
          <span className="topbar__chips" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7].map((layer) => (
              <i key={layer} data-on={unit.osiLayers.includes(layer) ? '' : undefined}>
                {layer}
              </i>
            ))}
          </span>
        </div>
      )}

      <div className="topbar__progress">
        <p className="console__ptitle">Track progress</p>
        <span className="topbar__places" aria-hidden="true">
          {entries.map((e) => (
            <i
              key={e.key}
              data-state={e.key === currentKey ? 'current' : finished.has(e.key) ? 'done' : e.available ? 'ready' : undefined}
            />
          ))}
        </span>
        <span className="topbar__count">{`${finished.size} of ${total} complete`}</span>
      </div>

      <div className="topbar__tools">
        <ThemeSwitch />
      </div>
    </header>
  );
}

export default TopBar;
