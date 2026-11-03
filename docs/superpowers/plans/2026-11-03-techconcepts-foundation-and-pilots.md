# TechConcepts Foundation & Pilot Lessons: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TechConcepts site: the shell, all three scene engines, browser-only progress, Home/Track/Lesson/About/404 pages, and the three pilot lessons (DHCP, Subnetting, Firewalls). Deploy it to a Cloudflare preview URL.

**Architecture:** A static Astro site. Each lesson is a TypeScript content file that default-exports `defineLesson({...})`, which validates the lesson (zod plus cross-field rules plus the time budget) when it is imported, so a bad lesson fails the build. A React island (`LessonConsole`) plays a lesson. Scene state is always *derived* from `(position, eventIndex, tryItChoice)` by a pure function, so stepping backwards, jumping and rapid input can never desync. Static pages get small islands for progress, which they read from one versioned `localStorage` record.

**Tech Stack:** Astro (current stable), `@astrojs/react`, React, TypeScript (strict), zod, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`. Dev: Vitest, `@testing-library/react`, `@testing-library/user-event`, jsdom, Playwright, `@astrojs/check`.

**Spec:** `docs/superpowers/specs/2026-11-03-techconcepts-networking-launch-design.md`. Executors read the spec alongside this plan; section numbers (§) refer to it.

**Scope (plan 1 of 2):** This plan delivers a working preview with the 3 pilot lessons, which the spec says to build first to prove the engines (§8). **Plan 2** (written after the pilots are reviewed) covers:
- the other 16 lessons;
- Flow's *Layers view* and *Compare mode*;
- the IP Address playground;
- hex/byte views with header encoders;
- per-lesson share images;
- connecting `techconcepts.app`;
- the owner's content review and the launch checks.

Nothing in this plan should block those.

## Global Constraints

- Site name **TechConcepts**: one word, capital T and capital C, in every title, header and piece of copy. Domain `techconcepts.app`, which is HTTPS-only; never assume or link plain HTTP.
- Fully static output: no server code, no API routes, no database.
- Every lesson is ≤ 15 minutes. `estimateMinutes = ceil(words / 200 + 0.5 × steps + 2 + 1)`. The build **fails above 15** and **warns above 12** (§7.4).
- Lesson limits (§7.1): 4–6 steps; each step narrative ≤ 120 words; hook ≤ 80 words; 2–3 Check yourself questions; exactly 3 recap takeaways.
- No gamification anywhere: no points, scores, badges, flags, streaks, or words like "Mission complete!" (§3, §7.2). Check yourself is never scored or saved.
- Example network data (§5): public-looking hosts use `192.0.2.0/24`, `198.51.100.0/24` or `203.0.113.0/24`; private networks use RFC 1918 ranges; MAC addresses use `00:00:5E:00:53:xx`; `8.8.8.8` may appear by name.
- Not a Protocol Explorer clone (§4, §9). Use IBM Plex Sans for prose and IBM Plex Mono for data, never one monospace font everywhere. Do not reuse its colors (`#0b1020`, `#0f1628`, `#3c649f`, `#afc4f2`, `#1f5fe0`, `#00ef98`, `#f8b900`). No isometric artwork.
- Semantic color tokens, each with one meaning everywhere: `request`, `response`, `control`, `broadcast`, `allowed`, `blocked`, `encrypted`, `selected`. WCAG AA in both themes. **Color is never the only signal**: always add a label, icon or text.
- Reduced motion: messages jump straight to their destination, with no camera moves or travel animation (§9).
- Keyboard: Space plays or pauses, → / ← move between steps, Esc closes the inspector. Shortcuts are ignored while focus is in a form control or on a button or link (§10.3).
- Browser storage holds only `techconcepts:theme` and `techconcepts:v1` (progress). Every access goes through `SafeStorage`, and the site works fully when storage throws (§5, §10.5).
- Under ~200 KB of compressed JS per lesson page (§11). Allowed runtime dependencies: `astro`, `@astrojs/react`, `react`, `react-dom`, `zod`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`. Any other runtime dependency needs a written justification in the commit message.
- Node: `engines.node >=22`, and `.node-version` contains `24`.

## Review Focus

1. **Shortcuts while a control has focus:** typing a space in the subnet address field, arrowing the prefix slider, or pressing Space on a focused button. The control should behave normally and the lesson must not play, pause or change step. *Pinned in Task 12 (`shouldIgnoreShortcut`).*
2. **Malformed addresses in the subnet playground:** `192.168.1.256`, `192.168.1`, `192.168.01.1`, `abc`, `""`. Show the inline error, keep the last valid results visible, and never show NaN or crash. Surrounding spaces are trimmed and accepted. *Pinned in Task 2 (`parseIPv4`) and Task 9 (UI).*
3. **Corrupted or foreign saved progress:** invalid JSON, the wrong shape, negative or huge positions, unknown lessons. The data is treated as empty or clamped, and every page loads normally. *Pinned in Task 5.*
4. **Bad `?step=` links:** `?step=abc`, `?step=2.5` and `?step=-2` open the Overview; `?step=999` clamps to the Recap. *Pinned in Task 4 (`parseStepParam`).*
5. **Rapid input during playback:** mashing Next/Prev, clicking the outline mid-animation, or a timer firing after the learner has moved. The log and tables must always equal a fresh derivation of the current position, with no duplicate or missing rows. *Pinned in Task 4 (stale `tick` ignored, clamping).*

---

## File Structure

```
astro.config.mjs  tsconfig.json  vitest.config.ts  playwright.config.ts  package.json  .node-version  .gitignore  README.md
public/favicon.svg  public/og-default.png
src/
  styles/tokens.ts         semantic color tokens (both themes) + tokensToCss()
  styles/global.css        reset, type scale, base elements, .sr-only
  lib/storage.ts           SafeStorage wrapper
  lib/theme.ts             theme resolve/apply + inline boot script
  lib/contrast.ts          WCAG contrast ratio
  lib/format.ts            formatTime, formatBytes
  layouts/BaseLayout.astro html shell, meta, fonts, tokens, theme boot, analytics beacon
  components/SiteHeader.astro  components/SiteFooter.astro  components/ThemeToggle.tsx
  components/ContinueCard.tsx  components/TrackLessonList.tsx  components/ResetProgress.tsx
  engine/net/ipv4.ts  engine/net/subnet.ts  engine/net/firewall.ts
  engine/timeline.ts       sections, deriveState, labels, parseStepParam
  engine/playback.ts       playback reducer + usePlayback hook
  content/schema.ts        zod schemas + inferred types
  content/estimate.ts      word count + minutes
  content/define.ts        validateLesson, defineLesson, defineTrack
  content/certs.ts         CERT_TAGS
  content/registry.ts      track entries, summaries, neighbors
  content/test-fixtures.ts fixture lessons for tests
  content/helpers/packets.ts  ethernetLayer, ipv4Layer, udpLayer, dhcpLayer, packet
  content/tracks/networking.ts  content/tracks/index.ts
  content/lessons/networking/dhcp.ts  subnetting.ts  firewalls.ts
  progress/store.ts  progress/useProgress.ts
  scenes/flow/DeviceIcon.tsx  NetworkView.tsx  SequenceView.tsx  geometry.ts
  scenes/table/DeviceTablePanel.tsx
  scenes/inspector/Inspector.tsx
  scenes/playground/subnet/useSubnetPlayground.ts  SubnetCanvas.tsx  SubnetReadout.tsx
  lesson/LessonConsole.tsx  TopBar.tsx  Outline.tsx  ExplanationPanel.tsx  eventCard.ts
  lesson/TryItPanel.tsx  CheckYourself.tsx  RecapPanel.tsx  EventLog.tsx  PlaybackControls.tsx
  lesson/keyboard.ts  lesson/useReducedMotion.ts  lesson/console.css
  pages/index.astro  pages/[track]/index.astro  pages/[track]/[lesson].astro  pages/about.astro  pages/404.astro
e2e/lesson.spec.ts  e2e/site.spec.ts
docs/deploy.md
```

Unit and component tests sit next to their source as `*.test.ts(x)`. Component tests start with `// @vitest-environment jsdom`.

---

### Task 1: Site shell, themes and safe storage

**Files:**
- Create: everything at the root listed above, `public/favicon.svg`, `src/styles/*`, `src/lib/storage.ts`, `src/lib/theme.ts`, `src/lib/contrast.ts`, `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/ThemeToggle.tsx`, and a placeholder `src/pages/index.astro`
- Test: `src/lib/storage.test.ts`, `src/lib/theme.test.ts`, `src/styles/tokens.test.ts`

**Interfaces:**
- Produces:
  - `interface SafeStorage { readonly available: boolean; get(key: string): string | null; set(key: string, value: string): boolean; remove(key: string): void }`
  - `createSafeStorage(backing?: () => Storage | undefined): SafeStorage`. The default backing is `() => window.localStorage`. Every call is wrapped; any throw makes `get` return `null`, `set` return `false`, and `available` false.
  - `type Theme = 'light' | 'dark'`; `THEME_KEY = 'techconcepts:theme'`
  - `resolveTheme(saved: string | null, prefersDark: boolean): Theme`
  - `applyTheme(theme: Theme): void`, which sets `document.documentElement.dataset.theme`
  - `themeBootScript: string`, an inline `<head>` script that applies the theme before first paint
  - `type TokenName = 'bg'|'panel'|'panel-raised'|'line'|'line-strong'|'ink'|'ink-strong'|'ink-muted'|'request'|'response'|'control'|'broadcast'|'allowed'|'blocked'|'encrypted'|'selected'|'focus'`
  - `tokens: Record<Theme, Record<TokenName, string>>` (hex values)
  - `tokensToCss(): string`, which emits CSS custom properties `--<name>`
  - `contrastRatio(a: string, b: string): number`
  - `BaseLayout.astro` props `{ title: string; description: string; image?: string }`. The final `<title>` is `"${title} · TechConcepts"`, except Home, which passes `"TechConcepts"` and uses it as-is.

- [ ] **Step 1: Scaffold the project.**
  - `git init` in the project root (the owner approved this in spec §5).
  - Create the Astro project with the React integration and TypeScript `strict`.
  - Install the allowed dependencies and the dev tools listed in Tech Stack.
  - Add `"engines": {"node": ">=22"}`, `.node-version` (`24`), and `.gitignore` (`node_modules`, `dist`, `.astro`, `test-results`, `playwright-report`).
  - Add scripts:
    - `dev`: `astro dev`
    - `build`: `astro check && astro build`
    - `preview`: `astro preview`
    - `test`: `vitest run`
    - `e2e`: `playwright test`
  - Make `vitest.config.ts` wrap `getViteConfig` from `astro/config`, so `import.meta.glob` works in tests.
  - Write a `README.md` with these commands.

- [ ] **Step 2: Write the failing tests**

```ts
// src/lib/storage.test.ts
test('works with a real backing store', () => {
  const s = createSafeStorage(() => window.localStorage);
  expect(s.set('k', 'v')).toBe(true); expect(s.get('k')).toBe('v'); expect(s.available).toBe(true);
});
test('never throws when storage is blocked', () => {
  const s = createSafeStorage(() => { throw new DOMException('blocked', 'SecurityError'); });
  expect(s.available).toBe(false); expect(s.get('k')).toBeNull(); expect(s.set('k', 'v')).toBe(false);
  expect(() => s.remove('k')).not.toThrow();
});
test('set returns false when storage is full', () => {
  const full = { getItem: () => null, setItem: () => { throw new DOMException('full', 'QuotaExceededError'); }, removeItem() {} } as unknown as Storage;
  expect(createSafeStorage(() => full).set('k', 'v')).toBe(false);
});
// src/lib/theme.test.ts
test.each([['light', true, 'light'], ['dark', false, 'dark'], [null, true, 'dark'], [null, false, 'light'], ['bogus', true, 'dark']])(
  'resolveTheme(%s, %s) = %s', (saved, prefersDark, expected) => expect(resolveTheme(saved, prefersDark)).toBe(expected));
// src/styles/tokens.test.ts
test('contrastRatio sanity', () => expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0));
for (const theme of ['light', 'dark'] as const) {
  const t = tokens[theme];
  test(`${theme}: text tokens meet 4.5:1 on bg and panel`, () => {
    for (const ink of ['ink', 'ink-strong', 'ink-muted'] as const)
      for (const bg of ['bg', 'panel', 'panel-raised'] as const) expect(contrastRatio(t[ink], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
  test(`${theme}: semantic tokens meet 3:1 on panel`, () => {
    for (const k of ['request', 'response', 'control', 'broadcast', 'allowed', 'blocked', 'encrypted', 'selected', 'focus'] as const)
      expect(contrastRatio(t[k], t.panel)).toBeGreaterThanOrEqual(3);
  });
  test(`${theme}: no Protocol Explorer colors`, () => {
    const banned = ['#0b1020', '#0f1628', '#3c649f', '#afc4f2', '#1f5fe0', '#00ef98', '#f8b900'];
    expect(Object.values(t).map((v) => v.toLowerCase()).filter((v) => banned.includes(v))).toEqual([]);
  });
}
test('tokensToCss covers both themes and the no-JS fallback', () => {
  const css = tokensToCss();
  expect(css).toContain('[data-theme="dark"]'); expect(css).toContain('[data-theme="light"]');
  expect(css).toContain('prefers-color-scheme'); expect(css).toContain('--request:');
});
```

- [ ] **Step 3: Run** `npm test`. Expected: FAIL (modules not found).

- [ ] **Step 4: Implement** `storage.ts`, `theme.ts`, `contrast.ts` (WCAG 2.x relative luminance) and `tokens.ts`.
  - **Palette:** your choice within §9: calm, technical, dark by default. All 8 semantic hues must be clearly distinct from each other in both themes.
  - **`global.css`:** imports the fonts (Plex Sans 400/500/600, Plex Mono 400/500); sets the body in Plex Sans; uses Plex Mono for `code, kbd, .mono, table.data`; adds a visible `:focus-visible` ring using `--focus` and a `.sr-only` utility.
  - **`BaseLayout`:** inlines `tokensToCss()` and `themeBootScript` in `<head>`, and adds meta description and `og:title`/`og:description`/`og:image` (default `/og-default.png`).
  - **Header and footer:** `SiteHeader` shows the wordmark linking to `/` plus `ThemeToggle`. `SiteFooter` links to About and shows the theme toggle.
  - **`ThemeToggle`:** a two-button segmented control with `aria-pressed`, which writes `THEME_KEY` through `SafeStorage`.

- [ ] **Step 5: Run** `npm test && npm run build`. Expected: all PASS; the build emits `dist/index.html`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: site shell with themes, tokens and safe storage"
```

---

### Task 2: IPv4 and subnet math

**Files:**
- Create: `src/engine/net/ipv4.ts`, `src/engine/net/subnet.ts`
- Test: `src/engine/net/ipv4.test.ts`, `src/engine/net/subnet.test.ts`

**Interfaces:**
- Produces:
  - `type IPv4 = number` (unsigned 32-bit; always normalise with `>>> 0`)
  - `type ParseResult = { ok: true; value: IPv4 } | { ok: false; error: string }`
  - `IPV4_ERROR = 'Not a valid IPv4 address. Use four numbers from 0 to 255, like 192.168.1.10.'`
  - `parseIPv4(input: string): ParseResult`: trims input; requires exactly 4 decimal octets 0–255; rejects leading zeros (`01`), signs, empty parts and non-ASCII digits.
  - `formatIPv4(ip: IPv4): string`
  - `toOctetBits(ip: IPv4): [string, string, string, string]`
  - `cidrContains(cidr: string, ip: string): boolean`: throws `Error` on an invalid CIDR.
  - `interface SubnetInfo { prefix: number; mask: IPv4; network: IPv4; broadcast: IPv4; firstHost: IPv4; lastHost: IPv4; usableHosts: number; totalAddresses: number }`
  - `maskFromPrefix(prefix: number): IPv4`
  - `subnetInfo(ip: IPv4, prefix: number): SubnetInfo`: throws `RangeError` unless `prefix` is an integer from 0 to 32. Per RFC 3021, `/31` has 2 usable hosts (first = network, last = broadcast). `/32` has 1 (first = last = the address).
  - `sameSubnet(a: IPv4, b: IPv4, prefix: number): boolean`

- [ ] **Step 1: Write the failing tests**

```ts
const ip = (s: string) => { const r = parseIPv4(s); if (!r.ok) throw new Error(s); return r.value; };
test('parses and formats', () => {
  expect(parseIPv4('192.168.1.10')).toEqual({ ok: true, value: 3232235786 });
  expect(parseIPv4('  10.0.0.1 ')).toEqual({ ok: true, value: 167772161 });
  expect(formatIPv4(4294967295)).toBe('255.255.255.255');
  expect(formatIPv4(0)).toBe('0.0.0.0');
});
test.each(['192.168.1.256', '192.168.1', '192.168.01.1', '1.2.3.4.5', '', 'abc', '1..2.3', '-1.2.3.4', '+1.2.3.4', '1.2.3.4 5', '١.2.3.4'])(
  'rejects %j with the standard message', (s) => expect(parseIPv4(s)).toEqual({ ok: false, error: IPV4_ERROR }));
test('octet bits', () => expect(toOctetBits(ip('192.168.1.10'))).toEqual(['11000000', '10101000', '00000001', '00001010']));
test('cidrContains', () => {
  expect(cidrContains('198.51.100.0/24', '198.51.100.7')).toBe(true);
  expect(cidrContains('198.51.100.7/32', '198.51.100.8')).toBe(false);
  expect(() => cidrContains('198.51.100.0/33', '198.51.100.7')).toThrow();
});
test.each([
  ['192.168.1.10', 24, '255.255.255.0', '192.168.1.0', '192.168.1.255', '192.168.1.1', '192.168.1.254', 254, 256],
  ['192.168.1.70', 26, '255.255.255.192', '192.168.1.64', '192.168.1.127', '192.168.1.65', '192.168.1.126', 62, 64],
  ['10.0.0.5', 30, '255.255.255.252', '10.0.0.4', '10.0.0.7', '10.0.0.5', '10.0.0.6', 2, 4],
  ['172.16.5.4', 16, '255.255.0.0', '172.16.0.0', '172.16.255.255', '172.16.0.1', '172.16.255.254', 65534, 65536],
  ['10.0.0.4', 31, '255.255.255.254', '10.0.0.4', '10.0.0.5', '10.0.0.4', '10.0.0.5', 2, 2],
  ['10.0.0.4', 32, '255.255.255.255', '10.0.0.4', '10.0.0.4', '10.0.0.4', '10.0.0.4', 1, 1],
  ['8.8.8.8', 0, '0.0.0.0', '0.0.0.0', '255.255.255.255', '0.0.0.1', '255.255.255.254', 4294967294, 4294967296],
])('subnetInfo(%s/%i)', (addr, p, mask, net, bc, first, last, usable, total) => {
  const i = subnetInfo(ip(addr), p);
  expect([i.mask, i.network, i.broadcast, i.firstHost, i.lastHost].map(formatIPv4)).toEqual([mask, net, bc, first, last]);
  expect([i.usableHosts, i.totalAddresses]).toEqual([usable, total]);
});
test.each([33, -1, 24.5, NaN])('subnetInfo rejects prefix %s', (p) => expect(() => subnetInfo(ip('10.0.0.1'), p)).toThrow(RangeError));
test('sameSubnet', () => {
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 26)).toBe(false);
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 24)).toBe(true);
});
```

- [ ] **Step 2: Run** `npx vitest run src/engine/net`. Expected: FAIL.
- [ ] **Step 3: Implement both modules** to the interfaces above.
- [ ] **Step 4: Run** `npx vitest run src/engine/net`. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -am "feat: IPv4 and subnet math"` (after `git add src/engine/net`).

---

### Task 3: Content model, validation, estimate and registry

**Files:**
- Create: `src/content/schema.ts`, `estimate.ts`, `define.ts`, `certs.ts`, `registry.ts`, `test-fixtures.ts`, `tracks/networking.ts`, `tracks/index.ts`
- Test: `src/content/define.test.ts`, `src/content/estimate.test.ts`, `src/content/registry.test.ts`

**Interfaces:**
- Produces these types, defined as zod schemas in `schema.ts` and exported as `z.infer` types. `LessonInput = z.input<typeof lessonSchema>`.

```ts
type MessageKind = 'request' | 'response' | 'control' | 'broadcast' | 'encrypted';
type ActorKind = 'laptop'|'phone'|'switch'|'router'|'server'|'dns-server'|'firewall'|'proxy'|'load-balancer'|'vpn-gateway'|'access-point'|'internet';
interface Fact { label: string; value: string }
interface Actor { id: string; kind: ActorKind; label: string; addresses: string[]; x: number; y: number } // x 0–1000, y 0–600
interface Link { id: string; from: string; to: string; medium: 'wired' | 'wireless' | 'tunnel' }
type Row = Record<string, string>;
interface TableDef { id: string; actor: string; title: string; columns: { key: string; label: string }[]; keyColumn: string; initialRows: Row[] }
interface Field { name: string; value: string; explain?: string; example?: boolean }
interface Layer { name: string; size: number; summary: string; fields: Field[]; declaredLength?: number }
interface Packet { name: string; summary: string; seenAt?: string; size: number; layers: Layer[] }
interface MessageEvent { type: 'message'; id: string; from: string; to: string[]; via?: string[]; src: string; dst: string;
  protocol: string; kind: MessageKind; label: string; summary: string; size: number; time: number;
  outcome?: 'delivered' | 'dropped'; packet?: string }            // outcome defaults to 'delivered'
interface TableEvent { type: 'table'; id: string; table: string; op: 'add'|'update'|'remove'|'match'|'clear'|'replace';
  row?: Row; rows?: Row[]; key?: string; summary: string }       // add: row; update: key+row (merge); remove/match: key; replace: rows
type SceneEvent = MessageEvent | TableEvent;
interface FlowScene { type: 'flow'; views: ('network' | 'sequence')[]; actors: Actor[]; links: Link[]; tables: TableDef[];
  packets: Record<string, Packet>; legend: { kind: MessageKind | 'dropped'; label: string }[] }
interface PlaygroundPreset { address: string; prefix: number; compare?: string }
interface PlaygroundScene { type: 'playground'; playground: 'subnet' }
interface Step { id: string; title: string; subtitle: string; narrative: string; facts: Fact[]; events: SceneEvent[]; preset?: PlaygroundPreset }
type TryIt = { mode: 'choices'; prompt: string; choices: { id: string; label: string; events: SceneEvent[]; explanation: string }[] }
           | { mode: 'free'; prompt: string; explanation: string };
interface Question { id: string; prompt: string; options: string[]; answer: number; explanation: string }
interface Lesson { slug: string; title: string; subtitle: string; level: 'beginner' | 'intermediate' | 'advanced'; osiLayers: number[];
  certTags: CertTag[]; summary: string; references: { label: string; url: string }[];
  overview: { hook: string; name: string; fullName: string; description: string; facts: Fact[] };
  scene: FlowScene | PlaygroundScene; steps: Step[]; tryIt: TryIt; check: Question[]; recap: { takeaways: string[] } }
interface Part { id: string; title: string; lessons: { slug: string; title: string }[] }
interface Track { id: string; title: string; description: string; level: Lesson['level']; parts: Part[] }
```

- Also produces:
  - `CERT_TAGS = { 'a-plus': 'CompTIA A+', 'network-plus': 'CompTIA Network+', 'security-plus': 'CompTIA Security+', 'cysa-plus': 'CompTIA CySA+', 'ccna': 'Cisco CCNA', 'helpdesk': 'Helpdesk', 'soc-analyst': 'SOC Analyst' } as const`; `type CertTag = keyof typeof CERT_TAGS`. The keys are also the `?for=` values.
  - `countLessonWords(l: Lesson): number`, which counts: overview hook and description; every step narrative; the Try it prompt and every choice explanation (or the free explanation); every question prompt, option and explanation; the takeaways. Words are whitespace-separated tokens.
  - `estimateMinutes(l: Lesson): number`, using the formula in Global Constraints.
  - `class LessonValidationError extends Error { issues: string[] }`
  - `validateLesson(input: unknown): { lesson: Lesson; warnings: string[] }`, which throws `LessonValidationError` listing every issue at once.
  - `defineLesson(input: LessonInput): Lesson`, which calls `validateLesson`, `console.warn`s the warnings, and returns the lesson.
  - `defineTrack(t: Track): Track`, which validates shape and unique slugs.
  - `networkingTrack: Track`, with `id: 'networking'`, `title: 'Networking Concepts'` and `level: 'beginner'`. Its parts, in order, are below. Each lesson entry is `{ slug, title }`, with titles exactly as in spec §8.
    - `big-picture` "The big picture": `osi-model`, `packets`
    - `local-network` "Addresses & the local network": `ip-address`, `mac-address`, `switch`, `arp`
    - `between-networks` "Getting between networks": `subnetting`, `router`, `dhcp`
    - `across-internet` "Talking across the internet": `ports`, `tcp-udp`, `nat`, `dns`
    - `web` "The web": `http-https`, `tls`
    - `protect-scale` "Protecting & scaling traffic": `firewalls`, `proxies`, `load-balancers`, `vpn`
  - `tracks: Track[]`
  - `comingSoonTracks: { title: string; blurb: string }[]`, with the titles from §10.1: How the Web Works, Cryptography, AI Concepts, Privilege Escalation, Threat & Vulnerability Management.
  - `type LessonSummary = { available: true; key: string; trackId: string; slug: string; url: string; number: number; title: string; partTitle: string; summary: string; minutes: number; certTags: CertTag[]; stepCount: number; maxPosition: number } | { available: false; key: string; trackId: string; slug: string; number: number; title: string; partTitle: string }`
  - `type AvailableSummary = Extract<LessonSummary, { available: true }>`
  - `buildEntries(track: Track, lessons: Record<string, Lesson>): LessonSummary[]` (pure). `key = "${trackId}/${slug}"`, `url = "/${trackId}/${slug}"`, `number` is 1-based across all parts, and `maxPosition = stepCount + 3`. It throws if a lesson's title differs from its track entry or if a lesson slug is not in the track.
  - `neighbors(entries: LessonSummary[], slug: string): { prev: AvailableSummary | null; next: AvailableSummary | null; nextPlanned: boolean }`. `prev` and `next` are the nearest *available* lessons. `nextPlanned` is true when the immediately following entry exists but is unavailable.
  - `trackTotals(entries: LessonSummary[]): { available: number; planned: number; minutes: number }`
  - Module-level wiring: lessons are loaded with `import.meta.glob('./lessons/*/*.ts', { eager: true, import: 'default' })`. The folder name is the track id, and the file name must equal the slug. This provides `getTrack(id)`, `getEntries(trackId)` and `getLesson(trackId, slug)`.
  - `fixtureLesson(overrides?: Partial<LessonInput>): LessonInput`: a valid flow lesson whose prose totals under 300 words. It contains:
    - actors `a` and `b`, and link `a-b`;
    - one table `t` on `b` (columns `ip`, `mac`; key `ip`);
    - packet `p1` (2 layers, 14 + 20 bytes);
    - 4 steps, each with 2 facts. Step 1 has a message `m1` (a→b, `packet: 'p1'`, size 34). Step 2 has, in this order, messages `m2` and `m3`, then a table `add`. Step 3 has a table `match`. Step 4 has a dropped message `m4`.
    - a `choices` Try it with choice ids `c1` and `c2`, 2 questions and 3 takeaways.
  - `fixturePlaygroundLesson(): LessonInput`: a valid playground lesson with 4 steps, each with a preset and 2 facts.

**Cross-field rules enforced by `validateLesson`** (each one fails with a readable issue):
- Step count is 4–6; step ids are unique; each step has 2–4 facts; narrative ≤ 120 words; hook ≤ 80 words.
- 2–3 questions, each with 2–4 options and `answer` in range. Exactly 3 takeaways. At least 1 reference and at least 1 cert tag.
- **Flow scenes:**
  - Actor, link, table and event ids are unique.
  - Link endpoints, event `from`/`to`/`via` and table `actor` reference existing actors.
  - Table events reference existing tables, and `key`/`row`/`rows` are present for their `op`.
  - `packet` references an existing packet. A packet's `size` equals the sum of its layer sizes and equals the `size` of every message referencing it.
  - Every step has ≥ 1 event and no `preset`. Try it is `choices` with 2–4 choices.
- **Playground scenes:** every step has a `preset` and no events. Preset `prefix` is 16–30, and `address`/`compare` parse with `parseIPv4`. Try it is `free`.
- `estimateMinutes > 15` is an error; `> 12` is a warning.

- [ ] **Step 1: Write the failing tests**

```ts
// define.test.ts
test('fixtures are valid', () => { expect(() => validateLesson(fixtureLesson())).not.toThrow(); expect(() => validateLesson(fixturePlaygroundLesson())).not.toThrow(); });
const issuesOf = (input: unknown) => { try { validateLesson(input); return []; } catch (e) { return (e as LessonValidationError).issues; } };
test('rejects too few steps', () => { const l = fixtureLesson(); l.steps = l.steps.slice(0, 3); expect(issuesOf(l).join()).toMatch(/4–6 steps/); });
test('rejects long narrative', () => { const l = fixtureLesson(); l.steps[0].narrative = 'word '.repeat(121); expect(issuesOf(l).join()).toMatch(/120 words/); });
test('rejects unknown actor in event', () => { const l = fixtureLesson(); (l.steps[0].events[0] as any).to = ['ghost']; expect(issuesOf(l).join()).toMatch(/ghost/); });
test('rejects unknown table', () => { const l = fixtureLesson(); (l.steps[1].events[2] as any).table = 'nope'; expect(issuesOf(l).join()).toMatch(/nope/); });
test('rejects packet size mismatch', () => { const l = fixtureLesson(); (l.steps[0].events[0] as any).size = 99; expect(issuesOf(l).join()).toMatch(/size/); });
test('rejects answer out of range', () => { const l = fixtureLesson(); l.check[0].answer = 9; expect(issuesOf(l).length).toBeGreaterThan(0); });
test('rejects playground preset outside /16–/30', () => { const l = fixturePlaygroundLesson(); l.steps[0].preset!.prefix = 31; expect(issuesOf(l).join()).toMatch(/16/); });
test('rejects a lesson over 15 minutes', () => {
  const l = fixtureLesson(); l.check.forEach((q) => (q.explanation = 'word '.repeat(1000))); expect(issuesOf(l).join()).toMatch(/15 minutes/);
});
test('warns above 12 minutes', () => {
  const l = fixtureLesson(); l.check[0].explanation = 'word '.repeat(1250); expect(validateLesson(l).warnings.join()).toMatch(/12/);
});
// estimate.test.ts: fixed overhead = 0.5×steps + 2 + 1
test('estimate formula', () => {
  const l = validateLesson(fixtureLesson()).lesson; const w = countLessonWords(l);
  expect(estimateMinutes(l)).toBe(Math.ceil(w / 200 + 0.5 * l.steps.length + 3));
});
// registry.test.ts
test('networking track lists 19 lessons in spec order', () => {
  const e = buildEntries(networkingTrack, {});
  expect(e.map((x) => x.slug)).toEqual(['osi-model','packets','ip-address','mac-address','switch','arp','subnetting','router','dhcp','ports','tcp-udp','nat','dns','http-https','tls','firewalls','proxies','load-balancers','vpn']);
  expect(e.map((x) => x.number)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
  expect(e.every((x) => !x.available)).toBe(true);
});
test('neighbors skip unavailable lessons', () => {
  const dhcp = validateLesson({ ...fixtureLesson(), slug: 'dhcp', title: 'DHCP' }).lesson;
  const fw = validateLesson({ ...fixtureLesson(), slug: 'firewalls', title: 'Firewalls' }).lesson;
  const e = buildEntries(networkingTrack, { dhcp, firewalls: fw });
  expect(neighbors(e, 'dhcp')).toMatchObject({ prev: null, next: { slug: 'firewalls' }, nextPlanned: true });
  expect(e.find((x) => x.slug === 'dhcp')).toMatchObject({ available: true, number: 9, url: '/networking/dhcp', maxPosition: 7 });
});
test('title mismatch with track throws', () => {
  const bad = validateLesson({ ...fixtureLesson(), slug: 'dhcp', title: 'Wrong' }).lesson;
  expect(() => buildEntries(networkingTrack, { dhcp: bad })).toThrow(/title/);
});
```

- [ ] **Step 2: Run** `npx vitest run src/content`. Expected: FAIL.
- [ ] **Step 3: Implement** `schema.ts`, `estimate.ts`, `define.ts`, `certs.ts`, `registry.ts`, `test-fixtures.ts` and the track files to the interfaces above. Issue messages must contain the phrases the tests match ("4–6 steps", "120 words", "15 minutes", "12").
- [ ] **Step 4: Run** `npx vitest run src/content`. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/content && git commit -m "feat: lesson content model, validation and registry"`

---

### Task 4: Timeline derivation and playback

**Files:**
- Create: `src/engine/timeline.ts`, `src/engine/playback.ts`
- Test: `src/engine/timeline.test.ts`, `src/engine/playback.test.ts`

**Interfaces:**
- Consumes: `Lesson`, `SceneEvent`, `MessageEvent`, `Row` (Task 3); `fixtureLesson` (Task 3).
- Produces:
  - `type Position = number`. 0 is the Overview, 1..n are the steps, then n+1 is Try it, n+2 is Check, n+3 is Recap.
  - `interface Sections { stepCount: number; tryIt: number; check: number; recap: number; max: number }`
  - `sectionsFor(stepCount: number): Sections`
  - `positionLabel(lesson: Lesson, p: Position): string`, returning `'Overview'`, the step's `title`, `'Try it'`, `'Check yourself'` or `'Recap'`
  - `resumeLabel(p: Position, stepCount: number): string`, returning `'step 3 of 6'`, `'Try it'`, `'Check yourself'` or `'Recap'`
  - `interface LogRow { n: number; eventId: string; time: number; src: string; dst: string; protocol: string; label: string; summary: string; size: number; kind: MessageKind; outcome: 'delivered' | 'dropped'; packet?: string; tableChange?: string }`
  - `interface TableState { rows: Row[]; highlight: { key: string; type: 'added' | 'updated' | 'matched' } | null }`
  - `interface DerivedState { log: LogRow[]; tables: Record<string, TableState>; activeMessage: MessageEvent | null; messageTotal: number }`
  - `currentEvents(lesson: Lesson, p: Position, tryItChoice: string | null): SceneEvent[]`, which gives the events of step p, the chosen Try it variant at `tryIt`, or `[]`.
  - `deriveState(lesson: Lesson, p: Position, eventIndex: number, tryItChoice: string | null): DerivedState`
  - `parseStepParam(search: string, s: Sections): Position | null`
  - `interface PlaybackState { position: Position; eventIndex: number; playing: boolean; speed: 0.5 | 1 | 2; tryItChoice: string | null }`
  - `type PlaybackAction = { type: 'play' } | { type: 'pause' } | { type: 'toggle' } | { type: 'tick'; position: Position } | { type: 'next' } | { type: 'prev' } | { type: 'jump'; position: Position } | { type: 'replay' } | { type: 'speed'; speed: 0.5 | 1 | 2 } | { type: 'chooseTryIt'; choiceId: string }`
  - `initialPlayback(): PlaybackState`, which starts at position 0, eventIndex 0, paused, speed 1 and no choice
  - `createPlaybackReducer(lesson: Lesson): (s: PlaybackState, a: PlaybackAction) => PlaybackState`
  - `EVENT_DURATION_MS = { message: 1200, table: 700 } as const`
  - `usePlayback(lesson: Lesson): [PlaybackState, React.Dispatch<PlaybackAction>]`. While playing, it schedules one `setTimeout(EVENT_DURATION_MS[next.type] / speed)` that dispatches `tick` with the position captured at scheduling time. It clears the timer on every state change and on unmount.

**Derivation semantics** (the code must match these):
- **Applied events:** the events of steps 1..min(p−1, n) in full, plus `currentEvents(...)[0..eventIndex)`. At positions ≥ Check, all n steps are applied and the Try it variant is not.
- **Tables:** start from `initialRows`, then apply the ops. `highlight` comes from the last table event applied *within `currentEvents`* (`add` → `added`, `update` → `updated`, `match` → `matched`). It is `null` if no current table event has been applied.
- **Log:** one row per applied message, numbered `n` from 1. A table event's `summary` is appended (joined with `'; '`) to the `tableChange` of the most recent log row. If there is no row yet, it is ignored in the log but still applied to the table.
- **`activeMessage`:** the last applied message within `currentEvents`, else `null`.
- **`messageTotal`:** the number of messages across all steps (excluding Try it).
- **`parseStepParam`:** reads `step`. A non-integer or a value below 0 gives `null`. Otherwise the value is clamped to `s.max`.

**Reducer rules:**
- **`play`:** if `eventIndex < currentEvents.length`, set `playing: true`. Otherwise, if `position < max`, behave as `next`; at `max`, do nothing.
- **`pause`** sets `playing: false`. **`toggle`** acts as `pause` when playing, otherwise as `play`.
- **`tick`:** ignored unless `playing` and `a.position === position`. Otherwise `eventIndex + 1`, and `playing` becomes false when `eventIndex` reaches the end.
- **`next`:** position = `min(max, position + 1)`, `eventIndex: 0`, `playing` = whether the new position has events.
- **`jump`:** the same as `next`, but to the clamped `a.position`.
- **`prev`:** position = `max(0, position − 1)`, `eventIndex` = the length of that position's events, `playing: false`.
- **`replay`:** `eventIndex: 0`, `playing` = whether the position has events.
- **`chooseTryIt`:** valid only at `tryIt` with `mode: 'choices'` and a known id. Sets `tryItChoice`, `eventIndex: 0`, `playing: true`. Any position change resets `tryItChoice` to `null`.
- **`speed`:** sets the speed only.

- [ ] **Step 1: Write the failing tests**

```ts
const L = validateLesson(fixtureLesson()).lesson; const S = sectionsFor(4); const r = createPlaybackReducer(L);
test('sections', () => expect(S).toEqual({ stepCount: 4, tryIt: 5, check: 6, recap: 7, max: 7 }));
test('labels', () => { expect(resumeLabel(3, 6)).toBe('step 3 of 6'); expect(resumeLabel(7, 6)).toBe('Try it'); expect(positionLabel(L, 0)).toBe('Overview'); });
test('overview is empty', () => expect(deriveState(L, 0, 0, null)).toMatchObject({ log: [], activeMessage: null, messageTotal: 4 }));
test('mid-step derivation', () => {
  const d = deriveState(L, 2, 3, null); // step1 full + m2, m3, table add
  expect(d.log.map((x) => x.eventId)).toEqual(['m1', 'm2', 'm3']); expect(d.log[2].tableChange).toBeTruthy();
  expect(d.tables.t.rows).toHaveLength(1); expect(d.tables.t.highlight?.type).toBe('added'); expect(d.activeMessage?.id).toBe('m3');
});
test('highlight only for current-step table events', () => expect(deriveState(L, 3, 0, null).tables.t.highlight).toBeNull());
test('dropped outcome carried into log', () => expect(deriveState(L, 4, 1, null).log.at(-1)?.outcome).toBe('dropped'));
test('check/recap show end-of-steps state without try-it', () => expect(deriveState(L, 6, 0, 'c1').log).toHaveLength(4));
test.each([['?step=abc', null], ['?step=2.5', null], ['?step=-2', null], ['?step=3', 3], ['?step=999', 7], ['', null]])(
  'parseStepParam(%j)', (q, want) => expect(parseStepParam(q as string, S)).toBe(want));
test('stale tick is ignored', () => {
  let s = r(initialPlayback(), { type: 'next' });   // position 1, playing
  s = r(s, { type: 'jump', position: 3 });
  expect(r(s, { type: 'tick', position: 1 })).toEqual(s);
});
test('tick advances and pauses at the step boundary', () => {
  let s = r(initialPlayback(), { type: 'next' }); s = r(s, { type: 'tick', position: 1 });
  expect(s).toMatchObject({ position: 1, eventIndex: 1, playing: false });
});
test('mashing next/prev clamps and matches fresh derivation', () => {
  let s = initialPlayback(); for (let i = 0; i < 20; i++) s = r(s, { type: 'next' });
  expect(s.position).toBe(7); for (let i = 0; i < 20; i++) s = r(s, { type: 'prev' }); expect(s.position).toBe(0);
  s = r(s, { type: 'jump', position: 2 }); s = r(s, { type: 'prev' });
  expect(deriveState(L, s.position, s.eventIndex, s.tryItChoice)).toEqual(deriveState(L, 1, 1, null));
});
test('play at a step boundary moves on', () => expect(r(initialPlayback(), { type: 'play' })).toMatchObject({ position: 1, playing: true }));
test('try-it choice only at try-it position and resets on leave', () => {
  expect(r(initialPlayback(), { type: 'chooseTryIt', choiceId: 'c1' }).tryItChoice).toBeNull();
  let s = r(initialPlayback(), { type: 'jump', position: 5 }); s = r(s, { type: 'chooseTryIt', choiceId: 'c1' });
  expect(s).toMatchObject({ tryItChoice: 'c1', playing: true }); expect(r(s, { type: 'next' }).tryItChoice).toBeNull();
});
```

- [ ] **Step 2: Run** `npx vitest run src/engine`. Expected: FAIL.
- [ ] **Step 3: Implement** `timeline.ts` and `playback.ts` to the semantics above.
- [ ] **Step 4: Run** `npx vitest run src/engine`. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/engine && git commit -m "feat: timeline derivation and playback reducer"`

---

### Task 5: Browser-only progress

**Files:**
- Create: `src/progress/store.ts`, `src/progress/useProgress.ts`
- Test: `src/progress/store.test.ts`, `src/progress/useProgress.test.tsx`

**Interfaces:**
- Consumes: `SafeStorage`, `createSafeStorage` (Task 1).
- Produces:
  - `PROGRESS_KEY = 'techconcepts:v1'`
  - `interface LessonProgress { status: 'in-progress' | 'finished'; furthestPosition: number; lastOpened: string }`, where `lastOpened` is an ISO string
  - `interface ProgressData { version: 1; lessons: Record<string, LessonProgress>; lastLesson: string | null }`
  - `emptyProgress(): ProgressData`
  - `parseProgress(raw: string | null): ProgressData`. Invalid JSON, a wrong shape or a version other than `1` gives empty data. Individual malformed lesson records are dropped.
  - `sanitizeProgress(d: ProgressData, known: Record<string, number>): ProgressData`. `known` maps keys to `maxPosition`. It drops unknown keys, clamps `furthestPosition` to `[1, max]`, and nulls `lastLesson` if it is unknown.
  - `recordVisit(d: ProgressData, key: string, position: number, maxPosition: number, now: Date): ProgressData` (pure):
    - always sets `lastLesson = key`;
    - for position ≥ 1, creates or updates the record: `furthestPosition = max(old, position)`, status `finished` when position === maxPosition, and once finished it stays finished;
    - updates `lastOpened` whenever a record exists.
  - `resumePosition(d: ProgressData, key: string): number | null`, which returns `furthestPosition` when the status is `in-progress`, else `null`
  - `trackCompletion(d: ProgressData, keys: string[]): { finished: number; inProgress: number }`
  - `loadProgress(s: SafeStorage): ProgressData`, `saveProgress(s: SafeStorage, d: ProgressData): boolean`, `clearProgress(s: SafeStorage): void`
  - `useProgress(known: Record<string, number>): { ready: boolean; available: boolean; data: ProgressData; update(fn: (d: ProgressData) => ProgressData): void; reset(): void }`. It loads `sanitizeProgress(loadProgress(s), known)`, and `update` saves the result. `ready` stays false until mounted, so the server render shows no progress. The hook reloads on `storage` events for `PROGRESS_KEY`. Callers build `known` from their summaries as `{ [entry.key]: entry.maxPosition }`.

- [ ] **Step 1: Write the failing tests**

```ts
const now = new Date('2026-11-03T12:00:00Z');
test.each([null, '', 'not json', '[]', '{"version":2,"lessons":{}}', '{"version":1,"lessons":"x"}'])('parseProgress(%j) is empty', (raw) =>
  expect(parseProgress(raw)).toEqual(emptyProgress()));
test('drops malformed lesson records', () => {
  const raw = JSON.stringify({ version: 1, lastLesson: 'networking/dhcp', lessons: { 'networking/dhcp': { status: 'in-progress', furthestPosition: 2, lastOpened: now.toISOString() }, bad: { status: 'x' } } });
  expect(Object.keys(parseProgress(raw).lessons)).toEqual(['networking/dhcp']);
});
test('sanitize clamps and ignores unknown', () => {
  const d = { version: 1 as const, lastLesson: 'gone/x', lessons: { 'networking/dhcp': { status: 'in-progress' as const, furthestPosition: 999, lastOpened: '' }, 'gone/x': { status: 'finished' as const, furthestPosition: 3, lastOpened: '' }, 'networking/subnetting': { status: 'in-progress' as const, furthestPosition: -4, lastOpened: '' } } };
  const s = sanitizeProgress(d, { 'networking/dhcp': 8, 'networking/subnetting': 9 });
  expect(s.lessons['networking/dhcp'].furthestPosition).toBe(8); expect(s.lessons['networking/subnetting'].furthestPosition).toBe(1);
  expect(s.lessons['gone/x']).toBeUndefined(); expect(s.lastLesson).toBeNull();
});
test('visit lifecycle', () => {
  let d = recordVisit(emptyProgress(), 'networking/dhcp', 0, 8, now);
  expect(d.lastLesson).toBe('networking/dhcp'); expect(d.lessons['networking/dhcp']).toBeUndefined();
  d = recordVisit(d, 'networking/dhcp', 3, 8, now); expect(resumePosition(d, 'networking/dhcp')).toBe(3);
  d = recordVisit(d, 'networking/dhcp', 2, 8, now); expect(d.lessons['networking/dhcp'].furthestPosition).toBe(3);
  d = recordVisit(d, 'networking/dhcp', 8, 8, now); expect(d.lessons['networking/dhcp'].status).toBe('finished');
  d = recordVisit(d, 'networking/dhcp', 1, 8, now); expect(d.lessons['networking/dhcp'].status).toBe('finished');
  expect(resumePosition(d, 'networking/dhcp')).toBeNull();
  expect(trackCompletion(d, ['networking/dhcp', 'networking/arp'])).toEqual({ finished: 1, inProgress: 0 });
});
test('blocked storage: load is empty, save is false', () => {
  const s = createSafeStorage(() => { throw new Error('blocked'); });
  expect(loadProgress(s)).toEqual(emptyProgress()); expect(saveProgress(s, emptyProgress())).toBe(false);
});
// useProgress.test.tsx (jsdom): with blocked storage, available=false; after a 'storage' event with a new
// PROGRESS_KEY value, data reflects it; reset() clears the key and data equals emptyProgress().
```

- [ ] **Step 2: Run** `npx vitest run src/progress`. Expected: FAIL.
- [ ] **Step 3: Implement** `store.ts` and `useProgress.ts`.
- [ ] **Step 4: Run** `npx vitest run src/progress`. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/progress && git commit -m "feat: browser-only learning progress"`

---

### Task 6: Flow scene views (network and sequence)

**Files:**
- Create: `src/lib/format.ts`, `src/scenes/flow/geometry.ts`, `DeviceIcon.tsx`, `NetworkView.tsx`, `SequenceView.tsx`
- Test: `src/lib/format.test.ts`, `src/scenes/flow/geometry.test.ts`, `NetworkView.test.tsx`, `SequenceView.test.tsx`

**Interfaces:**
- Consumes: `FlowScene`, `Actor`, `ActorKind`, `MessageEvent` (Task 3); `DerivedState`, `LogRow` (Task 4).
- Produces:
  - `pathFor(scene: FlowScene, msg: MessageEvent, to: string): { x: number; y: number }[]`. The path runs from the `from` actor, through the `via` actors, to `to`, as points in the 1000×600 viewBox.
  - `DeviceIcon({ kind }: { kind: ActorKind })`: an original 1.5 px-stroke line SVG on a 48 px grid, theme-aware via `currentColor`, with one icon per `ActorKind`.
  - `NetworkView({ scene, state, reducedMotion, onOpenPacket }: { scene: FlowScene; state: DerivedState; reducedMotion: boolean; onOpenPacket(packetId: string): void })`:
    - an SVG with `viewBox="0 0 1000 600"` and `role="img"`, with an `aria-label` naming the actors;
    - links drawn as lines (wireless dashed, tunnel double);
    - each actor as an icon, a label and its addresses;
    - one chip per `to` target for `state.activeMessage`, coloured by `--<kind>` (or `--blocked` when dropped);
    - each chip has the attributes `data-kind` and `data-outcome`, and visible label text. A dropped chip also shows the text "Dropped".
    - The chip animates along `pathFor`, unless `reducedMotion` is on, in which case it is placed at the destination.
    - A chip whose message has a `packet` is a `<button>` that calls `onOpenPacket`.
  - `SequenceView({ scene, state, onOpenPacket })`: lifelines in `scene.actors` order, each headed by a label and its first address. There is one arrow per `state.log` row, labeled with `row.label` and a time from `formatTime`.
  - `formatTime(seconds: number): string`, with three decimals and a trailing `s` (`0.024s`, `43200.000s`)
  - `formatBytes(n: number): string`: `342 B` below 1024, otherwise one decimal in KB (`12.8 KB`)

- [ ] **Step 1: Write the failing tests**
  - `format`: `formatTime(0.024)` is `'0.024s'`; `formatTime(43200)` is `'43200.000s'`; `formatBytes(342)` is `'342 B'`; `formatBytes(13107)` is `'12.8 KB'`.
  - `geometry`: for actors `a(0,0)`, `r(500,0)`, `b(1000,300)` and a message a→b via `[r]`, `pathFor` returns `[{0,0},{500,0},{1000,300}]`.
  - `NetworkView`:
    - renders every actor label and address from the fixture;
    - with `deriveState(L, 1, 1, null)`, renders one chip with `data-kind` equal to `m1`'s kind and its label text;
    - clicking that chip calls `onOpenPacket('p1')`;
    - with the dropped message active, the chip has `data-outcome="dropped"` and the text "Dropped";
    - with `reducedMotion`, the chip carries `data-animated="false"`.
  - `SequenceView`: with `deriveState(L, 3, 0, null)`, there are as many `[data-arrow]` elements as log rows, each showing its label.
- [ ] **Step 2: Run** `npx vitest run src/scenes/flow`. Expected: FAIL.
- [ ] **Step 3: Implement** the four files. Animation uses the Web Animations API on the chip's `transform` along the path segments, with a duration of `EVENT_DURATION_MS.message / speed`. Speed can be passed as an optional `speed` prop, defaulting to 1. Add no animation library.
- [ ] **Step 4: Run** `npx vitest run src/scenes/flow`. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/scenes/flow src/lib/format.ts && git commit -m "feat: flow network and sequence views"`

---

### Task 7: Device tables and the firewall model

**Files:**
- Create: `src/engine/net/firewall.ts`, `src/scenes/table/DeviceTablePanel.tsx`
- Test: `src/engine/net/firewall.test.ts`, `src/scenes/table/DeviceTablePanel.test.tsx`

**Interfaces:**
- Consumes: `cidrContains` (Task 2); `TableDef`, `SceneEvent`, `Row` (Task 3); `TableState` (Task 4).
- Produces:
  - `interface FirewallRule { id: string; action: 'allow' | 'deny'; protocol: 'tcp' | 'udp' | 'any'; port: number | 'any'; source: string; note: string }`, where `source` is a CIDR or `'any'`
  - `interface Probe { id: string; label: string; from: string; to: string; sourceIp: string; destIp: string; protocol: 'tcp' | 'udp'; port: number; time: number; size: number; summary: string; packet?: string }`
  - `evaluateRules(rules: FirewallRule[], p: Pick<Probe, 'sourceIp' | 'protocol' | 'port'>): { ruleId: string | null; action: 'allow' | 'deny' }`. The first match wins; no match gives `{ ruleId: null, action: 'deny' }`.
  - `FIREWALL_COLUMNS = [{key:'#',label:'#'},{key:'action',label:'Action'},{key:'protocol',label:'Protocol'},{key:'port',label:'Port'},{key:'source',label:'Source'},{key:'note',label:'What it\'s for'}]`
  - `ruleRows(rules: FirewallRule[]): Row[]`, where `'#'` is the 1-based index as a string, and `action`/`protocol` are uppercase (`ALLOW`, `TCP`, `ANY`)
  - `firewallScenario(o: { firewall: string; table: string; rules: FirewallRule[]; probes: Probe[]; replaceRules?: boolean }): SceneEvent[]`. For each probe, it emits:
    - `${id}-in`: a message `probe.from → [firewall]` with kind `request`, protocol `TCP`/`UDP`, src `sourceIp`, dst `destIp:port` and the probe's size and time. Its outcome is `dropped` on deny.
    - `${id}-match`: a table `match`, with key = the matched row's `'#'`, and summary `Rule ${n} → ALLOW` or `No rule matched → DENY`. When nothing matched, the key is `''` and no row highlights.
    - `${id}-out`, on allow only: a message `firewall → [probe.to]`, delivered, with the same src/dst and time + 0.001.
    - With `replaceRules`, a leading table `replace` event `${table}-replace` with `ruleRows(rules)` and summary `Rules updated`.
  - `DeviceTablePanel({ table, actorLabel, state }: { table: TableDef; actorLabel: string; state: TableState })` renders a `<table class="data">` with `<caption>` `${table.title} · ${actorLabel}` and the column headers. It renders the rows, or the text "Empty" when there are none. The highlighted row gets `data-highlight="added|updated|matched"`, a one-shot pulse (CSS, disabled under reduced motion) and the visually hidden text "(new)", "(changed)" or "(matched)".

- [ ] **Step 1: Write the failing tests**

```ts
const rules: FirewallRule[] = [
  { id: 'r1', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' },
  { id: 'r2', action: 'allow', protocol: 'tcp', port: 22, source: '198.51.100.7/32', note: 'Admin SSH' },
  { id: 'r3', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' },
];
test.each([
  ['203.0.113.50', 'tcp', 443, 'r1', 'allow'], ['203.0.113.50', 'tcp', 22, 'r3', 'deny'],
  ['198.51.100.7', 'tcp', 22, 'r2', 'allow'], ['203.0.113.50', 'udp', 53, 'r3', 'deny'],
])('%s %s/%i → %s %s', (sourceIp, protocol, port, ruleId, action) =>
  expect(evaluateRules(rules, { sourceIp, protocol: protocol as 'tcp', port })).toEqual({ ruleId, action }));
test('first match wins when deny-all is first', () =>
  expect(evaluateRules([rules[2], rules[0]], { sourceIp: '203.0.113.50', protocol: 'tcp', port: 443 }).action).toBe('deny'));
test('no rules → implicit deny', () => expect(evaluateRules([], { sourceIp: '1.2.3.4', protocol: 'tcp', port: 80 })).toEqual({ ruleId: null, action: 'deny' }));
const probe = (id: string, sourceIp: string, port: number): Probe => ({ id, label: `TCP ${port}`, from: 'visitor', to: 'web', sourceIp, destIp: '10.0.0.10', protocol: 'tcp', port, time: 1, size: 60, summary: 's' });
test('allowed probe → in, match, out', () => {
  const ev = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('https', '203.0.113.50', 443)] });
  expect(ev.map((e) => e.id)).toEqual(['https-in', 'https-match', 'https-out']); expect((ev[1] as any).key).toBe('1');
});
test('denied probe → dropped in, match', () => {
  const ev = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('ssh', '203.0.113.50', 22)] });
  expect(ev.map((e) => e.id)).toEqual(['ssh-in', 'ssh-match']); expect((ev[0] as any).outcome).toBe('dropped'); expect((ev[1] as any).key).toBe('3');
});
test('replaceRules prepends a replace event', () =>
  expect(firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [], replaceRules: true })[0]).toMatchObject({ op: 'replace', rows: ruleRows(rules) }));
// DeviceTablePanel.test.tsx: renders caption "Rules · Firewall", 3 rows, row with data-highlight="matched"
// containing sr-only "(matched)"; empty table shows "Empty".
```

- [ ] **Step 2: Run** `npx vitest run src/engine/net/firewall.test.ts src/scenes/table`. Expected: FAIL.
- [ ] **Step 3: Implement** `firewall.ts` and `DeviceTablePanel.tsx`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/engine/net/firewall* src/scenes/table && git commit -m "feat: device table panel and firewall rule model"`

---

### Task 8: Packet inspector and packet helpers

**Files:**
- Create: `src/content/helpers/packets.ts`, `src/scenes/inspector/Inspector.tsx`
- Test: `src/content/helpers/packets.test.ts`, `src/scenes/inspector/Inspector.test.tsx`

**Interfaces:**
- Consumes: `Packet`, `Layer`, `Field` (Task 3); `LogRow` (Task 4); `formatTime`, `formatBytes` (Task 6).
- Produces:
  - `ethernetLayer(o: { src: string; dst: string; type: 'IPv4' }): Layer` (size 14)
  - `ipv4Layer(o: { src: string; dst: string; protocol: 'TCP' | 'UDP'; ttl: number; totalLength: number; identification?: string }): Layer` (size 20, `declaredLength = totalLength`)
  - `udpLayer(o: { srcPort: number; dstPort: number; length: number }): Layer` (size 8, `declaredLength = length`)
  - `dhcpLayer(o: { messageType: 'DISCOVER' | 'OFFER' | 'REQUEST' | 'ACK'; xid: string; clientMac: string; ciaddr?: string; yiaddr?: string; broadcastFlag: boolean; options: Field[] }): Layer` (size 300, the BOOTP minimum including padding)
  - `packet(o: { name: string; summary: string; seenAt?: string; layers: Layer[] }): Packet`. `size` is the sum of the layer sizes. For each layer with `declaredLength`, it asserts that the declared length equals the sum of the sizes from that layer to the end, and throws `Error` naming the layer otherwise.
  - Every helper field carries a plain-English `explain` line. Values that vary in real captures (IDs, transaction IDs, checksums) carry `example: true`.
  - `Inspector({ packet, row, onClose, onPrev, onNext }: { packet: Packet; row: LogRow | null; onClose(): void; onPrev?(): void; onNext?(): void })`, a `<section aria-label="Packet inspector">` containing:
    - **Header:** the packet name and `${formatTime(row.time)} · ${row.src} → ${row.dst} · ${row.protocol} · ${formatBytes(packet.size)}`, with prev, next and close buttons (close is labelled "Close inspector").
    - **Context:** the `seenAt` line.
    - **Layer bar:** one segment per layer, with width proportional to size and labelled `${name} ${size}`.
    - **Field tree:** a `<details open>` per layer, with the summary `${name} · ${size} bytes`. Each field row shows its name, its value, an `E.G.` tag when `example`, and its explanation.
    - **Legend:** "E.G. marks an example value: it differs in every real capture."

- [ ] **Step 1: Write the failing tests**

```ts
const discover = () => packet({ name: 'DHCP Discover', summary: 's', layers: [
  ethernetLayer({ src: '00:00:5E:00:53:10', dst: 'ff:ff:ff:ff:ff:ff', type: 'IPv4' }),
  ipv4Layer({ src: '0.0.0.0', dst: '255.255.255.255', protocol: 'UDP', ttl: 64, totalLength: 328 }),
  udpLayer({ srcPort: 68, dstPort: 67, length: 308 }),
  dhcpLayer({ messageType: 'DISCOVER', xid: '0x3903F326', clientMac: '00:00:5E:00:53:10', broadcastFlag: true, options: [] }),
] });
test('DHCP frame is 342 bytes', () => { const p = discover(); expect(p.size).toBe(342); expect(p.layers.map((l) => l.size)).toEqual([14, 20, 8, 300]); });
test('length mismatch throws', () => expect(() => packet({ name: 'x', summary: 's', layers: [
  ipv4Layer({ src: '0.0.0.0', dst: '255.255.255.255', protocol: 'UDP', ttl: 64, totalLength: 999 }), udpLayer({ srcPort: 68, dstPort: 67, length: 8 })] })).toThrow(/IPv4/));
test('every helper field explains itself', () => expect(discover().layers.flatMap((l) => l.fields).every((f) => f.explain)).toBe(true));
// Inspector.test.tsx: renders "DHCP Discover", the meta line containing "0.0.0.0 → 255.255.255.255" and "342 B",
// four layer segments, an "E.G." tag next to the transaction ID; clicking "Close inspector" calls onClose.
```

- [ ] **Step 2: Run** `npx vitest run src/content/helpers src/scenes/inspector`. Expected: FAIL.
- [ ] **Step 3: Implement** both files. The DHCP options are passed in by the lesson; `dhcpLayer` adds the fixed BOOTP fields (op, htype, hlen, hops, xid, secs, flags, ciaddr, yiaddr, siaddr, giaddr, chaddr, magic cookie, message type).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/content/helpers src/scenes/inspector && git commit -m "feat: packet inspector and layer helpers"`

---

### Task 9: Subnet playground

**Files:**
- Create: `src/scenes/playground/subnet/useSubnetPlayground.ts`, `SubnetCanvas.tsx`, `SubnetReadout.tsx`
- Test: `src/scenes/playground/subnet/subnet-playground.test.tsx`

**Interfaces:**
- Consumes: `parseIPv4`, `IPV4_ERROR`, `formatIPv4`, `toOctetBits`, `subnetInfo`, `sameSubnet`, `SubnetInfo` (Task 2); `PlaygroundPreset` (Task 3).
- Produces:
  - `interface SubnetPlaygroundState { addressText: string; setAddressText(v: string): void; prefix: number; setPrefix(p: number): void; compareText: string; setCompareText(v: string): void; info: SubnetInfo; addressError: string | null; compare: 'same' | 'different' | null; compareError: string | null; locked: boolean }`
  - `useSubnetPlayground(preset: PlaygroundPreset, locked: boolean): SubnetPlaygroundState`:
    - state resets to the preset whenever its values change;
    - `info` always holds the last *valid* result;
    - `addressError` / `compareError` equal `IPV4_ERROR` while the text is invalid;
    - an empty compare text means `compare: null` with no error.
  - `SubnetCanvas({ state }: { state: SubnetPlaygroundState })` contains:
    - an address `<input>` labelled "IP address";
    - a prefix `<input type="range" min=16 max=30>` labelled "Prefix length", with `aria-valuetext={"/" + prefix}`;
    - a 32-bit row split into octets, where network bits and host bits differ by colour *and* are separated by a divider and labelled "Network" and "Host";
    - when locked, the inputs are `disabled` with the note "You can change these in Try it."
  - `SubnetReadout({ state })` is a `<dl>` with Mask, Network, Broadcast, First host, Last host and Usable hosts, plus a "Same subnet?" input labelled "Compare with". Its result reads "Same subnet" or "Different subnets: traffic between them goes through a router".

- [ ] **Step 1: Write the failing tests** (jsdom, user-event)
  - Preset `{address:'192.168.1.10', prefix:24}`, unlocked: the readout shows Network `192.168.1.0` and Usable hosts `254`.
  - Setting the slider to 26 shows Usable hosts `62` and Network `192.168.1.0`.
  - Typing `192.168.1.256` shows `IPV4_ERROR`, and the readout still shows the previous Network.
  - Typing `  192.168.1.70 ` clears the error, and the readout shows Network `192.168.1.64` (at /26).
  - Comparing `192.168.1.10` against `192.168.1.70` at /26 shows "Different subnets…"; at /24, "Same subnet".
  - With `locked=true`, both inputs are disabled.
  - Re-rendering with a new preset resets the fields.
- [ ] **Step 2: Run** `npx vitest run src/scenes/playground`. Expected: FAIL.
- [ ] **Step 3: Implement** the three files.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/scenes/playground && git commit -m "feat: subnet playground"`

---

### Task 10: Lesson panels, event log and controls

**Files:**
- Create: `src/lesson/eventCard.ts`, `ExplanationPanel.tsx`, `TryItPanel.tsx`, `CheckYourself.tsx`, `RecapPanel.tsx`, `EventLog.tsx`, `PlaybackControls.tsx`
- Test: `src/lesson/eventCard.test.ts`, `src/lesson/panels.test.tsx`

**Interfaces:**
- Consumes: Task 3 types and `CERT_TAGS`; `AvailableSummary`; `Sections`, `DerivedState`, `LogRow`, `PlaybackState`, `PlaybackAction`, `positionLabel` (Task 4); `formatBytes` (Task 6).
- Produces:
  - `eventCard(state: DerivedState, actorLabel: (id: string) => string): { label: string; kind: MessageKind; dropped: boolean; route: string; summary: string; meta: string } | null`. `route` is `"Laptop → Router"`, or `"Laptop → everyone (broadcast)"` when `to.length > 1`. `meta` is `"Message ${row.n} of ${messageTotal} · ${protocol} · ${formatBytes(size)}"`.
  - `ExplanationPanel(props: { lesson: Lesson; sections: Sections; position: number; state: DerivedState; actorLabel(id: string): string; resume?: React.ReactNode; children?: React.ReactNode })`:
    - **Position 0:** the hook, the name (large) with the full name, the description and the facts as a `<dl>`, and the `resume` slot.
    - **Steps:** `STEP ${i} OF ${n}`, the title, subtitle, narrative, event card (with a "Dropped" label when dropped) and facts.
    - **Try it, Check and Recap:** renders `children`.
    - The narrative container has `aria-live="polite"`.
  - `TryItPanel(props: { tryIt: TryIt; chosen: string | null; done: boolean; onChoose(id: string): void })`. Choices are buttons with `aria-pressed`. The chosen choice's explanation appears once `done` is true. In `free` mode, it shows the prompt, and the explanation sits under a "What to notice" disclosure.
  - `CheckYourself({ questions }: { questions: Question[] })`. Each question is a radio group. Choosing an option shows "Correct." or "Not quite." followed by the explanation. Answers can be changed, and nothing is stored anywhere.
  - `RecapPanel(props: { lesson: Lesson; prev: AvailableSummary | null; next: AvailableSummary | null; nextPlanned: boolean })` shows:
    - the 3 takeaways;
    - "Relevant for:" with `CERT_TAGS` labels;
    - "References" links (`rel="noopener"`, opening in a new tab);
    - "Next: {title}" linking to `next.url`. If there's no next lesson but `nextPlanned`, it shows "Next lesson coming soon"; otherwise "Back to the track". It also links to the previous lesson when there is one.
  - `EventLog(props: { state: DerivedState; showTableColumn: boolean; legend: FlowScene['legend']; onOpenPacket(packetId: string, n: number): void })`:
    - a `<table class="data">` with `<caption class="sr-only">Event log</caption>`;
    - the columns `#`, `Time`, `Source`, `Destination`, `Protocol`, `Summary`, `Size`, plus `Table change` when `showTableColumn`;
    - dropped rows show "Dropped" in the summary;
    - rows with a packet carry a "Details" button that calls `onOpenPacket`;
    - when empty: "Nothing has happened yet. Press Play to start.";
    - the legend renders above it as dots *with* text.
  - `PlaybackControls(props: { state: PlaybackState; hasEvents: boolean; dispatch: React.Dispatch<PlaybackAction> })` provides:
    - speed buttons `0.5×`, `1×`, `2×` with `aria-pressed`;
    - "Previous step";
    - a play/pause button labelled "Play (Space)" or "Pause (Space)";
    - "Next step" and "Replay step".

- [ ] **Step 1: Write the failing tests**
  - `eventCard`, with the fixture:
    - `deriveState(L, 1, 1, null)` gives `meta` `'Message 1 of 4 · …'` and a route containing `→`;
    - an active message with two `to` targets gives a route ending `(broadcast)`;
    - overview state gives `null`.
  - `panels`:
    - `CheckYourself`: choosing the wrong option shows "Not quite." plus the explanation; choosing the right one shows "Correct."; `Storage.prototype.setItem` is never called (spy).
    - `EventLog`: empty state text; with rows, the Details button calls `onOpenPacket('p1', 1)`; the `Table change` header appears only when `showTableColumn`.
    - `RecapPanel`: shows "Next lesson coming soon" when `next` is null and `nextPlanned`.
    - `PlaybackControls`: clicking Play dispatches `{type:'toggle'}`.
- [ ] **Step 2: Run** `npx vitest run src/lesson`. Expected: FAIL.
- [ ] **Step 3: Implement** the files.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit:** `git add src/lesson && git commit -m "feat: lesson panels, event log and playback controls"`

---

### Task 11: Pilot lesson: DHCP

**Files:**
- Create: `src/content/lessons/networking/dhcp.ts`
- Test: `src/content/lessons/networking/dhcp.test.ts`

**Interfaces:**
- Consumes: `defineLesson` (Task 3); the packet helpers (Task 8).
- Produces: the default export `Lesson` with slug `dhcp` and title `DHCP`.

**Content decisions (accuracy-critical; the implementer writes the prose within §7.1–7.2):**
- **Meta:**
  - subtitle "Getting an address automatically"; level beginner; `osiLayers: [7]`
  - cert tags `a-plus`, `network-plus`, `ccna`, `helpdesk`
  - references RFC 2131, RFC 2132, RFC 3927 (with rfc-editor.org URLs)
- **Overview facts:**
  - Layer: Application (7)
  - Ports: UDP 67 (server), UDP 68 (client)
  - Hands out: IP address, subnet mask, default gateway, DNS server
  - Exchange: Discover, Offer, Request, Acknowledge
  - Lease: renewed at half its length
  - Defined in: RFC 2131, RFC 2132
- **Scene:** flow, views `['network','sequence']`.
  - Actors:
    - `laptop` "Laptop", addresses `[]`, MAC `00:00:5E:00:53:10` shown in facts
    - `phone` "Phone" (`00:00:5E:00:53:11`)
    - `router` "Router · DHCP server" (`192.168.1.1`), wireless links to both
  - Table `leases` on `router`: columns IP, MAC, Device, Expires; key `ip`; no initial rows.
  - Legend: broadcast "Broadcast to everyone", response "Reply from the DHCP server", request "Request".
- **Steps (5):**
  1. **Discover:** `0.0.0.0:68 → 255.255.255.255:67`, to `['router','phone']`, kind broadcast, Ethernet dst `ff:ff:ff:ff:ff:ff`, time 0.000.
  2. **Offer:** `192.168.1.1:67 → 255.255.255.255:68` (broadcast flag set; the narrative notes that some servers unicast instead), kind response, `yiaddr 192.168.1.100`. Options: subnet mask 255.255.255.0, router 192.168.1.1, DNS 192.168.1.1, lease 86400 s, server identifier 192.168.1.1. Time 0.004.
  3. **Request:** `0.0.0.0:68 → 255.255.255.255:67`, kind broadcast, options requested IP 192.168.1.100 and server identifier 192.168.1.1. Time 0.006.
  4. **Acknowledge:** `192.168.1.1:67 → 255.255.255.255:68`, kind response, plus table `add` `{ip:'192.168.1.100', mac:'00:00:5E:00:53:10', device:'Laptop', expires:'in 24 h'}`. Time 0.009.
  5. **Renew:** a unicast Request `192.168.1.100:68 → 192.168.1.1:67` (`ciaddr` set) at time 43200.000, then an ACK `192.168.1.1:67 → 192.168.1.100:68`, plus table `update` on key `192.168.1.100` with `expires: 'in 24 h (renewed)'`.
- Every message frame is 342 bytes, built with the Task 8 helpers: IPv4 total length 328, UDP length 308.
- **Try it (choices):**
  - `normal` "Connect the phone": a full DORA for the phone, ending in a lease add for `192.168.1.101`.
  - `pool-full` "Shrink the pool to one address, then connect the phone": the phone's Discover at 60.000 and a retry at 64.000, with no Offer. The explanation covers the phone eventually giving itself a 169.254.x.x address (APIPA, RFC 3927) and what a helpdesk tech should check.
- **Check (3):**
  1. Which port the server listens on: UDP 67 (answer), against UDP 68, TCP 67 and TCP 53.
  2. Why the Discover goes to 255.255.255.255.
  3. What a 169.254.20.5 address most likely means.

- [ ] **Step 1: Write the failing test**

```ts
import dhcp from './dhcp';
test('valid and within budget', () => { expect(estimateMinutes(dhcp)).toBeLessThanOrEqual(15); expect(dhcp.steps).toHaveLength(5); });
test('accuracy anchors', () => {
  const msgs = dhcp.steps.flatMap((s) => s.events).filter((e) => e.type === 'message') as MessageEvent[];
  expect(msgs[0]).toMatchObject({ src: '0.0.0.0:68', dst: '255.255.255.255:67', kind: 'broadcast' });
  expect(msgs.every((m) => m.size === 342)).toBe(true);
  expect(msgs.find((m) => m.time === 43200)).toMatchObject({ src: '192.168.1.100:68', dst: '192.168.1.1:67' });
  expect(dhcp.overview.facts.find((f) => f.label === 'Ports')?.value).toBe('UDP 67 (server), UDP 68 (client)');
});
test('track entry is available as lesson 9', () => expect(getEntries('networking').find((e) => e.slug === 'dhcp')).toMatchObject({ available: true, number: 9 }));
```

- [ ] **Step 2: Run** `npx vitest run src/content/lessons`. Expected: FAIL (module not found).
- [ ] **Step 3: Write `dhcp.ts`** to the content decisions above.
- [ ] **Step 4: Run** `npx vitest run src/content/lessons && npm test`. Expected: PASS, and no estimate warning above 12 minutes.
- [ ] **Step 5: Commit:** `git add src/content/lessons && git commit -m "content: DHCP pilot lesson"`

---

### Task 12: Lesson console and lesson route

**Files:**
- Create: `src/lesson/LessonConsole.tsx`, `TopBar.tsx`, `Outline.tsx`, `keyboard.ts`, `useReducedMotion.ts`, `console.css`, `src/pages/[track]/[lesson].astro`, `playwright.config.ts`, `e2e/lesson.spec.ts`
- Test: `src/lesson/keyboard.test.ts`, `src/lesson/LessonConsole.test.tsx`, `e2e/lesson.spec.ts`

**Interfaces:**
- Consumes: everything from Tasks 4–10; `getTrack`, `getEntries`, `getLesson`, `neighbors` (Task 3); `useProgress`, `recordVisit`, `resumePosition`, `lessonKey` (Task 5).
- Produces:
  - `shouldIgnoreShortcut(target: EventTarget | null): boolean`. It returns true for `input`, `textarea`, `select`, `button`, `a[href]`, `[contenteditable]`, `[role=slider]`, `[role=radio]` and anything inside `details > summary`.
  - `useReducedMotion(): boolean`
  - `LessonConsole(props: { trackId: string; trackTitle: string; lesson: Lesson; entry: AvailableSummary; total: number; prev: AvailableSummary | null; next: AvailableSummary | null; nextPlanned: boolean; entries: LessonSummary[] })`, which renders:
    - **`TopBar`:** the wordmark linking to `/`; the breadcrumb `${trackTitle} › ${lesson.title}`; "Lesson ${entry.number} of ${total}"; one step segment per step, filled when `position > i`; an OSI chip (`OSI L7`, or `OSI L3–L4` for a range) when `osiLayers` is non-empty; the theme toggle.
    - **`Outline`:** buttons for Overview, each step, Try it, Check yourself and Recap (current one marked `aria-current="step"`; clicking dispatches `jump`). Below it, a collapsible "All lessons" list grouped by `partTitle`. Available lessons are links, unavailable ones show "Coming soon", and progress markers say "Finished" or "In progress" as text.
    - **Center:** a view toggle (only when `scene.views.length > 1`), then `NetworkView`/`SequenceView` plus a `DeviceTablePanel` for each table, or `SubnetCanvas` for playground scenes. When `inspecting` is set, the `Inspector` replaces the center.
    - **Right:** `ExplanationPanel`, holding `TryItPanel`, `CheckYourself` or `RecapPanel` as children by position. The Overview gets a "Resume at ${resumeLabel(...)}" button from `resumePosition` (hidden when there's a `?step` param or no saved step), or a "Finished" marker when the lesson is finished.
    - **Bottom:** `EventLog` (`showTableColumn = scene.tables.length > 0`) for flow scenes, or `SubnetReadout` for playground scenes, with `PlaybackControls` in its header (hidden for playground scenes).
  - Behaviour:
    - **Initial render:** position 0 (this matches the server render). After mount, if `parseStepParam(location.search)` is non-null, dispatch `jump`.
    - **Progress:** on mount and on every position change, `update(d => recordVisit(d, entry.key, position, entry.maxPosition, new Date()))`.
    - **Keyboard:** the `keydown` listener on `window` returns early when `shouldIgnoreShortcut(e.target)`. Space → `toggle` (with `preventDefault`), ArrowRight → `next`, ArrowLeft → `prev`, Escape → close the inspector.
    - **Playground lock:** the playground is locked except at the `tryIt` position.
    - **Inspector navigation:** prev/next in the inspector move between log rows that have packets.
  - `console.css` layout:
    - **≥ 1200 px:** a grid with columns `280px minmax(0,1fr) 340px` and rows `auto minmax(0,1fr) minmax(180px,32vh)`, `height: 100dvh`, no page scroll; every panel has `overflow: auto`.
    - **768–1199 px:** two columns (canvas, explanation), with the outline in a drawer opened from a top-bar button and the log below.
    - **< 768 px:** stacked top bar → canvas (`height: clamp(260px, 70vw, 460px)`) → explanation → log, with the outline in a drawer and the controls fixed to the bottom (`position: sticky; bottom: 0`), padded for `env(safe-area-inset-bottom)`.
  - `[lesson].astro`: `getStaticPaths` covers every available entry of every track. It renders `BaseLayout` (title = lesson title, description = lesson summary) with `<LessonConsole client:load ...>`.
  - `playwright.config.ts`: `webServer: { command: 'npm run build && npm run preview -- --port 4321', port: 4321, reuseExistingServer: true }`. Projects:
    - `desktop-dark`: 1440×900, `colorScheme: 'dark'`
    - `desktop-light`: 1440×900, `colorScheme: 'light'`
    - `phone`: 390×844, `isMobile: true`, `hasTouch: true`
    - `reduced-motion`: `reducedMotion: 'reduce'`
    - `short-desktop`: 1280×650

- [ ] **Step 1: Write the failing tests**

```ts
// keyboard.test.ts (jsdom)
test.each(['input', 'textarea', 'select', 'button'])('ignores shortcuts in <%s>', (tag) =>
  expect(shouldIgnoreShortcut(document.createElement(tag))).toBe(true));
test('ignores range slider and links', () => {
  const r = document.createElement('input'); r.type = 'range'; expect(shouldIgnoreShortcut(r)).toBe(true);
  const a = document.createElement('a'); a.href = '/x'; expect(shouldIgnoreShortcut(a)).toBe(true);
});
test('handles shortcuts on body and plain divs', () => { expect(shouldIgnoreShortcut(document.body)).toBe(false); expect(shouldIgnoreShortcut(document.createElement('div'))).toBe(false); });
```

  - `LessonConsole.test.tsx` (jsdom, fixture lesson, fake timers):
    - it renders the Overview first;
    - Space on `document.body` starts playback (the Play button's label becomes "Pause (Space)");
    - Space while the focus is in the Check yourself radio group does not change it;
    - ArrowRight shows "STEP 1 OF 4";
    - opening Details then pressing Escape closes the inspector;
    - with `window.history.replaceState({}, '', '?step=3')` before render, "STEP 3 OF 4" shows after mount;
    - jumping to Recap writes a `finished` record under `techconcepts:v1`;
    - with a saved in-progress record at position 2 and no `?step`, the Overview shows "Resume at step 2 of 4".
  - `e2e/lesson.spec.ts`:
    - open `/networking/dhcp`; press Play; expect ≥ 1 event log row within 5 s;
    - press ArrowRight until the Recap shows "Back to the track" or "Next";
    - no `pageerror` events;
    - in `short-desktop`, the Play button is within the viewport and the explanation panel is scrollable (`scrollHeight > clientHeight` or fits).
- [ ] **Step 2: Run** `npx vitest run src/lesson && npx playwright install chromium && npm run e2e -- e2e/lesson.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** the files.
- [ ] **Step 4: Run** the same commands. Expected: PASS in all five projects. Then check the JS budget with `npm run build && cat dist/_astro/*.js | gzip -c | wc -c`. This totals all site JS, which is an upper bound for one lesson page. Expected: ≤ 204800. Record the number in the commit message.
- [ ] **Step 5: Commit:** `git add -A && git commit -m "feat: lesson console and lesson pages (JS: <n> KB gz)"`

---

### Task 13: Pilot lesson: Subnetting

**Files:**
- Create: `src/content/lessons/networking/subnetting.ts`
- Test: `src/content/lessons/networking/subnetting.test.ts`

**Content decisions:**
- **Meta:** subtitle "Splitting networks into smaller ones"; `osiLayers: [3]`; cert tags `network-plus`, `ccna`; references RFC 950 and RFC 4632.
- **Overview facts:**
  - Written as: 192.168.1.0/24
  - Mask: 255.255.255.0
  - Usable hosts: 2 to the power of host bits, minus 2
  - Defined in: RFC 950, RFC 4632
- **Scene:** `{ type: 'playground', playground: 'subnet' }`
- **Steps (6) with presets:**
  1. "An address has two parts": `192.168.1.10/24`
  2. "The mask draws the line": `192.168.1.10/24`
  3. "Network, broadcast and hosts": `192.168.1.10/24`. The narrative states network 192.168.1.0, broadcast 192.168.1.255, 254 usable.
  4. "Borrowing bits": `192.168.1.70/26`. States 4 subnets of 64 addresses, network 192.168.1.64, 62 usable.
  5. "Same subnet or not?": `192.168.1.10/26`, compare `192.168.1.70`. They are in different subnets, so traffic goes via a router (lesson 8).
  6. "Tiny subnets": `10.0.0.5/30`. States 2 usable hosts, used on links between routers.
- **Try it:** `free`. The prompt invites trying any address and any prefix from /16 to /30; the explanation lists three things to notice.
- **Check (3):** the usable hosts in a /26 (62); whether 192.168.1.10 and 192.168.1.70 are on the same /24 (yes); what a /30 is typically used for.

- [ ] **Step 1: Write the failing test**, which checks that every number the narrative states matches the computed values:

```ts
import s from './subnetting';
const info = (i: number) => { const p = s.steps[i].preset!; const r = parseIPv4(p.address); if (!r.ok) throw 0; return subnetInfo(r.value, p.prefix); };
test('budget', () => expect(estimateMinutes(s)).toBeLessThanOrEqual(15));
test('step 3 numbers', () => { const i = info(2); expect([formatIPv4(i.network), formatIPv4(i.broadcast), i.usableHosts]).toEqual(['192.168.1.0', '192.168.1.255', 254]);
  expect(s.steps[2].narrative).toContain('254'); });
test('step 4 numbers', () => { const i = info(3); expect([formatIPv4(i.network), i.usableHosts]).toEqual(['192.168.1.64', 62]); expect(s.steps[3].narrative).toContain('62'); });
test('step 5 compare is different', () => { const p = s.steps[4].preset!; const a = parseIPv4(p.address), b = parseIPv4(p.compare!);
  if (!a.ok || !b.ok) throw 0; expect(sameSubnet(a.value, b.value, p.prefix)).toBe(false); });
test('step 6 numbers', () => { expect(info(5).usableHosts).toBe(2); expect(s.steps[5].narrative).toContain('2 usable'); });
test('check answer for /26 is 62', () => expect(s.check[0].options[s.check[0].answer]).toContain('62'));
```

- [ ] **Step 2: Run** `npx vitest run src/content/lessons/networking/subnetting.test.ts`. Expected: FAIL.
- [ ] **Step 3: Write `subnetting.ts`.**
- [ ] **Step 4: Run** `npm test && npm run e2e -- e2e/lesson.spec.ts`, after adding `/networking/subnetting` to the e2e lesson list. Expected: PASS.
- [ ] **Step 5: Commit:** `git add -A && git commit -m "content: Subnetting pilot lesson"`

---

### Task 14: Pilot lesson: Firewalls

**Files:**
- Create: `src/content/lessons/networking/firewalls.ts`
- Test: `src/content/lessons/networking/firewalls.test.ts`

**Content decisions:**
- **Meta:** subtitle "Deciding what gets in"; `osiLayers: [3, 4]`; cert tags `network-plus`, `security-plus`, `ccna`, `soc-analyst`. References: NIST SP 800-41 Rev. 1, "Guidelines on Firewalls and Firewall Policy" (csrc.nist.gov).
- **Overview facts:**
  - Works with: addresses and ports (layers 3–4)
  - Reads rules: top to bottom, first match wins
  - Default: block anything not allowed
  - Common types: packet filter, stateful, next-generation
- **Scene:** flow, views `['network','sequence']`.
  - Actors:
    - `visitor` "Visitor" (`203.0.113.50`)
    - `admin` "Admin laptop" (`198.51.100.7`)
    - `internet` "The internet"
    - `fw` "Firewall"
    - `web` "Web server" (`10.0.0.10`)
  - Links: visitor–internet, admin–internet, internet–fw, fw–web (all wired).
  - Table `rules` on `fw` using `FIREWALL_COLUMNS`, with `initialRows = ruleRows(baseRules)`, where `baseRules` are the three rules in the Task 7 test.
- **Steps (5).** Events come from `firewallScenario`, one probe per step, all with `via: ['internet']`:
  1. "Rules are read top to bottom": visitor TCP 443 → allowed by rule 1
  2. "The first match wins": visitor TCP 22 → denied by rule 3
  3. "Rules can name a source": admin TCP 22 → allowed by rule 2
  4. "Everything else is blocked": visitor TCP 23 (Telnet) → denied by rule 3
  5. "Replies get through": one message `web → [visitor]` via `['fw','internet']`, kind response, summary "HTTPS reply (part of an allowed connection)". The narrative explains that a stateful firewall remembers allowed connections, so replies don't need their own rule. There is no table event.
- **Try it (choices).** Each uses `firewallScenario({ replaceRules: true })` over the same four probes:
  - `deny-first` "Move 'Block everything else' to the top": all four probes are denied.
  - `allow-http` "Add 'Allow TCP 80' above the last rule", plus a fifth probe, visitor TCP 80, which is allowed.
  - `remove-admin` "Remove the admin SSH rule": admin SSH is denied.
- **Check (3):** what happens when no rule matches (blocked); why rule order matters; which rule lets the admin in.

- [ ] **Step 1: Write the failing test**

```ts
import fw from './firewalls';
const outcomes = (events: SceneEvent[]) => events.filter((e) => e.type === 'message' && e.id.endsWith('-in')).map((e) => (e as MessageEvent).outcome ?? 'delivered');
test('budget', () => expect(estimateMinutes(fw)).toBeLessThanOrEqual(15));
test('step outcomes', () => expect(fw.steps.slice(0, 4).map((s) => outcomes(s.events)[0])).toEqual(['delivered', 'dropped', 'delivered', 'dropped']));
test('deny-first blocks everything', () => {
  const c = (fw.tryIt as Extract<TryIt, { mode: 'choices' }>).choices.find((x) => x.id === 'deny-first')!;
  expect(outcomes(c.events).every((o) => o === 'dropped')).toBe(true);
});
test('remove-admin denies admin SSH', () => {
  const c = (fw.tryIt as Extract<TryIt, { mode: 'choices' }>).choices.find((x) => x.id === 'remove-admin')!;
  const admin = c.events.find((e) => e.type === 'message' && (e as MessageEvent).from === 'admin') as MessageEvent;
  expect(admin.outcome).toBe('dropped');
});
test('only documentation or private addresses', () => {
  const addrs = (fw.scene as FlowScene).actors.flatMap((a) => a.addresses);
  expect(addrs.every((a) => /^(203\.0\.113|198\.51\.100|192\.0\.2|10\.)/.test(a))).toBe(true);
});
```

- [ ] **Step 2: Run** `npx vitest run src/content/lessons/networking/firewalls.test.ts`. Expected: FAIL.
- [ ] **Step 3: Write `firewalls.ts`.**
- [ ] **Step 4: Run** `npm test && npm run e2e -- e2e/lesson.spec.ts`, with `/networking/firewalls` added. Expected: PASS.
- [ ] **Step 5: Commit:** `git add -A && git commit -m "content: Firewalls pilot lesson"`

---

### Task 15: Home, Track, About and 404 pages

**Files:**
- Create: `src/pages/index.astro` (replacing the placeholder), `src/pages/[track]/index.astro`, `src/pages/about.astro`, `src/pages/404.astro`, `src/components/ContinueCard.tsx`, `TrackLessonList.tsx`, `ResetProgress.tsx`, `public/og-default.png` (1200×630, wordmark on the dark background), `e2e/site.spec.ts`
- Test: `src/components/progress-islands.test.tsx`, `e2e/site.spec.ts`

**Interfaces:**
- Consumes: `tracks`, `comingSoonTracks`, `getEntries`, `trackTotals`, `CERT_TAGS` (Task 3); `useProgress`, `trackCompletion`, `resumePosition` (Task 5); `resumeLabel` (Task 4).
- Produces:
  - `ContinueCard({ entries }: { entries: AvailableSummary[] })`. It renders nothing until `ready`, when storage is unavailable, or when `lastLesson` is unknown. Otherwise it shows "Continue: ${title}", plus ` · ${resumeLabel}` when in progress, and "${finished} of ${planned} complete", linking to the lesson URL (`?step=` the resume position when there is one).
  - `TrackLessonList({ trackId, entries, planned }: { trackId: string; entries: LessonSummary[]; planned: number })`:
    - Server render: every part with its lessons (number, title, summary, minutes, cert tag labels; unavailable entries are muted with "Coming soon").
    - Client: filter chips "All" plus one per cert tag present, synced to `?for=` with `history.replaceState`. An unknown `?for` value falls back to "All".
    - Each row has a marker text "Finished" or "In progress".
    - A progress line "${finished} of ${planned} complete" with a segmented bar (one segment per planned lesson).
    - It reserves space so the page doesn't jump when progress fills in.
  - `ResetProgress()`: a button "Reset progress" that turns into an inline confirm, "Reset all progress on this device?", with **Reset** and **Cancel** buttons. Confirming calls `reset()` and announces "Progress cleared" via `aria-live`.
  - **Home page sections (§10.1):**
    - hero with a one-sentence promise and "Start with Networking Concepts" linking to the first *available* lesson;
    - `ContinueCard`;
    - the Networking Concepts card (available lessons, total minutes, Beginner, plus a progress line island);
    - "Coming soon" cards from `comingSoonTracks`, not links;
    - "Preparing for…" chips for each cert tag present in available lessons, linking to `/networking?for=<tag>`;
    - "How a lesson works": Watch, Try, Check, one line each.
  - **About (§10.4):** the progress-in-this-browser statement and `ResetProgress`. **404:** links to Home and `/networking`.
- [ ] **Step 1: Write the failing tests**
  - `progress-islands.test.tsx` (jsdom):
    - `ContinueCard` renders nothing with empty progress, and "Continue: DHCP · step 2 of 5" with a saved in-progress record at position 2;
    - `TrackLessonList` with `?for=security-plus` shows Firewalls but not DHCP;
    - `?for=bogus` shows all;
    - `ResetProgress` confirm clears `techconcepts:v1`.
  - `e2e/site.spec.ts`:
    - Home has the `<title>` "TechConcepts" and links to `/networking`;
    - the track page lists all 19 lesson titles, with 16 marked "Coming soon";
    - clicking every available lesson link from the track page and stepping each to the Recap with ArrowRight produces no `pageerror`;
    - after finishing DHCP, Home shows a Continue card and the track shows "Finished" next to DHCP;
    - **storage blocked:** with `context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } }))`, Home renders without a Continue card, a lesson steps to the Recap with no `pageerror`, and the theme toggle still switches `data-theme`;
    - `/does-not-exist` serves the 404 page.
- [ ] **Step 2: Run** `npx vitest run src/components && npm run e2e`. Expected: FAIL.
- [ ] **Step 3: Implement** the pages and islands. Each page passes its own `title` and `description` to `BaseLayout`.
- [ ] **Step 4: Run** `npm test && npm run e2e`. Expected: PASS in all projects.
- [ ] **Step 5: Commit:** `git add -A && git commit -m "feat: home, track, about and 404 pages"`

---

### Task 16: Cloudflare preview deployment

**Files:**
- Create: `docs/deploy.md`; `wrangler.jsonc` only if Workers static assets is chosen
- Modify: `src/layouts/BaseLayout.astro` (analytics beacon)
- Test: `e2e/site.spec.ts`, which gains a check that the beacon is absent when the token isn't set

**Interfaces:**
- Consumes: the `PUBLIC_CF_WEB_ANALYTICS_TOKEN` env var, supplied by the owner in Cloudflare. When it is set, `BaseLayout` adds Cloudflare's cookieless Web Analytics beacon script with that token; when it isn't, the page has no beacon.

- [ ] **Step 1: Decide the target.** Read Cloudflare's current docs on deploying Astro and static sites, and choose **Pages** or **Workers static assets**, whichever Cloudflare currently recommends for new static sites (spec §5). Record the choice and a link to the docs in `docs/deploy.md`.
  - **For Workers:** add `wrangler.jsonc` with `"assets": { "directory": "./dist", "not_found_handling": "404-page" }`.
  - **For Pages:** the build command is `npm run build` and the output directory is `dist`.
- [ ] **Step 2: Add the beacon** and its e2e assertion (no `cloudflareinsights` script tag without the token). Run `npm run e2e -- e2e/site.spec.ts`. Expected: PASS.
- [ ] **Step 3: Write owner steps in `docs/deploy.md`.**
  1. Create a GitHub repository and push `main`.
  2. In Cloudflare, create the project from that repository with the settings above, and set `NODE_VERSION=24` if the build image needs it.
  3. Optionally enable Web Analytics and add `PUBLIC_CF_WEB_ANALYTICS_TOKEN`.
  4. Leave `techconcepts.app` unconnected until launch (Plan 2).

  **Stop here and ask the owner** to do these steps. Don't create accounts or enter credentials.
- [ ] **Step 4: Verify the preview** once the owner shares the preview URL:
  - `https://` loads Home, `/networking`, all three lessons, `/about` and a 404;
  - stepping DHCP to the Recap works on a phone-sized viewport;
  - no console errors.
- [ ] **Step 5: Commit:** `git add -A && git commit -m "chore: Cloudflare deployment config and docs"`

---

## Done for Plan 1

- `npm test` and `npm run e2e` pass in every Playwright project.
- `npm run build` passes with no lesson-time warnings above 12 minutes.
- The JS budget is recorded.
- The preview URL serves the site over HTTPS.
- The owner has the preview link to review the three pilot lessons, and their feedback goes into Plan 2.
