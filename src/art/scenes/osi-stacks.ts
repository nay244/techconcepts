// The OSI Model figure's places, rides and word slots, apart from its drawing (osi.ts), so the lesson validator reads
// them without drawing the figure. The figure stands three stacks of layer blocks on one plate: the sending laptop's
// seven, a router's three (it reads only the lowest three) and the web server's seven.

/** Each place on the figure and how many layer blocks its stack has, from layer 1 up. */
export const OSI_STACKS = { laptop: 7, router: 3, server: 7 } as const;

/** The two cable rides a message may take, as `from>to`: from the laptop to the router, then on to the server. */
export const OSI_ROUTES = ['laptop>router', 'router>server'] as const;

const LAYER_NUMBERS = [1, 2, 3, 4, 5, 6, 7] as const;

/**
 * The words the figure leaves to the lesson, by their `scene.labels` key: each layer's name (the figure engraves its
 * number), each callout's name and the line under it, and the plate's engraving.
 */
export const OSI_WORDS: readonly string[] = [
  ...LAYER_NUMBERS.map((n) => `layer-${n}`),
  ...Object.keys(OSI_STACKS).flatMap((place) => [place, `${place}-sub`]),
  'plate',
];

/**
 * The args each text cue takes: `layer` lights one block, named `<place>:<n>`; `peer` lights layer `<n>` in every
 * stack that has it and shows its peer lines.
 */
export const OSI_CUE_ARGS: { layer: string[]; peer: string[] } = {
  layer: Object.entries(OSI_STACKS).flatMap(([place, count]) => LAYER_NUMBERS.filter((n) => n <= count).map((n) => `${place}:${n}`)),
  peer: LAYER_NUMBERS.map(String),
};
