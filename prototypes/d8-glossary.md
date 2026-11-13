# D8: the Glossary page, `/glossary`

Spec for build unit B8 (`plan.md`, job 9). Prototype: `prototypes/d8-glossary.html`, one file that opens from the file system: fonts, styles, script and all 152 terms are inline. The terms were printed from `src/content` by a throwaway script (the registry, `positionOf`, `numberedSources`) and joined and ordered by the rules in section 9, so every name, idea and lesson address in the prototype is the real one. The yellow "Prototype" panel at the foot of the window is not part of the design.

Read with: `plan.md` (the twelve decisions), `docs/glossary-read.md` (A1, the terms read out of their lessons), `docs/direction.md` §6.

## 1. The design in one paragraph

A plain list of every term the ready lessons teach in Learn, A to Z, in the lessons' own words. Each entry is the term's **name on a strip of label tape**, as a lesson's Learn draws it, then one block for each lesson's words: the line **"In the DNS lesson"**, which is the link to that lesson's Learn part, and under it the lesson's idea, word for word. The order of a lesson (idea first, then its name) is turned round here, because the list is sorted by name and a reader comes with a name. The lesson comes before the idea so that an entry reads "in this lesson it means this": TTL shows three blocks, and nothing on the page says they are one meaning. Above the list is a row of **letter keys**; a letter with no term is a dashed, empty key. On a desktop the entries are a **ledger** of three columns (name, lesson, words) and the keys stay under the header. On a phone the entry is stacked and each letter's bar stays under the header with a way back to the keys. No part of the list is drawn by a script, and nothing is folded away.

## 2. One variant

There is one design. A second, with the phone's stacked entry in three columns at 1440, was built and measured: 10,731px tall against the ledger's 10,829px, because a stacked entry is 131px and a ledger row 53px. It bought nothing and lost the straight scan down the names, so it is not in the file.

## 3. What the page is made of

`src/pages/glossary.astro`, in `BaseLayout` with `title="Glossary"`, the description in section 5 and `current="glossary"`. It has no island and no script of its own. Class prefix `gl`.

```html
<div class="wrap gl">
  <div class="gl-head">
    <h1 class="disp">Glossary</h1>
    <p class="gl-lead">…</p>
    <p class="gl-note">…</p>
  </div>

  <nav class="gl-az" id="letters" aria-label="Jump to a letter">
    <ul>
      <li><a class="gl-key" href="#letter-a">A</a></li>
      …
      <li><span class="gl-key gl-key--none"><span aria-hidden="true">G</span><span class="sr-only">G, no terms</span></span></li>
      …
    </ul>
  </nav>

  <section class="gl-letter" id="letter-t">
    <div class="gl-bar"><h2>T</h2><a class="gl-up" href="#letters">All letters</a></div>
    <dl class="gl-list">
      <div class="gl-entry" id="ttl">
        <dt><span class="gl-name">TTL</span></dt>
        <dd>
          <div class="gl-froms"><p class="gl-from">In the <a href="/how-the-internet-works/what-is-ip?step=6">IP lesson</a></p></div>
          <p class="gl-idea">The hop counter that stops loops</p>
        </dd>
        <dd>
          <div class="gl-froms"><p class="gl-from">In the <a href="/how-the-internet-works/what-is-dns?step=6">DNS lesson</a></p></div>
          <p class="gl-idea">How long an answer may be kept: its time to live</p>
        </dd>
        <dd>…ICMP…</dd>
      </div>
      …
    </dl>
  </section>
  …
</div>
```

- **One `section` for each letter that has a term**, in A to Z order, each with an `h2` that is the letter and one `dl`. A letter with no term has no section. The sections are not labelled, so they are not 21 landmarks.
- **One `div.gl-entry` for each name**, holding one `dt` and one `dd` for each wording (section 9). The `id` is on the `div`.
- **One `dd` for each wording.** It holds `div.gl-froms` with one `p.gl-from` for each lesson that uses those words, then one `p.gl-idea`.
- **Where lessons use the same words** (HTML, "USER, PASS", and the two DHCP lessons under IP address), the `dd` has two `p.gl-from` lines, one above the other, and the words once.
- **The idea** is drawn as the lesson draws it: `**x**` becomes `<b>` and everything else is text, never HTML (the rule of `src/lesson/Rich.tsx`). No idea has bold today.
- **The link** is a plain link in the same tab to the lesson's Learn part: `{canonical lesson address}?step={positionOf(lesson, 0, 'learn')}`, for example `/how-the-internet-works/what-is-dns?step=6`. No `target`, no `title`. (The prototype's links stay on the page and carry the real address in `title` and `data-href`.)
- **No source marks.** A lesson's marks are numbers into that lesson's own source list, which is not on this page: a "2" beside HTTP's words and a "2" beside DNS's would be two different documents. The link lands on Learn, where the same words carry their marks. The page reads no `cite`.
- **No tracks**, but for one case: a lesson whose title another ready lesson shares is named with its track (section 9, rule 5).
- **No drawing.** The keys are the page's figure.
- **No count** of terms, lessons or letters is written anywhere on the page.

## 4. States, and how to see each in the prototype

Open the yellow panel and use "Go to", or add the `#id` to the address. `?theme=dark`, `?head=home|tracks|track|about|404`, `?nojs=1` and `?bare=1` (no panel) also work in the address.

| State | Where | What shows |
|---|---|---|
| The whole list | the page | 135 entries under 21 letters, nothing folded |
| One lesson | `#jitter` | The name; "In the UDP lesson"; the idea |
| Two lessons, different words | `#port` | Two blocks: "In the UDP lesson" and "In the Firewalls lesson", each with its own words |
| Two lessons, the same words | `#html` | One block: "In the HTTP lesson", "In the HTTPS lesson", then the words once |
| Three lessons, two meanings | `#ttl` | Three blocks, in site order: IP, DNS, ICMP. Each idea sits under its own lesson's line; the page does not group or merge them |
| Four lessons, three wordings | `#ip-address` | HTTP; IP; then one block naming both DHCP lessons with their tracks |
| A thin idea | `#offer` | "In the DHCP lesson in How the Internet Works": "“You can have this one”". The lesson's line is what makes it true |
| A name that starts with a symbol | `#ok-err` | "+OK, -ERR", shown as written, filed under O after "Offer" |
| A jump to a letter | click a key, or `#letter-s` | The letter's bar lands just under the header (under the keys from 1280px). The address gains `#letter-s`. Focus is not moved by a script: the browser moves its own starting point, so the next Tab is the first link in that letter |
| Landing on a term | `/glossary#ttl` | The entry lands under the sticky bar and is marked as "here": the orange tint and a 3px orange bar on its left, until the address changes |
| A letter with no term | G, W, X, Y, Z in the keys | A dashed key with no fill, muted letter. Not a link, not focusable. A screen reader hears "G, no terms" |
| A lesson link, hover | any | The site's link: the underline goes from the line colour to the ink (`a:hover`, global) |
| A lesson link, focus | Tab | The site's ring (2px `--focus`, 3px away) round the words "DNS lesson" only, though the target is the whole line |
| A key, hover and press | any key | Fill `--bg-soft`, border `--ink-strong`; pressed, `scale(0.96)` |
| Light and dark | the header's button, or the panel | Tokens only |
| JavaScript off | panel, "JavaScript: Off" | The same page. Only the header's theme button goes, as on every page (section 12) |
| The header on other pages | panel, "Header on" | The header alone changes to Home, Tracks, a track page, About or 404 (section 8); the page under it stays the glossary |

There is no empty state: the build has 18 ready lessons. If no lesson were ready the page would have the head, 26 dashed keys and no list; that is not designed and need not be tested.

## 5. Every word of new copy

| Where | Words |
|---|---|
| Header link, phone menu link, footer link | Glossary |
| Page title (`<title>` is "Glossary · TechConcepts") | Glossary |
| Meta description | Every term the lessons teach, in the words of the lesson that teaches it. |
| `h1` | Glossary |
| `.gl-lead` | Every term the lessons teach, in the words of the lesson that teaches it. |
| `.gl-note` | Each line is lifted from a lesson, and some lean on that lesson’s story, so every line names its lesson. Follow the link to read the words where they belong. When more than one lesson teaches a name, you see each lesson’s words, and they can mean different things. |
| The keys' `aria-label` | Jump to a letter |
| A key with no term, for screen readers | {letter}, no terms |
| The link in a letter's bar | All letters |
| A lesson's line | In the {lesson title} lesson |
| A lesson's line when another ready lesson has the same title | In the {lesson title} lesson in {track title} |
| The group for names that begin with a digit (none today) | 0–9 |

In a lesson's line, "In the" is plain text and the link is "{lesson title} lesson", or "{lesson title} lesson in {track title}". Today: "DHCP lesson in How the Internet Works" and "DHCP lesson in Networking Concepts"; the other sixteen are "HTTP lesson", "TLS/SSL lesson", "OSI Model lesson" and so on.

The page never says "definition", "define" or "meaning of". No idea contains "defin" today, so a test can search the whole page for it.

## 6. Sizes and spacing

All colours are tokens. `--r-tile` is 3px.

**Head**

| Part | Value |
|---|---|
| `.gl` | padding 36px top, 72px bottom, inside `.wrap` (32px sides at every width) |
| `h1.disp` | 64px; 44px below 600px |
| `.gl-lead` | 20px/1.4, `--ink-strong`, max-width 30em, 14px above; 18px below 600px |
| `.gl-note` | 16px/1.55, `--muted`, max-width 40em, 10px above |

**The keys** (`.gl-az`, 28px above)

| Part | Value |
|---|---|
| A key | 44px tall, 1px `--line-strong`, radius 3px, fill `--card`, Barlow 700 18px, `--ink-strong` |
| A key with no term | 1px dashed `--line-strong`, no fill, Barlow 600 18px, `--muted` |
| Below 360px | 6 to a row, 4px gaps, the row 16px wider than the text on each side |
| 360px to 599px | 7 to a row, 5px gaps, the row 16px wider than the text on each side (44.7px keys at 375) |
| 600px to 1279px | 13 to a row, 4px gaps (two rows, 92px) |
| From 1280px | 26 in one row, 2px gaps. The row is `position: sticky; top: 68px; z-index: 6`, with 10px above and below, 32px sides, `--ground` behind it and 1px `--line` under it (65px in all) |

**A letter** (`.gl-letter`, 28px above)

| Part | Value |
|---|---|
| `.gl-bar` | flex, 14px gaps, padding 8px 32px, margin-inline -32px, `--ground` behind. Below 1280px `position: sticky; top: 68px; z-index: 5` (60px tall); from 1280px it scrolls with its terms |
| `h2` | a tile 40px tall, at least 40px wide, 8px side padding, radius 3px, fill `--ink-strong`, letter in `--ground`, Barlow 700 24px |
| The rule | 1px `--line-strong`, filling the space between the tile and the link |
| "All letters" | Barlow 600 15px, 0.02em, `--ink-strong`, the site's underline, 44px tall. Not shown from 1280px, where the keys are always in view |
| `scroll-margin-top` | 72px below 1280px; 140px from 1280px |

**An entry, below 960px** (stacked)

| Part | Value |
|---|---|
| `.gl-entry` | padding 12px 12px 14px, margin-inline -12px, 1px `--line` above (none above the first of a letter, whose top padding is 8px) |
| `.gl-name` | inline-block, padding 4px 9px 5px, 1px `--line-strong`, radius 2px, fill `--card`, Barlow 700 19px/1.2, 0.01em, `--ink-strong`, `overflow-wrap: anywhere`. Written as the lesson writes it: no uppercase |
| `dd` | 14px left padding; a 2px `--line-strong` bar down its left side, from 20px below its top to 3px above its foot |
| `.gl-from` | Barlow 600 15px/1.3, 0.02em, `--muted`; `width: fit-content`; padding 20px 0 5px, so the line is 44.5px tall with its words at the foot |
| The link | `--ink-strong`, the site's underline. Its `::after` covers the whole `.gl-from` (`position: absolute; inset: 0`), so the line is the target and the link's own box is its words |
| `.gl-idea` | Atkinson 17px, line-height 26px, `--ink-strong`, max-width 34em |
| Landed on (`:target`) | fill `--here-soft`, `box-shadow: inset 3px 0 0 var(--here)` |
| `scroll-margin-top` | 136px below 1280px; 134px from 1280px |

**640px to 959px:** the same entry in two columns (`columns: 2; column-gap: 48px` on `.gl-list`, `break-inside: avoid` on the entry), read down the first column and then the second. The rule moves under each entry (no rule above), so both columns start alike.

**From 960px: the ledger**

| Part | Value |
|---|---|
| `.gl-entry` | grid, columns 232px and the rest, 24px gap, 4px above and below; from 1200px, 300px and 32px |
| `dt` | spans the entry's rows, 5px above the tape so it sits level with the first row |
| `dd` | in the second column; itself a grid of 232px and the rest, 24px gap (300px and 32px from 1200px); no side bar and no left padding |
| `dd + dd` | 1px dashed `--line-strong` above: the line between one lesson's words and the next |
| `.gl-from` | padding 12px 0, line-height 20px: 44px for one line |
| `.gl-idea` | padding 9px 0: 44px for one line |

So a term one lesson teaches is one 53px row with its rule (52px for the first of a letter); TTL is 143px; IP address is 187px at 1440.

## 7. Breakpoints, and what each width shows

| Width | Header | Keys | Entries |
|---|---|---|---|
| 320 | menu button | 6 to a row, 5 rows | stacked, one column |
| 375 | menu button | 7 to a row, 4 rows (191px) | stacked, one column. Each letter's bar sticks under the header |
| 768 | menu button (today: a squeezed row) | 13 to a row, 2 rows | stacked, two columns. Bars stick |
| 959 | menu button | 13 to a row | stacked, two columns |
| 960 | the row of five links | 13 to a row | the ledger, columns 232 / 232 / rest. Bars stick. "In the DHCP lesson in How the Internet Works" takes two lines in its column |
| 1200 | row | 13 to a row | the ledger, columns 300 / 300 / rest |
| 1280 | row | 26 in one row, sticky | the ledger. Bars scroll; "All letters" is gone |
| 1440 | row | the same | the ledger: 300 / 300 / 576 |

The page's own breakpoints are 360, 600, 640, 960, 1200 and 1280. 960 is also the header's.

## 8. The header and footer

### Where the link sits

**Tracks, Glossary, How a lesson works, Sources, About.** Tracks and Glossary are the two pages a learner comes back to; the next two are parts of Home; About is last. The phone's menu lists the same five in that order, then "Start learning" where the page has it. In the footer, "Glossary" goes in the Learn list after "All tracks" and before "How a lesson works".

### What changes in each file

**`src/components/SiteHeader.astro`**

1. `current?: 'tracks' | 'how' | 'about'` becomes `'tracks' | 'glossary' | 'how' | 'about'`.
2. `links` gains `{ key: 'glossary', href: '/glossary', label: 'Glossary' }` as its second entry. The row and the phone's menu are both drawn from `links`.
3. `@media (max-width: 720px)` becomes `@media (max-width: 959px)`. No rule inside it changes.
4. Nothing else: `showStart`, `currentOf`, the script, the `overHero` rules.

**`src/components/SiteFooter.astro`**

1. `<li><a href="/glossary">Glossary</a></li>` after "All tracks", before "How a lesson works".
2. Its own `@media (max-width: 720px)` stays. The foot line stays.

**`src/layouts/BaseLayout.astro`**

1. `current?: 'tracks' | 'how' | 'about'` gains `'glossary'`. Nothing else.

**`e2e/support.ts`**: `SITE_PAGES` gains `{ name: 'glossary', path: '/glossary' }`.

### What each page shows

| Page | `current` | Link marked | "Start learning" |
|---|---|---|---|
| Home `/` | none | none | yes |
| Tracks `/tracks` | `tracks` | Tracks, `aria-current="page"` | no |
| A track page | `tracks` | Tracks, `aria-current="true"` | no |
| About `/about` | `about` | About, `aria-current="page"` | yes |
| 404 | none | none | yes |
| **Glossary `/glossary`** | `glossary` | Glossary, `aria-current="page"` | yes |
| A lesson | no site header | | |

`currentOf` already gives "page" on the link's own address. A lesson has no site header or footer and gets no link to the glossary (decision 8).

### The width at which the menu takes over: 960px, measured again

Measured on the site as it runs today (`npm run dev`), with the link "Glossary" added second to the real header in the browser. "Fits" means every link is on one line (32px) and "Start learning" is at its full 123px. Widths are of the page, without a scrollbar.

| Header | Narrowest page where it fits |
|---|---|
| Today's four links, with "Start learning" (D7's figure) | 827px |
| Five links with "Glossary", with "Start learning" (Home, About, 404, Glossary) | **914px** |
| Today's four, without (Tracks, a track page; D7's figure) | 686px |
| Five with "Glossary", without | 772px |

- The row is 471.6px wide with "Glossary" (83.8px), against 385.8px today. The brand is 163.9px and the end group with "Start learning" is 172.9px; the grid is `1fr auto 1fr`, so the page needs 2 × 172.9 + 471.6 + 32 + 64 = 913.4px.
- At 913px of page "Start learning" is 122.8px; at 914px it is its full 122.9px. At 753px of page (a 768px window) every link wraps to two lines (64px) and "Start learning" is 97.7px.
- 914px and a 15px scrollbar is 929px. **960px leaves 31px** and is one number for every page. "Glossary" is 2px wider than "Practice" was; D7's 960px holds.
- In the prototype at a 960px window (945px of page): five links at 32px, "Start learning" 122.9px, no sideways scroll, on every page type. At 959px: the menu button.

### What each width shows

| Width | Header, on every page type |
|---|---|
| 375 | Brand, theme button, menu button. The menu lists the five (45px each), then "Start learning" where the page has it |
| 768 | The same: the menu button. This is the change; today it is a squeezed row |
| 960 | The row of five, each 32px tall on one line; "Start learning" 123px |
| 1440 | The same row, centred |

## 9. The data the page needs, as rules

One pure function, worked out when the site is built, in a file of its own (for example `src/lib/glossary.ts`) with unit tests. It reads the registry and keeps no copy of any word.

1. **Which terms.** Every ready lesson, once, in **site order**: `tracks` in order; in each, its lessons in the track's order; a lesson more than one track lists counts under its home track only (the first that lists it, where `canonical === url`). For each lesson, every unit's `learn.terms`, in written order. Every lesson has one unit today; for a lesson with more, a term's link is that unit's Learn: `positionOf(lesson, unitIndex, 'learn')`.
2. **Joining.** Two terms are one entry when their names are equal after `name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en')`. Nothing else joins. So "ACK" (TCP), "Acknowledge" (DHCP in How the Internet Works) and "Acknowledge (ACK)" (DHCP in Networking Concepts) are three entries, and "RETR" (POP3) and "STOR, RETR" (FTP) are two. The page does not decide that two names are the same thing.
3. **The spelling shown.** The name as the first lesson in site order writes it. Today no two lessons write a joined name differently: FTP and POP3 both write "USER, PASS" in `src/content` (the lesson's Learn shows names in capitals by CSS, which is why it looks otherwise there).
4. **Wordings.** In an entry, ideas that are the same string, character for character (`===`), are one wording that names each lesson that uses it. Any difference, a comma or a capital, makes two wordings. Wordings are in the order of the first lesson that says each; the lessons in a wording are in site order.
5. **A lesson's name.** "{title} lesson". When another ready lesson has the same title (compared in lower case), both are "{title} lesson in {home track's title}", everywhere on the page, not only where the two meet. Two ready lessons with one title and one home track: the build throws.
6. **A to Z order.** The sort key is the joined name with any leading characters that are neither letters nor digits removed (`/^[^\p{L}\p{N}]+/u`). Entries are compared with `new Intl.Collator('en', { sensitivity: 'base', numeric: true })` on the sort key; a tie is settled by the joined names in code-unit order. Case and accents do not change the order.
7. **The letter.** The first character of the sort key, with accents removed (NFD): a letter a to z files the entry under that letter. A digit files it under a group "0–9", which comes before A, has the id `letter-0-9`, and gets a key before A only when it has a term (none today). A name with no letter and no digit: the build throws, naming the term.
8. **Ids.** Section 10.

Today that gives 152 terms, 135 entries, 149 wordings and 152 lesson links, under 21 letters. Fourteen entries have more than one lesson: Broadcast, Certificate, Certificate authority (CA), Default gateway, Discover, Encapsulation, HTML, IP address, Lease, Offer, Port, Request, TTL and "USER, PASS". The page's markup for the list is 67 KB, 6.7 KB gzipped, against the 250 KB budget.

## 10. Ids and addresses

- **A term's id** is made from the name shown: lower case, accents removed (NFD), every run of characters that are not a to z or 0 to 9 replaced by one hyphen, hyphens trimmed from the ends. "TTL" is `ttl`; "IP address" is `ip-address`; "+OK, -ERR" is `ok-err`; "known_hosts" is `known-hosts`; "Point-to-point /30" is `point-to-point-30`. A name that leaves nothing is `term`.
- **A letter's id** is `letter-a` to `letter-z` (and `letter-0-9`). The keys' own id is `letters`.
- **When two would be the same.** Ids are given in page order. An id already taken, by the shell (`main`, `menu`, `menu-panel`, `theme-toggle`), by `letters`, by any `letter-…`, or by an earlier term, takes `-2`, then `-3`. None collides today. A unit test holds that every id on the page is used once.
- **`/glossary#ttl`** needs no script: the browser scrolls the entry to 136px from the top (134px from 1280px), which is just under the sticky bar (the sticky keys), and `:target` marks it. `/glossary#letter-s` brings the letter's bar to 72px (140px).
- Ids are addresses other pages may link to later (concept links are after the revamp). A lesson that renames a term changes its id; nothing links to these yet.

## 11. Screen readers, keyboard, targets

- **Structure.** `h1` "Glossary"; a `nav` named "Jump to a letter" holding a list of 26 items; then an `h2` for each letter with terms; under each, a description list (`dl`) whose groups are a name (`dt`) and one description (`dd`) for each wording. `dl` is HTML's element for name and value groups; the page's own words never call a value a definition.
- **How a term with several lessons is read.** In order: "TTL. In the IP lesson (link, IP lesson). The hop counter that stops loops. In the DNS lesson (link, DNS lesson). How long an answer may be kept: its time to live. In the ICMP lesson (link, ICMP lesson). The hop counter on every packet." The lesson is heard before its words every time.
- **Same words, two lessons.** "HTML. In the HTTP lesson. In the HTTPS lesson. The text that describes the page."
- **Links.** Every link with the same name goes to the same address: all "DNS lesson" links open DNS's Learn; the two DHCP lessons never share a name. "All letters" always goes to the keys.
- **A letter with no term** is text in the list, "G, no terms": not a link, not focusable, not hidden.
- **Focus order.** Skip link; the header; the keys that are links, A to V; then, letter by letter, "All letters" (below 1280px) and each lesson link in reading order; the footer. In the two-column range the order on screen is the order in the page: down the first column, then the second.
- **A jump** moves no focus by script. After a key is followed, the browser starts from the letter's section, so the next Tab is "All letters" in that letter's bar below 1280px, and that letter's first lesson link from 1280px. (Tried in the prototype: after "S", Tab then Tab reaches "TCP lesson" under SACK.)
- **Targets.** Keys are 44px tall and at least 44px wide at every width tried (44.7 at 375, 49.3 at 768, 64.1 at 960, 44.3 at 1280, 45.8 at 1440). A lesson's line is its link's target: 44.5px tall below 960px, 44px in the ledger, and never under 94px wide; no two lines overlap. "All letters" is 60 by 44px.
- **Motion.** None but the keys' 150ms fill and press. The jump is instant; add no smooth scrolling.

## 12. JavaScript off

The page is the same page: the same HTML, the same links, the same jumps and the same landing on `#ttl`, which are all the browser's own. `BaseLayout`'s `<noscript>` style hides the header's theme button, as on every page, and the page follows the system's theme. Below 960px the header's menu button does nothing without JavaScript, as on every page today, so there the footer's links are the way round the site.

The page stores nothing and reads no progress. The only thing read from the browser is the theme, by the layout's boot script.

## 13. The tests that hold today's header

From `prototypes/s10-job-9-facts.md` section 6, checked against the files.

| Test | Today | Becomes |
|---|---|---|
| `e2e/site.spec.ts:433-441` "the header links are Tracks, How a lesson works, Sources and About" | four names, four addresses, no link named Practice | `['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About']` and `['/tracks', '/glossary', '/#try', '/#sources', '/about']`, on every `SITE_PAGES` page; the name of the test changes with it. The Practice line may stay: it is still true |
| `e2e/site.spec.ts:382-396` Tracks link and its `aria-current` | by page | passes as written once `/glossary` is in `SITE_PAGES` (Tracks is not current there). Add: Glossary has `aria-current="page"` on `/glossary` and no `aria-current` on any other page |
| `e2e/site.spec.ts:398-414` "Start learning", footer order | by page | passes as written: `/glossary` shows "Start learning". Add: the footer's "Glossary" link opens `/glossary` on every page |
| `e2e/site.spec.ts:375-380` no time figure | a fixed list of five addresses | add `/glossary` |
| `e2e/site.spec.ts:361-373`, `:862-868`, `:869-878`, `:879-889`, `:924-931`; `e2e/visual.spec.ts:89-95` | loop over `SITE_PAGES` or `ALL_PAGES` | take `/glossary` in through `SITE_PAGES`; no edit |

No end-to-end test opens the phone's menu or holds the 720px breakpoint today, and no unit test renders `SiteHeader`. The new header checks (section 15, H) are the first.

## 14. Measured

There is no Glossary page today, so "before" is the header.

| | Before (today) | After (prototype) |
|---|---|---|
| Header fits from, with "Start learning" | 827px (four links) | 914px (five) |
| Header at a 768px window | a squeezed row: links wrap to two lines | the menu button |
| Header at a 960px window | the row | the row: five links at 32px, "Start learning" 122.9px |

| The page | 375 | 768 | 960 | 1440 |
|---|---|---|---|---|
| Height | 23,693px | 13,798px | 12,018px | 10,829px |
| Sideways scroll | none | none | none | none (also none at 320, 959 and 1280; at 320 the page is 25,503px) |
| A term of one lesson (Path) | 131px | 131px | 53px | 53px |
| TTL | 298px | 298px | 143px | 143px |
| IP address | 343px | 343px | 227px | 187px |
| The keys | 7 to a row, 191px in all | 13 to a row, 92px | 13 to a row | one sticky row, 65px |
| The first letter starts at | 644px | | | 444px |
| Landing on `#ttl`: the entry's top | 136px, the bar's foot at 128px | | | 134px, the keys' foot at 133px |
| After the key "S": the bar of S | 72px from the top | | | 140px, the keys' foot at 133px |

At 375 the page is about 29 screens. It is every term, open, as decision 6 asks; the keys, the sticky letter bar and the browser's find are how a reader moves in it.

## 15. Acceptance checks

Each can be tried on the prototype and turned into a test. Counts are worked out from the registry in the test, never typed.

**D. The list (unit tests on the function)**

1. For every ready lesson and every term in its Learn: one entry has that name (ignoring case), and in it one wording has that idea **character for character** and names that lesson with that lesson's Learn address.
2. The number of lesson links equals the number of terms in all ready lessons. No wording is without a lesson; no entry is without a wording.
3. The number of entries equals the number of different names, ignoring case.
4. The names are in the order of rule 6. "A record" is first under A; "known_hosts" is last under K; "+OK, -ERR" is under O, between "Offer" and "Outgoing mail server".
5. IP address has three wordings and four lessons, in the order HTTP; IP; DHCP in How the Internet Works with DHCP in Networking Concepts. TTL has three wordings in the order IP, DNS, ICMP. HTML has one wording and two lessons. "USER, PASS" has one wording naming POP3 then FTP.
6. "ACK", "Acknowledge" and "Acknowledge (ACK)" are three entries; "RETR" and "STOR, RETR" are two.
7. Every link to either DHCP lesson names its track; no link is "DHCP lesson" alone. No other lesson's link names a track.
8. Every id is used once. `ttl`, `ip-address`, `ok-err`, `known-hosts` and `point-to-point-30` exist. Given two names that make one id, the second gets `-2`; given a name that makes `main`, it gets `main-2`.
9. Given a lesson that writes a joined name in another case, the first lesson's spelling is shown. Given two ideas that differ by one character, two wordings are shown.
10. Given a name with no letter or digit, the function throws and names it.

**P. The page (`e2e/glossary.spec.ts`)**

11. `/glossary` answers 200 with the title "Glossary · TechConcepts", one `h1` "Glossary", and the two paragraphs of section 5 word for word.
12. Check 1 again on the page itself: for every term of every ready lesson, the entry with its name holds a `dd` whose `.gl-idea` text is the idea exactly and whose links include one with the lesson's Learn address.
13. The page's text has no "defin" (any case), no time figure (the pattern of `site.spec.ts:378`), and the head (`.gl-head`) has no digit.
14. The keys are A to Z in order. A letter with a term is a link to its section; a letter without is not a link and reads "{letter}, no terms". Today G, W, X, Y and Z are without.
15. At 375: following the key "S" puts `#letter-s` in the address and the bar of S between 68px and 80px from the top; Tab then focuses a link inside the section of S. At 1440: the bar of S is below the foot of the keys, and Tab focuses the first lesson link of S.
16. Opening `/glossary#ttl` at 375 and at 1440: the entry's top is below the foot of everything sticky and within the first screen, and its background is not the page's.
17. Following "DNS lesson" in TTL opens `/how-the-internet-works/what-is-dns?step=6`, and the lesson shows Learn with the term TTL.
18. **JavaScript off:** the `main` element's HTML is the same as with JavaScript on. The key "S" and `#ttl` behave as in 15 and 16. The header's theme button is not shown.
19. The page has no `astro-island` and no `<script>` inside `main`. Loading it leaves `localStorage` as it was.
20. No sideways scroll at 320, 375, 768, 959, 960, 1280 and 1440.
21. At 375 every key is at least 44 by 44px, every `.gl-from` is at least 44px tall, and the point 1px inside the top and the foot of a `.gl-from` is its link (`elementFromPoint`). "All letters" is at least 44px tall.
22. Layout. At 375: one column; in an entry the name is above the lesson's line, which is above the idea. At 768: two columns. At 1440: in an entry the name, the lesson's line and the idea start at three different lefts, in that order, on one row; the keys are one row and stay at 68px from the top when the page is scrolled; "All letters" is not shown.
23. At 375, scrolled into the middle of S, the bar of S is 68px from the top and shows "S" and "All letters"; following "All letters" brings the keys into view.
24. Both themes match the prototype at 375 and 1440 (`d8-*.png` beside D6's and D7's in the ignored `.superpowers/revamp/job-9/shots/`).

**H. The header and footer (`e2e/site.spec.ts`)**

25. On every `SITE_PAGES` page the header's links are Tracks, Glossary, How a lesson works, Sources, About, with the addresses of section 13.
26. Glossary has `aria-current="page"` on `/glossary` and no `aria-current` anywhere else. Tracks keeps "page" on `/tracks` and "true" on the track pages.
27. On every `SITE_PAGES` page at 959px wide the menu button shows and the row does not; at 960px the row shows, every link in it is 32px tall, and "Start learning", where the page has it, is at least 122px wide. The opened menu lists the five in order.
28. The footer's Learn list has "Glossary", after "All tracks" and before "How a lesson works", opening `/glossary`, on every page.
29. `npm run build` passes with `/glossary` inside the page budget.

## 16. Decisions

- **Name first, then the lesson, then the idea.** The list is sorted by name and a reader arrives with one. The lesson stands before its words so an entry reads "in this lesson it means this", which is what A1 asks for TTL.
- **The lesson's line is words, "In the DNS lesson".** A bare "DNS" beside a term would read as another term to look up.
- **One line and one block for each wording, never merged or grouped by meaning.** Saying which wordings mean the same would be a new claim nobody checked. Site order decides, so TTL reads IP, DNS, ICMP.
- **The name on label tape.** It is how a lesson's Learn draws a term, and Patch's own label; here in its written case, because `known_hosts` and `ClientHello` are spelled that way.
- **Names join only when equal ignoring case.** Anything looser is an editor's list to keep by hand.
- **A lesson is named by its title; the track shows only when two ready lessons share a title,** and then on every one of their lines.
- **No source marks.** Their numbers belong to a list that is not on this page; the link lands where they are.
- **A leading symbol is skipped for filing,** so "+OK, -ERR" is under O, where a reader looks for "OK". A group of its own for one term would be a 27th key.
- **Letters without terms stay in the row as empty keys,** so the row is always the alphabet and a reader sees that G has nothing, without trying it.
- **Keys sticky from 1280px, letter bars sticky below.** Twenty-six 44px keys fit one row only from 1280px; below that the letter's bar is the small thing that stays, and carries the way back.
- **Two columns from 640px to 959px.** One column at 768 was 21,733px with half the width empty; two are 13,798px.
- **One variant.** The three-column one measured 98px shorter at 1440 (section 2).
- **Glossary second in the header,** where D6 had put Practice: after Tracks, before the two parts of Home.
- **960px for the menu,** D7's number, measured again: 914px needed.
- **No script, no saved state, no count, no drawing.** The plan's, kept.
- **No `tabindex` and no focus script for jumps.** The browser already moves its starting point to the target.

## 17. Open questions for the owner

1. **Three entries stand side by side for one idea:** "ACK" (TCP), "Acknowledge" (DHCP in How the Internet Works) and "Acknowledge (ACK)" (DHCP in Networking Concepts); and "RETR" (POP3) beside "STOR, RETR" (FTP). The page joins only names that are equal ignoring case. Making them one entry means changing a lesson's own name for the term, which is that lesson's re-check. Leave them?
2. **No source marks on this page** (the link to the lesson is the way to its sources). Showing them would add about 270 small numbered links whose numbers mean a different document in each lesson. Agreed?
3. **"Glossary" is second in the header,** after Tracks. The other place is fourth, before About.
4. **The phone page is 23,693px tall** (about 29 screens), since nothing is folded and every lesson line is a 44px target. Accepted, or should a later design look for a shorter phone entry?
5. **TTL's three lines are in the site's lesson order (IP, DNS, ICMP),** so the two hop-counter lines are parted by DNS's. Putting like meanings together would be the page's own judgment. Leave the order?

## 18. About the prototype

- The list in the file is static HTML, written once by the throwaway script from the registry: 152 terms, 135 entries, 149 wordings. A check after writing found every term's name, idea and Learn address in it, word for word.
- The script in the file is the header's (theme, menu) and the panel's switches. Nothing in it touches the list.
- Lesson links do not leave the prototype; each carries its real address in `title` and `data-href`.
- "Header on" changes only which link is current and whether "Start learning" shows. The header's markup and styles are `SiteHeader.astro`'s, with the fifth link and the 959px rule.
- "JavaScript: Off" hides the theme button, which is all that `BaseLayout` does without JavaScript. To see it for real, turn JavaScript off in the browser and reload: the list, the keys and `#ttl` work the same.
