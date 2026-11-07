# Content Model Implementation Plan (direction §10 task 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give TechConcepts a content model that cannot hold an unsourced claim: a primary-source registry, citations on every Learn statement, Go-deeper paragraph, Practice explanation and glossary definition, Watch-to-Learn traces, track types over shared lessons, per-track limits, pinned objective mapping, progress per lesson, and no time estimate anywhere.

**Architecture:** The runtime `Lesson` type becomes the cited shape (statements, paragraphs, citations, backing). New lessons are written against it and validated by a strict `defineLesson`. The four ready lessons keep today's authoring shape on a closed legacy path (`defineLegacyLesson`), which lifts them into the runtime shape with empty citations, until §10 tasks 4–6 migrate them. Tracks become `concept` or `certification`, carry their own limits, and reference lessons that live once in `src/content/lessons/`. Progress moves to `techconcepts:v2`, keyed by lesson slug, and absorbs `techconcepts:v1` without losing a record.

**Tech Stack:** Astro 7, React 19 islands, TypeScript, zod 4, Vitest 5, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-07-techconcepts-direction.md` (§3.1, §3.2, §4, §9, §10 task 2). The launch spec (2026-11-03) and redesign spec (2026-11-05) still hold except where its §9 changes them.

**Branch:** `feat/content-model`, cut from `main` at `9974f73`. Commit this plan as the branch's first commit.

## Owner rulings for this task (2026-11-07)

1. **Ready lessons use a legacy path.** How the Internet Works, Subnetting, DHCP and Firewalls keep today's shape and checks, on a closed list of exactly those four slugs that can only shrink. Every other lesson must pass the strict cited schema. §10 tasks 4–6 move each one across; task 6 deletes the legacy path. No visible change in between.
2. **Minute figures go in this task**, with the estimate. Pure removal, no redesign; replacement lines are drafts for the owner to approve in the PR. §10 task 7 keeps the rest of §6.
3. **One URL per track for a shared lesson:** `/<track>/<slug>` in every track that lists it, with a canonical link to the first track's URL (in `tracks` order). Today's URLs keep working; progress is shared.
4. **Overview text and facts, lesson summaries and Watch step facts follow the Watch rule:** each traces to a cited Learn statement in the same lesson, or is flagged as an analogy or as example data. Go deeper inside Watch steps cites directly, like all Go deeper.

## Calls made in this plan, for the owner's review (list them in the PR)

1. **Networking's Go-deeper limit is 90 words per block** (a step's Go deeper, or Learn's). There was no limit before; today's largest is 81 words (How the Internet Works, a step). The other Networking limits are today's numbers.
2. **Cited lessons have exactly one unit.** Lessons of several units exist only on the legacy path; How the Internet Works splits into 14 lessons in §10 task 6.
3. **The OSI badge's data** (cited layers, or `'spans'`) is in the schema now, because §3.1 makes it a cited field. Showing "Spans layers" waits for §10 task 7; until then a `'spans'` lesson shows no OSI chip, as an empty layer list does today.
4. **Every Practice option's feedback cites**, wrong answers included, since each is an answer explanation. Question prompts need no backing of their own.
5. **A cited lesson may not say "lesson N"**: a shared lesson's number differs per track. §10 task 7's "Builds on / Leads to" links replace numbered pointers.
6. **An override the lesson doesn't need fails the build**, so the owner's approval list (§4.4, §3.4) only ever holds real ones.
7. **Packet data stays allowed** (redesign spec §6.3), but in a cited lesson each packet needs backing like any scene value.
8. **Allowed hosts per source kind** are listed in code (below). Adding a vendor's documentation host is a reviewed one-line change.
9. **Progress v2 records the last track** as well as the last lesson, so "Continue" can return to the track the learner was in once Home shows several tracks. How the Internet Works' single v1 record is carried over as it is; §10 task 6 owns splitting it into 14.
10. **The glossary is a data model only, with no entries.** Entries arrive with the lessons that cite them (§10 tasks 4–6); the page and term links are §10 task 7.
11. **Learn's Go-deeper paragraphs are trace targets**, alongside Learn statements, because exam values (ports, addresses) live there.
12. **Copy drafts** for the time wording: see Task 1.

## Global Constraints

- **Accuracy first** (§2, §3.1): every Learn statement, Go-deeper paragraph, Practice answer explanation, glossary definition, OSI layer badge and exam objective mapping cites a primary source at the **exact section**. Watch steps and scene values carry no citation of their own but **trace to a cited Learn statement in the same lesson**; Watch never adds a claim. Example data (RFC 5737 / RFC 1918 addresses, `00:00:5E:00:53:xx` MACs) is labelled as an example and needs no backing. Analogies carry no citation and are flagged `analogy`.
- **Allowed sources** (§3.2): IETF RFCs, IEEE standards, IANA registries, NIST publications, official vendor documentation; official certification objective documents **only** for exam tags and objective mapping. Never blogs, Wikipedia, videos, forums, AI output or secondary summaries.
- **Untimed lessons** (§4.4): no time estimate in code, checks, UI or copy.
- **Limits per track** (§4.4): steps per lesson, facts per step, words per step, hook length, Go-deeper size (and today's other content limits) live in each track file. A lesson overrides a default only with a **one-line reason** in the lesson file.
- **Shared lessons** (§4.2): a lesson exists once; tracks only reference it; progress follows the lesson.
- **Track types** (§4.1, §4.3): concept tracks carry cert/role tags only; certification tracks map every lesson to objective numbers from the official objectives document, **version pinned** in the track data.
- **Storage**: only through `createSafeStorage()`; keys are `techconcepts:theme` and the progress key; nothing is sent anywhere. Every page works when storage throws.
- **No gamification**; Practice is never scored.
- **Voice** stays beginner-first, Go deeper closed by default, Watch step titles Title Case technical terms.
- **Desktop only** until §10 task 8: check at 1280×800 and 1440×900 (up to 1920), both themes.
- **Runtime dependencies** stay `astro`, `@astrojs/react`, `react`, `react-dom`, `zod`, `@fontsource/atkinson-hyperlegible-next`, `@fontsource/atkinson-hyperlegible-mono`.
- **Paths**: never write an absolute path containing the project folder's name into a tracked file.
- **Git**: never push to `main` or merge without the owner's explicit OK; ask before pushing the branch or opening the PR. No bare `git stash`. No `npx skills add`. No accounts or credentials.
- **Commits**: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`, ending with the `Co-Authored-By:` line the environment specifies.
- **Done** means `npx vitest run`, `npm run build` (astro check plus page budgets) and `npm run e2e` all pass; failures are reported as they are.

## Review Focus

1. **Progress saved by the live site survives the update**: every `techconcepts:v1` record, its position, its finished status and the last lesson, including when the v2 write fails (v1 must stay) and when a tab still running the old site writes v1 after migration (merged on the next load). Unlisted records (future lessons, How the Internet Works' single record) are carried, never dropped. → Task 6.
2. **Storage that throws during migration**: reading, writing or removing either key throws; the page renders, nothing escapes into the page, progress UI stays hidden. → Task 6.
3. **A trace that looks valid but isn't**: one pointing at an analogy statement, at a Watch step's Go-deeper paragraph, or at an id that exists only in another lesson must be rejected. → Task 5.
4. **A citation that looks primary but isn't exact**: `http:`, a non-primary host (Wikipedia), a URL outside the cited document, a hand-edited label, or a certification objectives document cited inside a lesson. → Tasks 2 and 5.
5. **A lesson shared by two tracks**: it must fit both tracks' limits, show the same progress in both, and point both pages' canonical link at the first track. → Task 7.

## File map

| File | Responsibility | Task |
|---|---|---|
| `src/content/words.ts` | `countWords` (moved out of the deleted `estimate.ts`) | 1 |
| `src/content/sources.ts` | Source registry, allowed hosts, `cite()`, `checkCitation()`, `sourceListOf()` | 2 |
| `src/content/schema.ts` | Runtime lesson shape (cited), track union, objective mapping | 3, 4 |
| `src/content/legacy.ts` | Closed legacy list, legacy authoring schema, lift into the runtime shape | 3 |
| `src/content/define.ts` | Structural checks shared by both paths; strict `defineLesson`; `defineTrack` | 3, 4, 5 |
| `src/content/limits.ts` | Limits schema, overrides, `checkLimits`, `unneededOverrides` | 4 |
| `src/content/texts.ts` | `textsOf` (moved from `src/test/lesson-references.ts`) | 5 |
| `src/content/glossary.ts` | Glossary schema, `defineGlossary`, empty `GLOSSARY` | 5 |
| `src/progress/store.ts` | Progress v2, v1 migration, merge | 6 |
| `src/content/registry.ts` | One lesson namespace, entries per track, canonical URLs, build-time joins | 1, 3, 4, 6, 7 |
| `src/content/lessons/*.ts` | Lessons, once each (moved from `lessons/networking/`) | 7 |
| `docs/content-model.md` | Authoring reference for §10 tasks 3–6 | 8 |

---

### Task 1: Remove the time estimate and every minute figure

**Files:**
- Delete: `src/content/estimate.ts`, `src/content/estimate.test.ts`
- Create: `src/content/words.ts`, `src/content/words.test.ts`
- Modify: `src/content/define.ts`, `src/content/define.test.ts`, `src/content/registry.ts`, `src/content/registry.test.ts`, `src/content/tracks/networking.ts`
- Modify: `src/components/TrackCardProgress.tsx` (+ test), `src/lib/track.ts` (+ test), `src/components/TrackLessons.test.tsx`, `src/components/SiteFooter.astro`, `src/pages/index.astro`, `src/pages/[track]/index.astro`, `src/pages/about.astro`, `src/scripts/about-page.test.ts`
- Modify: `e2e/global-setup.ts`, `e2e/support.ts`, `e2e/site.spec.ts`, `e2e/lesson.spec.ts`

**Interfaces:**
- Produces: `countWords(text: string): number` in `src/content/words.ts` (unchanged behaviour: `**` counts as a space). `validateLesson(input)` returns `{ lesson }` (no `warnings`); `defineLesson` no longer warns. `LessonSummary` (available) has no `minutes`. `trackTotals(entries): { available: number; planned: number }`.

Copy drafts (owner approves in the PR):
- Networking description, second sentence → `Visual lessons at your own pace: stop anywhere and pick up where you left off.` (first sentence unchanged; Home's card uses only the first).
- Footer → `Guided visual lessons on how technology works.`
- About's note (keep its icon) → `<b>Lessons are self-paced.</b> Take as long as you need. This browser remembers where you stopped, so you can pick up where you left off.`
- Home Networking card (first visit) → `4 of 20 lessons ready`; How the Internet Works card meta → `Lesson 1, 14 protocols`.
- Track page: the "minutes in all" stat is removed; lesson cards lose their `N min` chip.
- Home's hero lede ("Short, visual lessons…") holds no figure and stays for §10 task 7.

- [ ] **Step 1: Write the failing tests**

```ts
// words.test.ts
test('counts words, ** is a space', () => { expect(countWords('a **b**, c')).toBe(4); expect(countWords('  ')).toBe(0); });
// TrackCardProgress.test.tsx
expect(screen.getByText('4 of 20 lessons ready')).toBeInTheDocument();
expect(trackTotals(getEntries('networking'))).toEqual({ available: 4, planned: 20 });
// track.test.ts
expect(internet.meta).toEqual(['14 protocols', 'CompTIA A+', 'CompTIA Network+', 'CompTIA Security+', 'Cisco CCNA', 'Helpdesk']);
// registry.test.ts
test('entries carry no minutes', () => { for (const e of getEntries('networking')) expect(e).not.toHaveProperty('minutes'); });
// define.test.ts: delete every time-limit test; a lesson far over the old 15 minutes now validates:
test('a long lesson is not rejected for its length', () => { /* 6 steps × 120-word narratives, 3 questions with long feedback */ expect(issuesOf(long)).toEqual([]); });
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/content src/components/TrackCardProgress.test.tsx src/lib/track.test.ts`
Expected: FAIL (`words.ts` missing; texts still contain `min`).

- [ ] **Step 3: Implement** — move `countWords` to `words.ts`; delete `estimate.ts`/`estimate.test.ts` and every import of them (`define.ts`, `registry.ts`, `about.astro`); drop the minutes block and `warnings` from `define.ts`; drop `minutes` from entries and totals; apply the copy above; update `TrackLessons.test.tsx` and `about-page.test.ts` to the new copy.

- [ ] **Step 4: Update the end-to-end specs**
  - `global-setup.ts` and `support.ts`: `ReadyLesson` loses `minutes`; the setup no longer parses a minute chip.
  - `site.spec.ts`: expect `4 of 20 lessons ready`, `Lesson 1, 14 protocols`, no "minutes in all", card chips start `14 protocols`. Add:

```ts
test('Home, the track page and About show no time figure', async ({ page }) => {
  for (const path of ['/', '/networking', '/about']) {
    await page.goto(path);
    await expect(page.locator('body')).not.toContainText(/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i);
  }
});
```
  - `lesson.spec.ts`: the reduced-motion timing test uses DHCP (`LESSONS.find((l) => l.slug === 'dhcp')`, failing if absent) instead of "the shortest lesson".

- [ ] **Step 5: Run everything**

Run: `npx vitest run && npm run build && npm run e2e`
Expected: all pass. Then open `/`, `/networking` and `/about` at 1280×800 and 1440×900 in both themes (preview server) and confirm the stats row and card metadata close up without gaps; keep screenshots for the PR.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e && git commit -m "feat: lessons are untimed; remove the time estimate and every minute figure"
```

---

### Task 2: Source registry and citations

**Files:**
- Create: `src/content/sources.ts`, `src/content/sources.test.ts`

**Interfaces:**
- Consumes: `Source` (`{ label, url }`) from `schema.ts` (type-only import).
- Produces:

```ts
export const SOURCE_KINDS = ['rfc', 'ieee', 'iana', 'nist', 'vendor', 'cert-objectives'] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];
/** Exact hosts each kind may live on. No wildcards. */
export const SOURCE_HOSTS: Record<SourceKind, readonly string[]> = {
  rfc: ['www.rfc-editor.org', 'datatracker.ietf.org'],
  ieee: ['standards.ieee.org', 'ieeexplore.ieee.org'],
  iana: ['www.iana.org'],
  nist: ['csrc.nist.gov', 'nvlpubs.nist.gov', 'www.nist.gov'],
  vendor: ['learn.microsoft.com', 'www.cisco.com', 'developers.cloudflare.com', 'docs.paloaltonetworks.com'],
  'cert-objectives': ['www.comptia.org', 'partners.comptia.org', 'learningnetwork.cisco.com'],
};
export interface SourceEntry {
  id: string;          // slug, e.g. 'rfc2131'
  kind: SourceKind;
  short: string;       // 'RFC 2131'
  title: string;       // 'Dynamic Host Configuration Protocol'
  publisher: string;   // 'IETF'
  url: string;         // the document, https
  anchor?: string;     // numbered-section link template with '{n}', same host as url
  version?: string;    // required for cert-objectives
}
export type SourceRegistry = Readonly<Record<string, SourceEntry>>;
export function defineSources(entries: SourceEntry[]): SourceRegistry; // throws one Error listing every issue
export const SOURCES: SourceRegistry; // = defineSources([]): entries arrive with §10 tasks 4–6
export const citationSchema; // z.strictObject({ source: slug, section: text, url: https, label: text })
export type Citation = z.infer<typeof citationSchema>;
export function cite(source: string, section: string, opts?: { url?: string; sources?: SourceRegistry }): Citation;
export function checkCitation(c: Citation, sources: SourceRegistry, use: 'content' | 'objectives'): string[];
export function sourceListOf(citations: Citation[], sources: SourceRegistry): Source[];
```

Rules:
- `cite`: a numbered section (`/^\d+(\.\d+)*$/`) on a source with `anchor` → `url = anchor` with `{n}` replaced, `label = "<short> §<section>"`. Otherwise `opts.url` is required, must start with the entry's `url` (same document), and `label = "<short>, <section>"`. Unknown source, missing URL or a URL outside the document throws an `Error` naming the source and section.
- `checkCitation`: the source exists; for `use: 'content'` its kind is not `cert-objectives`, and for `use: 'objectives'` it is; the citation equals what `cite(c.source, c.section, { url: c.url, sources })` returns (catches hand-edited labels and URLs).
- `sourceListOf`: one `{ label: "<short>: <title>", url }` per source, in order of first citation (About's `sourceRows` splits that label at the colon).

- [ ] **Step 1: Write the failing tests** (`sources.test.ts`, with its own three-entry registry: `rfc2131` (rfc, short `RFC 2131`, `anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html#section-{n}'`); `ms-dhcp` (vendor, a page on `learn.microsoft.com`, no anchor); `aplus-objectives` (cert-objectives, version `V1`, on `partners.comptia.org`))

```ts
test('an RFC section links to that section', () => {
  expect(cite('rfc2131', '3.1', { sources })).toEqual({ source: 'rfc2131', section: '3.1', url: 'https://www.rfc-editor.org/rfc/rfc2131.html#section-3.1', label: 'RFC 2131 §3.1' });
});
test('a vendor page needs a URL inside the document', () => {
  expect(() => cite('ms-dhcp', 'DHCP lease', { sources })).toThrow(/needs a URL/);
  expect(() => cite('ms-dhcp', 'x', { sources, url: 'https://learn.microsoft.com/other' })).toThrow(/outside/);
});
test('defineSources rejects non-primary or malformed entries', () => {
  expect(() => defineSources([{ ...rfc, url: 'http://www.rfc-editor.org/rfc/rfc2131' }])).toThrow(/https/);
  expect(() => defineSources([{ ...vendor, url: 'https://en.wikipedia.org/wiki/DHCP' }])).toThrow(/en\.wikipedia\.org is not an allowed host for vendor/);
  expect(() => defineSources([rfc, rfc])).toThrow(/Duplicate source id "rfc2131"/);
  expect(() => defineSources([{ ...rfc, anchor: 'https://www.rfc-editor.org/rfc/rfc2131.html' }])).toThrow(/\{n\}/);
  expect(() => defineSources([{ ...objectives, version: undefined }])).toThrow(/version/);
});
test('checkCitation catches edits and misuse', () => {
  const c = cite('rfc2131', '3.1', { sources });
  expect(checkCitation({ ...c, label: 'RFC 2131 §4' }, sources, 'content')).not.toEqual([]);
  expect(checkCitation({ ...c, url: 'https://www.rfc-editor.org/rfc/rfc2132.html#section-3.1' }, sources, 'content')).not.toEqual([]);
  expect(checkCitation(cite('aplus-objectives', '2.6', { sources, url: objectives.url }), sources, 'content')).toEqual([expect.stringMatching(/objectives document.*only.*objective mapping/)]);
});
test('sourceListOf lists each source once, in order of first citation', () => { /* vendor, rfc, vendor → [vendor, rfc] */ });
```

- [ ] **Step 2: Run to see them fail** — `npx vitest run src/content/sources.test.ts` → FAIL (module missing).
- [ ] **Step 3: Implement `sources.ts`** to the interface above; the entry schema is a zod `strictObject`; `defineSources` collects every issue before throwing.
- [ ] **Step 4: Run to see them pass** — same command → PASS.
- [ ] **Step 5: Commit** — `git add src/content/sources* && git commit -m "feat: primary-source registry and exact-section citations"`

---

### Task 3: Cited runtime shape; the four ready lessons on a closed legacy path

**Files:**
- Modify: `src/content/schema.ts`, `src/content/define.ts`, `src/content/define.test.ts`, `src/content/test-fixtures.ts`, `src/content/registry.ts`, `src/content/registry.test.ts`
- Create: `src/content/legacy.ts`, `src/content/legacy.test.ts`
- Modify: the four lesson files and the 14 files in `lessons/networking/how-the-internet-works/` (switch to `defineLegacyLesson` and `LegacyUnitInput`)
- Modify: `src/lesson/Explanation.tsx` (+ test), `src/lesson/TopBar.tsx` (+ test), and any test that builds a `Lesson` from a fixture

**Interfaces:**
- Consumes: `citationSchema`, `Citation` (Task 2).
- Produces, in `schema.ts` (citation lists default to `[]` here; Task 5's rules make them required in cited lessons):

```ts
backingSchema   = z.union([z.strictObject({ traces: z.array(slugSchema).min(1) }), z.strictObject({ analogy: z.literal(true) }), z.strictObject({ example: z.literal(true) })]);
statementSchema = z.strictObject({ id: slugSchema, text, cite: z.array(citationSchema).default([]), analogy: z.literal(true).optional() });
paragraphSchema = z.strictObject({ text, cite: z.array(citationSchema).default([]) });              // a Watch step's Go deeper
learnParagraphSchema = paragraphSchema.extend({ id: slugSchema });                                  // Learn's Go deeper (a trace target)
tracedFactSchema = factSchema.extend({ backing: backingSchema.optional() });                        // Overview and Watch step facts
learnFactSchema  = factSchema.extend({ id: slugSchema, cite: z.array(citationSchema).default([]) });
termSchema       = z.strictObject({ id: slugSchema, idea: text, name: text, cite: z.array(citationSchema).default([]), analogy: z.literal(true).optional() });
patternSchema    = z.strictObject({ id: slugSchema, names: z.array(text), note: text, cite: z.array(citationSchema).default([]) });
learnSchema      = { lead: statement[] (min 1), terms: term[], pattern, why: statement[] (min 1), deep: learnParagraph[] (min 1), facts: learnFact[] }
stepSchema       : deep → paragraph[] (min 1); facts → tracedFact[]; + backing?
overview         : { hook, hookBacking?: Backing, description, backing?: Backing, facts: tracedFact[] }
question option  : { text, feedback, cite: Citation[] = [] }
message/note/table events, packetSchema, unitSceneSchema : + backing?: Backing
osiSchema        = z.union([z.strictObject({ layers: z.array(z.int().min(1).max(7)).min(1), cite: z.array(citationSchema).default([]) }), z.literal('spans')]);
unitSchema       : osiLayers → osi: osiSchema; references: Source[] = []; + backing?: Backing   // backing covers fullName and purpose
lessonSchema     : + backing?: Backing                                                                // covers subtitle and summary
export type Lesson = z.output<typeof lessonSchema> & { origin: 'cited' | 'legacy' };
```

- Produces, in `legacy.ts`:

```ts
/** The ready lessons written before citations. Closed: §10 tasks 4–6 remove each slug as it migrates; task 6 deletes this file. */
export const LEGACY_LESSONS = ['how-the-internet-works', 'subnetting', 'dhcp', 'firewalls'] as const;
export const legacyLessonSchema;                 // today's authoring schema (strings for lead/why/deep, osiLayers, references ≥ 1 per unit)
export type LegacyLessonInput = z.input<typeof legacyLessonSchema>;
export type LegacyUnitInput = LegacyLessonInput['units'][number];
export function liftLegacy(parsed: z.output<typeof legacyLessonSchema>): Lesson;  // origin 'legacy'
export function validateLegacyLesson(input: unknown): Lesson;                     // shape, then checkStructure, then today's limits; throws LessonValidationError
export function defineLegacyLesson(input: LegacyLessonInput): Lesson;             // + slug must be on LEGACY_LESSONS
```

Lift mapping: `lead` → `[{ id: 'lead', text, cite: [] }]`; `why` → `[{ id: 'why', … }]`; Learn `deep` → `[{ id: 'deep', text, cite: [] }]`; term *i* → `id: 'term-<i+1>'`; `pattern` → `id: 'pattern'`; Learn fact *i* → `id: 'fact-<i+1>'`; a step's `deep` → `[{ text, cite: [] }]`; options gain `cite: []`; `osiLayers` → `{ layers, cite: [] }`, or `'spans'` when empty; no backing anywhere.

- Produces, in `define.ts`: `checkStructure(lesson: Lesson): string[]` (today's scene, event, table, cue and duplicate-id checks, unchanged), `LessonValidationError` (unchanged). `checkUnitLimits` stays, exported for `legacy.ts`, until Task 4 moves it. The old `validateLesson`/`defineLesson` are removed here; Task 5 adds the strict ones.
- Produces, in `test-fixtures.ts`: the existing `makeLesson`, `makeUnit`, `makeTwoUnitLesson` now type as `LegacyLessonInput`/`LegacyUnitInput`; `liftedFixture(input = makeLesson()): Lesson` = `liftLegacy(legacyLessonSchema.parse(input))` (no checks, no figure mock needed).
- Registry: at build time, a lesson with `origin: 'legacy'` whose slug is not on `LEGACY_LESSONS` throws; so does a slug on the list whose lesson is not legacy (forces the list to shrink as lessons migrate).
- Console: `Explanation` renders a `Statement[]` as one `<p>` (texts joined by a space, each through `Rich`) and a paragraph list as one `<p>` per paragraph, so a lifted lesson renders exactly as today. `TopBar` reads `unit.osi` (`'spans'` → no OSI chip, as an empty list does today).

- [ ] **Step 1: Write the failing tests**

```ts
// legacy.test.ts
test('the legacy list is exactly the four ready lessons (it may only shrink)', () => {
  expect([...LEGACY_LESSONS].sort()).toEqual(['dhcp', 'firewalls', 'how-the-internet-works', 'subnetting']);
});
test('lifting keeps every word and adds empty citations', () => {
  const input = makeLesson(); const l = liftedFixture(input);
  expect(l.origin).toBe('legacy');
  expect(l.units[0]!.learn.lead).toEqual([{ id: 'lead', text: input.units[0]!.learn.lead, cite: [] }]);
  expect(l.units[0]!.steps[0]!.deep).toEqual([{ text: input.units[0]!.steps[0]!.deep, cite: [] }]);
  expect(l.units[0]!.learn.terms.map((t) => t.id)).toEqual(input.units[0]!.learn.terms.map((_, i) => `term-${i + 1}`));
});
test('an empty osiLayers lifts to spans', () => { /* osiLayers: [] → 'spans'; [7] → { layers: [7], cite: [] } */ });
test('only listed slugs may use the legacy path', () => {
  expect(() => defineLegacyLesson({ ...makeLesson(), slug: 'osi-model' })).toThrow(/osi-model.*not on the legacy list/);
});
// registry.test.ts
test('the four ready lessons are legacy, and every legacy lesson is listed', () => {
  const legacy = ['how-the-internet-works', 'subnetting', 'dhcp', 'firewalls'].map((s) => getLesson('networking', s)!);
  expect(legacy.map((l) => l.origin)).toEqual(['legacy', 'legacy', 'legacy', 'legacy']);
});
// Explanation.test.tsx
test('Learn joins its statements into one paragraph; Go deeper gives each paragraph its own', () => { /* lead [A., B.] → one <p> "A. B."; deep [P1, P2] → two <p> */ });
test('a lifted lesson renders the same Learn words as its legacy text', () => { /* DHCP: the lead string appears whole */ });
```

- [ ] **Step 2: Run to see them fail** — `npx vitest run src/content src/lesson` → FAIL.
- [ ] **Step 3: Change `schema.ts`** to the runtime shape above; move today's authoring schema pieces that change (Learn, step, option, unit, lesson) into `legacy.ts` as `legacyLessonSchema`, reusing every unchanged piece (events, scene, panels, log) from `schema.ts`.
- [ ] **Step 4: Implement `legacy.ts`** and `checkStructure`; switch the four lesson files to `defineLegacyLesson` and the 14 protocol files' `Unit` type to `LegacyUnitInput`; move `define.test.ts`'s cases onto `validateLegacyLesson` (they keep testing the structural rules and today's limits).
- [ ] **Step 5: Update the console and the tests that build lessons** — `Explanation`, `TopBar`; every test that used a fixture input as a `Lesson` now uses `liftedFixture(...)`.
- [ ] **Step 6: Run everything that runs fast** — `npx vitest run && npm run build` → PASS (no visible change: the pages' HTML for the four lessons is unchanged apart from attribute order, if any).
- [ ] **Step 7: Commit** — `git commit -m "refactor: cited lesson shape at runtime; the four ready lessons on a closed legacy path"`

---

### Task 4: Track types, per-track limits with reasoned overrides, pinned objective mapping

**Files:**
- Create: `src/content/limits.ts`, `src/content/limits.test.ts`
- Modify: `src/content/schema.ts`, `src/content/define.ts`, `src/content/define.test.ts`, `src/content/legacy.ts`, `src/content/tracks/networking.ts`, `src/content/registry.ts`, `src/content/registry.test.ts`, `src/content/test-fixtures.ts`

**Interfaces:**
- Consumes: `Lesson` (Task 3), `countWords` (Task 1), `Citation`, `checkCitation`, `SOURCES` (Task 2).
- Produces, in `limits.ts`:

```ts
const range = z.strictObject({ min: z.int().min(0), max: z.int().min(1) }).refine((r) => r.min <= r.max, 'min must not exceed max');
export const limitsSchema = z.strictObject({
  steps: range, factsPerStep: range, practiceQuestions: range, optionsPerQuestion: range, learnTerms: range, patternNames: range,
  narrativeWords: z.int().min(1), hookWords: z.int().min(1), deepWords: z.int().min(1),
});
export type Limits = z.infer<typeof limitsSchema>;
export type LimitName = keyof Limits;
export const overrideSchema; // { limit: LimitName, min?: int, max?: int, reason: text }:
//   at least one of min/max; word limits take max only; reason is one line (no \n or \r), at most 160 characters after trimming
export type Override = z.infer<typeof overrideSchema>;
export function applyOverrides(limits: Limits, overrides: Override[]): Limits;
/** Every unit against the limits after the lesson's own overrides. Go deeper counts the words of one block's paragraphs together. */
export function checkLimits(lesson: Lesson, limits: Limits): string[];
/** Overrides the lesson would still fit every one of these tracks' limits without, as messages. */
export function unneededOverrides(lesson: Lesson, limitsOfTracks: Limits[]): string[];
```

- `lessonSchema` gains `overrides: z.array(overrideSchema).default([])`, with no two overrides for the same limit (a define-time issue). Legacy lessons lift with `overrides: []`; `legacyLessonSchema` has no `overrides` field.
- `legacy.ts` keeps only the legacy-only rules: at least 1 reference per unit, and exactly 2 Practice questions per unit in a lesson of several units. The numeric limits now come from the track, checked in the registry.
- Produces, in `schema.ts`, the track union:

```ts
const lessonRef = z.strictObject({ slug: slugSchema, title: text });
const objectiveSchema = z.strictObject({ exam: text, objective: z.string().regex(/^\d+\.\d+$/), cite: citationSchema });
const certLessonRef = lessonRef.extend({ objectives: z.array(objectiveSchema).min(1) });
const base = { id: slugSchema, title: text, description: text, level, limits: limitsSchema };
export const conceptTrackSchema = z.strictObject({ ...base, type: z.literal('concept'), parts: z.array(z.strictObject({ id: slugSchema, title: text, lessons: z.array(lessonRef).min(1) })).min(1) });
export const certificationTrackSchema = z.strictObject({
  ...base, type: z.literal('certification'),
  exam: z.strictObject({ title: text, codes: z.array(text).min(1), version: text, source: slugSchema }),
  parts: z.array(z.strictObject({ id: slugSchema, title: text, lessons: z.array(certLessonRef).min(1) })).min(1),
});
export const trackSchema = z.discriminatedUnion('type', [conceptTrackSchema, certificationTrackSchema]);
export type Track = z.infer<typeof trackSchema>;
```

- `defineTrack(t: Track, sources: SourceRegistry = SOURCES): Track` adds, for certification tracks: `exam.source` is in the registry with kind `cert-objectives` and its `version` equals `exam.version` (the pin); every objective's `exam` is one of `exam.codes`, its `cite.source` is `exam.source`, and `checkCitation(cite, sources, 'objectives')` is clean; no lesson lists the same objective twice. A concept track's lessons cannot carry objectives (the strict object rejects them).
- `networking.ts` gains `type: 'concept'` and:

```ts
limits: {
  steps: { min: 4, max: 6 }, factsPerStep: { min: 2, max: 4 }, practiceQuestions: { min: 2, max: 3 },
  optionsPerQuestion: { min: 2, max: 4 }, learnTerms: { min: 3, max: 10 }, patternNames: { min: 2, max: 6 },
  narrativeWords: 120, hookWords: 80, deepWords: 90,
},
```

- Registry: `buildEntries` runs `checkLimits(lesson, track.limits)` for each available lesson and throws `Lesson "<slug>" does not fit the <track> track's limits:` followed by each issue; it also throws on `unneededOverrides(lesson, [track.limits])` (Task 7 widens this to every track that lists the lesson).
- `test-fixtures.ts`:
  - `FIXTURE_LIMITS`: the Networking values.
  - `FIXTURE_SOURCES: SourceRegistry`, used here and in Task 5: `rfc-example` (rfc, short `RFC 9999`, title `Example Protocol`, url `https://www.rfc-editor.org/rfc/rfc9999.html`, anchor `https://www.rfc-editor.org/rfc/rfc9999.html#section-{n}`); `vendor-example` (vendor, short `Example vendor`, title `Example page`, url `https://learn.microsoft.com/example`); `example-objectives` (cert-objectives, short `Example objectives`, version `V1`, url `https://partners.comptia.org/example-objectives.pdf`; tests call this URL `OBJ_URL`).
  - `makeCertTrack()`: two lessons, exam `{ title: 'Example cert', codes: ['EX-101'], version: 'V1', source: 'example-objectives' }`, each lesson mapped to one objective cited from `example-objectives`.

- [ ] **Step 1: Write the failing tests**

```ts
// limits.test.ts — the limit cases that used to live in define.test.ts move here, run through checkLimits(liftedFixture(...), FIXTURE_LIMITS)
test('a 130-word narrative fails at 120 and passes with a reasoned override', () => {
  expect(checkLimits(long, FIXTURE_LIMITS)).toEqual([expect.stringMatching(/narrative is 130 words; the limit is 120/)]);
  expect(checkLimits({ ...long, overrides: [{ limit: 'narrativeWords', max: 140, reason: 'Names all four DHCP messages in one step.' }] }, FIXTURE_LIMITS)).toEqual([]);
});
test('Go deeper counts a block’s paragraphs together', () => { /* two 50-word paragraphs in one step → over 90 */ });
test('an override needs a one-line reason, and word limits take only a max', () => {
  expect(overrideSchema.safeParse({ limit: 'hookWords', max: 100, reason: 'Two\nlines' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'hookWords', min: 10, reason: 'x' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'steps', max: 8, reason: '' }).success).toBe(false);
});
test('an override the lesson does not need is reported', () => {
  expect(unneededOverrides({ ...short, overrides: [{ limit: 'steps', max: 8, reason: 'Room to grow.' }] }, [FIXTURE_LIMITS])).toEqual([expect.stringMatching(/steps.*not needed/)]);
});
// define.test.ts (tracks)
test('a certification track maps every lesson to pinned objectives', () => { expect(() => defineTrack(makeCertTrack(), FIXTURE_SOURCES)).not.toThrow(); });
test.each([
  ['a lesson with no objective', (t) => { t.parts[0].lessons[0].objectives = []; }],
  ['an objective cited from another document', (t) => { t.parts[0].lessons[0].objectives[0].cite = cite('rfc-example', '3.1', { sources: FIXTURE_SOURCES }); }],
  ['a version that is not the registry’s', (t) => { t.exam.version = 'V2'; }],
  ['an exam code the track does not have', (t) => { t.parts[0].lessons[0].objectives[0].exam = 'EX-999'; }],
  ['an objective that is not N.N', (t) => { t.parts[0].lessons[0].objectives[0].objective = '2'; }],
])('rejects %s', (_, change) => { const t = makeCertTrack(); change(t); expect(() => defineTrack(t, FIXTURE_SOURCES)).toThrow(); });
test('a concept track’s lessons cannot carry objectives', () => { /* add objectives to networking-like fixture → throws */ });
// registry.test.ts
test('Networking is a concept track with today’s limits', () => { expect(getTrack('networking')).toMatchObject({ type: 'concept', limits: FIXTURE_LIMITS }); });
```

- [ ] **Step 2: Run to see them fail** — `npx vitest run src/content` → FAIL.
- [ ] **Step 3: Implement** `limits.ts`, the track union, `defineTrack`'s certification checks, the Networking limits, and the registry's limit checks; delete `checkUnitLimits` from `define.ts` and the numeric limits from `legacy.ts`.
- [ ] **Step 4: Run** — `npx vitest run && npm run build` → PASS (the four ready lessons fit Networking's limits without overrides).
- [ ] **Step 5: Commit** — `git commit -m "feat: concept and certification tracks, per-track limits with reasoned overrides, pinned objective mapping"`

---

### Task 5: The strict cited schema, and the glossary

**Files:**
- Modify: `src/content/define.ts`, `src/content/test-fixtures.ts`, `src/test/lesson-references.ts`
- Create: `src/content/cited.test.ts`, `src/content/texts.ts`, `src/content/glossary.ts`, `src/content/glossary.test.ts`

**Interfaces:**
- Consumes: Tasks 2–4.
- Produces:

```ts
// texts.ts (moved from src/test/lesson-references.ts, which re-exports it)
export function textsOf(value: unknown): string[];
// define.ts
export type LessonInput = z.input<typeof lessonSchema>;
export function validateLesson(input: unknown, sources?: SourceRegistry): Lesson;   // origin 'cited'; throws one LessonValidationError with every issue
export function defineLesson(input: LessonInput, sources?: SourceRegistry): Lesson; // the entry point for every new lesson file
// glossary.ts
export const glossaryEntrySchema = z.strictObject({ id: slugSchema, term: text, definition: z.array(statementSchema).min(1) });
export type GlossaryEntry = z.infer<typeof glossaryEntrySchema>;
export function defineGlossary(entries: GlossaryEntry[], sources?: SourceRegistry): GlossaryEntry[];
export const GLOSSARY: GlossaryEntry[]; // = defineGlossary([])
// test-fixtures.ts (FIXTURE_SOURCES comes from Task 4)
export function makeCitedLesson(): LessonInput; // one unit, valid under every rule below; Learn statement ids 'lead-1', 'why-1', 'term-1'…, 'pattern', 'fact-1'…, 'deep-1'
```

`validateLesson` runs, in order: the shape (`lessonSchema`); then, collecting every issue:
1. exactly one unit;
2. `references` is empty as written (sources come from citations), then set to `sourceListOf(every citation, sources)`, in reading order: OSI, Watch steps' Go deeper, Learn (lead, terms, pattern, why, deep, facts), Practice;
3. each Learn lead or why statement and each term has at least one citation **or** `analogy: true`, never both; the pattern, each Learn fact, every Go-deeper paragraph (Learn's and each step's) and every Practice option has at least one citation;
4. `osi` is `'spans'`, or its layers carry at least one citation;
5. backing is present on the lesson, the unit, the scene, the Overview (`backing` and `hookBacking`), each Overview fact, each step, each step fact, each event and each packet;
6. Learn statement and Learn paragraph ids are unique; every trace names one of them **in this lesson** whose citation list is non-empty (an analogy statement, a step's Go deeper, or an id from another lesson is not a valid target);
7. every citation passes `checkCitation(c, sources, 'content')`;
8. no text says "lesson N" (`textsOf(lesson)` against `/\blessons? \d+/i`);
9. `checkStructure(lesson)`.

`defineGlossary`: unique ids; unique terms ignoring case; every definition statement cited or flagged `analogy` (not both); each entry has at least one cited statement; every citation passes `checkCitation(c, sources, 'content')`.

Messages name the place and say what to do, e.g. `units[0].learn.lead[1] ("lead-2"): no citation; cite a source or flag it as an analogy.`

- [ ] **Step 1: Write the failing tests** (`cited.test.ts` mocks `FIGURE_PARTS` as `define.test.ts` does; every call passes `FIXTURE_SOURCES`)

```ts
test('the cited fixture is valid, comes back cited, with its sources derived', () => {
  const l = validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
  expect(l.origin).toBe('cited');
  expect(l.units[0]!.references.map((s) => s.label)).toEqual(['RFC 9999: Example Protocol', 'Example vendor: Example page']);
});
test.each([
  ['a Learn statement with no citation and no analogy flag', (l) => { u(l).learn.lead[0].cite = []; }, /no citation; cite a source or flag it as an analogy/],
  ['a statement both cited and flagged', (l) => { u(l).learn.lead[0].analogy = true; }, /both/],
  ['a Go-deeper paragraph with no citation', (l) => { u(l).steps[0].deep[0].cite = []; }, /Go deeper.*no citation/],
  ['a Practice option with no citation', (l) => { u(l).practice[0].options[1].cite = []; }, /option.*no citation/],
  ['an OSI layer with no citation', (l) => { u(l).osi = { layers: [7], cite: [] }; }, /OSI/],
  ['a step with no backing', (l) => { delete u(l).steps[0].backing; }, /step.*trace/],
  ['an event with no backing', (l) => { delete u(l).steps[0].events[0].backing; }, /event.*trace/],
  ['an Overview fact with no backing', (l) => { delete u(l).overview.facts[0].backing; }, /Overview fact/],
  ['a trace to an analogy', (l) => { u(l).learn.terms[0] = { ...u(l).learn.terms[0], cite: [], analogy: true }; u(l).steps[0].backing = { traces: ['term-1'] }; }, /traces "term-1", which is an analogy/],
  ['a trace to an unknown id', (l) => { u(l).steps[0].backing = { traces: ['nowhere'] }; }, /traces "nowhere"/],
  ['a duplicate statement id', (l) => { u(l).learn.why[0].id = 'lead-1'; }, /Duplicate Learn id "lead-1"/],
  ['written references', (l) => { u(l).references = [{ label: 'X: Y', url: 'https://www.rfc-editor.org/' }]; }, /references come from citations/],
  ['two units', (l) => { l.units.push(structuredClone(u(l))); }, /exactly one unit/],
  ['a "lesson 3" pointer', (l) => { u(l).learn.why[0].text = 'More in lesson 3.'; }, /lesson 3/],
  ['an objectives document cited in content', (l) => { u(l).learn.facts[0].cite = [cite('example-objectives', '2.6', { sources: FIXTURE_SOURCES, url: OBJ_URL })]; }, /objective mapping/],
  ['a hand-edited citation label', (l) => { u(l).learn.facts[0].cite[0].label = 'RFC 1 §1'; }, /citation/],
])('rejects %s', (_, change, message) => { const l = makeCitedLesson(); change(l); expect(joined(l)).toMatch(message); });
test('every problem is reported at once', () => { /* three independent faults → three issues */ });
// glossary.test.ts
test('a definition needs a cited statement', () => { expect(() => defineGlossary([{ id: 'lease', term: 'Lease', definition: [{ id: 'd1', text: 'Like borrowing a book.', cite: [], analogy: true }] }], FIXTURE_SOURCES)).toThrow(/at least one cited statement/); });
test('terms are unique ignoring case', () => { /* 'Lease' and 'lease' → throws */ });
test('the glossary starts empty and valid', () => { expect(GLOSSARY).toEqual([]); });
```

- [ ] **Step 2: Run to see them fail** — `npx vitest run src/content/cited.test.ts src/content/glossary.test.ts` → FAIL.
- [ ] **Step 3: Implement** `texts.ts`, `validateLesson`/`defineLesson`, `glossary.ts`, and `makeCitedLesson`/`FIXTURE_SOURCES`.
- [ ] **Step 4: Run** — `npx vitest run && npm run build` → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat: strict cited lesson schema with Watch-to-Learn traces, analogy flags and a cited glossary"`

---

### Task 6: Progress per lesson (`techconcepts:v2`), migrating `techconcepts:v1`

**Files:**
- Modify: `src/progress/store.ts` (+ `store.test.ts`), `src/progress/useProgress.ts` (+ test), `src/progress/resume.ts`, `src/content/registry.ts` (+ test), `src/lesson/LessonConsole.tsx` (+ tests), `src/test/progress.ts`, `src/components/progress-islands.test.tsx`
- Modify: `e2e/site.spec.ts`

**Interfaces:**
- Produces, in `store.ts`:

```ts
export const PROGRESS_KEY = 'techconcepts:v2';
export const LEGACY_PROGRESS_KEY = 'techconcepts:v1';
export interface ProgressData { version: 2; lessons: Record<string, LessonProgress>; lastLesson: string | null; lastTrack: string | null }
export function parseProgress(raw: string | null): ProgressData;            // v2 only; anything else reads as empty (malformed records dropped one by one, as today)
export function migrateV1(raw: string | null): ProgressData;                // today's v1 parser, then 'track/slug' → 'slug' (a key without '/' kept), collisions merged; lastLesson 'networking/dhcp' → lastLesson 'dhcp', lastTrack 'networking'
export function mergeRecords(a: LessonProgress, b: LessonProgress): LessonProgress; // finished if either is; the larger furthestPosition; the later lastOpened
export function combineProgress(primary: ProgressData, other: ProgressData): ProgressData; // every lesson of both, collisions merged; lastLesson and lastTrack from primary unless it has none
export function recordVisit(d: ProgressData, key: string, trackId: string, position: number, maxPosition: number, now: Date): ProgressData; // also sets lastTrack
export function loadProgress(s: SafeStorage): ProgressData;                 // combineProgress(parseProgress(v2), migrateV1(v1))
export function saveProgress(s: SafeStorage, d: ProgressData): boolean;     // writes v2; removes v1 only after that write succeeded
export function clearProgress(s: SafeStorage): void;                        // removes both keys
```

`sanitizeProgress` and `mergeProgress` keep their meaning in the v2 shape (`lastTrack` travels with `lastLesson`). `useProgress` reloads on a `storage` event for either key (or a null key). Registry entries' `key` becomes the lesson slug. `LessonConsole` records visits with its `trackId`. `src/test/progress.ts`: `seedProgress` writes v2; new `seedV1Progress(lessons, lastLesson)` writes the old record.

- [ ] **Step 1: Write the failing tests** (`store.test.ts`, with `src/test/fake-io.ts` storages, including one whose `setItem` throws)

```ts
const V1 = JSON.stringify({ version: 1, lastLesson: 'networking/subnetting', lessons: {
  'networking/dhcp': { status: 'finished', furthestPosition: 7, lastOpened: '2026-11-06T10:00:00.000Z' },
  'networking/how-the-internet-works': { status: 'in-progress', furthestPosition: 23, lastOpened: '2026-11-06T11:00:00.000Z' },
  'networking/subnetting': { status: 'in-progress', furthestPosition: 3, lastOpened: '2026-11-07T09:00:00.000Z' },
  'networking/osi-model': { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-01T09:00:00.000Z' },
} });
test('every v1 record carries over under its lesson slug', () => {
  expect(migrateV1(V1)).toEqual({ version: 2, lastLesson: 'subnetting', lastTrack: 'networking', lessons: {
    dhcp: { status: 'finished', furthestPosition: 7, lastOpened: '2026-11-06T10:00:00.000Z' },
    'how-the-internet-works': { status: 'in-progress', furthestPosition: 23, lastOpened: '2026-11-06T11:00:00.000Z' },
    subnetting: { status: 'in-progress', furthestPosition: 3, lastOpened: '2026-11-07T09:00:00.000Z' },
    'osi-model': { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-01T09:00:00.000Z' },
  } });
});
test('two tracks’ records of one lesson merge: finished wins, furthest and latest kept', () => { /* 'networking/dhcp' in-progress 3 (11-01) + 'a-plus/dhcp' finished 7 (10-01) → finished, 7, 11-01 */ });
test('a save writes v2 and only then removes v1', () => { /* after saveProgress: v2 set, v1 null */ });
test('a failed v2 write keeps v1', () => { /* setItem throws → returns false, v1 still there */ });
test('v1 written after migration (an old tab) is merged on the next load', () => { /* v2 has dhcp; v1 has subnetting → load has both */ });
test('a lesson no track lists yet survives migration and a later save of another lesson', () => { /* 'osi-model' still stored after recordVisit on dhcp + save */ });
test('storage that throws on every call loads empty and never throws', () => { /* get/set/remove all throw → loadProgress is empty; saveProgress false; clearProgress returns */ });
test('clearing removes both keys', () => { /* … */ });
test('malformed v1 reads as nothing and leaves v2 alone', () => { /* … */ });
// useProgress.test.tsx
test('a change to the old key in another tab reloads', () => { /* dispatch StorageEvent { key: 'techconcepts:v1' } → data updates */ });
// registry.test.ts
test('an entry’s key is its lesson slug', () => { expect(getEntries('networking').find((e) => e.slug === 'dhcp')!.key).toBe('dhcp'); });
```

- [ ] **Step 2: Run to see them fail** — `npx vitest run src/progress src/content/registry.test.ts` → FAIL.
- [ ] **Step 3: Implement** the store, the hook's listener, the registry key, `LessonConsole`'s `recordVisit` call and the seed helpers; update the islands' tests (Reset now clears both keys).
- [ ] **Step 4: Add the end-to-end check** (`site.spec.ts`; seed with `page.evaluate` after one `goto`, never `addInitScript`, which would re-seed v1 on every navigation)

```ts
test('progress saved before this update still shows, then moves to the new record', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((v1) => localStorage.setItem('techconcepts:v1', v1), V1_DHCP_FINISHED); // 'networking/dhcp' finished at 7
  await page.goto('/networking');
  await expect(lessonCard(page, 'dhcp')).toContainText('Finished');
  await page.goto('/networking/subnetting?step=1');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('techconcepts:v1'))).toBeNull();
  const v2 = JSON.parse((await page.evaluate(() => localStorage.getItem('techconcepts:v2')))!);
  expect(v2.lessons.dhcp.status).toBe('finished');
  expect(v2.lessons.subnetting.status).toBe('in-progress');
});
```

(`lessonCard` is a small helper in `e2e/support.ts` that finds a ready lesson's card by its link's slug.)

- [ ] **Step 5: Run** — `npx vitest run && npm run build && npm run e2e` → PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: progress follows the lesson; migrate saved techconcepts:v1 progress without losing any"`

---

### Task 7: Shared lessons: one lesson namespace, a URL per track, canonical links

**Files:**
- Move: `src/content/lessons/networking/*` → `src/content/lessons/` (with `git mv`, tests and the `how-the-internet-works/` folder included); fix their relative imports
- Modify: `src/content/registry.ts` (+ test), `src/pages/[track]/[lesson].astro`, `src/pages/[track]/index.astro`, `src/pages/index.astro`, `src/pages/about.astro`, `src/layouts/BaseLayout.astro`, `src/test/lesson-references.ts`
- Modify: tests that import lesson files by path (`SequenceView.test.tsx`, `scenes/drivers/*.test.ts`, `announce.test.ts`, `panels/UnitPanel.test.tsx`, `panels/RulesPanel.test.tsx`, the lessons' own tests)
- Modify: `e2e/lesson.spec.ts`

**Interfaces:**
- Consumes: `checkLimits`, `unneededOverrides` (Task 4); entry `key` = slug (Task 6).
- Produces, in `registry.ts`:

```ts
export function lessonsFromModules(modules: Record<string, Lesson>): Record<string, Lesson>; // path '^\./lessons/([^/]+)\.ts$'; file name must equal the slug
/** `homeOf(slug)` is the first track, in `tracks` order, that lists the slug. */
export function buildEntries(track: Track, lessons: Record<string, Lesson>, homeOf: (slug: string) => string): LessonSummary[];
// LessonSummary (available) gains: canonical: string  // '/<home track>/<slug>'
export function getLesson(slug: string): Lesson | undefined;
export function tracksOf(slug: string): Track[];
```

Build-time rules: every lesson file is listed by at least one track (`Lesson "x" is not listed in any track.`); each listing track's title equals the lesson's; the lesson fits every listing track's limits; `unneededOverrides(lesson, tracksOf(slug).map((t) => t.limits))` is empty; the legacy-list rules from Task 3 still hold. Glob: `['./lessons/*.ts', '!./lessons/*.test.ts']`. `BaseLayout` takes `canonical?: string` (a path); it emits `<link rel="canonical">` and uses the same absolute URL for `og:url`; pages without it use their own path, as `og:url` does today.

- [ ] **Step 1: Write the failing tests** (`registry.test.ts`, fixture tracks `alpha` then `beta`, both listing lesson `shared` from `liftedFixture`)

```ts
test('a lesson listed by two tracks has one key, a URL in each, and one canonical URL', () => {
  const a = buildEntries(alpha, { shared }, () => 'alpha').find((e) => e.slug === 'shared')!;
  const b = buildEntries(beta, { shared }, () => 'alpha').find((e) => e.slug === 'shared')!;
  expect([a.key, b.key]).toEqual(['shared', 'shared']);
  expect([a.url, b.url]).toEqual(['/alpha/shared', '/beta/shared']);
  expect([a.canonical, b.canonical]).toEqual(['/alpha/shared', '/alpha/shared']);
});
test('it must fit both tracks’ limits', () => { /* beta.limits.steps.max = 4, lesson has 5 → throws naming beta */ });
test('a second track that lists another title fails', () => { /* … */ });
test('a lesson file no track lists fails', () => { /* … */ });
test('numbers count within each track', () => { /* shared is 2 of alpha and 1 of beta */ });
test('the real lessons load from one folder', () => { expect(getLesson('dhcp')!.slug).toBe('dhcp'); expect(tracksOf('dhcp').map((t) => t.id)).toEqual(['networking']); });
```

- [ ] **Step 2: Run to see them fail** — `npx vitest run src/content/registry.test.ts` → FAIL.
- [ ] **Step 3: Move the lesson files** (`git mv`), fix imports and every test that imports a lesson by path; implement the registry and the pages' calls (`getLesson(entry.slug)`); pass `canonical={entry.canonical}` from the lesson page to `BaseLayout`.
- [ ] **Step 4: Add the end-to-end check** (`lesson.spec.ts`)

```ts
test('a lesson page names its canonical URL', async ({ page, baseURL }) => {
  await page.goto('/networking/dhcp');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL('/networking/dhcp', baseURL).href);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', new URL('/networking/dhcp', baseURL).href);
});
```

(If the site's configured `site` makes `href` absolute on another origin, compare the path only.)

- [ ] **Step 5: Run** — `npx vitest run && npm run build && npm run e2e` → PASS.
- [ ] **Step 6: Commit** — `git commit -m "feat: lessons live once and tracks reference them; one URL per track with a canonical link"`

---

### Task 8: Authoring reference, full verification, and the PR

**Files:**
- Create: `docs/content-model.md`

- [ ] **Step 1: Write `docs/content-model.md`** (about one page, for the sessions that run §10 tasks 3–6): adding a source to the registry and its allowed hosts; `cite()`; Learn statements, the `analogy` flag and Go-deeper paragraphs; backing (`traces`, `analogy`, `example`) and what may be traced to; overrides and their one-line reasons; the legacy list and how a lesson leaves it; track types and objective mapping; the glossary. Relative paths only.
- [ ] **Step 2: Run the full checks and record the output**

Run: `npx vitest run && npm run build && npm run e2e`
Expected: all pass. Record the counts (tests, files, e2e) for the PR; report any failure as it is.

- [ ] **Step 3: Check the pages at desktop sizes** — `/`, `/networking`, `/about` and `/networking/dhcp` at 1280×800 and 1440×900, both themes: no gaps where minutes were, lessons unchanged.
- [ ] **Step 4: Commit** — `git commit -m "docs: content model authoring reference"`
- [ ] **Step 5: Ask the owner before pushing `feat/content-model` and opening the PR to `main`.** The PR body lists the owner rulings, the plan's calls for review (with the copy drafts and the 90-word Go-deeper limit), the test counts, and a note that the four lessons are unchanged and still unverified until §10 tasks 4–6. Never merge without the owner's explicit OK.
