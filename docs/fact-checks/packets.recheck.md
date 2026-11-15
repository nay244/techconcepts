```json fact-check
{
  "slug": "packets",
  "base": "8d857c11ebbeb9f0584f0b83013d9df32a782bcf10a8dcd047ab9c6576170cec",
  "hash": "78747977f4380a135ef1092669ce23870f7ad06229339520a710247859934315",
  "checked": "2026-11-15",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].practice[1].options[0] (question \"early-pieces\")": "✅",
    "units[0].practice[1].options[1] (question \"early-pieces\")": "✅",
    "units[0].practice[1].options[2] (question \"early-pieces\")": "✅",
    "units[0].practice[1].prompt (question \"early-pieces\")": "✅"
  },
  "sources": [
    { "id": "microsoft-osi", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-1122", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-791", "current": true, "checked": "2026-11-15" },
    { "id": "rfc-9293", "current": true, "checked": "2026-11-15" }
  ],
  "quotes": {
    "checked": "2026-11-15",
    "count": 12,
    "digest": "3061976b85a125d788e33b1771efef5583a0bd860b336cf6a39b927c2f2e58c0",
    "files": {
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "microsoft-osi": "3cfdc94b154549ac2982eabc80aed877dc89891449572de8c5836be822e956b3",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265"
    }
  }
}
```

# Fact-check re-check: packets

Targeted re-check of the question "early-pieces": its prompt and its three options. Every Learn part printed on the sheet was read as context only.

## Claims

### units[0].practice[1].options[0] (question "early-pieces") — ✅

Text: "Your laptop's TCP holds 3 and 4, and when 2 arrives, hands the bytes on in order." (right: true). Feedback: TCP numbers every byte, holds pieces that come early, and hands the bytes to the browser in order.

- `rfc-9293` §3.4
  > A fundamental notion in the design is that every octet of data sent
  > over a TCP connection has a sequence number.
- Note: RFC 9293 is TCP's own specification and defines its sequence numbering; this supports "TCP numbers every byte".
- `rfc-9293` §3.10
  > A natural way to think about processing incoming segments is to
  > imagine that they are first tested for proper sequence number … and then that they are generally queued
  > and processed in sequence number order.
- Note: RFC 9293 defines TCP's processing of arriving segments; this supports handing the bytes on in order.
- `rfc-9293` §3.10.7.4
  > Segments with higher
  > beginning sequence numbers SHOULD be held for later
  > processing (SHLD-31).
- Note: RFC 9293 defines the receiver's handling of a segment that arrives ahead of the next expected byte; this supports "holds pieces that come early".
- `microsoft-osi` §Transport layer
  > The transport layer ensures that messages are delivered error free, in sequence, and with no loss or duplication.
- Note: holding early segments is a SHOULD in the standard, not a MUST; a receiver may drop them and wait for a resend. The ordinary case, which the option describes, is that they are held. The claim passes as true for a beginner.
- Note: currency. RFC 9293 is an Internet Standard with no obsoleting or updating RFC listed (RFC Editor metadata, checked 2026-11-15). The Microsoft page is live, dated 2025-01-31.

### units[0].practice[1].options[1] (question "early-pieces") — ✅

Text: "The browser gets them as they come, and the page is jumbled." (right: false). Feedback: Not quite; TCP hands the browser the bytes in order, so it never sees them out of order.

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to
  > applications.
- Note: RFC 9293 defines TCP's service to applications; an in-order byte stream means the application is never handed bytes out of order, so the feedback's "never" holds and the option is rightly marked wrong.
- `rfc-9293` §3.10
  > then that they are generally queued
  > and processed in sequence number order.
- `microsoft-osi` §Transport layer
  > The transport layer ensures that messages are delivered error free, in sequence, and with no loss or duplication.
- Note: currency as for the item above; RFC 9293 is current and not updated.

### units[0].practice[1].options[2] (question "early-pieces") — ✅

Text: "IP puts them back in order on the way." (right: false). Feedback: Not quite; IP promises no order, each packet travels on its own, and putting the pieces back in order is TCP's job at your end.

- `rfc-1122` §1.1.3
  > IP is a connectionless or datagram internetwork service,
  > providing no end-to-end delivery guarantees. Thus, IP
  > datagrams may arrive at the destination host damaged,
  > duplicated, out of order, or not at all.
- `rfc-1122` §1.1.3
  > TCP is a reliable connection-oriented transport service
  > that provides end-to-end reliability, resequencing, and
  > flow control.
- `rfc-791` §1.2
  > There are no mechanisms to augment end-to-end data
  > reliability, flow control, sequencing, or other services commonly
  > found in host-to-host protocols.
- Note: RFC 791 defines the Internet Protocol (IPv4) and its scope; it states IP has no sequencing, so "IP promises no order" is right.
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent
  > entity unrelated to any other internet datagram.
- Note: RFC 791 defines IP's operation; this supports "each packet travels on its own".
- `rfc-9293` §3.10
  > then that they are generally queued
  > and processed in sequence number order.
- Note: RFC 9293 defines TCP's processing at the receiving end; with RFC 1122's resequencing passage it supports "TCP's job, at your end".
- Note: currency. RFC 791 is an Internet Standard, not obsoleted; it is updated by RFC 1349 (type of service, itself obsoleted by RFC 2474), RFC 2474 (DS field) and RFC 6864 (IPv4 ID field), none of which touches ordering or the independence of datagrams. RFC 1122 is not obsoleted; its updates (RFCs 1349, 4379, 5884, 6093, 6298, 6633, 6864, 8029, 9293) concern type of service, MPLS, BFD, the urgent mechanism, retransmission timers, source quench, the ID field and TCP itself, and none changes IP's lack of ordering or TCP's resequencing. RFC 9293 as above.
- Note: the lesson also names IPv6; RFC 1122's statement is about IP's datagram service in general, and the feedback's claim holds there too in the ordinary case.

### units[0].practice[1].prompt (question "early-pieces") — ✅

Prompt: "Pieces 3 and 4 of a page reach your laptop before piece 2. What happens?"

- Note: unbacked item. Its premise, that later pieces can arrive first, is what Learn teaches in fact-out-of-order and fact-ip-promises, so it has no false premise and makes no claim beyond the lesson's cited parts. Numbering the pieces 3, 4 and 2 is a plain label; the lesson teaches that TCP numbers bytes, and the right option speaks of bytes. The three options were judged against this prompt as it stands, and exactly one (option 1) is right.

## Traced, example, analogy and unbacked parts

- units[0].practice[1].prompt (question "early-pieces"): ✅ (see above).

## Sources

- `microsoft-osi`: Microsoft Learn, Windows network architecture and the OSI model. Fetched from learn.microsoft.com; live, page date 2025-01-31, describes current Windows architecture. Current. Checked 2026-11-15.
- `rfc-1122`: Fetched as plain text from rfc-editor.org. Internet Standard, not obsoleted; updates reviewed as noted above. Current. Checked 2026-11-15.
- `rfc-791`: Fetched as plain text from rfc-editor.org. Internet Standard, not obsoleted; updates (RFCs 1349, 2474, 6864) do not touch the claims. Current. Checked 2026-11-15.
- `rfc-9293`: Fetched as plain text from rfc-editor.org. Internet Standard, not obsoleted and not updated. Current. Checked 2026-11-15.
