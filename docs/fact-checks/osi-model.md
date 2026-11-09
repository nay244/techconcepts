```json fact-check
{
  "slug": "osi-model",
  "hash": "946620ebb33931689c4a74f2a931c3718af56a77b1361466cf1a504773a7c812",
  "checked": "2026-11-08",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].osi": "✅",
    "backing (the lesson's subtitle and summary)": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].scene.backing (the scene)": "⚠️",
    "units[0].overview.hookBacking (the Overview hook)": "✅",
    "units[0].overview.backing (the Overview description)": "✅",
    "units[0].overview.facts[0] (Overview fact \"Layers\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Example\")": "✅",
    "units[0].steps[0] (step \"application\")": "✅",
    "units[0].steps[0].facts[0] (step \"application\", fact \"Layer\")": "✅",
    "units[0].steps[0].facts[1] (step \"application\", fact \"Adds\")": "✅",
    "units[0].steps[0].events[0] (event \"laptop-7\")": "✅",
    "units[0].steps[1] (step \"encapsulation\")": "✅",
    "units[0].steps[1].facts[0] (step \"encapsulation\", fact \"Layers\")": "✅",
    "units[0].steps[1].facts[1] (step \"encapsulation\", fact \"Each one adds\")": "✅",
    "units[0].steps[1].facts[2] (step \"encapsulation\", fact \"Called\")": "✅",
    "units[0].steps[1].events[0] (event \"laptop-6\")": "✅",
    "units[0].steps[1].events[1] (event \"laptop-5\")": "✅",
    "units[0].steps[1].events[2] (event \"laptop-4\")": "✅",
    "units[0].steps[1].events[3] (event \"laptop-3\")": "✅",
    "units[0].steps[1].events[4] (event \"laptop-2\")": "✅",
    "units[0].steps[2] (step \"physical\")": "✅",
    "units[0].steps[2].facts[0] (step \"physical\", fact \"Layer\")": "✅",
    "units[0].steps[2].facts[1] (step \"physical\", fact \"Sends\")": "✅",
    "units[0].steps[2].events[0] (event \"laptop-1\")": "✅",
    "units[0].steps[2].events[1] (event \"bits-to-router\")": "✅",
    "units[0].steps[3] (step \"relay\")": "✅",
    "units[0].steps[3].facts[0] (step \"relay\", fact \"Uses\")": "✅",
    "units[0].steps[3].facts[1] (step \"relay\", fact \"Reads\")": "⚠️",
    "units[0].steps[3].events[0] (event \"router-1\")": "⚠️",
    "units[0].steps[3].events[1] (event \"router-2\")": "⚠️",
    "units[0].steps[3].events[2] (event \"router-3\")": "⚠️",
    "units[0].steps[3].events[3] (event \"router-2-down\")": "⚠️",
    "units[0].steps[3].events[4] (event \"router-1-down\")": "⚠️",
    "units[0].steps[3].events[5] (event \"bits-to-server\")": "✅",
    "units[0].steps[4] (step \"decapsulation\")": "✅",
    "units[0].steps[4].facts[0] (step \"decapsulation\", fact \"Order\")": "✅",
    "units[0].steps[4].facts[1] (step \"decapsulation\", fact \"Each layer\")": "✅",
    "units[0].steps[4].events[0] (event \"server-1\")": "✅",
    "units[0].steps[4].events[1] (event \"server-2\")": "✅",
    "units[0].steps[4].events[2] (event \"server-3\")": "✅",
    "units[0].steps[4].events[3] (event \"server-4\")": "✅",
    "units[0].steps[4].events[4] (event \"server-5\")": "✅",
    "units[0].steps[4].events[5] (event \"server-6\")": "✅",
    "units[0].steps[4].events[6] (event \"server-7\")": "✅",
    "units[0].steps[5] (step \"peer-layers\")": "⚠️",
    "units[0].steps[5].facts[0] (step \"peer-layers\", fact \"Layers 4 to 7\")": "✅",
    "units[0].steps[5].facts[1] (step \"peer-layers\", fact \"Layers 1 to 3\")": "✅",
    "units[0].steps[5].events[0] (event \"peer-7\")": "✅",
    "units[0].steps[5].events[1] (event \"peer-6\")": "✅",
    "units[0].steps[5].events[2] (event \"peer-5\")": "✅",
    "units[0].steps[5].events[3] (event \"peer-4\")": "✅",
    "units[0].steps[5].events[4] (event \"peer-3\")": "✅",
    "units[0].steps[5].events[5] (event \"peer-2\")": "✅",
    "units[0].steps[5].events[6] (event \"peer-1\")": "✅",
    "units[0].steps[0].deep[0] (step \"application\", Go deeper)": "✅",
    "units[0].steps[1].deep[0] (step \"encapsulation\", Go deeper)": "⚠️",
    "units[0].steps[2].deep[0] (step \"physical\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"relay\", Go deeper)": "✅",
    "units[0].steps[4].deep[0] (step \"decapsulation\", Go deeper)": "✅",
    "units[0].steps[5].deep[0] (step \"peer-layers\", Go deeper)": "⚠️",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "⚠️",
    "units[0].learn.lead[2] (\"lead-3\")": "⚠️",
    "units[0].learn.lead[3] (\"lead-4\")": "⚠️",
    "units[0].learn.lead[4] (\"lead-5\")": "⚠️",
    "units[0].learn.lead[5] (\"lead-6\")": "⚠️",
    "units[0].learn.lead[6] (\"lead-7\")": "✅",
    "units[0].learn.terms[0] (\"term-layer\")": "⚠️",
    "units[0].learn.terms[1] (\"term-header\")": "⚠️",
    "units[0].learn.terms[2] (\"term-encap\")": "✅",
    "units[0].learn.terms[3] (\"term-decap\")": "✅",
    "units[0].learn.terms[4] (\"term-peer\")": "⚠️",
    "units[0].learn.terms[5] (\"term-relay\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "⚠️",
    "units[0].learn.why[0] (\"why-1\")": "⚠️",
    "units[0].learn.why[1] (\"why-2\")": "⚠️",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "⚠️",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[2] (\"deep-3\", Learn's Go deeper)": "⚠️",
    "units[0].learn.facts[0] (\"fact-1\")": "✅",
    "units[0].learn.facts[1] (\"fact-2-top\")": "✅",
    "units[0].learn.facts[2] (\"fact-2-bottom\")": "✅",
    "units[0].learn.facts[3] (\"fact-3\")": "✅",
    "units[0].practice[0].options[0] (question \"going-down\")": "⚠️",
    "units[0].practice[0].options[1] (question \"going-down\")": "⚠️",
    "units[0].practice[0].options[2] (question \"going-down\")": "⚠️",
    "units[0].practice[1].options[0] (question \"router-layers\")": "⚠️",
    "units[0].practice[1].options[1] (question \"router-layers\")": "⚠️",
    "units[0].practice[1].options[2] (question \"router-layers\")": "⚠️",
    "units[0].practice[2].options[0] (question \"layer-4\")": "✅",
    "units[0].practice[2].options[1] (question \"layer-4\")": "✅",
    "units[0].practice[2].options[2] (question \"layer-4\")": "✅",
    "units[0].practice[2].options[3] (question \"layer-4\")": "✅",
    "units[0].practice[0].prompt (question \"going-down\")": "✅",
    "units[0].practice[1].prompt (question \"router-layers\")": "✅",
    "units[0].practice[2].prompt (question \"layer-4\")": "✅"
  },
  "sources": [
    {
      "id": "cisco-ipip-decap",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "itu-x200",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "microsoft-osi",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "nist-sp800-77r1",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-08"
    },
    {
      "id": "rfc-2003",
      "current": true,
      "checked": "2026-11-08"
    }
  ],
  "overrides": []
}
```

# Fact-check: osi-model

Checked 2026-11-08 by claude-opus-5-5 against sheet hash `946620eb…a7c812`.

**99 items: 70 ✅, 29 ⚠️, 0 ❌.** The lesson does not pass.

The ⚠️ verdicts come from five causes:

1. **Layer numbers that the part's own citations don't state.** X.200 numbers the layers only in 6.1.2. These parts give a number but cite other sections: `steps[1].deep[0]`, `steps[5].deep[0]`, lead-5, why-2 and the three `router-layers` options.
2. **Every layer's control information is called a header in front.** X.200 never uses the word "header", and its Figure 9 Note 2 says no position is implied. NIST says the units are only "typically" a header and a payload. This affects lead-3, lead-6 and the right `going-down` option.
3. **Sub-claims with only one source**, and no defining-standard citation that states them: lead-2, lead-4, term-layer, term-header, term-peer, pattern and why-1.
4. **Precision:** deep-1, deep-3, and the second and third `going-down` options.
5. **Watch at the router.** Five router events and one router fact use Learn parts that their Traces lines don't name. The labels panel also shows header 2 going through the router without being removed or replaced. Separately, the peer-layers step says "only ever".

How I read the parts:

- **Traced items.** The `where` and `layer` columns and the header numbers are treated as scene coordinates, backed by the scene item. The laptop and the web server are the example scenario (Overview fact "Example"). Everything else in a traced item is judged against that item's own `Traces:` line: the narrative, the plain text, the facts and the labels panel.
- **Quotes.** ITU-T, Microsoft and Cisco passages are quoted as short excerpts. RFC and NIST passages are quoted as sentences.

---

## 1. Claims

### units[0].osi — ✅

Content: `"spans"`. The topic is the OSI model itself. The item carries no citations.

- No allowed source I read in this run puts the OSI model at a single layer.
- X.200 6.1.2 defines it as all seven layers: "The Reference Model contains seven layers".

Currency: X.200 (07/94) is in force.

### units[0].steps[0].deep[0] (step "application", Go deeper) — ✅

> In X.200, the Application Layer is an application's only way into the OSI environment. As the highest layer, it has no boundary with a layer above it.

- **ITU-T X.200, 7.1.2.1.** Defining standard: X.200 defines the OSI Application Layer and its purpose. It says the layer "provides the sole means for the application process to access the OSIE", and "Hence the Application Layer has no boundary with a higher layer".

Currency: X.200 (07/94) is in force.

### units[0].steps[1].deep[0] (step "encapsulation", Go deeper) — ⚠️

> Layer 6, the Presentation Layer, gives the applications at both ends a common representation of the data they send. Layer 5, the Session Layer, lets the two ends organize and synchronize their dialogue and manage their data exchange.

- **ITU-T X.200, 7.2.2.2.** Defining standard: the Presentation Layer's purpose. It "provides for common representation of the data transferred between application-entities".
- **ITU-T X.200, 7.3.2.1.** Defining standard: the Session Layer's purpose. It lets presentation-entities "to organize and to synchronize their dialogue and to manage their data exchange".

Currency: X.200 (07/94) is in force.

**What's wrong:** neither 7.2.2.2 nor 7.3.2.1 states "Layer 6" or "Layer 5". X.200 gives layer numbers only in 6.1.2, which this part does not cite. Add X.200 6.1.2.

### units[0].steps[2].deep[0] (step "physical", Go deeper) — ✅

> The Physical Layer provides the means to transmit bits over a physical medium. Just above it, the Data Link Layer recognizes a run of those bits as one unit of its own, which is sometimes called framing. It also detects errors that happen in the Physical Layer.

- **ITU-T X.200, 7.7.2.** Defining standard: the Physical Layer's purpose. It provides "physical-connections for bit transmission between data-link-entities", and "Physical Layer entities are interconnected by means of a physical medium". Because the layer serves data-link-entities, the Data Link Layer is the one just above it.
- **ITU-T X.200, 7.6.4.5.** Defining standard: the Data Link Layer's delimiting function. It provides "recognition of a sequence of physical-service-data-units (i.e. bits, see 7.7.3.2)" as a data-link-protocol-data-unit, and adds "These functions are sometimes referred to as framing."
- **ITU-T X.200, 7.6.2.2.** Defining standard: the Data Link Layer's purpose. The Data Link Layer "detects and possibly corrects errors which may occur in the Physical Layer".
- **Microsoft Learn, Physical layer.** The layer manages the "transmission of the unstructured raw bit stream over a physical medium". This is a second source for the first sentence.

Currency: X.200 is in force. The Microsoft page is live (ms.date 2025-01-31).

### units[0].steps[3].deep[0] (step "relay", Go deeper) — ✅

> In X.200, a system that only passes data on to other systems is a relay open system, and the functions that forward data are in its lower layers.

- **ITU-T X.200, 6.1.6.** Defining standard: relay open systems. Some open systems "act only as relay open systems, passing data to other open systems". The functions that "support the forwarding of data are then provided in the lower layers". Figure 12 draws the relay system with only the lower layers.

Currency: X.200 is in force.

### units[0].steps[4].deep[0] (step "decapsulation", Go deeper) — ✅

> In X.200, what a layer carries for the layer above is a service-data-unit. It keeps its identity on the way between the twin layers above, and the layer carrying it does not interpret it.

- **ITU-T X.200, 5.6.1.4.** Defining standard: the (N)-service-data-unit. It is information "whose identity is preserved when transferred between peer-(N+1)-entities", and it is "not interpreted by the supporting (N)-entities".

Currency: X.200 is in force.

### units[0].steps[5].deep[0] (step "peer-layers", Go deeper) — ⚠️

> In X.200, how twin layers work together is governed by that layer's protocol. Transport protocols, at layer 4, run only between the two end systems.

- **ITU-T X.200, 5.2.2.7.** Defining standard: (N)-protocols. "Cooperation between (N)-entities is governed by one or more (N)-protocols."
- **ITU-T X.200, 7.4.2.3.** Defining standard: the Transport Layer's purpose. "transport-protocols operate only between OSI end open systems".

Currency: X.200 is in force.

**What's wrong:** "at layer 4" is not stated by 5.2.2.7 or 7.4.2.3. Only 6.1.2 numbers the layers. Add X.200 6.1.2.

### units[0].learn.lead[0] ("lead-1") — ✅

> The **OSI model** splits networking into **seven layers**, numbered from 1 at the bottom to 7 at the top: Physical, Data Link, Network, Transport, Session, Presentation and Application.

- **ITU-T X.200, 6.1.2.** Defining standard: the seven OSI layers, with their names and numbers. "The Reference Model contains seven layers". The list runs from "the Application Layer (layer 7)" down to "the Physical Layer (layer 1)". In X.200's numbering, the (N+1)-layer sits above the (N)-layer, so layer 7 is the top. Figure 11, introduced on the same page, draws the layers the same way.

Currency: X.200 is in force.

### units[0].learn.lead[1] ("lead-2") — ⚠️

> OSI is short for Open Systems Interconnection. Each layer has its own job, and each one except the top offers a service to the layer above it.

- **ITU-T X.200, 5.2.2.3.** Defining standard: the layer service relationship. "Except for the highest layer, each (N)-layer provides (N+1)-entities … with an (N)-service".
- **Microsoft Learn, Introduction.** "The ISO Open Systems Interconnection (OSI) Reference model". Each layer has "a specific set of functions allocated to each layer", and "Each layer offers specific services to higher layers".

Currency: X.200 is in force. The Microsoft page is live.

**What's wrong:** two of the three claims rest on Microsoft alone: the expansion of "OSI" and "Each layer has its own job". X.200 5.2.2.3 states neither. Only the service claim has two sources. To fix it, cite X.200 1.2 for the expansion, and a section that gives each layer its own functions, such as X.200 5.2.2.5.

### units[0].learn.lead[2] ("lead-3") — ⚠️

> On the way down, each layer adds its own control information in front of what the layer above handed it. That information is the layer's **header**.

- **ITU-T X.200, 5.6.1.1.** Defining standard: protocol-control-information. "Information exchanged between (N)-entities to co-ordinate their joint operation."
- **ITU-T X.200, 5.6.1.3.** Defining standard: the protocol-data-unit, "consisting of (N)-protocol-control-information and possibly (N)-user-data".
- **NIST SP 800-77r1, 2.1, footnote 6.** "At each layer, the logical units are typically composed of a header and a payload. The payload consists of the information passed down from the previous layer, while the header contains layer-specific information such as addresses."
- **RFC 1122, 1.3.3.** "A segment consists of a TCP header followed by application data." "An IP datagram consists of an IP header followed by transport layer data". A frame "consists of a link-layer header followed by a packet."

Currency: X.200 is in force. NIST SP 800-77r1 is current. RFC 1122 is not obsoleted, and its updates leave §1.3.3 unchanged.

**What's wrong:** "each layer adds its own control information" is backed. But the part also says that this information always goes in front and always is a header, and the sources don't support that:

- X.200 never uses the word "header". Its Figure 9 Note 2 says it "does not imply any positional relationship between protocol-control-information and user-data".
- NIST says the units are only "typically" a header and a payload.
- RFC 1122 states header-first only for the TCP segment, the IP datagram and the frame.
- The lesson's own Watch has layer 1 add no header, which contradicts "each layer".

Hedge the wording, for example "usually as a header in front", and qualify "each layer".

### units[0].learn.lead[3] ("lead-4") — ⚠️

> The lowest layer sends the whole bundle as **bits** over the physical medium, such as a cable. At the other end, it is passed back up, layer by layer.

- **ITU-T X.200, 7.7.2.** Defining standard: the Physical Layer. It provides "physical-connections for bit transmission between data-link-entities", and its entities "are interconnected by means of a physical medium".
- **ITU-T X.200, 7.7.4.6.1.** The NOTE says "real physical connections should be made as, for example, in Figure 19 a)". Figure 19 labels the media "Metallic cable" and "Optical fibre".
- **NIST SP 800-77r1, 2.1.** "The lowest layer sends the accumulated data through the physical network; the data is then passed up through the layers to its destination."

Currency: X.200 is in force. NIST is current.

**What's wrong:** only NIST states "At the other end, it is passed back up, layer by layer". Neither X.200 7.7.2 nor 7.7.4.6.1 says it, so the sentence has a single source. Add a second source for the upward pass. X.200 5.2.2.4, which has each layer's entities work through the layer below, is a candidate.

### units[0].learn.lead[4] ("lead-5") — ⚠️

> In between, a **router** passes the message on, using only layers 1 to 3. Its work goes one hop at a time, from one machine to the next. It needs layer 3, the Network Layer, because that is the layer that routes messages across networks.

- **ITU-T X.200, 6.1.6.** Defining standard: relay open systems. They "act only as relay open systems, passing data to other open systems". Figure 12 draws the relay with only Network, Data Link and Physical.
- **ITU-T X.200, 7.5.2.1.** Defining standard: the Network Layer's purpose. It "provides to the transport-entities independence of routing and relay considerations".
- **ITU-T X.200, 7.5.2.4.** "Any relay functions and hop-by-hop service enhancement protocols" operate "within the Network Layer or below".
- **NIST SP 800-77r1, 2.1.** "Network Layer. This layer routes packets across networks."
- **RFC 1122, 1.1.1.** "The networks are interconnected using packet-switching computers called "gateways" or "IP routers" by the Internet community, and "Intermediate Systems" by the OSI world [INTRO:13]."
- **Microsoft Learn, Network layer.** "This layer determines the physical path that the data should take".

Currency: all six sources are current or in force.

**What's wrong:** the router, its use of only the lowest three layers, hop-by-hop work and routing at the Network Layer are all backed. The numbers "layers 1 to 3" and "layer 3" are not stated by any of the six cited sections, because X.200 numbers the layers only in 6.1.2. Add X.200 6.1.2.

### units[0].learn.lead[5] ("lead-6") — ⚠️

> Going up, each layer reads the header its **twin** added, the control information meant for it. Then it passes the rest up to the layer above without reading it.

- **ITU-T X.200, 5.6.1.1.** Defining standard: protocol-control-information. "Information exchanged between (N)-entities to co-ordinate their joint operation."
- **ITU-T X.200, 5.6.1.4.** Defining standard: the service-data-unit, "not interpreted by the supporting (N)-entities".

Currency: X.200 is in force.

**What's wrong:** two claims hold: a layer reads its peer's control information, and it passes the rest up uninterpreted. But the part again calls every layer's control information "the header". Neither cited section mentions headers, and X.200 disclaims any position (Figure 9 Note 2). This is the same problem as lead-3; hedge it the same way.

### units[0].learn.terms[0] ("term-layer") — ⚠️

> Layer: One job in the stack, with its own place in the order

- **ITU-T X.200, 5.2.2.1.** Defining standard: layering. Each open system is "an ordered set of (N)-subsystems", and "(N)-subsystems of the same rank (N) collectively form the (N)-layer".
- **ITU-T X.200, 6.1.2.** Defining standard: the seven numbered layers.

Currency: X.200 is in force.

**What's wrong:** "its own place in the order" is backed. "One job" is not: neither 5.2.2.1 nor 6.1.2 says a layer is a job or a set of functions. Cite a section that does, such as X.200 5.2.2.5 (functions performed within the layer) or the Microsoft introduction ("a specific set of functions allocated to each layer").

### units[0].learn.terms[1] ("term-header") — ⚠️

> Header: The information a layer puts in front of what it carries, such as addresses

- **NIST SP 800-77r1, 2.1, footnote 6.** "At each layer, the logical units are typically composed of a header and a payload. The payload consists of the information passed down from the previous layer, while the header contains layer-specific information such as addresses."
- **RFC 1122, 1.3.3.** "A segment consists of a TCP header followed by application data." "An IP datagram consists of an IP header followed by transport layer data". A frame "consists of a link-layer header followed by a packet."

Currency: NIST is current. RFC 1122 is not obsoleted.

**What's wrong:** "in front of what it carries" has two sources: RFC 1122's "header followed by", and NIST's header and payload. "such as addresses" is stated only by NIST, because RFC 1122 §1.3.3 doesn't say what a header holds. Add a second source for addresses in headers, or drop the example.

### units[0].learn.terms[2] ("term-encap") — ✅

> Encapsulation: Each layer's data wrapped in a bigger bundle by the layer below it

- **NIST SP 800-77r1, 2.1.** "Essentially, the data produced by a layer is encapsulated in a larger container by the layer below it."
- **RFC 1122, 1.3.3.** "A segment is transmitted by encapsulation inside an IP datagram." Also: "To be transmitted end-to-end through the Internet, a message must be encapsulated inside a datagram."

Currency: both are current.

### units[0].learn.terms[3] ("term-decap") — ✅

> Decapsulation: Removing an outer header to reach what's inside

- **Cisco, IP-in-IP Decapsulation.** Decapsulation "removes the outer IP header of an encapsulated packet".
- **RFC 2003 §1.** "Once the encapsulated datagram arrives at this intermediate destination node, it is decapsulated, yielding the original IP datagram, which is then delivered to the destination indicated by the original Destination Address field."
- **RFC 2003 §3.** "To encapsulate an IP datagram using IP in IP encapsulation, an outer IP header [10] is inserted before the datagram's existing IP header, as follows:"

The two sources are independent: a Cisco document and an IETF RFC. Both describe IP-in-IP tunnelling, and the general definition matches what they say.

Currency: the Cisco page is live and documents a current product (Cisco 8000, IOS XR). RFC 2003 is not obsoleted, and its updates leave §1 and §3 unchanged.

### units[0].learn.terms[4] ("term-peer") — ⚠️

> Peer layer: The same layer on another machine, working with it by that layer's own rules

- **ITU-T X.200, 5.2.1.3.** Defining standard: peer entities. "peer-(N)-entities: Entities within the same (N)-layer."
- **ITU-T X.200, 5.2.2.7.** Defining standard: (N)-protocols. "Cooperation between (N)-entities is governed by one or more (N)-protocols."

Currency: X.200 is in force.

**What's wrong:** "the same layer" and "by that layer's own rules" are backed. Neither section states "on another machine". 5.2.1.3 says only "within the same (N)-layer", and 5.2.2.2 allows peers inside one subsystem. Cite a section that puts the peer on the other system, such as X.200 6.1.3, whose Figure 11 draws the peer protocol between two open systems.

### units[0].learn.terms[5] ("term-relay") — ✅

> Relay: A machine in the middle that only passes data on to other machines

- **ITU-T X.200, 6.1.6.** Defining standard: relay open systems. They "act only as relay open systems, passing data to other open systems". Figure 12 draws the relay between the two end systems.

Currency: X.200 is in force.

### units[0].learn.pattern ("pattern") — ⚠️

> Down the layers at the sender, across each link, up the layers at the receiver. (Names: Application Layer, Encapsulation, Physical Layer, Relay, Decapsulation, Peer Layers.)

- **ITU-T X.200, 6.1.6.** The relay case applies "When the physical media for OSI do not link all open systems directly".
- **NIST SP 800-77r1, 2.1.** "When a user wants to transfer data across networks, the data is passed from the highest layer through intermediate layers to the lowest layer, with each layer adding additional information." Also: "The lowest layer sends the accumulated data through the physical network; the data is then passed up through the layers to its destination."
- **Cisco, IP-in-IP Decapsulation.** Decapsulation "removes the outer IP header of an encapsulated packet".
- **RFC 2003 §1.** "source ---> encapsulator --------> decapsulator ---> destination"

Currency: all four are current.

**What's wrong:** "across each link" has two sources (X.200 and NIST). "Down the layers at the sender" and "up the layers at the receiver" are stated only by NIST. X.200 6.1.6, Cisco and RFC 2003 §1 describe relaying and tunnel endpoints, not movement through layers. Add a second source for the down-and-up movement.

### units[0].learn.why[0] ("why-1") — ⚠️

> Why split the job? Each layer can use the service of the layer below without knowing the details of how that service is done.

- **ITU-T X.200, 5.2.2.3.** "Except for the highest layer, each (N)-layer provides (N+1)-entities … with an (N)-service".
- **Microsoft Learn, Introduction.** Each layer offers services to the layers above, "shielding these layers from the details of how the services are implemented".

Currency: X.200 is in force. The Microsoft page is live.

**What's wrong:** "use the service of the layer below" has two sources. "without knowing the details of how that service is done" is stated only by Microsoft, because 5.2.2.3 does not say it. Add an X.200 section that does, such as 7.5.2.3 (the Network Layer makes the use of underlying resources invisible to transport-entities) or 7.4.2.1.

### units[0].learn.why[1] ("why-2") — ⚠️

> Layers 4 to 7 work only between the two end machines: the Transport Layer's protocols run only between them, and layers 5 to 7 sit on top. So a router never needs to read those headers.

- **ITU-T X.200, 7.4.2.3.** Defining standard: the Transport Layer. "transport-protocols operate only between OSI end open systems".

Currency: X.200 is in force.

**What's wrong:** 7.4.2.3 backs only the Transport Layer clause. It does not:

- number the Transport Layer as layer 4, or layers 5 to 7;
- say that layers 5 to 7 sit on top, or that they work only between the end machines;
- say that a router needs none of those headers.

Add X.200 6.1.2 (numbers and order). Also add 5.2.2.3's NOTE, which says relay systems "need not contain the higher layers of the architecture", or 6.1.6 with Figure 12.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ⚠️

> In X.200, a header holds **protocol-control-information**, which twin layers exchange to coordinate. A layer's whole unit is its **protocol-data-unit**: that information plus, possibly, data from above.

- **ITU-T X.200, 5.6.1.1.** Defining standard: protocol-control-information. "Information exchanged between (N)-entities to co-ordinate their joint operation."
- **ITU-T X.200, 5.6.1.3.** Defining standard: the protocol-data-unit, "consisting of (N)-protocol-control-information and possibly (N)-user-data".

Currency: X.200 is in force.

**What's wrong:** the definitions of PCI and PDU are right. "In X.200, a header holds protocol-control-information" is not: it credits X.200 with a term it never uses. "header" appears nowhere in X.200, and Figure 9 Note 2 disclaims any position for PCI. Reword it, for example "X.200 calls a layer's control information protocol-control-information".

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ✅

> The internet's own protocols use four layers: Application, Transport, Internet and Link. NIST calls the lower two Network and Data Link.

- **RFC 1122, 1.1.3.** Defining standard: the communication layers of the Internet architecture, in the Internet Standard for host requirements (STD 3). "The protocol layers used in the Internet architecture are as follows [INTRO:4]:". The headings follow: "Application Layer", "Transport Layer", "Internet Layer", "Link Layer".
- **NIST SP 800-77r1, 2.1.** "IP communications are roughly composed of four layers that work together." It then describes "Network Layer. This layer routes packets across networks." and "Data Link Layer. This layer handles communications between the physical network components."

Currency: RFC 1122 is not obsoleted, and §1.1.3 is unchanged by its updates. NIST is current.

### units[0].learn.deep[2] ("deep-3", Learn's Go deeper) — ⚠️

> A TCP **segment** is a TCP header followed by application data. An IP **datagram**, or **packet**, is an IP header followed by transport data. A **frame** is a link-layer header followed by a packet.

- **RFC 1122, 1.3.3.** Defining standard: the Internet host requirements' definitions of segment, datagram, packet and frame. RFC 9293 replaces only 1122's TCP requirements, not these definitions.
  - "A segment consists of a TCP header followed by application data."
  - "An IP datagram consists of an IP header followed by transport layer data, i.e., of an IP header followed by a message."
  - "A packet is the unit of data passed across the interface between the internet layer and the link layer. It includes an IP header and data. A packet may be a complete IP datagram or a fragment of an IP datagram."
  - "A frame is the unit of transmission in a link layer protocol, and consists of a link-layer header followed by a packet."
- **NIST SP 800-77r1, 2.1, footnote 6.** "At each layer, the logical units are typically composed of a header and a payload." It does not name the units.

Currency: RFC 1122 is not obsoleted, and §1.3.3 is unchanged by its updates. NIST is current.

**What's wrong:** "An IP datagram, or packet" treats "packet" as another name for a datagram. RFC 1122 says "A packet may be a complete IP datagram or a fragment of an IP datagram", so the fragment case is dropped. Reword it, for example "An IP datagram is an IP header followed by transport data; it travels as one packet, or as several when fragmented."

### units[0].learn.facts[0] ("fact-1") — ✅

Layers: 7.

- **ITU-T X.200, 6.1.2.** Defining standard: the seven OSI layers. "The Reference Model contains seven layers".

Currency: X.200 is in force.

### units[0].learn.facts[1] ("fact-2-top") — ✅

Top: 7 Application.

- **ITU-T X.200, 6.1.2.** Defining standard. "the Application Layer (layer 7)". It is the highest number, and in X.200 the (N+1)-layer sits above the (N)-layer.

Currency: X.200 is in force.

### units[0].learn.facts[2] ("fact-2-bottom") — ✅

Bottom: 1 Physical.

- **ITU-T X.200, 6.1.2.** Defining standard. "the Physical Layer (layer 1)".

Currency: X.200 is in force.

### units[0].learn.facts[3] ("fact-3") — ✅

Defined in: ITU-T X.200, the same text as ISO/IEC 7498-1.

- **ITU-T X.200, Foreword.** Defining standard: X.200 is the Basic Reference Model of OSI. "The identical text is also published as ISO/IEC International Standard 7498-1."

Currency: ITU-T lists X.200 (07/94) as in force.

### units[0].practice[0].options[0] (question "going-down") — ⚠️

The option is "Adds its own header", and it is marked right. Feedback:

> Right. Each layer adds its own control information, its header, to what the layer above handed it.

- **ITU-T X.200, 5.6.1.3.** Defining standard: the PDU, "consisting of (N)-protocol-control-information and possibly (N)-user-data".
- **NIST SP 800-77r1, 2.1.** "the data is passed from the highest layer through intermediate layers to the lowest layer, with each layer adding additional information." Its footnote 6 adds that the units are "typically composed of a header and a payload".

Currency: both are current.

**What's wrong:** "each layer adds its own control information" has two sources. But the answer "Adds its own header", and the feedback's "its header", present every layer's control information as a header. X.200 never says header, and NIST says only "typically". This is the same problem as lead-3.

### units[0].practice[0].options[1] (question "going-down") — ⚠️

The option is "Removes the header of the layer above", and it is marked wrong. Feedback:

> Not quite. Going down, a layer doesn't read or change what the layer above handed it. It passes it on whole.

- **ITU-T X.200, 5.6.1.4.** Defining standard: the service-data-unit, information "whose identity is preserved when transferred between peer-(N+1)-entities" and "not interpreted by the supporting (N)-entities".

Currency: X.200 is in force.

**What's wrong:** the option is rightly marked wrong, and "doesn't read or change" is backed. "It passes it on whole" drops segmentation. X.200 5.8.1.9 defines segmenting as a layer's function to "map one (N)-service-data-unit into multiple (N)-protocol-data-units". Figure 9 Note 1 sets segmenting aside only for that figure. Say "unchanged" instead of "whole".

### units[0].practice[0].options[2] (question "going-down") — ⚠️

The option is "Sends it straight to the cable", and it is marked wrong. Feedback:

> Not quite. Each layer gets its service from the layer just below it, so the message goes down one layer at a time.

- **ITU-T X.200, 5.2.2.3.** Defining standard: the layer service relationship. "Except for the highest layer, each (N)-layer provides (N+1)-entities … with an (N)-service".

Currency: X.200 is in force.

**What's wrong:** the feedback drops the lowest-layer exception. The lowest layer gets no service from a layer below: X.200 5.2.2.4 says its entities are "assumed to communicate directly via the physical media which connect them". 5.2.2.3 states its own rule with an exception, "Except for the highest layer", and the feedback drops the matching one. Say "Each layer above the lowest gets its service…".

### units[0].practice[1].options[0] (question "router-layers") — ⚠️

The option is "Layers 1 to 3", and it is marked right. Feedback:

> Right. A machine that only passes data on needs just the lower layers, up to the Network Layer, which routes messages across networks.

- **ITU-T X.200, 6.1.6.** Defining standard: relay open systems. "support the forwarding of data are then provided in the lower layers". Figure 12 draws the relay up to the Network Layer.
- **NIST SP 800-77r1, 2.1.** "Network Layer. This layer routes packets across networks."

Currency: both are current.

**What's wrong:** two claims lack backing.

- The numbers in "Layers 1 to 3" are stated by neither 6.1.6 nor NIST.
- "which routes messages across networks" is stated only by NIST. 6.1.6 puts forwarding in "the lower layers", but it does not say the Network Layer routes.

Add X.200 6.1.2. Also add 7.5.2.1 or the Microsoft network-layer passage; lead-5 already cites both.

### units[0].practice[1].options[1] (question "router-layers") — ⚠️

The option is "All seven", and it is marked wrong. Feedback:

> Not quite. Transport protocols, at layer 4, run only between the two end machines, so the router in the middle has no part in them.

- **ITU-T X.200, 7.4.2.3.** Defining standard: the Transport Layer. "transport-protocols operate only between OSI end open systems".

Currency: X.200 is in force.

**What's wrong:** "at layer 4" is not stated by 7.4.2.3. Add X.200 6.1.2.

### units[0].practice[1].options[2] (question "router-layers") — ⚠️

The option is "Only layer 1", and it is marked wrong. Feedback:

> Not quite. To send the message on toward the right network, it needs layer 3, the Network Layer, which routes messages across networks.

- **ITU-T X.200, 7.5.2.1.** Defining standard: the Network Layer's purpose. It "provides to the transport-entities independence of routing and relay considerations".
- **NIST SP 800-77r1, 2.1.** "Network Layer. This layer routes packets across networks."

Currency: both are current.

**What's wrong:** routing at the Network Layer has two sources. "layer 3" is stated by neither. Add X.200 6.1.2.

### units[0].practice[2].options[0] (question "layer-4") — ✅

The option is "Transport", and it is marked right. Feedback: "Right. Layer 4 is the Transport Layer."

- **ITU-T X.200, 6.1.2.** Defining standard: the layer numbers. "the Transport Layer (layer 4)".

Currency: X.200 is in force.

### units[0].practice[2].options[1] (question "layer-4") — ✅

The option is "Network", and it is marked wrong. Feedback: "The Network Layer is layer 3. Layer 4 is the Transport Layer."

- **ITU-T X.200, 6.1.2.** Defining standard. "the Network Layer (layer 3)" and "the Transport Layer (layer 4)".

Currency: X.200 is in force.

### units[0].practice[2].options[2] (question "layer-4") — ✅

The option is "Session", and it is marked wrong. Feedback: "The Session Layer is layer 5. Layer 4 is the Transport Layer."

- **ITU-T X.200, 6.1.2.** Defining standard. "the Session Layer (layer 5)" and "the Transport Layer (layer 4)".

Currency: X.200 is in force.

### units[0].practice[2].options[3] (question "layer-4") — ✅

The option is "Data Link", and it is marked wrong. Feedback: "The Data Link Layer is layer 2. Layer 4 is the Transport Layer."

- **ITU-T X.200, 6.1.2.** Defining standard. "the Data Link Layer (layer 2)" and "the Transport Layer (layer 4)".

Currency: X.200 is in force.

---

## 2. Traced, example, analogy and unbacked items

### Traced

| Key | Verdict |
|---|---|
| backing (the lesson's subtitle and summary) | ✅ |
| units[0].backing (the unit's full name and purpose) | ✅ |
| units[0].scene.backing (the scene) | ⚠️ |
| units[0].overview.hookBacking (the Overview hook) | ✅ |
| units[0].overview.backing (the Overview description) | ✅ |
| units[0].overview.facts[0] (Overview fact "Layers") | ✅ |
| units[0].steps[0] (step "application") | ✅ |
| units[0].steps[0].facts[0] (step "application", fact "Layer") | ✅ |
| units[0].steps[0].facts[1] (step "application", fact "Adds") | ✅ |
| units[0].steps[0].events[0] (event "laptop-7") | ✅ |
| units[0].steps[1] (step "encapsulation") | ✅ |
| units[0].steps[1].facts[0] (step "encapsulation", fact "Layers") | ✅ |
| units[0].steps[1].facts[1] (step "encapsulation", fact "Each one adds") | ✅ |
| units[0].steps[1].facts[2] (step "encapsulation", fact "Called") | ✅ |
| units[0].steps[1].events[0] (event "laptop-6") | ✅ |
| units[0].steps[1].events[1] (event "laptop-5") | ✅ |
| units[0].steps[1].events[2] (event "laptop-4") | ✅ |
| units[0].steps[1].events[3] (event "laptop-3") | ✅ |
| units[0].steps[1].events[4] (event "laptop-2") | ✅ |
| units[0].steps[2] (step "physical") | ✅ |
| units[0].steps[2].facts[0] (step "physical", fact "Layer") | ✅ |
| units[0].steps[2].facts[1] (step "physical", fact "Sends") | ✅ |
| units[0].steps[2].events[0] (event "laptop-1") | ✅ |
| units[0].steps[2].events[1] (event "bits-to-router") | ✅ |
| units[0].steps[3] (step "relay") | ✅ |
| units[0].steps[3].facts[0] (step "relay", fact "Uses") | ✅ |
| units[0].steps[3].facts[1] (step "relay", fact "Reads") | ⚠️ |
| units[0].steps[3].events[0] (event "router-1") | ⚠️ |
| units[0].steps[3].events[1] (event "router-2") | ⚠️ |
| units[0].steps[3].events[2] (event "router-3") | ⚠️ |
| units[0].steps[3].events[3] (event "router-2-down") | ⚠️ |
| units[0].steps[3].events[4] (event "router-1-down") | ⚠️ |
| units[0].steps[3].events[5] (event "bits-to-server") | ✅ |
| units[0].steps[4] (step "decapsulation") | ✅ |
| units[0].steps[4].facts[0] (step "decapsulation", fact "Order") | ✅ |
| units[0].steps[4].facts[1] (step "decapsulation", fact "Each layer") | ✅ |
| units[0].steps[4].events[0] (event "server-1") | ✅ |
| units[0].steps[4].events[1] (event "server-2") | ✅ |
| units[0].steps[4].events[2] (event "server-3") | ✅ |
| units[0].steps[4].events[3] (event "server-4") | ✅ |
| units[0].steps[4].events[4] (event "server-5") | ✅ |
| units[0].steps[4].events[5] (event "server-6") | ✅ |
| units[0].steps[4].events[6] (event "server-7") | ✅ |
| units[0].steps[5] (step "peer-layers") | ⚠️ |
| units[0].steps[5].facts[0] (step "peer-layers", fact "Layers 4 to 7") | ✅ |
| units[0].steps[5].facts[1] (step "peer-layers", fact "Layers 1 to 3") | ✅ |
| units[0].steps[5].events[0] (event "peer-7") | ✅ |
| units[0].steps[5].events[1] (event "peer-6") | ✅ |
| units[0].steps[5].events[2] (event "peer-5") | ✅ |
| units[0].steps[5].events[3] (event "peer-4") | ✅ |
| units[0].steps[5].events[4] (event "peer-3") | ✅ |
| units[0].steps[5].events[5] (event "peer-2") | ✅ |
| units[0].steps[5].events[6] (event "peer-1") | ✅ |

What is wrong with each ⚠️:

- **units[0].scene.backing.** The plate says "OSI REFERENCE MODEL", but none of lead-1, lead-4, lead-5 or fact-3 calls it a reference model. Also, the legend "A layer's job" uses lead-2, which is not traced. Say "reference model" in lead-1 or fact-3, or drop it from the plate, and add lead-2.
- **steps[3].facts[1] ("Reads: headers 2 and 3").** It traces only lead-5, which says nothing about reading headers. Reading headers comes from lead-6.
- **router-1 ("Takes in the bits.").** It traces only lead-5, but "bits" comes from lead-4.
- **router-2 ("Reads header 2.").** It traces only lead-5, but reading a twin's header comes from lead-6.
- **router-3.** It traces only lead-5, but reading a header comes from lead-6. Its labels panel also still shows header 2 at layer 3, so the router's layer 2 kept the header. lead-6 says a layer passes up only the rest, and server-2 removes header 2 at the same point.
- **router-2-down.** The labels panel sends header 2 back down unchanged, with no new header 2 added. This goes against lead-3 (going down, each layer adds its own header) and against layer 2 working hop by hop (lead-5, peer-2). As drawn, the laptop's header 2 reaches the web server.
- **router-1-down ("Sends it on as bits.").** It traces only lead-5, but "bits" comes from lead-4.
- **steps[5] (peer-layers).** "Each layer only ever works with the same layer at the other end" is stronger than any traced part says, because none of them says "only". It also contradicts lead-2 and the Overview hook, where each layer leans on the layer below it. Drop "only ever", or scope it to the trip across the network.

### Example

| Key | Verdict |
|---|---|
| units[0].overview.facts[1] (Overview fact "Example") | ✅ |

"A laptop and a web server" are generic example devices. They make no claim about how anything works.

### Analogy

| Key | Verdict |
|---|---|
| units[0].learn.lead[6] ("lead-7") | ✅ |

A note stuck on a parcel, written for the same layer at the other end, matches the peer-header idea and does not mislead.

### Unbacked

| Key | Verdict |
|---|---|
| title | ✅ |
| units[0].name | ✅ |
| units[0].practice[0].prompt (question "going-down") | ✅ |
| units[0].practice[1].prompt (question "router-layers") | ✅ |
| units[0].practice[2].prompt (question "layer-4") | ✅ |

The title and unit name are "OSI Model". The prompts make no claim beyond the cited parts, and none has a false premise.

---

## 3. Sources

All six sources were checked on 2026-11-08, and all are current.

- **itu-x200** (ITU-T X.200).
  - The PDF came from itu.int (63 pages). The Foreword ties it to ISO/IEC 7498-1.
  - The ITU-T Recommendation page (`https://www.itu.int/rec/T-REC-X.200/en`) lists X.200 (07/94) as "In force" and the 11/88 edition as superseded.
  - Current.
- **nist-sp800-77r1** (NIST SP 800-77 Rev. 1).
  - The PDF came from nvlpubs.nist.gov.
  - The CSRC page shows a June 2020 publication date and says it supersedes SP 800-77 (2005). There is no withdrawal or superseded-by notice.
  - Current.
- **rfc-1122** (RFC 1122).
  - The RFC Editor info page and its metadata list it as an Internet Standard (STD 3), with an empty obsoleted-by.
  - It is updated by RFC 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029 and 9293. I read each update's references to RFC 1122. They cover:
    - TOS (1349);
    - loopback handling for MPLS LSP ping and BFD (4379, 5884, 8029);
    - the urgent pointer (6093);
    - RTO (6298);
    - Source Quench (6633);
    - the IPv4 ID (6864, §6.2);
    - TCP requirements (9293, which replaces only 1122's TCP portions).
  - None changes §1.1.1, §1.1.3 or §1.3.3.
  - Current.
- **rfc-2003** (RFC 2003).
  - The RFC Editor lists it as a Proposed Standard, not obsoleted.
  - RFC 3168 updates it on ECN in IP-in-IP tunnels (§9.1), and RFC 6864 on the outer IPv4 ID (§6.3). Neither changes §1 or §3.
  - Current.
- **microsoft-osi** (Microsoft Learn, "Windows network architecture and the OSI model").
  - It is live on learn.microsoft.com and is Microsoft's own documentation (ms.date 2025-01-31). It describes the current Windows network architecture.
  - The cited anchors and both text fragments are present.
  - Current.
- **cisco-ipip-decap** (Cisco, "IP-in-IP decapsulation").
  - It is live on cisco.com and is Cisco's own configuration guide for Cisco 8000 Series Routers on IOS XR. It has a feature history entry for Release 7.3.5.
  - The site's edge refused a plain `curl` fetch, so I read the page's rendered text in a browser.
  - Current.

## 4. Limit overrides

None.
