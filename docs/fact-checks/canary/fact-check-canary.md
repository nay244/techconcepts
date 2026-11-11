```json fact-check
{
  "slug": "fact-check-canary",
  "hash": "d596a10e930a1efe5956be6d5fd847eaa0241d2b49300c3ee793030cabc14d4b",
  "checked": "2026-11-11",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].osi": "✅",
    "backing (the lesson's subtitle and summary)": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].scene.backing (the scene)": "✅",
    "units[0].overview.hookBacking (the Overview hook)": "✅",
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].overview.facts[0] (Overview fact \"Example address\")": "✅",
    "units[0].steps[0] (step \"discover\")": "✅",
    "units[0].steps[0].facts[0] (step \"discover\", fact \"Message\")": "✅",
    "units[0].steps[0].facts[1] (step \"discover\", fact \"To port\")": "✅",
    "units[0].steps[0].events[0] (event \"m1\")": "✅",
    "units[0].steps[1] (step \"offer\")": "✅",
    "units[0].steps[1].facts[0] (step \"offer\", fact \"Offered address\")": "✅",
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Lease time\")": "❌",
    "units[0].steps[1].events[0] (event \"m2\")": "✅",
    "units[0].steps[0].deep[0] (step \"discover\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"offer\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.lead[2] (\"lead-3\")": "❌",
    "units[0].learn.terms[0] (\"term-dhcp\")": "✅",
    "units[0].learn.terms[1] (\"term-1\")": "✅",
    "units[0].learn.terms[2] (\"term-2\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "❌",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-1\")": "✅",
    "units[0].learn.facts[1] (\"fact-2\")": "✅",
    "units[0].learn.facts[2] (\"fact-3\")": "⚠️",
    "units[0].practice[0].options[0] (question \"q1\")": "✅",
    "units[0].practice[0].options[1] (question \"q1\")": "❌",
    "units[0].practice[0].prompt (question \"q1\")": "✅"
  },
  "sources": [
    { "id": "microsoft-dhcp", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-2131", "current": true, "checked": "2026-11-11" },
    { "id": "rfc-2616", "current": false, "checked": "2026-11-11", "note": "Obsoleted by RFCs 7230-7235, which RFC 9110 and its companions in turn replace." },
    { "id": "rfc-9110", "current": true, "checked": "2026-11-11" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-11",
    "count": 22,
    "digest": "d13f423964b1767cff5696992598dacc9c8431b613b178d6fecd271b738fa649",
    "files": {
      "rfc-2131": "a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5",
      "microsoft-dhcp": "f8e81ba8570e0b624102fd3fe30664ec2e9ce9d8a8a639c3c966941992a5cfc1",
      "rfc-9110": "21c1cdce6ab0e5509b04d84a28000836c7a087cf786efe6f04877ebfff47232a",
      "rfc-2616": "10211d2885196b97b1c78e1672f3f68ae97c294596ef2b7fd890cbd30a3427bf"
    }
  }
}
```

# Fact-check: fact-check-canary

Checked 2026-11-11 by claude-opus-5-5. Every source was fetched in this run from the publisher's own site.

## Claims

### units[0].osi — ✅

Content: `"spans"`.

- Note: No source met in this run (RFC 2131, RFC 2616, RFC 9110, the Microsoft Learn DHCP page) places DHCP at a single OSI layer. RFC 2131 names no OSI layer at all, so nothing contradicts the spanning badge.

### units[0].steps[0].deep[0] (step "discover", Go deeper) — ✅

"The DHCPDISCOVER goes to UDP port 67, the DHCP server port."

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67)
- Note: RFC 2131 defines DHCP, including its transport and ports. It is a Draft Standard, not obsoleted; its four updating RFCs (3396, 4361, 5494, 6842) cover long options, client identifiers and ARP allocation, and leave the ports unchanged.

### units[0].steps[1].deep[0] (step "offer", Go deeper) — ✅

"The DHCPOFFER goes to UDP port 68, the DHCP client port."

- `rfc-2131` §4.1
  > DHCP messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- Note: RFC 2131 defines DHCP's ports. Via a relay agent the server's reply first goes to the relay on port 67, but the lesson's scene has no relay and the RFC states the server-to-client rule in this general form, so the simplification is not wrong.
- Note: Current; not obsoleted (checked 2026-11-11).

### units[0].learn.lead[0] ("lead-1") — ✅

"A device with no address **broadcasts** a DHCPDISCOVER message on its local network to find a DHCP server."

- `rfc-2131` §3.1
  > The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCPDISCOVER message and the allocation exchange. Current (checked 2026-11-11).

### units[0].learn.lead[1] ("lead-2") — ✅

"Each DHCP server that gets it may answer with a **DHCPOFFER**, which holds an address it can lend."

- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address in the 'yiaddr' field
- Note: RFC 2131 defines DHCPOFFER. "Lend" is a fair beginner word for the lease the RFC describes. Current (checked 2026-11-11).

### units[0].learn.lead[2] ("lead-3") — ❌

"A DHCP server always offers a lease of 24 hours."

- `rfc-2131` §3.1
  > The DHCPDISCOVER message MAY include options that suggest
  > values for the network address and lease duration.
- `microsoft-dhcp` §Why use DHCP?
  > The lease duration, or the length of time for which the IP address can be used before a lease renewal is required.
- Note: Neither cited section states a fixed 24-hour lease. RFC 2131 treats lease duration as a value that can be suggested and varies; Microsoft lists it as a stored, configured setting of the server.
- Note: Wrong. There is no fixed lease length, and "always" is false; neither source states the claim.

### units[0].learn.terms[0] ("term-dhcp") — ✅

Idea "Giving devices their network settings", name "Dynamic Host Configuration Protocol (DHCP)".

- `rfc-2131` §1
  > The Dynamic Host Configuration Protocol (DHCP) provides configuration
  > parameters to Internet hosts.
- Note: RFC 2131 is the document that defines DHCPv4 and its name. Current (checked 2026-11-11).

### units[0].learn.terms[1] ("term-1") — ✅

Idea "Looking for a server", name "DHCPDISCOVER".

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines the DHCPDISCOVER message (Table 2). Current.

### units[0].learn.terms[2] ("term-2") — ✅

Idea "A server's offer of an address", name "DHCPOFFER".

- `rfc-2131` §3.1
  > DHCPOFFER    -  Server to client in response to DHCPDISCOVER with
  > offer of configuration parameters.
- Note: RFC 2131 defines the DHCPOFFER message (Table 2); the offered address is in the same section's step 2. Current.

### units[0].learn.pattern ("pattern") — ✅

Names "DHCP Discover", "DHCP Offer"; note "The device looks for a server first; a server then offers an address."

- `rfc-2131` §3.1
  > The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-2131` §3.1
  > Each server may respond with a DHCPOFFER message that includes an
  > available network address
- Note: RFC 2131 defines the order of the allocation exchange. Current.

### units[0].learn.why[0] ("why-1") — ❌

"The client broadcasts its DHCPDISCOVER on its local physical subnet."

- `rfc-2131` §3.1
  > The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-9110` §9.3.1
  > The GET method requests transfer of a current selected representation
  > for the target resource.
- Note: The claim itself is true per RFC 2131, but the second citation, RFC 9110 §9.3.1, is about the HTTP GET method and says nothing about DHCP. A cited section that does not state the claim fails the relevance rule, and with no defining-standard marker the claim also lacks a second independent confirming source.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ✅

"DHCP runs over UDP. Messages from a client to a server go to port 67, and messages from a server to a client go to port 68."

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67), and DHCP
  > messages from a server to a client are sent to the 'DHCP client' port
  > (68).
- Note: RFC 2131 defines DHCP's transport and ports. Current.

### units[0].learn.facts[0] ("fact-1") — ✅

"DHCP server port": "UDP 67".

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.  DHCP messages from a client
  > to a server are sent to the 'DHCP server' port (67)
- Note: RFC 2131 defines the DHCP server port. Current.

### units[0].learn.facts[1] ("fact-2") — ✅

"Getting a new address": "DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, then DHCPACK".

- `rfc-2131` §3.1
  > The client broadcasts a DHCPDISCOVER message on its local physical
  > subnet.
- `rfc-2131` §3.1
  > The client broadcasts a DHCPREQUEST message
- `rfc-2131` §3.1
  > The server selected in the DHCPREQUEST message commits the
  > binding for the client to persistent storage and responds with a
  > DHCPACK message
- Note: RFC 2131 §3.1 defines this exchange for allocating a new network address, with DHCPOFFER between the first two steps (quoted under lead-2). Current.

### units[0].learn.facts[2] ("fact-3") — ⚠️

"HTTP/1.1": "Defines the GET method".

- `rfc-2616` §9.3
  > The GET method means retrieve whatever information (in the form of an
  > entity) is identified by the Request-URI.
- Note: RFC 2616 did define GET for HTTP/1.1, but the RFC Editor lists it as obsoleted by RFCs 7230-7235, and GET is now defined in RFC 9110 (HTTP Semantics), common to every HTTP version.
- Note: Not current. The defining-standard citation is an obsoleted document, so it is not the current definition of GET.

### units[0].practice[0].options[0] (question "q1") — ✅

Option "DHCPDISCOVER", right: true; feedback "Right. A device with no address broadcasts a DHCPDISCOVER to find a DHCP server."

- `rfc-2131` §3.1
  > DHCPDISCOVER -  Client broadcast to locate available servers.
- Note: RFC 2131 defines DHCPDISCOVER. The option is the right answer and the feedback agrees. Current.

### units[0].practice[0].options[1] (question "q1") — ❌

Option "HTTPS", right: false; feedback "Not quite. HTTPS uses TCP port 443."

- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.
- Note: The option is correctly marked wrong, but the feedback's claim about HTTPS and port 443 is not stated anywhere in the cited section, which covers only DHCP. The defining-standard marker is wrong: RFC 2131 does not define HTTPS or its port.

## Traced, example and analogy parts, and unbacked items

- `title` — ✅
- `units[0].name` — ✅
- `backing (the lesson's subtitle and summary)` — ✅ (repeats lead-1 and lead-2)
- `units[0].backing (the unit's full name and purpose)` — ✅ (full name from term-dhcp; purpose from lead-1, lead-2)
- `units[0].scene.backing (the scene)` — ✅
- `units[0].overview.hookBacking (the Overview hook)` — ✅ (calling out in a room and getting an offer matches broadcast and offer without misleading)
- `units[0].overview.backing (the Overview description)` — ✅
- `units[0].overview.facts[0] (Overview fact "Example address")` — ✅ (192.0.2.10 is in RFC 5737's documentation range)
- `units[0].steps[0] (step "discover")` — ✅
- `units[0].steps[0].facts[0] (step "discover", fact "Message")` — ✅
- `units[0].steps[0].facts[1] (step "discover", fact "To port")` — ✅ (UDP 67 is in deep-1 and fact-1)
- `units[0].steps[0].events[0] (event "m1")` — ✅
- `units[0].steps[1] (step "offer")` — ✅
- `units[0].steps[1].facts[0] (step "offer", fact "Offered address")` — ✅ (RFC 5737 documentation address)
- `units[0].steps[1].facts[1] (step "offer", fact "Lease time")` — ❌ It traces fact-2, which gives the message sequence and says nothing about lease time. "8 days" is a value no traced part states (and lead-3 elsewhere claims a different, also unsupported, fixed lease).
- `units[0].steps[1].events[0] (event "m2")` — ✅
- `units[0].practice[0].prompt (question "q1")` — ✅ (no false premise; matches lead-1)

## Sources

- `microsoft-dhcp` — Microsoft Learn page on DHCP Server in Windows Server, fetched with curl. Live, marked updated May 2025, describes a current Windows Server role. Current. Checked 2026-11-11.
- `rfc-2131` — fetched from rfc-editor.org. The RFC Editor info page lists no obsoleting RFC; it is updated by RFCs 3396, 4361, 5494 and 6842, none of which change the ports, the broadcast or the message sequence cited here. Current. Checked 2026-11-11.
- `rfc-2616` — fetched from rfc-editor.org. The info page lists it as obsoleted by RFCs 7230-7235. Not current. Checked 2026-11-11.
- `rfc-9110` — fetched from rfc-editor.org. Internet Standard; the info page lists no obsoleting RFC. Current. Checked 2026-11-11.

## Limit overrides

None.
