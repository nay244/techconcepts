# B44 cases: the spec review of B44 (the lesson change in place), job 30

The spec review of B43 and B44 by `reviewer` (Opus), 2026-11-21, read on `revamp` at `5d6756d` against `plan.md` (job 30, decisions 1, 2 and 4 to 8) and `prototypes/d26-lesson-change.md` (approved, variant A only, direction 2.150: Back and Forward open a lesson at its Overview; variant B is not built and is out of these cases). Verdict: HOLES, 10 for B44 (and B43's E61, which B44 shares), each with one answer, closed below by the orchestrator (direction 2.151). The reviewer's full report, the trial patch and its scripts are kept, git-ignored, in `.superpowers/job30/spec-trial/` (`trial/trial.mjs` compares a swap with a fresh load); the trial's method and results are at the end of this file.

## Errata (the orchestrator, 2026-11-21): these win over D26 where they differ

- **E61 (shared with B43).** The console imports `src/lib/build-stamp.ts`; decision 8's "another build's stamp" is the file's `stamp` not equal to that import.
- **E63. Which lessons draw the same figure.** The console's code carries a map from each lesson's key to its `figure` id (only ids, no lesson content), with a unit test that it equals every lesson file's `figure`. At the press the console takes the click only when the target is in the same track and the map gives the same figure as the open lesson's; otherwise it leaves the click to the browser (no going mark, no signal, D26 §11 and check 30). The props and the HTML do not change.
- **E64. D26 §6, sentence 2, struck.** The only animation as a lesson opens is the drawing's 600 ms first draw-in (`src/art/lumen.css:228-230`). The drawing stays on a swap, so nothing replays: no frame of a swap shows a faint or empty stage.
- **E65. Decision 5's equality, made exact.** The "fresh load" is a reload of the new address in the same browser context, taken before any move (so progress is the same on both); "after walking to its last position" walks both. Left out of the comparison: the live region's text until the first move (checked against D26 §5 on its own); D26 §7's carry-overs (the speed button's text and name, the view switch's pressed button, the open `details`, the column's `scrollTop`); with Sequence carried, compare with Network chosen on both, or against a fresh load with Sequence chosen. In the drawing, compare each `style` attribute as parsed declarations, not text (`opacity: 0;` and `opacity:0` are equal). The hidden router strips are fixed in the driver: `paintNames` (`src/scenes/drivers/net-map.ts:515-522`) puts a strip it hides back as drawn (empty text, width 19, the text's `x` at the strip's `data-x` + 9.5, as `src/art/scenes/net-map.ts:538` draws it), so Packets to ARP is equal too.
- **E66. Back or Forward onto an address with `?step=N`.** The swap opens the lesson at its Overview (2.150) and puts the lesson's own address in place with `history.replaceState` (no new entry). The `?step=` effect (`LessonConsole.tsx:270-278`) runs at mount only, never on a swap, so it neither jumps nor sets `deepLinked`. The Back handler works from `location.pathname`, not `history.state` (the first entry's state is `null`).
- **E67. D26 check 18, rewritten.** During a wait, with focus moved off the pressed control (for example onto the scene after a pointer press), Space, ← and → act on the old lesson; with focus left on the pressed control, the keys do what they do on that control today.
- **E68. D26 check 11** names "TLS/SSL" (the longest title a swap can reach; Load Balancers draws `pool` and is never swapped to). At 375 the tape "OPENING TLS/SSL" spans x 215 to 363 and clears the Network / Sequence switch (x 12 to 166). §3.3's "starts right of x 190" for Load Balancers is struck.
- **E69. D26 check 16's names.** After "Next lesson" into UDP the forward button is named "Next: Connectionless Send, step 1" at 1440 and "Next: step 1, Connectionless Send" at 375, as today's widths name it.
- **E70. Many units.** Every lesson today has one unit, so D26 §5's "<unit name>, Overview" line, §7's filter row and the `seen` reset are unit tests on the three-unit fixture (`src/lesson/LessonConsole.flow.test.tsx`), not end-to-end cases.
- **E71. "Next lesson" and other presses.** A modified click (Ctrl, ⌘, Shift, Alt) on "Next lesson" stays today's page load in the same tab; Enter and Space on it swap; a plain primary click swaps. The rows and the Up next card are links: only a plain primary click or Enter is taken.
- **E72. Window scroll on Back and Forward.** `history.scrollRestoration` stays `auto`; no code for it.
- **E73. D26 §9.** A lesson in progress says "In progress" (the built word, `src/lib/hub.ts:11`), not "Started".
- **Guards (no erratum).** B44 needs no grant if it stays out of `e2e/support.ts` (put helpers in `e2e/lesson-change.spec.ts`), `src/art`, `src/styles/tokens.ts`, `src/components/site.css`, `src/layouts` and `src/pages/[track]/[lesson].astro`, which needs no change. The signal's reduced-motion rule goes in `src/lesson/console.css`, not `global.css` (`src/styles/global.test.ts:40`).
- **Cloudflare (no stop).** Cloudflare's Web Analytics FAQ: "Every route change that occurs in the single-page app will send the measurement" (developers.cloudflare.com/web-analytics/faq/); no setting is documented. Page views stay counted on a swap.
- **A trap to test (B44-2.3):** if the driver is made again on the kept node, `create` reads the old lesson's description from the live `aria-label` (`net-map.ts:297`). The driver must be kept (decision 4).
- **A trap to test (B44-6.2):** committing the new `entry` one render before the position goes back to 0 records the old position against the new lesson (measured: `furthestPosition: 7` for a UDP never opened).

## B44 cases

Grouped under the plan's B44 check (B44-0 to B44-10) and D26 §15's checks (D-1 to D-30). "TCP" and "UDP" are How the Internet Works' What is TCP (3 of 14) and What is UDP (4 of 14). "Held N ms" means the test holds the lesson's `.json` request for N ms with `page.route`. "Fresh" means a reload of the new address in the same browser context, before any move (B44-H3.4).

### B44-0. Decision 1: which changes swap

- B44-0.1 Accept: TCP → UDP by the outline row: no new document (`performance.getEntriesByType('navigation').length` stays 1, and a `window.__mark` set before the press is still there after).
- B44-0.2 Refuse: Networking, Subnetting → Router by "Next lesson" (`subnet` → `net-map`): a page load; the console fetched no `.json`; no going mark and no signal in any frame (D-30). Same for the outline row Switch → ARP, and IP Address → MAC Address (`subnet` → `dhcp`).
- B44-0.3 Refuse: Networking, TLS/SSL → Firewalls by "Next lesson" and by the Up next card (`net-map` → `firewall`): a page load (this is the flow test's `/networking/firewalls` case, `LessonConsole.flow.test.tsx:175`, which must keep calling `navigate`).
- B44-0.4 Refuse: the sheet's and the column's "Tracks" crumb and the track title link (`Outline.tsx:249`, `:252`, `TopBar.tsx:53`, `:55`): page loads, never a fetch.
- B44-0.5 The rule is the figure, not adjacency. Accept: Networking's ARP row pressed at Packets (both `net-map`, lessons 2 and 6) swaps. Refuse: the Load Balancers row pressed at Proxies (`pool`, the next lesson) is a page load.
- B44-0.6 A lesson listed in both tracks: Accept: `/networking/what-is-dns` → `/networking/what-is-http` swaps and the address stays under `/networking/…`. Refuse: a build that pushes the canonical (`/how-the-internet-works/what-is-http`) as the address.

### B44-1. Decision 2: the first visit and without JavaScript

- B44-1.1 Built HTML: every `*.html` of the branch equals `revamp`'s but for the console's script name (and any chunk names it pulls); a diff that touches anything else (a `data-` hook on a link, a stamp in the head, a new prop) is refused.
- B44-1.2 JavaScript off (`javaScriptEnabled: false`): the column's UDP row is a plain link and loads UDP; the page has no `.json` request.
- B44-1.3 Before hydration: hold the console's script (`page.route` on its `component-url`), click the UDP row: a page load of UDP, no fetch of `.json`.
- B44-1.4 A first visit fetches no lesson `.json` at all (decision 9): load TCP, wait 3 s, idle; zero requests matching `/\.json$/`.
- B44-1.5 After a swap, no other lesson's `.json` is fetched either (no prefetch of UDP's next).

### B44-2. Decision 4: the drawing's node

- B44-2.1 Keep a handle on `svg[data-figure]` before the press; after the swap it `===` the one in the document, there is exactly one, and the `astro-slot[name=figure]` around it is the same node too.
- B44-2.2 Refuse a remount: a build that keys the console (or `ScenePanel`) by the lesson re-creates `astro-slot` from the server's markup, so the node differs and, worse, the drawing shows TCP's build-time labels. B44-2.1 catches it; add the same check after Back and after Forward.
- B44-2.3 The driver is not made again: VPN → Packets in Networking (outline row): the drawing's `aria-label` equals a fresh Packets' ("On the left, your home: a laptop and its router. …"), not VPN's café description (measured red when the driver is re-made, `trial/recreate.mjs`).
- B44-2.4 The draw-in does not replay (B44-H2): right after the swap `svg.getAnimations()` holds no running animation; in the swap's first frame the drawing's computed `opacity` is 1.
- B44-2.5 The drawing equals the fresh one (B44-H3.3): TCP walked to its Practice (every step played), "Next lesson": UDP's `svg` equals a fresh UDP's with `style` parsed; and Packets → ARP: equal byte for byte once the strips are fixed (or with hidden contents left out, per B44-H3's answer).
- B44-2.6 Sequence chosen in TCP, swap to UDP (the figure is hidden, so `show` is not called, `ScenePanel.tsx:163`), then choose Network: the drawing equals a fresh UDP's.

### B44-3. Decision 5: a swapped lesson equals a loaded one

- B44-3.1 Head: after TCP → UDP, `document.title` is "UDP · TechConcepts" (`BaseLayout.astro:46`), `meta[name=description]` and `og:description` are UDP's `summary`, `og:title` equals the title, and `link[rel=canonical]` and `og:url` are `https://techconcepts.app/how-the-internet-works/what-is-udp`, the same strings a fresh UDP has. On `localhost` a build that writes `location.origin` into the canonical is red.
- B44-3.2 Canonical of a lesson in two tracks: Networking NAT → DNS: the address is `/networking/what-is-dns`, the canonical and `og:url` `https://techconcepts.app/how-the-internet-works/what-is-dns` (registry `:94`, `:363`); a build that derives the canonical from the address is red.
- B44-3.3 `og:image` and `og:image:alt` are untouched and equal the fresh page's.
- B44-3.4 Markup at the Overview: `.console`'s `outerHTML` after the swap equals the fresh UDP's, with only B44-H3's exclusions (the live region's text, the carried Sequence view, `style` text in the drawing, the old part's open `details`) and D26 §7's (the speed button, the view switch, `scrollTop`).
- B44-3.5 Markup at the last position: walk the swapped UDP to its Practice; reload, walk the fresh UDP to its Practice; equal under the same exclusions. Along How the Internet Works by "Next lesson" from HTTP to TLS/SSL (13 swaps) and across Networking's 12 `net-map` lessons by the outline.
- B44-3.6 The longer old lesson: TCP's last position is 8, UDP's is 7; TCP walked to 8, "Next lesson": no error in the console, UDP opens at position 0 (not clamped to 7, not Practice), and the Overview's words are UDP's.

### B44-4. Decision 5 and D26 §7: what starts again (seed every piece of A3 state first)

- B44-4.1 Position and playback mode: TCP with Play all running (mode `run`), press the UDP row: after the swap UDP is idle at the Overview, the play button reads Play, and no timer from TCP's run fires into UDP (wait 3 s: still Overview).
- B44-4.2 `deepLinked`: open TCP by `?step=3`, walk to the end, "Next lesson": UDP's address is `/how-the-internet-works/what-is-udp` with no `?step`, and with an in-progress record for UDP the Overview offers "Resume at …" (a deep-linked build hides it, `LessonConsole.tsx:286`).
- B44-4.3 The `?step=` effect does not fire on a swap: as B44-4.2, and UDP opens at the Overview, not at step 3 (`LessonConsole.tsx:270-278` re-runs on every new `lesson` and reads `location.search`; a build that pushes the address after that effect runs reads TCP's `?step=3`).
- B44-4.4 `picks`: answer TCP's Practice question, swap to UDP, walk to UDP's Practice: no option is picked. Then Back to TCP and walk to its Practice: none picked either (a swap is a fresh start both ways).
- B44-4.5 `seen` and the filter (unit test on the three-unit fixture, B44-H8): open unit 3, swap to another three-unit lesson: only unit 1 is ticked "seen"; set the filter to Apps, swap: the filter is All.

### B44-5. D26 §7: what carries over, and the rest starting again

- B44-5.1 = D-25. Speed 1.5× and Sequence in TCP → UDP: speed button text "1.5×" and name "Speed 1.5×. Click for 2×"; Sequence pressed and the Sequence view shown.
- B44-5.2 The view where the new lesson has no Sequence: Networking TCP/UDP with Sequence → NAT: Network shown and the drawing equals a fresh NAT's; then NAT → DNS: Sequence shown again (the choice was kept, `ScenePanel.tsx:121-122`).
- B44-5.3 = D-26. At 375 with the Log tab chosen → UDP: Explain is pressed and the explanation shown. Also with the table tab ("Table") chosen.
- B44-5.4 `openDefs`: HTTPS with the `term-handshake` definition open, "Next lesson" to TCP, walk TCP to where "handshake" is a term: it is closed. Same for HTTPS → TLS/SSL in Networking with `term-cert` open.
- B44-5.5 The deeper box open and the log's fold open (at Learn on a desktop) in TCP → swap: both closed in UDP when the reader reaches Learn.
- B44-5.6 `changeSeen`: at 375, a table change seen in TCP's Table tab, swap, walk UDP to its first table change: the Table tab carries its "changed" mark.
- B44-5.7 The explanation's scroll at an Overview → Overview swap: scroll TCP's Overview words down, press the UDP row: UDP's explanation and the guide are at `scrollTop` 0. (`Explanation.tsx:258-260` resets only on a position change, and 0 → 0 is none.)
- B44-5.8 The column's scroll carries (D-29 below) and is otherwise left where it was: scroll the column's list to its end at TCP, press "Next lesson" to UDP (same part, already in view): `scrollTop` unchanged.
- B44-5.9 The table's hold: take TCP's table with the wheel, swap: in UDP the table follows its rows again (`ScenePanel.tsx:154`, `:199-206` compares the place by value, and Overview → Overview is the same place).

### B44-6. Decision 6: the address, history and progress

- B44-6.1 After a press: one new history entry (`history.length` + 1), the address `/how-the-internet-works/what-is-udp`, slash-less; Back: TCP swapped in, same document, the address TCP's; Forward: UDP again, same document.
- B44-6.2 Progress at a swap: TCP walked to its Practice (position 8), "Next lesson": `techconcepts:v2` has `lastLesson` `what-is-udp`, `lastTrack` `how-the-internet-works`, and no `lessons["what-is-udp"]` (a load at position 0 writes no record, `store.ts:224-226`). Measured with a naive prop change: a false `{ status: "in-progress", furthestPosition: 7 }` for UDP (`trial/range.mjs`).
- B44-6.3 Progress keeps counting after a swap: walk UDP to step 1: `lessons["what-is-udp"].status` is `in-progress`; to its Practice: `finished`; the column's row says Done and "n of 14 done" counts it.
- B44-6.4 Back to the document's first entry, whose `history.state` is `null`: it swaps to TCP (the handler works from the address).
- B44-6.5 Back onto `?step=3` (B44-H4): arrive at TCP by `?step=3`, press the UDP row, then Back: TCP opens at its Overview (not step 3), "Resume at …" is offered when TCP is in progress, and the address is as B44-H4 rules.
- B44-6.6 A hash entry is not a lesson change: press the skip link (`#main`, which adds an entry), then Back: no fetch, no announcement, the position and picks unchanged. Then press the UDP row and Back twice: TCP, then TCP without `#main`, the second with no swap.
- B44-6.7 A reload at the new address: after TCP → UDP, `page.reload()`: UDP's own page, at its Overview, equal to B44-3.4's fresh page.
- B44-6.8 The track page and back: from swapped UDP open the track page by the crumb, then browser Back: UDP (from the back-forward cache or a load), never TCP.
- B44-6.9 Clicking the current lesson's own row (D-23) adds no entry of the console's: the browser's own load.

### B44-7. Decision 7: which presses the console takes

- B44-7.1 Refuse each of: Ctrl-click, ⌘-click, Shift-click, Alt-click and a middle click (`auxclick`) on the UDP row and on the Up next card: no `.json` fetch, no going mark, `defaultPrevented` false; the browser does what it does (a new tab, a window, a download).
- B44-7.2 Accept: Enter on the focused UDP row (a `click` with `detail` 0): swaps; and Space on the focused "Next lesson" (B44-H9): swaps.
- B44-7.3 "Next lesson" with Ctrl or ⌘ held: per B44-H9's answer (recommended: today's page load in the same tab).
- B44-7.4 A click whose default another handler has prevented is left alone.

### B44-8. Decision 8: the fall-backs

- B44-8.1 = D-4. Never answered: at 2000 ms ± 50 a load of UDP starts (`page.waitForEvent('framenavigated')` timed from the press); `history.pushState` was not called (spy installed before the press); up to unload the old lesson, the signal and the tape are on screen.
- B44-8.2 = D-5. 404 (`route.fulfill({ status: 404 })`), 500, a rejected fetch (`route.abort()`), a body that is not JSON, a JSON with the stamp changed by one character, and a 200 whose `lesson.figure` is not the open page's: each starts a load of UDP before 100 ms after the answer, with no `pushState`.
- B44-8.3 Late but good: held 1999 ms: a swap, not a load; held 2001 ms and then answered: a load, and the late answer does not swap the old page in the moment before unload.
- B44-8.4 Fall-back after Back: hold the `.json`, Back from UDP to TCP, never answer: at 2000 ms `location.reload()` of TCP's address; `history.length` unchanged (no `assign`).
- B44-8.5 The fall-back of a sheet press leaves the sheet open to unload (D-21).

### B44-9. The film probe

- B44-9.1 TCP → UDP by "Next lesson" at 1440 with the data answered at once, filmed from the click: no presented frame has an empty stage, none shows the packet table in two places, and the first frame that is not TCP is UDP whole. Red on `revamp` (36 such frames today).
- B44-9.2 Made after hydration and counting frames a reader sees (2.130, job 29). At 375 by a sheet row it also fails on a presented frame with the sheet open over UDP (D-21).

### B44-10. The lesson's own specs and the unit suite

- B44-10.1 `lesson`, `lesson-layout`, `lesson-layout-small`, `controls`, `reading`, `site`, `tablet` and the unit suite pass; the walks that stop before the cross-lesson press (`e2e/lesson-layout.spec.ts:675-676`, `lesson-layout-small.spec.ts:419`) are unchanged.
- B44-10.2 `LessonConsole.flow.test.tsx`: the `navigate` cases changed on purpose are named in the diff; `:175` (TLS → Firewalls, another drawing) still expects `navigate('/networking/firewalls')`.

### D26 §15, checks 1-30

**Timing and the slow case**

- D-1 Answered under 100 ms (held 0 and 90 ms): from the press to the swap no frame has `.signal` or the tape in the DOM (or both are `display: none`), and no frame has an empty stage. Refuse a build that starts the signal on press and hides it after 100 ms.
- D-2 Held 300 ms: the signal is present at 100 ms ± 1 frame and not at 83 ms; present to the swap and gone in the swap's frame; the tape never; the live region never contains "Opening".
- D-3 Held 1000 ms: the tape's text is "Opening UDP" (source text, capitals by CSS: `textContent` is not "OPENING UDP") from 400 ms ± 1 frame; the live region "Opening UDP." from 400 ms and "UDP. Lesson 4 of 14. Overview." after. Held 399 ms: no tape, no "Opening".
- D-4, D-5: B44-8.1 and B44-8.2.
- D-6 Under reduced motion: the signal's computed `animation-name` is `none` (not just the 0.01 ms duration `global.css:185` gives every animation), and its dashes are drawn. Variant B is not built: no element anywhere has an animation named for the settle.

**The marks**

- D-7 Column row pressed, held 1000 ms: the UDP row has the going mark (`--here-soft` ground and the dashed 3 px edge) from the press; TCP's row keeps `aria-current="page"` and its solid edge until the swap; after the swap no row has the going mark. The going mark changes no attribute a screen reader reads (`aria-*`, `role`, accessible name of the UDP row are identical before and during the wait).
- D-7b Sheet row (375), the same.
- D-8 "Next lesson" and the Up next card, held 1000 ms: no row has the going mark; the signal and the tape as in D-2 and D-3.
- D-9 Sheet open (375), held 1000 ms: the signal's box sits on the bottom edge of `.outline__dialog-head`, the tape 4 px under it, 12 px inside its right edge; neither is in the bar.
- D-10 `aria-hidden="true"` on the signal and the tape; the boxes of `.console__top`, `.console__stage`, `.console__track` and `.console__guide` are equal (to the pixel) at 0 ms, during the tape and after the swap.
- D-11 Per B44-H6: at 375, "Opening TLS/SSL" (Networking HTTPS → TLS/SSL, held 1000 ms) does not intersect `.stage__views`; at 1440 the tape does not intersect `.stage__title` or `.stage__views`. Also at 1100 × 800 (the narrowest window with the column), where the bar is shortest.

**Focus**

- D-12 1440, keyboard: Tab to the UDP row, Enter: after the swap `document.activeElement` is that row's link, `aria-current="page"`, and it matches `:focus-visible`.
- D-13 1440, HTTPS → TCP by the row ("Loading a web page" → "Getting the data there"): after the swap focus is on TCP's row link (a new node), not on `body`.
- D-14 375, sheet row tapped: after the swap the dialog is not `open`, focus is on the visible `.top__name` "UDP" with `tabindex="-1"`, not on the "3 of 14"/"4 of 14" button the dialog returns focus to; after Tab, the `h1` has no `tabindex`. Also the sheet closed by Escape during the wait (§8): at the swap focus is on the `h1`.
- D-15 Up next card by Enter at 1440 and 375: focus on the visible `h1` (1440 the column's, 375 the bar's: the other has no boxes), matching `:focus-visible`; by a mouse click, not matching.
- D-16 "Next lesson" by Enter: the same button node keeps focus, named "Next: Connectionless Send, step 1" at 1440 and "Next: step 1, Connectionless Send" at 375 (B44-H7).
- D-17 Back and Forward (`page.goBack()`, `page.goForward()`): focus on the visible `h1`, which has `tabindex="-1"` only while focused.
- D-18 Per B44-H5: during a wait with focus moved to the scene, ← moves the old lesson back a step and Space plays it; with focus left on the pressed row, Space does not play TCP.

**What is heard**

- D-19 After TCP → UDP the live region's text is exactly "UDP. Lesson 4 of 14. Overview."; Back: "TCP. Lesson 3 of 14. Overview."; Networking Ports → TCP/UDP: "TCP/UDP. Lesson 11 of 20. Overview."; Networking NAT → DNS: "DNS. Lesson 13 of 20. Overview." (the track's number, not How the Internet Works' 6). A done or in-progress UDP: the line says no "Done" or "Resume".
- D-19b After the line, the next move is today's announcement: → in UDP says step 1's announcement (`stepAnnouncement`), ← back says "Overview".
- D-19c The line is never equal to the text before it: a swap from TCP's Overview (region "Overview") changes the text (no lost announcement); two quick swaps (UDP, then IP during the wait) end on "IP. Lesson 5 of 14. Overview." only.
- D-20 Exactly one `[aria-live]` in `.console` (the existing `p[data-announce]`), before, during and after a wait; the tape is not in a live region.

**The sheet and the row**

- D-21 375, sheet row, held 1000 ms: the dialog stays `open` until the swap, and in the swap's first presented frame it is closed (Outline closes it in a passive effect today, `Outline.tsx:214-225`; a passive close can paint one frame of the sheet over UDP). On the fall-back it is still open at unload.
- D-22 After the swap the "here" look and `aria-current="page"` are on UDP's row only, in the column and in the sheet when reopened; TCP's row shows its progress status ("In progress" after a step, "✓ Done" after its Practice, nothing after the Overview alone; `src/lib/hub.ts:9-14`); the strip's orange segment is the 4th; the bar's button reads "4 of 14" with the name "4 of 14: all 14 lessons, this is lesson 4".
- D-23 TCP's own row, plain click: a page load of TCP; the console fetched nothing.
- D-24 Held 1000 ms, press UDP then IP: exactly one request is still pending (the UDP one aborted, `requestfailed` with `net::ERR_ABORTED`), the going mark is on IP's row only, the swap is to IP, and the address is IP's with one new history entry, not two. Also UDP answered after IP was pressed: no swap to UDP.

**What carries over**

- D-25, D-26: B44-5.1, B44-5.3.
- D-27 Email's part opened in the column at TCP, TCP → UDP: Email still open. HTTPS → TCP by the row: "Loading a web page" is a `details` with `open` (a re-made element: React swaps `section` for `details` with the same key, `Outline.tsx:160-181`, and a new `details` starts closed), "Getting the data there" is the `section`.
- D-28 B44-4 and B44-5: position 0, Overview, no picks, deeper and every definition closed, the log's fold closed, the table's mark clear, guide at the top, idle.
- D-29 IP → DNS by "Next lesson" (part "Getting the data there" → "Behind the scenes", list box `.track__list` 234-710 at 1440 × 900): DNS's row is wholly inside the list's box after the swap, 8 px clear where it had to scroll (`Outline.tsx:280-287`'s rule, which today runs at mount only). Also at 1100 × 700, where the list is shorter.

**Networking**

- D-30 Ports → TCP/UDP and TCP/UDP → NAT swap (B44-0.1's checks); Subnetting → Router by "Next lesson" is a load with no going mark and no signal (B44-0.2).

## The trial of decision 4 and what was settled from the code (the reviewer)

### Q1. The trial of decision 4, on the built site

**Result: decision 4 holds.** On every swap tried the `svg[data-figure]` element after the change is the element before it (one such element on the page), the driver is not made again, and `show` repaints it to what a fresh load of the new lesson draws, with two differences no reader can see or hear (below). The draw-in does not play again (`getAnimations()` on the kept node: `lm-draw-in finished`).

**How.** In this worktree only (`src/lesson/LessonConsole.tsx`, the trial patch at the file's end, `TrialSwappable`): the island's default export holds its props in state and exposes `window.__swap(partial)`, which commits new props with `flushSync`. Nothing else changes: the console, `ScenePanel`, the slotted `figure` element and `figureData` (same object) are kept, so React re-renders with a new `lesson`, `entry`, `next`, `nextFigure` and `definitions` exactly as decision 3 hands them over. Built with `npm run build` (green, 42 pages within budget), served compressed by a copy of `serve.mjs` on port 4545, driven by Playwright (`trial/trial.mjs`). The new lesson's props come from the built page's own island (`/__swap/<track>/<slug>.json`, revived from Astro's `[type, value]` form). For each pair: a fresh page loads the target, waits for hydration and 900 ms, and takes `svg.outerHTML`; a second page loads the source, keeps a reference to its `svg`, optionally walks, swaps, waits two frames, checks the reference is still `document.querySelector('svg[data-figure]')`, and takes `outerHTML`. The two strings are compared token by token (split at `<`).

| Mode | Pairs | Same node | `outerHTML` equal |
|---|---|---|---|
| Swap at the Overview, 1440 dark | 37: all 13 adjacent pairs of How the Internet Works both ways (26), and 11 consecutive pairs over Networking's 12 `net-map` lessons in track order (Ports, TCP/UDP, NAT, DNS, HTTP, HTTPS, TLS/SSL, Proxies, VPN, Packets, ARP, Router) | 37 of 37 | 36 of 37 byte for byte; Packets → ARP differs (b) |
| Old lesson walked with → to its Practice (every step's events played), back to its Overview by the timeline, then the swap, 1440 dark | 24 (the forward pairs above) | 24 of 24 | 0 of 24 byte for byte; all 24 equal once (a) is normalised, but Packets → ARP (b) |
| As above, then the new lesson walked to its Practice in both pages and the plays left to end (3 s) | 7 (TCP→UDP, HTTPS→TCP, SSH→TLS, TCP/UDP→NAT, Proxies→VPN, Packets→ARP, IP→DNS) | 7 of 7 | all 7 equal once (a) is normalised, but Packets → ARP (b) |
| 375 × 812 under reduced motion, Overview and walked-after | TCP→UDP, UDP→TCP | 4 of 4 | 4 of 4 byte for byte |

What differed:

- **(a) The `style` attribute's text** on 2 to 7 elements a play has touched (`#nm-trail`, `#nm-over`, the `nm-tag-*` groups): the kept node says `style="opacity: 0;"` where the built markup says `style="opacity:0"`. The same value, written back by the CSSOM after `el.style.opacity = …` (`src/scenes/drivers/net-map.ts:322-324`, `fade`). This happens inside one lesson too, after any play; a byte comparison of the drawing is red after any walk, and must compare the parsed declarations.
- **(b) The hidden router name strips.** Packets labels routers `b`, `c` and `d`; ARP labels none of them. `paintNames` (`src/scenes/drivers/net-map.ts:515-522`) sets `display="none"` on a strip with no label and leaves its old text, width and `x`: after the swap the three strips hold "b", "c", "d" at width 18.4 where a fresh ARP has empty text at width 19 (`src/art/scenes/net-map.ts:538`). The strips are `display="none"` and inside a `role="img"` drawing, so nothing is painted or read; but a byte check is red, and a later unit showing that strip again would repaint it first (`paintNames` always writes text and width for a shown strip). See B44-H3.
- **Not a difference, a trap found on the way:** if the driver *is* made again on the same node (a new `figureData` object, which is what a remount or a `figureData` taken from fetched data gives, `ScenePanel.tsx:134-145`), `create` reads the figure's description from the live `aria-label` (`net-map.ts:297`), which the last `show` has already rewritten. Measured (`trial/recreate.mjs`): VPN → Packets with the driver re-made leaves Packets' drawing described as VPN's ("On the left, a café … Behind the internet, the VPN server…"), where a fresh Packets says "On the left, your home…". With the driver kept (decision 4), all pairs tried are equal. Attack case B44-2.3.
- **Not run as a comparison:** a swap at step 3 against a fresh `?step=3` load. The fresh deep link plays step 3's events while the kept console (position unchanged by the trial patch) does not, so the two differ by a play in flight; decision 5 resets the position on a swap anyway, so this mode tests nothing the build will do.

Files: `trial/trial.mjs`, `trial/recreate.mjs`, `trial/anims.mjs`, `trial/ids.mjs`, `trial/state.mjs`, `trial/titles.mjs`, `trial/boxes.mjs`, `trial/tape.mjs`; results `trial/overview.json`, `trial/walked.json`, `trial/walkafter.json`.

### Settled from the code

#### Q4. What plays for about 600 ms as a lesson opens

One thing only: the figure's draw-in. `src/art/lumen.css:228-230`:
`@keyframes lm-draw-in { from { opacity: 0; transform: translateY(6px); } }`, `.lm-svg { animation: lm-draw-in 600ms var(--ease-out, …) both; }`, and `animation: none` under `prefers-reduced-motion: reduce`. Every scene's root carries `lm-svg` (net-map: `src/art/scenes/net-map.ts:613`, `class="lm-svg nm"`). The Card stack pages turn it off in `src/styles/card-stack.css:95-108` (`#main .lm-svg { … animation: none; }`), but the Lesson page does not load that sheet (`src/lesson/console.css:47-48` says so), and `BaseLayout.astro:3` imports `lumen.css` on every page.

Measured on the built site (`trial/anims.mjs`, every `document.getAnimations()` from the first frame to 3 s after a load of What is TCP): at 1440 × 900 and at 375 × 812, `lm-draw-in on svg.lm-svg.nm, 600 ms`, first seen 31-33 ms after navigation start, and nothing else (no transition, no other keyframes). Under reduced motion: nothing at all.

On a swap the node stays, so the draw-in does not play again by itself: after every trial swap below, `svg.getAnimations()` is `["lm-draw-in finished"]`. Playing it "the same way" (D26 §6, second sentence) would mean restarting a fade from opacity 0 on the whole drawing, which is an empty stage for the first frames: it contradicts D26 §6's first sentence ("The drawing never moves"), check 1 ("the swap's first frame shows the new lesson whole") and the plan's Done means ("no filmed frame has an empty stage"). See hole B44-H1.

#### Q3. Do unit ids repeat across lessons

Measured over the island props of all 34 built lesson pages (`trial/ids.mjs`): 30 distinct lessons, and one unit id is shared by two of them: `dhcp`, in `what-is-dhcp` (How the Internet Works, figure `net-map`) and `dhcp` (Networking, figure `dhcp`). Every other unit id is unique to its lesson. The two lessons that share it are in different tracks and draw different figures, so no swap can go from one to the other (decision 1): today `picks` (keyed by `unit.id`, `src/lesson/LessonConsole.tsx:232-238`) could not leak a pick by an id clash on any swap. That is luck, not a rule: nothing in the schema makes unit ids unique across lessons, and question ids inside a unit's picks are per unit. Decision 5 resets `picks` anyway; the attack case below seeds a pick and checks it is gone, which holds whatever the ids are.

Other keyed state checked for the same leak (`trial/state.mjs`, over the built props):

- **Every one of the 30 lessons has exactly one unit** today, so `seen` (a set of unit *indices*, `LessonConsole.tsx:226-229`) and the outline's `filter` (`Outline.tsx:275`, shown only when `lesson.units.length > 1`, `:276`, `:321`) have nothing to leak between real lessons now; they would the day a lesson of many units is written (index 0 is in every `seen`).
- **`openDefs`** (`src/lesson/Explanation.tsx:247`) holds glossary term ids, and adjacent swappable lessons share terms: HTTP and HTTPS share `term-html` (adjacent in both tracks); HTTPS and TCP share `term-handshake` (How the Internet Works 2 → 3); HTTPS and TLS/SSL share `term-cert` and `term-ca` (Networking 15 → 16). A definition opened in the first shows open in the second unless it is reset. Attack case B44-5.4.
- `deeperOpen`, `logOpen`, `changeSeen`, `tab`, `sheetOpen` are booleans or single values (no key), so they carry over whole unless reset (D26 §7 rules each).

#### Q2. Guard files and `[lesson].astro`

The git-diff guards that name files B44 might touch:

| Guard | Files it pins | Would B44 need a grant |
|---|---|---|
| `src/lib/not-found-page.test.ts:58` (base 1d8e446) | `src/pages/[track]/[lesson].astro`, `about.astro`, `glossary.astro`, `src/layouts` but BaseLayout, `src/components/site.css`, `src/styles/tokens.ts`, `src/art` but `logo.ts`, `e2e/support.ts` | No, if B44 stays out of them. The two a builder is tempted by: `e2e/support.ts` (a helper for the new spec: put it in `e2e/lesson-change.spec.ts` instead) and `src/art` (the hidden router-strip residue of B44-H3 is fixed in the driver, `src/scenes/drivers/net-map.ts`, which no guard names). D26 adds no token (§3), so `tokens.ts` stays. |
| `not-found-page.test.ts:89`, `about-page.test.ts:276`, `glossary-page.test.ts:294` (`pageGrant` on `src/layouts/BaseLayout.astro` = `BASE_LAYOUT_GRANT`, `src/lib/card-stack-guards.ts:214`) | BaseLayout, comments and blank lines dropped | No. Decision 2 keeps the HTML byte for byte; the client finds `title`, `meta[name=description]`, `meta[property=og:*]` and `link[rel=canonical]` by selector, so no id or attribute is needed in the layout. A builder who puts the build stamp or a hook in BaseLayout needs a grant and breaks decision 2. |
| `about-page.test.ts:286`, `glossary-page.test.ts:299` (base f30e876) | `[lesson].astro`, `tokens.ts`, `src/layouts` but BaseLayout, `site.css`, `src/components/hub` (and glossary files) | No, as above. |
| `src/styles/global.test.ts:40` (text of `global.css`) | one reduced-motion block in `global.css` | Not a git guard, but the signal's reduced-motion rule (check 6) must go in `console.css`, not `global.css`. |
| `src/lesson/no-script.test.ts:13-24`, `definitions.no-script.test.ts:13-23` | render `[lesson].astro` | Not grants; they must stay green (decision 2). |

**`[lesson].astro` needs no change.** The data's address follows from `entry.url` (`/${track.id}/${slug}`, `src/content/registry.ts:93`; the page passes `entry`), the island already gets everything a swap keeps (`entries`, `figureData`, `trackId`, `trackTitle`, `total`, `[lesson].astro:49-61`), and the head's values can be rebuilt on the client from the data (`lesson.title`, `lesson.summary`, `entry.canonical`; BaseLayout's rules at `BaseLayout.astro:46-54`). Two things would pull a builder into it, and both have answers outside it: the build stamp the open page compares against (B43-H1: compile it into the console's script, which decision 2 already lets change name) and the first lesson's own data for Back to the first entry (the island's own props; no fetch needed, B44-H4).

One more measurement for the attack cases (`trial/range.mjs`): with the trial patch, a lesson prop changed while the position is still the old lesson's (TCP walked to its Practice, position 8; UDP's last position is 7) throws nothing, but the visit effect (`LessonConsole.tsx:281-283`) runs once with UDP's `entry` and TCP's position and writes `lessons["what-is-udp"] = { status: "in-progress", furthestPosition: 7 }` for a lesson the reader has not opened. A swap that commits the new `entry` one render before the position goes back to 0 does exactly this. Attack case B44-6.2.
