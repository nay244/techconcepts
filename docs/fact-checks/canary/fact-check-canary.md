```json fact-check
{
  "slug": "fact-check-canary",
  "hash": "d596a10e930a1efe5956be6d5fd847eaa0241d2b49300c3ee793030cabc14d4b",
  "checked": "2026-11-08",
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
    "units[0].steps[1].facts[1] (step \"offer\", fact \"Lease time\")": "⚠️",
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
    {
      "id": "microsoft-dhcp",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "rfc-2131",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "rfc-2616",
      "current": false,
      "checked": "2026-11-08",
      "note": "Obsoleted by RFC 7230-7235 (RFC Editor info page); RFC 9110 now obsoletes RFC 7230 (portions), 7231, 7232, 7233 and 7235. GET is now defined in RFC 9110 Section 9.3.1."
    },
    {
      "id": "rfc-9110",
      "current": true,
      "checked": "2026-11-08"
    }
  ],
  "overrides": []
}
```

# Fact-check: fact-check-canary

Checked 2026-11-08 by claude-opus-5-5, from the claim sheet only. Every source was fetched from its publisher in this run: the RFCs as raw text from rfc-editor.org, their status from the RFC Editor info pages, and the Microsoft Learn page as HTML from learn.microsoft.com.

Verdicts: 29 ✅, 2 ⚠️, 3 ❌.

## 1. Claims

### units[0].osi: ✅

Badge: `"spans"` (no single layer; no citations).

- Per the rule for `'spans'`: no allowed source met in this run puts DHCP at a single OSI layer. RFC 2131 (and its updates RFC 3396, 4361, 5494 and 6842), the Microsoft Learn DHCP page, RFC 9110 and RFC 2616 were all searched; none assigns DHCP to a layer. The nearest RFC 2131 text speaks only of DHCP carrying "the network layer parameters" (§1.6), which does not place DHCP itself at a layer.
- Currency: the sources it was checked against are current (see Sources), except RFC 2616, which is about HTTP and has no bearing here.

### units[0].steps[0].deep[0] (step "discover", Go deeper): ✅

"The DHCPDISCOVER goes to UDP port 67, the DHCP server port."

- RFC 2131 §4.1 (defining standard: the DHCP message transport, including its UDP ports). Passage: "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67)". §3.1, Table 2, confirms the DHCPDISCOVER is a client message: "DHCPDISCOVER -  Client broadcast to locate available servers."
- Currency: RFC 2131 is not obsoleted. Its updates (RFC 3396, 4361, 5494, 6842) cover option concatenation, client identifiers and ARP number allocation; none changes the ports.

### units[0].steps[1].deep[0] (step "offer", Go deeper): ✅

"The DHCPOFFER goes to UDP port 68, the DHCP client port."

- RFC 2131 §4.1 (defining standard: the DHCP message transport, including its UDP ports). Passage: "DHCP messages from a server to a client are sent to the 'DHCP client' port (68)." §3.1, Table 2: "DHCPOFFER    -  Server to client in response to DHCPDISCOVER".
- Note: when the request came through a relay agent, §4.1 has the server send its reply to the relay agent's "'DHCP server' port". That message goes to the relay, not the client, so the claim about the offer sent to the client still holds in this lesson's single-network setting.
- Currency: as above; no update changes the ports.

### units[0].learn.lead[0] ("lead-1"): ✅

"A device with no address **broadcasts** a DHCPDISCOVER message on its local network to find a DHCP server."

- RFC 2131 §3.1 (defining standard: the DHCP client-server exchange for allocating an address, and its messages). Passage: "1. The client broadcasts a DHCPDISCOVER message on its local physical subnet." and Table 2: "DHCPDISCOVER -  Client broadcast to locate available servers." The "no address" condition is the section's own scope: "If the client already knows its address, some steps may be omitted; this abbreviated interaction is described in section 3.2."
- Currency: RFC 2131 not obsoleted; its updates do not change this exchange.

### units[0].learn.lead[1] ("lead-2"): ✅

"Each DHCP server that gets it may answer with a **DHCPOFFER**, which holds an address it can lend."

- RFC 2131 §3.1 (defining standard: the DHCP exchange and its messages). Passage: "2. Each server may respond with a DHCPOFFER message that includes an available network address in the 'yiaddr' field". "An address it can lend" is a fair beginner wording of an address offered under DHCP's leasing model.
- Currency: as above.

### units[0].learn.lead[2] ("lead-3"): ❌

"A DHCP server always offers a lease of 24 hours."

- RFC 2131 §3.1: does not state it. It says lease length is negotiable: "The DHCPDISCOVER message MAY include options that suggest values for the network address and lease duration."
- Microsoft Learn, Why use DHCP?: does not state it. It lists the lease length as configuration the server keeps: "The lease duration, or the length of time for which the IP address can be used before a lease renewal is required."
- Further, RFC 2131 §4.3.1 contradicts it: "the server assigns a locally configured default lease time", and if the client requested a lease, "the server may choose either to return the requested lease ... or select another lease."
- Currency: both sources are current.
- What is wrong: the claim is false (lease length is configured or negotiated, not always 24 hours), and neither cited section states it.

### units[0].learn.terms[0] ("term-dhcp"): ✅

"Dynamic Host Configuration Protocol (DHCP)": "Giving devices their network settings".

- RFC 2131 §1 (defining standard: DHCP itself). Passage: "The Dynamic Host Configuration Protocol (DHCP) provides configuration parameters to Internet hosts."
- Currency: RFC 2131 not obsoleted.

### units[0].learn.terms[1] ("term-1"): ✅

"DHCPDISCOVER": "Looking for a server".

- RFC 2131 §3.1 (defining standard: the DHCPDISCOVER message). Passage: "DHCPDISCOVER -  Client broadcast to locate available servers."
- Currency: as above.

### units[0].learn.terms[2] ("term-2"): ✅

"DHCPOFFER": "A server's offer of an address".

- RFC 2131 §3.1 (defining standard: the DHCPOFFER message). Passage: "DHCPOFFER    -  Server to client in response to DHCPDISCOVER with offer of configuration parameters." and "a DHCPOFFER message that includes an available network address in the 'yiaddr' field".
- Currency: as above.

### units[0].learn.pattern ("pattern"): ✅

"DHCP Discover", "DHCP Offer": "The device looks for a server first; a server then offers an address."

- RFC 2131 §3.1 (defining standard: the order of the DHCP exchange). Passages: step 1, "The client broadcasts a DHCPDISCOVER message on its local physical subnet.", then step 2, "Each server may respond with a DHCPOFFER message that includes an available network address".
- Currency: as above.

### units[0].learn.why[0] ("why-1"): ❌

"The client broadcasts its DHCPDISCOVER on its local physical subnet."

- RFC 2131 §3.1 (not marked defining standard): states it. Passage: "The client broadcasts a DHCPDISCOVER message on its local physical subnet."
- RFC 9110 §9.3.1: does not state it at all. The section defines the HTTP GET method: "The GET method requests transfer of a current selected representation for the target resource."
- Currency: both sources are current.
- What is wrong: the second citation (RFC 9110 §9.3.1, HTTP GET) says nothing about DHCP, so a cited section does not state the claim; with no second independent source and no defining-standard marker, the claim is also unconfirmed. The claim itself is true.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper): ✅

"DHCP runs over UDP. Messages from a client to a server go to port 67, and messages from a server to a client go to port 68."

- RFC 2131 §4.1 (defining standard: the DHCP transport and ports). Passage: "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67), and DHCP messages from a server to a client are sent to the 'DHCP client' port (68)."
- Currency: RFC 2131 not obsoleted; RFC 3396 edits one sentence of §4.1 about repeated options, not the ports.

### units[0].learn.facts[0] ("fact-1"): ✅

"DHCP server port": "UDP 67".

- RFC 2131 §4.1 (defining standard: the DHCP ports). Passage: "DHCP uses UDP as its transport protocol.  DHCP messages from a client to a server are sent to the 'DHCP server' port (67)".
- Currency: as above.

### units[0].learn.facts[1] ("fact-2"): ✅

"Getting a new address": "DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, then DHCPACK".

- RFC 2131 §3.1 (defining standard: the exchange for allocating a new address). Passages: step 3, "The client broadcasts a DHCPREQUEST message that MUST include the 'server identifier' option to indicate which server it has selected", and step 4, "The server selected in the DHCPREQUEST message commits the binding for the client to persistent storage and responds with a DHCPACK message". Figure 3 is titled "Timeline diagram of messages exchanged between DHCP client and servers when allocating a new network address" and shows DHCPDISCOVER, DHCPOFFER, DHCPREQUEST, DHCPACK in that order.
- Currency: as above.

### units[0].learn.facts[2] ("fact-3"): ⚠️

"HTTP/1.1": "Defines the GET method".

- RFC 2616 §9.3 (marked defining standard): states it. Passage: "The GET method means retrieve whatever information (in the form of an entity) is identified by the Request-URI."
- Currency: not current. The RFC Editor info page for RFC 2616 says "This RFC is now obsolete" and lists it as obsoleted by RFC 7230 to 7235. RFC 9110 now defines the method for every HTTP version. Its abstract says it "defines aspects of the protocol that are shared by all versions", and §9.3.1 defines GET.
- What is wrong: the only citation is an obsoleted RFC, so it is no longer the current defining document. Saying "HTTP/1.1 defines GET" describes the superseded arrangement. (The fact also has nothing to do with this DHCP lesson.)

### units[0].practice[0].options[0] (question "q1"): ✅

Option "DHCPDISCOVER", `right: true`, feedback: "Right. A device with no address broadcasts a DHCPDISCOVER to find a DHCP server."

- RFC 2131 §3.1 (defining standard: the DHCPDISCOVER message and its use). Passage: "The client broadcasts a DHCPDISCOVER message on its local physical subnet." and "DHCPDISCOVER -  Client broadcast to locate available servers." The feedback is correct for a right answer.
- Currency: as above.

### units[0].practice[0].options[1] (question "q1"): ❌

Option "HTTPS", `right: false`, feedback: "Not quite. HTTPS uses TCP port 443."

- RFC 2131 §4.1 (marked defining standard): does not state it. The section covers DHCP over UDP ports 67 and 68 only. It says nothing about HTTPS or port 443.
- Currency: RFC 2131 is current, but it is not about HTTPS.
- What is wrong: the defining-standard marker is on a document that does not define HTTPS or its port, and the cited section does not state the feedback's claim. "Not quite" is right for a wrong option, but the port claim is unsupported by its citation.

## 2. Traced, example, analogy and unbacked parts

- `title`: ✅ ("DHCP canary" makes no claim.)
- `units[0].name`: ✅
- `backing (the lesson's subtitle and summary)`: ✅ (repeats lead-1 and lead-2, including "may answer".)
- `units[0].backing (the unit's full name and purpose)`: ✅ (full name from term-dhcp; purpose from lead-1 and lead-2.)
- `units[0].scene.backing (the scene)`: ✅ ("Local network", Broadcast and Reply, Laptop and "DHCP server" all trace to lead-1 and lead-2. The `place` value "router" is a scene slot; the label the reader sees is "DHCP server".)
- `units[0].overview.hookBacking (the Overview hook)`: ✅ (analogy: calling out to a room for a seat, with whoever can answering with an offer, fairly maps the broadcast and the offers from one or more servers.)
- `units[0].overview.backing (the Overview description)`: ✅
- `units[0].overview.facts[0] (Overview fact "Example address")`: ✅ (192.0.2.10 is in the RFC 5737 range 192.0.2.0/24.)
- `units[0].steps[0] (step "discover")`: ✅
- `units[0].steps[0].facts[0] (step "discover", fact "Message")`: ✅
- `units[0].steps[0].facts[1] (step "discover", fact "To port")`: ✅ ("UDP 67" is stated by deep-1 and fact-1.)
- `units[0].steps[0].events[0] (event "m1")`: ✅
- `units[0].steps[1] (step "offer")`: ✅
- `units[0].steps[1].facts[0] (step "offer", fact "Offered address")`: ✅ (192.0.2.10, RFC 5737.)
- `units[0].steps[1].facts[1] (step "offer", fact "Lease time")`: ⚠️ What is wrong: "8 days" is a value that its traced part, fact-2 (the DISCOVER, OFFER, REQUEST, ACK sequence), does not state, and no Learn part gives a lease time of 8 days (lead-3 even claims 24 hours). It is not example-kind either, so it adds a claim.
- `units[0].steps[1].events[0] (event "m2")`: ✅
- `units[0].practice[0].prompt (question "q1")`: ✅ (no false premise; matches lead-1.)

## 3. Sources

- `rfc-2131` (RFC 2131, Dynamic Host Configuration Protocol): current. Checked 2026-11-08. Text from https://www.rfc-editor.org/rfc/rfc2131.txt. The info page https://www.rfc-editor.org/info/rfc2131 lists no "Obsoleted by". It lists "Updated by" RFC 3396, 4361, 5494 and 6842, and all four were fetched and read: option concatenation (it deletes one §4.1 sentence on repeated options), client-identifier format and handling, ARP IANA rules, and returning the client identifier in server replies. None affects the ports, the broadcast DHCPDISCOVER, the DHCPOFFER or the DISCOVER-OFFER-REQUEST-ACK sequence.
- `rfc-2616` (RFC 2616, HTTP/1.1): not current. Checked 2026-11-08. The info page https://www.rfc-editor.org/info/rfc2616 says "This RFC is now obsolete" and lists it as obsoleted by RFC 7230, 7231, 7232, 7233, 7234 and 7235. RFC 9110's own info page and abstract show it obsoletes RFC 7231, 7232, 7233, 7235 and portions of 7230.
- `rfc-9110` (RFC 9110, HTTP Semantics, STD 97): current. Checked 2026-11-08. Text from https://www.rfc-editor.org/rfc/rfc9110.txt. Its info page lists no "Obsoleted by" and no "Updated by"; it is an Internet Standard.
- `microsoft-dhcp` (Microsoft Learn, What is DHCP Server in Windows Server?): current. Checked 2026-11-08. The page is live at its canonical learn.microsoft.com URL, written by Microsoft, last updated 2025-05-13, and applies to Windows Server 2025, 2022, 2019 and 2016 (current products). It is vendor documentation, an allowed kind.

All four sources are allowed kinds: three IETF RFCs from the RFC Editor, and Microsoft's own documentation.

## 4. Limit overrides

None.
