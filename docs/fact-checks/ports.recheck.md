```json fact-check
{
  "slug": "ports",
  "base": "db1a5e07b5f87988b96ae032bc0cd39969fa6429fe9b4b5dcc82abab4d59729a",
  "hash": "2a42cd887863e80a1d1dd76838047087953ba6b51351f6232ac62f492d9074a7",
  "checked": "2026-11-14",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].overview.facts[2] (Overview fact \"Nothing listening (TCP)\")": "✅"
  },
  "sources": [],
  "quotes": {
    "checked": "2026-11-14",
    "count": 0,
    "digest": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945",
    "files": {}
  }
}
```

# Fact-check re-check: ports

A targeted re-check of the two items the re-check sheet lists. Both are traced items; neither cites a source, so no source was fetched.

## Traced items

### units[0].overview.backing (the Overview description) — ✅

- Note: The first sentence (a port number says which program a message is for) repeats lead-1 and term-port. The second sentence's "a server listens on its own ports" repeats term-listen (a program waiting for connections on its port), with "server" as the name fact-closed itself uses for the side that answers. Its last clause (a TCP connection attempt to a port where nothing listens gets a reset) repeats fact-closed, whose label names TCP and the nothing-listening case and whose value names the reset; "connection request" is the plain reading of term-listen's "waiting for connections". It adds no value, number, name, outcome or condition beyond those parts. It leaves out fact-closed's note that the app reports the connection refused, which is allowed.

### units[0].overview.facts[2] (Overview fact "Nothing listening (TCP)") — ✅

- Note: Label and value are fact-closed's own words, with its second clause (the app reports the connection refused) left out. Nothing is added. In its place, third of five Overview facts between "Common ports" and "OSI layer", it reads true and in order.

## Sources

None: the judged items cite nothing.
