# B8: spec review of D9 (reviewer, Opus, 2026-11-13)

Unit B8 (`plan.md`), spec `prototypes/d9-glossary.md` (variant B, section 17's answers as given), prototype `prototypes/d9-glossary.html`, with D8 §4, §6, §8 to §13 and checks 15, 16, 21, 23, 25 to 29 where D9 points to them, `docs/glossary-path-spec.md` §1, §2, §10, and the code as it is on `revamp` at dfb1112.

## 1. Verdict

**HOLES.** Eleven: one check that cannot pass (37), three D8 checks that cannot pass "as written" (15, 21, 23), test placements no build can follow (fixtures that cannot reach a built page; glossary data the end-to-end specs cannot load), a Back promise the console does not keep, a loophole in check 38, and five smaller guesses. Ten have one right answer, given below; one (H11) needs a one-line ruling.

What was verified and holds: the counts of §9 (10 entries, 11 definitions, 1 pointer, 6 letters D E I L P T, 42 source links, 15 lesson links, from `src/content/glossary-groups/pilot.ts`); check 2's order; check 6's Echo request sources and RFC 792's two places (`pilot.ts:13-14`, `:60-64`, `sources.ts:2736` makes the label); check 7's orders and addresses (written order `pilot.ts:133-136`, `:242-247`; site order `tracks/how-the-internet-works.ts:22-41`, `tracks/networking.ts:51`; Learn at `?step=7` for what-is-icmp and what-is-dhcp, `?step=6` for what-is-ip, what-is-dns, what-is-http and dhcp); §10's Ping sources line (`pilot.ts:86-95`, short names `sources.ts:1535`, `:1482`, `:1551`, `:923`); `/about#facts` exists (`about.astro:140`); D8 §8's header and footer edits match `SiteHeader.astro:8`, `:16-21`, `:186`, `SiteFooter.astro:24`, `BaseLayout.astro:25`, `e2e/support.ts:44-51`.

## 2. Holes, worst first

### H1. Check 37 cannot pass: with JavaScript off a lesson never renders Learn (one right answer)

- §10 "JavaScript off: the definitions are in the page's HTML, and the lesson's no-script styles show them all", §12 "In a lesson every definition shows open", and check 37 "each definition's text is in the HTML and visible".
- The lesson's server render is the Overview, always: `src/lesson/LessonConsole.tsx:208` ("After the first render, which matched the server's Overview, follow a ?step= link") reads `?step=` in an effect, which does not run without JavaScript. `src/lesson/no-script.test.ts:16-24` renders the page and finds the Overview; `e2e/lesson.spec.ts:398-418` and `e2e/tablet.spec.ts:396-410` (even at `?step=2`) see the Overview. Learn's `ol.explain__terms` is not in any lesson's HTML, so no definition is either.
- The two no-script rules would also contradict today's tests if Learn ever were rendered: they keep `button.explain__term` visible, while `no-script.test.ts:52-54` requires every `body button` hidden and `lesson.spec.ts:410` requires `button:visible` count 0.
- **Answer.** With JavaScript off the lesson page is today's page: the Overview, no term list, no definition, no visible button. Check 37 becomes: "With JavaScript off, every lesson's HTML has no `.explain__terms` and no `.explain__def`, and `no-script.test.ts` and `lesson.spec.ts`'s no-JavaScript test pass unchanged." The two `:root:not(.js)` rules of §10 are not added (they would style markup that is never served; CLAUDE.md, "Nothing speculative").

### H2. The end-to-end specs cannot load the glossary, so checks 11, 12, 13 and 18 cannot be computed there "never typed" (one right answer)

- §15: "Counts are worked out from the glossary in the test, never typed"; checks 11 to 24 are placed in `e2e/glossary.spec.ts`. Check 11 needs the count and the latest report date; 12 needs every entry's id, name and statements; 13 the cited address of each source; 18's second half a fixture.
- `src/content/glossary.ts:69` loads the groups with `import.meta.glob`, and `src/content/registry.ts:322-328` loads lessons and reports the same way; Playwright's loader runs neither. The specs import nothing from `src/` but `tokens` (`e2e/og-image.spec.ts:2`) and learn the lessons from the built site (`e2e/support.ts:15-29`, `global-setup.ts`). The report dates are in `docs/fact-checks/glossary/*.md`, which the specs cannot read without Node types (`support.ts:18-21`).
- **Answer.** The data-exact parts run in a Vitest file that renders `src/pages/glossary.astro` with Astro's container and parses it with jsdom, as `src/lesson/no-script.test.ts:5-25` renders the lesson page: check 11's stamp words and count/date (from `GLOSSARY` and the group dates), check 12 for every entry, check 13's `href`, `title` and `aria-label` against each definition's citations, check 3's "every id is used once" on the page, and check 19's head words. `e2e/glossary.spec.ts` keeps what needs a browser (status, title, landing, links followed, layout, targets, sideways scroll, JavaScript off, themes), on the entries the spec names (`ping`, `ttl`, `time-to-live`, `ip-address`, `packet-loss`), and checks the page against itself where a count is needed (the stamp's `{n}` equals the number of `.gl-entry:not(.gl-entry--see)`).

### H3. D8's checks 15, 21 and 23, "as written" (check 18), cannot pass on the pilot (one right answer)

- D8 15 and 23 follow the key "S" and scroll "into the middle of S". The pilot has no S: its letters are D, E, I, L, P, T (D9 §4, `pilot.ts`). D8 15 at 1440 also says "Tab focuses the first lesson link of S", but in D9 an entry's first link is a source link (D9 §11, focus order: "for each entry its source links, then its lesson links").
- D8 21 measures "every `.gl-from`", a class D9 does not have (D9's links are `.gl-row a`); a loop over `.gl-from` passes on nothing.
- **Answer.** D8 15 and 23 run on the last letter that has an item, read from the page's keys (T in the pilot; it has room to scroll at both sizes); at 1440 "Tab focuses the first link inside that letter's `dl`" (in the pilot, RFC 792 under Time exceeded). D8 21 reads `.gl-row a` for `.gl-from`: each is at least 44px tall at 375 as a touch screen, and `elementFromPoint` 1px inside its top and its foot is that link. Key size and "All letters" as D8 21 says.

### H4. A fixture glossary cannot reach a built page, so the fixture halves of checks 18 and 32 cannot run as placed (one right answer)

- Check 18: "With a fixture of 13 or more letters, in a unit test of the page's markup". Check 32: "With a fixture glossary that ties only three of a lesson's terms: … the other rows … are 42.2px tall at 1440 as today."
- The page reads the real glossary. Mocking `./glossary` makes the registry throw at import in `test` mode: it checks every group's ties and report there (`registry.ts:327-328`, through `refuseOrWarn`, `:309-314`); B9's E5 used exactly that mock to prove the refusal (`docs/glossary-path-spec.md:160`). The end-to-end specs serve the real build, so no fixture reaches a browser, and jsdom measures no height.
- **Answer.** Check 18's fixture runs on the keys alone: the page draws its keys from the function's output, and a unit test renders that markup (a component given the keys as props, in the container) for a fixture of 13 letters. Check 32 splits: the markup half in `Explanation.test.tsx` with a `definitions` prop of three entries; the height half in the end-to-end spec on a real lesson with tied and untied terms: the DNS lesson, whose only tied term is `term-ttl` (`pilot.ts:149`). At 1440 its untied rows have no `data-def`, no `button`, a computed `min-height` of `0px` (or `auto`), and the one-line row "Answers kept for next time" (`what-is-dns.ts:653`) is 42.2px (±0.5).

### H5. Check 33's "Back from the glossary returns to the lesson at Learn" holds only when the lesson's address carries `?step=` (one right answer)

- The console writes nothing to the address: no `pushState` or `replaceState` anywhere in `src/lesson`, `src/engine`, `src/progress`; `?step=` is read once (`LessonConsole.tsx:208-216`). Playwright's Chromium runs without the back/forward cache, so Back reloads the address the reader left. A reader who reached Learn by Next and pressed "Ping in the glossary" comes Back to `/how-the-internet-works/what-is-icmp`: the Overview, with "Resume at …".
- **Answer.** Check 33's test opens the lesson at Learn by its address (`…/what-is-icmp?step=7`, the address the glossary's own links use), follows "Ping in the glossary", and goes Back: the kicker reads Learn. The walked-in case is not a promise B8 can keep without writing the position to the address, which the spec does not ask; it is a note for the owner (section 4).

### H6. Check 38's "but the glossary's" lets B8 change the glossary's checked content (one right answer)

- Check 38: "`git diff --stat` shows nothing under `src/content/lessons/` or `docs/fact-checks/` but the glossary's." That exception lets a diff in `docs/fact-checks/glossary/` pass, and the check does not name `src/content/glossary-groups/` or `src/content/sources.ts` at all. B8 builds a page; any change to an entry, its sources or its report is content and needs a fresh fact-check (CLAUDE.md, "Accuracy outranks everything"; `plan.md` B8 lists no content).
- **Answer.** `git diff --stat revamp...<branch> -- src/content/lessons src/content/glossary-groups src/content/sources.ts docs/fact-checks` prints nothing.

### H7. Where the group dates come from, and what the function is given (one right answer)

- §9: the function "reads `GLOSSARY` and `GLOSSARY_GROUPS`, … the lesson registry, `SOURCES` and each group's report date", and rule 7 reads a re-check "as `checkedOn` reads a lesson's". There is no group form of `checkedOn`: the glossary's report globs are private to `registry.ts:325-326`, and `checkedOn` (`:335-343`) takes a lesson slug (also `plan.md:285`). §8 lists the files B8 changes and `registry.ts` is not among them. Checks 3, 6, 8 and 9 need fixture groups, fixture sources and fixture dates, which a function that imports `GLOSSARY` itself cannot take.
- **Answer.** `registry.ts` gains `glossaryCheckedOn(groupId)`, the twin of `checkedOn`: `checkedDate(groupSheet(group, SOURCES, lessons), full, recheck)` over those globs. The pure function takes its inputs as arguments (the groups, the lessons with their tracks and addresses, the source registry, a date per group); the page and the lesson page pass the real ones. No word of an entry is copied anywhere.

### H8. No date: an empty glossary, or `astro dev` with a group whose report is missing (one right answer)

- Rule 7 needs a date; §4 says "There is no empty state". But B9's attack case A9.3 holds that `npm run build` passes with an empty glossary (`plan.md`, B9 check 9), and in `astro dev` a group with no report only warns (`registry.ts:309-314`), so its date is null.
- **Answer.** The build does not throw for either. The latest date is taken over the groups that have one; when none has, the page draws no `.gl-stamp` (the stamp's words need a date, and the page invents none). With no entry, there are no keys and no letters either. Neither state is designed or shown in production; one unit test pins "no group, no throw, no stamp".

### H9. Variant A is in the spec's markup and in the checks' brackets (one right answer)

- §10 gives A's markup (`data-def="shown"`), checks 26 and 27 carry "[A: …]". The owner approved B (`plan.md:5`, "variant B").
- **Answer.** Build B only. No `data-def="shown"`, no switch between variants; the bracketed halves of checks 26 and 27 are dropped.

### H10. The "… in the glossary" link: "44px in the phone layout" or "760px and below"? (one right answer)

- §11: "The glossary link: 44px in the phone layout and to a finger, 26px with a mouse." §10 and the prototype's CSS (`d9-glossary.html:2310`): `@media (max-width: 760px), (pointer: coarse)`. The console's phone layout is wider than 760px: it also covers up to 899px when 600px tall or more, and portrait up to 1099px (`src/lesson/console.css:1321`). At 768 by 1024 with a mouse the layout is the phone's and the CSS gives 26px; §7's "the glossary link 44px tall" at 768 by 1024 was measured as a touch screen (§14).
- **Answer.** The CSS of §10, copied from the prototype, stands; §11's "phone layout" reads "760px and below". Check 36 runs at 375 as a touch screen; at 768 by 1024 it is 44px as a touch screen and 26px with a mouse.

### H11. Does the "0–9" group count toward the 13 letters? (needs a ruling; low)

- §6 and rule 8: "when fewer than 13 letters have a term, the row holds only those letters' keys"; D8 §9 rule 7: the digit group "gets a key before A only when it has a term". Whether that group counts as one of the 13 is not said. No name in the pilot or the proposed list starts with a digit, so nothing shows it today.
- **Proposed.** It counts as one key of the 13: the rule is about how many keys would be live. One unit test pins whichever is ruled.

## 3. Attack cases, grouped under the acceptance checks

Each is one line: the setup, then what a right build does. "Refuse" is the nearest wrong thing that is easy to let through; "accept" the nearest right thing that is easy to refuse.

### G. The data (unit tests on the function)

**1. Items**
- Refuse: senses or sense labels as items. TTL is one item, "In DNS" none. Pilot: 11 items = 10 entries + 1 spelling.
- Refuse: only the first spelling made a pointer. A fixture entry with `also: ['A one', 'A two']` gives two pointers, both to that entry.
- Accept: an entry with no `also` gives one item; two fixture groups give the items of both, nothing else.

**2. A to Z**
- Refuse: plain `localeCompare` or `<`. Fixtures: "Item 9" before "Item 10" (numeric); "Éclair" filed under E, between "Echo …" by base letters; "+OK" filed under O by the key without its "+"; "802.1Q" under "0–9", before A; a name "--" throws naming it.
- Refuse: no tie-break. "Resume" and "Résumé" (both allowed: rule 12 ignores case only) are equal at base strength; code units put "Resume" first, every run.
- Refuse: a pointer filed beside its entry. "Time to Live" sits between "Time exceeded" and "Traceroute", TTL last. The pilot's whole order is check 2's list exactly.

**3. Ids**
- Refuse: an entry's id made from its term. Fixture entry `id: 'ipv4-addr'`, term "IP address": the anchor is `ipv4-addr`.
- Refuse: reserved entry ids let through. Each of `letters`, `main`, `menu`, `menu-panel`, `theme-toggle`, `letter-q` throws naming it. Accept: `letter` and `lettering`.
- Pointer collisions: spelling "Letters" gives `letters-2`; a spelling whose id is a later entry's id (that entry files after the pointer) still gives `-2` to the pointer, and the entry keeps its id; spellings "Time-to-live" and "Time to Live" on two entries give `time-to-live` and `time-to-live-2`, and a third gives `-3`.
- On the page (H2's unit test): every `id` in the rendered HTML, `letter-…`, `letters` and the shell's included, is used once.

**4. Senses**
- TTL: two definitions, labels "In IP packets" then "In DNS". A fixture with senses written dns, ip shows dns first (written order, not sorted).
- Every other pilot entry: one definition, label `undefined` (not `""`), and no `.gl-sense` on the page.

**5. Text**
- Refuse: joining with `''` or `'\n'`, trimming, or passing the text through `Rich`. `text === statements.map(s => s.text).join(' ')` for all 11 definitions; ’ and “ ” are kept as written.

**6. Sources**
- Echo request: RFC 792, RFC 1122, RFC 2151, Microsoft ping. RFC 792's address is the `#page-14` citation's url, not `#page-15` and not the registry's bare `rfc792.html`. Its places are the two labels of check 6. RFC 1122's places are its one label, "RFC 1122, 3.2.2.6", once, though it is cited twice.
- Refuse: sources sorted by id or by short name. Ping: Microsoft ping, RFC 2151, Cisco ping and traceroute, Microsoft Azure TCP/IP tuning.
- Refuse: one entry's sources pooled across senses. TTL "In DNS": RFC 8767, RFC 1034 only; "In IP packets": RFC 791, RFC 1812, RFC 1122, RFC 8200. Packet loss has 6.
- Fixture registry with two sources whose `short` is "Same", both cited in one definition: throws. Accept: the two in two different definitions, or two senses: no throw.

**7. Lessons**
- Refuse: written order. TTL "In IP packets" is written ICMP then IP and shows IP lesson (`…/what-is-ip?step=6`), then ICMP lesson (`…/what-is-icmp?step=7`).
- Refuse: a typed `?step=`. The step is `positionOf(lesson, unit, 'learn')`: `what-is-dhcp?step=7` beside `dhcp?step=6`.
- Refuse: the track suffix only where the two DHCP lessons meet. A fixture tie to `dhcp` alone still reads "DHCP lesson in Networking Concepts"; "IP lesson" and "DNS lesson" never carry a track.
- Refuse: a link to the listing address instead of the canonical one. The link uses the lesson's home track.
- Fixture: one part tied to `what-is-ip` twice (`term-ttl` and `term-ip`): one "IP lesson" link.

**8. Stamp**
- Refuse: counting items (11) or definitions (11). `{n}` is 10.
- Fixture groups dated 2026-11-10 and 2026-11-13, in either order: 13 Nov 2026. A passing re-check dated later lifts the date; a re-check that does not pass (`checkedDate`) does not.
- One entry: "1 term checked on {date}", with no "the latest". The date is in `stampDate`'s form, never ISO.
- No group with a date: no throw, no stamp (H8).

**9. Keys**
- Exactly 12 letters with an item: 12 keys. Exactly 13: 26 keys, the rest dashed. Pilot: D, E, I, L, P, T.
- A letter that holds only a pointer still gets a key (fixture: an `also` spelling starting with Q, and nothing else under Q).

**10. The lesson map**
- Refuse: keying by term id alone. `what-is-dns/term-ttl` gives sense `dns`; `what-is-icmp/term-ttl` and `what-is-ip/term-ttl` give `ip`. All three share the id `term-ttl`.
- `what-is-icmp/term-latency` gives `entryId: 'latency'`, `entryTerm: 'Latency'`, no `label`; `what-is-http/term-ip` gives `ip-address`.
- Any `osi-model` term gives no key. Each value's `text` is rule 5's join and its `sources` are rule 5's short names, in rule 5's order.

### P. The page

**11. Head**
- `/glossary` gives 200, `<title>` "Glossary · TechConcepts", the meta description of §5, one `h1`, the lead and note word for word.
- The stamp: `href="/about#facts"`, `data-checked`, words "10 terms checked, the latest on 13 Nov 2026" from the data (H2). Refuse: the lesson `Stamp` component's words ("Checked 13 Nov 2026").

**12. Entries**
- For every entry, `#<id>` holds its term and one `dd` per definition; each `.gl-def`'s `textContent` equals rule 5's join exactly.
- Refuse: HTML in a definition. A fixture statement "a < b & c" shows as text.
- TTL has 2 `dd`; the pointer has 1 `dd` with no `.gl-def`.

**13. Source links**
- Each `a.gl-src`: text is the short name and nothing more (the comma is outside the link), `target="_blank"`, `rel="noopener"`, `href` = the first citation's url, `title` = the places.
- `aria-label`, Echo request's RFC 792: "RFC 792: RFC 792, Echo or Echo Reply Message, page 14; RFC 792, Echo or Echo Reply Message, page 15 (opens in a new tab)".
- No `href` equals its source's registry `url`.

**14. Into a lesson**
- "ICMP lesson" under Ping opens exactly `/how-the-internet-works/what-is-icmp?step=7`; the kicker ends "Learn"; the "Terms" list holds a button named "Ping".

**15. TTL**
- In `#ttl`, in DOM order: "Also called Time to Live", "In IP packets", its definition, "In DNS", its definition.
- The lesson links of the DNS `dd` are exactly `['DNS lesson']`; of the IP `dd`, `['IP lesson', 'ICMP lesson']`.

**16. The pointer**
- `#time-to-live` has class `gl-entry--see`, its `dd` reads "See TTL", the link's `href` is `#ttl`, and it has no Sources or Taught in line.
- Following it puts `#ttl` in the address; TTL's top is below every sticky foot.

**17. Landing**
- `/glossary#ttl` at 375 by 812 and at 1440 by 900: the entry's top is greater than the header's foot (69px), the bar's foot (128px) at 375, and the keys' foot (133px) at 1440, and less than the window's height. Its computed background differs from `body`'s.
- Refuse: a script's `scrollIntoView`. The same holds with JavaScript off (check 20).

**18. Keys**
- Pilot: exactly six `a.gl-key`, with `href`s `#letter-d`, `#letter-e`, `#letter-i`, `#letter-l`, `#letter-p`, `#letter-t`; no `.gl-key--none`.
- The 13-letter fixture (H4): 26 keys; each empty letter is a `span`, not focusable, with the screen-reader words "{letter}, no terms".
- D8's checks 15, 21 and 23 as H3 restates them.

**19. Words**
- `body` does not match `/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i`.
- `.gl-head`'s text, minus the stamp's `{n}` and `{date}`, is exactly §5's h1, lead, note and stamp words.

**20. JavaScript off**
- `main.innerHTML` is equal with JavaScript on and off.
- The key T, `/glossary#ttl` and "See TTL" behave as in 16 to 18.
- No `astro-island`, no `main script`; `localStorage` is equal before and after load (seed one key first, so "empty both times" cannot pass by accident).

**21. Sideways scroll**
- `scrollWidth <= clientWidth` at 320, 375, 768, 959, 960, 1280 and 1440, at the top and at the foot.
- Refuse: a long short name that cannot wrap ("Microsoft Azure TCP/IP tuning" in the 220px column at 960).

**22. Targets**
- As a touch screen at 375 and 768: every `.gl-row a`, the stamp and "All letters" are 44px tall or more, and no two link boxes intersect.
- Refuse: a media query on width alone. As a touch screen at 1024, still 44px. With a mouse at 1440, 26px (accept); the pointer's "TTL" link 34px.

**23. Layout**
- At 375: name, definition, Sources, Taught in, each `top` below the last.
- At 768: the name's left < the definition's left, their tops within one row; Sources' top > the definition's bottom.
- At 1440: name, definition and Sources at three increasing lefts, tops within one row; `.gl-def` ≤ 612px (36em at 17px), 596px measured.
- At 960: name column 220px; at 1200: 280 / 300.

**24. Look**
- 375 and 1440, light and dark, beside `.superpowers/revamp/job-9/shots/d9-*.png`. A look, not a test.

### L. The lesson (variant B)

**25. Today's words**
- In the ICMP lesson's Learn, the nine `.explain__idea` texts (marks aside) and nine names equal `what-is-icmp.ts:684-692`, in order.
- Each row's mark links keep today's numbers and `href`s.

**26. The hint**
- "Press a name for its definition." appears once, as the element right before `ol.explain__terms`.
- `osi-model` Learn: no `.explain__hint`; every `li` has no attribute; its children are exactly `span.explain__idea`, `span.explain__term`.

**27. Closed**
- Nine `button.explain__term`, each `aria-expanded="false"` and `aria-controls` naming an existing element that is `hidden`; no definition text is visible.
- Refuse: CSS giving `.explain__def` a `display` that overrides `[hidden]`.

**28. Open**
- Pressing Ping shows its text exactly and "Sources Microsoft ping, RFC 2151, Cisco ping and traceroute, Microsoft Azure TCP/IP tuning", with no links in that line; "Ping in the glossary" opens `/glossary#ping` in the same tab (no `target`); `aria-expanded` is "true".
- Pressing again closes it. With Ping open the other eight stay "false"; Ping and Traceroute can be open together.
- Accept: open Ping, go to Practice and back: Ping is still open. Reload: all closed, and `localStorage` holds nothing new.

**29. The row**
- Press Echo request's idea with `page.mouse.click` at its centre (a locator click reports the button's `::after` intercepting it): `aria-expanded` turns "true".
- Press a mark in that row: a popup opens at the mark's `href`, and `aria-expanded` stays "false". Refuse: an `onClick` on the `li`.

**30. Senses**
- ICMP lesson: TTL's definition starts "In IP packets", then the IP text; the page holds no "In DNS, the TTL".
- DNS lesson (tied today, `pilot.ts:149`): "In DNS", then the DNS text; no "every IPv4 packet’s header".
- IP lesson: TTL shows the IP sense.

**31. Latency**
- The button's accessible name is "Latency (round-trip time)"; the link's is "Latency in the glossary", with `href` `/glossary#latency`.

**32. Some tied, some not**
- As H4. Refuse: `min-height: 45px` on every `.explain__terms > li`, which makes the DNS lesson's untied one-line row 45px instead of 42.2px.

**33. To the glossary and back**
- As H5. From `…/what-is-icmp?step=7`, "Ping in the glossary" lands on `/glossary#ping`, which is `:target`, tinted, with the 3px bar.
- "ICMP lesson" under Ping opens Learn. Back, then Back: the kicker reads Learn.

**34. Keyboard**
- Tab from Ping's last mark reaches the Ping button. Enter opens it and focus stays on it (`document.activeElement`).
- The next Tab is "Ping in the glossary". Space also toggles.
- Closed, the next Tab skips the hidden link.

**35. The panels**
- All nine open at 1440 by 900 and 375 by 812: `window.scrollY` stays 0 after scrolling the panel to its foot; the Explanation and scene panels' boxes are §14's.
- The Explanation panel's `scrollWidth <= clientWidth` at 320, 768 by 1024 and 1024 by 768 with "Destination unreachable" open.

**36. Touch targets**
- 375, touch: `elementFromPoint` at the row's left + 2 and top + 43, and at its right − 2 and top + 1, is the button or inside it. At top + 46 it is not the button (accept: only the first 44px is the target).
- Each "… in the glossary" link is 44px tall or more.

**37. JavaScript off**
- As H1: no `.explain__terms` and no `.explain__def` in any lesson's HTML. `no-script.test.ts` and `lesson.spec.ts:398-418` pass unchanged.

**38. No content changes**
- As H6: the command prints nothing.
- Also: `pilot.ts` is byte-identical, so `npm test`'s glossary report check still passes on the same hash.

### H. The header and footer (D8's checks 25 to 29)

**25. The links**
- On every `SITE_PAGES` page, `/glossary` included, the "Site" nav links are Tracks, Glossary, How a lesson works, Sources, About, with `href`s `/tracks`, `/glossary`, `/#try`, `/#sources`, `/about`.
- The menu panel lists the same five in the same order.
- The old test `site.spec.ts:416-423` is rewritten, not left beside the new one.

**26. Current page**
- `aria-current="page"` on Glossary at `/glossary`, and no `aria-current` on Glossary elsewhere. Refuse "true" there.
- Tracks keeps "page" on `/tracks` and "true" on both track pages. `site.spec.ts:365-379` passes with `/glossary` in `SITE_PAGES`.

**27. The breakpoint**
- On every `SITE_PAGES` page at 959 wide, `.menu-btn` is visible and `.site-nav` is hidden. At 960 the row is visible, each link is 32px tall, and "Start learning" is at least 122px wide on `/`, `/about`, `/does-not-exist` and `/glossary`.
- Refuse: 720 left in place. At 800 the row would show and this test goes red.
- The opened menu: the five, then "Start learning" where the page has it.

**28. The footer**
- The Learn list's `href`s are, in order, `/how-the-internet-works`, `/networking`, `/tracks`, `/glossary`, `/#try`, on every `SITE_PAGES` page (the track pages' footer is inside `main`).
- `SiteFooter.astro`'s own `@media (max-width: 720px)` is unchanged.

**29. The budget**
- `npm run build` passes, and `check-budgets.mjs`'s table lists `/glossary` under 250 KB.
- Adding the `definitions` prop keeps every lesson's JavaScript under 200 KB.

## 4. Notes (nothing in the spec changes for them)

- **Back without the cache** (H5). A reader who walks to Learn and follows "… in the glossary" comes back to the Overview with "Resume at Learn" wherever the browser does not keep the page in its back/forward cache. That is for the owner, with the job's result.
- **The prototype's CSS differs from the spec's tables in small ways.** Copy the prototype, as §6 and §10 say:
  - `.gl-foot { padding-top: 1px }` with a mouse from 960px (`d9-glossary.html`, the `(pointer: fine)` block);
  - `.explain__def { margin-bottom: 0 }` at 760px and below or to a finger (`:2312`);
  - the chevron's stroke is 1.8 there against Go deeper's 1.6 (`Explanation.tsx:142`); the spec says only "Go deeper's path".
- **The stamp at 320px.** The prototype's comment says its words "stay one line down to 320px" (`d9-glossary.html:155`); §6 and §7 say it wraps below 360px. The CSS is the same either way, and only "at least 44px tall" is checked.
- **The `definitions` prop.** Compute it in the lesson page's frontmatter from `lesson.slug`, as `lessonStamp(lesson)` is (`[lesson].astro:54`), not in `getStaticPaths`. `no-script.test.ts:20-23` builds the page's props by hand, and a missing prop would break it. Make the prop optional in `Explanation` so its existing tests run as they are.
- **Other specs that read Learn.** `reading.spec.ts`, `tablet.spec.ts` and `lesson.spec.ts` open Learn in `dhcp` and `what-is-http`, which now gain the hint and one button (`term-ip`, `pilot.ts:243-245`). Run all three on the unit's port.
- **Home.** Home's demo draws HTTP's terms itself (`index.astro:184`) and shows "IP address" with no definition; §13 keeps it so.
- **`astro dev`.** With a group whose report is missing, the stamp would count its entries as checked. That happens in development only; the build refuses it.
- **A lesson of several units.** The `definitions` map is keyed by term id, so a lesson of several units with a repeated term id would merge two terms. Cited lessons have one unit (`cited.ts`, Rule 1), so nothing reaches this today.
