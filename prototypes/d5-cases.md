# H1: errata to its spec, and the attack cases a build must survive

From the spec review of H1 (reviewer, 2026-11-11), before the build. The spec is `plan.md`, "H1's spec", and `prototypes/d5-home-sources.md` in variant A, which the owner approved. Every hole had one right answer once measured, so the orchestrator closed each as an erratum; none went back to the designer. Where an erratum and the spec differ, the erratum holds.

Measured and fine as the spec has it: `Stamp` with no `href` is a plain `<span class="stamp">`; `lessonStamp` and `stampWords` have the shapes the spec assumes; all 20 names, cut at the first `": "`, equal the registry's `short`; the stamp's count and the list's length are both 20; the page's one breakpoint is 860px; none of D5's CSS reaches inside `Stamp`.

## Errata

1. **Which step shows the page's words.** A lesson may carry only the `full` cue (TCP, TLS and IMAP do), and the lesson's own figure draws the words under `full` too. So `words` is the first step with any `page` cue and `pictures` is the first step with `page: 'full'`. `homeDemo` throws, naming the lesson, when it has no `page` cue, and when it has no `full`.
2. **Cues on every event.** A note can carry a cue as a message can. `homeDemo` reads the cues of every event of a step, not only its messages.
3. **Lit from that step on.** The page stays once drawn: the words are lit at every step from `words` on, the pictures at every step from `pictures` on, and both through Learn and Practice. The lists of lit steps come from a pure, exported helper in `src/lib/home.ts`, which a unit test tries with a lesson whose two numbers differ (What is HTTPS: 5 and 6). With What is HTTP both are 5, the last step, so the page alone cannot tell "from" and "at" apart.
4. **No island, checked on the built page.** `npm run budgets` measures script on lesson pages only, so it cannot fail for Home. An end-to-end check asserts that Home has no `astro-island` and as many `<script` elements as it had before H1 (measure the count on the built page before the change and assert that number).
5. **Check 16 as a unit test.** No test reads `src/pages/index.astro`'s styles. A unit test reads the file and asserts that D5's rules (from the comment that opens them to the one that closes them) hold no hex, `rgb(` or `hsl(` value.
6. **The sizes are set by the tests.** The projects run at 390×844 and at 1280 to 1920 wide. Checks 12 to 14 set 375×812 and 1440×900 themselves with `test.use({ viewport })`, as the D2 block in `e2e/site.spec.ts` does.
7. **Check 5 with values, and a real throw.** The stamp is asserted as `{ checked: '2026-11-11', sources: 20 }`. The throw is triggered with `swapIn`: `lessonStamp` counts unique URLs and the list counts sources, so a lesson whose second reference has the first one's URL makes them differ.
8. **Step 4 is polled.** The figure's parts fade over 200ms, so the check that the page is empty at step 4 goes to step 5 first, comes back, and polls for opacity 0.

## Attack cases

Each becomes a test, shown failing against the broken build it names.

### Unit, in `src/lib/home.test.ts`

1. `foldSources` with 0, 1, 2 and 6 sources shows them all and folds none. Fails a build that folds at fewer than 6 or at more than 3.
2. With 7 sources: 3 shown and 4 folded. With 12: 3 and 9. With 31: 3 and 28. `folded[0]` is the fourth source given. Fails an off-by-one, and a fold taken from the end.
3. Names: "RFC 3550: RTP: A Transport…" gives "RFC 3550" (fails a cut at the last `": "`); "RFC 9110:HTTP" stays whole (fails a split on `:` alone); "Plain label" stays whole and does not throw.
4. `homeDemo().learn.sources` has 20 entries. Names 1 to 4 are RFC 9114, RFC 9110, RFC 3986 and RFC 791; name 20 is RFC 6335. Each `name` equals that source's `short` in `SOURCES`, and each `label` keeps its `": "`.
5. `learn.stamp` equals `{ checked: '2026-11-11', sources: 20 }`, and `learn.numbered` is true.
6. `homeDemo('what-is-https', 'what-is-tcp').learn.numbered` is false.
7. With `swapIn`, a lesson whose `references[1].url` is `references[0].url` makes `homeDemo()` throw a message naming the lesson and both counts.
8. `page` for each lesson: What is HTTP gives `{ words: 5, pictures: 5 }`; What is HTTPS `{ 5, 6 }`; What is TCP `{ 5, 5 }` (fails a search for the `text` cue alone); What is POP3 `{ 4, 4 }`.
9. `homeDemo('what-is-udp', 'what-is-tcp')` throws, naming `what-is-udp`: it has no `page` cue.
10. With `swapIn`, the `text` cue moved onto a note event in step 4 gives `words: 4`. Fails a scan of messages only.
11. The lit-step helper with What is HTTPS's numbers (5, 6, last step 6): the words are lit at steps 5 and 6, the pictures at step 6 only, and both through Learn and Practice. Fails "at that step only".
12. D5's rules in `src/pages/index.astro` hold no colour value other than a token.

### End to end, in `e2e/site.spec.ts`, on Home's Learn part, at 375×812 and 1440×900

13. `.demo__src .stamp` reads "Checked 11 Nov 2026, 20 sources" and is a `span`. `.demo__src a` counts 20: fails variant B (3) and a linked stamp (21). The lesson's own `.console__top .stamp` shows the same count.
14. `.demo__src` holds no "Sources:", and its visible text reads exactly the stamp, then 1 RFC 9114, 2 RFC 9110, 3 RFC 3986, then "Show the other 17".
15. Closed: exactly 3 links are visible. Pressing the control shows 20 links and it reads "Hide the other 17". Pressing again brings `.demo__src` back to its first height, to the pixel.
16. Open: the `.demo__num` texts are "1" to "20". The folded list has `start="4"` and `aria-label="Sources 4 to 20"`, and the first list has `aria-label="Sources"`.
17. Each link's `href` matches, in order, the links of the lesson's `ol.explain__sources > li` (the lesson page, JavaScript on). Link 20's `title` starts "RFC 6335: ", and no link has a `target`.
18. Keyboard: from the HTTPS link, Tab reaches sources 1, 2 and 3, then the `summary`. Enter opens it, and the next Tab reaches source 4. Shift+Tab goes back to the summary, and Space closes it. With the list closed, Tab from the summary never lands in the folded list.
19. With JavaScript off, cases 15, 18 and 22 pass.
20. At 375, every visible source link and the `summary` are at least 44px tall, closed and open. At 1440 the `summary` is at least 44px tall.
21. Columns: at 375, 768 and 860 the shown list is 3 across and the folded list 2 across, with links at least 44px tall; at 861 and 1440 the folded list is 3 across. Fails any breakpoint other than 860.
22. `scrollWidth` equals `clientWidth` on the document, closed and open, at both sizes, in both themes.
23. Closed, `.demo__src` is at most 115px tall at 375 and at most 99px at 1440.
24. The page on the laptop. On Watch at steps 1 to 3 the words are at opacity 0. Go to step 5, then back to step 4: a poll finds both the words and the pictures at 0 (fails the old "last step but one" rule). At step 5 both are at 1. Choosing Learn straight from step 1, then Practice: both stay at 1.
25. Home has no `astro-island`, and as many `<script` elements as before H1.
26. The lesson's words, quoted literally: the full name "Hypertext Transfer Protocol"; step 1's "You type http://example.net and press Enter"; the lead "In HTTP/1.1, getting a web page is a conversation in plain text."

### D5's acceptance checks and the cases that cover them

| Check | Cases |
|---|---|
| 1 | 1, 2 |
| 2 | 3, 4 |
| 3 | 4 |
| 4 | 5, 6 |
| 5 | 5, 7 |
| 6 | 13 |
| 7 | 14 |
| 8 | 15 |
| 9 | 16, 17 |
| 10 | 17 |
| 11 | 18 |
| 12 | 20, 21 |
| 13 | 22 |
| 14 | 23 |
| 15 | 19 |
| 16 | 12 |
| Built page only | 25 |
| The page cue (H1's point 2) | 8 to 11, 24 |
