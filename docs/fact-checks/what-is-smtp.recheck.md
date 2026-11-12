```json fact-check
{
  "slug": "what-is-smtp",
  "base": "a7bc9d5ac9dc36d1721b61554bef42c422d92479de7c3405f4dd319458963904",
  "hash": "34ae38b0fad9786cb666ec3c893dbf2636cf4d6b532d7a2b45428513a153b339",
  "checked": "2026-11-12",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "title": "✅",
    "units[0].name": "✅",
    "units[0].backing (the unit's full name and purpose)": "✅",
    "units[0].steps[1] (step \"ehlo-and-authentication\")": "✅",
    "units[0].steps[0].deep[1] (step \"tcp-and-tls-handshake\", Go deeper)": "✅",
    "units[0].learn.facts[21] (\"fact-name\")": "✅",
    "units[0].learn.facts[22] (\"fact-ehlo-reply\")": "✅",
    "units[0].practice[0].prompt (question \"find-server\")": "✅",
    "units[0].practice[1].prompt (question \"queued\")": "✅"
  },
  "sources": [
    { "id": "rfc-3207", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-5321", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-8314", "current": true, "checked": "2026-11-12" }
  ],
  "quotes": {
    "checked": "2026-11-12",
    "count": 5,
    "digest": "1a5bb54a7d0e07a8e36cfb4b63887ad3ba0fe5f7c790b5b598fae54ec6b19680",
    "files": {
      "rfc-8314": "d626efa01a2176206b81742b77ca8f0d61e4a669f9ae7798e7ae556afc65aae6",
      "rfc-3207": "b004a203791a1ca664d39a49d73369f88f5f3870486a6639e3f833df2118e4ac",
      "rfc-5321": "7d560eddff1b213c17d4e1e5f95005728b2f05bc2b3947f0fcc91717c6707634"
    }
  }
}
```

# Fact-check re-check: what-is-smtp

Re-check of the 9 items the sheet lists. Each was judged in its place, with the Learn parts printed as context.

## Claims

### units[0].steps[0].deep[1] (step "tcp-and-tls-handshake", Go deeper) — ✅

Text: "Port 587 starts in plain text and upgrades with the STARTTLS command."

- `rfc-8314` §3
  > With
  > STARTTLS, the client establishes a cleartext application session and
  > determines whether to issue a STARTTLS command based on server
  > capabilities and client configuration.  If the client issues a
  > STARTTLS command, a TLS handshake follows that can upgrade the
  > connection.
- `rfc-3207` §4
  > After receiving a 220 response to a STARTTLS command, the client MUST
  > start the TLS negotiation before giving any other SMTP commands.
- `rfc-8314` §3.3
  > clients and servers SHOULD implement both STARTTLS on
  > port 587 and Implicit TLS on port 465 for this transition period.
- Note: RFC 3207 defines the STARTTLS command for SMTP (§4, with §4.3 on the submission port); RFC 8314 is the current standards-track document that sets how TLS is used for mail submission, placing STARTTLS on port 587 and implicit TLS on port 465. RFC 8314 and RFC 3207 are separate RFCs, so the claim is also confirmed by two independent sources.
- Note: the claim leaves out that RFC 8314 now prefers implicit TLS (port 465) and that STARTTLS can fail with a 454 reply; it is true in the ordinary case, and the neighbouring Go deeper lines cover port 465. In its place between the port 465 line and "Both are for submission", the list still reads true and in order.
- Note: RFC 8314 (updated by RFC 8997, on TLS 1.1 only) and RFC 3207 (updated by RFC 7817, on certificate name checks) are not obsoleted; neither update changes this claim.

### units[0].learn.facts[21] ("fact-name") — ✅

Text: Stands for: Simple Mail Transfer Protocol.

- `rfc-5321` §1.1
  > The objective of the Simple Mail Transfer Protocol (SMTP) is to
  > transfer mail reliably and efficiently.
- Note: RFC 5321 is the current document that defines SMTP, and it gives the protocol's full name. It is not obsoleted; its one update (RFC 7504) adds reply codes and does not touch the name.

### units[0].learn.facts[22] ("fact-ehlo-reply") — ✅

Text: Reply to EHLO: the server lists what it can do.

- `rfc-5321` §3.2
  > use of EHLO indicates that the client is able to process
  > service extensions and requests that the server provide a list of the
  > extensions it supports.
- Note: RFC 5321 defines the EHLO command and the reply it asks for.
- Note: "what it can do" is an everyday wording for the service extensions the server supports; the HELO fallback for old systems is left out. True in the ordinary case.

## Traced, example and analogy parts, and unbacked items

- `title` — ✅. "SMTP" makes no claim beyond the lesson.
- `units[0].name` — ✅. "SMTP" makes no claim beyond the lesson.
- `units[0].backing (the unit's full name and purpose)` — ✅. The full name repeats fact-name; "Sending email" repeats the handovers of lead-1 and the commands of fact-commands, and adds nothing new.
- `units[0].steps[1] (step "ehlo-and-authentication")` — ✅. The server speaking first with 220 traces to fact-greeting and deep-codes; three-digit codes to term-reply; a leading 2 meaning good to fact-codes; EHLO and the server listing what it can do to term-ehlo and fact-ehlo-reply; AUTH proving you may send to term-auth and fact-plain; 235 to deep-codes. Between the TLS step and message submission, the steps still run in order.
- `units[0].practice[0].prompt (question "find-server")` — ✅. The lesson teaches that the sending server finds the recipient's server through an MX lookup in DNS (term-mx, fact-mx); smtp.example.net is the reader's own server in the lesson. No false premise.
- `units[0].practice[1].prompt (question "queued")` — ✅. The lesson shows the server answering "250, queued" after the letter and explains what 250 after the letter means (fact-250). No false premise.

## Sources

- `rfc-3207` — fetched from rfc-editor.org as plain text; its info page lists no obsoleting RFC, only an update by RFC 7817 (certificate checks), which does not affect the claim. Current, checked 2026-11-12.
- `rfc-5321` — fetched from rfc-editor.org as plain text; its info page lists no obsoleting RFC, only an update by RFC 7504 (reply codes 521 and 556), which does not affect these claims. Current, checked 2026-11-12.
- `rfc-8314` — fetched from rfc-editor.org as plain text; its info page lists no obsoleting RFC, only an update by RFC 8997 (TLS 1.1 deprecation), which does not affect the claim. Current, checked 2026-11-12.
