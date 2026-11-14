```json fact-check
{
  "slug": "glossary/naming",
  "base": "6f439c56aa20e9ce7cbddda16809728eb18d046df736415b62c17cbae484b5cd",
  "hash": "68c03d8bd4a98aea4c5c7d1faa5f7947ef351f016f363019486dd75282ef14a3",
  "checked": "2026-11-14",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "entry \"top-level-domain\": names": "✅",
    "entry \"top-level-domain\": statement \"top-level-domain-1\"": "✅",
    "entry \"top-level-domain\": statement \"top-level-domain-2\"": "✅",
    "entry \"top-level-domain\": statement \"top-level-domain-3\"": "✅",
    "entry \"top-level-domain\": lessons": "✅"
  },
  "sources": [
    { "id": "iana-root-db", "current": true, "checked": "2026-11-14" },
    { "id": "iana-root-db-app", "current": true, "checked": "2026-11-14" },
    { "id": "iana-root-zone", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-1034", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-9499", "current": true, "checked": "2026-11-14" }
  ],
  "quotes": {
    "checked": "2026-11-14",
    "count": 16,
    "digest": "cab670f4e93c84e3f765761b785dbddaceca25ef443f9bb7aff6a4e1927305b3",
    "files": {
      "rfc-9499": "270b62df854911dddd246f6c081952106897983a5e02dfe8b3819d72843d9ab1",
      "iana-root-db-app": "ed81572feba247f27cc2e557f3aa6cd932797bf0df61a08dee7087c5f5fb687e",
      "rfc-1034": "d6b10a71441df879cc2817d23f2dad120c8a5f87e74eba1e4ed4b743a76a891a",
      "iana-root-zone": "c14aa1b74f65280f4d05bd80461cc1c3bc62e26320955a2c97b1232fc93d9213",
      "iana-root-db": "d68ecbaefd1501243f1ab57d6e466199d62cf228b9220921a585c5dd14e2c202"
    }
  }
}
```

# Fact-check re-check: glossary group naming

A targeted re-check of the entry `top-level-domain`, judged whole because one of its items changed (a third citation on statement 3). Five items judged, five pass.

## Claims

### entry "top-level-domain": statement "top-level-domain-1" — ✅

Text: A top-level domain (TLD) is a domain one level below the root, such as .com, .jp or .app: the last part of a name like example.com.

- `rfc-9499` §2
  > A Top-Level Domain is a zone that is one
  > layer below the root, such as "com" or "jp".
- `rfc-9499` §2
  > in both English and the C programming
  > language, the root or Top-Level Domain (TLD) label in the
  > ordered list is rightmost
- `iana-root-db-app` §.app Top-Level Domain
  > Generic top-level domain
- `rfc-1034` §3.1
  > The domain name of a node is the list of the labels on the path from the
  > node to the root of the tree. By convention, the labels that compose a
  > domain name are printed or read left to right, from the most specific
  > (lowest, farthest from the root) to the least specific (highest, closest
  > to the root).
- `iana-root-zone` §Root Zone Management
  > The Domain Name System (DNS) root zone is the highest-level of the naming hierarchy, principally composed of
  > delegations of top-level domains (such as .edu or .in).
- Note: RFC 1034 (STD 13) is the current standard that defines the domain name space: the tree, its root, the labels of a name and their order. A TLD is a node of that tree one level below the root, and its label is the one written last. The marker is correct for this claim.
- Note: Confirmed as well by two independent sources: RFC 9499 (IETF) and the IANA root zone pages (IANA), which name .com, .jp and .app as top-level domains and place them directly under the root.
- Note: Loosely said, and true for a beginner: RFC 9499 calls a TLD a zone rather than a domain, and notes that in some right-to-left scripts the TLD label may be shown leftmost; the claim leaves both out.
- Note: Currency: RFC 9499 (BCP 219) and RFC 1034 (STD 13) are not obsoleted on the RFC Editor's info pages; the IANA pages are live. Checked 2026-11-14.

### entry "top-level-domain": statement "top-level-domain-2" — ✅

Text: Its name servers point to the name servers of the domains under it.

- `rfc-9499` §2
  > Most of
  > them are also delegation-centric zones (defined in Section 7)
- `rfc-9499` §7
  > Delegation happens
  > when an NS RRset is added in the parent zone for the child origin.
- `rfc-9499` §7
  > Delegation-centric zone: A zone that consists mostly of delegations
  > to child zones.
- `rfc-1034` §4.2.1
  > The RRs that describe cuts around the bottom of the zone are NS RRs that
  > name the servers for the subzones.
- `rfc-1034` §4.2.1
  > That is, parent zones have all the information needed to
  > access servers for their children zones.
- `rfc-1034` §4.3.2
  > If a match would take us out of the authoritative data,
  > we have a referral.
- `rfc-1034` §4.3.2
  > Copy the NS RRs for the subzone into the authority
  > section of the reply.
- Note: RFC 1034 is the current standard that defines delegation by NS records at a zone cut and the name server's referral procedure, which is how a TLD's servers point to the servers of the domains below it. The marker is correct on both sections.
- Note: Confirmed as well by two standards: RFC 9499 and RFC 1034 are different RFCs.
- Note: Loosely said, and true for a beginner: the claim speaks of all the domains under a TLD, where RFC 9499 says most TLD zones consist mostly of delegations; a TLD zone can also hold some data of its own. It also leaves out glue address records.
- Note: Currency: RFC 1034 is updated by later RFCs; the updates bearing on these sections, RFC 2181 §6 (zone cuts shown by NS records in the parent) and RFC 9471 (glue in referral responses), keep the delegation and referral as described. Checked 2026-11-14.

### entry "top-level-domain": statement "top-level-domain-3" — ✅

Text: TLDs are often grouped into country-code TLDs (ccTLDs) and generic TLDs (gTLDs), such as .app.

- `rfc-9499` §2
  > TLDs
  > are often divided into sub-groups such as Country Code Top-Level
  > Domains (ccTLDs), Generic Top-Level Domains (gTLDs), and others;
  > the division is a matter of policy
- `iana-root-db-app` §.app Top-Level Domain
  > Generic top-level domain
- `iana-root-db` §Top-Level Domains
  > .jp Active Country Code Japan Registry Services Co., Ltd.
- `iana-root-db` §Top-Level Domains
  > .app Active Generic Charleston Road Registry Inc.
- Note: Confirmed by two independent sources: RFC 9499 (IETF) names both groups, and IANA's Root Zone Database (a different publisher) classes each TLD by type, listing .jp as country code and .app as generic. The .app page and the database are one source, both from IANA.
- Note: Loosely said, and true for a beginner: the claim names the two main groups and leaves out the others (RFC 9499 says there are others; IANA's database also lists special-use and test types). Its "often" does not rule them out.
- Note: Currency: RFC 9499 is not obsoleted; the IANA Root Zone Database and the .app page are live (the .app entry shows it active). Checked 2026-11-14.

### entry "top-level-domain": names — ✅

- Note: Names shown: "Top-level domain" and "TLD". Statement 1 gives both, as "A top-level domain (TLD)", and RFC 9499 §2 gives the same pair for this thing.

### entry "top-level-domain": lessons — ✅

- Note: The tied lesson term `term-tld` in `what-is-dns` names the same thing (top-level domain). Its idea, the endings such as .app or .com, each with a list of the names under it, is a plainer form of statements 1 and 2 (the last part of a name; its servers point to the domains under it) and contradicts nothing in the definition.

## Sources

- `iana-root-db`: IANA's Root Zone Database, fetched from iana.org; the live registry, listing each TLD with its status and type. Current. Checked 2026-11-14.
- `iana-root-db-app`: IANA's .app entry, fetched from iana.org; live, last updated 2025-04-11, status active. Current. Checked 2026-11-14.
- `iana-root-zone`: IANA's Root Zone Management page, fetched from iana.org; live, not marked archived. Current. Checked 2026-11-14.
- `rfc-1034`: RFC 1034 (STD 13, Internet Standard). Its RFC Editor info page lists updates but no obsoleting RFC; the relevant updates (RFC 2181, RFC 9471) were read and keep the claims. Current. Checked 2026-11-14.
- `rfc-9499`: RFC 9499 (BCP 219, March 2024). Its RFC Editor info page shows it obsoletes RFC 8499 and is not itself obsoleted. Current. Checked 2026-11-14.
