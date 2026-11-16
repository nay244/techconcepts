# D13c / B15c: the spec review's holes and attack cases (job 14, 2026-11-15)

The reviewer's report (Opus) on `prototypes/d13-load-balancers.md`, its prototype and its two SVGs. Holes are named H1, H2…; the orchestrator numbers errata.

**Verdict: HOLES.** A builder would have to guess in H1, H2, H3 and H12, and checks 4, 17 and 20 cannot pass as written (H9, H10, H11). The patch itself is sound: the files, the hashes, the types and the timings all hold (below).

## Errata (the orchestrator, Opus 5.5, 2026-11-15)

B15c applies Load Balancers' Appendix A after Packets' and Switch's. Each hole below is an erratum, numbered by the orchestrator; the builder takes the hole's own answer unless a line here rules otherwise. Case lists below are unchanged.

- **E25** = H1: the answer as written under H1.
- **E26** = H2: the proposed answer: the figure's words stay fixed, as dhcp's do, and the lesson's test (and the fixture's) binds them: `initialRows`' addresses equal the callouts' by server; every request's Destination is `203.0.113.80:80`; every check's Destination and every answer's Source is its server's address with `:80`.
- **E27** = H3: the proposed answer, one issue each, on `figure === 'pool'`: `skip` only on a message from a reader, its arg not the message's `to`; `no-answer` only on a note; no `outcome` but delivered. `define.ts` changes for it, as Switch's patch does for its figure.
- **E28** = H4: the answer as written under H4.
- **E29** = H5: as written: keep every entry in each of the ten shared lists.
- **E30** = H6: the answer as written under H6.
- **E31** = H7: the answer as written under H7.
- **E32** = H8: the answer as written under H8.
- **E33** = H9: the answer as written under H9.
- **E34** = H10: the answer as written under H10.
- **E35** = H11: the answer as written under H11.
- **E36** = H12: the answer as written under H12.
- **E37** = H13: the answer as written under H13.

## What was measured

The branch `job14/batch` at `94c96b8` was exported with `git archive` to a scratch folder (outside the repo). The three Appendix A patches were applied there in the order a, b, c, and nothing was applied in the worktree.

- **Packets (a):** `git apply` applies cleanly.
- **Switch (b):** needs `--3way`, with one conflict, in `spots.ts`.
- **Load Balancers (c):** `git apply --check` fails at `spots.ts:357`. `git apply --3way` merges `figures.test.ts` cleanly and conflicts in **10 files**, every one of them a list that Switch extended first (H5).
- **After keeping every entry:**
  - `drawPool().svg + '\n'` equals `d13-load-balancers-part-pool.svg` byte for byte;
  - `spot('load-balancers') + '\n'` equals `d13-load-balancers-spot.svg` byte for byte;
  - the viewBox is `-32 -49 589 335`;
  - `spot:load-balancers` hashes to `6684065e…d427`, as in the patch.
- **Existing figures and spots.** Hashed before and after patch c: the 6 figures (dhcp, subnet, firewall, net-map as B15a leaves it, osi, switch) and the 16 other spots are unchanged.
- **Tests.**
  - `astro check`: 0 errors.
  - `vitest`: 2,057 pass and 2 fail, both B15a's: `spot:packets` is not yet in `EXPECTED`, and `drawNetMap` does not yet match its mockup. Nothing of c's fails.
- **Driver size.** `drivers/pool.ts`, bundled and minified with motion and tables external, is 4,536 B (2,091 gzipped). Switch's is 2,447 and dhcp's 2,257.
  - Lesson JS today is 103.8 KB of the 200 KB budget (`check-budgets.mjs` on the main folder's `dist/`), so the budget has room.
  - The driver takes only types from `art/scenes/pool`.
- **Driver behaviour.** Probed in jsdom on the merged tree:
  - §3.3's durations sum to the step lengths 2,950, 5,900, 8,100, 11,850 and 8,950;
  - an aborted play followed by `show` leaves no tag, trail or skip mark;
  - after a play, `show` differs from a fresh `show` only in how the style attribute is written (the show sweep normalises that);
  - the drawn SVG is the Overview: six `data-check="ok"`, three "Healthy" and every chip at opacity 0.
- **The word "proxy".** It is in no generated SVG, nor in `pool.ts`, `pool.css`, `pool-parts.ts` or `drivers/pool.ts`.

## Holes

Worst first. Each says whether it has one right answer or needs a ruling.

**H1. B15c has no lesson page and its patch has no fixture: what it tests where. One right answer (job 13's E10 and E11, and Switch's own patch).**

The spec's §5.7 says "the lesson's own tests come with the lesson". But checks 4 to 16 need the scene's events, and the lesson (L27-b) is written after B15c. Switch's patch ships `src/content/switch-fixture.ts`; this one ships nothing. Two smaller points:

- §3's "`scene.figure: 'pool'`" cannot be written: `figure` is a field of the lesson (`schema.ts:411`), and `unitSceneSchema` is strict.
- The spec never says `views`. The prototype has no Network / Sequence switch, and §4.2's 347 and 275 are measured without a stage-head switch.

**Answer:**

- B15c adds a test-only `src/content/load-balancers-fixture.ts`.
  - It is built as `switch-fixture.ts` is: a lesson with `figure: 'pool'` and this one unit.
  - It copies the prototype's `LB` data whole: the five steps' events, cells, log rows, legend, table definition and update order (`d13-load-balancers.html`, the script after line 307).
  - The unit has `views: ['network']`.
  - Only §7's design copy, the addresses and the cell words are pinned; no placeholder word is.
- B15c proves checks 1, 4 to 13, 15, 16, 18, 19's spot and hash, and 20, as unit tests on that fixture (the cases below).
- The checks that need a page go to `e2e/load-balancers.spec.ts` in B16, on the real lesson: 2, 3, the browser half of 9, 14's glyphs, 16's no-slide, 17, and 19's track card.
- `NO_SEQUENCE` gains `load-balancers` there too.

**H2. The figure's own words never reach the claim sheet. Needs the orchestrator's ruling. The proposed answer below keeps the patch as it is.**

`sheet.ts` lists the lesson's items and their cues. It leaves out the lesson's `figure` and everything drawn into it. These fact-stating words are fixed in `pool.ts`, so no fact-checker sees them:

- the balancer callout "Load balancer · example.net · 203.0.113.80", and the same address on its face;
- "Server A · 10.0.0.11" (and B and C);
- the engraving "ONE ADDRESS · THREE SERVERS";
- "THE INTERNET" under the laptops and "THE POOL";
- the aria-label ("whose address all three use"; "two lamps for its last two health checks").

The cues are on the sheet: `skip` and `no-answer` carry only a server letter, and the Health words come from table rows.

dhcp, firewall and net-map callouts are fixed the same way. osi alone routes its words through `scene.labels` (`words`). The L27-w read covered these words before the gate.

**Proposed answer:** keep them fixed, as dhcp does. Bind the lesson to them by test (`lessons/load-balancers.test.ts`, the author's), so that the sheet's words and the figure's cannot drift apart:

- `initialRows`' Address cells equal the callouts' `10.0.0.11` to `10.0.0.13`, by server;
- every request's log Destination is `203.0.113.80:80`;
- every check's Destination, and every answer's Source, is its server's address with `:80`.

The fixture test asserts the same on the fixture. The other route, labels as osi has them, changes the drawing and needs the designer.

**H3. The validator lets a cue sit where the driver ignores it. Needs the orchestrator's ruling; proposed answer below.**

`define.ts` checks only a cue's name and its arg (`args`). So each of these validates, and then does nothing on the figure:

- `skip` on a note, a check (`balancer>b`) or an answer;
- `skip: c` on a request to `c`, a server skipped and picked at once;
- `no-answer` on a message;
- `outcome: 'dropped'` with `dropAt` (or `'blocked'`) on any pool message, which rides to its end.

The duration for each is the plain event's. Switch's patch closes the same class for its figure (`define.ts`, "cue … is for a message; a note sends no frame").

**Proposed answer, one issue each, on `figure === 'pool'`:**

- `skip` only on a message whose `from` is a reader;
- its arg differs from `to`;
- `no-answer` only on a note;
- no `outcome` other than delivered.

The other choice is to keep §5's "define.ts not changed". Then each case below becomes an "accepted, and the figure draws nothing extra" test.

**H4. A Health word that is an `Object.prototype` key crashes `show`. One right answer.**

§3.2 says any other word leaves the lamps dark. In `paint`, `POOL_HEALTH_WORDS[word]` on a plain object returns a function for `constructor` and `toString`, and `Object.prototype` for `__proto__`. Then `shown.lamps[n]` throws (measured: "TypeError: Cannot read properties of undefined (reading '0')").

`ScenePanel` calls `d.show(scene)` outside `playSafely`, so the throw escapes the React effect.

**Answer:** `Object.hasOwn(POOL_HEALTH_WORDS, word) ? POOL_HEALTH_WORDS[word] : undefined`. `define.ts:178` guards cue names the same way.

**H5. Appendix A does not apply after a and b; ten conflicts, each with one right answer: keep every entry.**

Each conflict is a list Switch extended. The resolution, applied and measured, gives the byte-equal SVGs above:

- `spots.ts`: keep `packetsSpot` and `switchSpot`, then `loadBalancersSpot`. `SPOTS` and `DRAW` end with `…, 'tcp-udp', 'packets', 'switch', 'load-balancers'` and `…, packets: packetsSpot, switch: switchSpot, 'load-balancers': loadBalancersSpot`.
- `index.test.ts:10` and `parts.test.ts:7`: `['dhcp', 'firewall', 'net-map', 'osi', 'pool', 'subnet', 'switch']`.
- `types.ts:2`: `'dhcp' | 'subnet' | 'firewall' | 'net-map' | 'osi' | 'switch' | 'pool'`. `schema.ts:37`: the same order in the enum.
- `scenes/index.ts`, `drivers/index.ts`, `test-fixtures.ts` and `lib/figures.ts`: the `switch` line, then the `pool` (or `'load-balancers'`) line.
- `parts.ts`: both imports. The `switch` block is closed with its own `layers: [], board: false, start: false, },` before the `pool` block. The 3-way merge shares that tail, so keeping "ours then theirs" naïvely leaves `switch` unclosed.
- `figures.test.ts`: merges cleanly. `spot:packets` is B15a's.

**H6. §2.7 says the skip mark shows "for 700 ms"; the approved driver shows it longer. One right answer: the driver.**

`play` shows `#pl-skip-<s>`, waits 700, lights the pick, waits 450, rides to the server and rests 300. Only then does `clearMoving()` hide the mark. Measured under reduced motion at 1×: on at 100, 800, 1,000 and 1,300 ms, off at 1,600.

The 700 ms is the wait before the pick, not the mark's life. Check 9 ("gone when the next event starts") agrees with the driver. A build that hides the mark at 700 ms drifts from the prototype.

**H7. §5.7's test of `data.legs` says "where §3.2 says"; §3.2 says nothing about legs. One right answer (measured; the `PoolSceneData` comment):**

- Each reader leg has 8 points. It starts at its screen, at `[-75, 47, 29]` (laptop), `[-13, 47, 29]` (reader2) and `[49, 47, 29]` (reader3), and ends at the balancer's top, `[13, -14, 18.2]`.
- Each server leg has 8 points. It starts at `[13, -14, 18.2]` and ends over its chips, at `[-31, -59, 54.6]` (a), `[23, -59, 54.6]` (b) and `[77, -59, 54.6]` (c).
- `O` is `[224, 141.86]`.

**H8. Check 20's "before and after the patch" has the wrong baseline. One right answer.**

B15a changes `drawNetMap()`, so "the same svg before and after" holds only against the tree after B15b. **Answer:** hash `drawFigure(id)` (svg and data) for dhcp, subnet, firewall, net-map, osi and switch, and every spot but `load-balancers`, on `job14/batch` after B15b, before patch c. Patch c changes none of them (measured).

**H9. Check 4's "no light" meets three lights that are always on. One right answer.**

Each server's first drive bay carries `<circle class="lm-led on">`, so the figure has 3 `lm-led on` at every moment (measured). Check 4 means the balancer.

**Answer:** at the Overview no `#pl-pick-*` has `on`, no `#pl-glow-*` has `on`, every `#pl-quiet-*` is at opacity 0, and the three bay lights stay on throughout.

**H10. Check 17's "screens look the same in both themes" cannot hold. One right answer.**

The screen glow is `--lit-b`: `#d9541c` light, `#f0702e` dark. The pick lights are `.lm-led.on`, `--lit-a`. dhcp and net-map use the same tokens for the same parts.

**Answer:** the lamps are `#3ddc7c`, `#ff4f4f` or `#2e343e` in both themes, from `.pl`'s own variables; the callouts and Health words follow the theme; the glows and pick lights follow the lumen lit tokens, as every figure's do.

**H11. `types.ts` comments after the merge leave out Switch. One right answer.**

Patch c rewrites them to "(osi and pool)" and "(dhcp, osi and pool)", but Switch has `args` and `routes` too. **Answer:** "(osi, switch and pool)" and "(dhcp, osi, switch and pool)".

**H12. "At its Nth event" means two things. One right answer.**

- Checks 8 and 11 mean the settled moment after N events have applied: show-sweep `{ p, n: N }`.
- Check 9 means while event N plays.

**Answer:** say so, as the cases below do.

**H13. The figure goes dark without a word. One right answer (DHCP's precedent, `lessons/dhcp.test.ts:44, :52`).**

The figure goes dark, or draws no tag, in any of these cases, and nothing refuses it:

- a Health cell outside the four words (`healthy`, `Healthy `, `1 check failed`);
- a column keyed other than `health` or `requests`;
- a table id other than `pool`;
- a key other than A, B or C;
- a tag other than REQUEST, CHECK or OK.

**Answer:** the fixture test now, and the lesson's test (the author's), assert:

- the panel is a table `pool`, keyed `server`, with the column keys `server`, `address`, `health` and `requests`;
- the initial rows are A, B and C;
- every Health cell, initial or updated, is a key of `POOL_HEALTH_WORDS`;
- every Requests cell is a whole number from 0 to 4;
- every message's tag lower-cased is `request`, `check` or `ok`.

## What the build can break

- **Red after patch c, by design:**
  - none of c's own tests;
  - B15a's two (`spot:packets`, `drawNetMap`) until B15a's own work lands.
- **Green, to keep green:**
  - `parts.test.ts` "every figure's parts are well formed" with `pool`;
  - `index.test.ts`'s role, aria-label and no-grain loop;
  - the `figures.test.ts` hash table;
  - every existing lesson's validation (`FIGURE_PARTS` gains a key and no rule changes, unless H3 is ruled in);
  - `check-budgets.mjs`.
- **Shared files:** the 10 of H5. B15c is their third writer, after B15a and B15b.

## Attack cases

Each is a test. "Fails when" says what wrong build turns it red.

### Files, patch and registration (checks 18, 19, 20; H5, H8, H11)

- **F1.** `readFileSync('prototypes/d13-load-balancers-part-pool.svg')` equals `drawPool().svg + '\n'`, and the spot file equals `spot('load-balancers') + '\n'`, whole.
  - Fails when one coordinate, one class or the `’` in an aria-label changes.
- **F2.** `figures.test.ts` `EXPECTED['spot:load-balancers']` is `6684065e6029fb918e792c3b8daf2d2847ab835c7ea535bc29124a341119d427`. `lessonFigure` of a summary with slug `load-balancers` returns `spot('load-balancers')`.
  - Fails when `src/lib/figures.ts` lacks the line.
- **F3.** The spot has exactly one `data-lit`, one `lm-led on`, 2 `lm-rule-no` (B's) and 4 `lm-rule-ok`. Its aria-label equals §6's.
- **F4.** `figureIdSchema.options`, sorted, equals `Object.keys(FIGURE_PARTS)`, sorted, which equals `Object.keys(DRIVERS)`, sorted: the seven ids of H5. `drawFigure('pool').svg` starts `<svg data-figure="pool"`.
  - Fails when one list drops `switch` in the merge.
- **F5.** H8's hashes of the six other figures and sixteen spots equal the values recorded before patch c.
- **F6.** `/proxy/i` matches none of: `pool.ts`, `pool.css`, `pool-parts.ts`, `drivers/pool.ts`, `drawPool().svg`, `spot('load-balancers')` and the fixture file. In the lesson's test it also matches nothing in the lesson file.
- **F7.** `drivers/pool.ts` takes only `import type` from `art/scenes/pool` (net-map's test at `net-map.test.ts:692`), and `pool-parts.ts` has no `import`.
  - Fails when the driver imports `POOL_DESCRIPTION`, which would pull the drawing kit into every lesson page.
- **F8.** `npm run build`'s budget table shows every lesson page's JS ≤ 200 KB.
- **F9.** `types.ts`'s two comments read as H11.

### The drawing (`src/art/scenes/pool.test.ts`; §5.7, H7, H9)

- **D1.** Every id the driver reads appears exactly once:
  - `pl-tag-request`, `pl-tag-check`, `pl-tag-ok` and `pl-trail`;
  - `pl-glow-laptop`, `pl-glow-reader2` and `pl-glow-reader3`;
  - for each of a, b and c: `pl-pick-`, `pl-quiet-`, `pl-skip-`, `pl-lamp-<s>-0`, `pl-lamp-<s>-1`, `pl-health-`, `pl-health-t-`, and `pl-chip-<s>-0..3` and `pl-chip-lit-<s>-0..3`.

  The 59 `pl-` ids are unique.
  - Fails when `POOL_CHIPS` changes without the drawing.
- **D2.** The viewBox is `-32 -49 589 335`; the aria-label equals `POOL_DESCRIPTION`, which equals §7's words.
- **D3.** `data.legs` has the six keys; its ends and `O` are as H7 says.
- **D4.** No JavaScript, the drawn state is the Overview:
  - every `pl-lamp` has `data-check="ok"`;
  - every `pl-health` has `data-health="healthy"`, no `data-turning`, and the text "Healthy";
  - every `pl-chip`, `pl-chip-lit`, tag, trail, `pl-quiet` and `pl-skip` has `opacity:0`;
  - no `pl-glow` or `pl-pick` carries `on`.
  - Fails when the drawing leaves a lamp dark, or one chip showing, for the driver to fix.
- **D5.** `pool.css` declares `.pl { --fixed-allow: #3ddc7c; --fixed-deny: #ff4f4f; }`, as `firewall.test.ts:296` checks `.fw`. `tokens.ts` gains no token.

### Validation (check 1; H3), with the real `FIGURE_PARTS`, in `define.pool.test.ts`

- **V1.** The fixture's `checkStructure` returns `[]`, and every existing lesson still validates.
- **V2.** Each of these gives exactly one issue:
  - a message `laptop>balancer`;
  - `a>b`;
  - `a>laptop` (no reply to a reader: ruling 11);
  - `balancer>laptop`;
  - `reader2>balancer`;
  - `skip: d` on a request;
  - `no-answer: balancer` on a note;
  - `skip` with no arg.
- **V3.** These pass:
  - all nine reader-to-server routes;
  - `balancer>c`;
  - `c>balancer`;
  - `skip: a` on `reader3>c`;
  - `no-answer: c` on a note.
  - Fails when the routes list is built with the balancer named (`laptop>balancer>a`) or the readers dropped.
- **V4.** Per H3's ruling, each of these gives one issue, or (if define.ts stays as is) passes and plays nothing extra (no `#pl-skip-*` and no `#pl-quiet-*` at opacity 1 during or after its play, and its duration that of the plain event):
  - `skip: b` on a note;
  - `skip: b` on `balancer>a`;
  - `skip: c` on `laptop>c`;
  - `no-answer: b` on `balancer>b`;
  - `outcome: 'dropped', dropAt: 0.5` on `laptop>a`.

### Driver: duration (`src/scenes/drivers/pool.test.ts`; §3.3)

- **T1.** The durations:
  - a table event: 0;
  - a note with `no-answer`: 1,300; a note without: 200;
  - a request: 2,950; with `skip`: 3,650; with `fast`: 1,950;
  - a check and an answer: 1,500 each; with `fast`: 1,000.
  - Fails when `fast` also halves the pick, or the skip time is added to a check.
- **T2.** The fixture's per-step sums are 2,950, 5,900, 8,100, 11,850 and 8,950.

### Driver: show, from the table (checks 4, 6, 7, 8, 10, 11, 12; H4, H9)

The fixture is shown at moments `{ p, n }` (`show-sweep.ts`'s `viewAt`).

- **S1. Overview (check 4).** As D4. Also:
  - no `#pl-pick-*.on`;
  - no `#pl-quiet-*` at opacity 1;
  - the three bay `lm-led on` present (H9).
- **S2. Each health word (§3.2).** For B:

  | Health word | Lamps | `data-health` | `data-turning` | `.pl-health-t` |
  |---|---|---|---|---|
  | `Healthy` | ok, ok | healthy | absent | "Healthy" |
  | `1 check missed` | ok, miss | healthy | present | "1 check missed" |
  | `Unhealthy` | miss, miss | unhealthy | absent | "Unhealthy" |
  | `1 check passed` | miss, ok | unhealthy | present | "1 check passed" |

  - With `healthy`, `Healthy `, `constructor`, `toString` or `__proto__`: no `data-check` on either lamp, no `data-health`, the text "", and **no throw** (H4).
  - With B's row removed: the same, and no chips.
- **S3. Chips.** Requests `0`, `1`, `4`, `7` and `x` show 0, 1, 4, 4 and 0 chips (`.pl-chip` at opacity 1, lowest first). `-1` shows 0.
- **S4. Step 1 settled (check 6).**
  - `#pl-glow-laptop.on` and `#pl-pick-a.on` only;
  - `#pl-chip-lit-a-0` at 1 and no other lit chip;
  - one chip on A;
  - no tag or trail showing.
- **S5. Step 3, n = 5 (check 8).**
  - B: lamps ok, miss; `data-health="healthy"`, with `data-turning`;
  - `#pl-quiet-b` at 1 (the note before is still the latest of the step);
  - the panel state's `missed` is `[]`.
- **S6. Step 3 settled (check 7).**
  - B: lamps miss, miss; `data-health="unhealthy"`, without `data-turning`;
  - `#pl-quiet-b` at 1; `missed` is `['B']`;
  - 9 log rows, the last with info "No answer from B again: two in a row";
  - no glow and no pick on.
  - Fails when `landed` is taken from the table event, which would drop the ring.
- **S7. Step 4 settled (check 10).**
  - Chips A 3, B 1, C 2;
  - B unhealthy and `missed` is `['B']`, after A's and C's updates;
  - `#pl-quiet-b` at 1;
  - 14 log rows.
  - Fails when an update to A or C clears every mark.
- **S8. Step 5, n = 3 (check 11).**
  - B: lamps miss, ok; `data-health="unhealthy"`, with `data-turning`; the text "1 check passed";
  - `missed` is `['B']`.
  - Fails when the fixture drops §2.3's `miss: true`.
- **S9. Step 5, n = 6.** B Healthy, ok, ok; `missed` is `[]`.
- **S10. Step 5 settled (check 12).**
  - All six lamps ok; every line "Healthy"; `missed` is `[]`;
  - chips A 3, B 2, C 2;
  - `#pl-pick-b.on` and `#pl-glow-reader2.on` only;
  - `#pl-chip-lit-b-1` at 1;
  - 19 log rows.
- **S11. The show sweep.** `showSweep(fixture)` passes.
  - Fails when `clear()` forgets the lit chips or the ring.

### Driver: play (checks 5, 9, 15, 16; H6, H12)

Run under reduced motion with real `wait`s at a high speed, or with fake timers and stubbed animation frames, as `dhcp.test.ts` does.

- **P1. Step 1's request (check 5).** During its play:
  - `#pl-glow-laptop.on` from the start;
  - the REQUEST tag at opacity 1;
  - `#pl-pick-a` on only after the first ride.

  After the play:
  - the tag and the trail are at opacity 0.

  After the table event's play:
  - `#pl-chip-lit-a-0` at 1 and one chip on A.
- **P2. Step 4's skip (check 9, while event 3 plays).**
  - `#pl-skip-b` is at 1 while the tag waits on the balancer, and `#pl-pick-c` is not yet on.
  - After 700 ms (÷ speed) `#pl-pick-c` is on and `#pl-skip-b` is still at 1 (H6).
  - When the play resolves, `#pl-skip-b` is at 0.
  - Fails when the pick lights before the skip wait, or the mark is left for `show` to clear.
- **P3. A check and its answer.**
  - The CHECK tag's first transform is `translate(<onScreen(legs.b[0])>)` (the balancer's top). Fails when a check starts at a reader.
  - The answer's last transform is at `legs.a[0]`, the balancer's top: no tag rides on to a reader (ruling 11).
  - No `#pl-glow-*` and no `#pl-pick-*` turns on during either.
- **P4. A `no-answer` note.** `#pl-quiet-b` ends at 1. Under reduced motion it is at 1 at once.
- **P5. Placed before shown.** At the moment a tag's opacity becomes 1, its `transform` is already its leg's first point.
  - Fails when it shows a frame at the plate's origin.
- **P6. The trail.** Under reduced motion the trail's points are the whole leg, each `onScreen(p) + O`.
  - Fails when `O` is left out: the trail is drawn 224 px left of the tag.
- **P7. An abort (check 15).** For each of these:
  - (i) mid first ride;
  - (ii) during the skip wait;
  - (iii) during the pick;
  - (iv) mid second ride;
  - (v) during the ring.

  Abort, await the play, then `show(view before)`. The figure's markup equals a fresh driver's `show` of the same view (styles normalised as in `show-sweep.ts`). After the abort, the play writes nothing more.
- **P8. Reduced motion (check 16).** For each step, play every event under reduced motion, then `show(view at the step's end)`. The result equals a fresh `show`. No `animate` frame other than `frame(1)` is called.
- **P9. A tag the figure lacks.** A message with tag `REPLY` plays nothing and resolves. Its duration is still the route's.

### The claim sheet (H2)

- **C1.** `claimSheet(fixture, registry)`:
  - step 4's item content holds the event with `cues: [{ cue: 'skip', arg: 'b' }]`;
  - step 3's holds both `no-answer: b` notes;
  - step 5's holds the `1 check passed` update with `miss: true`;
  - `fast` appears in no item.
  - Fails when the skip is worked out by the driver from the table instead of carried as a cue.
- **C2.** Per H2: the addresses in `initialRows`, the requests' Destination `203.0.113.80:80`, and each check's and answer's `<server address>:80` agree with the callouts in `drawPool().svg`.

### The log and panel (checks 13 and 14), in `LogPanel.test.tsx` and `TablePanel.test.tsx`

- **L1.** Every check row has Source `—` and Destination `10.0.0.1x:80`. Every answer row has Source `10.0.0.1x:80` and Destination `—`. Every Time and Size is `—`. Protocol is `HTTP` on messages and `—` on notes.
- **L2.** The legend deep-equals request "A reader’s request", control "Health check", response "Answer to a check", note "No answer in time", in that order.
  - Fails when `eventLog()`'s Request and Reply legend is kept.
- **L3.** The glyphs: a request a square, a check a diamond, an answer an arrow, a note the "i" (by `data-glyph`).
- **L4.** The table at step 3's end: B's row has `data-miss` and the word "unhealthy". At step 5, n = 3, it still has both. At step 5, n = 6, it has neither.

### Pages (B16's `e2e/load-balancers.spec.ts`; checks 2, 3, 9, 14, 16, 17, 19)

- **E1. At 1440 × 900, dark and light.**
  - `.stage__figure` is 733 wide and 347 ± 4 tall at every step;
  - the table panel's `scrollHeight ≤ clientHeight`;
  - the run ends with S10's figure state and 19 log rows.
- **E2. At 375 × 812.**
  - `.stage__figure` is 375 wide and 275 ± 4 tall on each phone tab;
  - the page and each tab have `scrollWidth ≤ clientWidth`;
  - so does the Card art route.
- **E3. Reduced motion.** The run's per-step times match T2 within the console's tolerance. No tag's `transform` takes more than two distinct values in one ride.
- **E4. Both themes (H10).**
  - Each lamp's computed fill is the same in both themes;
  - `.pl-health-t`'s computed fill differs between them;
  - "Unhealthy" is computed bold in `--blocked`.
- **E5. The track page.** Stop 19 shows the spot, "Load Balancers", "One address, many servers" and Start, and "Lesson 20 is coming soon" follows it.
- **E6. JavaScript off.** The lesson page shows D4's figure state and the table's three Healthy rows, with no console error.
- **E7. Keyboard and screen reader.**
  - The figure is one `role="img"` with §7's label;
  - each table event's summary reaches the live region;
  - the "unhealthy" mark is read as text in B's row, not as colour alone.

## Notes

- The figure has 15 `data-lit` parts: 3 tags and 12 lit chips. A naïve "one lit part" check belongs to the spot, not the figure.
- `covers.ts:309` uses the id `pl-clip` in a cover. No pool id collides with it; a future `pl-clip` in the pool would.
- Each health line sits at 8.3 px at 375, which is §4.2's accepted size. Firewall's callouts sit at 7.5.
- Patch c adds `pool.css` to the CSS of every page that imports `drawFigure`. It is small, but every figure adds one.
- The 3-way merge needs the base blobs (`5f9625b` and the rest). `git apply --3way` finds them on `job14/batch` and in any export of it.
