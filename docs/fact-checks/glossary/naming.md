```json fact-check
{
  "slug": "glossary/naming",
  "hash": "6f439c56aa20e9ce7cbddda16809728eb18d046df736415b62c17cbae484b5cd",
  "checked": "2026-11-14",
  "checker": "claude-opus-5-5",
  "verdicts": {
    "entry \"a-record\": names": "✅",
    "entry \"a-record\": statement \"a-record-1\"": "✅",
    "entry \"a-record\": statement \"a-record-2\"": "✅",
    "entry \"a-record\": statement \"a-record-3\"": "✅",
    "entry \"a-record\": lessons": "✅",
    "entry \"authoritative-server\": names": "✅",
    "entry \"authoritative-server\": statement \"authoritative-server-1\"": "✅",
    "entry \"authoritative-server\": statement \"authoritative-server-2\"": "✅",
    "entry \"authoritative-server\": statement \"authoritative-server-3\"": "✅",
    "entry \"authoritative-server\": lessons": "✅",
    "entry \"dns\": names": "✅",
    "entry \"dns\": statement \"dns-1\"": "✅",
    "entry \"dns\": statement \"dns-2\"": "✅",
    "entry \"dns\": statement \"dns-3\"": "✅",
    "entry \"dns-cache\": names": "✅",
    "entry \"dns-cache\": statement \"dns-cache-1\"": "✅",
    "entry \"dns-cache\": statement \"dns-cache-2\"": "✅",
    "entry \"dns-cache\": statement \"dns-cache-3\"": "✅",
    "entry \"dns-cache\": lessons": "✅",
    "entry \"dns-resolver\": names": "✅",
    "entry \"dns-resolver\": statement \"dns-resolver-1\"": "✅",
    "entry \"dns-resolver\": statement \"dns-resolver-2\"": "✅",
    "entry \"dns-resolver\": statement \"dns-resolver-3\"": "✅",
    "entry \"dns-resolver\": lessons": "✅",
    "entry \"name-server\": names": "✅",
    "entry \"name-server\": statement \"name-server-1\"": "✅",
    "entry \"name-server\": statement \"name-server-2\"": "✅",
    "entry \"name-server\": statement \"name-server-3\"": "✅",
    "entry \"referral\": names": "✅",
    "entry \"referral\": statement \"referral-1\"": "✅",
    "entry \"referral\": statement \"referral-2\"": "✅",
    "entry \"referral\": statement \"referral-3\"": "✅",
    "entry \"referral\": lessons": "✅",
    "entry \"root-server\": names": "✅",
    "entry \"root-server\": statement \"root-server-1\"": "✅",
    "entry \"root-server\": statement \"root-server-2\"": "✅",
    "entry \"root-server\": statement \"root-server-3\"": "✅",
    "entry \"root-server\": lessons": "✅",
    "entry \"top-level-domain\": names": "✅",
    "entry \"top-level-domain\": statement \"top-level-domain-1\"": "✅",
    "entry \"top-level-domain\": statement \"top-level-domain-2\"": "✅",
    "entry \"top-level-domain\": statement \"top-level-domain-3\"": "⚠️",
    "entry \"top-level-domain\": lessons": "✅"
  },
  "sources": [
    { "id": "iana-root-db-app", "current": true, "checked": "2026-11-14" },
    { "id": "iana-root-servers", "current": true, "checked": "2026-11-14" },
    { "id": "iana-root-zone", "current": true, "checked": "2026-11-14" },
    { "id": "iana-root-zone-file", "current": true, "checked": "2026-11-14" },
    { "id": "icann-rssac-faq", "current": true, "checked": "2026-11-14" },
    { "id": "microsoft-ipconfig", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-1034", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-1035", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-3596", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-7720", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-7766", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-8767", "current": true, "checked": "2026-11-14" },
    { "id": "rfc-9499", "current": true, "checked": "2026-11-14" }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-14",
    "count": 81,
    "digest": "c49e086fb5133a94533007bc626215390866c09b659b149e1da27520154bb66b",
    "files": {
      "rfc-1035": "d14ae809fc9b41bbcae26bb38c937c9515808b944f3252b00de9fe0e95f4fdfb",
      "rfc-3596": "2a3d44744086f66a7ba00e7d282dc1f740a3e0b63b4b6f7c763ffc0e61ee1dbb",
      "rfc-9499": "270b62df854911dddd246f6c081952106897983a5e02dfe8b3819d72843d9ab1",
      "rfc-1034": "d6b10a71441df879cc2817d23f2dad120c8a5f87e74eba1e4ed4b743a76a891a",
      "rfc-7766": "9fbf70d43e5c423c2464eafd724ef164490b4d8e341e5d9b5fe1023402bb404f",
      "rfc-8767": "60841115fa4edc1918ef5cd423ca73c99f9e4e192466729941e55e0537bb6bc4",
      "microsoft-ipconfig": "465cb5a0f45fc18f4ba87f621a14b9b9891a7cf8dc7618e55500f4d9c688fbd5",
      "rfc-7720": "4257c69cb6eb49e92819d9f44b5456c3ec702aa737c5256cc9c9cf3ad89c48fd",
      "iana-root-servers": "8fa824eb44720792e0f691eb462d275adf31a012f2c407c02be1d8e116e10b14",
      "iana-root-zone-file": "bf9fdb78edd342d4734fcb88d651e465302eaa9acc8a85ab44c6df574a9673aa",
      "iana-root-zone": "c14aa1b74f65280f4d05bd80461cc1c3bc62e26320955a2c97b1232fc93d9213",
      "icann-rssac-faq": "c53b11c8c74a0a9a56b28b002e9a8aae69687cb6bb098f1581adb6a985d2cc46",
      "iana-root-db-app": "ed81572feba247f27cc2e557f3aa6cd932797bf0df61a08dee7087c5f5fb687e"
    }
  },
  "items": {
    "entry \"a-record\": names": "35a60465061f3801acee3922a6c07fcbdeab6630398a35610dc3a3dc479edc10",
    "entry \"a-record\": statement \"a-record-1\"": "d8f58c8ce0951692ac1b333ca63cd08fde20773d923bd353558386bd84324421",
    "entry \"a-record\": statement \"a-record-2\"": "0145bc654423635a45f5f22a60c863bd7fdc697f2178f218280b8d5f31e6ebfb",
    "entry \"a-record\": statement \"a-record-3\"": "0729fc57b9ba8ef0eb7866f9575682348e66a589b9a7ec273e75dd103863fb38",
    "entry \"a-record\": lessons": "67c93a91e0904e9262cd02f0394f32a971a06e6531270403ca8b315bf167d2cc",
    "entry \"authoritative-server\": names": "aef1dd79f067e927add86ee33f3525a9ff50defe5910a871fc16c2d55910e8d8",
    "entry \"authoritative-server\": statement \"authoritative-server-1\"": "439daea37625b24a569f3ca8d2c164399ad352ee090de1f20fdb4f6c8d601621",
    "entry \"authoritative-server\": statement \"authoritative-server-2\"": "95534204c78ced294459bce7685c9751a4e2d24a7bead700575d022657826f3d",
    "entry \"authoritative-server\": statement \"authoritative-server-3\"": "8c135380f94185a9e944b2f6bd8fb54f1ef44de309b4f152c55d5f873a208166",
    "entry \"authoritative-server\": lessons": "17a31d359993d7a82cd6729ad67af29686ecd74784cca16802084ea1eb280e9e",
    "entry \"dns\": names": "52301306a3b66c622cff8740d08c891a151b4cbcf024e96a16bfca639c159dbc",
    "entry \"dns\": statement \"dns-1\"": "d60d956577dfd9f156b07eec5f549ef84edc9f83a22ede4ff740395700c9a632",
    "entry \"dns\": statement \"dns-2\"": "70f74ec557a25806a9f3d9883a2e77e283055d76a40d1841f24d76218787fe98",
    "entry \"dns\": statement \"dns-3\"": "3016990686ae3ff664ef2b3a9d88641151964c41d6e9595243dbc8c03a54d58d",
    "entry \"dns-cache\": names": "1df253a35fb4216dfa059f474d73e22bbc1fa51a4cab3362785b6c2e6471948a",
    "entry \"dns-cache\": statement \"dns-cache-1\"": "9568e3fbc541f1d62f3a1ada4765f98e14903b72e5ce9a5f9a3c580b7b186b18",
    "entry \"dns-cache\": statement \"dns-cache-2\"": "313268c2021bc1e85a21527491d24a7010227a2cc7344dd00a85112d8e2b7ee0",
    "entry \"dns-cache\": statement \"dns-cache-3\"": "29c1da3cd6143c21b0f08b1eca587f135fc83680f3acc053d4bdba73f6b469e7",
    "entry \"dns-cache\": lessons": "541eb1b01d65b2025575891d161e7b0cc27c31c25ad9818c1f43912745e1d75e",
    "entry \"dns-resolver\": names": "79014d3c2f9104b63e973d2094745c247af4fc7085ddc7640fbc38ab196f109a",
    "entry \"dns-resolver\": statement \"dns-resolver-1\"": "bab001dfab92762e43f85c353306b985a14e5afabc8ccd15cb571f21d8158539",
    "entry \"dns-resolver\": statement \"dns-resolver-2\"": "26aaade545ffcf384bcb2daddae980a7d4d208a34d40e6d4bb1c180079fb0cfd",
    "entry \"dns-resolver\": statement \"dns-resolver-3\"": "18e8300a50830d8512e87111db3b565c2a9df395fa4f5c42298fb14250e2e95b",
    "entry \"dns-resolver\": lessons": "b42e9f74048fada1c432985da95416f8e0092b1d94ca59bd618bdcfdb4c91bc4",
    "entry \"name-server\": names": "df1276a66b487982e718d65a2d55fb15ad307fc7075ddbeecf85fd2d1243e1b6",
    "entry \"name-server\": statement \"name-server-1\"": "bd59df872324e66547371b328ea6e570cfac4c51a0a6b2a14b931644e28c53b8",
    "entry \"name-server\": statement \"name-server-2\"": "696d25d34df70e47a47bdf76ab210253990657653c0b651ca4a8adfdf8a09e11",
    "entry \"name-server\": statement \"name-server-3\"": "bfd9aa11c34215508f4a54c8c71bb0e22aea74f6515b7f80c15d2b9e640a6987",
    "entry \"referral\": names": "00e84bf3e26a31c919ad8135b09585a24ed1ab60a2803b28941801866e2b73f8",
    "entry \"referral\": statement \"referral-1\"": "81aa583778c03d26ddc1252293c7c06fc30ab88dba94a4e77c75a9de2c4bdcc9",
    "entry \"referral\": statement \"referral-2\"": "348d07afcb28000e85e0936089c788fd4cfb232ad93f227c48973ef585064548",
    "entry \"referral\": statement \"referral-3\"": "2384fb0676739fe4ff042a1aa3b8feec358080d9ffc3ef733e9ada21a42175de",
    "entry \"referral\": lessons": "7ed46516989ea232a6a01d770eb055ee58c630eaa503207afb65e4b2b95aef58",
    "entry \"root-server\": names": "91d8a576decbca5cf4c3997305edcfccdff3b8ec6473d1d98b295e01ef1739ab",
    "entry \"root-server\": statement \"root-server-1\"": "b4f09e4a4a946effd59476b897cd1f21dcab88b4dab30a2ae0f721c916189168",
    "entry \"root-server\": statement \"root-server-2\"": "527aff48c22ef3bc935a1ca455c10ca6564298a53f457b87a274a7005729f997",
    "entry \"root-server\": statement \"root-server-3\"": "db7ffbd1e8192e604515609a964910f3ec16c32f1c505c6d08d56ce006cdb41a",
    "entry \"root-server\": lessons": "19c7f4e68eef10f0c1d35674e613b721381a7832c116ef4ebfbe844fe734d157",
    "entry \"top-level-domain\": names": "1a24c26994b4f7a56661e7a80a51d88083eb20c3fcb120ad853687e01ad85d94",
    "entry \"top-level-domain\": statement \"top-level-domain-1\"": "f3c3e52f3601ca9a3f8f9659d79d678e7145be03d502e0e8e7fcfd72528bcfe4",
    "entry \"top-level-domain\": statement \"top-level-domain-2\"": "f2ab5071d98c24c773a64ad1c51dae380856bad3cf4b59a1e3bc8d76637a2c22",
    "entry \"top-level-domain\": statement \"top-level-domain-3\"": "812b7d64ce3d74665cb4885c603842e2896b5aad52d72e7bc6784133df577b50",
    "entry \"top-level-domain\": lessons": "762c022585038aaf0c1a05f3203d55057ef8a73cf690667d182c7025a6468744"
  },
  "limits": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}
```

# Fact-check: glossary group `naming`

Checked 2026-11-14 by claude-opus-5-5. 43 items: 42 ✅, 1 ⚠️, 0 ❌.

Every source was fetched in this run from its publisher: the RFCs as plain text from rfc-editor.org (status from each RFC's info page and its JSON record), the IANA pages from iana.org, the root zone file from internic.net, the RSSAC FAQ from icann.org and the ipconfig page from learn.microsoft.com.

## Entry: A record

### entry "a-record": names — ✅

- Note: the one name shown, A record, is used for this thing by statements a-record-1 and a-record-2, and RFC 1035 §3.4.1 itself speaks of A records.

### entry "a-record": statement "a-record-1" — ✅

An A record is a DNS record that holds one IPv4 address for a name.

- `rfc-1035` §3.2.2
  > A 1 a host address
- `rfc-1035` §3.4.1
  > ADDRESS A 32 bit Internet address.
- `rfc-3596` §1
  > applications assume that address queries return 32-bit IPv4 addresses only.
- Note: RFC 1035 is the defining standard for the A record: it assigns the type its value and defines its data as one 32-bit address. RFC 3596 ties the 32-bit address to IPv4.
- Note: the claim leaves out that the A record's data is defined this way for the Internet class (the class in practical use).
- Note: currency. RFC 1035 is an Internet Standard, not obsoleted; its updates do not change the A record's format. RFC 3596 is an Internet Standard, not obsoleted.

### entry "a-record": statement "a-record-2" — ✅

A name with several IPv4 addresses has several A records.

- `rfc-1035` §3.4.1
  > Hosts that have multiple Internet addresses will have multiple A records.
- Note: RFC 1035 defines the A record and states this directly. The claim says "name" where the RFC says "host"; the meaning for a beginner is the same.
- Note: currency as for a-record-1.

### entry "a-record": statement "a-record-3" — ✅

IPv6 addresses go in a different record, the AAAA record.

- `rfc-3596` §2.1
  > The AAAA resource record type is a record specific to the Internet class that stores a single IPv6 address.
- `rfc-9499` §5
  > Address records: Records whose type is either A or AAAA.
- Note: RFC 3596 is the defining standard for the AAAA record type and its data.
- Note: currency. RFC 3596 is an Internet Standard, not obsoleted or updated; RFC 9499 is a Best Current Practice, not obsoleted.

### entry "a-record": lessons — ✅

- Note: the lesson term "A record" in `what-is-dns` names the same record; its idea (the line saying name = number) is a plainer form of the definition and contradicts none of it.

## Entry: Authoritative server

### entry "authoritative-server": names — ✅

- Note: the name shown is used for this thing in statement authoritative-server-1, and RFC 9499 §6 defines the term under this name.

### entry "authoritative-server": statement "authoritative-server-1" — ✅

An authoritative server is a name server that holds a zone’s records itself, so it answers for the names in that zone without asking other servers.

- `rfc-9499` §6
  > Authoritative server: "A server that knows the content of a DNS zone from local knowledge, and thus can answer queries about that zone without needing to query other servers."
- `rfc-1034` §2.4
  > Name servers know the parts of the domain tree for which they have complete information; a name server is said to be an AUTHORITY for these parts of the name space. Authoritative information is organized into units called ZONEs
- Note: RFC 1034 is the defining standard for DNS name servers, authority and zones.
- Note: currency. RFC 1034 is an Internet Standard, not obsoleted; its updates (DNSSEC, negative caching, serve-stale and others) do not change what authority means. RFC 9499 is current.

### entry "authoritative-server": statement "authoritative-server-2" — ✅

Its answers are marked as authoritative (the AA flag), unlike answers a resolver gives from its cache.

- `rfc-1035` §4.1.1
  > AA Authoritative Answer - this bit is valid in responses, and specifies that the responding name server is an authority for the domain name in question section.
- `rfc-1034` §4.1
  > It may also have some cached non-authoritative data about other parts of the tree. The name server marks its responses to queries so that the requester can tell whether the response comes from authoritative data or not.
- `rfc-9499` §6
  > It is a system that responds to DNS queries with information about zones for which it has been configured to answer with the AA flag in the response header set to 1.
- Note: RFC 1035 defines the AA bit in the message header; RFC 1034 defines the name server's marking of authoritative responses.
- Note: the claim speaks of the server's answers. Its referrals to child zones carry the bit cleared (RFC 9499 §6 says so); a referral is not an answer, so the claim holds in the ordinary case.
- Note: currency as for authoritative-server-1; RFC 1035 is not obsoleted, and its updates keep the AA bit.

### entry "authoritative-server": statement "authoritative-server-3" — ✅

A domain’s NS records name its authoritative servers, and there are normally at least two.

- `rfc-9499` §6
  > An authoritative server is named in the NS ("name server") record in a zone.
- `rfc-1035` §3.2.2
  > NS 2 an authoritative name server
- `rfc-1034` §4.1
  > By administrative fiat, we require every zone to be available on at least two servers, and many zones have more redundancy than that.
- Note: RFC 1035 defines the NS record type; RFC 1034 defines the requirement of at least two servers per zone.
- Note: the claim says "domain" where the sources say "zone"; for a beginner's domain the two coincide.
- Note: currency as above.

### entry "authoritative-server": lessons — ✅

- Note: the lesson term "Authoritative server" names the same thing; "knows a site's names for sure" is a plainer form of holding the zone's own data, and contradicts nothing in the definition.

## Entry: DNS

### entry "dns": names — ✅

- Note: both names shown, DNS and Domain Name System, are given for this thing by statement dns-1, and RFC 1034 §1 and RFC 9499 §1 give the full name with its abbreviation.

### entry "dns": statement "dns-1" — ✅

DNS, the Domain Name System, looks up the information stored under a name, such as the IP address of example.com.

- `rfc-1034` §2.4
  > Conceptually, each node and leaf of the domain name space tree names a set of information, and query operations are attempts to extract specific types of information from a particular set.
- `rfc-1034` §1
  > This RFC is an introduction to the Domain Name System (DNS)
- `rfc-9499` §1
  > The Domain Name System (DNS) is a simple query-response protocol whose messages in both directions have the same format.
- Note: RFC 1034 is the defining standard for the DNS's concepts: its name space, the information under each name and the queries that retrieve it. §2.4 also gives host addresses as the information an address query returns.
- Note: example.com is example data.
- Note: currency as above.

### entry "dns": statement "dns-2" — ✅

Its data is spread over many name servers, and resolvers ask them on behalf of programs.

- `rfc-1034` §2.4
  > RESOLVERS are programs that extract information from name servers in response to client requests.
- `rfc-1034` §2.2
  > The sheer size of the database and frequency of updates suggest that it must be maintained in a distributed manner, with local caching to improve performance.
- `rfc-9499` §6
  > Resolver: A program "that extract[s] information from name servers in response to client requests."
- Note: RFC 1034 defines the DNS's three parts, name servers and resolvers among them.
- Note: currency as above.

### entry "dns": statement "dns-3" — ✅

Queries usually go over UDP to port 53; TCP on port 53 is used too.

- `rfc-1035` §4.2
  > While virtual circuits can be used for any DNS activity, datagrams are preferred for queries due to their lower overhead and better performance. … The Internet supports name server access using TCP [RFC-793] on server port 53 (decimal) as well as datagram access using UDP [RFC-768] on UDP port 53 (decimal).
- `rfc-7766` §5
  > All general-purpose DNS implementations MUST support both UDP and TCP transport.
- Note: RFC 1035 defines the DNS's transport on port 53; RFC 7766 (which updates it) defines the current TCP requirements.
- Note: RFC 7766 also relaxes the old rule that a query must try UDP first, making TCP a valid alternative; "usually UDP" still describes the ordinary case and is not contradicted. The claim leaves out encrypted transports (DNS over TLS or HTTPS) on other ports; "usually" covers them.
- Note: currency. RFC 1035 is not obsoleted; RFC 7766 is a Proposed Standard, not obsoleted, updated by RFC 8490 and RFC 9103 (stateful operations and zone transfer over TLS), neither of which changes this.

## Entry: DNS cache

### entry "dns-cache": names — ✅

- Note: the name shown, DNS cache, is used for this thing by statement dns-cache-1.

### entry "dns-cache": statement "dns-cache-1" — ✅

A DNS cache holds answers a resolver has already received, so it can answer again without asking name servers.

- `rfc-1034` §5.1
  > A very important goal of the resolver is to eliminate network delay and name server load from most requests by answering them from its cache of prior results.
- `rfc-1034` §5.3.3
  > 1. See if the answer is in local information, and if so return it to the client.
- `rfc-9499` §6
  > In general, a recursive resolver is expected to cache the answers it receives
- Note: RFC 1034 is the defining standard for the resolver and its cache.
- Note: currency as above.

### entry "dns-cache": statement "dns-cache-2" — ✅

An answer may be kept for the time its TTL gives, then is asked for again.

- `rfc-8767` §4
  > TTL a 32-bit unsigned integer number of seconds that specifies the duration that the resource record MAY be cached before the source of the information MUST again be consulted.
- `rfc-1034` §3.6
  > The TTL describes how long a RR can be cached before it should be discarded.
- Note: RFC 8767 holds the current definition of the TTL field, amending RFC 1035's; RFC 1034 defines the TTL's role in caching.
- Note: the claim leaves out the serve-stale exception (RFC 8767 lets an expired record be used when it cannot be refreshed) and that a cache may drop an answer sooner. "Asked for again" means when it is next needed.
- Note: currency. RFC 8767 is a Proposed Standard, not obsoleted or updated.

### entry "dns-cache": statement "dns-cache-3" — ✅

A device may keep its own cache, and a recursive resolver usually keeps one shared by all its users.

- `microsoft-ipconfig` §Parameters
  > Displays the contents of the DNS client resolver cache, which includes both entries preloaded from the local Hosts file and any recently obtained resource records for name queries resolved by the computer.
- `rfc-1034` §5.1
  > It follows that caches which are shared by multiple processes, users, machines, etc., are more efficient than non-shared caches.
- `rfc-1034` §5.3.1
  > can centralize the cache for a whole local network or organization.
- `rfc-1034` §4.3.1
  > a network where we want to concentrate the cache rather than having a separate cache for each client.
- `rfc-9499` §6
  > In general, a recursive resolver is expected to cache the answers it receives (which would make it a full-service resolver), but some recursive resolvers might not cache.
- Note: the device's own cache is stated by Microsoft's page and by RFC 1034 §5.1 (the resolver sits on the program's machine and may answer from its local cache); the recursive resolver's shared cache by RFC 1034 and RFC 9499. RFC 1034 defines the resolver and its cache.
- Note: currency. The ipconfig page is live on learn.microsoft.com, updated in 2026, and documents a current Windows command.

### entry "dns-cache": lessons — ✅

- Note: the lesson term "DNS cache" names the same thing; "answers kept for next time" is a plainer form of the definition.

## Entry: DNS resolver

### entry "dns-resolver": names — ✅

- Note: the name shown, DNS resolver, is used for this thing by statement dns-resolver-1; RFC 1034 and RFC 9499 call it a resolver.

### entry "dns-resolver": statement "dns-resolver-1" — ✅

A DNS resolver is a program that gets information from name servers for the programs that ask it.

- `rfc-1034` §2.4
  > RESOLVERS are programs that extract information from name servers in response to client requests.
- `rfc-9499` §6
  > Resolver: A program "that extract[s] information from name servers in response to client requests."
- Note: RFC 1034 is the defining standard for the resolver.
- Note: currency as above.

### entry "dns-resolver": statement "dns-resolver-2" — ✅

A device’s own small resolver usually passes each question to a recursive resolver, which follows referrals from server to server until it has the answer.

- `rfc-1034` §5.3.1
  > One option for implementing a resolver is to move the resolution function out of the local machine and into a name server which supports recursive queries.
- `rfc-1034` §5.3.3
  > b. if the response contains a better delegation to other servers, cache the delegation information, and go to step 2.
- `rfc-9499` §6
  > Stub resolvers generally depend on a recursive resolver to undertake the actual resolution function.
- Note: RFC 1034 defines the stub resolver and the resolver's algorithm of following delegations.
- Note: "each question" is softened by "usually", and leaves out questions the device answers from its own cache (which dns-cache-3 teaches) and those the recursive resolver answers from its cache. The ordinary case holds.
- Note: currency as above.

### entry "dns-resolver": statement "dns-resolver-3" — ✅

A recursive resolver normally keeps answers in a cache, to reuse them.

- `rfc-9499` §6
  > Recursive resolver: A resolver that acts in recursive mode. In general, a recursive resolver is expected to cache the answers it receives
- `rfc-1034` §5.1
  > A very important goal of the resolver is to eliminate network delay and name server load from most requests by answering them from its cache of prior results.
- Note: RFC 1034 defines the resolver and its cache. "Normally" matches RFC 9499's note that some recursive resolvers do not cache.
- Note: currency as above.

### entry "dns-resolver": lessons — ✅

- Note: the lesson term "DNS resolver" names the same thing; "the helper that looks names up for you" is a plainer form of the definition.

## Entry: Name server

### entry "name-server": names — ✅

- Note: all three names shown (Name server, Nameserver, DNS server) are given for this thing by statement name-server-1, and RFC 9499 §6 gives all three as names in use for DNS servers.

### entry "name-server": statement "name-server-1" — ✅

A name server (also nameserver or DNS server) is a server that holds part of the DNS’s data, in zones, and answers queries about it.

- `rfc-1034` §2.4
  > NAME SERVERS are server programs which hold information about the domain tree's structure and set information.
- `rfc-1034` §4.1
  > The database is divided up into sections called zones, which are distributed among the name servers. While name servers can have several optional functions and sources of data, the essential task of a name server is to answer queries using data in its zones.
- `rfc-9499` §6
  > In past RFCs, DNS servers are sometimes called "name servers", "nameservers", or just "servers".
- Note: RFC 1034 is the defining standard for name servers and zones.
- Note: the wider use of these names for recursive resolvers is given by the same entry's statement name-server-3, so the definition does not mislead.
- Note: currency as above.

### entry "name-server": statement "name-server-2" — ✅

Root, TLD and authoritative servers are all name servers; each answers from its zones or with a referral.

- `rfc-1034` §4.1
  > name servers can answer queries in a simple manner; the response can always be generated using only local data, and either contains the answer to the question or a referral to other name servers "closer" to the desired information.
- `rfc-7720` §1
  > The root servers are authoritative servers of the unique [RFC2826] root zone (".")
- `iana-root-servers` §Root Name Servers
  > The authoritative name servers that serve the DNS root zone, often known simply as the “root servers”, are a network of hundreds of servers in many countries around the world.
- `iana-root-zone-file` §The app. NS records
  > app. 172800 IN NS ns-tld1.charlestonroadregistry.com.
- `rfc-1035` §3.2.2
  > NS 2 an authoritative name server
- `rfc-9499` §6
  > Authoritative servers also provide "referrals", usually to child zones delegated from them
- `rfc-9499` §2
  > A Top-Level Domain is a zone that is one layer below the root, such as "com" or "jp".
- Note: RFC 1034 defines name servers and the two kinds of reply; the root zone file is the live root zone itself, which defines which name servers serve each top-level domain, such as .app; RFC 1035 defines the NS record.
- Note: listing root and TLD servers beside "authoritative servers" does not deny that they are authoritative (root-server-1 says they are). The claim leaves out error replies.
- Note: currency. The root zone file fetched carries serial 2026111401; RFC 7720 is a Best Current Practice, not obsoleted or updated; the IANA root servers page is live.

### entry "name-server": statement "name-server-3" — ✅

These names are also used for recursive resolvers, so which is meant depends on context.

- `rfc-9499` §6
  > It is important to note that the terms "DNS server" and "name server" require context in order to understand the services being provided. Both authoritative servers and recursive resolvers are often called "DNS servers" and "name servers" even though they serve different roles
- `rfc-1034` §5.3.1
  > All that the remaining stub needs is a list of name server addresses that will perform the recursive requests.
- `microsoft-ipconfig` §Parameters
  > The DNS Client service uses this information to resolve frequently queried names quickly, before querying its configured DNS servers.
- Note: RFC 9499 states the claim; RFC 1034 (a second RFC, the defining standard for the stub resolver) and Microsoft's page each call the recursive servers a device asks "name servers" or "DNS servers". "Nameserver" is a spelling of "name server" (RFC 9499 §6 lists it).
- Note: currency as above.

## Entry: Referral

### entry "referral": names — ✅

- Note: the name shown, Referral, is used for this thing by statements referral-1 to referral-3 and is the term RFC 9499 §4 defines.

### entry "referral": statement "referral-1" — ✅

A referral is an answer from a name server that does not have the answer itself, telling the resolver which servers to ask instead.

- `rfc-9499` §4
  > Referrals: A type of response in which a server, signaling that it is not (completely) authoritative for an answer, provides the querying resolver with an alternative place to send its query.
- `rfc-1034` §4.3.1
  > the response contains an error, the answer, or a referral to some other server "closer" to the answer.
- Note: RFC 1034 defines the name server's replies, the referral among them.
- Note: "an answer" is the everyday word for a reply; in DNS terms a referral is a response with an empty answer section (RFC 9499 §4). This does not mislead a beginner.
- Note: currency as above.

### entry "referral": statement "referral-2" — ✅

It names those servers, usually with their addresses, a step closer to the answer.

- `rfc-1034` §4.3.2
  > Copy the NS RRs for the subzone into the authority section of the reply. Put whatever addresses are available into the additional section, using glue RRs if the addresses are not available from authoritative data or the cache.
- `rfc-1034` §4.3.1
  > A referral to name servers which have zones which are closer ancestors to the name than the server sending the reply.
- `rfc-9499` §6
  > these referrals have the AA bit set to 0 and come with referral data in the Authority and (if needed) the Additional sections.
- Note: RFC 1034 defines the referral's content. "Usually with their addresses" is looser than the sources, which add addresses when available or needed; the referrals a beginner meets (from the root and TLD servers) carry them.
- Note: currency as above.

### entry "referral": statement "referral-3" — ✅

A recursive resolver follows referrals itself, server by server, so the device that asked gets the answer, never a referral.

- `rfc-1034` §4.3.1
  > The simplest mode for the client is recursive, since in this mode the name server acts in the role of a resolver and returns either an error or the answer, but never referrals.
- `rfc-1034` §5.3.3
  > b. if the response contains a better delegation to other servers, cache the delegation information, and go to step 2.
- `rfc-9499` §6
  > in [recursive] mode the name server acts in the role of a resolver and returns either an error or the answer, but never referrals.
- Note: RFC 1034 defines recursive service and the resolver's algorithm; its "never referrals" is the source of the claim's "never".
- Note: the claim leaves out that the device may get an error instead of the answer.
- Note: currency as above.

### entry "referral": lessons — ✅

- Note: the lesson term "Referral" names the same thing; its idea (I don't know, ask them, here is where they are) matches the definition, addresses included.

## Entry: Root server

### entry "root-server": names — ✅

- Note: the name shown, Root server, is used for this thing by statement root-server-1, and IANA's page and RFC 7720 use it.

### entry "root-server": statement "root-server-1" — ✅

A root server is an authoritative name server for the DNS root zone, the top of the naming tree.

- `rfc-7720` §1
  > The root servers are authoritative servers of the unique [RFC2826] root zone (".")
- `iana-root-servers` §Root Name Servers
  > The authoritative name servers that serve the DNS root zone, often known simply as the “root servers”
- `iana-root-zone` §Root Zone Management
  > The Domain Name System (DNS) root zone is the highest-level of the naming hierarchy
- Note: confirmed by two independent sources: the IETF's RFC 7720 and IANA's page.
- Note: currency. RFC 7720 is a Best Current Practice, not obsoleted or updated; both IANA pages are live.

### entry "root-server": statement "root-server-2" — ✅

The root zone mainly lists each top-level domain’s name servers, so a root server points a resolver to a TLD’s servers.

- `iana-root-zone` §Root Zone Management
  > The Domain Name System (DNS) root zone is the highest-level of the naming hierarchy, principally composed of delegations of top-level domains (such as .edu or .in).
- `rfc-9499` §7
  > Delegation happens when an NS RRset is added in the parent zone for the child origin.
- `iana-root-zone-file` §The app. NS records
  > app. 172800 IN NS ns-tld1.charlestonroadregistry.com.
- `rfc-1034` §5.3.3
  > The root servers will provide eventual access to all of the domain space.
- `rfc-1034` §4.3.2
  > b. If a match would take us out of the authoritative data, we have a referral. This happens when we encounter a node with NS RRs marking cuts along the bottom of a zone.
- Note: the root zone file is the live root zone and defines each top-level domain's delegation (its NS records); RFC 1034 defines the referral a server gives at such a delegation.
- Note: currency. The root zone file carries serial 2026111401.

### entry "root-server": statement "root-server-3" — ✅

There are 13 root server names, a.root-servers.net to m.root-servers.net, together run as many copies around the world.

- `iana-root-zone-file` §The root zone’s NS records
  > . 518400 IN NS a.root-servers.net. … . 518400 IN NS m.root-servers.net.
- `iana-root-servers` §Root Name Servers
  > are a network of hundreds of servers in many countries around the world. They are configured in the DNS root zone as 13 named authorities, as follows.
- `icann-rssac-faq` §1.1
  > While today there remain 13 RSIs, there are in fact more than 1500 anycast instances in operation throughout the world.
- Note: the root zone file defines the root's NS records, a.root-servers.net to m.root-servers.net, thirteen in all (checked in the fetched file). The copies around the world are stated by IANA's page and by the RSSAC FAQ, written by ICANN's root server advisory committee on icann.org; IANA's page is published by PTI on iana.org, a separate site and publisher (PTI is an ICANN affiliate).
- Note: currency. The RSSAC FAQ page is live and current (it states the present count of instances).

### entry "root-server": lessons — ✅

- Note: the lesson term "Root server" names the same thing; "the top of the directory, who knows each ending" is a plainer form of the root zone listing each top-level domain's servers.

## Entry: Top-level domain

### entry "top-level-domain": names — ✅

- Note: both names shown, Top-level domain and TLD, are given for this thing by statement top-level-domain-1, and RFC 9499 §2 gives both.

### entry "top-level-domain": statement "top-level-domain-1" — ✅

A top-level domain (TLD) is a domain one level below the root, such as .com, .jp or .app: the last part of a name like example.com.

- `rfc-9499` §2
  > in both English and the C programming language, the root or Top-Level Domain (TLD) label in the ordered list is rightmost … Top-Level Domain (TLD): A Top-Level Domain is a zone that is one layer below the root, such as "com" or "jp".
- `iana-root-db-app` §.app Top-Level Domain
  > Generic top-level domain
- `rfc-1034` §3.1
  > By convention, the labels that compose a domain name are printed or read left to right, from the most specific (lowest, farthest from the root) to the least specific (highest, closest to the root).
- `iana-root-zone` §Root Zone Management
  > principally composed of delegations of top-level domains (such as .edu or .in).
- Note: RFC 1034 is the defining standard of the domain name space: the root, domains below it and the order of a name's labels, from which "one level below the root" and "the last part" follow. RFC 9499 and IANA confirm the claim independently; .app's status is from IANA's live root zone database.
- Note: "last part" holds for names written left to right, as RFC 9499 notes.
- Note: currency. Both IANA pages are live; the .app entry shows it delegated and active.

### entry "top-level-domain": statement "top-level-domain-2" — ✅

Its name servers point to the name servers of the domains under it.

- `rfc-9499` §2
  > Most of them are also delegation-centric zones (defined in Section 7)
- `rfc-9499` §7
  > Delegation happens when an NS RRset is added in the parent zone for the child origin.
- `rfc-1034` §4.2.1
  > The RRs that describe cuts around the bottom of the zone are NS RRs that name the servers for the subzones.
- `rfc-1034` §4.3.2
  > Copy the NS RRs for the subzone into the authority section of the reply.
- Note: RFC 1034 defines zones, their delegations to subzones and the referral built from them.
- Note: currency as above.

### entry "top-level-domain": statement "top-level-domain-3" — ⚠️

TLDs are often grouped into country-code TLDs (ccTLDs) and generic TLDs (gTLDs), such as .app.

- `rfc-9499` §2
  > TLDs are often divided into sub-groups such as Country Code Top-Level Domains (ccTLDs), Generic Top-Level Domains (gTLDs), and others; the division is a matter of policy and beyond the scope of this document.
- `iana-root-db-app` §.app Top-Level Domain
  > Generic top-level domain
- Note: the claim is true for a beginner (it leaves out the other groups RFC 9499 mentions), and both sources are current.
- Note: what is wrong: it is not confirmed. Only RFC 9499 names the country-code group; IANA's .app page gives .app's category as generic but does not name country-code TLDs, and neither citation is marked as a defining standard. A second source that names both groups (IANA's root zone database list, which gives each TLD's type, for example) would confirm it.

### entry "top-level-domain": lessons — ✅

- Note: the lesson term "Top-level domain" names the same thing; its idea (the endings, like .app or .com, each with a list of the names under it) agrees with top-level-domain-1 and top-level-domain-2.

## Sources

- `iana-root-db-app`: IANA's root zone database entry for .app, live on iana.org, last updated 2025-04-11, showing .app delegated and active. Current. Checked 2026-11-14.
- `iana-root-servers`: IANA's root servers page, live on iana.org, listing the 13 root server names and their operators. Current. Checked 2026-11-14.
- `iana-root-zone`: IANA's root zone management page, live on iana.org. Current. Checked 2026-11-14.
- `iana-root-zone-file`: the root zone file, fetched live from internic.net, serial 2026111401 (published by IANA). Current. Checked 2026-11-14.
- `icann-rssac-faq`: the RSSAC FAQ, live on icann.org, readable without signing in. Current. Checked 2026-11-14.
- `microsoft-ipconfig`: Microsoft Learn's ipconfig reference, live, updated 2026-02-16, documenting a current Windows command. Current. Checked 2026-11-14.
- `rfc-1034`: Internet Standard; the RFC Editor's info page lists no obsoleting RFC. Updated by 19 RFCs; the relevant ones read for these claims (RFC 8767 on the TTL) do not change them. Current. Checked 2026-11-14.
- `rfc-1035`: Internet Standard; not obsoleted. Updated by 29 RFCs; the relevant ones read (RFC 7766 on TCP, RFC 8767 on the TTL) do not change the claims. Current. Checked 2026-11-14.
- `rfc-3596`: Internet Standard; not obsoleted or updated. Current. Checked 2026-11-14.
- `rfc-7720`: Best Current Practice; not obsoleted or updated. Current. Checked 2026-11-14.
- `rfc-7766`: Proposed Standard; not obsoleted; updated by RFC 8490 and RFC 9103, neither of which affects the claim. Current. Checked 2026-11-14.
- `rfc-8767`: Proposed Standard; not obsoleted or updated. Current. Checked 2026-11-14.
- `rfc-9499`: Best Current Practice; not obsoleted or updated. Current. Checked 2026-11-14.

## Limit overrides

None.
