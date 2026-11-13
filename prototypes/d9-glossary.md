# D9: the Glossary page of written definitions, and a term's definition in a lesson's Learn

Spec for build unit B8 (`plan.md`, job 9). Prototype: `prototypes/d9-glossary.html`, one file that opens from the file system: fonts, styles, scripts and every word are inline, and it asks the network for nothing. The yellow "Prototype" panel and the yellow note are not part of the design.

Read with: `plan.md` (decisions 3, 4, 6, 10, 11), `docs/glossary-path-spec.md` §1 and §2 (the shape of an entry), `docs/direction.md` §6 and §7, and `prototypes/d8-glossary.md`, whose header, footer, letter keys, name tape and landing mark carry over unchanged. Where this spec says "D8 §n", that section of D8's spec still holds, word for word.

**How the prototype was made.** The ten entries were printed by a throwaway script from `src/content/glossary-groups/pilot.ts` as it was merged and passed (`docs/fact-checks/glossary/pilot.md`, checked 2026-11-13), with each source's short name and each citation's address and label from `src/content/sources.ts`. No definition was retyped. The lesson screen is the ICMP lesson at Learn as the site builds it today: its markup was read from the built page in a browser and its stylesheets from `dist`, and this unit's change is drawn into its terms list.

## 1. The design in one paragraph

**The page.** A to Z under D8's letter keys. An entry is the term's name on label tape, then its definition in the reading size, then two short lines: **Sources**, the documents the definition was checked against, each a link to the exact place cited; and **Taught in**, the lessons whose Learn teaches the term. A term with two meanings has one definition for each, each under its own label ("In IP packets", "In DNS") with its own two lines, a dashed line between. Another spelling ("Time to Live") is filed at its own letter as a dashed tape that points to the entry. From 960px an entry is a ledger of three columns: name, definition, and the two lines beside it. One stamp under the page's opening words says how many terms are checked and when the latest check was.

**The lesson.** Learn's terms list keeps every line and every name as they are. A term that has a glossary entry gains that entry's definition under its row: the definition, the names of its sources, and a link to the entry on the Glossary page. Two variants: **B (recommended)**, the definition is behind a press on the name; **A**, it is always open.

## 2. Variants

- **Screen 1, the Glossary page: one design.**
- **Screen 2, a definition in Learn: two.**
  - **B, press the name (recommended).** The name becomes a button with a small chevron, and one line above the list says "Press a name for its definition." Learn is 46px longer than today at 1440 and 71px at 375, so Learn's own words stay where they are (decision 10). The reader who wants a definition gets it in place, one at a time or several.
  - **A, always open.** Every definition shows under its row. What it buys: nothing to press, nothing hidden, and the owner's question (do the lines read as thin beside the definitions?) is answered at a glance. What it costs: Learn is 75% longer at 1440 (2,953px from 1,686px) and 82% longer at 375 (4,008px from 2,201px), and the nine lines stop reading as one list: at 1440 by 900 the first screen shows two and a half terms where today it shows six.

## 3. Screen 1: what the page is made of

`src/pages/glossary.astro`, in `BaseLayout` with `title="Glossary"`, the description in section 5 and `current="glossary"`. No island, no script of its own. Class prefix `gl`.

```html
<div class="wrap gl">
  <div class="gl-head">
    <h1 class="disp">Glossary</h1>
    <p class="gl-lead">…</p>
    <p class="gl-note">…</p>
    <p class="gl-stamp"><a class="stamp" href="/about#facts" data-checked><svg …/>10 terms checked, the latest on 13 Nov 2026</a></p>
  </div>

  <nav class="gl-az" id="letters" aria-label="Jump to a letter"><ul>… D8's keys …</ul></nav>

  <section class="gl-letter" id="letter-t">
    <div class="gl-bar"><h2>T</h2><a class="gl-up" href="#letters">All letters</a></div>
    <dl class="gl-list">

      <!-- another spelling: a pointer -->
      <div class="gl-entry gl-entry--see" id="time-to-live">
        <dt><span class="gl-name gl-name--see">Time to Live</span></dt>
        <dd><p class="gl-row gl-see">See <a href="#ttl">TTL</a></p></dd>
      </div>

      <!-- an entry with two meanings -->
      <div class="gl-entry" id="ttl">
        <dt>
          <span class="gl-name">TTL</span>
          <p class="gl-also">Also called <b>Time to Live</b></p>
        </dt>
        <dd>
          <div class="gl-body">
            <p class="gl-sense">In IP packets</p>
            <p class="gl-def">The TTL (Time to Live) is a number in … called the Hop Limit.</p>
          </div>
          <div class="gl-foot">
            <p class="gl-row"><span class="gl-label">Sources</span>
              <a class="gl-src" href="https://www.rfc-editor.org/rfc/rfc791.html#section-3.1" target="_blank" rel="noopener"
                 title="RFC 791 §3.1; RFC 791 §1.4" aria-label="RFC 791: RFC 791 §3.1; RFC 791 §1.4 (opens in a new tab)">RFC 791</a>,
              <a class="gl-src" …>RFC 1812</a>, <a class="gl-src" …>RFC 1122</a>, <a class="gl-src" …>RFC 8200</a></p>
            <p class="gl-row"><span class="gl-label">Taught in</span>
              <a class="gl-lesson" href="/how-the-internet-works/what-is-ip?step=6">IP lesson</a>,
              <a class="gl-lesson" href="/how-the-internet-works/what-is-icmp?step=7">ICMP lesson</a></p>
          </div>
        </dd>
        <dd>… "In DNS", its definition, its two lines …</dd>
      </div>
    </dl>
  </section>
</div>
```

- **One `div.gl-entry` for each entry and for each other spelling**, in A to Z order (section 9). An entry has one `dt` and one `dd` for each definition: one for an entry with `definition`, one for each of its `senses`.
- **`p.gl-def`** is the definition's statements in written order, joined by one space, as plain text. No marks, no bold, nothing between the statements.
- **`p.gl-sense`** is the sense's `label` as written. An entry with one definition has no `p.gl-sense`.
- **`p.gl-also`** shows only when the entry has `also`: "Also called " and each spelling in a `<b>`, joined by ", ".
- **Sources line.** One link for each source the definition cites (section 9, rule 5). The link's words are the source's short name; it opens the first place the definition cites in that source, in a new tab; `title` names every place, and `aria-label` is "{short name}: {places} (opens in a new tab)". The comma is text outside the link.
- **Taught in line.** One link for each lesson tied to this definition (section 9, rule 6), in the same tab, to that lesson's Learn. A definition with no tie has no "Taught in" line.
- **No numbered marks.** A number needs a list to belong to, and this page has no one list. A definition's sources are few (two to six in the pilot), so they are named in full under it.
- **No stamp on an entry.** The page's one stamp covers them: the build refuses an entry with no passing check, so every definition on the page has passed.
- **No drawing, no search box, no count but the stamp's.** The keys are the page's figure.

## 4. States, and how to see each in the prototype

Open the yellow panel, or use the address: `?screen=glossary|lesson`, `?theme=dark`, `?size=full`, `?head=home|tracks|track|about|404`, `?nojs=1`, `?variant=today|a|b`, `?entries=some`, `?open=all` (or `?open=ping,ttl`), `?bare=1` (no panel), and any `#id`.

**Screen 1**

| State | Where | What shows |
|---|---|---|
| The pilot | Size: The pilot | Ten entries and one pointer under six letters. The key row shows only D, E, I, L, P, T (section 6, "the keys") |
| The full glossary | Size: The full glossary | 113 names and eight pointers under 19 letters; the row is the whole alphabet with seven dashed keys. The ten real entries are in place; the other 103 are grey bars (a stand-in, section 18) |
| One definition | `#ping` | Name; definition; Sources (four); Taught in (one) |
| Two meanings | `#ttl` | "Also called Time to Live"; "In IP packets" with its definition, four sources and two lessons; a dashed line; "In DNS" with its own |
| Another spelling | `#time-to-live` | A dashed tape "Time to Live" and "See TTL", which goes to `#ttl` |
| Four lessons, two with one title | `#ip-address` | "HTTP lesson, IP lesson, DHCP lesson in How the Internet Works, DHCP lesson in Networking Concepts" |
| Six sources | `#packet-loss` | The Sources line wraps: three lines at 375, three in the ledger's side column at 1440 |
| Landing on a term | any `#id` | D8's: the entry under the sticky bar, tinted `--here-soft` with a 3px `--here` bar on its left |
| A jump to a letter, a letter with no term, key hover and press | the keys | D8's, unchanged (D8 §4) |
| A source link | any | `--link`, underlined; opens the cited place in a new tab |
| A lesson link | any | The site's link (`--ink-strong`, the line-coloured underline). In the prototype "ICMP lesson" opens the Lesson screen; the others stay put with the real address in `title` |
| Light and dark | the header's button or the panel | Tokens only |
| JavaScript off | panel | The same page; only the header's theme button goes (D8 §12) |
| The header on other pages | panel, "Header on" | D8's, unchanged |

There is no empty state: the glossary has ten entries from the day the page is built.

**Screen 2** (panel: Screen, "Lesson: Learn")

| State | Where | What shows |
|---|---|---|
| Today | Terms: Today | The built lesson, untouched: the baseline |
| B, all closed | Terms: B | The hint line; each name a button with a chevron pointing right |
| B, one or more open | press a name or anywhere on its row | The chevron turns down, the name's border goes to `--ink-strong`, the definition shows under the row. Each row opens and closes on its own |
| B, all open | "Open all" | The prototype's shortcut for looking at the nine together; not a control in the design |
| A | Terms: A | Every definition open; names are plain tape as today; no hint |
| A term with two meanings | TTL | "In IP packets" above the definition; only that sense shows (section 10) |
| A name that differs from its entry's | Latency | The tape reads "Latency (round-trip time)", the lesson's name; the link reads "Latency in the glossary", the entry's |
| Only some terms have an entry | Entries: Three written | Ping, TTL and Traceroute are as above; the other six rows are exactly today's: plain tape, no chevron, not a button |
| No term has an entry | Terms: Today | Today's Learn, and no hint line |
| To the glossary and back | "Ping in the glossary", then "ICMP lesson" under Ping | The Glossary page at `#ping`, marked as landed on; then the lesson's Learn again |
| Hover, focus | a name in B | Hover: border `--ink-strong`. Focus: the site's ring round the tape |

## 5. Every word of new copy

| Where | Words |
|---|---|
| Header link, phone menu link, footer link | Glossary |
| Page title (`<title>` is "Glossary · TechConcepts") | Glossary |
| Meta description | Definitions written for this site, each one checked against its sources. |
| `h1` | Glossary |
| `.gl-lead` | Definitions written for this site, each one checked against its sources. |
| `.gl-note` | Under each definition are the sources it was checked against and the lessons that teach the term. A term with two meanings has a definition for each. New definitions are added once they pass the same check. |
| The stamp | {n} terms checked, the latest on {date} |
| The stamp, one term | 1 term checked on {date} |
| The keys' `aria-label`; a key with no term; the link in a letter's bar; the digit group | D8's: "Jump to a letter"; "{letter}, no terms"; "All letters"; "0–9" |
| Other spellings, under the name | Also called {spelling}, {spelling} |
| A pointer | See {the entry's name} |
| The first line under a definition | Sources |
| A source link's `aria-label` | {short name}: {places} (opens in a new tab) |
| The second line under a definition | Taught in |
| A lesson link | {lesson title} lesson |
| A lesson link when another ready lesson has the same title | {lesson title} lesson in {track title} |
| Learn, above the terms (variant B only) | Press a name for its definition. |
| Learn, under a definition | Sources |
| Learn, the link under a definition | {the entry's name} in the glossary |

`{date}` is `stampDate`'s form, "13 Nov 2026". `{places}` is the citations' labels joined by "; ". The page's own words say nothing about technology; every such word on the page comes from an entry.

## 6. Screen 1: sizes and spacing

All colours are tokens; none is new. The rules are in the prototype's second `<style>`, marked "CARRIED FROM D8" or "NEW"; copy them. `--display` is Barlow Semi Condensed, `--sans` Atkinson Hyperlegible Next.

**Head.** D8's (`.gl` padding 36px top and 72px bottom; `h1` 64px, 44px below 600px; lead 20px/1.4, 18px below 600px; note 16px/1.55 `--muted`, max-width 40em). New: `.gl-stamp` 8px above; its link is the site's `.stamp` at 15px, at least 44px tall, and may wrap (it does below 360px). The keys follow 20px below (D8: 28px).

**The keys, a letter and its bar.** D8 §6, unchanged, with one new rule: **when fewer than 13 letters have a term, the row holds only those letters' keys**, in A to Z order, in the same grid (so six keys fill the first six places of 26 from 1280px, of 13 from 600px, and one row of seven below). From 13 letters with a term the row is the whole alphabet, dashed where a letter has none. The pilot has 6 letters; the proposed full list has 19.

**An entry, below 640px (stacked)**

| Part | Value |
|---|---|
| `.gl-entry` | padding 14px 12px 6px, margin-inline -12px, 1px `--line` above (none above the first of a letter, whose top padding is 8px); `scroll-margin-top` 136px (134px from 1280px) |
| `.gl-name` | D8's tape: padding 4px 9px 5px, 1px `--line-strong`, radius 2px, fill `--card`, Barlow 700 19px/1.2, 0.01em, `--ink-strong` |
| `.gl-also` | 7px above; 15px/1.4 `--muted`; the spelling in `--ink`, weight 500 |
| `dd` | 10px padding above. A second `dd`: 6px margin, 1px dashed `--line-strong`, 14px padding above |
| `.gl-sense` | Barlow 700 17px/1.25, 0.01em, `--ink-strong`, 3px below |
| `.gl-def` | Atkinson 17px, line-height 27px, `--ink-strong`, max-width 36em |
| `.gl-foot` | 2px above |
| `.gl-row` | Barlow 600 15px, line-height 20px, 0.02em, `--muted`; the label has 4px after it |
| A link in a row | `display: inline-block`, 12px padding above and below: 44px tall. A source: `--link`, underline offset 2px. A lesson: `--ink-strong`, the site's underline |
| `.gl-name--see` | The tape with a dashed border, no fill, weight 600, `--ink` |
| `.gl-entry--see` | 2px padding below; its `dd` has no padding above |
| Landed on | D8's: fill `--here-soft`, `box-shadow: inset 3px 0 0 var(--here)` |

**From 640px:** the name stands beside its definitions. `.gl-entry` is a grid, columns 180px and the rest, 24px gap, padding 14px above and 8px below; the `dt` spans the rows; each `dd` is in the second column with 2px padding above (a second `dd`: 8px margin, 14px padding). The two lines stay under their definition. A pointer has 4px above and below.

**From 960px: the ledger.** `.gl-entry` columns 220px and the rest, 14px above and below. Each `dd` is itself a grid: the definition, then a 220px column holding the two lines, 24px gap; a second `dd` has 14px margin and 14px padding. From 1200px: 280px, the rest, 300px, with 32px gaps (at 1440 the definition is 596px wide).

**With a mouse, from 960px** (`@media (min-width: 960px) and (pointer: fine)`): a link in a row has 3px padding above and below (26px tall) and the second line sits 4px under the first; a pointer's link has 7px (34px). On a touch screen of any width, and below 960px with any pointer, the links stay 44px.

## 7. Breakpoints, and what each width shows

| Width | Header | Keys | Entries |
|---|---|---|---|
| 320 | menu button | 6 to a row | stacked; the stamp wraps to two lines |
| 375 | menu button | 7 to a row | stacked: name, definition, Sources, Taught in. Each letter's bar sticks under the header |
| 640 to 959 (768) | menu button | 13 to a row | name (180px) beside its definitions; the two lines under each definition; links 44px. Bars stick |
| 960 | the row of five links | 13 to a row | the ledger: 220 / definition / 220 |
| 1200 | row | 13 to a row | the ledger: 280 / definition / 300 |
| 1280 and up (1440) | row | 26 in one row, sticky; bars scroll; "All letters" is gone | the same |

The page's own breakpoints are D8's: 360, 600, 640, 960, 1200 and 1280. **What changed from D8 at 640 to 959:** D8 set stacked entries in two columns there. A definition makes an entry three to five times taller, and a reader would scroll down one column of a letter and back up for the next, so the name moves beside the definition instead and the list stays one column.

The lesson at 768 is the lesson's own tablet layout (direction §7); the terms list is the same list in it. Measured at 768 by 1024 and 1024 by 768 with all nine open: no sideways scroll, the glossary link 44px tall.

## 8. The header and footer

D8 §8 and §13, unchanged: "Glossary" is the second of five links (Tracks, Glossary, How a lesson works, Sources, About); the menu button takes over below 960px; the footer's Learn list has "Glossary" after "All tracks".

- **`src/components/SiteHeader.astro`:** `current` gains `'glossary'`; `links` gains `{ key: 'glossary', href: '/glossary', label: 'Glossary' }` second; `@media (max-width: 720px)` becomes `@media (max-width: 959px)`. Nothing else.
- **`src/components/SiteFooter.astro`:** `<li><a href="/glossary">Glossary</a></li>` after "All tracks". Nothing else.
- **`src/layouts/BaseLayout.astro`:** `current` gains `'glossary'`. Nothing else.
- **`e2e/support.ts`:** `SITE_PAGES` gains `{ name: 'glossary', path: '/glossary' }`.
- The page shows "Start learning", and "Glossary" has `aria-current="page"` on it. A lesson has no site header and gets no header link to the glossary; its way there is the link under a definition (section 10).

## 9. The data the page needs, as rules

One pure function in a file of its own (for example `src/lib/glossary.ts`), worked out when the site is built, with unit tests. It reads `GLOSSARY` and `GLOSSARY_GROUPS` (`src/content/glossary.ts`), `partsOf` (`src/content/glossary-group.ts`), the lesson registry, `SOURCES` and each group's report date. It keeps no copy of any word.

1. **Items.** Every entry of every group is one item, under its `term`. Every spelling in an entry's `also` is one more item, a pointer to that entry. (Names are unique across the glossary by the path's rule 12, so no two items share a name.)
2. **A to Z order and the letter:** D8 §9 rules 6 and 7, applied to an item's name: the sort key drops leading characters that are neither letters nor digits; `Intl.Collator('en', { sensitivity: 'base', numeric: true })`; a tie by code units; the letter is the key's first character without its accent; a digit files under "0–9" before A; a name with neither throws. A pointer is sorted and filed by its own spelling.
3. **Ids.** An entry's id is its own `id` from the group file (`ttl`, `ip-address`). A pointer's id is made from its spelling by D8 §10's rule (lower case, accents removed, runs of other characters to one hyphen): "Time to Live" is `time-to-live`. Reserved: `main`, `menu`, `menu-panel`, `theme-toggle`, `letters`, every `letter-…`. An entry id that is reserved: the build throws and names it. A pointer id already taken, by a reserved id, an entry or an earlier pointer, takes `-2`, then `-3`. A unit test holds that every id on the page is used once.
4. **Definitions.** `partsOf(entry)`, in written order. Each gives the label (a sense's, or none), the text (statements' `text` joined by one space), its sources and its lessons.
5. **Sources of a definition.** Walk its statements in order and each statement's `cite` in order. One source for each different `source` id, in the order first met. Its words are `SOURCES[id].short`; its address is the `url` of the first citation of it; its places are the different `label`s of its citations, in order, joined by "; ". Two different sources with the same short name in one definition: the build throws (the registry's 290 short names are all different today).
6. **Lessons of a definition.** Its `lessons` ties. Each names a ready lesson and a term id in one of its units' Learn (the path's rule 13). The link is `{the lesson's canonical address}?step={positionOf(lesson, that unit's index, 'learn')}`. Its words are D8 §9 rule 5: "{title} lesson", or "{title} lesson in {home track's title}" for every lesson whose title another ready lesson shares. Order: site order (D8 §9 rule 1), whatever the written order. Two ties of one definition to one lesson make one link.
7. **The stamp.** `{n}` is the number of entries (pointers and senses are not counted). `{date}` is the latest `checked` date among the groups' reports (`docs/fact-checks/glossary/<group>.md`, and a passing re-check's date where it is later, as `checkedOn` reads a lesson's). It links to `/about#facts`.
8. **The keys.** Letters that have an item; when fewer than 13 do, only those are keys (section 6).

Today that gives 10 entries, 11 definitions, 1 pointer, 6 letters, 42 source links and 15 lesson links.

## 10. Screen 2: a term's definition in Learn

The Lesson page keeps its layout: no panel moves or changes size (section 14). Only `ol.explain__terms` changes, and only for a term that has an entry.

**How a lesson's term finds its entry and its sense.** From the glossary's side, as decision 3 sets it; no lesson file changes. When the site is built, walk every entry and each of its `partsOf`; for each tie `{ lesson, term }` of a part, record under the key `{lesson slug}/{term id}` that part with its entry. A lesson term is tied to at most one part (the path's rule 14), so the map has one value a key. A sense is chosen by the tie and by nothing else: the ICMP lesson's `term-ttl` is tied to TTL's sense `ip`, so that lesson shows "In IP packets" and its definition and never the DNS one; the DNS lesson's `term-ttl` is tied to sense `dns`. The reader who wants the other meaning follows "TTL in the glossary", where both are.

**What the lesson is given.** The lesson page passes `LessonConsole` one more prop, which goes down to `Explanation`: for the lesson's units, `definitions: Record<term id, { entryId, entryTerm, label?, text, sources: string[] }>`, where `text` is the statements joined by one space and `sources` is the short names of section 9, rule 5. A term with no entry has no key. Nothing is fetched and nothing is saved.

**A term with no entry yet** (most terms, until the rest are written) is drawn exactly as today: the same `li`, a `span.explain__term`, no chevron, no hint for it, no extra height.

**Markup, variant B.** In `src/lesson/Explanation.tsx`, the terms list (today lines 303 to 313):

```html
<p class="explain__hint">Press a name for its definition.</p>   <!-- only when at least one term has an entry -->
<ol class="explain__terms" aria-label="Terms">
  <li data-def="closed">                                        <!-- "open" when pressed; no data-def for a term with no entry -->
    <span class="explain__idea">The tool that sends those<sup class="explain__marks">…</sup></span>
    <button type="button" class="explain__term" aria-expanded="false" aria-controls="def-term-ping">
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M4 2l4 4-4 4" …/></svg><span>Ping</span>
    </button>
    <div class="explain__def" id="def-term-ping" hidden>
      <p class="explain__def-sense">In IP packets</p>            <!-- only for a sense -->
      <p class="explain__def-text">Ping is a tool that sends … were lost.</p>
      <p class="explain__def-src"><span class="explain__def-label">Sources</span> Microsoft ping, RFC 2151, Cisco ping and traceroute, Microsoft Azure TCP/IP tuning</p>
      <p class="explain__def-more"><a href="/glossary#ping">Ping in the glossary</a></p>
    </div>
  </li>
</ol>
```

- The idea, its marks and the name's words are today's, untouched. The chevron is Go deeper's path.
- **Pressing** the button, or anywhere on the row's first 44px that is not a source number, opens or closes that term's definition. Each term is on its own; several can be open. What is open is kept in memory while the lesson is open (as the log's fold is) and saved nowhere.
- `hidden` goes when open. `aria-expanded` follows. Focus stays on the button. No animation but the chevron's turn (180ms, none with reduced motion).
- **Sources in a lesson are named, not linked,** and carry no numbers: a lesson's numbers belong to that lesson's own list, and the ICMP definitions cite three documents the lesson does not list (ITU-T G.114, RFC 8200, RFC 7680). The links are on the entry, one press away.
- **The link** opens `/glossary#{entry id}` in the same tab. The entry lands under the page's sticky bar, marked as "here". **The way back** is the browser's Back, or the entry's own "Taught in" link to the lesson's Learn.
- **JavaScript off:** the definitions are in the page's HTML, and the lesson's no-script styles show them all: `:root:not(.js) .explain__def[hidden] { display: block; }` and `:root:not(.js) button.explain__term svg { display: none; }`.

**Markup, variant A:** the same `div.explain__def` in each `li`, never `hidden`; the name stays `span.explain__term`; `data-def="shown"`; no hint, no button, no state.

**Sizes** (for `src/lesson/console.css`, after `.explain__term`; they are the prototype's `<script id="lesson-new-css">`, copy them)

| Part | Value |
|---|---|
| `.explain__hint` | Atkinson 13px/1.4, `--muted`; margin -6px above, 8px below |
| `.explain__def` | spans both columns; margin -3px above, 3px below; 12px padding on the left of a 2px `--line-strong` rule |
| `.explain__def-sense` | Barlow 700 13.5px/1.3, 0.02em, `--ink-strong`, 2px below |
| `.explain__def-text` | Atkinson 14.5px/1.5, `--ink`: the size of the line it sits under |
| `.explain__def-src` | 4px above; Barlow 600 13.5px, line-height 20px, 0.02em, `--ink`; the label `--muted` with 3px after it |
| `.explain__def-more a` | Barlow 600 13.5px, `--ink-strong`, the site's underline; 3px padding above and below (26px). At 760px wide and below, or with a coarse pointer: 12px (44px) |
| B: a row with an entry | `min-height: 45px` (44px and its rule), the idea and the name centred; when open, on their baseline as today. Today's row is 42.2px |
| B: `button.explain__term` | today's tape, with the chevron (8px, `--muted`) 5px before the name and 5px of padding before the chevron; fill `--card`; border `--ink-strong` on hover and when open |
| B: the target | the button's `::after`, the row's full width and its first 44px of height; the source numbers and the open definition sit above it (`position: relative; z-index: 1`) |

The selector for a row is `.explain__terms > li`: `.explain__terms li` would also catch a list inside a definition.

## 11. Screen readers, keyboard, targets

**The page**

- **Structure.** `h1`; the stamp, a link; a `nav` "Jump to a letter" (a list); an `h2` for each letter; under each a `dl` whose groups are a name (`dt`) and one `dd` for each definition, or for a pointer one `dd` holding "See {name}".
- **How TTL is read.** "TTL. Also called Time to Live. In IP packets. The TTL (Time to Live) is a number … Sources. RFC 791: RFC 791 §3.1; RFC 791 §1.4, opens in a new tab, link. … Taught in. IP lesson, link. ICMP lesson, link. In DNS. In DNS, the TTL …". The label is heard before its definition, and each definition's sources and lessons before the next label.
- **Links.** Every "ICMP lesson" goes to one address. Two source links with the same words in different entries may open different places of one document; their `aria-label`s say which.
- **Focus order.** Skip link; header; the stamp; the keys that are links; then letter by letter: "All letters" (below 1280px), and for each entry its source links, then its lesson links, or a pointer's link; the footer. No `tabindex`, no focus script (D8 §11).
- **Targets.** Keys 44px tall and at least 44.7px wide. Every link in a row is 44px tall on a touch screen and below 960px, at 320, 375, 768 and 959 (measured: 65 links in the pilot, least and most 44px). With a mouse from 960px: 26px. The stamp and "All letters": 44px.
- **Motion.** The keys' 150ms fill and press, as D8. Nothing else.

**The lesson (variant B)**

- The list is still `ol` "Terms" with nine items. In an item: the idea and its source links; a button named by the term ("Ping"), `aria-expanded`, controlling the definition; when open, the definition's text, "Sources" and the names, and the link "Ping in the glossary".
- **Keyboard.** Tab reaches each row's source numbers, then its button; Enter or Space opens it; the next Tab is "… in the glossary" when open (tried: after Enter on Traceroute, Tab lands on "Traceroute in the glossary").
- **Targets.** The row: 44px by the list's width (514px at 1440, 331px at 375). The glossary link: 44px in the phone layout and to a finger, 26px with a mouse.

## 12. JavaScript off

The page is the same page: the same HTML and the browser's own jumps and landing. Only the header's theme button goes (D8 §12). In a lesson every definition shows open (section 10).

## 13. What stays

- Every lesson file, every lesson's words, every lesson's claim sheet and report.
- The Lesson page's layout at every width; Learn's lead, pattern, why, Go deeper and sources; the stamp's count of a lesson's sources.
- `Marks.tsx`, `sourceNumbers.ts`, the lesson's numbered source list.
- Home, Tracks, the track pages, About, 404, but for the header and footer link.

## 14. Measured

Screenshots are in the ignored `.superpowers/revamp/job-9/shots/d9-*.png`, taken in Chromium at each width and theme; the 375, 768 and 320 ones as a touch screen.

**The Glossary page** (there is none today)

| | 375 | 768 | 960 | 1440 |
|---|---|---|---|---|
| Height, the pilot (10 entries) | 5,837px | 4,258px | 3,482px | 3,101px |
| Height, the full glossary (113 names, 103 of them stand-ins) | 43,469px | 29,651px | 21,458px | 17,428px |
| Sideways scroll, both sizes | none | none | none | none (also none at 320, 959 and 1280) |
| Ping (one definition, 43 words) | 405px | 267px | 166px | 140px |
| TTL (two meanings) | 693px | 493px | 379px | 298px |
| IP address (56 words, four lessons) | 496px | 293px | 251px | 165px |
| A pointer | 95px | 53px | 43px | 43px |
| The definition's width | 311px | 500px | 408px | 596px |
| The first letter starts at, pilot / full | 491 / 905px | 467 / 651px | 467 / 632px | 488 / 587px |
| Landing on `#ttl`: the entry's top | 136px, the bar's foot at 128px | | | 134px, the keys' foot at 133px |
| After the key "S": the bar of S | 72px | | | 140px |

At 375 the full glossary is about 54 screens (D8's page of the lessons' lines was 23,693px): a definition is five to eight lines there, and each of its two lines of links is 44px tall for each line it wraps to.

**Learn in the ICMP lesson** (the length is the Explanation panel's whole scroll height; the panel itself is 730px of it at 1440 by 900 and 502px at 375 by 812)

| | 1440 by 900 | 375 by 812 |
|---|---|---|
| Today | 1,686px | 2,201px |
| B, all closed | 1,732px (+46) | 2,272px (+71) |
| B, all nine open | 2,973px | 4,071px |
| A | 2,953px (+1,267, 75% longer) | 4,008px (+1,807, 82% longer) |
| B with three of nine written | 1,715px | 2,226px |
| The terms list: today / B closed / A | 381 / 406 / 1,647px | 456 / 507 / 2,264px |
| A row: today / B closed | 42.2 / 45px | 42.2 or 61 / 45, 61 or 82px |
| One open definition | 105 to 168px under its row | 163 to 246px |
| The Explanation panel (x, y, width, height) | 868, 92, 560, 732: as today | 0, 246, 375, 502: as today |
| The scene's panel | 292, 92, 564, 732: as today | 0, 52, 375, 146: as today |
| The window scrolls | no, in every state | no, in every state |

In B at 375 two rows are a line taller than today, because the chevron takes 13px from the idea: "How long there and back" beside "Latency (round-trip time)" is three lines (82px, from 61px), and "Pings that never come back" is two (61px, from 42px).

## 15. Acceptance checks

Each can be tried on the prototype and turned into a test. Counts are worked out from the glossary in the test, never typed.

**G. The data (unit tests on the function, with fixture groups where the pilot has no case)**

1. Every entry of every group is an item; every `also` spelling is a pointer to its entry; nothing else is on the list.
2. The items are in D8's A to Z order. In the pilot: Destination unreachable, Echo reply, Echo request, IP address, Latency, Packet loss, Ping, Time exceeded, Time to Live, Traceroute, TTL.
3. An entry's id is its own; `time-to-live` is the pointer's. Every id is used once. A fixture entry with the id `letters` throws and is named; a fixture spelling whose id is taken gets `-2`.
4. TTL has two definitions, labelled "In IP packets" and "In DNS", in that order; every other pilot entry has one and no label.
5. A definition's text is its statements joined by one space, character for character.
6. A definition's sources are one for each source id, in the order first cited; the address is the first citation's; the places are every different label. Echo request: RFC 792, RFC 1122, RFC 2151, Microsoft ping, and RFC 792's places are "RFC 792, Echo or Echo Reply Message, page 14; RFC 792, Echo or Echo Reply Message, page 15". A fixture definition citing two sources with one short name throws.
7. A definition's lessons are in site order with Learn's address. TTL in IP packets: IP lesson (`…/what-is-ip?step=6`), then ICMP lesson (`…/what-is-icmp?step=7`). IP address: HTTP lesson, IP lesson, DHCP lesson in How the Internet Works, DHCP lesson in Networking Concepts. No other link names a track.
8. The stamp's count is the number of entries; its date is the latest report date. With two fixture groups checked on different days it is the later one.
9. With fewer than 13 letters holding an item the keys are those letters only; with 13 or more they are A to Z. (Pilot: D, E, I, L, P, T.)
10. The lesson map: `what-is-icmp/term-ttl` gives TTL's sense `ip`; `what-is-dns/term-ttl` gives sense `dns`; `what-is-icmp/term-latency` gives the entry Latency; a term no entry names gives nothing.

**P. The page (`e2e/glossary.spec.ts`)**

11. `/glossary` answers 200 with the title "Glossary · TechConcepts", one `h1` "Glossary", the lead and note of section 5 word for word, and a stamp that links to `/about#facts` and reads as section 5's words with the glossary's count and date.
12. For every entry of the glossary: the element with its id holds its name, and for each of its definitions a `dd` whose `.gl-def` text is the statements joined by a space, exactly.
13. Every source link has the short name as its words, `target="_blank"`, `rel="noopener"`, the cited address as `href`, and an `aria-label` ending "(opens in a new tab)". No source link's `href` is a document's bare address when the citation has a fragment.
14. Following "ICMP lesson" under Ping opens `/how-the-internet-works/what-is-icmp?step=7`, and the lesson shows Learn with the term Ping.
15. `#ttl` holds "Also called Time to Live", then "In IP packets" above its definition and "In DNS" above its own, and the DNS definition's lesson link is the DNS lesson only.
16. `#time-to-live` is a pointer: it holds "See" and a link to `#ttl`; following it puts `#ttl` in the address and the entry under the sticky bar.
17. Opening `/glossary#ttl` at 375 and at 1440: the entry's top is below the foot of everything sticky and within the first screen, and its background is not the page's (D8's check 16).
18. The keys: with the pilot alone, exactly the letters that have a term, each a link to its section. (With a fixture of 13 or more letters, in a unit test of the page's markup: A to Z, dashed and "{letter}, no terms" where empty.) The key and letter-bar checks of D8 (15, 21, 23) hold as written.
19. The page's text has no time figure (the pattern of `e2e/site.spec.ts:361`); the head has no word that is not in section 5.
20. **JavaScript off:** `main`'s HTML is the same as with it on; a key, `#ttl` and "See TTL" behave the same. The page has no `astro-island` and no `<script>` inside `main`, and loading it leaves `localStorage` as it was.
21. No sideways scroll at 320, 375, 768, 959, 960, 1280 and 1440.
22. As a touch screen at 375 and 768: every link in a `.gl-row`, the stamp and "All letters" are at least 44px tall, and no two links' boxes overlap.
23. Layout. At 375: in an entry the name is above the definition, which is above "Sources", which is above "Taught in". At 768: the name's left is left of the definition's, on one row; the two lines are under the definition. At 1440: name, definition and "Sources" start at three different lefts on one row; the definition is no wider than 36em.
24. Both themes match the prototype at 375 and 1440.

**L. The lesson (`e2e/lesson.spec.ts` and `Explanation.test.tsx`); written for variant B, with A's difference in brackets**

25. In the ICMP lesson's Learn the nine ideas and the nine names are today's, character for character, in today's order, each idea with today's source numbers.
26. Above the list is "Press a name for its definition." [A: no such line.] A lesson none of whose terms has an entry shows no such line and its list's HTML is today's.
27. Each of the nine names is a button with `aria-expanded="false"`, and no definition's text is visible. [A: no button; all nine definitions are visible.]
28. Pressing "Ping" shows, under its row, the entry's definition exactly, "Sources" with the four short names in order, and a link "Ping in the glossary" to `/glossary#ping`; `aria-expanded` is "true". Pressing again hides it. Opening Ping leaves the other eight closed; two can be open at once.
29. Pressing the row of Echo request on its words (not on the name) opens it. Pressing a source number in a row opens that source in a new tab and does not open the definition.
30. TTL's definition is headed "In IP packets" and holds the IP sense's text; the text of the DNS sense is nowhere in the lesson. In the DNS lesson, once it is tied, the reverse.
31. Latency's button reads "Latency (round-trip time)" and its link reads "Latency in the glossary".
32. With a fixture glossary that ties only three of a lesson's terms: those three are as 27 and 28; the other rows have no button, no chevron and are 42.2px tall at 1440 as today.
33. Following "Ping in the glossary" opens `/glossary#ping` with the entry marked as landed on; from there "ICMP lesson" opens the lesson's Learn; the browser's Back from the glossary returns to the lesson at Learn.
34. Keyboard: Tab reaches the button; Enter opens it; the next Tab is the "… in the glossary" link.
35. At 1440 by 900 and 375 by 812, with all nine open: the window does not scroll; the Explanation panel and the scene's panel are where they are today (section 14); the Explanation panel does not scroll sideways. Also no sideways scroll at 320, 768 by 1024 and 1024 by 768.
36. At 375 as a touch screen each button's target is at least 44px tall and the list's width; each "… in the glossary" link is at least 44px tall.
37. JavaScript off: each definition's text is in the HTML and visible.
38. No lesson file, claim sheet or report changes: `git diff --stat` shows nothing under `src/content/lessons/` or `docs/fact-checks/` but the glossary's.

**H. The header and footer:** D8's checks 25 to 29, as written.

## 16. Decisions

- **Sources are a line of short names under each definition, each a link to the exact place.** A number needs a list, and the page has no single list; a list under every entry would be longer than the definition.
- **One link for each source, opening the first place cited, naming every place:** the lesson's rule for a mark (direction §7), kept.
- **One stamp for the page, with the count and the latest date, and none on an entry.** The reader does not know what a group is, and 113 dated ticks would be decoration. The build makes the claim true for every entry.
- **"Taught in" follows "Sources".** The sources belong to the definition; the lessons are the way onward.
- **A meaning is a label over its own definition, with its own sources and lessons, and a dashed line between two.** So TTL reads as two things, and nothing of one is under the other.
- **Another spelling is a pointer at its own letter, on dashed tape.** A reader who knows "Time to Live" looks under "Ti". Dashed means "not here", as a dashed key does.
- **An entry's anchor is its own id,** not one made from its name: it does not move when a name's spelling is touched.
- **Fewer than 13 letters with a term: only those keys.** Twenty dashed keys over ten entries read as a broken page; six keys read as a short one.
- **From 640px the name stands beside the definition; from 960px the two lines move beside it.** One reading order at every width, and the desktop's width is used.
- **With a mouse the two lines close up to 26px; a finger always gets 44px.**
- **In a lesson the definition is the entry's, whole, under the term's row,** with the sense the tie names and no other.
- **In a lesson the sources are named and not linked,** and there are no numbers: the numbers are the lesson's list's, and the definitions cite documents that list does not hold. This also keeps a phone's definition to one 44px link.
- **B is recommended:** Learn's words stay where they are, which decision 10 asks.
- **The whole row is the button's target; the chevron is Go deeper's.** One meaning for the chevron in Learn: it opens in place.
- **The lesson's name stays on the tape, the entry's name is in the link,** so "Latency (round-trip time)" is seen to lead to "Latency".
- **No "open all" control, no link from the glossary that opens a term in the lesson, no saved state.** None is needed to read a definition.
- **Header, footer, keys, letter bars, tape, landing mark: D8's, unchanged.**

## 17. Open questions for the owner

1. **Does the page go live with the ten checked entries and grow a group at a time, or wait for the whole list?** The design holds at both sizes and says of itself "New definitions are added once they pass the same check." The designer would go live with the ten: the lessons' definitions need the page to link to.
2. **B or A in the lesson?** (Section 2.)
3. **Do the lessons' own lines also need rewriting** (decision 4)? The Lesson screen shows the nine as they are beside their definitions; the analyst found four thin and none at odds.
4. **In a lesson, a definition's sources are named but are not links,** and carry no numbers. The other way, numbers into the lesson's list, means a lesson's source list takes in documents its own check never read (three for ICMP). Agreed?
5. **On a phone the full glossary is 43,469px,** about 54 screens, with nothing folded. Folding "Sources" and "Taught in" behind one line would take roughly a quarter off and hide what each definition stands on. Leave it open?
6. **The stamp counts terms** ("10 terms checked, the latest on 13 Nov 2026"). D8's page had no count. And About's "Where the facts come from" does not yet mention the glossary: one sentence there would be a unit of its own.
7. **"Latency (round-trip time)"** is the ICMP lesson's name; the entry is "Latency", and its definition says round-trip time is one way of measuring it. The tape and the link show both. Is the lesson's name one of the lines to look at again?
8. **Pointers for other spellings** add a row each (eight in the proposed full list). Keep them?

## 18. About the prototype

- **The pilot** is static HTML in the file: ten entries, eleven definitions, one pointer, written once by the throwaway script. **The full glossary** is a second static list in a `<template>`, swapped in by the panel: the 113 names are the proposed list's (`docs/glossary-terms.md`, with its "Show as" names), the ten real entries are in place, and the other 103 are grey bars of a typical length (30 to 55 words, two to four sources, one to three lessons), never words. Four of them have two meanings under the list's own labels (ACK, Header, Network address, Plain text). Seven pointers besides "Time to Live" are the list's proposed spellings. The stamp's count there is a stand-in. A yellow note on the page says all of this.
- **The Lesson screen** is a frame the size of the window over the page, so the lesson's own breakpoints apply. Its terms list is redrawn by the prototype's script for each variant; in the site `Explanation.tsx` draws it. The scene, steps, tabs and controls are still.
- A source link opens its real address in a new tab. No other link leaves the prototype: a lesson link carries its real address in `title`, "ICMP lesson" opens the Lesson screen, and "… in the glossary" opens the Glossary screen at the entry.
- "Open all" and "Close all" are the prototype's, for looking at the nine together.
- In the prototype a closed definition is hidden by a style on the row's `data-def`; the site uses the `hidden` attribute (section 10). Check 37, the lesson with JavaScript off, is the one check that cannot be tried on the prototype: the frame is drawn by a script.
