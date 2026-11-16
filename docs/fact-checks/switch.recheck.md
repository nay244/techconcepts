```json fact-check
{
  "slug": "switch",
  "base": "33cc997b61706d92c6b702666d5fd986bd3b1ce1ea174e1904c63924b219fdbf",
  "hash": "84cca5148c11eb10e39729729a13963ec97bef4e7d799beb7b511308266ee4fb",
  "checked": "2026-11-15",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].scene.backing (the scene)": "✅"
  },
  "sources": [],
  "quotes": {
    "checked": "2026-11-15",
    "count": 0,
    "digest": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    "files": {}
  }
}
```

# Fact-check re-check: switch

A targeted re-check of the one item the re-check sheet lists. Base `33cc997b…`, hash `84cca514…`, checked 2026-11-15.

## Claims

### units[0].scene.backing (the scene) — ✅

Kind: traced. Traces: term-switch, term-port, term-table, term-learn, term-flood, fact-start, term-broadcast, fact-broadcast.

- Note: The title names the scene's own picture, a switch with four devices plugged in. The count of four describes the drawn example, not how switches work, and the term-switch part says a switch connects a network's devices, each on a port. It adds no claim.
- Note: The panel calls the MAC table a list kept by the switch, with a port column and a MAC address column; term-table says the same (the switch's list of which MAC address is on which port). Its empty-state text says the table is empty because the switch has learned no address yet, which fact-start (the table is empty at the start) and term-learn (noting each source address beside its port) state.
- Note: The event log's column headings (time, source, destination, protocol, info, size) are headings only and make no claim.
- Note: The legend's "Frame for everyone" now traces to term-broadcast (the address that means every device) and fact-broadcast (every device gets a copy), which closes the earlier warning on this label. "Frame for one device" names a frame with a single destination, which term-flood (a frame's destination) and term-switch (frames passed between devices) cover. "The reply" names a frame sent back between two devices; it states no value, number, name, outcome or condition beyond term-switch's frames passed between devices, and would not mislead a beginner.

## Traced, example and analogy parts, and unbacked items

- units[0].scene.backing (the scene): ✅ (judged above).

## Sources

None: the judged item cites nothing.

## Limit overrides

Not part of a re-check (the limit overrides are the full check's).
