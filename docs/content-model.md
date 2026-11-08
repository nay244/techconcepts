# The content model

How to add a source, a lesson, a track and a glossary entry, how a lesson is fact-checked, and which rules the build enforces. Read this before you write or move a lesson. Most rules here fail the build when broken, with a message that says what to fix. Rules marked *policy* do not: nothing checks them, so you must.

**Every source, section number, objective and web address in the examples is invented. Look up each real one in the document itself.**

The real `SOURCES` registry is empty today. A lesson's first sources are added to `src/content/sources.ts` in the same change as the lesson.

## 1. Sources

Every fact cites a primary source:
- an RFC, an IEEE standard, an IANA registry, a NIST publication or an ITU-T Recommendation;
- an allowed vendor's own documentation, or its own explainer pages, such as Cisco's "What is a firewall?" (owner, 2026-11-08).

An official certification objectives document is allowed only for exam tags and objective mapping. No blogs, Wikipedia, videos, forums or summaries.

Every claim needs two independent sources, or one that is its defining standard (section 3). Each source must be current: the version in force today, not obsoleted, superseded or withdrawn (owner, 2026-11-08). The fact-checker checks currency (section 8).

*Policy:* the build checks only the host of each source, so you must pick the right documents. Some pages on allowed hosts are not primary sources, and the build lets them through:

- Internet-Drafts on `datatracker.ietf.org`. Cite only published RFCs.
- Microsoft Q&A and Shows on `learn.microsoft.com`. They are a forum and videos, not documentation.
- Conference papers on `ieeexplore.ieee.org`. They are not standards.
- A vendor's blog, community forum or partner content, on any host. Only pages the vendor wrote as documentation or explainers count.

Sources live in the list inside `defineSources([...])` in `src/content/sources.ts` (`SOURCES`). Add one entry per document:

```ts
// Invented example: no id, section, address or objective here is a checked citation.
{
  id: 'rfc-example',
  kind: 'rfc',
  short: 'RFC 9999',
  title: 'Example Protocol',
  publisher: 'IETF',
  url: 'https://www.rfc-editor.org/rfc/rfc9999.html',
  anchor: 'https://www.rfc-editor.org/rfc/rfc9999.html#section-{n}',
}
```

- `kind` is one of `SOURCE_KINDS`: `rfc`, `ieee`, `iana`, `nist`, `itu`, `vendor`, `cert-objectives`. An `itu` source is an ITU-T Recommendation on `www.itu.int`, published free there. An explainer page is a `vendor` source, with no kind of its own.
- The host of `url` must be listed for that kind in `SOURCE_HOSTS`. Hosts are exact, with no wildcards. To allow a new host, add it to `SOURCE_HOSTS` in the same change and say why in the commit.
- `url` names one document. It is an `https` address in normal form, with a path other than `/` and no `#fragment`.
- One document has one entry. A second entry with the same `url`, or for the same RFC on another RFC host, fails the build, because it would count as a second source (section 3).
- `anchor` is optional. It is the same `url`, then `#`, then a fragment that holds `{n}`, the section number. With an anchor, a numbered section links itself.
- `short` is the name readers see, such as `RFC 9999`. It may not contain `": "`.
- A `cert-objectives` source needs a `version`, the edition of the objectives.

## 2. Citing: `cite()`

`cite(source, section, { url?, defining? })` builds a citation. Never write one by hand: the build rebuilds each citation and rejects any that differ.

```ts
// Invented example: no id, section, address or objective here is a checked citation.
cite('rfc-example', '3.1')
```

A numbered section such as `3.1` on a source with an anchor needs nothing else. Any other citation needs a `url` inside the document, with a fragment or a sub-path:

```ts
// Invented example: no id, section, address or objective here is a checked citation.
cite('rfc-example', 'Table 1', { url: 'https://www.rfc-editor.org/rfc/rfc9999.html#section-2' })
```

The bare document address is rejected, because a citation must point at the section. On a source with an anchor, an unnumbered section needs the document address plus a fragment. The one exception is an objectives document: its whole-document address is allowed, and only for objective mapping (section 5).

**The defining standard.** Mark a citation `defining: true` when its source is the current document that defines the thing the claim describes: its message format, a field, a value, a procedure, or a layer. A field's exact size, for example, is defined only in its own RFC. A claim with a defining-standard citation may rest on that one source (section 3):

```ts
// Invented example: no id, section, address or objective here is a checked citation.
cite('rfc-example', '4.1', { defining: true })
```

Do not mark a document that only mentions or explains the thing, or one that defines something else. The fact-checker fails a wrong marker. An objectives citation can never be marked.

## 3. Writing a lesson

A lesson file is `src/content/lessons/<slug>.ts`. The file name is the lesson's `slug`. The default export is `defineLesson({ ... })`. The shape is in `src/content/schema.ts` (`lessonSchema`).

`defineLesson` always checks the lesson against `SOURCES`, the registry in `src/content/sources.ts`. It takes no other source list, so every source a lesson cites must be in `SOURCES`.

The cited fixture in `src/content/test-fixtures.ts` (`makeCitedLesson`) shows the shape only. Its sources are invented (`FIXTURE_SOURCES`), and the registry rejects any lesson checked against them. Copy its shape, then cite real sources from `SOURCES`.

A cited lesson has exactly one unit. Do not write `references`: each unit's source list is built from its citations.

**What must cite.** Learn's lead, terms, pattern, why, Go deeper and facts. Every Go deeper paragraph, in Learn and in Watch steps. Every Practice option (its feedback explains the answer). The unit's OSI badge: `osi: { layers: [7], cite: [...] }`, or `osi: 'spans'` when no source puts the unit at a layer.

**Two sources** (owner, 2026-11-08). Each part that must cite, glossary statements included, needs either:
- citations to at least two independent sources; or
- a citation marked as the defining standard (section 2).

*Independent* means different entries in `SOURCES`, and not two pages from the same vendor. Two sections of the same RFC count as one source. A vendor page that restates an RFC counts as a second source, and so does a second RFC. Analogies cite nothing, so the rule skips them. Objective mappings are exempt: the objectives document is the only source for an objective number. A part with one source fails with:

> rests on one source; cite a second, independent source that states the same thing (another document, not another page of the same vendor), or mark the citation as the defining standard with cite(..., { defining: true }).

The build only counts sources. The fact-checker confirms that each one states the claim (section 8).

A statement is `{ id, text, cite, analogy? }`:

```ts
// Invented example: no id, section, address or objective here is a checked citation.
{ id: 'lead-1', text: 'A client that needs an address **broadcasts** a request.', cite: [cite('rfc-example', '3.1')] }
```

**Analogies.** A Learn lead statement, why statement or term may be an analogy instead. It carries `analogy: true` and no citation. It is never both:

```ts
{ id: 'lead-3', text: 'Think of a lease like a library loan: you may keep the book for a while.', analogy: true }
```

**Shapes.** `cite` may be left out only on an analogy. Parts that a trace can name carry an `id`:

| Part | Shape |
|---|---|
| Learn lead and why statement | `{ id, text, cite }` or `{ id, text, analogy: true }` |
| Learn term | `{ id, idea, name, cite }` or `{ id, idea, name, analogy: true }` |
| Learn pattern | `{ id, names, note, cite }` |
| Learn fact | `{ id, label, value, cite }` |
| Learn Go-deeper paragraph | `{ id, text, cite }` |
| Watch step Go-deeper paragraph | `{ text, cite }` (no id, so it cannot be traced) |
| Overview fact and step fact | `{ label, value, backing }` |

**Go deeper** is exam-level detail, closed by default. Each paragraph cites directly. The paragraphs of one block count together against the track's `deepWords` limit.

**Backing.** Watch and the scene cite nothing themselves. Each part carries a `backing`, one of three kinds. The parts are the lesson (subtitle and summary), the unit (full name and purpose), the scene, each packet, the Overview hook (`hookBacking`) and description, each Overview fact, and each step, step fact and event.

```ts
backing: { traces: ['lead-1', 'fact-1'] }   // it repeats these cited Learn parts
backing: { analogy: true }                  // it is an analogy
backing: { example: true }                  // it is example data
```

A trace names ids from the same lesson. It may name a Learn lead or why statement, a term, the pattern, a fact, or a paragraph of Learn's Go deeper. It may not name an analogy, an uncited part, a Watch step's Go deeper (it has no id) or a part of another lesson. Learn ids must be unique in the lesson.

Example data is only for made-up values: RFC 5737 and RFC 1918 addresses, `00:00:5E:00:53:xx` MACs. *Policy:* the build does not check that example data uses those ranges, so you must. Everything else traces. *Policy:* keep the voice beginner-first, everyday idea before the term, Go deeper for exam detail; nothing checks it.

**Strict path, in order.** `defineLesson` (`src/content/define.ts` and `cited.ts`) reads the shape first and reports shape problems alone. Then it checks these together and reports every issue in one error:

1. exactly one unit
2. no written `references`
3. every part that must cite does (a statement or term may be an analogy, never both)
4. every part that cites has two independent sources or a defining standard
5. the OSI layers are cited, or the unit `'spans'`
6. every Watch and scene part has a backing
7. Learn ids are unique, and every trace names a cited Learn part of this lesson
8. every citation is one `cite()` builds, of a source that may back content
9. no text says "lesson 3" or the like, because a shared lesson's number differs by track
10. the structural rules: a cert tag, unique ids, and a scene, events, tables and cues that fit the figure (`FIGURE_PARTS`)

**Limits.** Each track sets numeric limits (`limits` in its track file, keys in `src/content/limits.ts`): `steps`, `factsPerStep`, `practiceQuestions`, `optionsPerQuestion`, `learnTerms`, `patternNames`, `narrativeWords`, `hookWords`, `deepWords`. A lesson must fit every track that lists it. The first six are `{ min, max }` ranges. The last three are word ceilings.

A lesson may leave a limit with an override and a one-line reason of at most 160 characters. A word limit takes only `max`:

```ts
overrides: [{ limit: 'deepWords', max: 140, reason: 'The lease timers need a longer worked example.' }]
```

A range limit takes `min`, `max` or both, and needs at least one:

```ts
overrides: [{ limit: 'steps', max: 7, reason: 'Shows all seven steps of the handshake in order.' }]
```

One override per limit. An override the lesson does not need fails the build, so remove it once it is not used. A lesson in several tracks keeps an override while any one listing track needs it. Each limit message names the limit, and most end with its key in parentheses, such as `(deepWords)`. That is the name to override.

## 4. The legacy list

How the Internet Works, Subnetting, DHCP and Firewalls are still in the older shape, without citations. They use `defineLegacyLesson` from `src/content/legacy.ts`, and their slugs are on the closed `LEGACY_LESSONS` list. The list can only shrink. `defineLegacyLesson` refuses any slug not on it, so a new lesson cannot start there.

To move a lesson across, rewrite its file with `defineLesson` and remove its slug from `LEGACY_LESSONS` in the same change. The registry fails the build when the list and the files disagree. `src/content/legacy.test.ts` pins the list too, so shrink the list in that test in the same change. Direction doc §10 task 6 deletes the legacy path.

## 5. Tracks and objectives

`defineTrack` (`src/content/define.ts`) checks a track. A track lists lesson slugs and titles in parts, and carries its limits. The registry checks every track in `tracks` again against `SOURCES` (section 7), so a track written as a plain object still gets every check.

- A **concept track** (`type: 'concept'`) teaches in order. Its lessons carry cert and role tags (`certTags`) only.
- A **certification track** (`type: 'certification'`) maps every listed lesson to objectives of one pinned exam document. Pin it in `exam`: its `source` is a `cert-objectives` id in the registry, and its `version` must equal that source's `version`. Each objective's citation must be from that source, its `section` must equal its `objective` number, and its `exam` must be one of the track's `codes`.

```ts
// Invented example: no id, section, address or objective here is a checked citation.
exam: { title: 'Example exam', codes: ['EX-101'], version: 'V1', source: 'example-objectives' },
// ...and in a part's lessons:
{
  slug: 'dhcp',
  title: 'DHCP',
  objectives: [
    {
      exam: 'EX-101',
      objective: '9.9', // invented
      cite: cite('example-objectives', '9.9', { url: 'https://partners.comptia.org/example-objectives.pdf' }),
    },
  ],
}
```

- `exam.source` is the `id` of the objectives source in the registry. That source is a `cert-objectives` entry with a `version`, and `exam.version` must equal it.
- The `url` in the objective's `cite()` is that source's own `url`. The whole-document address is allowed only for a `cert-objectives` source, and only here.
- Each objective's citation section equals its objective number. Its `exam` must be one of `exam.codes`.
- A lesson may not list the same objective twice.

## 6. The glossary

`defineGlossary` in `src/content/glossary.ts` holds `GLOSSARY`. Each entry is `{ id, term, definition }`, and `definition` is a list of statements like a lesson's. Each statement cites or is an analogy, never both, and at least one cites. A statement that cites follows the two-source rule (section 3). Ids are unique, and terms are unique ignoring case.

```ts
// Invented example: no id, section, address or objective here is a checked citation.
{ id: 'lease', term: 'Lease', definition: [{ id: 'lease-1', text: 'A lease is an address lent for a limited time.', cite: [cite('rfc-example', '2.1')] }] }
```

## 7. The registry gate

`src/content/registry.ts` loads every lesson and fails the build for any of these:

- A lesson file is not directly in `src/content/lessons/`. A folder there may only hold the parts of the lesson it is named after, as `how-the-internet-works/` does.
- The file name is not the slug.
- The lesson was not made with `defineLesson` (or `defineLegacyLesson` while on the list). Anything else, such as a plain object, is rejected.
- A cited lesson was checked against a source list other than `SOURCES`, such as the fixture's.
- No track lists the lesson.
- A track lists the lesson under another title, or the lesson does not fit that track's limits.
- A track fails `defineTrack` when checked again against `SOURCES`. For a certification track, that means the pinned objectives document and every objective citation must be in `SOURCES`.
- A cited lesson has no current fact-check report in which every item passes, or a report has no cited lesson (section 8).

**Shared lessons.** A lesson exists once. Tracks only reference it. It gets a URL in every track that lists it, `/<track>/<slug>`, and a canonical link to the first listing track's URL (in `tracks` order). Progress is saved by slug, so it follows the lesson into every track.

**Untimed.** Lessons carry no duration anywhere: not in code, checks or copy.

## 8. Fact checks

Every cited lesson is checked by the **fact-checker**, an independent agent defined in `.claude/agents/fact-checker.md` (owner, 2026-11-08). It runs in the build session with a fresh context, after the lesson is written and before its pull request opens. The owner does not read its reports: its all-pass verdict is the sign-off. Lessons on the legacy list (section 4) are exempt until they move across.

**The flow for one lesson:**

1. **Write** the lesson in the cited shape. Every claim has two independent sources, or one defining standard (section 3).
2. **Print the claim sheet:** `npm run fact-check -- <slug>`. It lists every item the checker checks, with a stable key, and the content hash. The items are every part that cites, the OSI badge, every traced, example and analogy part, the title, the unit name and each question's prompt. A scene's items include the words and marks its cues put on the figure. Settings that change only how something looks are left off (`DISPLAY_ONLY` in `src/content/factcheck/sheet.ts`), so a layout tweak does not make a report stale. Changing any text or value a reader sees, a citation, or a cited source's registry entry does. A new schema field whose default is empty changes nothing; one with any other default makes every report stale unless it is added to `DISPLAY_ONLY`.
3. **Dispatch** the `fact-checker` agent with the slug and nothing else: no notes, drafts or conversation. It fetches every cited section from the publisher's own site, checks every item, and writes `docs/fact-checks/<slug>.md`. It then runs `npm run fact-check -- <slug> --check`, which checks the report's form against the sheet.
4. **The build reads the report** (the gate, below).
5. **Fix and check again.** If any item is not ✅:
   1. Commit the failing report as it stands.
   2. Fix the lesson: reword the claim, re-cite it, or cut it.
   3. Dispatch a brand-new fact-checker on the whole lesson.

   Repeat until every item passes. Only the branch's final commit has to build.
6. **Open the pull request** with the lesson and its report. List every limit override, with its reason, in the description. The owner's OK to merge approves them.

**The author's rules.** *Policy:* nothing checks these, so you must keep them.
- Never write, edit or rewrite a report. Only the fact-checker writes one, and a new run replaces it whole.
- Commit every failing report before you fix the lesson, so the branch history shows every run.
- Never re-run the checker on unchanged content to get a different answer.
- List overrides, with their reasons, in the pull request description.

**The report.** `docs/fact-checks/<slug>.md`, by slug, because a lesson is shared between tracks. It opens with a fenced block whose info string is exactly `json fact-check`. That is the header the build reads, in JSON:
- `slug` and `hash`: the sheet's hash when it was checked;
- `checked`: the date;
- `checker`: the model that checked it;
- `verdicts`: every sheet key with `✅` (supported), `⚠️` (imprecise, not current or not confirmed) or `❌` (wrong);
- `sources`: every cited source, whether it was found `current`, the date, and a `note` when it is not;
- `overrides`: the lesson's limit overrides.

The rest of the report is for people. It gives each claim's quoted passages (or what its defining standard defines), and how each source was found current.

**The gate.** The registry reads every report directly in `docs/fact-checks/`. It fails the build, and the tests, when:
- a cited lesson has no report;
- the report cannot be read: it has no header, the header is not valid JSON of the right shape, or it lists a key or a source twice;
- the report is for another slug;
- the lesson has changed since it was checked (the hash differs);
- an item has no verdict, or a verdict names a key the lesson does not have;
- any verdict is not ✅;
- a cited source is not listed, or is not current;
- a report has no cited lesson, so stale reports don't pile up.

While a new lesson has no passing report, the build and the tests fail. That is expected until the fact-checker passes it. `npm run dev` only warns, so you can preview the lesson while you write it. `npm run fact-check` reads lessons without the registry, so it prints the sheet either way.

**The canary.** `src/content/factcheck/canary/` holds a test lesson that cites real sources and plants known faults. It proves the fact-checker catches each fault and passes each correct claim. Its sources are not in `SOURCES` and it is never on the site. Its report is `docs/fact-checks/canary/fact-check-canary.md`, which the gate never reads. To run it again, dispatch the fact-checker with the slug `fact-check-canary`.
