# The content model

How to add a source, a lesson, a track and a glossary entry, and which rules the build enforces. Read this before you write or move a lesson. Most rules here fail the build when broken, with a message that says what to fix. Rules marked *policy* do not: nothing checks them, so you must.

**Every source, section number, objective and web address in the examples is invented. Look up each real one in the document itself.**

The real `SOURCES` registry is empty today. A lesson's first sources are added to `src/content/sources.ts` in the same change as the lesson.

## 1. Sources

Every fact cites a primary source: an RFC, an IEEE standard, an IANA registry, a NIST publication, or official vendor documentation. An official certification objectives document is allowed only for exam tags and objective mapping. No blogs, Wikipedia, videos, forums or summaries. *Policy:* the build checks only the host of each source, so you must pick the right documents.

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

- `kind` is one of `SOURCE_KINDS`: `rfc`, `ieee`, `iana`, `nist`, `vendor`, `cert-objectives`.
- The host of `url` must be listed for that kind in `SOURCE_HOSTS`. Hosts are exact, with no wildcards. To allow a new host, add it to `SOURCE_HOSTS` in the same change and say why in the commit.
- `url` names one document. It is an `https` address in normal form, with a path other than `/` and no `#fragment`.
- `anchor` is optional. It is the same `url`, then `#`, then a fragment that holds `{n}`, the section number. With an anchor, a numbered section links itself.
- `short` is the name readers see, such as `RFC 9999`. It may not contain `": "`.
- A `cert-objectives` source needs a `version`, the edition of the objectives.

## 2. Citing: `cite()`

`cite(source, section, { url? })` builds a citation. Never write one by hand: the build rebuilds each citation and rejects any that differ.

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

## 3. Writing a lesson

A lesson file is `src/content/lessons/<slug>.ts`. The file name is the lesson's `slug`. The default export is `defineLesson({ ... })`. The shape is in `src/content/schema.ts` (`lessonSchema`). Copy the cited fixture in `src/content/test-fixtures.ts` (`makeCitedLesson`) as a starting point.

A cited lesson has exactly one unit. Do not write `references`: each unit's source list is built from its citations.

**What must cite.** Learn's lead, terms, pattern, why, Go deeper and facts. Every Go deeper paragraph, in Learn and in Watch steps. Every Practice option (its feedback explains the answer). The unit's OSI badge: `osi: { layers: [7], cite: [...] }`, or `osi: 'spans'` when no source puts the unit at a layer.

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
4. the OSI layers are cited, or the unit `'spans'`
5. every Watch and scene part has a backing
6. Learn ids are unique, and every trace names a cited Learn part of this lesson
7. every citation is one `cite()` builds, of a source that may back content
8. no text says "lesson 3" or the like, because a shared lesson's number differs by track
9. the structural rules: a cert tag, unique ids, and a scene, events, tables and cues that fit the figure (`FIGURE_PARTS`)

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

To move a lesson across, rewrite its file with `defineLesson` and remove its slug from `LEGACY_LESSONS` in the same change. The registry fails the build when the list and the files disagree. Direction doc §10 task 6 deletes the legacy path.

## 5. Tracks and objectives

`defineTrack` (`src/content/define.ts`) checks a track. A track lists lesson slugs and titles in parts, and carries its limits.

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

`defineGlossary` in `src/content/glossary.ts` holds `GLOSSARY`. Each entry is `{ id, term, definition }`, and `definition` is a list of statements like a lesson's. Each statement cites or is an analogy, never both, and at least one cites. Ids are unique, and terms are unique ignoring case.

```ts
// Invented example: no id, section, address or objective here is a checked citation.
{ id: 'lease', term: 'Lease', definition: [{ id: 'lease-1', text: 'A lease is an address lent for a limited time.', cite: [cite('rfc-example', '2.1')] }] }
```

## 7. The registry gate

`src/content/registry.ts` loads every lesson and fails the build for any of these:

- A lesson file is not directly in `src/content/lessons/`. A folder there may only hold the parts of the lesson it is named after, as `how-the-internet-works/` does.
- The file name is not the slug.
- The lesson was not made with `defineLesson` (or `defineLegacyLesson` while on the list). Anything else, such as a plain object, is rejected.
- No track lists the lesson.
- A track lists the lesson under another title, or the lesson does not fit that track's limits.

**Shared lessons.** A lesson exists once. Tracks only reference it. It gets a URL in every track that lists it, `/<track>/<slug>`, and a canonical link to the first listing track's URL (in `tracks` order). Progress is saved by slug, so it follows the lesson into every track.

**Untimed.** Lessons carry no duration anywhere: not in code, checks or copy.
