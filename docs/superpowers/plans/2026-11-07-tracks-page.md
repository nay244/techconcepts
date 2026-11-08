# Tracks Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A `/tracks` page that lists every track as a card (cover art, type and level, title, one sentence, lesson count, this browser's progress), which the header's "Tracks" link opens instead of going straight to Networking.

**Architecture:** A static Astro page builds one card per ready track from the registry, then one per planned track from a small list in `src/content/tracks/index.ts`. A small React island per ready card reads saved progress and adds the "Last opened" tab and a progress ring. CompTIA A+ is the only planned track. It gets a new cover drawn with the Anatomy kit, like the six existing covers.

**Tech Stack:** Astro 7 static pages, React 19 islands, TypeScript, Vitest (jsdom for islands), Playwright e2e.

**Spec:** approved in chat on 2026-11-07, after mockup A ("Card grid") in the brainstorming companion. The owner's words: "Specs look correct build it out." The approved description, in full:

- A new Tracks page at `/tracks`. The header's "Tracks" link goes there instead of to `/networking`.
- At the top: a small "Tracks" label, a heading, and one line on what a track is.
- Cards three to a row at desktop width (mockup A). Each card shows:
  - its cover art on top;
  - the track type and level ("Concept track · Beginner");
  - the title and one sentence;
  - at the bottom, the lesson count and a progress ring from what this browser has saved.
- The track opened last gets a marigold "Last opened" tab. Marigold already means "you are here" on the site.
- Clicking a card opens that track's page. Track pages otherwise stay as they are.
- A+ needs a new cover drawn with the same kit, kept original.
- No filter chips while there are only a few tracks.
- A+'s flag reads "Being written", not "In progress", because lesson cards already use "In progress" to mean the learner has started.
- Build it now. The page shows Networking (with How the Internet Works inside it, as today) and A+. How the Internet Works gets its own card when direction doc §10 task 6 splits it out.

## Global Constraints

- Desktop widths only (1280 and 1440, both themes) until direction doc §10 task 8. The phone and tablet e2e projects must still pass, but they don't need to look designed.
- Beginner-first voice. Lessons stay untimed, so no minute figures anywhere.
- All art is original. The A+ cover uses the vendored Anatomy kit with the same plate, camera and finish as the six covers in `src/art/figures/covers.ts`:
  - charcoal solids in both themes;
  - one lit part in our blue;
  - no grain;
  - one small engraved label on the plate.
- Never write absolute paths containing the folder name into tracked files.
- Commits stage named paths only. Never `git add -A`: the owner's untracked `.claude/launch.json` and `Claude outputs/` must stay out.
- Before anything is called done: `npx vitest run`, `npm run build` (astro check plus budgets) and `npm run e2e`, with failures reported as they are.
- One branch (`feat/tracks-page`, from `main` at `314e844`) and one PR to `main`. Never merge without the owner's OK.

## Review Focus

1. **Last opened in a track that isn't listed.** If the saved `lastTrack` names a track that isn't on the page, or `lastLesson` isn't in that track's ready lessons, no card shows the tab.
2. **No JavaScript or blocked storage.** The page shows every card, with lesson counts and no tab or ring, and nothing throws.
3. **A track with saved records but nothing finished.** The ring is empty, and the text reads "n in progress", not "0 of 20 done".
4. **Header link on every page.** "Tracks" points to `/tracks` everywhere, and is marked current on `/tracks` and on track pages.
5. **The A+ card is not a link.** It has no `href`, isn't focusable, and its flag is visible text, not colour alone.

## Calls made in this plan, for the owner's review

1. The track page's breadcrumb becomes **Home › Tracks › Networking Concepts**, so a learner can step back to the new page.
2. Card titles are `h2`, because the page has one `h1`.
3. The ring text reads **"n of 20 done"** once any lesson is finished, otherwise **"n in progress"**. The ring fills by finished lessons over planned lessons.
4. A+'s foot reads **"No lessons yet"**, and its one sentence is: "Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives."
5. The A+ cover is **an open PC tower**: its side panel rests against it, and inside are a fan, a drive and two memory sticks, with the lit one being pressed into place. Its engraved label reads **"RAM · 2 × 8 GB"**. The owner approves the cover from the PR's screenshots before merging.
6. Home and About don't change. About's "tracks planned" count and Home's roadmap cards wait for §10 task 7, which rebuilds Home.

---

### Task 1: The A+ cover

**Files:**
- Modify: `src/art/figures/covers.ts`, `src/art/figures/figures.test.ts`

**Interfaces:**
- Produces: `CoverId` gains `'aplus'` (`COVER_IDS` becomes `['networking', 'web', 'crypto', 'ai', 'privesc', 'tvm', 'aplus']`). `cover('aplus')`, `coverStill('aplus', tag)` and `coverDescription('aplus')` all work.

- [ ] **Step 1: Write the failing test.** In `figures.test.ts`, add `'cover:aplus'` to the pinned checksums with a placeholder value, so the checksum test fails. Add two more checks:

```ts
test('the A+ cover is a figure on the shared plate, with one lit part and its label', () => {
  const svg = cover('aplus');
  expect(svg).toContain('class="iso-svg lm-svg lm-pc');
  expect(svg).toContain('RAM · 2 × 8 GB');
  expect(svg).toMatch(/data-lit/);
  expect(svg).not.toMatch(/feTurbulence|grain/i);
});
test('the A+ cover says what it shows', () => {
  expect(coverDescription('aplus')).toMatch(/PC tower/);
});
```

- [ ] **Step 2: Run** `npx vitest run src/art/figures`. Expected: FAIL, because `'aplus'` is not a cover id.

- [ ] **Step 3: Draw the cover.** Add `function pcTower(): string` to `covers.ts`, in the same style as `router()` and `padlock()`, using only the kit helpers `covers.ts` already imports:
  - an upright tower case on feet;
  - its side panel off, leaning against the case's side on the plate;
  - inside, a motherboard face, a fan (a ring with blades), a drive in a bay, and two memory sticks in slots;
  - one stick drawn `lit: true` and slightly raised, as if being pressed in.

  Wire it up as `DRAW.aplus = () => frame('pc', 'RAM · 2 × 8 GB', pcTower(), DESCRIBE.aplus)`, with `DESCRIBE.aplus`: "An open PC tower on a plate, its side panel leaning beside it. Inside are a fan, a drive and two memory sticks, one of them lit as it is pressed into place."

  Check that the figure fits the plate, with nothing clipped, at Home's crop (`cropViewBox(coverStill('aplus', 'x'), '30 20 540 378')`). Render it into a throwaway HTML file under `.superpowers/` and look at it in both themes.

- [ ] **Step 4: Pin the checksum.** Run the checksum test, copy the reported sha into `'cover:aplus'`, and run again. Expected: PASS, with every other cover's checksum unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/art/figures/covers.ts src/art/figures/figures.test.ts
git commit -m "feat: an A+ cover, an open PC tower drawn with the Anatomy kit"
```

---

### Task 2: The Tracks page

**Files:**
- Create: `src/lib/tracks-page.ts` and `src/lib/tracks-page.test.ts`
- Create: `src/components/TrackCardStatus.tsx` and `src/components/TrackCardStatus.test.tsx`
- Create: `src/pages/tracks.astro`
- Modify:
  - `src/content/tracks/index.ts` (`plannedTracks`);
  - `src/components/SiteHeader.astro` (Tracks link);
  - `src/pages/[track]/index.astro` (breadcrumb);
  - `e2e/support.ts` (`SITE_PAGES`);
  - `e2e/site.spec.ts`.

**Interfaces:**
- Consumes:
  - `cover`, `coverStill` and `CoverId` (with `'aplus'`) from Task 1;
  - `cropViewBox` from `src/art/ids`;
  - `getEntries` and `trackTotals` from the registry;
  - `knownFrom` and `levelLabel` from `src/lib/entries`;
  - `firstSentence` from `src/lib/home`;
  - `useProgress` and `trackCompletion` from `src/progress`.
- Produces:

```ts
// src/content/tracks/index.ts
export interface PlannedTrack { id: string; title: string; type: Track['type']; level: Track['level']; blurb: string; cover: CoverId }
export const plannedTracks: PlannedTrack[]; // [{ id: 'comptia-a-plus', title: 'CompTIA A+', type: 'certification', level: 'beginner', blurb: 'Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.', cover: 'aplus' }]

// src/lib/tracks-page.ts
export const TRACK_COVERS: Record<string, CoverId>; // { networking: 'networking' }
export interface TrackCard {
  id: string; title: string;
  href: string | null;          // '/networking'; null for a planned track
  kind: string;                 // 'Concept track · Beginner'
  blurb: string;                // a ready track's firstSentence(description), a planned track's blurb
  cover: CoverId;
  count: string;                // '20 lessons · 4 ready', or 'No lessons yet'
  flag: string | null;          // 'Being written' for a planned track
  known: Record<string, number>; // knownFrom(entries); {} for a planned track
  planned: number;              // trackTotals(entries).planned; 0 for a planned track
}
export function trackCards(): TrackCard[]; // ready tracks in `tracks` order, then plannedTracks; throws `The <id> track has no cover for the Tracks page.` for a ready track missing from TRACK_COVERS

// src/components/TrackCardStatus.tsx
export function TrackCardStatus(props: { trackId: string; known: Record<string, number>; planned: number }): JSX.Element | null;
```

`TrackCardStatus` renders nothing on the server, on a first visit, or while storage is blocked. Otherwise it renders up to two things:
- `<span class="tab-here">Last opened</span>`, when `data.lastTrack === trackId` and `data.lastLesson` is one of `known`'s keys;
- `<span class="ring">` (an SVG ring filled by finished ÷ planned, then the text), when `trackCompletion(data, Object.keys(known))` has any finished or in-progress lesson. The text is `${finished} of ${planned} done` when `finished > 0`, otherwise `${inProgress} in progress`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/tracks-page.test.ts
test('Networking first, then A+', () => {
  expect(trackCards().map((c) => c.id)).toEqual(['networking', 'comptia-a-plus']);
});
test('a ready track links to its page, with its counts and type', () => {
  expect(trackCards()[0]).toMatchObject({ href: '/networking', kind: 'Concept track · Beginner', count: '20 lessons · 4 ready', flag: null, planned: 20, cover: 'networking' });
  expect(trackCards()[0]!.blurb).toBe('How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.');
});
test('a planned track is no link, says so, and has no progress', () => {
  expect(trackCards()[1]).toMatchObject({ href: null, kind: 'Certification track · Beginner', count: 'No lessons yet', flag: 'Being written', known: {}, planned: 0, cover: 'aplus' });
});

// src/components/TrackCardStatus.test.tsx (jsdom; seedProgress(lessons, lastLesson, lastTrack))
const KNOWN = { dhcp: 7, subnetting: 6 };
test('a first visit, and the server render, show nothing', ...);              // container is empty; renderToString is ''
test('the track opened last gets the tab', ...);                              // seedProgress({ dhcp: { status: 'in-progress', furthestPosition: 3 } }, 'dhcp', 'networking') → 'Last opened'
test('another track opened last: no tab', ...);                              // same records, lastTrack 'how-the-internet-works' → no 'Last opened'
test('a last lesson this track does not have: no tab', ...);                 // lastLesson 'osi-model', lastTrack 'networking' → no tab
test('finished lessons fill the ring: "1 of 20 done"', ...);                  // dhcp finished → text '1 of 20 done'; ring dasharray '2.4 100' (2π·7.5 × 1/20)
test('started but none finished: "1 in progress", ring empty', ...);          // dhcp in-progress → '1 in progress'; dasharray '0.0 100'
test('a record for a lesson the track does not list: no ring', ...);          // { 'osi-model': … } only → nothing
test('hydrates from the empty server render without warnings', ...);          // the HeroCta.test.tsx pattern
test('storage blocked: nothing', ...);                                       // last in the file, as HeroCta.test.tsx does
```

```ts
// e2e/support.ts: SITE_PAGES gains { name: 'tracks', path: '/tracks' } (so every all-pages check covers it)
// e2e/site.spec.ts
test('the header’s Tracks link opens /tracks on every page, marked current on /tracks and the track page', ...);
test('the Tracks page: Networking links to its page with "20 lessons · 4 ready"; A+ is no link and says "Being written"', ...);
test('after finishing DHCP, the Networking card is "Last opened" with "1 of 20 done"', ...); // extend the existing finish-DHCP test
test('the track page’s breadcrumb steps back to Tracks', ...);              // crumbs: Home › Tracks › Networking Concepts
// and '/tracks' joins the "no time figure" list
```

- [ ] **Step 2: Run** `npx vitest run src/lib/tracks-page.test.ts src/components/TrackCardStatus.test.tsx`. Expected: FAIL (the modules don't exist).

- [ ] **Step 3: Implement** `plannedTracks`, `tracks-page.ts`, `TrackCardStatus.tsx` and `tracks.astro`, then point the header's link at `/tracks` and add the breadcrumb step. Page details:
  - **Layout.** `<BaseLayout title="Tracks" current="tracks" description="Every TechConcepts track: sets of short visual lessons, taken in order.">`.
  - **Hero.** Reuse `page-hero.css` (`.t-hero`, `.crumbs`, `.eyebrow`, `h1`, `.lede`), as About and the track page do:
    - crumbs "Home › Tracks";
    - eyebrow "Tracks";
    - `h1` "Pick a track";
    - lede "Each track is a set of short visual lessons, taken in order. Concept tracks explain how things work; certification tracks follow an exam's objectives."
  - **Grid.** A `ul` of cards, three per row at 1280 and 1440. Each card follows mockup A:
    - a 200px art box using Home's `--fig-bg` and `--fig-line`, holding `cropViewBox(coverStill(id, 'tracks-' + id), '30 20 540 378')`, `aria-hidden`;
    - the kind line in mono capitals, then an `h2` title, the blurb, and a foot with the count on the left and `<TrackCardStatus client:load …/>` on the right;
    - the card has `position: relative` and the foot doesn't, so `.tab-here` sits at the card's top left;
    - a ready card is an `<a class="tcard" href>`; a planned card is a `<div class="tcard later">` with a `.flag` "Being written" at the art's top right.
  - **"Last opened" styling.** A card with the tab shows a `--here` border. Use `:has(.tab-here)`, which Chromium, Firefox and Safari support.
  - **Hover.** Ready cards lift on hover the way Home's track cards do; copy those rules, don't invent new ones.

- [ ] **Step 4: Run** `npx vitest run && npm run build && npm run e2e`. Expected: all PASS, with the budgets showing 9 pages.

- [ ] **Step 5: Check by eye** at 1280×800 and 1440×900 in both themes:
  - `/tracks` as a first visit;
  - `/tracks` after finishing DHCP: the tab, the ring and "1 of 20 done";
  - the header link from Home;
  - the track page's breadcrumb.

  Save screenshots for the PR, including the A+ cover close up.

- [ ] **Step 6: Commit**

```bash
git add src/content/tracks/index.ts src/lib/tracks-page.ts src/lib/tracks-page.test.ts src/components/TrackCardStatus.tsx src/components/TrackCardStatus.test.tsx src/pages/tracks.astro src/components/SiteHeader.astro "src/pages/[track]/index.astro" e2e/support.ts e2e/site.spec.ts
git commit -m "feat: a Tracks page lists every track; the header's Tracks link opens it"
```

- [ ] **Step 7: Ask the owner** before pushing `feat/tracks-page` and opening the PR. The PR body lists this plan's calls for review, the test counts and the screenshots, including the A+ cover close up. Never merge without the owner's OK.
