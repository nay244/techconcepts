# S12: job 10 facts for the draft glossary groups (read-only scout report, 2026-11-13)

Scope: the draft groups in the job 10 brief (110 entries: G1's 103 plus 7 protocols marked (p)); the pilot's 10 entries are counted where they affect a question. No repo file was changed. Evidence paths are repo-relative. Lesson Learn terms were read by loading every `src/content/lessons/*.ts` through `defineLesson`'s output (units[].learn.terms), so the names, ideas and citations below are the lessons' own. Where "row N" is given, it is G1's table row in `docs/glossary-terms.md` (Part 1 rows at line N+18; Part 2 rows at line N+160).

## A. Ties

Tie = a `{ lesson, term }` pair whose term id exists in that lesson's `units[].learn.terms`. Each line gives the lesson term id, its Learn name, and its line in the lesson file. "candidate" = not one of G1's tie rows.

| Group | Entry (or sense) | Learn ties (lesson:term-id, Learn name, file:line) | G1 basis |
|---|---|---|---|
| 1 osi-model | Layer | osi-model:term-layer, "Layer", osi-model.ts:541 | row 18 |
| 1 | Peer layer | osi-model:term-peer, "Peer layer", osi-model.ts:565 | row 22 |
| 1 | Encapsulation | osi-model:term-encap, "Encapsulation", osi-model.ts:553; what-is-ip:term-encapsulation, "Encapsulation", what-is-ip.ts:537 | row 20 |
| 1 | Decapsulation | osi-model:term-decap, "Decapsulation", osi-model.ts:559 | row 21 |
| 2 packets | Header, sense "layer model" | osi-model:term-header, "Header", osi-model.ts:547 | row 19 |
| 2 | Header, sense "HTTP" | what-is-http:term-headers, "Headers", what-is-http.ts:582 | row 59 ("sense of Header") |
| 2 | Segment | what-is-tcp:term-segment, "Segment", what-is-tcp.ts:811 | row 116 |
| 2 | Datagram | what-is-udp:term-datagram, "Datagram", what-is-udp.ts:503 | row 131 |
| 2 | IP header | what-is-ip:term-header, "IP header", what-is-ip.ts:517 | row 90 |
| 2 | Forwarding | what-is-ip:term-forwarding, "Forwarding", what-is-ip.ts:531 | row 92 |
| 2 | Routing decision | what-is-ip:term-routing, "Routing decision", what-is-ip.ts:499 | row 87 |
| 3 subnetting | Subnet | subnetting:term-subnet, "Subnet", subnetting.ts:735 | row 30 |
| 3 | Subnet mask | subnetting:term-mask, "Subnet mask", subnetting.ts:711 | row 26 |
| 3 | Prefix length | subnetting:term-prefix, "Prefix length", subnetting.ts:717 | row 27 |
| 3 | Network portion | subnetting:term-network, "Network portion", subnetting.ts:699 | row 24 |
| 3 | Host portion | subnetting:term-host, "Host portion", subnetting.ts:705 | row 25 |
| 3 | Network address, sense "subnetting" | subnetting:term-netaddr, "Network address", subnetting.ts:723 | row 28 |
| 3 | Broadcast address | subnetting:term-broadcast, "Broadcast address", subnetting.ts:729 | row 29 |
| 3 | Borrowing bits | subnetting:term-borrow, "Borrowing bits", subnetting.ts:741 | row 31 |
| 3 | Point-to-point link | subnetting:term-p2p, "Point-to-point /30", subnetting.ts:753 | row 33 |
| 4 dhcp | DHCP server | what-is-dhcp:term-server, "DHCP server", what-is-dhcp.ts:722 | row 35 |
| 4 | Discover | dhcp:term-discover, "Discover", dhcp.ts:446; what-is-dhcp:term-discover, "Discover", what-is-dhcp.ts:734 | row 2 |
| 4 | Offer | dhcp:term-offer, "Offer", dhcp.ts:447; what-is-dhcp:term-offer, "Offer", what-is-dhcp.ts:740 | row 3 |
| 4 | Request | dhcp:term-request, "Request", dhcp.ts:448; what-is-dhcp:term-request, "Request", what-is-dhcp.ts:746 | row 4 |
| 4 | Lease | dhcp:term-lease, "Lease", dhcp.ts:456; what-is-dhcp:term-lease, "Lease", what-is-dhcp.ts:758 | row 7 |
| 4 | Lease renewal | what-is-dhcp:term-renewal, "Lease renewal", what-is-dhcp.ts:770; dhcp:term-renew, "Renew", dhcp.ts:458 (G1 row 8: "spelling of Lease renewal") | row 37; row 8 |
| 4 | Broadcast | dhcp:term-broadcast, "Broadcast", dhcp.ts:441; what-is-dhcp:term-broadcast, "Broadcast", what-is-dhcp.ts:728 | row 1 |
| 4 | MAC address | what-is-ip:term-mac, "MAC address", what-is-ip.ts:511 | row 88 |
| 4 | ARP | what-is-ip:term-arp, "ARP", what-is-ip.ts:516 | row 89 |
| 4 | Default gateway | subnetting:term-gateway, "Default gateway", subnetting.ts:747; what-is-ip:term-gateway, "Default gateway", what-is-ip.ts:505 | row 32 |
| 5 transport | TCP connection | what-is-http:term-tcp, "TCP connection", what-is-http.ts:564 | row 56 |
| 5 | Three-way handshake | what-is-tcp:term-handshake, "Three-way handshake", what-is-tcp.ts:805 | row 115 |
| 5 | Sequence number | what-is-tcp:term-seq, "Sequence number", what-is-tcp.ts:817 | row 117 |
| 5 | ACK, sense "TCP" | what-is-tcp:term-ack, "ACK", what-is-tcp.ts:823 | row 118 |
| 5 | ACK, sense "DHCP" | dhcp:term-ack, "Acknowledge (ACK)", dhcp.ts:449; what-is-dhcp:term-ack, "Acknowledge", what-is-dhcp.ts:752 | row 5; row 36 |
| 5 | Retransmission | what-is-tcp:term-retransmission, "Retransmission", what-is-tcp.ts:841; what-is-udp:term-no-resend, "No retransmission", what-is-udp.ts:515 (G1: "tie its Learn row to Retransmission") | row 121; row 132 |
| 5 | Connectionless | what-is-udp:term-connectionless, "Connectionless", what-is-udp.ts:497 | row 130 |
| 5 | Jitter | what-is-udp:term-jitter, "Jitter", what-is-udp.ts:521 | row 133 |
| 6 firewalls | Firewall | firewalls:term-firewall, "Firewall", firewalls.ts:491 | row 10 |
| 6 | Firewall rule | firewalls:term-rule, "Rule", firewalls.ts:497 | row 11 |
| 6 | First match | firewalls:term-first-match, "First match", firewalls.ts:515 | row 14 |
| 6 | Default deny | firewalls:term-default-deny, "Default deny", firewalls.ts:521 | row 15 |
| 6 | Stateful | firewalls:term-stateful, "Stateful", firewalls.ts:527 | row 16 |
| 6 | Shadowed rule | firewalls:term-shadowed, "Shadowed rule", firewalls.ts:533 | row 17 |
| 6 | Port | firewalls:term-port, "Port", firewalls.ts:503; what-is-udp:term-port, "Port", what-is-udp.ts:509; what-is-ftp:term-port, "Port 21", what-is-ftp.ts:716; what-is-https:term-port, "Port 443", what-is-https.ts:678 | rows 12, 47, 64 |
| 6 | Source address | firewalls:term-source, "Source", firewalls.ts:509 | row 13 (spelling) |
| 6 | NAT | what-is-ip:term-nat, "NAT", what-is-ip.ts:525 | row 91 |
| 7 dns | DNS resolver | what-is-dns:term-resolver, "DNS resolver", what-is-dns.ts:610 | row 38 |
| 7 | Root server | what-is-dns:term-root, "Root server", what-is-dns.ts:616 | row 39 |
| 7 | Top-level domain | what-is-dns:term-tld, "Top-level domain", what-is-dns.ts:622 | row 40 |
| 7 | Referral | what-is-dns:term-referral, "Referral", what-is-dns.ts:628 | row 41 |
| 7 | Authoritative server | what-is-dns:term-auth, "Authoritative server", what-is-dns.ts:634 | row 42 |
| 7 | A record | what-is-dns:term-a, "A record", what-is-dns.ts:640 | row 43 |
| 7 | DNS cache | what-is-dns:term-cache, "DNS cache", what-is-dns.ts:652 | row 45 |
| 8 web | Client | what-is-http:term-client, "Client", what-is-http.ts:546; what-is-dhcp:term-client, "DHCP client", what-is-dhcp.ts:716 | row 54; row 34 |
| 8 | URL | what-is-http:term-url, "URL", what-is-http.ts:552 | row 55 |
| 8 | Path | what-is-http:term-path, "Path", what-is-http.ts:576 | row 58 |
| 8 | Method | what-is-http:term-method, "Method (GET)", what-is-http.ts:570 | row 57 |
| 8 | Status code | what-is-http:term-status, "Status code", what-is-http.ts:588 | row 60 |
| 8 | HTML | what-is-http:term-html, "HTML", what-is-http.ts:594; what-is-https:term-html, "HTML", what-is-https.ts:714 | row 61 |
| 8 | Rendering | what-is-http:term-rendering, "Rendering", what-is-http.ts:600 | row 62 |
| 8 | HTTPS | what-is-https:term-https, "HTTPS (HTTP Secure)", what-is-https.ts:672 | row 63 |
| 8 | Padlock | what-is-https:term-padlock, "Padlock", what-is-https.ts:720 | row 70 |
| 9 security | TLS handshake | what-is-https:term-handshake, "TLS handshake", what-is-https.ts:684 | row 65 |
| 9 | Certificate | what-is-https:term-cert, "Certificate", what-is-https.ts:690; what-is-tls:term-cert, "Certificate", what-is-tls.ts:582 | row 66 |
| 9 | Certificate authority (CA) | what-is-https:term-ca, "Certificate authority (CA)", what-is-https.ts:696; what-is-tls:term-ca, "Certificate authority (CA)", what-is-tls.ts:583 | row 67 |
| 9 | Cipher suite | what-is-tls:term-suite, "Cipher suite", what-is-tls.ts:579 | row 125 |
| 9 | Shared secret | what-is-tls:term-shared, "Shared secret", what-is-tls.ts:581; what-is-https:term-key, "Shared key", what-is-https.ts:702 (G1 row 68: "spelling of Shared secret (borderline)") | row 127; row 68 |
| 9 | Key exchange | what-is-ssh:term-kex, "Key exchange", what-is-ssh.ts:979 | row 109 |
| 9 | Key pair | what-is-ssh:term-keypair, "Key pair", what-is-ssh.ts:997 | row 112 |
| 9 | Encryption | what-is-https:term-encrypted, "Encrypted", what-is-https.ts:708 | row 69 |
| 9 | Plain text, sense 1 (not encrypted) | what-is-ftp:term-plain, "Plain text", what-is-ftp.ts:726 | row 52 |
| 10 remote | Shell | what-is-ssh:term-shell, "Shell", what-is-ssh.ts:1009 | row 114 |
| 10 | Host key | what-is-ssh:term-hostkey, "Host key", what-is-ssh.ts:985 | row 110 |
| 10 | SFTP | what-is-ftp:term-sftp, "SFTP", what-is-ftp.ts:728 | row 53 |
| 10 | Control connection | what-is-ftp:term-control, "Control connection", what-is-ftp.ts:715 | row 46 |
| 10 | Data connection | what-is-ftp:term-data, "Data connection", what-is-ftp.ts:724 | row 50 |
| 10 | Passive mode | what-is-ftp:term-pasv, "Passive mode (PASV)", what-is-ftp.ts:719 | row 49 |
| 11 mail | Outgoing mail server | what-is-smtp:term-outgoing, "Outgoing mail server", what-is-smtp.ts:1023 | row 99 |
| 11 | Reply code | what-is-smtp:term-reply, "Reply code", what-is-smtp.ts:1038 | row 104 |
| 11 | STARTTLS | what-is-smtp:term-starttls, "STARTTLS", what-is-smtp.ts:1050 | row 106 |
| 11 | IMAP | what-is-imap:term-imap, "IMAP", what-is-imap.ts:837 | row 79 |
| 11 | POP3 | what-is-pop3:term-pop3, "POP3", what-is-pop3.ts:686 | row 93 |
| 11 | MX record | what-is-smtp:term-mx, "MX record", what-is-smtp.ts:1044 | row 105 |

Totals: 102 lesson terms tied in the draft (110 entries); 17 lessons supply them. Per lesson (ties): subnetting 10, what-is-http 9, what-is-dhcp 9, what-is-https 9, firewalls 8, what-is-ip 8, what-is-dns 7, dhcp 7, what-is-ftp 6, osi-model 5, what-is-tcp 5, what-is-udp 5, what-is-tls 4, what-is-ssh 4, what-is-smtp 4, what-is-imap 1, what-is-pop3 1.

### A.1 Entries with NO Learn tie (28 entries, plus 2 senses)

Entries (28): OSI model; Physical Layer; Data Link Layer; Network Layer; Transport Layer; Session Layer; Presentation Layer; Application Layer; Protocol data unit; Frame; Packet; IP; Router; ICMP (p); Bit; DHCP (p); TCP; UDP; Destination address; Private address; Public address; DNS (p); Name server; HTTP (p); TLS; SSH (p); FTP (p); SMTP (p).

Senses with no tie (2): "Network address", sense in the OSI model (G1 row 61, "network addresses", a prose phrase, no Learn term); "Plain text", sense 2 (written as text, not binary; G1 row 52 says the Learn row is sense 1 only).

The seven protocols (p) have no Learn term: their only lesson mentions are lesson titles (e.g. `what-is-icmp` slug) and terms such as "DHCP client" (tied to Client, above), so the protocols tie to nothing.

Candidates that G1 does not list as ties (for the orchestrator's decision; not counted above):
- Router ← osi-model:term-relay, "Relay", osi-model.ts:570 (G1 row 23: "the Router entry carries the idea").
- Key exchange ← what-is-tls:term-keyshare, "Key share", what-is-tls.ts:580 (G1 row 126: "Key exchange carries the idea").
- Lease ← dhcp:term-lease-table, "Lease table", dhcp.ts:451 (G1 row 6: "Lease's definition can say the server keeps that record").

### A.2 Double ties (rule 14)

None. Each of the 102 draft lesson-term ids is claimed by one entry or sense, with these entries holding two or more lesson terms (not a double tie: one entry, several lesson terms): Encapsulation (2), Discover (2), Offer (2), Request (2), Lease (2), Lease renewal (2), Broadcast (2), Default gateway (2), ACK sense DHCP (2), Retransmission (2), Port (4), Client (2), HTML (2), Certificate (2), Certificate authority (CA) (2), Shared secret (2). The pilot's ids (what-is-icmp: term-echo-request, term-echo-reply, term-ping, term-latency, term-ttl, term-time-exceeded, term-traceroute, term-unreachable, term-loss; what-is-dns:term-ttl; what-is-ip:term-ttl; dhcp, what-is-dhcp, what-is-http, what-is-ip:term-ip) are claimed by no draft entry. Check run by script over the draft's tie map.

Note for rule 14 with `Port`: the four lesson terms are different lessons' terms, so no lesson term is double-tied.

### A.3 Learn terms that no draft or pilot entry ties to (35)

Each is a stays-in-lesson name in G1, or a candidate above: dhcp:term-lease-table (candidate for Lease); osi-model:term-relay (candidate for Router); what-is-ftp:term-login "USER, PASS" (ftp.ts:717); what-is-ftp:term-stor (STOR, RETR); what-is-imap: term-tag, term-folders, term-select, term-fetch, term-flag, term-store, term-idle; what-is-pop3: term-status "+OK, -ERR" (what-is-pop3.ts:687), term-login, term-stat, term-retr, term-dele, term-quit; what-is-smtp: term-ehlo, term-auth, term-envelope "MAIL FROM, RCPT TO", term-data; what-is-ssh: term-version, term-kexinit, term-knownhosts, term-channel; what-is-tcp: term-dupack, term-sack, term-fin; what-is-tls: term-clienthello, term-serverhello, term-keyshare (candidate), term-finished, term-close; what-is-udp: term-plc, term-report.

Trap: `what-is-pop3` has a Learn term with id `term-status` named "+OK, -ERR" (what-is-pop3.ts:687). An id-only match against Status code (`what-is-http:term-status`, what-is-http.ts:588) would be wrong; the tie must name the lesson too.

Trap 2: `what-is-ftp:term-login` "USER, PASS" and `what-is-pop3:term-login` share the id `term-login` in different lessons; ties are keyed by lesson and term, so no collision.


## B. Sources

### B.1 Sources cited by each tied Learn term

Each line: lesson:term-id [Learn name]: the source ids on that term's `cite` in the lesson's `units[].learn.terms` (a `*` marks `defining: true`). Read from the built lesson objects, so the list is the lesson's own, in its order, ids once each.

```
dhcp:term-ack [Acknowledge (ACK)]: rfc-2131*, microsoft-network-settings, google-nest-lan-ip
dhcp:term-broadcast [Broadcast]: rfc-1122*, rfc-2131*
dhcp:term-discover [Discover]: rfc-2131*
dhcp:term-lease [Lease]: rfc-2131*
dhcp:term-offer [Offer]: rfc-2131*, rfc-2132*, microsoft-network-settings, google-nest-lan-ip
dhcp:term-renew [Renew]: rfc-2131*
dhcp:term-request [Request]: rfc-2131*, rfc-2132*, microsoft-network-settings, google-nest-lan-ip
firewalls:term-default-deny [Default deny]: nist-sp800-41r1, paloalto-rulebase-best-practices, cisco-asa-access-rules
firewalls:term-firewall [Firewall]: nist-sp800-41r1, cisco-firewall
firewalls:term-first-match [First match]: nist-sp800-41r1, cisco-asa-access-rules, paloalto-rulebase-best-practices
firewalls:term-port [Port]: nist-sp800-41r1, rfc-9110*, iana-ports*
firewalls:term-rule [Rule]: nist-sp800-41r1, cisco-firewall, paloalto-firewall-rules
firewalls:term-shadowed [Shadowed rule]: paloalto-rulebase-best-practices, google-cloud-firewall-insights, cisco-fmc-access-rules
firewalls:term-source [Source]: nist-sp800-41r1, microsoft-windows-firewall, rfc-791*, rfc-4632*
firewalls:term-stateful [Stateful]: nist-sp800-41r1, cisco-asa-access-rules, microsoft-azure-nsg
osi-model:term-decap [Decapsulation]: cisco-ipip-decap, rfc-2003
osi-model:term-encap [Encapsulation]: nist-sp800-77r1, rfc-1122
osi-model:term-header [Header]: nist-sp800-77r1, rfc-1122
osi-model:term-layer [Layer]: itu-x200*
osi-model:term-peer [Peer layer]: itu-x200*
subnetting:term-borrow [Borrowing bits]: cisco-host-subnet-quantities, microsoft-tcpip-subnetting
subnetting:term-broadcast [Broadcast address]: microsoft-tcpip-subnetting, rfc-1812
subnetting:term-gateway [Default gateway]: rfc-1122*, microsoft-tcpip-subnetting
subnetting:term-host [Host portion]: microsoft-tcpip-subnetting, cisco-host-subnet-quantities
subnetting:term-mask [Subnet mask]: cisco-ip-subnets, rfc-950*
subnetting:term-netaddr [Network address]: microsoft-tcpip-subnetting, cisco-host-subnet-quantities
subnetting:term-network [Network portion]: microsoft-tcpip-subnetting, cisco-host-subnet-quantities
subnetting:term-p2p [Point-to-point /30]: rfc-3021, cisco-ip-subnets
subnetting:term-prefix [Prefix length]: rfc-1812, rfc-4632*
subnetting:term-subnet [Subnet]: microsoft-tcpip-subnetting, cisco-host-subnet-quantities
what-is-dhcp:term-ack [Acknowledge]: rfc-2131*
what-is-dhcp:term-broadcast [Broadcast]: rfc-1122*, rfc-2131
what-is-dhcp:term-client [DHCP client]: rfc-2131*
what-is-dhcp:term-discover [Discover]: rfc-2131*
what-is-dhcp:term-lease [Lease]: rfc-2131*
what-is-dhcp:term-offer [Offer]: rfc-2131*
what-is-dhcp:term-renewal [Lease renewal]: rfc-2131*
what-is-dhcp:term-request [Request]: rfc-2131*
what-is-dhcp:term-server [DHCP server]: rfc-2131*, microsoft-network-settings, google-nest-lan-ip
what-is-dns:term-a [A record]: rfc-1035*
what-is-dns:term-auth [Authoritative server]: rfc-9499, rfc-1034*
what-is-dns:term-cache [DNS cache]: rfc-1034*
what-is-dns:term-referral [Referral]: rfc-9499, rfc-1034*
what-is-dns:term-resolver [DNS resolver]: rfc-1034*, rfc-9499
what-is-dns:term-root [Root server]: iana-root-zone, rfc-7720
what-is-dns:term-tld [Top-level domain]: rfc-9499, iana-root-db-app, rfc-1034*
what-is-ftp:term-control [Control connection]: rfc-959*
what-is-ftp:term-data [Data connection]: rfc-959*
what-is-ftp:term-pasv [Passive mode (PASV)]: rfc-959*
what-is-ftp:term-plain [Plain text]: rfc-2577, rfc-2228, microsoft-app-service-ftp
what-is-ftp:term-port [Port 21]: rfc-959*, iana-ports*
what-is-ftp:term-sftp [SFTP]: microsoft-sftp-connector, cloudflare-spectrum-glossary, google-merchant-sftp
what-is-http:term-client [Client]: rfc-9110*
what-is-http:term-headers [Headers]: rfc-9110*
what-is-http:term-html [HTML]: whatwg-html*
what-is-http:term-method [Method (GET)]: rfc-9110*
what-is-http:term-path [Path]: rfc-3986*, rfc-9110
what-is-http:term-rendering [Rendering]: whatwg-html*, whatwg-html
what-is-http:term-status [Status code]: rfc-9110*
what-is-http:term-tcp [TCP connection]: rfc-9293*
what-is-http:term-url [URL]: rfc-3986*
what-is-https:term-ca [Certificate authority (CA)]: rfc-5280, rfc-9846
what-is-https:term-cert [Certificate]: rfc-5280*
what-is-https:term-encrypted [Encrypted]: rfc-9846*
what-is-https:term-handshake [TLS handshake]: rfc-9846*
what-is-https:term-html [HTML]: whatwg-html*
what-is-https:term-https [HTTPS (HTTP Secure)]: rfc-9112*, rfc-9110*, microsoft-edge-https-first
what-is-https:term-key [Shared key]: rfc-7748, rfc-9846
what-is-https:term-padlock [Padlock]: microsoft-edge-secure, cloudflare-mixed-content, microsoft-edge-https-first
what-is-https:term-port [Port 443]: rfc-9110*, iana-ports*
what-is-imap:term-imap [IMAP]: rfc-9051*
what-is-ip:term-arp [ARP]: rfc-826*
what-is-ip:term-encapsulation [Encapsulation]: rfc-1812*, rfc-791*
what-is-ip:term-forwarding [Forwarding]: rfc-791*, rfc-1812*
what-is-ip:term-gateway [Default gateway]: rfc-1122*, microsoft-route
what-is-ip:term-header [IP header]: rfc-791*
what-is-ip:term-mac [MAC address]: rfc-9724, rfc-826
what-is-ip:term-nat [NAT]: rfc-3022, rfc-4787, rfc-1918*
what-is-ip:term-routing [Routing decision]: rfc-1122*, rfc-791*
what-is-pop3:term-pop3 [POP3]: rfc-1939*
what-is-smtp:term-mx [MX record]: rfc-5321*, rfc-1035*
what-is-smtp:term-outgoing [Outgoing mail server]: rfc-8314*, rfc-6409*, microsoft-outlook-com-settings
what-is-smtp:term-reply [Reply code]: rfc-5321*
what-is-smtp:term-starttls [STARTTLS]: rfc-8314*, rfc-3207*
what-is-ssh:term-hostkey [Host key]: rfc-4251*, rfc-4253*
what-is-ssh:term-kex [Key exchange]: rfc-4253*, rfc-9941*, rfc-7748
what-is-ssh:term-keypair [Key pair]: rfc-4252*, microsoft-azure-ssh-detailed, microsoft-openssh-keys
what-is-ssh:term-shell [Shell]: rfc-4254*, microsoft-openssh-server-config
what-is-tcp:term-ack [ACK]: rfc-9293*
what-is-tcp:term-handshake [Three-way handshake]: rfc-9293*
what-is-tcp:term-retransmission [Retransmission]: rfc-9293*
what-is-tcp:term-segment [Segment]: rfc-9293*
what-is-tcp:term-seq [Sequence number]: rfc-9293*
what-is-tls:term-ca [Certificate authority (CA)]: rfc-5280, rfc-9846
what-is-tls:term-cert [Certificate]: rfc-5280*
what-is-tls:term-shared [Shared secret]: rfc-7748, rfc-9846
what-is-tls:term-suite [Cipher suite]: rfc-9846*
what-is-udp:term-connectionless [Connectionless]: rfc-8085, nist-sp800-77r1
what-is-udp:term-datagram [Datagram]: rfc-768*, rfc-791
what-is-udp:term-jitter [Jitter]: rfc-3550*, itu-g114
what-is-udp:term-no-resend [No retransmission]: rfc-8085, rfc-1122
what-is-udp:term-port [Port]: rfc-768*, rfc-1122
```

The 102 tied terms cite 76 distinct ids. All 76 are keys of `SOURCES` (`src/content/sources.ts`, 290 keys in all); none is missing. Each citation is built by `cite()` in `src/content/sources.ts` (around line 2712), which throws on an unknown id, so the lessons could not build otherwise.

### B.2 Standards for the entries with no tie

Each standard the brief names, checked against the registry (`src/content/sources.ts`, line of the `id:` line):

| Standard | Registry id | Registered | sources.ts line | No-tie entries it would define (candidate) |
|---|---|---|---|---|
| X.200 | itu-x200 | yes | 203 | OSI model, Physical Layer, Data Link Layer, Network Layer, Transport Layer, Session Layer, Presentation Layer, Application Layer, Protocol data unit, Network address (OSI sense) |
| RFC 791 | rfc-791 | yes | 335 | IP, Packet, Destination address |
| RFC 792 | rfc-792 | yes | 1256 | ICMP (p) |
| RFC 768 | rfc-768 | yes | 255 | UDP |
| RFC 793 / 9293 | rfc-9293 (793: not registered) | 9293 yes; 793 no | 308 | TCP |
| RFC 826 | rfc-826 | yes | 1132 | none (ARP is tied) |
| RFC 950 | rfc-950 | yes | 2454 | none (Subnet mask is tied) |
| RFC 1034 | rfc-1034 | yes | 546 | DNS (p), Name server |
| RFC 1035 | rfc-1035 | yes | 317 | DNS (p), as a second candidate |
| RFC 1918 | rfc-1918 | yes | 1148 | Private address (it defines private addresses; no registered source defines "public address") |
| RFC 2131 | rfc-2131 | yes | 326 | DHCP (p) |
| RFC 3022 | rfc-3022 | yes | 1157 | none (NAT is tied) |
| RFC 4632 | rfc-4632 | yes | 1175 | none (Prefix length is tied) |
| RFC 959 | rfc-959 | yes | 912 | FTP (p) |
| RFC 5321 | rfc-5321 | yes | 903 | SMTP (p) |
| RFC 9051 | rfc-9051 | yes | 1710 | none (IMAP is tied) |
| RFC 1939 | rfc-1939 | yes | 1701 | none (POP3 is tied) |
| RFC 4251 to 4254 | rfc-4251, rfc-4252, rfc-4253, rfc-4254 | yes, all four | 2066, 2075, 2084, 2093 | SSH (p) |
| RFC 8446 | rfc-8446 | NO | none | none; TLS 1.3 is registered as rfc-9846 (sources.ts:634, "The Transport Layer Security (TLS) Protocol Version 1.3"), the TLS (no tie) candidate |
| RFC 9110 | rfc-9110 | yes | 510 | HTTP (p) |
| RFC 3986 | rfc-3986 | yes | 564 | none (URL and Path are tied) |
| RFC 2228 | rfc-2228 | yes | 1891 | none; a FTP-security RFC (Plain text, sense 1, cites it) |
| RFC 4217 | rfc-4217 | yes | 1909 | none in the draft |

Also registered and relevant: rfc-1812 (sources.ts:1166, "Requirements for IP Version 4 Routers", a Router candidate), rfc-1122 (sources.ts:213), rfc-2132 (sources.ts:1011).

No-tie entries with no registered defining standard: Frame, Bit, Public address (rfc-1918 defines private addresses only), and Plain text sense 2 ("written as text, not binary"). For Frame and Bit the registry holds no source that names them; the lesson citations for Header and Encapsulation (nist-sp800-77r1, rfc-1122) are the closest registered ones.

### B.3 Browser-vendor hosts in SOURCE_HOSTS

- `SOURCE_HOSTS.vendor` (`src/content/sources.ts:61-62`) includes `support.microsoft.com` (line 62) and `support.google.com` (line 62). Microsoft Edge's help pages are on support.microsoft.com (`microsoft-edge-secure`, `microsoft-edge-https-first` in the registry); Chrome's help pages are on support.google.com (`google-chrome-secure`, `google-chrome-always-secure`, sources.ts registry entries). These are the two browser-vendor hosts present.
- Mozilla: no host. No `mozilla`, `firefox` or `support.mozilla.org` string in `src/content/sources.ts`.
- Apple: no host. No `apple` or `safari` string in `src/content/sources.ts`.
- `knowledge.workspace.google.com` (sources.ts:68) is Google Workspace help, not a browser.


## C. Shared sources, pair by pair

Built from B.1 (the ids the group's tied Learn terms cite) and B.2 (the candidate defining standard of each no-tie entry). A group's definitions will cite what its analyst finds, so this is the registry ids the group is likely to draw on, not a list of what it will cite. Pairs with no shared id are left out (of 55 pairs, 21 share at least one id).

| Pair | Shared registry ids |
|---|---|
| G1 osi-model x G2 packets | itu-x200, nist-sp800-77r1, rfc-1122, rfc-1812, rfc-791 |
| G1 osi-model x G3 subnetting | itu-x200, rfc-1812 |
| G1 osi-model x G4 dhcp | rfc-1122 |
| G1 osi-model x G5 transport | nist-sp800-77r1, rfc-1122 |
| G1 osi-model x G6 firewalls | rfc-1122, rfc-791 |
| G2 packets x G3 subnetting | itu-x200, rfc-1812 |
| G2 packets x G4 dhcp | rfc-1122 |
| G2 packets x G5 transport | nist-sp800-77r1, rfc-1122, rfc-768, rfc-9293 |
| G2 packets x G6 firewalls | rfc-1122, rfc-768, rfc-791, rfc-9110 |
| G2 packets x G8 web | rfc-9110 |
| G3 subnetting x G4 dhcp | microsoft-tcpip-subnetting |
| G3 subnetting x G6 firewalls | rfc-4632 |
| G4 dhcp x G5 transport | google-nest-lan-ip, microsoft-network-settings, rfc-1122, rfc-2131 |
| G4 dhcp x G6 firewalls | rfc-1122 |
| G4 dhcp x G8 web | rfc-2131 |
| G5 transport x G6 firewalls | rfc-1122, rfc-768 |
| G5 transport x G8 web | rfc-2131 |
| G6 firewalls x G8 web | rfc-9110 |
| G6 firewalls x G10 remote | rfc-959 |
| G7 dns x G11 mail | rfc-1035 |
| G9 security x G10 remote | rfc-4252, rfc-4253 |

Per group, the set used (tied ids, then candidate standards), from the same script: G1 osi-model: cisco-ipip-decap, itu-x200, nist-sp800-77r1, rfc-1122, rfc-1812, rfc-2003, rfc-791. G2 packets: nist-sp800-77r1, rfc-1122, rfc-1812, rfc-768, rfc-791, rfc-9110, rfc-9293 (+ itu-x200, rfc-792). G3 subnetting: cisco-host-subnet-quantities, cisco-ip-subnets, microsoft-tcpip-subnetting, rfc-1812, rfc-3021, rfc-4632, rfc-950 (+ itu-x200). G4 dhcp: google-nest-lan-ip, microsoft-network-settings, microsoft-route, microsoft-tcpip-subnetting, rfc-1122, rfc-2131, rfc-2132, rfc-826, rfc-9724 (+ rfc-2131). G5 transport: google-nest-lan-ip, itu-g114, microsoft-network-settings, nist-sp800-77r1, rfc-1122, rfc-2131, rfc-3550, rfc-8085, rfc-9293 (+ rfc-768). G6 firewalls: 19 ids, incl. rfc-1122, rfc-1918, rfc-3022, rfc-4632, rfc-4787, rfc-768, rfc-791, rfc-9110, rfc-959, iana-ports, nist-sp800-41r1 and five vendor firewall ids (+ rfc-1918). G7 dns: iana-root-db-app, iana-root-zone, rfc-1034, rfc-1035, rfc-7720, rfc-9499. G8 web: cloudflare-mixed-content, microsoft-edge-https-first, microsoft-edge-secure, rfc-2131, rfc-3986, rfc-9110, rfc-9112, whatwg-html. G9 security: microsoft-app-service-ftp, microsoft-azure-ssh-detailed, microsoft-openssh-keys, rfc-2228, rfc-2577, rfc-4252, rfc-4253, rfc-5280, rfc-7748, rfc-9846, rfc-9941. G10 remote: cloudflare-spectrum-glossary, google-merchant-sftp, microsoft-openssh-server-config, microsoft-sftp-connector, rfc-4251, rfc-4253, rfc-4254, rfc-959 (+ rfc-4252). G11 mail: microsoft-outlook-com-settings, rfc-1035, rfc-1939, rfc-3207, rfc-5321, rfc-6409, rfc-8314, rfc-9051.

Note: rfc-2131 reaches G4, G5 and G8 through ties to DHCP lesson terms: G4 (its own DHCP entries), G5 (the ACK sense tied to dhcp:term-ack and what-is-dhcp:term-ack, both citing rfc-2131) and G8 (Client tied to what-is-dhcp:term-client, "DHCP client", citing rfc-2131).

## D. Collisions and files a new group touches

Files a new group touches, besides its own `src/content/glossary-groups/<id>.ts` and its report `docs/fact-checks/glossary/<id>.md`:

1. Group ids equal lesson slugs for four drafts: `osi-model` (group 1), `subnetting` (3), `dhcp` (4), `firewalls` (6); the lesson files are `src/content/lessons/{osi-model,subnetting,dhcp,firewalls}.ts`. The fact-check paths differ (`docs/fact-checks/glossary/dhcp.md` against `docs/fact-checks/dhcp.md`); plan.md:242 lists the test for this case (A5.4), so it is a collision only if that test is absent.
2. `src/content/sources.ts`: a new registry id is added to `SOURCES` (`src/content/sources.ts`, the `defineSources([` list starting near line 201). A new host goes to `SOURCE_HOSTS` (sources.ts:31-70).
3. `src/content/sources.test.ts:236-294`: `expect(Object.keys(SOURCES)).toEqual([...])` lists all 290 ids in order. Every group that adds a source must add its id to this array in the same position; two parallel worktrees adding ids will both edit this list (a merge conflict on the same lines).
4. `src/content/glossary.ts:13` (`checkGlossaryGroups`, rules 11 and 12) and `:69` (the `import.meta.glob` for `./glossary-groups/*.ts`) are shared; no group edits them, but a group that breaks rule 11 or 12 fails there.
5. `src/content/registry.ts:265-291` (`checkGlossaryTies`, rules 13 and 14) and `:327` (the call), `:349` (`glossaryCheckedOn`): shared; no group edits them.
6. `src/content/glossary-groups/loading.test.ts:1-10`: names only `loading` and `decoy` (not counts). No edit needed.
7. Pilot-count assertions that a new group changes (all tests that count definitions or rows):
   - `src/lib/glossary.test.ts:223`: `expect(pilot).toHaveLength(11)` (11 definitions of the pilot; the 110 new entries change this).
   - `src/lib/glossary-page.test.ts:54`: `expect(ids.length).toBeGreaterThan(10)` (threshold, still true).
   - `src/lib/glossary-page.test.ts:156`: `expect(expectedRows).toHaveLength(11)` (pilot rows).
   - `e2e/glossary.spec.ts:228`: `expect(rows).toHaveLength(11)` (pilot rows, the rows with 'ip-address', 'ping', ...).
   - `e2e/glossary.spec.ts:201`: comment "The pilot: 43 row links" (the bound `> 40` at :203 holds).
   - `e2e/glossary.spec.ts:16-26`: `NINE`, a typed list of the nine pilot rows (their statement text and names).
   - `src/lib/glossary.test.ts:305-307` and `:353`: counts from `GLOSSARY.length`, dynamic (no edit).
8. Pilot-id references (a group named 'pilot' or an entry with those ids would collide; none of the draft ids equals a pilot id, and the pilot ids are not in the draft list): `e2e/glossary.spec.ts:9-10, 61-62, 67-74, 92-102, 164-190, 233-270, 379-555` (ids `ping`, `ttl`, `time-to-live`, `ip-address`, `packet-loss`, `echo-request`); `src/lib/glossary-page.test.ts:128, 168-169`; `src/content/glossary-group.test.ts:25` and `src/content/glossary-fixtures.ts:19` (the id `pilot` in a fixture); `src/content/factcheck/cli.glossary.test.ts:21-22, 29, 43-80` and `gate.glossary.test.ts:60` (`pilot.md`, `pilot.recheck.md`).
9. Lesson slugs and track lists that happen to contain the same strings as entry ids, unrelated to the glossary: `src/content/registry.test.ts:43` (a list of networking track lesson slugs containing 'ip-address', 'arp', 'dhcp', 'dns', 'firewalls', 'subnetting', 'osi-model'); `src/content/tracks/networking.ts:39` (`slug: 'ip-address'`). Neither is a glossary list; no edit needed.
10. The canary: `src/content/factcheck/canary/glossary.ts:19-70` uses entry ids `dhcp`, `discover`, `offer`, `lease`, `request` (the same ids as draft entries), and `src/content/factcheck/canary.glossary.test.ts:47` asserts identity (`CANARY_GROUP.entries.includes(e)`) for those ids in `GLOSSARY`. The canary is not in `GLOSSARY` (its file comment says so), so no clash with a real group; the test would only fail if a real group's entry object were the canary's.
11. The stamp: "N terms checked": `src/lib/glossary.ts:125-126` (`stampLine`), `:236` (`count: entries.length`, so the count is the number of entries, not definitions). Tests: `src/lib/glossary.test.ts:248-249` (literal 10 and 1, not pilot-bound), `:346-348` (`glossaryCheckedOn('pilot')`), `src/lib/glossary-page.test.ts:46` (regex `^\d+ terms? checked`), `e2e/glossary.spec.ts:44` (count from the DOM: `.gl-entry:not(.gl-entry--see)`). Component: `src/components/GlossaryStamp.astro`.
12. Glossary page and its tests: `src/pages/glossary.astro`, `src/lib/glossary.ts` (letters, keys), `src/lib/glossary-site.ts` (reads `GLOSSARY_GROUPS`, and `glossaryCheckedOn` per group id), `src/components/GlossaryEntry.astro`, `GlossaryKeys.astro`. Tests: `src/lib/glossary.test.ts`, `src/lib/glossary-page.test.ts`, `e2e/glossary.spec.ts`, `e2e/site.spec.ts` (the header/footer links, no counts), `e2e/support.ts:50` (page list).
13. Lessons: no lesson file changes for a tie (`docs/glossary-path-spec.md` §2). The lesson files that gain ties (see E) are `src/content/lessons/*.ts` only by read; a group does not write them.
14. Shared docs a merge might touch: `docs/glossary-terms.md` (G1), `plan.md`, `team.md`, `docs/direction.md`. Not per group; the orchestrator's merges.

Rule 12 (names unique across the glossary, ignoring case and outer spaces), checked on the names G1 implies (each entry's show-as term and every "spelling of" row, plus the pilot's names, 120 entries): no cross-entry clash. G1's rows that would break rule 9 (a spelling equal to its own entry's term, ignoring case): `method` (G1 row 59, spelling of Method, `docs/glossary-terms.md:219`) and `latency` (G1 row 44, spelling of Latency, pilot's term, `docs/glossary-terms.md:204`). G1 rows `frame` (Part 2 row 33), `packet` (row 66) and `router` (row 84) are lower-case forms of entries Frame, Packet and Router, not spellings: one entry each, or rule 12 would refuse them as separate entries.

Rule 14 (a lesson term tied to at most one entry or sense): no double tie in the draft (A.2). Also no draft tie uses a pilot id (A.2).

## E. Page budget

Where it is set: `scripts/check-budgets.mjs:17`, `export const BUDGETS = Object.freeze({ html: 250_000, lessonJs: 200_000 })`. The header (lines 1-7) states the two rules: every page's HTML at most 250 KB gzipped; on every lesson page the JavaScript at most 200 KB gzipped. Sizes are gzip at default level, 1 KB = 1,000 bytes. `npm run build` runs it after the astro build (`package.json:11`: `"build": "astro check && astro build && node scripts/check-budgets.mjs"`); `npm run budgets` runs it alone (`package.json:17`).

`dist/` exists (built 2026-11-13 17:37 by `ls -la dist`). I did not build. I ran the budget script read-only on it (`node scripts/check-budgets.mjs dist`, which only reads files) and measured the glossary page's bytes with a short script. Whether this `dist` matches the current HEAD (92506f4) is not checked.

Current sizes (budget script output, gzipped):
- `/glossary/` (`dist/glossary/index.html`): HTML 6.0 KB gzipped (raw 30,573 bytes; 6,045 gzipped by the script's gzip level 6); page JS 1.3 KB. Budget 250 KB. The page holds the pilot's 10 entries (11 definitions).
- Lesson pages (`dist/how-the-internet-works/what-is-*/index.html`, plus the Networking track's lessons under `dist/networking/`): HTML from 97.9 KB (what-is-pop3) to 103.0 KB (what-is-ssh); what-is-icmp 100.5 KB (raw 968,038 bytes). Lesson JS 101.7 KB gzipped on every lesson page (budget 200 KB). The Networking lessons: /networking/dhcp/ 41.8 KB, /networking/firewalls/ 41.0 KB, /networking/osi-model/ 56.8 KB, /networking/subnetting/ 63.6 KB HTML gzipped.

Pilot bytes, measured on the built glossary page (`dist/glossary/index.html`; each entry is the `<div class="gl-entry" id="...">` block, balanced by its div count; "gz delta" = page gzip minus page gzip with that block removed):

| Entry | raw bytes | gz delta |
|---|---|---|
| destination-unreachable | 1,254 | 145 |
| echo-reply | 2,089 | 102 |
| echo-request | 1,622 | 93 |
| ip-address | 1,777 | 309 |
| latency | 1,988 | 224 |
| packet-loss | 2,330 | 203 |
| ping | 1,933 | 118 |
| time-exceeded | 1,559 | 162 |
| traceroute | 1,840 | 187 |
| ttl (two senses) | 2,491 | 402 |
| **average per entry** | **1,888** | **195** |

Pilot bytes on a lesson page: the lesson's definitions are passed to the lesson's island as `definitions` (`src/pages/[track]/[lesson].astro:57`, `definitionsFor(...)`; read by `src/lesson/Explanation.tsx:41` and `src/lesson/LessonConsole.tsx:75`). They appear in the built HTML as serialized props. Measured on `dist/how-the-internet-works/what-is-icmp/index.html` (the nine pilot ties of that lesson; each is the `&quot;term-x&quot;:[0,{...}]` object):

| Lesson term | raw bytes | gz delta |
|---|---|---|
| term-echo-request | 379 | 66 |
| term-echo-reply | 449 | 71 |
| term-ping | 452 | 82 |
| term-latency | 371 | 79 |
| term-ttl (two senses) | 526 | 160 |
| term-time-exceeded | 428 | 99 |
| term-traceroute | 482 | 99 |
| term-unreachable | 415 | 86 |
| term-loss | 426 | 80 |
| **average per tied term** | **436** | **91** |

Projection at 120 entries (10 pilot + 110 draft), linear in the pilot's averages (a projection, not a build; the draft entries' statements and source counts differ from the pilot's, so the real figure may differ):
- `/glossary/`: raw about 30,573 + 110 × 1,888 = about 238,000 bytes; gzipped about 6,045 + 110 × 195 = about 27,400 bytes (27 KB), against the 250 KB budget.
- A lesson page gains about 91 bytes gzipped (436 raw) per tie. Draft ties per lesson (A): subnetting 10 (about +0.9 KB gzipped), what-is-http 9, what-is-dhcp 9, what-is-https 9 (about +0.8 KB each), firewalls 8, what-is-ip 8 (plus the pilot's two), what-is-dns 7, dhcp 7, what-is-ftp 6, osi-model 5, what-is-tcp 5, what-is-udp 5, what-is-tls 4, what-is-ssh 4, what-is-smtp 4, what-is-imap 1, what-is-pop3 1. The heaviest lesson page (what-is-ssh, 103.0 KB) would stay near 104 KB; the budget is 250 KB.
- Lesson JS is not changed by definitions in the measurement (the definitions travel as island props in the HTML); the JS figure is not re-measured for a new group.

Caveat: `dist/` may not match HEAD; the projection uses only the 10 pilot entries.

## F. Agents, briefs and the group's check

Last change (`git log -1 --format='%h %ci' -- <path>`):
- `.claude/agents/`: efeb8b5, 2026-11-13 13:17:25 -0500 (commit "fix: build review fixes 1 to 5 for B9, and erratum E15"). Per file: analyst.md and fact-checker.md 522407b (2026-11-13 13:07:15); author.md efeb8b5; builder.md and reviewer.md 5664519 (2026-11-11 16:58:00); designer.md and scout.md eea7fe9 (2026-11-10 17:59:22).
- `docs/briefs/`: efeb8b5, 2026-11-13 13:17:25 -0500 (the same commit). Files there: analyst-glossary-group.md, analyst-read-before-check.md, analyst-report.md, author-glossary-group.md, author-lesson.md, author-track-section.md.

Commands a group's check uses:
- `package.json:18` `"fact-check": "node scripts/fact-check.mjs"`: `npm run fact-check -- glossary/<id>` (prints the claim sheet; the other forms are `--check`, `--quotes <folder>`, `--stamp`, `--recheck`, per `docs/glossary-path-spec.md` §4). Report path `docs/fact-checks/glossary/<id>.md`.
- `docs/briefs/author-glossary-group.md:15-17`: done when `npm run fact-check -- glossary/<id>` prints the sheet, `npx astro check` is clean, and `npx vitest run --mode development` passes except the canary group's report test; the brief also says development mode warns on a missing report (`docs/briefs/author-glossary-group.md:17`).
- `package.json:13` `"test": "vitest run"` (`npm test`); `package.json:11` `"build"` runs `astro check`, `astro build` and `check-budgets.mjs`; `package.json:14` `"e2e": "playwright test --grep-invert @visual"`.
- `CLAUDE.md` (Done means verified): `npm test` and `npm run build` before work is called done; the end-to-end specs for a reader-visible unit.

## Not found

- Mozilla, Firefox, Apple, Safari hosts or source ids: none in `src/content/sources.ts`.
- RFC 8446 and RFC 793 as registry ids: not registered (TLS 1.3 is rfc-9846; TCP is rfc-9293).
- A Learn term (in `units[].learn.terms`) named "DHCP" (`dhcp.ts:178` is a unit's name, not a term), "DNS", "HTTP", "FTP", "SMTP", "SSH", "ICMP", "TCP", "UDP", "IP", "TLS", "Frame", "Packet", "Router", "Bit", "Destination address", "Private address", "Public address", "Name server", "Physical Layer" and the other layer names: none in any lesson's Learn `terms`.
- A Learn term for "Plain text, sense 2" or "Network address, sense OSI": none (only prose).
- A draft group file: `src/content/glossary-groups/` holds only `pilot.ts`, `loading.test.ts` and `old/` (`git ls-files`). `docs/fact-checks/glossary/` exists and holds one file, `pilot.md` (46,764 bytes, the pilot's report; `ls -la`).
- Standards text not read: no RFC or ITU text was fetched (no network use); the "defining" roles in B.2 are the registry's titles and the lessons' own citations, not a checked reading.
