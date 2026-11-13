# B8a: spec review of D9a (reviewer, Opus, 2026-11-13)

Unit B8a (`plan.md:303-305`), spec `prototypes/d9a-glossary-independent.md` (amending `prototypes/d9-glossary.md` and errata E1 to E11, `plan.md:287-301`), prototype `prototypes/d9-glossary.html` (D9a by default), against the code on `revamp` at 02bc5bb: `src/lib/glossary.ts`, `src/lib/glossary-site.ts`, `src/components/GlossaryEntry.astro`, `src/pages/glossary.astro`, `src/lesson/Explanation.tsx`, `src/lesson/console.css`, and their tests.

## 1. Verdict

**HOLES.** Seven, each with one right answer. One is a real guess in the data (H1: the input the spec names cannot put a definition's tracks in site order). Two are checks that cannot be tested as written once the build is right (H2: checks 10 and 31 name "the entry" by a field D9a removes; H3: check 7's "no lesson title" clashes with definition text). One is a check half that cannot fail (H4). Three are small.

What was verified and holds: the prototype's markup, CSS and note match §3, §4 and §5 word for word (`d9-glossary.html`: `.gl-row--tracks { padding-block: 3px; }`, `.gl-tracks { color: var(--ink); }`, `.explain__def { … margin: -3px 0 9px; … }`, the `.gl-note` of §5). The pilot's ties (`src/content/glossary-groups/pilot.ts:67-246`) give "How the Internet Works" for ten definitions and "How the Internet Works, Networking Concepts" for IP address (`dhcp` is listed only by `tracks/networking.ts:51`; `what-is-dhcp`, `what-is-http`, `what-is-ip`, `what-is-icmp`, `what-is-dns` only by `tracks/how-the-internet-works.ts:22-41`; titles at `how-the-internet-works.ts:12`, `networking.ts:11`). No lesson is listed by two tracks today. `entryId` and `entryTerm` of `LessonDefinition` (`glossary.ts:80-87`) are read only by the glossary link (`Explanation.tsx:353`) and by tests; `GlossaryItem.entryId/entryTerm` stay (the pointer's "See TTL", `GlossaryEntry.astro:20`). `positionOf` (`glossary.ts:7`) is used in `glossary.ts` only at `:167`. Lesson pages render with `chrome={false}` (`[lesson].astro:45`), so no site footer and no link to `/glossary` reaches a lesson page. `registry.ts:359` already exports `tracksOf(slug)`: the tracks that list a lesson, in `tracks` order.

## 2. Holes, worst first

### H1. The input the spec names cannot order a definition's tracks by site order (one right answer)

- `d9a-glossary-independent.md:56` (rule 6): "Its tracks are every track that lists one of those lessons, each once, in the order of `tracks`." `:58`: "The function's input gives each ready lesson the titles of every track that lists it (in `tracks` order)." Check 7 (`:108`): "A fixture lesson listed by two tracks gives both, in `tracks` order."
- Per-lesson title lists do not carry the site's track order. Lessons are given once, under the home track (`glossary-site.ts:10-16`, `glossary.ts:10`). Counter-example: lesson X listed by T1 and T3, lesson Y listed by T2 only, one definition tied to both. Lessons in site order are X (home T1), then Y (home T2). A union in order of first sight gives T1, T3, T2. The site order is T1, T2, T3. Nothing in the specified input tells the function that T2 comes before T3. A builder would guess, and the natural guess is wrong.
- **Answer.** The pure function is given the site's track order: `GlossaryInput` gains every track's title in `tracks` order (`tracks.map((t) => t.title)`), and each `GlossaryLesson` holds `tracks: string[]` from `tracksOf(slug).map((t) => t.title)` (`registry.ts:359`). A definition's tracks are that ordered list filtered to the tracks of its tied lessons. A lesson's track title missing from the list throws, naming it. (Listing each lesson once per listing track, in `tracks` order, and taking titles in order of first sight is equivalent. Pick one.) `GlossaryLesson.title`, `.canonical` and `.trackTitle` go, because nothing reads them after the change (§3 "What this orphans goes").

### H2. Checks 10 and 31 name "the entry" by `entryId`, which D9a removes (one right answer)

- D9 check 10 (`d9-glossary.md:361`, unchanged by D9a): "`what-is-icmp/term-latency` gives the entry Latency". D9a check 31 (`:124`): "its definition is the entry Latency's text". B8's tests prove "the entry" with `entryId`: `glossary.test.ts:275`, `:278`, `:316`; `Explanation.test.tsx:284-285`, `:354-356`; `e2e/glossary.spec.ts:386-390`. D9a §3 (`:60`) removes `entryId` and `entryTerm` from `LessonDefinition`, so these tests cannot pass, and once those fields are gone nothing names the entry.
- **Answer.** "Gives the entry X" means value equality with that entry's definition. `lessonMap['what-is-icmp/term-latency']` `toEqual`s `{ text, sources }`, where `text` is the Latency entry's statements joined by a space and `sources` is its short names in rule 5's order, and it has no `label` key. `what-is-icmp/term-ttl` equals TTL's `ip` sense (`label: 'In IP packets'` and that sense's text). `what-is-dns/term-ttl` equals the `dns` sense. `what-is-http/term-ip` equals IP address. The value's keys are exactly `text`, `sources`, and `label` for a sense. End to end (E2: the spec cannot load the glossary): Latency's open `.explain__def-text` in the ICMP lesson equals `#latency .gl-def`'s text read from `/glossary` in the same test, and the button's accessible name is "Latency (round-trip time)".

### H3. Check 7's "No definition's data holds a lesson's title" cannot be tested by searching for text (one right answer)

- `:108`: "No definition's data holds a lesson's title or address." The lesson titles are "IP", "ICMP", "DNS", "HTTP" and "DHCP", and they appear in the definitions' own text (seven pilot statements contain IP, DNS, HTTP or ICMP). TTL's label is "In IP packets". A substring test on a right build fails.
- **Answer.** Test the shape. Each `Definition`'s keys are exactly `label`, `text`, `sources` and `tracks`. `tracks` contains only strings drawn from the given track titles. No string anywhere in a definition, its sources' `url` aside, matches `/\?step=/` or begins with `/`. The type no longer has a `lessons` field. Run it on the pilot and on the two-track fixture.

### H4. Check 33's built-HTML half cannot fail, and its other halves test raw `href` strings (one right answer)

- `:126`: "The built HTML of every lesson page has no `href="/glossary`". With JavaScript off a lesson serves only its Overview (E1, `plan.md:291`; `definitions.no-script.test.ts:17-26`). Lesson pages have no footer (`[lesson].astro:45`). So B8 as built already passes this half, and a build that kept "Ping in the glossary" passes it too.
- The other halves ("no `a` has an `href` starting `/glossary`") read the attribute. A kept link written absolute (`https://<site>/glossary#ping`) or relative (`../glossary#ping`) slips through. The two Cloudflare sources whose `href` contains `glossary` (`…/learning/ddos/glossary/…`, §8) must still pass.
- **Answer.** Keep the HTML half as a guard, and do not count it as covering the rule. In the e2e test and in `Explanation.test.tsx`, resolve every `a` with `new URL(a.getAttribute('href'), location.href)`. Refuse any link with the page's own origin and a pathname that is `/glossary` or starts with `/glossary/` or `/glossary#`. Before asserting, check that the nine (or the fixture's three) buttons are `aria-expanded="true"`.

### H5. Check 14 tests raw `href` prefixes, and `/tracks` only by exact match (one right answer)

- `:112`: "no `a` in `main` has an `href` that is `/tracks` or starts with `/{track id}`". As written, `/tracks/`, `/tracks#networking`, a relative `networking/dhcp` and an absolute same-origin URL all pass.
- **Answer.** The same resolution as H4. A link in `main` is refused when it has the page's origin and its pathname is `/tracks`, starts with `/tracks/`, is `/{id}`, or starts with `/{id}/`, for every `id` of `tracks`. Ids are read from `tracks`, never typed. The header and footer are outside `main` (`BaseLayout.astro:102-106`) and keep their `/tracks`, `/how-the-internet-works` and `/networking` links. The stamp (`/about#facts`), the keys (`#letter-…`), "All letters" (`#letters`) and the pointer (`#ttl`) pass.

### H6. Check 34's "next row's first source number, or its button" does not cover a next row with neither (one right answer)

- `:128`. In `Explanation.test.tsx` the fixture's row after Hello is "Neighbor table", which is untied when `DEFS` holds only `term-1` and `term-3` (`Explanation.test.tsx:283-286`). If it has no mark, it has nothing to focus.
- **Answer.** "The next Tab leaves the row" means that after Enter on a button, Tab focuses the first focusable element after that button's `li` in document order, and that element is not inside the `li`. In the ICMP lesson (e2e) that element is Latency's mark "4" (§6, §11 "tried"). In the unit test the expected element is computed from the DOM, not typed.

### H7. No row, or an empty row, for a definition whose tracks are empty (one right answer; low)

- `:41`: "A definition with no tie has no row (as before)." The component tests `lessons.length > 0` (`GlossaryEntry.astro:47`). In the pure function a fixture lesson can be given no tracks. The site cannot produce that case, because every lesson is listed by a track (`registry.ts:195-200`).
- **Answer.** The row is drawn when `tracks.length > 0`. A component test given `tracks: []` finds no `.gl-row--tracks` and no "Described in".

### H8. Developer-facing words that still say "lessons" or "link" (one right answer; low)

- §3 and §4 set two comments (above `.gl-foot` and above `.explain__def-src`). The spec does not name these others, which become wrong: `glossary.astro:2-3` ("the lessons that teach it"), `glossary.astro:106` ("beside it, its sources and its lessons"), `glossary.ts:1` (which names only D9 and its errata), `glossary.ts:10-18` (`canonical`, home track), `console.css:893` ("To a finger, and in the phone layout, the link is 44px tall", which belongs to the block that goes), `e2e/glossary.spec.ts:4-7` and `glossary-page.test.ts:1-2` (the check lists).
- **Answer.** Each is reworded to D9a or removed with the code it described. A comment that belonged to removed code goes with it.

## 3. Attack cases, grouped under the changed checks

Each is one line: the setup, then what a right build does. "Refuse" is the nearest wrong build that is easy to let through. "Accept" is the nearest right one that is easy to refuse.

**7. A definition's tracks (unit tests on `glossaryData`)**
- Refuse written order: IP address is tied `dhcp` (Networking) first (`pilot.ts:242-246`) and reads "How the Internet Works", then "Networking Concepts".
- Refuse ordering by first sight (H1): lesson X listed by T1 and T3, lesson Y listed by T2, one definition tied Y then X, gives T1, T2, T3.
- Refuse the home track only: a fixture lesson listed by T1 and T2 gives `['T1', 'T2']`. Given T2 and T1 in the input with the site order T1, T2, it still gives T1, T2.
- Refuse one name per tie: TTL "In IP packets" (ICMP and IP, both one track) gives `['How the Internet Works']`, once. IP address (three Internet lessons, one Networking) gives two names, not four.
- Refuse one name per lesson: a fixture definition tied to two terms of one lesson gives that lesson's track once.
- Throws: a tie to `nope` throws, and the message contains `glossary entry "<id>"` and `"nope"`. A tie to `term-99` of a ready lesson throws, and the message contains the entry, `"term-99"` and the lesson slug. In a sense, the message also names `sense "<id>"`.
- Accept: two ready fixture lessons with one title in one track no longer throw (`glossary.ts:180-185` goes).
- The shape (H3): keys `label`, `text`, `sources`, `tracks`; no `lessons`; no `?step=`; no string beginning with `/`.
- Pilot: ten definitions give `['How the Internet Works']`; IP address gives `['How the Internet Works', 'Networking Concepts']`.

**10. The lesson map (unchanged in what it finds; H2)**
- Refuse keying by term id alone: `what-is-dns/term-ttl` equals the DNS sense; `what-is-icmp/term-ttl` and `what-is-ip/term-ttl` equal the IP sense.
- `what-is-icmp/term-latency` equals `{ text, sources }` of the Latency entry, with no `label` key. `what-is-http/term-ip` equals IP address. Each value's keys are exactly `text`, `sources` and (for a sense) `label`; neither `entryId` nor `entryTerm` is present.
- `osi-model` gives no key; `definitionsFor` is unchanged.

**11. The note**
- `.gl-note`'s text, whitespace collapsed, is exactly §5's D9a note. Refuse D9's note ("the lessons that teach the term").
- `.gl-head`'s text is `Glossary` + lead + the new note + the stamp's words (the test at `glossary-page.test.ts:195-198`, with the new `NOTE`).

**14. No link to a lesson or a track (H5)**
- Over every `a` in `main`, resolved: none has the page's origin with a pathname of `/tracks`, `/tracks/…`, `/{id}` or `/{id}/…`. Ids are read from `tracks`.
- Refuse a kept lesson link in any form: `a.gl-lesson` count 0; no `.gl-row a` has a `href` with `?step=`.
- Under Ping: `#ping .gl-row--tracks`'s raw `textContent` is exactly `Described in How the Internet Works`, with one space. Refuse markup with no space between the two spans: the label's 4px margin looks the same, but the text reads "Described inHow…".
- Every `.gl-row--tracks` (11 in the pilot, counted from the data) holds no `a`, no `[href]`, no `[title]`, no `[tabindex]`, and exactly one `span.gl-label` and one `span.gl-tracks`. Refuse `title="/how-the-internet-works/…"` on the span (§3: "no `title`").
- `.gl-tracks`' text is the definition's tracks joined by ", ". IP address: `How the Internet Works, Networking Concepts`.

**15. TTL**
- In `#ttl`, in DOM order: "Also called Time to Live", "In IP packets", its definition, "In DNS", its definition. Each `dd` has its own `.gl-row--tracks` reading "Described in How the Internet Works". The row count in `#ttl` is 2, not 1 shared by the entry.

**16. The pointer (unchanged)**
- `#time-to-live`'s text matches neither "Sources" nor "Described in" (the old test at `glossary-page.test.ts:88`, with "Described in" for "Taught in"). It holds no `.gl-row--tracks`.

**19. Words**
- No element in `main` has text matching `/Taught in/`. No `.gl-row`'s text matches `/lesson/i`. Refuse "Lessons" with a capital: the test is case-insensitive.

**22. Targets and the row's height**
- As a touch screen at 375 and 768: every `.gl-row a`, the stamp and every visible "All letters" are at least 43.9px tall, and no two boxes overlap. The old floor `boxes.length > 60` (`e2e/glossary.spec.ts:188`) is now false on a right build. The pilot has 43 row links, 1 stamp and 6 "All letters", 50 in all, so assert against the page's own counts, not a typed 60.
- Each `.gl-row--tracks`: its height is `26 + 20 × (lines − 1)` ±1. Count lines as the distinct rounded `top`s of `Range.getClientRects()` over the row's contents (not the span's rects alone: the label could sit alone on line 1).
- Ping's row is 26px (±1) at 375 and 768 as a touch screen, and at 1440 with a mouse. IP address's row is 46px (±1) at 375 as a touch screen (§8) and at 1440 with a mouse.
- Refuse no padding (20px). Refuse giving the span `.gl-row a`'s inline-block and 12px (44px to a finger). Refuse `white-space: nowrap` on `.gl-tracks`: at 320, IP address's row then overflows sideways (check 21).
- With a mouse at 1440: `#ping .gl-row a` stays 26px. `.gl-row + .gl-row` keeps `margin-top: 4px`, so the "Described in" row's top is the Sources row's bottom + 4 (±1).

**23. Layout**
- At 375 the tops increase in this order: name, definition, Sources, Described in. At 768 and 1440, as D9's check 23. The test's `taught` selector (`e2e/glossary.spec.ts:152`) becomes `.gl-row--tracks`.

**24. Look (both themes, beside the prototype)**
- `.gl-tracks` has the computed colour of `var(--ink)`: equal to `#ttl .gl-also b`'s colour in light and in dark. `.gl-label` has `--muted`. Weight 600. `text-decoration-line` is `none`. Refuse `--ink-strong` (the old `a.gl-lesson` colour, `glossary.astro:89`).

**28. An open definition in Learn**
- Open Ping (e2e) and each fixture definition (`Explanation.test.tsx`): the children of `div.explain__def` are exactly `explain__def-text` and `explain__def-src`, with `explain__def-sense` first for a sense. Refuse an empty `p.explain__def-more` left in.
- `div.explain__def` contains none of `a, button, input, select, textarea, [tabindex], [contenteditable]`. Refuse the link kept with `tabindex="-1"`, which passes check 34 but not this.
- The Sources line is `Sources Microsoft ping, RFC 2151, Cisco ping and traceroute, Microsoft Azure TCP/IP tuning`, with no `a`.
- Margin: the open `.explain__def`'s computed `margin-bottom` is `9px` at 375 as a touch screen and at 1440 with a mouse. Refuse leaving the `(max-width: 760px), (pointer: coarse)` rule that sets it to 0. No rule in `console.css` names `.explain__def-more`.

**31. Latency (H2)**
- The button's accessible name is "Latency (round-trip time)". Its `.explain__def-text` equals `/glossary`'s `#latency .gl-def` text, read in the same test. In the unit test, the value equals the Latency entry's join. No `getByRole('link')` inside it.

**33. No lesson links to the glossary (H4)**
- ICMP at `?step=7` with all nine `aria-expanded="true"`: no resolved same-origin `a` has a pathname at or under `/glossary`. The page's text does not contain "in the glossary".
- Accept: the Cloudflare source links whose path contains `/learning/ddos/glossary/` stay, and the test must not refuse them.
- `Explanation.test.tsx`, with every fixture term given a definition and all of them opened: the same two assertions.
- The HTML half: no lesson's container-rendered HTML contains `href="/glossary` (a guard only; it passes against B8 too).
- B8's tests that go: "ICMP lesson" under Ping (`e2e/glossary.spec.ts:45-52`), check 33's round trip (`:407-425`), "the glossary link is 26px" (`:473-478`), and the 44px link half of check 36 (`:494-495`).

**34. Keyboard (H6)**
- After Enter on Ping, `document.activeElement` is still Ping. One Tab later it is Latency's first mark, whose text is "4". Refuse a focusable `div.explain__def` (`tabindex="0"`): the Tab would land on the definition.
- Space toggles. Tab from Ping's row's last mark reaches Ping's button (unchanged).
- Unit test: after Enter on Hello, Tab focuses the first focusable element after Hello's `li`, computed from the DOM.

**36. Touch targets**
- At 375 as a touch screen: `elementFromPoint` at the row's left + 2 and top + 43, and at right − 2 and top + 1, is inside Packet loss's button. At top + 46 it is not. The glossary link half goes.

**37, 38 (unchanged in substance)**
- 37: as E1. `definitions.no-script.test.ts` and `no-script.test.ts` pass unchanged.
- 38: `git diff --stat revamp...b8a/glossary -- src/content/lessons src/content/glossary-groups src/content/sources.ts docs/fact-checks` prints nothing. `pilot.ts` is byte-identical, so the group's report hash still matches. The ties stay as data (§1), and `groupSheet`'s `lessons` items are unchanged.

## 4. B8's attack cases (`prototypes/d9-cases.md` §3) under D9a

- **No longer apply:** 7's five bullets (replaced above); 10's `entryId: 'latency', entryTerm: 'Latency'` (replaced by H2); 14 "Into a lesson"; 15's second bullet (lesson links per `dd`); 28's link half ("Ping in the glossary" opens `/glossary#ping`, no `target`); 31's link; 33 entirely (and H5/E5 with it); 34's second and third bullets; 36's second bullet; H10/E10; notes "Back without the cache" and the prototype-CSS note `.explain__def { margin-bottom: 0 }` (now reversed: 9px everywhere).
- **Change wording only:** 16 "no Sources or Taught in line" becomes "Described in"; 23 "Taught in" becomes "Described in"; 22 now names a source's and a pointer's links, with the measured counts above.
- **Stand as written:** 1 to 6, 8, 9, 11 (with the new note), 12, 13, 17 to 21, 24 to 27, 29, 30, 32, 35, 37, 38, H's 25 to 29.

## 5. Notes (nothing in the spec changes for them)

- The island's props shrink: every lesson's serialized `definitions` loses `entryId` and `entryTerm`. Check 29's budget is not at risk.
- `glossary.test.ts:181-209` ("7. lessons") and `:301-311` are rewritten, not left beside the new tests. The B8 test that throws for two ready lessons with one title in one track goes with the throw.
- `d9-cases.md` §4's note "Other specs that read Learn" still applies. Run `lesson.spec.ts`, `reading.spec.ts` and `tablet.spec.ts` on port 4481 as well as `glossary.spec.ts` and `site.spec.ts`.
