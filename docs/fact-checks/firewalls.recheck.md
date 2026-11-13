```json fact-check
{
  "slug": "firewalls",
  "base": "941d9df3663cb02403cc84a97cb333d15c98482f6452bac78d974113bbb35b7c",
  "hash": "d98d7b0cca515b1613ccb01cc4a338b718c44dc1834fa1bd45855e751ff7354e",
  "checked": "2026-11-12",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "units[0].steps[0].deep[3] (step \"rule-evaluation\", Go deeper)": "✅"
  },
  "sources": [
    { "id": "nist-sp800-41r1", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-1918", "current": true, "checked": "2026-11-12" },
    { "id": "rfc-3022", "current": true, "checked": "2026-11-12" }
  ],
  "quotes": {
    "checked": "2026-11-12",
    "count": 6,
    "digest": "5ce8e9e9025ccc25154a94b845c13bc18737e2efae226d9b994b87227d74e7e5",
    "files": {
      "rfc-1918": "56c43465298772bc4d899923f1785b7b7bf8dd2c9f2f9a53422800ddc5cf9337",
      "rfc-3022": "c57fe60c46eff630d4d82eece5bf624ba3ac80f16711e7acdb44a28e01331d86",
      "nist-sp800-41r1": "3e8d6457bc4c7af73b417e71003f13c1ce1a3b38be3ab1eea9c4ad143f0cdfc6"
    }
  }
}
```

# Fact-check re-check: firewalls

One item judged: the NAT sentence that closes step 1's Go deeper. It sits after the sentences on the SYN, the headers the firewall reads and port 443, and still reads in order there: the step's narrative has a visitor out on the internet reaching the office web server, and this sentence adds that the server's private address means a real network would reach it through NAT.

## Claims

### units[0].steps[0].deep[3] (step "rule-evaluation", Go deeper) — ✅

Text: "The web server's address, 10.0.0.10, is private, so in real life the visit reaches it through NAT."

- `rfc-1918` §3
  > The Internet Assigned Numbers Authority (IANA) has reserved the
  > following three blocks of the IP address space for private internets:
- `rfc-1918` §3
  > 10.0.0.0        -   10.255.255.255  (10/8 prefix)
- `rfc-1918` §3
  > packets with private source or destination addresses
  > should not be forwarded across such links.
- Note: RFC 1918 (BCP 5) defines the private address blocks, and 10.0.0.10 falls in its 10/8 block, so "private" is stated by the defining standard. Its rule that private-addressed packets stay off inter-enterprise links is why an internet visitor cannot reach the server's own address directly.
- `rfc-3022` §2.2
  > This model could be extended to allow
  > inbound access by statically mapping a local node per each service TU
  > port of the registered IP address.
- Note: RFC 3022 is the document that defines Traditional NAT (Basic NAT and NAPT); §2.2 covers NAPT, including the static mapping that lets an outside visitor reach one inside host on one service port.
- `nist-sp800-41r1` §3.2
  > Typically, a NAT acts as a router that has a network with private addresses on the inside and a single
  > public address on the outside.
- `nist-sp800-41r1` §3.2
  > all HTTP requests that go to the NAT could be directed
  > to a single host on the protected side of the firewall.
- Note: Two independent sources (RFC 3022 and NIST SP 800-41r1) each state that a NAT can send inbound visits to a host with a private address inside, and RFC 1918 defines the address as private.
- Note: Passed under "True for a beginner". The sentence leaves out that inbound NAT needs a mapping set up in advance (a static port mapping, which NIST calls pinholing), since outside hosts otherwise cannot open contact, and that other routes exist, such as a mediating application gateway or proxy, which RFC 1918 also mentions. NAT is the ordinary case, and nothing in the cited sections contradicts it.
- Note: Currency. RFC 1918 is not obsoleted. Its one update, RFC 6761, reserves the reverse-mapping DNS names for the private blocks and does not change the blocks or the forwarding rule. RFC 3022 is not obsoleted and has no updates. NIST SP 800-41 Rev. 1 is listed as final, and CSRC marks it neither withdrawn nor superseded. NAT for reaching private-addressed servers is current practice.

## Traced, example, analogy and unbacked parts

None to judge in this re-check.

## Sources

- `rfc-1918`: the RFC Editor info page lists it as Best Current Practice (BCP 5), obsoleting RFC 1597 and RFC 1627, updated only by RFC 6761 (read: it concerns DNS names, not this claim), and not obsoleted. Current. Checked 2026-11-12.
- `rfc-3022`: the RFC Editor info page lists it as Informational, obsoleting RFC 1631, with no obsoleting or updating RFC. Current. Checked 2026-11-12.
- `nist-sp800-41r1`: the PDF is live at nvlpubs.nist.gov, and the CSRC page lists SP 800-41 Rev. 1 (September 2009) as final, superseding the 2002 edition, with no withdrawal and no newer revision. Current. Checked 2026-11-12.
