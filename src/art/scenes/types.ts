/** The scene figures a lesson can be drawn on. Each one is drawn at build time and moved by its own driver. */
export type FigureId = 'dhcp' | 'subnet' | 'firewall' | 'net-map';

/** What a lesson may name on a figure. The lesson validator checks every event against these. */
export interface FigureParts {
  /** Ids a message's `from`/`to` and a party's `place` may name. */
  places: readonly string[];
  /** Cue names and what each takes: a 'flag' cue takes no arg, a 'text' cue needs one. */
  cues: Readonly<Record<string, 'flag' | 'text'>>;
  /** Swappable layers a unit's scene may show (net-map only). */
  layers: readonly string[];
  /** True when the figure accepts a note's `board` (subnet only). */
  board: boolean;
  /** True when the figure's driver shows a scene's `start`, the cues in place as a unit starts (net-map only). */
  start: boolean;
}

/** A figure drawn at build time: its SVG markup, and the data its driver reads (JSON). */
export interface DrawnFigure {
  svg: string;
  data: unknown;
}
