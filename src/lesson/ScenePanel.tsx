import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { FigureId } from '../art/scenes/types';
import type { Unit } from '../content/schema';
import type { PlaybackState } from '../engine/playback';
import type { DerivedState } from '../engine/timeline';
import { sceneViewOf, type PanelMark, type SceneDriver } from '../scenes/driver';
import { DRIVERS } from '../scenes/drivers';
import { SequenceView } from '../scenes/SequenceView';
import { UnitPanel } from './panels/UnitPanel';

export interface ScenePanelProps {
  unit: Unit;
  /** The lesson's figure, drawn at build time: the page's static slot, holding one `svg[data-figure]`. */
  figure: ReactNode;
  /** What the figure's driver reads at runtime (`DrawnFigure.data`). */
  figureData: unknown;
  derived: DerivedState;
  playback: PlaybackState;
  reducedMotion: boolean;
}

type View = 'network' | 'sequence';

const NO_MARKS: readonly PanelMark[] = [];

/**
 * The scene: its title, the Network / Sequence switch when the unit has both
 * views, the figure (or the Sequence view), and the unit's panel under it.
 *
 * The figure is the page's static markup; its driver moves it. On every change
 * the driver shows the settled scene for the derived state. While an event is
 * pending, the driver plays it in the wait that playback makes, and each new
 * playback state (a tick, a move, a pause, a new speed) aborts the running play
 * first, because it also restarts that wait. The Sequence view leaves the
 * hidden figure alone; coming back to Network shows it settled as it now stands,
 * and the event in flight is not replayed.
 */
export function ScenePanel({ unit, figure, figureData, derived, playback, reducedMotion }: ScenePanelProps) {
  const titleId = useId();
  const [chosen, setChosen] = useState<View>('network');
  const hasSequence = unit.scene.views.length > 1;
  const view: View = hasSequence ? chosen : 'network';
  const [marks, setMarks] = useState<readonly PanelMark[]>(NO_MARKS);

  // The figure's driver, made once the figure is on the page and let go when it leaves.
  const figureBox = useRef<HTMLDivElement>(null);
  const driver = useRef<SceneDriver | null>(null);
  useEffect(() => {
    const svg = figureBox.current?.querySelector<SVGSVGElement>('svg[data-figure]');
    const id = svg?.getAttribute('data-figure');
    if (svg == null || id == null || !Object.hasOwn(DRIVERS, id)) return;
    const made = DRIVERS[id as FigureId].create(svg, figureData);
    driver.current = made;
    return () => {
      driver.current = null;
      made.destroy();
    };
  }, [figureData]);

  const scene = useMemo(() => sceneViewOf(unit, derived), [unit, derived]);
  // `pendingEvent(lesson, playback)`, from what is already derived: `derived.events` is the step's events.
  const pending = playback.mode === 'step' || playback.mode === 'run' ? (derived.events[playback.eventIndex] ?? null) : null;

  // The playback state the latest play was started for. A play starts once per state, so a return to Network does not replay.
  const playedFor = useRef<PlaybackState | null>(null);
  useEffect(() => {
    const isNew = playedFor.current !== playback;
    playedFor.current = playback;
    const d = driver.current;
    if (d === null || view !== 'network') return;
    d.show(scene);
    if (pending === null || !isNew) return;

    const controller = new AbortController();
    const { signal } = controller;
    void d.play(pending, scene, {
      speed: playback.speed,
      reducedMotion,
      signal,
      onMark: (mark) => {
        if (!signal.aborted) setMarks((list) => [...list, mark]);
      },
    });
    return () => {
      controller.abort();
      // The event's marks go with its play: it has been applied, or the learner has moved on.
      setMarks(NO_MARKS);
    };
  }, [view, scene, playback, pending, reducedMotion]);

  // The row that has just played, if this step played it (as the log's fresh row).
  const latest = derived.log.at(-1);
  const current = latest !== undefined && derived.events.some((e) => e.id === latest.eventId) ? latest : null;

  return (
    <section className="console__panel console__stage" aria-labelledby={titleId}>
      <div className="stage__head">
        {hasSequence ? (
          <div className="stage__views" role="group" aria-label="View">
            <button type="button" aria-pressed={view === 'network'} onClick={() => setChosen('network')}>
              Network
            </button>
            <button type="button" aria-pressed={view === 'sequence'} onClick={() => setChosen('sequence')}>
              Sequence
            </button>
          </div>
        ) : null}
        <h2 id={titleId} className="console__ptitle stage__title">
          {unit.scene.title}
        </h2>
      </div>
      <div className="console__scene">
        <div ref={figureBox} className="stage__figure" hidden={view !== 'network'}>
          {figure}
        </div>
        {view === 'sequence' ? <SequenceView parties={unit.scene.parties} rows={derived.log} current={current} /> : null}
      </div>
      <UnitPanel panel={unit.scene.panel} derived={derived} marks={marks} />
    </section>
  );
}
