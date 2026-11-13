# S11: facts for the glossary's fact-check path

Repo: the TechConcept checkout, branch `revamp`, read on 2026-11-13. Paths are repo-relative. Every line number is from the file as it stands. Nothing in the repo was changed. Quotes are verbatim.

## 1. The fact-check tooling as it is

### 1.1 The files

Every file in `src/content/factcheck/` (non-test files first). The "tests" column names the test file that covers it.

| File | Lines | What it does | Exported functions or types (line) | Test file |
|---|---|---|---|---|
| `cli.ts` | 178 | The command's logic: parses args, loads one lesson or the canary, prints the claim sheet, runs the report, quote and re-check forms. | `CANARY_SLUG` (26), `canaryReportPath` (27), `canaryRecheckPath` (28), `FactCheckDeps` (30), `DEFAULT_DEPS` (63), `runFactCheck` (78) | `cli.test.ts` (12 tests), `cli.recheck.test.ts` (37), `cli.defaults.test.ts` (2) |
| `gate.ts` | 247 | The build gate: reads a lesson's report (and its re-check) against its claim sheet; also the refusal of kinds with no path. | `reportPath` (22), `checkReport` (27), `checkPair` (112), `checkedDate` (190), `checkFactChecks` (209), `checkUnpathedKinds` (236) | `gate.test.ts` (27), `gate.recheck.test.ts` (60) |
| `quotes.ts` | 177 | Parses the quotes under each `### <key> — <verdict>` heading of a report. | `Quote` (18), `evenWhitespace` (36), `keysNeedingQuotes` (39), `QuoteMode` (47), `parseQuotes` (50), `quotesDigest` (175) | `quotes.test.ts` (27), `quotes.recheck.test.ts` (28) |
| `quotecheck.ts` | 255 | The quote check: finds each quoted passage in the source file it names; on success returns the report with its `quotes` record (and `items` when it is a full report at the sheet's hash). | `SourceFile` (13), `PageText` (19), `QuoteRecord` (21), `QuoteCheck` (24), `keysMissingQuotes` (111), `stampItems` (170), `checkQuotes` (180) | `quotecheck.test.ts` (44) |
| `pagetext.ts` | 58 | Reads the text a reader sees from a saved `.html` or `.xml` file, with jsdom. | `pageText(name, raw)` (50) | none of its own; `quotecheck.test.ts` and `quotes.recheck.test.ts` mention it |
| `report.ts` | 166 | The report header's zod schemas and the parser for the header fence. | `VERDICTS` (10), `Verdict` (11), `REPORT_FENCE` (13), `reportHeaderSchema` (31), `ReportHeader` (53), `recheckHeaderSchema` (60), `RecheckHeader` (73), `HEADER` (75), `parseReport` (78), `parseRecheck` (83) | `report.test.ts` (17) |
| `recheck.ts` | 281 | The targeted re-check: which items changed, what to judge, the near-pass rule, the re-check sheet, the messages both the commands and the gate share. | `NEAR_PASS_MAX_FAILING` (10, value 3), `RECHECK_MAX_ITEMS` (12, value 12), `recheckPath` (15), `nearPass` (20), `Judging` (26), `matchBase` (148), `itemsToJudge` (158), `recheckMessages` (196), `renderRecheck` (215) | `recheck.test.ts` (30), `recheck.amended.test.ts` (29), `recheck.real.test.ts` (3; runs on the OSI Model report) |
| `sheet.ts` | 204 | The claim sheet: every item of a lesson, its key, kind, content, citations, traces; the hash; the printed Markdown. | `ItemKind` (22), `SheetItem` (24), `ClaimSheet` (35), `DISPLAY_ONLY` (49), `itemHash` (131), `itemHashes` (137), `limitsHash` (142), `claimSheet` (146), `sourceLine` (176), `itemLines` (181), `renderSheet` (194) | `sheet.test.ts` (21) |
| `sha256.ts` | 63 | SHA-256 of a string, as lowercase hex, with no dependency. | `sha256` (19) | `sha256.test.ts` (13 lines) |
| `test-helpers.ts` | 117 | Builds reports for tests: `reportFor` (12), `reportQuoting` (30), `recordedReportFor` (49), `stampedReportFor` (77), `recheckReportFor` (90), `withoutRecords` (117). Not a test file itself. | as listed | used by the tests above |
| `canary/lesson.ts` | | The canary: a planted-fault DHCP lesson with its own sources. Never on the site, never read by the gate. | `CANARY_SOURCES` (13), `CANARY_LESSON` (52) | `canary.test.ts` (3) |

Also in the folder: `canary/` (its report is `docs/fact-checks/canary/fact-check-canary.md`, cli.ts:27; the gate reads only depth-1 reports, registry.ts:298).

### 1.2 The npm script

- `package.json:18`: `"fact-check": "node scripts/fact-check.mjs"`.
- `package.json:13`: `"test": "vitest run"`. `package.json:11`: `"build": "astro check && astro build && node scripts/check-budgets.mjs"`.
- `scripts/fact-check.mjs` (47 lines). Its header, lines 1-13, gives the forms: `npm run fact-check -- <slug>` (the sheet), `-- <slug> --check`, `-- <slug> --quotes <folder>`, `-- <slug> --stamp`, `-- <slug> --recheck`, `-- <slug> --recheck --quotes <folder>`, `-- <slug> --recheck --check`. It says the work is in `src/content/factcheck/cli.ts` and that Node cannot load the lesson TypeScript, so it starts Vite with no config (lines 20-27) and loads `/src/content/factcheck/cli.ts` (line 38).
- Lines 29-34: `readFolder` reads only `.txt`, `.html` or `.xml` files from the folder: `.filter((name) => /\.(txt|html|xml)$/.test(name) ...)`.
- Line 35: `writeFile` writes under the repo root. Line 39: `runFactCheck(process.argv.slice(2), { ...DEFAULT_DEPS, readFolder, writeFile })`. Lines 46-47: exit with the code.
- No test imports `scripts/fact-check.mjs`. `cli.ts` `runFactCheck`, which the script calls, is covered by the three cli test files above. The script itself is checked only by running it.

### 1.3 How a lesson's claim sheet is built

`claimSheet(lesson: Lesson, sources: SourceRegistry)` (`src/content/factcheck/sheet.ts:146-173`). The body:

- item 1: key `title`, kind `unbacked` (sheet.ts:147);
- per unit `i`: key `units[i].name`, kind `unbacked` (sheet.ts:149); key `units[i].osi`, kind `osi`, content `'spans'` or `{ layers }`, citations `u.osi.cite` (sheet.ts:150-154);
- every part of `backedPartsOf(lesson)` (imported from `src/content/cited.ts`), keyed by `part.at`, kind from `backedKind` (sheet.ts:156-159, 94-98): `traced` (has `traces`), `analogy`, `example`, or `unbacked` when there is no backing;
- every part of `citedPartsOf(lesson)`, keyed by `part.at`, kind `analogy` when `part.analogy === true`, else `claim` (sheet.ts:160-162);
- each question's prompt: key `units[i].practice[j].prompt (question "<id>")`, kind `unbacked` (sheet.ts:163-167);
- `sources`: the registry entries of every cited id, sorted by id (sheet.ts:169-170);
- `hash = sha256(canonical({ slug, items, sources, overrides }))` (sheet.ts:171-172).

Kinds (sheet.ts:22): `'claim' | 'osi' | 'traced' | 'example' | 'analogy' | 'unbacked'`. Keys are positional text: the header comment gives `units[0].learn.lead[1] ("lead-2")` as an example (sheet.ts:25). A key with a quoted id in brackets belongs to a Learn statement or a question. The sheet is printed by `renderSheet` (sheet.ts:194-204), which lists "## Sources", "## Items (n)" and "## Limit overrides". `cli.ts:136` appends `Write your report to: <path>`.

What a reader sees is hashed: the items' content minus `DISPLAY_ONLY` (`width`, `prose`, `strong`, `hiddenKey`, `fast`, `dropAt`, `views`; sheet.ts:49) and minus the lesson's level, cert tags and figure (sheet.ts:14-15). The hash ignores empty lists and empty records (sheet.ts:102-104).

The claim sheet takes a `Lesson` (sheet.ts:146) and reads `lesson.slug`, `lesson.title`, `lesson.units`, `lesson.overrides` (sheet.ts:40, 147-171). Nothing else in the file is lesson-specific except `backedPartsOf`/`citedPartsOf` (sheet.ts:1, 156, 160).

### 1.4 The report: where it lives, its header, its verdicts

- Full report: `docs/fact-checks/<slug>.md`, from `reportPath` (`gate.ts:22-24`). Re-check: `docs/fact-checks/<slug>.recheck.md`, from `recheckPath` (`recheck.ts:15-17`).
- Canary report: `docs/fact-checks/canary/fact-check-canary.md` (`cli.ts:27`), outside the gate's glob.
- The registry globs: `docs/fact-checks/*.md` excluding `*.recheck.md` (`registry.ts:298`), and `docs/fact-checks/*.recheck.md` (`registry.ts:299`). `cli.ts:60` globs `docs/fact-checks/**/*.md` for the commands.
- Current folder: 24 `.md` files directly in `docs/fact-checks/` (18 full reports and 6 re-checks: `firewalls.recheck.md`, `what-is-imap.recheck.md`, `what-is-smtp.recheck.md`, `what-is-ssh.recheck.md`, `what-is-tls.recheck.md`, `what-is-udp.recheck.md`) and the `canary/` folder. Listed by `ls docs/fact-checks`.
- Header: the first fenced block whose info string is exactly `json fact-check` (`report.ts:13`, `report.ts:75`: `HEADER = /^```json fact-check[ \t]*\r?\n([\s\S]*?)\r?\n```/m`). Its schema is `reportHeaderSchema` (`report.ts:31-52`), strict: `slug`, `hash`, `checked`, `checker`, `verdicts` (per key), `sources` (`id`, `current`, `checked`, optional `note`), `overrides` (required array of `{ limit, reason }`, `report.ts:42`), and the optional `quotes`, `items`, `limits` records (`report.ts:43`, `:49`, `:51`).
- Verdicts: `VERDICTS = ['✅', '⚠️', '❌']` (`report.ts:10`). Schema: `z.record(z.string(), z.enum(VERDICTS))` (`report.ts:39`).
- Re-check header: `recheckHeaderSchema` (`report.ts:60-72`): `slug`, `base` (the full report's hash), `hash`, `checked`, `checker`, `verdicts`, `sources`, optional `quotes`; no `overrides`, no `items`.
- Form written by the fact-checker: `.claude/agents/fact-checker.md:146-192`. The claim heading is `### <key> — <verdict>` (quotes.ts:29 `CLAIM_HEADING`).

### 1.5 The quote record, and the script that confirms quotes

- The record is the header's optional `quotes` object: `{ checked, count, digest, files }` (`report.ts:19-26`, schema `quotesRecord`). `digest` is `quotesDigest(quotes)` (`quotes.ts:175`); `files` maps each quoted source id to the SHA-256 of its file's text (`quotecheck.ts:250`).
- The quote check `checkQuotes` (`quotecheck.ts:180-255`):
  - each quote's source must have one file in the folder named `<id>.txt`, `<id>.html` or `<id>.xml` (`quotecheck.ts:27`, `:192-197`; the message at `:195`: `The folder has no file for the source "${source}"; save it as ...`);
  - `.txt` is read as is, the others through `pageText` (`quotecheck.ts:201`);
  - a passage is split at `…`, `...`, `[…]` or `[...]` (`quotecheck.ts:61`); each part must have at least two words (`quotecheck.ts:217-221`) and at most 600 characters (`LONGEST_PART = 600`, `quotecheck.ts:66`, `:222-226`); each part must be found in the file in order (`missingPart`, `quotecheck.ts:90`, `:227-236`);
  - every item that passes and has citations needs a quote (`keysMissingQuotes`, `quotecheck.ts:111`; message at `:240`);
  - on success: `record.checked` is the report's day or today (`quotecheck.ts:247`); an `items` record is written only for a full report whose hash is the sheet's (`quotecheck.ts:252-254`).
- The command: `npm run fact-check -- <slug> --quotes <folder>` (`cli.ts:118-135`). It writes the report only when `result.report` is set (`cli.ts:127-128`) and prints `Quotes OK: <n> quotes in <k> sources; record written to <path>` (`cli.ts:129`).
- The gate's rules on the record (`gate.ts:60-97`): the header must have `quotes` (`gate.ts:66`, message "the quotes have not been confirmed against the sources"); the digest and count must match the report's quotes (`gate.ts:69-75`); the `files` keys must be exactly the sources the quotes name (`gate.ts:76-86`); `record.checked` must not be before the header's `checked` (`gate.ts:87-89`); each passing keyed item with citations needs a quote (`gate.ts:90-95`).

### 1.6 The re-check file, and its limits

- File: `docs/fact-checks/<slug>.recheck.md` (`recheck.ts:15-17`), with the header of `recheckHeaderSchema` (`report.ts:60-72`).
- Constants: `NEAR_PASS_MAX_FAILING = 3`, `RECHECK_MAX_ITEMS = 12` (`recheck.ts:10`, `:12`).
- Near-pass: `nearPass(verdicts)` is ok when no more than 3 verdicts are not ✅ and none is ❌ (`recheck.ts:20-24`).
- Items to judge: `itemsToJudge(items, sheet)` (`recheck.ts:158-172`): the items whose hash differs from the full report's `items` record (matched by key, with moves allowed, `matchItems` `recheck.ts:110`), the items that trace to a changed Learn part (`recheck.ts:164`), questions with a changed part (`recheck.ts:165-166`), and every `unbacked` item when a Learn part changed or was removed (`recheck.ts:167-168`). Matched by `LEARN_ID` (`recheck.ts:175`) and `QUESTION` (`recheck.ts:75`) patterns, which read Learn and practice keys.
- Gate rules for a pair (`gate.ts:100-111` lists 8 rules; code `gate.ts:112-184`). The `items` record and `limits` hash are required (`gate.ts:139`); the re-check's keys must be exactly the items to judge, at most 12 (`gate.ts:143-152`, `:151`); every re-check verdict passes (`gate.ts:154-157`); the full report must pass for every item not re-checked (`gate.ts:160-168`); `limits` must match the lesson's overrides (`gate.ts:170`); `base` must equal the full report's hash (`gate.ts:127-131`).
- Commands: `npm run fact-check -- <slug> --recheck` prints the re-check sheet (`cli.ts:111`, `:161-177`), or refuses with the reason: no full report, no items record, not a near-pass, nothing changed, overrides changed, more than 12 items (`cli.ts:164-176`). `--recheck --quotes <folder>` (`cli.ts:118-130`) and `--recheck --check` (`cli.ts:112-117`).
- `--stamp` writes only the `items` and `limits` records into a full report at the sheet's hash (`cli.ts:142-158`; `quotecheck.ts:170`).

### 1.7 The gate: what a lesson needs to build

- The registry runs the gate when it loads: `checkFactCheckReports(Object.values(lessonsBySlug), reports, undefined, undefined, rechecks)` (`registry.ts:300`), wrapping `checkFactChecks` (`registry.ts:263-276`). Then `checkUnpathedContent(GLOSSARY, tracks)` (`registry.ts:301`).
- `checkFactChecks` (`gate.ts:209-226`) checks only the lessons with `origin === 'cited'` (`gate.ts:212`). Each goes through `checkReport` (no re-check file, `gate.ts:27-52`) or `checkPair` (`gate.ts:112-184`). It also refuses a report or re-check that no cited lesson owns (`gate.ts:219-224`): "a fact-check report with no cited lesson ... delete it, or fix its file name."
- `checkReport` requires: a report at the path (`gate.ts:28`); the header readable (`gate.ts:30`); the slug equal to the sheet's (`gate.ts:31`); the hash equal to the sheet's (`gate.ts:32-34`); a verdict for every key and no verdict for an unknown key (`gate.ts:36-40`); every verdict ✅ (`gate.ts:41-44`); every sheet source listed and `current` (`gate.ts:45-50`); the quote rules above (`gate.ts:51`).
- `refuseOrWarn` (`registry.ts:289-295`): when the mode is not `development`, the build and the tests throw; under `astro dev` it warns (`registry.ts:292-294`).
- Legacy lessons are exempt: the CLI refuses a slug on the legacy list (`cli.ts:103-105`); the gate ignores anything not `origin: 'cited'` (`gate.ts:212`); `Lesson` carries `origin: 'cited' | 'legacy'` (`schema.ts:488`).

### 1.8 Every place that assumes "a lesson slug"

File:line, what it assumes.

- `scripts/fact-check.mjs:2-7`: usage `npm run fact-check -- <slug>` and the `--check`, `--quotes <folder>`, `--stamp`, `--recheck` forms.
- `cli.ts:10-17`: the module comment on the forms, "`-- <slug>`" throughout.
- `cli.ts:26-28`: `CANARY_SLUG = 'fact-check-canary'` and the canary paths.
- `cli.ts:31`: `getLesson(slug: string): Promise<Lesson | undefined>`.
- `cli.ts:44-48`: `USAGE`, with `<slug>` in each line.
- `cli.ts:59`: `import.meta.glob<Lesson>(['../lessons/*.ts', '!../lessons/*.test.ts'])`: only `src/content/lessons/<slug>.ts` can be loaded.
- `cli.ts:64-66`: `getLesson` maps the slug to `../lessons/${slug}.ts`.
- `cli.ts:87-88`: the first positional argument is the slug, and it must be the only one.
- `cli.ts:92-93`: `reportPath(slug)` and `recheckPath(slug)`.
- `cli.ts:94-99`: the canary branch, keyed on `slug === CANARY_SLUG`.
- `cli.ts:101-102`: `No lesson "${slug}".` (the message when the file is missing).
- `cli.ts:103-104`: `"${slug}" is still on the legacy list; move it to the cited shape before checking it (docs/content-model.md §4).`
- `cli.ts:109`: `claimSheet(lesson, sources)`.
- `cli.ts:148`, `cli.ts:167`: "is the report for ... not ..." slug mismatch messages.
- `cli.ts:172`: `npm run fact-check -- ${sheet.slug} --check`.
- `gate.ts:22-23`: `reportPath(slug)` returns `docs/fact-checks/${slug}.md`.
- `gate.ts:28`, `:31`, `:33`, `:64`, `:119`, `:126`, `:139`: messages that name `sheet.slug`; `:64` builds `run npm run fact-check -- ${sheet.slug}`.
- `gate.ts:209`: `checkFactChecks(lessons: readonly Lesson[], ...)`; `:210-211` and `:216`: reports keyed by slug (`slugOf`, `gate.ts:199-202`).
- `gate.ts:220`, `:223`: messages "a fact-check report with no cited lesson "${slug}"".
- `gate.ts:242`: a message naming `track ... lesson "${l.slug}"` (the objective-mapping refusal).
- `sheet.ts:36`, `:171`: `ClaimSheet.slug`, taken from `lesson.slug`; `sheet.ts:41`: the hash covers the slug.
- `sheet.ts:146`: `claimSheet(lesson: Lesson, ...)`.
- `report.ts:32`, `:61`: `slug` in both headers, and `gate` and `cli` compare it to the sheet's.
- `recheck.ts:15-16`: `recheckPath(slug)`. `recheck.ts:197-198`: the `noItems` message names `${slug}`. `recheck.ts:220`: `# Re-check sheet: ${sheet.slug}`.
- `quotes.ts` and `quotecheck.ts`: no slug; the quote check gets `sheet` and reads its `items`.
- `registry.ts:298-299`: globs of `docs/fact-checks/*.md` and `*.recheck.md` (the names are the slugs).
- `test-helpers.ts:14`, `:23`, `:95`, `:113`: `slug: sheet.slug`, `# Fact check: ` + slug.
- `docs/content-model.md` §8 (lines 230-311) and `.claude/agents/fact-checker.md:23`, `:41`, `:44`, `:201`, `:205`: the agent's commands name `<slug>`.

## 2. The refusal

### 2.1 The code

`src/content/factcheck/gate.ts:228-247`, verbatim:

```ts
const NO_PATH = 'has no fact-check path yet: the build refuses';
const DECISION = 'until one is built (docs/direction.md, decision 2.16)';

/**
 * Content of a kind no fact-check covers yet is refused outright: every glossary entry and every objective mapping of a
 * certification track. Both carry citations, but there is no claim sheet for them; the path is built by the job that
 * first needs one. `glossary` and `tracks` are arguments so a test can pass some.
 */
export function checkUnpathedKinds(glossary: readonly GlossaryEntry[], tracks: readonly Track[]): string[] {
  const issues = glossary.map((e) => `glossary entry "${e.id}" ${NO_PATH} glossary entries ${DECISION}`);
  for (const t of tracks) {
    if (t.type !== 'certification') continue;
    for (const part of t.parts) {
      for (const l of part.lessons) {
        for (const o of l.objectives) issues.push(`track "${t.id}", lesson "${l.slug}", objective ${o.exam} ${o.objective} ${NO_PATH} objective mappings ${DECISION}`);
      }
    }
  }
  return issues;
}
```

`src/content/registry.ts:277-287`, verbatim (the doc comment is at 272-276):

```ts
export function checkUnpathedContent(
  glossary: readonly GlossaryEntry[],
  trackList: readonly Track[],
  mode: string = import.meta.env.MODE,
): void {
  refuseOrWarn(
    checkUnpathedKinds(glossary, trackList),
    mode,
    'astro dev goes on; npm run build and the tests refuse these entries until a fact-check path is built for their kind (docs/direction.md, decision 2.16).',
  );
}
```

`refuseOrWarn` (`registry.ts:289-295`): `const message = \`Fact checks:\n- ${issues.join('\n- ')}\`;` then `if (mode !== 'development') throw new Error(message);` (line 292), else `console.warn` (line 293). Call at `registry.ts:301`: `checkUnpathedContent(GLOSSARY, tracks);`.

### 2.2 The messages it produces

- Glossary entry (gate.ts:237): `glossary entry "<id>" has no fact-check path yet: the build refuses glossary entries until one is built (docs/direction.md, decision 2.16)`.
- Objective mapping (gate.ts:242): `track "<track id>", lesson "<slug>", objective <exam> <objective> has no fact-check path yet: the build refuses objective mappings until one is built (docs/direction.md, decision 2.16)`.
- Thrown text (registry.ts:291): `Fact checks:` then one `- ` line per issue.

### 2.3 The tests

- `src/content/factcheck/gate.test.ts:166-181`:
  - line 166, `test('no glossary entries and no objective mappings give no problem')`: `checkUnpathedKinds([], [])` is `[]`;
  - line 170, `test('a glossary entry is refused with its id')`: `checkUnpathedKinds([entry('router')], [])` equals the message above (line 172-174);
  - line 176: `test('an objective mapping is refused, naming its track, lesson and objective')`; it checks the message `...objective EX-101 2.6 has no fact-check path yet` and the end `the build refuses objective mappings until one is built (docs/direction.md, decision 2.16)` (line 180).
- `src/content/registry.test.ts:484-494` (the test title is at line 484): `'a glossary entry or an objective mapping stops the build and the tests, and astro dev warns'`. It expects a throw in `production` and `test` modes (line 487-488), no throw with no entries (line 490), and a warning, not a throw, in `development` (lines 492-494).
- `src/content/glossary.test.ts:104-106`, `'the glossary starts empty and valid'`: `expect(GLOSSARY).toEqual([])`.

### 2.4 What the docs say a path must have

- `docs/content-model.md:305`: "The gate also refuses, outright, the kinds of cited content that have no fact-check path yet (`checkUnpathedKinds`): every glossary entry and every objective mapping of a certification track. None exists today. The first job that needs one builds its path and removes the refusal for it (`docs/direction.md`, decision 2.16)."
- `docs/direction.md:44` (decision 2.16, full row): "**Phase 3 checks quotes by script, and guards the kinds it has no path for** (2026-11-11; `plan.md` has the formats). A report's quotes become data, a script confirms each passage is in the source text the checker fetched, and the build needs the record that script writes. Glossary entries and objective mappings get no checking path yet: none of either exists, so a path could not be tried on anything; the build refuses them until a job needs them and builds one. Sources are not committed: several are copyrighted and the repo is public."
- `docs/direction.md:112`: "Glossary entries and objective mappings are refused by the build until a fact-check path is built for them (decision 2.16)."
- `docs/direction.md:117` (Phase 3 status): "refuses any glossary entry or objective mapping outright until a path is built for that kind (decision 2.16)."
- `plan.md:21` (the job plan): "**A fuller glossary is already provided for, and is empty.** ... None exists, and the build refuses any until a fact-check path is built for that kind (direction 2.16)."
- Result: neither doc says what the path must contain. Decision 2.16 says only that it is built "by a job that needs one" and that the build "needs the record that script writes" for lessons. `plan.md` is named as holding "the formats" (direction.md:44), but `plan.md` contains no glossary format (grep for "glossary" finds only lines 5, 11, 12, 21, 27, 28, 30, 31, 34, 35, 38, 46, 47, 50, 79, 84, 90, 91, 97, 98).
- Decision 2.38 (`docs/direction.md:67`), the current Phase 5 plan: the page "reads them from the registry and keeps no copy, so every word on it has passed a fact-check and no new kind of check is needed." It also says: "The glossary of 2.16, with definitions written and cited for it, and links from a lesson's words to it, stay after the revamp."

### 2.5 What the gate would do with a glossary report today (facts from the code)

- A report for a glossary entry placed at `docs/fact-checks/<slug>.md` is read by the registry glob (`registry.ts:298`) and refused as "a fact-check report with no cited lesson" (`gate.ts:219-221`), because `checkFactChecks` only owns cited lessons (`gate.ts:212`, `:218`).
- The claim sheet cannot be built for an entry: `claimSheet` takes a `Lesson` (`sheet.ts:146`), and `runFactCheck` only loads `src/content/lessons/<slug>.ts` (`cli.ts:59`, `:64-66`) or the canary (`cli.ts:94`). `npm run fact-check -- <entry id>` prints `No lesson "<id>".` (`cli.ts:102`).
- The report header requires an `overrides` array (`report.ts:42`), which a glossary entry does not have; `overrides` on a lesson is `Lesson['overrides']` (`sheet.ts:40`, `schema.ts:408`).
- `reportHeaderSchema.verdicts` is keyed by sheet key (`report.ts:39`); a glossary entry would need its own key scheme.

## 3. The glossary as coded

### 3.1 `src/content/glossary.ts` (71 lines), outline

- Header comment, lines 7-11: "The glossary (direction doc §6.5): terms, each with a cited definition (§3.1). A definition is one or more statements; each cites a primary source at its section or is flagged as an analogy, never both, and at least one cites. Entries arrive with the lessons that cite them (§10 tasks 4–6); the page and the term links are §10 task 7."
- Imports (1-5): `zod`; `statementIssue`, `twoSourceIssue` from `./cited`; `slugSchema`, `text` from `./primitives`; `statementSchema` from `./schema`; `checkCitation`, `SOURCES`, `SourceRegistry` from `./sources`.
- Schema, line 13: `export const glossaryEntrySchema = z.strictObject({ id: slugSchema, term: text, definition: z.array(statementSchema).min(1) });`
- Types: `GlossaryEntry` (line 14, `z.infer`), `GlossaryEntryInput` (line 16, `z.input`: an analogy statement may leave out `cite`).
- `defineGlossary(entries, sources = SOURCES)` (line 23) returns the parsed entries or throws `Invalid glossary:` with every issue (line 66).
- Value, line 71: `export const GLOSSARY: GlossaryEntry[] = defineGlossary([]);`, with the comment on line 70: "Empty until the lessons that cite its terms arrive (direction doc §10 tasks 4–6)."

### 3.2 Every rule `defineGlossary` enforces

Each rule with its line.

1. Entry shape: `glossaryEntrySchema.safeParse` (line 31). Strict object: no extra keys (`z.strictObject`). Issues are prefixed `entry "<id>"` or `entry #<n>` (lines 30, 34-35).
2. `id` is `slugSchema` (primitives.ts:12): "must be lowercase words joined by hyphens" (regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`).
3. `term` is `text` (primitives.ts:9): "must not be empty", regex `/\S/`. No maximum length.
4. `definition` is an array of `statementSchema` with `min(1)` (line 13).
5. Unique ids: `Duplicate glossary id "<id>"; give each entry its own id.` (line 41).
6. Terms unique ignoring case after `trim()` (line 43): `entry "<id>" defines "<term>", which entry "<id>" already defines as "<term>"; terms are unique ignoring case, so keep one entry per term.` (lines 47-49).
7. Per statement (line 52): `statementIssue(s)` (cited.ts:48-54): both cited and `analogy`, or neither cited nor `analogy`. Messages: "both cited and flagged as an analogy; ..." and "no citation; cite a source or flag it as an analogy."
8. Per cited statement, when not an analogy (line 52): `twoSourceIssue(s.cite, sources)` (cited.ts:117-120) returns the issue "rests on one source ..." unless a citation is `defining: true` or `independentSources` counts 2 or more (cited.ts:102-110). That count gives each `vendor` source the key `vendor:<publisher>` and every other source its own id, so two vendor pages from one publisher count once.
9. At least one cited statement per entry (lines 55-57): `the definition needs at least one cited statement; an analogy alone cannot define a term.`
10. Every citation: `checkCitation(c, sources, 'content')` (line 60; sources.ts:2731-2754): shape; source in the registry; a `cert-objectives` source is refused for content (sources.ts:2737-2739); URL and label must equal what `cite()` rebuilds (sources.ts:2747-2751).
11. Every problem is reported at once, in one error (lines 24-25, 66).

Message prefixes are `entry "<id>": definition[<j>] ("<statement id>"): ...` (line 53) and `entry "<id>": definition[<j>] ("<statement id>"), citation <n>: ...` (line 61).

### 3.3 The statement schema it uses (schema.ts:58-64)

```ts
export const statementSchema = z.strictObject({
  id: slugSchema,
  text,
  cite: z.array(citationSchema).default([]),
  analogy: z.literal(true).optional(),
});
```

Citations: `citationSchema` (sources.ts:2688-2694): `source` (slug), `section` (text), `url` (https), `label` (text), `defining` (`true` only, optional). Built only by `cite()` (sources.ts:2703-2706).

### 3.4 `glossary.test.ts` (106 lines): what it covers

Eleven tests (`test(` count), at the lines shown:

- 16 `a definition statement with one source fails` (two-source rule).
- 21 `a cited entry is valid and comes back as written`.
- 25 `a definition needs a cited statement`.
- 31 `an analogy may help a cited definition, and comes back with an empty citation list`.
- 36 `every statement is cited or flagged as an analogy, never both`.
- 45 `ids are unique`.
- 51 `terms are unique ignoring case`.
- 57 `every citation is checked: content only, and as the registry builds it` (includes an objectives citation, a wrong label, an unknown source).
- 70 `the shape is checked: a bad id, an empty term, no definition, an unknown key`.
- 84 `every problem is reported in one error` (exact message, lines 93-101).
- 104 `the glossary starts empty and valid`.

It uses `FIXTURE_SOURCES` and `OBJ_URL` from `src/content/test-fixtures.ts` (line 4), not the real registry, so its citations are fixtures (`rfc-example`, `RFC 9999 §2.1`).

### 3.5 Every importer of `GLOSSARY`

- `src/content/registry.ts:8`: `import { GLOSSARY, type GlossaryEntry } from './glossary';`, and `registry.ts:301`: `checkUnpathedContent(GLOSSARY, tracks);`. This is the only runtime use outside the test file.
- `src/content/glossary.test.ts:2` imports `GLOSSARY`; used at line 105.
- `src/content/factcheck/gate.ts:1` and `src/content/factcheck/gate.test.ts:4` import only the type `GlossaryEntry`.
- `src/content/glossary.ts:71` defines it.
- No page, component or `src/lesson/` file imports `glossary` (grep of `src/lesson`, `src/pages`, `src/lib` for "glossary" returns nothing).

### 3.6 `docs/content-model.md` §6, quoted (lines 204-208)

Line 204: `## 6. The glossary`.
Line 206: "`defineGlossary` in `src/content/glossary.ts` holds `GLOSSARY`. Each entry is `{ id, term, definition }`, and `definition` is a list of statements like a lesson's. Each statement cites or is an analogy, never both, and at least one cites. A statement that cites follows the two-source rule (section 3). Ids are unique, and terms are unique ignoring case."
Line 207 (an invented example): `{ id: 'lease', term: 'Lease', definition: [{ id: 'lease-1', text: 'A lease is an address lent for a limited time.', cite: [cite('rfc-example', '2.1')] }] }`, under the comment "Invented example: no id, section, address or objective here is a checked citation."
Line 93 (§3, glossary statements in the two-source rule): "**Two sources** (owner, 2026-11-08). Each part that must cite, glossary statements included, needs either:"
Line 95 (§3): "a citation marked as the defining standard (section 2)." Line 20: "Every claim needs two independent sources, or one that is its defining standard (section 3)."

### 3.7 The first direction document, `docs/superpowers/specs/2026-11-07-techconcepts-direction.md`

Searched for "6.5", "glossary", "Glossary", "term link". Lines:

- line 39: `| Glossary definitions (§6.5) | **Required** |` (the table of launch requirements).
- line 77: "It runs on **every PR that changes lesson content**, glossary entries or objective mappings."
- line 124: "Both tracks take definitions from the **same cited glossary entries** (§6.5), so they can't contradict each other."
- lines 162-166 (section "### 6.5 Glossary and concept links (owner, Q27)"):
  - "- A **glossary** of terms, each with a cited definition."
  - "- Terms inside lessons (e.g. \"MAC address\" in DHCP) link to that concept's lesson, or to its glossary entry."
  - "- Each lesson shows **\"Builds on\"** and **\"Leads to\"**."
- line 207: "| Launch spec §7.4: at least 1 reference per lesson | Every Learn statement, Go-deeper paragraph, Practice explanation, glossary definition, OSI badge and objective mapping cites a primary source. Watch traces to Learn | Q5, Q10, Q17, Q26 |"
- line 223: "2. **Content model** (§3.1, §4): source registry; citations on Learn, Go deeper, Practice and glossary; ..."
- line 228: "7. **Site and UX changes** (§6.1, §6.2, §6.4, §6.5, §6.6, §3.3): Home, time removal everywhere, sources and Verified stamps, OSI badge rule, glossary and Builds on / Leads to, Practice review list, console declutter."

No word limit, no id rule beyond the slug, and no link from a lesson's term to a glossary entry appears in the first document's text beyond §6.5 line 165 (a plan, not a rule).

### 3.8 Word limits, id rules and links in the schema today

- Word limit: none. `text` is `/\S/` only (primitives.ts:9). The glossary has no maximum on `term`, `definition` count, statement `text`, or the number of entries.
- Id rule: `slugSchema` (primitives.ts:12) for the glossary entry `id` (glossary.ts:13) and for each statement `id` (schema.ts:60). The same slug rule governs Learn term ids (`termSchema`, schema.ts:333).
- Term-to-glossary link: none. `termSchema` (schema.ts:332-338) has `id`, `idea`, `name`, `cite`, `analogy`, and no reference to any glossary id. `Rich` (src/lesson/Rich.tsx:3, 10-18) turns only `**text**` into bold. The word "glossary" appears in lesson files only inside citation section labels (for example `subnetting.ts:255`, `subnetting.ts:622`, `what-is-ftp.ts:81` (`cloudflare-spectrum-glossary`), `firewalls.ts:57`), and in `sources.ts:2025` (the source `cloudflare-spectrum-glossary`), which are vendor pages, not links to `GLOSSARY`.

## 4. The fact-checker agent and the briefs

Every line that assumes the thing checked or written is a lesson. Quoted in part; the line number is the file's.

### 4.1 `.claude/agents/fact-checker.md` (213 lines)

- 3 (description): "Independent fact-checker for TechConcepts lessons. Give it a lesson slug and nothing else about the lesson (and the folder to work in, when the lesson is in a worktree)."
- 12: "You never saw the lesson being written. You judge only its claim sheet and its sources, and nothing else."
- 14: "A lesson for beginners simplifies: a sentence that is only less exact than its source is not a fault..."
- 16: "You are given a slug and nothing else about the lesson. When the lesson is being moved in a git worktree, your prompt also names that folder..."
- 17: "- the lesson's source file, its tests, or any other file under `src/`..." (the lesson's file is forbidden to the checker).
- 23: "Then run `npm run fact-check -- <slug>`..." (step 1).
- 41, 44: "`npm run fact-check -- <slug> --quotes ...`", "`npm run fact-check -- <slug> --check`".
- 56: "A part, such as a Go deeper paragraph or a Practice option's feedback, may make several claims..." (lesson part types; "A Practice option's content includes `right`").
- 71: "its 'only', 'never', 'always' or 'every' rules out something that is itself common, or that another part of this lesson teaches;" (assumes the lesson's other parts).
- 116: "**The OSI badge.** An `osi` item with layers is a claim that the topic sits at those layers..." (a lesson-only item kind).
- 122: "**Traced** (Watch steps, step facts, events, packets, the scene, the Overview and the summaries). Each item's `Traces:` line names the Learn parts it repeats..." (Watch, Learn, Overview).
- 123-129: "**Example.**" (scene data).
- 132: "**Unbacked** (the title, the unit name and each question's prompt). It makes no claim beyond the lesson's cited parts..."
- 130: "A statement about how things work is not example data. It must trace instead..."
- 133?: none.
- 148-160: the header (`"slug": "<the slug>"`).
- 162-164: `verdicts` and `overrides` (`"overrides": [{ "limit": ...}]`, "copies the sheet's limit overrides").
- 169: "its key, its text and its verdict" (item kinds claim/osi).
- 177: example key `units[0].steps[0].deep[0] (step "application", Go deeper) — ✅` (a lesson-only key form).
- 199-206: targeted re-check section: "When your prompt says "re-check" and a slug..." (199); "Judge only the items under "Items to judge"..." (202) with "the Learn parts it traces to", "a question is judged whole: its prompt and every option..." (202); "Write the report ... the header has `slug`, `base`..." (204); "`docs/fact-checks/<slug>.recheck.md`" (201).
- 208-213: "Never" list; 210: "Change any file except the report."

### 4.2 `.claude/agents/author.md` (62 lines): written for lessons

- 3: "Moves one lesson to the cited shape. Give it the lesson's slug and the branch."
- 9: "You move one lesson from the legacy shape to the cited shape, from a fresh context... A wrong lesson is worse than a missing one."
- 13: "Read `CLAUDE.md`, `docs/content-model.md` (...), the lesson's file, and a worked example: `src/content/lessons/what-is-udp.ts` for a How the Internet Works lesson, `src/content/lessons/osi-model.ts` for a Networking one, ..."
- 15: "Your brief comes with an analyst's report: every idea the lesson teaches..."
- 21: "Start from the lesson's own references."
- 25-31, "## The lesson's words": 27 "The lesson teaches a beginner, in order, with one idea at a time"; 28 "Change a sentence only when..."; 31 "Every Watch step, fact and event traces to the Learn statement that carries its source."
- 33-42, "## The six faults to sweep for": 35 "Every fact-check of the first two lessons..."; 37-42 items named "Outside the section", "A defining marker that does not belong", "An absolute...", "Stronger or weaker than what it rests on", "A name nothing gives" (a Watch part), "A trace that is missing" (Learn parts, log rows, "the traced item"); 42 "What is HTTP's first nineteen failures".
- 46: "One lesson, on the branch you were given: the lesson's file with `defineLesson`, its slug out of `LEGACY_LESSONS`, its sources in `SOURCES`, and the tests that name it."
- 50-51: "`npm run fact-check -- <slug>` prints the claim sheet..." and "The build and the tests refuse a cited lesson until its fact-check report passes..."
- 52: "Commit on the branch: `type: a sentence saying what is now true`..."
- 56-62: report items: "Every reader-visible sentence you changed"; "Done when every item on the claim sheet has a citation ... and the report lists every changed sentence."
- Also 'LEGACY_LESSONS' at 46 names a lesson-only list (`src/content/legacy.ts`).

### 4.3 `.claude/agents/analyst.md` (26 lines)

- 3 (description): "Give it the question and the lesson's slug. It reports what the sources say, where, and how a beginner's lesson can say it truthfully."
- 10: "You answer one hard question about a concept a lesson teaches, from a fresh context... The author writes the lesson; you say what is true and where it is written."
- 23: "**For the lesson**: two or three ways to say it truthfully at a beginner's level..."

### 4.4 `docs/briefs/` (four files, 141 lines in total)

`analyst-read-before-check.md` (25 lines):
- 3: "The author has moved your lesson to the cited shape in its worktree. A fresh fact-checker, who has seen nothing but the lesson, will now judge every item on its claim sheet."
- 7: "In the worktree, run `npm run fact-check -- <slug>` and read the whole sheet..."
- 14: "Check the fixes do not break the lesson's shape or a shared wording the orchestrator ruled."
- 20: "Two of three lessons were a near-pass with three items each..."
- 22: "The item `units[0].backing` shows the protocol's full name ... A Learn part on its traces must state that expansion ... placed at the end of `learn.facts`."
- 23: "An Overview fact or a step that says a thing is kept, sent or listed somewhere..."
- 24: "A step's narrative that explains by contrast or names an idea..."
- 25: "A number or port in a cited sentence..."

`analyst-report.md` (58 lines):
- 1: "# The analyst's brief: every idea a lesson teaches"
- 3: "You are the analyst for one lesson of the track How the Internet Works. The lesson is in the legacy shape..."
- 5: "Your prompt names the lesson, its slug, its unit id and what is special about it."
- 10: "`.claude/agents/author.md`: "The lesson's words" and "The six faults to sweep for"."
- 11: "`docs/direction.md`, the rows 2.23, 2.24, 2.26 and 2.28 ... what earlier lessons settled."
- 12: "The lesson's file, whole."
- 13: "The scout's report your prompt names... Read a checked lesson only at the lines listed there..."
- 18: "**One row for every idea the lesson teaches a reader**, in the order of the file. That is every piece of reader-facing text: the unit's name, full name, purpose and OSI layer; the Overview's hook, description and facts; the scene's title, labels and parties; each step's title, narrative..., each event's summary, info line and log fields..., each table's title and each row's cells; Learn's lead, terms, pattern names and note, why, Go deeper and facts; each question's prompt, options and feedback."
- 39: "**A Watch sentence's every phrase needs a Learn part.** ... In 'Watch to Learn', go phrase by phrase..."
- 46: "**Watch to Learn.** The fact-checker passes a Watch item (a step's text, a fact, an event, a log field, a status) only when everything it shows is stated by a Learn part it traces to..."
- 47: "**Page cues.** For each `page:` cue, what the story has fetched by that event..."
- 48: "**Shape.** ... The plan keeps the lesson's steps, events, tables, scene and two questions as they are..."
- 53-54: "Save every source you fetch in `.superpowers/analysis/<slug>/sources/`..." and "Write the report to `.superpowers/analysis/<slug>/report.md`."

`author-lesson.md` (47 lines):
- 3: "Your standing instructions (`.claude/agents/author.md`) hold. This file adds what the jobs so far have settled; your prompt names the lesson, its worktree and its branch."
- 13: "The analyst's report: `<the main folder>/.superpowers/analysis/<slug>/report.md`..."
- 19: "**The lesson's shape:** its Watch steps and their order, every event, every table and row, the scene (title, labels, parties, layers, start), and the two questions with their option counts and answers."
- 20: "**Words a test holds** (step titles, pattern names, table cells, parties, scene title and labels, and any pointer to another lesson such as ...)"
- 26: "The lesson's file: `defineLesson`, in the form of `src/content/lessons/what-is-icmp.ts` and `what-is-dhcp.ts`..."
- 27: "`src/content/legacy.ts`: your slug's line goes. `src/content/legacy.test.ts`: the count in the title and your unit id in the filter."
- 37: "`npm run fact-check -- <slug>` prints the sheet with no error; ..."
- 40: "Keep your working notes: after the lesson passes its check you will be asked for its section of the track's report..."
- 42-47: "## What batch 3 taught (added for batch 4)": 44 "**A new Learn fact goes at the end of `learn.facts`.**"; 45 "**The unit's full name needs a Learn part.**"; 46 "**Read each traced item clause by clause...**"; 47 "`npx vitest run --mode development`... Only `src/lib/checked.test.ts` should fail."

`author-track-section.md` (11 lines):
- 1: "# Your lesson's section of the track's report"
- 3: "Your lesson has passed its fact-check. The owner reads one report of every changed sentence of the six lessons of batches 3 and 4."
- 5: "- Write it to `<the main folder>/.superpowers/track-report/<slug>.md`..."
- 6: "- Compare the lesson as it was (`git show revamp:src/content/lessons/<slug>.ts`)..."
- 7: "- The form is `docs/lesson-changes/what-is-icmp.md`... start with `## <Lesson title>`... `### The changes to look at first`..."

Not lesson-specific: the claim-sheet and report rules in `fact-checker.md` 146-192 use "item", "key", "part"; `docs/content-model.md` §8 (230-311) uses "lesson" throughout. Not required.

## 5. Terms in the lessons

### 5.1 (a) How Learn draws a term

`src/lesson/Explanation.tsx:303-313` (verbatim, from the file):

            <ol className="explain__terms" aria-label="Terms">
              {learn.terms.map((term, i) => (
                <li key={i}>
                  <span className="explain__idea">
                    <Rich text={term.idea} />
                    <Marks cite={term.cite} numbers={numbers} />
                  </span>
                  <span className="explain__term">{term.name}</span>
                </li>
              ))}
            </ol>

Bold in the idea: `src/lesson/Rich.tsx:3` `const BOLD = /\*\*(.+?)\*\*/g;` and `Rich` (lines 10-18) renders `**text**` as `<b>`. So a Learn term's `idea` shows its bold words in bold, and its `name` is printed by the CSS below.

`src/lesson/console.css` (verbatim, lines 849-876):

```css
.explain__terms {
  margin: 0 0 18px;
  padding: 0;
  border-top: 1px solid var(--line);
  list-style: none;
}
.explain__terms li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 14px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
}
.explain__idea {
  color: var(--ink);
  font: 400 14.5px/1.45 var(--sans);
}
.explain__term {
  padding: 4px 6px;
  border: 1px solid var(--line-strong);
  border-radius: 2px;
  color: var(--ink-strong);
  font: 700 11px/1.2 var(--mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
```

In the layout: `.explain__terms` is a grid list, each `li` a two-column grid (`minmax(0, 1fr) auto`); `.explain__idea` is the everyday idea in 14.5px sans; `.explain__term` is the name in a bordered uppercase mono box, `white-space: nowrap`.

The Learn term's shape is `termSchema` (`src/content/schema.ts:332-338`): `id`, `idea`, `name`, `cite` (default `[]`), `analogy`. The comment at line 331 says: "Everyday idea first, then its name."

### 5.2 (b) Bold terms in the lessons

Method. Each file `src/content/lessons/*.ts` that is not a test (18 files: `dhcp.ts`, `firewalls.ts`, `osi-model.ts`, `subnetting.ts`, `what-is-dhcp.ts`, `what-is-dns.ts`, `what-is-ftp.ts`, `what-is-http.ts`, `what-is-https.ts`, `what-is-icmp.ts`, `what-is-imap.ts`, `what-is-ip.ts`, `what-is-pop3.ts`, `what-is-smtp.ts`, `what-is-ssh.ts`, `what-is-tcp.ts`, `what-is-tls.ts`, `what-is-udp.ts`) was searched for `\*\*[^*]+\*\*`. Lines that start as a comment (`/**`, `*`, `//`) are left out.

Counts:
- 242 occurrences of `**…**` in code lines (the file `$S/bold-code.tsv` in this session's scratchpad holds each with its file and line).
- 206 distinct strings, case-sensitive (the table below).
- 204 distinct ignoring case (`Layer 5, the Session Layer` and `layer 5, the Session Layer` are two rows, one term).
- Of the 204, 94 are among the Learn term names in `.superpowers/revamp/job-9/terms.tsv` (column 7, `name`, 152 data rows, 135 distinct names ignoring case), and 110 are NOT. The table's 206 rows: 94 "in terms.tsv", 112 "NOT in terms.tsv" (the 2 extra are the case pairs).
- 41 of the 135 Learn term names are not bolded in any lesson's prose.

Note on the table: the "lessons" column lists each file that marks the term, sorted as the file was read; count is occurrences across those files. Terms are shown as written. Comparison with `terms.tsv` is ignoring case, as asked. Rows with a leading space or a `+` (for example ` OK`, `+OK`) are as the lesson writes them.

Format: `term | count | lessons (file names without .ts) | in terms.tsv`.

| Term (as written) | Count | Lessons | In terms.tsv? |
|---|---|---|---|
| ` OK` | 1 | what-is-imap | NOT in terms.tsv |
| `+OK` | 1 | what-is-pop3 | NOT in terms.tsv |
| `.app servers` | 1 | what-is-dns | NOT in terms.tsv |
| `200 OK` | 2 | what-is-http what-is-https | NOT in terms.tsv |
| `993` | 1 | what-is-imap | NOT in terms.tsv |
| `995` | 1 | what-is-pop3 | NOT in terms.tsv |
| `a common way to represent the data` | 1 | osi-model | NOT in terms.tsv |
| `A record` | 1 | what-is-dns | in terms.tsv |
| `ACK` | 1 | what-is-tcp | in terms.tsv |
| `Acknowledge` | 1 | dhcp | in terms.tsv |
| `acknowledgement` | 1 | what-is-tcp | NOT in terms.tsv |
| `allow` | 1 | firewalls | NOT in terms.tsv |
| `application data` | 1 | what-is-tls | NOT in terms.tsv |
| `ARP` | 1 | what-is-ip | in terms.tsv |
| `AUTH` | 1 | what-is-smtp | in terms.tsv |
| `bits` | 2 | osi-model | NOT in terms.tsv |
| `borrowing bits` | 1 | subnetting | in terms.tsv |
| `broadcast` | 2 | what-is-dhcp what-is-ip | in terms.tsv |
| `broadcast address` | 1 | subnetting | in terms.tsv |
| `certificate` | 2 | what-is-https what-is-tls | in terms.tsv |
| `certificate authority` | 1 | what-is-tls | NOT in terms.tsv |
| `CertificateVerify` | 1 | what-is-tls | NOT in terms.tsv |
| `channel` | 1 | what-is-ssh | in terms.tsv |
| `cipher suites` | 1 | what-is-tls | NOT in terms.tsv |
| `client` | 2 | what-is-dhcp what-is-http | in terms.tsv |
| `ClientHello` | 1 | what-is-tls | in terms.tsv |
| `close_notify` | 1 | what-is-tls | in terms.tsv |
| `common way to represent the data` | 1 | osi-model | NOT in terms.tsv |
| `connection` | 2 | what-is-http what-is-tcp | NOT in terms.tsv |
| `connectionless` | 1 | what-is-udp | in terms.tsv |
| `connections` | 1 | firewalls | NOT in terms.tsv |
| `control connection` | 1 | what-is-ftp | in terms.tsv |
| `DATA` | 1 | what-is-smtp | in terms.tsv |
| `data connection` | 1 | what-is-ftp | in terms.tsv |
| `datagram` | 2 | osi-model what-is-udp | in terms.tsv |
| `decapsulation` | 1 | osi-model | in terms.tsv |
| `default deny` | 1 | firewalls | in terms.tsv |
| `default gateway` | 2 | subnetting what-is-ip | in terms.tsv |
| `DELE` | 1 | what-is-pop3 | in terms.tsv |
| `deny` | 1 | firewalls | NOT in terms.tsv |
| `destination address` | 1 | what-is-ip | NOT in terms.tsv |
| `destination unreachable` | 1 | what-is-icmp | in terms.tsv |
| `DHCP Acknowledge` | 1 | what-is-dhcp | NOT in terms.tsv |
| `DHCP Discover` | 1 | what-is-dhcp | NOT in terms.tsv |
| `DHCP Offer` | 1 | what-is-dhcp | NOT in terms.tsv |
| `DHCP Request` | 1 | what-is-dhcp | NOT in terms.tsv |
| `DHCP server` | 1 | what-is-dhcp | in terms.tsv |
| `dialogue` | 1 | osi-model | NOT in terms.tsv |
| `Discover` | 1 | dhcp | in terms.tsv |
| `DNS cache` | 1 | what-is-dns | in terms.tsv |
| `DNS query` | 1 | what-is-dns | NOT in terms.tsv |
| `DNS resolution` | 1 | what-is-http | NOT in terms.tsv |
| `DNS resolver` | 3 | what-is-dns what-is-http what-is-https | in terms.tsv |
| `duplicate ACK` | 1 | what-is-tcp | in terms.tsv |
| `echo` | 1 | what-is-ssh | NOT in terms.tsv |
| `echo reply` | 1 | what-is-icmp | in terms.tsv |
| `EHLO` | 1 | what-is-smtp | in terms.tsv |
| `encapsulation` | 2 | osi-model what-is-ip | in terms.tsv |
| `encrypted` | 2 | what-is-https | in terms.tsv |
| `end to end` | 2 | osi-model | NOT in terms.tsv |
| `errors` | 1 | osi-model | NOT in terms.tsv |
| `example.org` | 1 | what-is-smtp | NOT in terms.tsv |
| `FETCH` | 1 | what-is-imap | in terms.tsv |
| `FIN` | 1 | what-is-tcp | in terms.tsv |
| `Finished` | 1 | what-is-tls | in terms.tsv |
| `first rule that fits` | 1 | firewalls | NOT in terms.tsv |
| `flag` | 1 | what-is-imap | in terms.tsv |
| `folders` | 1 | what-is-imap | NOT in terms.tsv |
| `forwarding` | 1 | what-is-ip | in terms.tsv |
| `frame` | 1 | osi-model | NOT in terms.tsv |
| `GET /` | 2 | what-is-http what-is-https | NOT in terms.tsv |
| `header` | 2 | osi-model | in terms.tsv |
| `header 2` | 3 | osi-model | NOT in terms.tsv |
| `header 3` | 1 | osi-model | NOT in terms.tsv |
| `headers` | 1 | what-is-http | in terms.tsv |
| `host key` | 1 | what-is-ssh | in terms.tsv |
| `host portion` | 1 | subnetting | in terms.tsv |
| `HTML` | 1 | what-is-http | in terms.tsv |
| `https://techconcepts.app` | 1 | what-is-https | NOT in terms.tsv |
| `ICMP echo request` | 1 | what-is-icmp | NOT in terms.tsv |
| `IDLE` | 1 | what-is-imap | in terms.tsv |
| `image` | 1 | what-is-http | NOT in terms.tsv |
| `IP` | 1 | osi-model | NOT in terms.tsv |
| `IP address` | 2 | what-is-dhcp what-is-http | in terms.tsv |
| `IP header` | 1 | what-is-ip | in terms.tsv |
| `its own header` | 1 | osi-model | NOT in terms.tsv |
| `its twin` | 1 | osi-model | NOT in terms.tsv |
| `KEXINIT` | 1 | what-is-ssh | NOT in terms.tsv |
| `key pair` | 1 | what-is-ssh | in terms.tsv |
| `key share` | 1 | what-is-tls | in terms.tsv |
| `known_hosts` | 1 | what-is-ssh | in terms.tsv |
| `latency` | 1 | what-is-icmp | NOT in terms.tsv |
| `layer` | 1 | osi-model | in terms.tsv |
| `layer 1, the Physical Layer` | 1 | osi-model | NOT in terms.tsv |
| `Layer 2, the Data Link Layer` | 2 | osi-model | NOT in terms.tsv |
| `Layer 3, the Network Layer` | 2 | osi-model | NOT in terms.tsv |
| `Layer 4, the Transport Layer` | 2 | osi-model | NOT in terms.tsv |
| `Layer 5, the Session Layer` | 1 | osi-model | NOT in terms.tsv |
| `layer 5, the Session Layer` | 1 | osi-model | NOT in terms.tsv |
| `Layer 6, the Presentation Layer` | 1 | osi-model | NOT in terms.tsv |
| `layer 6, the Presentation Layer` | 1 | osi-model | NOT in terms.tsv |
| `layer 7, the Application Layer` | 1 | osi-model | NOT in terms.tsv |
| `Layers 1 to 3` | 1 | osi-model | NOT in terms.tsv |
| `Layers 4 to 7` | 1 | osi-model | NOT in terms.tsv |
| `lease` | 1 | what-is-dhcp | in terms.tsv |
| `lease renewal` | 1 | what-is-dhcp | in terms.tsv |
| `LIST` | 1 | what-is-pop3 | NOT in terms.tsv |
| `local delivery` | 1 | subnetting | NOT in terms.tsv |
| `LOGIN` | 1 | what-is-imap | NOT in terms.tsv |
| `lowest three layers` | 1 | osi-model | NOT in terms.tsv |
| `MAC address` | 1 | what-is-ip | in terms.tsv |
| `MAIL FROM` | 1 | what-is-smtp | NOT in terms.tsv |
| `method` | 1 | what-is-http | NOT in terms.tsv |
| `MX record` | 1 | what-is-smtp | in terms.tsv |
| `name server` | 1 | what-is-dns | NOT in terms.tsv |
| `NAT` | 1 | what-is-ip | in terms.tsv |
| `network address` | 2 | osi-model subnetting | in terms.tsv |
| `network addresses` | 1 | osi-model | NOT in terms.tsv |
| `network portion` | 1 | subnetting | in terms.tsv |
| `NEWKEYS` | 1 | what-is-ssh | NOT in terms.tsv |
| `Offer` | 1 | dhcp | in terms.tsv |
| `one link` | 2 | osi-model | NOT in terms.tsv |
| `OSI model` | 1 | osi-model | NOT in terms.tsv |
| `OSI Reference Model` | 1 | osi-model | NOT in terms.tsv |
| `packet` | 1 | osi-model | NOT in terms.tsv |
| `packet loss` | 1 | what-is-icmp | in terms.tsv |
| `padlock` | 1 | what-is-https | in terms.tsv |
| `PASS` | 2 | what-is-ftp what-is-pop3 | NOT in terms.tsv |
| `passive mode` | 1 | what-is-ftp | NOT in terms.tsv |
| `PASV` | 1 | what-is-ftp | NOT in terms.tsv |
| `path` | 1 | what-is-http | in terms.tsv |
| `peer layers` | 1 | osi-model | NOT in terms.tsv |
| `pieces` | 2 | osi-model | NOT in terms.tsv |
| `plain text` | 1 | what-is-ftp | in terms.tsv |
| `point-to-point` | 1 | subnetting | NOT in terms.tsv |
| `port 21` | 1 | what-is-ftp | in terms.tsv |
| `port 22` | 1 | what-is-ssh | NOT in terms.tsv |
| `port 443` | 1 | what-is-https | in terms.tsv |
| `ports` | 1 | firewalls | NOT in terms.tsv |
| `prefix length` | 1 | subnetting | in terms.tsv |
| `private address` | 1 | what-is-ip | NOT in terms.tsv |
| `protocol-control-information` | 1 | osi-model | NOT in terms.tsv |
| `protocol-data-unit` | 1 | osi-model | NOT in terms.tsv |
| `public address` | 1 | what-is-ip | NOT in terms.tsv |
| `public-key authentication` | 1 | what-is-ssh | NOT in terms.tsv |
| `push` | 1 | what-is-imap | NOT in terms.tsv |
| `QUIT` | 2 | what-is-ftp what-is-pop3 | in terms.tsv |
| `RCPT TO` | 1 | what-is-smtp | NOT in terms.tsv |
| `referral` | 1 | what-is-dns | in terms.tsv |
| `relay` | 1 | osi-model | in terms.tsv |
| `rendering` | 1 | what-is-http | in terms.tsv |
| `Renew` | 1 | dhcp | in terms.tsv |
| `reply code` | 1 | what-is-smtp | in terms.tsv |
| `report` | 1 | what-is-udp | NOT in terms.tsv |
| `Request` | 1 | dhcp | in terms.tsv |
| `RETR` | 1 | what-is-pop3 | in terms.tsv |
| `retransmission` | 1 | what-is-tcp | in terms.tsv |
| `root server` | 1 | what-is-dns | in terms.tsv |
| `route` | 2 | osi-model | NOT in terms.tsv |
| `router` | 1 | osi-model | NOT in terms.tsv |
| `routing decision` | 1 | what-is-ip | in terms.tsv |
| `rule list` | 1 | firewalls | NOT in terms.tsv |
| `SACK` | 1 | what-is-tcp | in terms.tsv |
| `segment` | 1 | osi-model | in terms.tsv |
| `segments` | 1 | what-is-tcp | NOT in terms.tsv |
| `SELECT INBOX` | 1 | what-is-imap | NOT in terms.tsv |
| `selective acknowledgement` | 1 | what-is-tcp | NOT in terms.tsv |
| `sending mail from an app` | 1 | what-is-smtp | NOT in terms.tsv |
| `sequence numbers` | 1 | what-is-tcp | NOT in terms.tsv |
| `ServerHello` | 1 | what-is-tls | in terms.tsv |
| `session` | 3 | osi-model what-is-ssh | NOT in terms.tsv |
| `session ticket` | 1 | what-is-https | NOT in terms.tsv |
| `session-connection` | 1 | osi-model | NOT in terms.tsv |
| `seven layers` | 1 | osi-model | NOT in terms.tsv |
| `SFTP` | 1 | what-is-ftp | in terms.tsv |
| `shadowed` | 1 | firewalls | NOT in terms.tsv |
| `shared secret` | 2 | what-is-ssh what-is-tls | in terms.tsv |
| `shell` | 1 | what-is-ssh | in terms.tsv |
| `source` | 1 | firewalls | in terms.tsv |
| `source address` | 1 | what-is-ip | NOT in terms.tsv |
| `STARTTLS` | 1 | what-is-smtp | in terms.tsv |
| `STAT` | 1 | what-is-pop3 | NOT in terms.tsv |
| `stateful` | 1 | firewalls | in terms.tsv |
| `status code` | 1 | what-is-http | in terms.tsv |
| `STOR report.pdf` | 1 | what-is-ftp | NOT in terms.tsv |
| `stylesheet` | 1 | what-is-http | NOT in terms.tsv |
| `subnet mask` | 1 | subnetting | in terms.tsv |
| `subnets` | 3 | subnetting | NOT in terms.tsv |
| `synchronization points` | 2 | osi-model | NOT in terms.tsv |
| `tag` | 1 | what-is-imap | in terms.tsv |
| `TCP` | 1 | osi-model | NOT in terms.tsv |
| `TCP handshake` | 1 | what-is-http | NOT in terms.tsv |
| `the same layer` | 1 | osi-model | NOT in terms.tsv |
| `three-way handshake` | 1 | what-is-tcp | in terms.tsv |
| `time exceeded` | 1 | what-is-icmp | in terms.tsv |
| `TLS` | 1 | what-is-smtp | NOT in terms.tsv |
| `TLS handshake` | 1 | what-is-https | in terms.tsv |
| `traceroute` | 1 | what-is-icmp | in terms.tsv |
| `transfer syntax` | 1 | osi-model | NOT in terms.tsv |
| `TTL` | 3 | what-is-dns what-is-icmp what-is-ip | in terms.tsv |
| `twin` | 1 | osi-model | NOT in terms.tsv |
| `UDP` | 1 | osi-model | NOT in terms.tsv |
| `URL` | 1 | what-is-http | in terms.tsv |
| `USER` | 2 | what-is-ftp what-is-pop3 | NOT in terms.tsv |
| `version exchange` | 1 | what-is-ssh | in terms.tsv |
| `\Seen` | 1 | what-is-imap | NOT in terms.tsv |

### 5.3 (c) The eleven terms: what each lesson already cites

Source of each citation: the term's `cite: [...]` in the lesson file (line given). Each helper name is resolved to its `cite(...)` call. The "defining" column is the `defining: true` marker. Registry title and publisher are from `src/content/sources.ts`.

Registry entries used (line of the `id:`):
- `rfc-792`: "Internet Control Message Protocol", IETF (sources.ts:1256).
- `rfc-1122`: "Requirements for Internet Hosts – Communication Layers", IETF (sources.ts:213).
- `rfc-2151`: "A Primer On Internet and TCP/IP Tools and Utilities", IETF (sources.ts:1480).
- `rfc-1812`: "Requirements for IP Version 4 Routers", IETF (sources.ts:1166).
- `rfc-791`: "Internet Protocol", IETF (sources.ts:335).
- `rfc-8767`: "Serving Stale Data to Improve DNS Resiliency", IETF (sources.ts:975).
- `rfc-1034`: "Domain Names - Concepts and Facilities", IETF (sources.ts:546).
- `microsoft-ping`: "ping", Microsoft, kind vendor (sources.ts:1533).
- `microsoft-tracert`: "tracert", Microsoft, kind vendor (sources.ts:1541).
- `microsoft-azure-tcpip-tuning`: "TCP/IP performance tuning for Azure VMs", Microsoft, kind vendor (sources.ts:921).
- `cisco-ping-traceroute`: "Understand Ping and Traceroute Commands", Cisco, kind vendor (sources.ts:1549).

ICMP's term lines are `what-is-icmp.ts:684-692`. The helpers are defined at what-is-icmp.ts:22-100 (`R1122_ECHO` at line 41 is `rfc1122('3.2.2.6', 42)`; `R792_ECHO` line 33; `R792_ECHO_DATA` 34; `R792_TE` 31; `R792_DU_HOST` 30; `RFC791_TTL` line 50; `MS_PING`, `MS_TRACERT`, `AZURE_PING`, `CISCO_PING`, `CISCO_TRACE`, `CISCO_PERF` at lines 73, 76, 79, 86, 87, 89).

| Lesson, line | Term (`name`) | Cited, in order (source id, section, defining?) |
|---|---|---|
| what-is-icmp.ts:684 | Echo request | `rfc-1122` §3.2.2.6 (no); `rfc-792` §"Echo or Echo Reply Message, page 14" (defining) |
| what-is-icmp.ts:685 | Echo reply | `rfc-1122` §3.2.2.6 (no); `rfc-792` §"Echo or Echo Reply Message, page 15" (defining) |
| what-is-icmp.ts:686 | Ping | `microsoft-ping` §"Introduction" (no); `rfc-2151` §3.2 (no); `cisco-ping-traceroute` §"Ping Command" (no) |
| what-is-icmp.ts:687 | Latency (round-trip time) | `microsoft-azure-tcpip-tuning` §"Measure round-trip time and packet loss" (no); `cisco-ping-traceroute` §"Performance" (no); `microsoft-ping` §"Introduction" (no) |
| what-is-icmp.ts:688 | TTL | `rfc-791` §3.1 (defining); `rfc-1812` §5.3.1 (defining) |
| what-is-icmp.ts:689 | Time exceeded | `rfc-792` §"Time Exceeded Message, page 6" (defining); `rfc-1812` §5.3.1 (defining) |
| what-is-icmp.ts:690 | Traceroute | `rfc-2151` §3.4 (no); `microsoft-tracert` §"Introduction" (no); `cisco-ping-traceroute` §"Traceroute Command" (no) |
| what-is-icmp.ts:691 | Destination unreachable | `rfc-1812` §5.2.7.1 (defining); `rfc-792` §"Destination Unreachable Message, page 5" (defining) |
| what-is-icmp.ts:692 | Packet loss | `cisco-ping-traceroute` §"Ping Command" (no); `rfc-2151` §3.2 (no); `microsoft-azure-tcpip-tuning` §"Measure round-trip time and packet loss" (no) |
| what-is-ip.ts:497 | IP address | `rfc-791` §2.3 (defining) |
| what-is-dns.ts:646-649 | TTL | `rfc-8767` §4 (defining); `rfc-1034` §3.6 (defining) |

Notes on this table, as facts:
- `what-is-ip.ts` also has its own `term-ttl` at line 519 (name `TTL`, cites `host('3.2.1.7', 34)` and `router('5.3.1')`). It is not the one asked for, and it is listed here only so the two are not confused.
- The DNS TTL term's `cite` (`what-is-dns.ts:649`): `cite: [rfc('rfc-8767', '4', true), rfc('rfc-1034', '3.6', true)]`.
- The ICMP TTL term (`what-is-icmp.ts:688`): `cite: [RFC791_TTL, rfc1812('5.3.1', true)]`.
- Citations per term, counted from the lines above: Echo request 2, Echo reply 2, Ping 3, Latency 3, TTL (ICMP) 2, Time exceeded 2, Traceroute 3, Destination unreachable 2, Packet loss 3, IP address 1, TTL (DNS) 2.

## 6. The source registry

### 6.1 `src/content/sources.ts`: counts and kinds

- The registry (`export const SOURCES`, line 201) has 289 entries. Counted by `^  {$` (289 lines) and by `id:` (289 lines at four spaces).
- Entries per kind (by `kind:` at four spaces): `rfc` 151; `vendor` 113; `iana` 11; `nist` 5; `itu` 3; `standards-body` 3; `community` 2; `internet-registry` 1. Kinds with no entry: `ieee`, `government`, `security-reference`, `cert-objectives` (0 each).
- `SOURCE_KINDS` (`sources.ts:14-27`) has 12 kinds: `rfc`, `ieee`, `iana`, `nist`, `itu`, `standards-body`, `government`, `security-reference`, `internet-registry`, `community`, `vendor`, `cert-objectives`.
- The two community entries: `canonical-dhcp-concepts` (sources.ts:1462; "Basic DHCP concepts", Canonical, `https://canonical.com/blog/basic-dhcp-concepts`) and `baeldung-ssh-intro` (sources.ts:2445; "Introduction to SSH", Baeldung, `https://www.baeldung.com/cs/ssh-intro`).
- `sources.ts:2025`: `cloudflare-spectrum-glossary`, kind `vendor`, title "Glossary (Spectrum docs)" (a vendor glossary page; it is not a glossary of this site).

Source entry schema (`sources.ts:79-89`): `id` (slug), `kind` (enum), `short` (no `: `), `title`, `publisher`, `url` (https), optional `anchor` (must be the url plus `#` with `{n}`), optional `version`. `defineSources` (`sources.ts:156-198`) refuses duplicate ids, two ids naming one document (`documentOf`, `sources.ts:151-154`: an RFC by its number on any RFC host), a host not in `SOURCE_HOSTS` (`sources.ts:181-185`: "no host is allowed yet for <kind>" when the kind's list is empty), a url that is a site root, and a cert-objectives source with no version (`sources.ts:192-194`).

### 6.2 `SOURCE_HOSTS`, in full (`sources.ts:30-77`, verbatim)

```ts
/** Exact hosts each kind may live on. No wildcards. */
export const SOURCE_HOSTS: Record<SourceKind, readonly string[]> = {
  rfc: ['www.rfc-editor.org', 'datatracker.ietf.org'],
  ieee: ['standards.ieee.org', 'ieeexplore.ieee.org'],
  // The root zone file is IANA's, served from InterNIC: IANA's Root Files page names it the authoritative root zone
  // (What is DNS, batch 1).
  iana: ['www.iana.org', 'www.internic.net'],
  nist: ['csrc.nist.gov', 'nvlpubs.nist.gov', 'www.nist.gov'],
  // ITU-T Recommendations, free to read: X.200 defines the OSI model (owner, 2026-11-08).
  itu: ['www.itu.int'],
  // The four groups the owner added on 2026-11-08 (direction doc §3.2). No host is listed until a lesson cites one:
  // each publisher's own host joins here in that change.
  // W3C, WHATWG, Wi-Fi Alliance, ETSI, 3GPP, Unicode, Ecma, Bluetooth SIG, USB-IF, UEFI Forum, NVM Express.
  // WHATWG's three joined with What is HTTP: the HTML, URL and Fetch standards.
  'standards-body': ['html.spec.whatwg.org', 'url.spec.whatwg.org', 'fetch.spec.whatwg.org'],
  // CISA, the UK's NCSC, ENISA. NIST keeps its own kind.
  government: [],
  // MITRE's CVE, CWE and ATT&CK; FIRST's CVSS.
  'security-reference': [],
  // ICANN and the five regional internet registries: ARIN, RIPE NCC, APNIC, LACNIC, AFRINIC. IANA keeps its own kind.
  // ICANN's own site joined with What is DNS: its root server committee's FAQ counts the root servers' copies.
  'internet-registry': ['www.icann.org'],
  // Blogs (a vendor's included), forums and posts, readable without signing in (owner, 2026-11-09). Each site's host
  // joins here with the first lesson that cites it. Wikipedia, videos and AI output never count.
  // Canonical's blog joined with What is DHCP: with Microsoft's page it is the second publisher that calls the four
  // messages DORA.
  // Baeldung's computer-science tutorials joined with What is SSH: with Cloudflare's page, its "Introduction to SSH" is the second publisher that places SSH at an OSI layer.
  community: ['canonical.com', 'www.baeldung.com'],
  // Three joined with What is HTTPS: what a browser shows and tries first is in its maker's own help pages
  // (Microsoft's and Google's), and what Let's Encrypt issues is in its own documentation.
  vendor: [
    'learn.microsoft.com', 'www.cisco.com', 'developers.cloudflare.com', 'docs.paloaltonetworks.com',
    'support.microsoft.com', 'support.google.com', 'letsencrypt.org',
    // Cloudflare's own explainer pages joined with What is ICMP: no other allowed host has a second vendor that places
    // ICMP at a layer. The site refuses a command-line read; the page reads in a browser.
    'www.cloudflare.com',    // Two joined with batch 3's mail lessons. Palo Alto's own explainer pages: with Cloudflare's, its "What Is Layer 7?"
    // is the second vendor that places SMTP at a layer. Google's Workspace help moved here from support.google.com, which
    // now redirects to it.
    'www.paloaltonetworks.com', 'knowledge.workspace.google.com',
    // OpenSSH's own manual pages joined with What is SSH: the maker's documentation for the files and options the lesson
    // names, a publisher of its own beside Microsoft's and Cisco's pages.
    'man.openbsd.org',
    // Google Cloud's own documentation joined with Networking's Firewalls: with Palo Alto's, its Firewall Insights page is the
    // second publisher that names a shadowed rule (Cisco's pages say "rule preemption").
    'docs.cloud.google.com',
  ],
  'cert-objectives': ['www.comptia.org', 'partners.comptia.org', 'learningnetwork.cisco.com'],
};
```

The kinds are `SOURCE_KINDS` (`sources.ts:14-27`): `rfc`, `ieee`, `iana`, `nist`, `itu`, `standards-body`, `government`, `security-reference`, `internet-registry`, `community`, `vendor`, `cert-objectives`.

Empty host lists: `government` (sources.ts:46) and `security-reference` (sources.ts:48). `ieee` has two hosts (sources.ts:33) but no entry. `cert-objectives` has three hosts (sources.ts:76) but no entry and is refused for content (`sources.ts:2737-2739`).

### 6.3 The "defining" marker: what it is, and who may carry it

What it is:
- `sources.ts:2685-2686` (on `citationSchema`): "`defining` marks the source as the defining standard for what the claim describes, such as the RFC that defines a field: such a claim may rest on that one source. Any other claim needs a second, independent source."
- `sources.ts:2693`: `defining: z.literal(true).optional(),`; `sources.ts:2703-2706`: `cite(..., { defining: true })` adds `defining: true` to the citation.
- `docs/content-model.md:72`: "**The defining standard.** Mark a citation `defining: true` when its source is the current document that defines the thing the claim describes: its message format, a field, a value, a procedure, or a layer. A field's exact size, for example, is defined only in its own RFC. A claim with a defining-standard citation may rest on that one source (section 3):"
- `docs/content-model.md:79`: "Do not mark a document that only mentions or explains the thing, or one that defines something else. The fact-checker fails a wrong marker. An objectives citation can never be marked."
- `docs/content-model.md:20`: "Every claim needs two independent sources, or one that is its defining standard (section 3)."
- `docs/content-model.md:93`: glossary statements are named in the two-source rule: "Each part that must cite, glossary statements included, needs either:" (line 93).

Who may carry it:
- Code: only one restriction, `sources.ts:2740-2742`: "an objectives citation cannot be marked as a defining standard; remove the marker". `cited.ts:118` counts a citation with `defining: true` as enough for the two-source rule. No source kind is barred from the marker in code.
- Policy: `docs/direction.md:56` (decision 2.28): "**A vendor's page never carries the defining marker.**"
- `.claude/agents/fact-checker.md:93`: "A marker on a document that does not define the thing is ❌ for that claim, even when the claim is true."
- `docs/briefs/analyst-report.md:34`: "**No vendor page is a defining document.**"
- The `vendor` entries in the registry carry no `defining` marker in the registry itself; the marker is on the citation. Grep of `src/content/sources.ts` for `defining` finds 7 lines, none of them a citation in an entry (they are the schema and the helper).

### 6.4 Allowed hosts for tutorial sites

- `geeksforgeeks.org`: not in `SOURCE_HOSTS` (sources.ts:31-77), and not in any file under `src`, `docs`, `scripts` or `.claude` (a grep for "geeksforgeeks" in those folders found 0 matches). A source on it would be refused by `defineSources` (sources.ts:183-184: "is not an allowed host for <kind> (allowed: ...)"), for any kind that has hosts. Its kind would have to be `community`, the only kind for blogs and posts (`sources.ts:52-57`).
- Allowed tutorial host: `www.baeldung.com` (Baeldung's computer-science tutorials, `community`), listed at `sources.ts:52-57` with the comment "Baeldung's computer-science tutorials joined with What is SSH: with Cloudflare's page, its 'Introduction to SSH' is the second publisher that places SSH at an OSI layer."
- Allowed `community` hosts: `canonical.com` and `www.baeldung.com` only (`sources.ts:57`).
- `sources.ts:52-53`: "Blogs (a vendor's included), forums and posts, readable without signing in (owner, 2026-11-09). Each site's host joins here with the first lesson that cites it. Wikipedia, videos and AI output never count."
- The `community` kind is defined in `.claude/agents/fact-checker.md:84` and `:101` as "a community source: a blog (a vendor's included), a forum answer or a post, readable without signing in".
- Adding a host is a code change: `sources.ts:40-41` comment ("each publisher's own host joins here in that change") and `sources.ts:182` message ("add <host>, if it is the publisher's own, to SOURCE_HOSTS in the change that first cites it").


## 7. Not found, and limits of this scan

- No glossary-specific claim sheet, report format, quote record, or gate path exists in `src/content/factcheck/` or `docs/fact-checks/`. `claimSheet` takes only a `Lesson` (sheet.ts:146). `runFactCheck` loads only `src/content/lessons/<slug>.ts` and the canary (cli.ts:59-66, 94).
- No file under `src/`, `docs/`, `scripts/` or `.claude/` mentions `geeksforgeeks`, `tutorialspoint`, `w3schools` or `javatpoint`.
- No link from a lesson's term to a glossary entry exists in the schema, in `src/lesson/`, `src/pages/` or `src/lib/`.
- `pagetext.ts` has no test of its own. `sha256.test.ts` is 13 lines.
- Section 5(b) counts `**…**` by regex on code lines. A bold mark inside a multi-line string or a comment that does not start its line with `/**`, `*` or `//` would be counted. The 242 count is the regex's, not a parse of the TypeScript.
- Section 5(b): the term comparison is by name only. A term matched by name is not checked against its idea.
- The lesson-level `**term**` count does not include `src/content/lessons/*.test.ts`, as asked.
- Section 1.8 lists slug references by grep. It is a complete grep of the non-test factcheck files (62 lines matched by `slug`), and the lines that take the slug as an argument are the ones listed.
- `plan.md` is in the repo root (100 lines). Its glossary lines are 5, 11, 12, 21, 27, 28, 30, 31, 34, 35, 38, 46, 47, 50, 79, 84, 90, 91, 97, 98. None gives a format for a glossary entry's report.

## 8. Surprises, as facts

- `checkFactChecks` would refuse a glossary report placed at `docs/fact-checks/<slug>.md`: the registry globs every `*.md` there (registry.ts:298) and `gate.ts:219-221` refuses any report whose slug is not a cited lesson.
- `independentSources` (cited.ts:102-110) counts each vendor source by its publisher, not its id.
- `reportHeaderSchema.overrides` is a required array (report.ts:42); a glossary has no overrides.
- Decision 2.38 (`docs/direction.md:67`) records that the Phase 5 page "reads them from the registry and keeps no copy, so every word on it has passed a fact-check and no new kind of check is needed." It also records that the design and plan were made on "Fable 5.2" under the owner's word for that session (the row's last sentence, and `plan.md:46`, "designer (Fable 5.2)").
- `www.baeldung.com` is an allowed host (kind `community`, `sources.ts:57`), and `geeksforgeeks.org` is not.
- `TTL` in `what-is-dns.ts:646-649` cites two RFCs, each marked `defining: true`.
- `what-is-ip.ts:497` is the term "IP address" and `what-is-ip.ts:519` is a term named "TTL" (cites `host('3.2.1.7', 34)` and `router('5.3.1')`), a different term from the DNS one.
