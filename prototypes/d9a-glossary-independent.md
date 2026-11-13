# D9a: the glossary stands on its own

Amends D9 (`prototypes/d9-glossary.md`, approved 2026-11-13, built as B8) by the owner's decision, direction 2.43. Build unit B8a. Prototype: `prototypes/d9-glossary.html`, which now opens on D9a; the yellow panel's **Design** row (or `?design=d9`) shows D9 as approved beside it.

Read with D9's spec and the errata E1 to E11 under "B8: spec review" in `plan.md`. Everything of D9 not named here stays as built.

## 1. The change in one paragraph

The Glossary page links to no lesson and no track, and no lesson links to the glossary. Under a definition the line **"Taught in"** with its lesson links becomes **"Described in"** with the names of the tracks whose lessons describe the term, as plain text. In a lesson's Learn a term's name still opens its definition and its sources by name, and the definition now ends with its sources: the "… in the glossary" link goes. The header and footer link to `/glossary` stay. The ties from entries to lesson terms stay, as data: they find a lesson's definitions and an entry's tracks.

## 2. What was left open, and what was chosen

| Open | Chosen | Why |
|---|---|---|
| The label | **Described in** | The owner's word. "Taught in" promised a lesson to go to; "Described in" names a place without offering a way there. |
| The note | "…and the tracks whose lessons describe the term." | Says what the names are (tracks) and why they are there, in the label's own verb. |
| Which tracks | Every track that **lists** a ready lesson tied to the definition, not only that lesson's home track | A reader finds a lesson in any track that lists it. No lesson is in two tracks today, so the pilot is the same either way. |
| Order | Site order: the order of `tracks` (`src/content/tracks/index.ts`), as the Tracks page shows them | One order the reader already knows; written order would be arbitrary. |
| Separator | ", " (comma and space), as the Sources line | One separator for both lines. Track titles hold no comma. |
| The row's size | 26px at every width (3px above and below a 20px line), the size a link has with a mouse | A row with nothing to press needs no 44px target. With a mouse at 960px and up the line sits exactly where "Taught in" did. |
| The end of a definition in Learn | The Sources line, then 9px before the next row (`.explain__def` margin-bottom 3px becomes 9px; the phone rule that set it to 0 goes) | The link's own padding (3px, or 12px to a finger) gave the space under the definition; 9px keeps the gap it had with a mouse, at every width. |
| The names' colour | `--ink`, weight 600 (the row's), no underline | Reads as words, not a link; the label stays `--muted`. |

## 3. The Glossary page, before and after

**Markup** (`src/components/GlossaryEntry.astro`). Before:

```html
<p class="gl-row"><span class="gl-label">Taught in</span>
  <a class="gl-lesson" href="/how-the-internet-works/what-is-ip?step=6">IP lesson</a>,
  <a class="gl-lesson" href="/how-the-internet-works/what-is-icmp?step=7">ICMP lesson</a></p>
```

After:

```html
<p class="gl-row gl-row--tracks"><span class="gl-label">Described in</span> <span class="gl-tracks">How the Internet Works</span></p>
```

- One `span.gl-tracks` holding the track titles joined by ", ". No `a`, no `title`, no `href` anywhere in the row.
- A definition with no tie has no row (as before). Each definition of a two-meaning entry has its own row (as before).
- The pointer row ("See TTL") and the Sources row are unchanged.

**Styles** (`src/pages/glossary.astro`). Remove `a.gl-lesson` from the rule `a.gl-lesson, .gl-see a { … }` (it becomes `.gl-see a { color: var(--ink-strong); }`). Add, after it:

```css
/* The tracks whose lessons describe the term. Plain text, no link: 26px tall at every width. */
.gl-row--tracks { padding-block: 3px; }
.gl-tracks { color: var(--ink); }
```

The comment above `.gl-foot` reads: `/* NEW: the two lines under a definition, "Sources" and "Described in". Each source link is 44px tall to a finger. */`. The rule `@media (min-width: 960px) and (pointer: fine) { .gl-row + .gl-row { margin-top: 4px; } }` stays and applies to the new row.

**The data** (`src/lib/glossary.ts`, D9 §9 rule 6 rewritten):

> 6. **Tracks of a definition.** Its `lessons` ties. Each names a ready lesson and a term id in one of its units' Learn (the path's rule 13); a tie to anything else throws and names the entry and the tie, as today. Its tracks are every track that lists one of those lessons, each once, in the order of `tracks`; their words are the tracks' `title`s.

- A definition's `lessons: LessonLink[]` becomes `tracks: string[]`. The function's input gives each ready lesson the titles of every track that lists it (in `tracks` order), in place of `canonical` and `trackTitle`.
- What this orphans goes: `LessonLink`, the lesson wording ("{title} lesson", "… in {track}"), the throw for two ready lessons with one title in one track, the `?step=` address and its `positionOf` call, if nothing else uses them.
- The Learn map (D9 §10) is unchanged in what it finds. Its value no longer needs `entryId` or `entryTerm`, which only the link used: remove them from `LessonDefinition` if nothing else reads them.
- Today: 10 entries, 11 definitions, 11 "Described in" rows; 42 source links and 1 pointer link; 0 lesson links (was 15).

## 4. Learn, before and after

**Markup** (`src/lesson/Explanation.tsx`). Remove the last paragraph of `div.explain__def`:

```html
<p class="explain__def-more"><a href="/glossary#ping">Ping in the glossary</a></p>   <!-- goes -->
```

So an open definition is: the sense's label (for a sense), the text, and `p.explain__def-src` "Sources {names}". Nothing in it is focusable. The hint "Press a name for its definition.", the button, the chevron, the row's target, the open and closed states and the map from term to sense are unchanged.

**Styles** (`src/lesson/console.css`). Remove `.explain__def-more`, `.explain__def-more a`, `.explain__def-more a:hover` and the whole `@media (max-width: 760px), (pointer: coarse) { … }` block that follows them. Change:

```css
.explain__def { grid-column: 1 / -1; margin: -3px 0 9px; padding: 0 0 0 12px; border-left: 2px solid var(--line-strong); }
```

(was `margin: -3px 0 3px`). The comment above `.explain__def-src` reads `/* The sources, by name. The definition ends here; nothing in it is a link. */`.

## 5. Words

| Where | D9 | D9a |
|---|---|---|
| `.gl-note` | Under each definition are the sources it was checked against and the lessons that teach the term. A term with two meanings has a definition for each. New definitions are added once they pass the same check. | Under each definition are the sources it was checked against and the tracks whose lessons describe the term. A term with two meanings has a definition for each. New definitions are added once they pass the same check. |
| The second line under a definition | Taught in | Described in |
| Its contents | {lesson title} lesson (or "… lesson in {track title}"), links | {track title}, {track title}: plain text, site order |
| Learn, under a definition | {the entry's name} in the glossary (a link) | nothing |

Every other word of D9 §5 stands. Pilot results: every definition reads "Described in How the Internet Works", but IP address: "Described in How the Internet Works, Networking Concepts".

## 6. D9's sections, as they now read

- **§1, §3, §4.** "Taught in" reads "Described in" throughout. State "Four lessons, two with one title" (`#ip-address`) becomes "Two tracks": "Described in How the Internet Works, Networking Concepts". State "A lesson link" goes. Screen 2's "To the glossary and back" goes; "A name that differs from its entry's" (Latency) reads: the tape reads "Latency (round-trip time)", the lesson's name, and the definition is the entry Latency's.
- **§7.** At 375: "stacked: name, definition, Sources, Described in".
- **§8.** The last bullet ends: "A lesson has no site header and no way to the glossary; the glossary has no way to a lesson or a track."
- **§10.** The paragraph "**The link** opens `/glossary#{entry id}` … **The way back** …" goes. The sentence "The reader who wants the other meaning follows 'TTL in the glossary', where both are." goes. In the sizes table the row `.explain__def-more a` goes and `.explain__def`'s margin is "-3px above, 9px below".
- **§11, the page.** How TTL is read: "… Sources. RFC 791: RFC 791 §3.1; RFC 791 §1.4, opens in a new tab, link. … Described in How the Internet Works. In DNS. …". The "Links" bullet's "Every 'ICMP lesson' goes to one address." goes. Focus order: "… for each entry its source links, or a pointer's link; the footer." Targets: "Every link in a row (a source's or a pointer's) is 44px tall on a touch screen and below 960px … (43 links in the pilot). The 'Described in' row holds no target: 26px at every width."
- **§11, the lesson.** Keyboard: "Tab reaches each row's source numbers, then its button; Enter or Space opens it; the definition holds nothing to focus, so the next Tab is the next row's first source number (tried: after Enter on Ping, Tab lands on Latency's '4')." Targets: "The row: 44px by the list's width." The glossary link's half goes.
- **§16.** "'Taught in' follows 'Sources' … the lessons are the way onward" becomes "'Described in' follows 'Sources': what the definition stands on, then where the site describes it; neither leads out of the page but to a source." "The lesson's name stays on the tape, the entry's name is in the link" becomes "The lesson's name stays on the tape." "No link from the glossary that opens a term in the lesson" becomes "No link between the glossary and any lesson or track (direction 2.43)."
- **§17.** Question 1's last sentence ("the lessons' definitions need the page to link to") goes; question 4's premise ("The links are on the entry, one press away") now reads: the sources' links are on the Glossary page, reached from the site header.
- **Errata.** E5 falls away (check 33 is replaced). E10 falls away (the link is gone). E2's list of data-exact checks gains check 7's row words and check 14's "no link into a track or lesson". E1, E3, E4, E6 to E9 and E11 stand.

## 7. Acceptance checks, numbered against D9 §15

Unchanged: 1 to 6, 8 to 10, 12, 13, 16 to 18, 20, 21, 24 to 27, 29, 30, 32, 35, 37 (as E1), 38 (as E6), and H. Changed or replaced:

7. **(changed)** A definition's tracks are every track that lists one of its tied lessons, each once, in `tracks` order, as the track's title. TTL in IP packets: "How the Internet Works" (two lessons, one track, named once). TTL in DNS: "How the Internet Works". IP address: "How the Internet Works", "Networking Concepts", in that order. A fixture lesson listed by two tracks gives both, in `tracks` order. A fixture tie to a lesson that is not ready, or to a term not in its Learn, throws and names entry and tie. No definition's data holds a lesson's title or address.

11. **(changed)** As D9's, with the note of section 5 (D9a) word for word.

14. **(replaced)** The page links to no lesson and no track: no `a` in `main` has an `href` that is `/tracks` or starts with `/{track id}` for any track. Under Ping the row reads "Described in How the Internet Works" and holds no `a`. Every `.gl-row--tracks` holds no `a`.

15. **(changed)** `#ttl` holds "Also called Time to Live", then "In IP packets" above its definition and "In DNS" above its own, each definition with its own "Described in" row reading "Described in How the Internet Works".

19. **(changed)** As D9's, against section 5 (D9a): "Taught in" is nowhere in `main`, and no `.gl-row` holds the word "lesson".

22. **(changed)** As a touch screen at 375 and 768: every link in a `.gl-row` (a source's, a pointer's), the stamp and "All letters" are at least 44px tall, and no two links' boxes overlap. Each `.gl-row--tracks` holds no link and is 26px tall on one line, 20px more for each line it wraps to (±1).

23. **(changed)** As D9's, with "Described in" for "Taught in".

28. **(changed)** Pressing "Ping" shows, under its row, the entry's definition exactly and "Sources" with the four short names in order, and nothing else: the open `div.explain__def` holds no `a` and no other focusable element. `aria-expanded` is "true". Pressing again hides it. Opening Ping leaves the other eight closed; two can be open at once.

31. **(changed)** Latency's button reads "Latency (round-trip time)" and its definition is the entry Latency's text.

33. **(replaced)** No lesson links to the glossary: in the ICMP lesson at Learn with all nine definitions open, no `a` has an `href` starting `/glossary`, and the text "in the glossary" is nowhere; the same holds in `Explanation.test.tsx` with every term given a definition. The built HTML of every lesson page has no `href="/glossary`.

34. **(changed)** Keyboard: Tab reaches the button; Enter opens it; the next Tab leaves the row (to the next row's first source number, or its button when it has none).

36. **(changed)** At 375 as a touch screen each button's target is at least 44px tall and the list's width. (The glossary link's half goes.)

## 8. Measured

In Chromium (Playwright), on the prototype before (D9, as approved) and after (D9a); 375 by 812 as a touch screen, 1440 by 900 with a mouse. Both themes looked at, at both sizes; no sideways scroll at either.

**The Glossary page**

| | 375 before | 375 after | 1440 before | 1440 after |
|---|---|---|---|---|
| Height, the pilot | 5,837px | 5,596px | 3,101px | 3,074px |
| Height, the full glossary | 43,469px | 41,302px | 17,428px | 17,401px |
| Ping | 405px | 387px | 140px | 140px |
| TTL | 693px | 657px | 298px | 298px |
| IP address | 496px | 410px | 165px | 138px |
| IP address's second line | 132px (three 44px links) | 46px (two lines) | 78px | 46px (two lines in the 300px column) |
| Links in rows | 58 (42 sources, 15 lessons, 1 pointer) | 43 | 58 | 43 |
| Least and most height of a row link | 44 / 44px | 44 / 44px | 26 / 34px | 26 / 34px |

At 1440 a one-line "Described in" sits where "Taught in" sat, so an entry is no shorter unless its lessons wrapped.

**Learn in the ICMP lesson** (the Explanation panel's whole scroll height)

| | 375 before | 375 after | 1440 before | 1440 after |
|---|---|---|---|---|
| All nine closed | 2,272px | 2,272px | 1,732px | 1,732px |
| All nine open | 4,071px | 3,756px | 2,973px | 2,793px |
| One open definition | 153 to 219px | 109 to 175px | 94 to 157px | 68 to 131px |
| Links to `/glossary` with all open | 9 | 0 | 9 | 0 |
| The window scrolls | no | no | no | no |

The two links whose `href` holds "glossary" in both states are Cloudflare sources (`…/learning/ddos/glossary/…`); check 33 tests for `/glossary` at the start of the `href`.

## 9. Open questions for the owner

None that block the build. One consequence to know: a reader in a lesson now reaches a definition's linked sources, and the definition's other meaning (TTL in DNS), only by leaving the lesson for the Glossary page through the site header.
