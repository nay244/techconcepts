# G1: the glossary's list of terms (proposed)

> **Approved by the owner on 2026-11-13: all 113 entries, the borderline ones included** ("All 113"; direction 2.41). The protocol names in the note below are still open.

> **For the owner (the orchestrator, 2026-11-13).** Proposed: 113 entries (21 borderline), 5 words with two senses, 25 other spellings, 102 words left in their lessons. After the pilot's ten, 103 entries in about 9 groups: roughly 2.3 to 2.9 million subagent tokens at job 7's rate (82 entries, 1.8 to 2.3 million, without the borderline ones); the pilot will replace this rate with a measured one. One open point: the protocols the lessons are named for (DHCP, DNS, HTTP, FTP, SMTP, SSH, ICMP) are in neither list, while TCP, UDP, IP and TLS get entries. The orchestrator would give each protocol a lesson teaches an entry of its own (a reader meets "DHCP" outside its lesson), about 7 more entries. Nothing beyond the pilot is written until the owner approves the list.

Job 9, unit G1 (decision 5). Proposed by the analyst; the owner approves it. No repo file was changed.

**Classes.** **entry**: an entry of its own. **spelling of X**: another name, abbreviation or full name of entry X. **sense of X**: one of two or more senses under entry X. **stays in lesson**: a message or command name, a phrase or a story word that a beginner's glossary does not need. Where a stays-in-lesson Learn name is a case of an entry (Port 21 under Port), the reason says "tie": decision 3's tie from the entry's side can show that entry's definition beside it without making it a spelling. "(borderline)" marks a row I am unsure of; "(pilot)" marks the ten pilot entries.

**Rule used.** An entry is a concept or a tool a beginner meets in more than one lesson, or needs to name (exam vocabulary, a setting, a warning on screen). A message or command name is an entry only where it is met beyond one step of one lesson (the pilot set the precedent with ICMP's message names).

## Part 1: the 135 Learn names

Source: `.superpowers/revamp/job-9/terms.tsv`, distinct by name ignoring case, in the sheet's order.

| # | word as written | lesson(s) | class | reason |
|---|---|---|---|---|
| 1 | Broadcast | dhcp, what-is-dhcp | entry | A message to every device on the network; met in both DHCP lessons and in IP (ARP asks by broadcast). Keep apart from Broadcast address. |
| 2 | Discover | dhcp, what-is-dhcp | entry (borderline) | DHCP's first message, in two lessons; a message name like the pilot's Echo request, and the D of the four-step exchange a beginner is asked to name. Show as "DHCP Discover". |
| 3 | Offer | dhcp, what-is-dhcp | entry (borderline) | DHCP's second message, in two lessons; same reasoning as Discover. Show as "DHCP Offer". |
| 4 | Request | dhcp, what-is-dhcp | entry (borderline) | DHCP's third message, in two lessons. Show as "DHCP Request": the bare word reads as an HTTP request. |
| 5 | Acknowledge (ACK) | dhcp | sense of ACK (in DHCP) | DHCP's fourth message (DHCPACK), a different thing from TCP's ACK; A1 named the pair. |
| 6 | Lease table | dhcp | stays in lesson (borderline) | The server's record of who holds which address; one lesson, and Lease's definition can say the server keeps that record. |
| 7 | Lease | dhcp, what-is-dhcp | entry | Lending an address for a set time; both DHCP lessons. |
| 8 | Renew | dhcp | spelling of Lease renewal | The dhcp lesson's name for what what-is-dhcp calls Lease renewal. |
| 9 | IP address | dhcp, what-is-dhcp, what-is-http, what-is-ip | entry (pilot) | Four lessons; one of the owner's two examples. |
| 10 | Firewall | firewalls | entry | A tool a reader needs to name; the firewalls lesson and the SSH/Telnet contrast. |
| 11 | Rule | firewalls | entry | A firewall rule; the unit of a firewall's list. Show as "Firewall rule". |
| 12 | Port | firewalls, what-is-udp | entry | Six lessons (firewalls, UDP, FTP, HTTPS, SSH, the mail lessons); one idea, as A1 found. |
| 13 | Source | firewalls | spelling of Source address | "The address a visit comes from"; the IP lesson marks the same field as source address. |
| 14 | First match | firewalls | entry | How a firewall reads its list; a named rule of evaluation, met with Shadowed rule and Default deny. |
| 15 | Default deny | firewalls | entry | A named policy a beginner needs (also "deny by default"). |
| 16 | Stateful | firewalls | entry | A kind of firewall a beginner needs to name; the lesson's third idea. |
| 17 | Shadowed rule | firewalls | entry (borderline) | A named firewall mistake; one lesson, but the lesson's point that the catch-all goes last rests on it. |
| 18 | Layer | osi-model | entry | The OSI model's unit; every lesson carries an OSI layer badge. |
| 19 | Header | osi-model | entry (two senses) | Sense 1, in the layer model: control information a layer puts in front of what it carries (OSI, IP). Sense 2, in HTTP: header fields, notes on a request or reply. |
| 20 | Encapsulation | osi-model, what-is-ip | entry | OSI and IP lessons; 105 is a case of 20 (A1). |
| 21 | Decapsulation | osi-model | entry (borderline) | The reverse of Encapsulation; one lesson; could be one statement inside Encapsulation instead. |
| 22 | Peer layer | osi-model | entry | The same layer on another machine; OSI lesson, named three ways there (peer layers, twin, the same layer). |
| 23 | Relay | osi-model | stays in lesson (borderline) | X.200's word for a machine in the middle; the Router entry carries the idea, and "relay" means something else in mail. |
| 24 | Network portion | subnetting | entry | Subnetting's first idea; needed to read any mask. |
| 25 | Host portion | subnetting | entry | The other half of an address; pairs with Network portion. |
| 26 | Subnet mask | subnetting | entry | A tool a beginner must name; subnetting and IP. |
| 27 | Prefix length | subnetting | entry | The /24 notation; met wherever an address is written with a slash. |
| 28 | Network address | subnetting | entry (two senses) | Sense 1, in subnetting: the subnet's own address, every host bit 0. Sense 2, in the OSI model (bold there): the address a layer 3 route leads to, such as an IP address. Shown as one, a beginner would merge them. |
| 29 | Broadcast address | subnetting | entry | Every host bit 1; distinct from Broadcast. |
| 30 | Subnet | subnetting | entry | Subnetting, IP, DHCP; a basic word. |
| 31 | Borrowing bits | subnetting | entry (borderline) | How subnets are made; one lesson, but the lesson's central move. |
| 32 | Default gateway | subnetting, what-is-ip | entry | Subnetting and IP; A1 found the two agree. |
| 33 | Point-to-point /30 | subnetting | entry (borderline) | Show as "Point-to-point link"; one lesson; the /30 is a fact for the definition, not part of the name. |
| 34 | DHCP client | what-is-dhcp | stays in lesson (borderline) | A case of Client; tie its Learn row to Client's definition. |
| 35 | DHCP server | what-is-dhcp | entry (borderline) | Both DHCP lessons; no plain "Server" is a candidate, so this entry carries the server side. |
| 36 | Acknowledge | what-is-dhcp | sense of ACK (in DHCP) | The same DHCP message as Acknowledge (ACK), quoted in what-is-dhcp. |
| 37 | Lease renewal | what-is-dhcp | entry | Asking to keep the address before the lease ends; both DHCP lessons (dhcp calls it Renew). |
| 38 | DNS resolver | what-is-dns | entry | DNS, HTTP and HTTPS lessons. |
| 39 | Root server | what-is-dns | entry | A named part of DNS a beginner meets. |
| 40 | Top-level domain | what-is-dns | entry | .com, .app; met in DNS and in every web address. |
| 41 | Referral | what-is-dns | entry (borderline) | How DNS servers point onward; one lesson, the step that explains how lookups walk down. |
| 42 | Authoritative server | what-is-dns | entry | The server that knows a name for sure; DNS and (by MX) mail. |
| 43 | A record | what-is-dns | entry | The record behind every name lookup; DNS, and contrasted with MX in SMTP. |
| 44 | TTL | what-is-dns, what-is-icmp, what-is-ip | entry (pilot, two senses) | Sense 1, in IP: the hop counter (IP, ICMP). Sense 2, in DNS: how long an answer may be cached. |
| 45 | DNS cache | what-is-dns | entry | A named thing a beginner meets (and clears). |
| 46 | Control connection | what-is-ftp | entry | FTP's command line; FTP's two-connection design is the lesson's point. |
| 47 | Port 21 | what-is-ftp | stays in lesson | A case of Port; the number is FTP's fact. Tie its Learn row to Port. |
| 48 | USER, PASS | what-is-ftp, what-is-pop3 | stays in lesson | Command names (FTP and POP3); decision 5's own example. |
| 49 | Passive mode (PASV) | what-is-ftp | entry | A named FTP mode beginners meet in firewall and client settings. |
| 50 | Data connection | what-is-ftp | entry | FTP's file line; pairs with Control connection. |
| 51 | STOR, RETR | what-is-ftp | stays in lesson | FTP command names. |
| 52 | Plain text | what-is-ftp | entry (two senses) | Met in seven lessons. Sense 1: not encrypted (FTP, mail, SSH, firewalls). Sense 2: written as readable text, not binary (HTTP/1.1, unmarked there). The Learn row is sense 1. |
| 53 | SFTP | what-is-ftp | entry | A tool a reader needs to name; FTP and SSH. |
| 54 | Client | what-is-http | entry | HTTP's client; the same idea as DHCP client. |
| 55 | URL | what-is-http | entry | A basic word; HTTP and HTTPS. |
| 56 | TCP connection | what-is-http | entry | HTTP, TCP, and every protocol over TCP. |
| 57 | Method (GET) | what-is-http | entry | Show as "Method" (HTTP request method), GET as its example. |
| 58 | Path | what-is-http | entry (borderline) | Part of a URL; one lesson, but needed to read any URL. |
| 59 | Headers | what-is-http | sense of Header (in HTTP) | HTTP header fields, notes on a request or reply; not the layer model's header. |
| 60 | Status code | what-is-http | entry | HTTP and HTTPS (200 OK). |
| 61 | HTML | what-is-http, what-is-https | entry | HTTP and HTTPS; identical lines (A1). |
| 62 | Rendering | what-is-http | entry | A browser concept a reader needs to name. |
| 63 | HTTPS (HTTP Secure) | what-is-https | entry | A tool a reader needs to name; HTTPS, TLS, HTTP. |
| 64 | Port 443 | what-is-https | stays in lesson | A case of Port; tie its Learn row to Port. |
| 65 | TLS handshake | what-is-https | entry | HTTPS and TLS; also behind STARTTLS in mail. |
| 66 | Certificate | what-is-https, what-is-tls | entry | HTTPS and TLS; A1 found them in agreement. |
| 67 | Certificate authority (CA) | what-is-https, what-is-tls | entry | HTTPS and TLS. |
| 68 | Shared key | what-is-https | spelling of Shared secret (borderline) | HTTPS's name for what TLS and SSH call the shared secret; the TLS lesson says keys are made from that secret, so the entry must say whether they are one thing. |
| 69 | Encrypted | what-is-https | entry | Seven lessons; show as "Encryption" or "Encrypted". |
| 70 | Padlock | what-is-https | entry (borderline) | A sign every reader sees in the browser; one lesson; rests on browser vendors' pages. |
| 71 | Echo request | what-is-icmp | entry (pilot) | ICMP, and ping's message. |
| 72 | Echo reply | what-is-icmp | entry (pilot) | ICMP. |
| 73 | Ping | what-is-icmp | entry (pilot) | A tool; one of the owner's two examples. |
| 74 | Latency (round-trip time) | what-is-icmp | entry (pilot) | Show as "Latency"; "round-trip time" is another spelling only if the pilot's sources allow. |
| 75 | Time exceeded | what-is-icmp | entry (pilot) | ICMP; traceroute rests on it. |
| 76 | Traceroute | what-is-icmp | entry (pilot) | A tool. |
| 77 | Destination unreachable | what-is-icmp | entry (pilot) | ICMP. |
| 78 | Packet loss | what-is-icmp | entry (pilot) | ICMP and UDP. |
| 79 | IMAP | what-is-imap | entry | A protocol a reader configures; IMAP, POP3, SMTP. |
| 80 | Tag | what-is-imap | stays in lesson (borderline) | IMAP's command label; one lesson, a protocol detail. |
| 81 | Folders (mailboxes) | what-is-imap | stays in lesson (borderline) | An everyday word; IMAP's "mailbox" term is one lesson's detail. |
| 82 | SELECT | what-is-imap | stays in lesson | IMAP command name. |
| 83 | FETCH | what-is-imap | stays in lesson | IMAP command name. |
| 84 | Flag | what-is-imap | stays in lesson (borderline) | IMAP's mark on a message; the word means other things elsewhere (TCP's flags), so an entry would need senses no other lesson names. |
| 85 | STORE | what-is-imap | stays in lesson | IMAP command name. |
| 86 | IDLE | what-is-imap | stays in lesson | IMAP command name. |
| 87 | Routing decision | what-is-ip | entry (borderline) | Local or via the gateway; IP, and Subnetting's "local delivery" is the same check. |
| 88 | MAC address | what-is-ip | entry | A basic word; IP, and DHCP's lease is tied to it. |
| 89 | ARP | what-is-ip | entry | A protocol a beginner needs to name. |
| 90 | IP header | what-is-ip | entry (borderline) | What a packet carries in front (addresses, TTL); IP and ICMP; a case of Header that names its own fields. |
| 91 | NAT | what-is-ip | entry | A basic word; every home router. |
| 92 | Forwarding | what-is-ip | entry | What routers do; IP and ICMP. |
| 93 | POP3 | what-is-pop3 | entry | A protocol a reader configures; POP3 and IMAP. |
| 94 | +OK, -ERR | what-is-pop3 | stays in lesson | Reply markers; decision 5's own example. |
| 95 | STAT, LIST | what-is-pop3 | stays in lesson | POP3 command names. |
| 96 | RETR | what-is-pop3 | stays in lesson | POP3 command name (FTP has a different RETR; A1). |
| 97 | DELE | what-is-pop3 | stays in lesson | POP3 command name. |
| 98 | QUIT | what-is-pop3 | stays in lesson | Command name (FTP, POP3). |
| 99 | Outgoing mail server | what-is-smtp | entry | A setting every mail user meets (the SMTP server). |
| 100 | EHLO | what-is-smtp | stays in lesson | SMTP command name. |
| 101 | AUTH | what-is-smtp | stays in lesson | SMTP command name. |
| 102 | MAIL FROM, RCPT TO | what-is-smtp | stays in lesson | SMTP command names. |
| 103 | DATA | what-is-smtp | stays in lesson | SMTP command name. |
| 104 | Reply code | what-is-smtp | entry (borderline) | SMTP's three-digit answers; FTP's replies (150, 220) are the same kind; could instead be one statement under Status code. |
| 105 | MX record | what-is-smtp | entry | A DNS record a beginner needs; SMTP and DNS. |
| 106 | STARTTLS | what-is-smtp | entry (borderline) | A command name, but a named way of sealing a line met in SMTP, IMAP and POP3 (STLS). |
| 107 | Version exchange | what-is-ssh | stays in lesson (borderline) | SSH's first step; one lesson, a protocol detail. |
| 108 | Algorithm negotiation (KEXINIT) | what-is-ssh | stays in lesson (borderline) | SSH's message; Cipher suite and Key exchange carry the idea. |
| 109 | Key exchange | what-is-ssh | entry | SSH, and TLS's key share; a basic security word. |
| 110 | Host key | what-is-ssh | entry | The server's identity in SSH; a reader meets it in the first-connect warning. |
| 111 | known_hosts | what-is-ssh | stays in lesson (borderline) | A file name; Host key's definition can name it. |
| 112 | Key pair | what-is-ssh | entry | SSH and TLS (public half, private half). |
| 113 | Channel | what-is-ssh | stays in lesson (borderline) | SSH's word; one lesson, and "channel" means other things elsewhere. |
| 114 | Shell | what-is-ssh | entry | A tool a reader needs to name. |
| 115 | Three-way handshake | what-is-tcp | entry | TCP, and every TCP lesson's "TCP hello". |
| 116 | Segment | what-is-tcp | entry | OSI and TCP; one of the four data-unit names. |
| 117 | Sequence number | what-is-tcp | entry | TCP; needed to read ACK. |
| 118 | ACK | what-is-tcp | entry (two senses) | Sense 1, in TCP: "got everything up to here". Sense 2, in DHCP: the server's confirming message. Decision 5's own example. |
| 119 | Duplicate ACK | what-is-tcp | stays in lesson (borderline) | A TCP recovery detail; one lesson; Retransmission carries the idea. |
| 120 | SACK | what-is-tcp | stays in lesson (borderline) | A TCP option; one lesson. |
| 121 | Retransmission | what-is-tcp | entry | TCP, and UDP's contrast. |
| 122 | FIN | what-is-tcp | stays in lesson (borderline) | TCP's closing flag; one lesson, a message name. |
| 123 | ClientHello | what-is-tls | stays in lesson | TLS message name; TLS handshake carries it. |
| 124 | ServerHello | what-is-tls | stays in lesson | TLS message name. |
| 125 | Cipher suite | what-is-tls | entry | TLS and HTTPS; SSH's algorithm lists are the same idea. |
| 126 | Key share | what-is-tls | stays in lesson (borderline) | TLS 1.3's field; Key exchange carries the idea. |
| 127 | Shared secret | what-is-tls | entry | TLS and SSH (and HTTPS as "shared key"). |
| 128 | Finished | what-is-tls | stays in lesson | TLS message name. |
| 129 | close_notify | what-is-tls | stays in lesson | TLS alert name. |
| 130 | Connectionless | what-is-udp | entry | UDP and OSI; a basic contrast with TCP. |
| 131 | Datagram | what-is-udp | entry | UDP and OSI (IP datagram); one idea, a message sent on its own. |
| 132 | No retransmission | what-is-udp | stays in lesson | A property of UDP, not a term; tie its Learn row to Retransmission. |
| 133 | Jitter | what-is-udp | entry | A measured quantity a beginner meets (calls, games). |
| 134 | Loss concealment | what-is-udp | stays in lesson (borderline) | An app technique in one lesson. |
| 135 | Report (RTCP) | what-is-udp | stays in lesson (borderline) | RTCP's report; one lesson, one protocol detail. |

## Part 2: the 110 marked words that are not Learn names

Source: `prototypes/s11-glossary-facts.md` §5.2, rows marked "NOT in terms.tsv" (112 rows; the two case pairs for layers 5 and 6 are one row each here).

| # | word as written | lesson(s) | class | reason |
|---|---|---|---|---|
| 1 | ` OK` | what-is-imap | stays in lesson | IMAP's "* OK" greeting; a reply marker. |
| 2 | `+OK` | what-is-pop3 | stays in lesson | POP3 reply marker; part of "+OK, -ERR". |
| 3 | `.app servers` | what-is-dns | stays in lesson | Story words for one TLD's servers; Top-level domain carries it. |
| 4 | `200 OK` | what-is-http, what-is-https | stays in lesson | One status code; tie to Status code. |
| 5 | `993` | what-is-imap | stays in lesson | A port number; tie to Port. |
| 6 | `995` | what-is-pop3 | stays in lesson | A port number; tie to Port. |
| 7 | `a common way to represent the data` | osi-model | stays in lesson | A phrase for layer 6's job; Presentation Layer carries it. |
| 8 | `acknowledgement` | what-is-tcp | spelling of ACK | The full word TCP's ACK stands for. |
| 9 | `allow` | firewalls | stays in lesson | A rule's action; Firewall rule carries it. |
| 10 | `application data` | what-is-tls | stays in lesson | TLS's record type, named in one step. |
| 11 | `bits` | osi-model | entry (borderline) | Show as "Bit": OSI layer 1, and every mask, prefix and "host bit" in Subnetting; no Learn name defines it. |
| 12 | `certificate authority` | what-is-tls | spelling of Certificate authority (CA) | Same name without its abbreviation. |
| 13 | `CertificateVerify` | what-is-tls | stays in lesson | TLS message name. |
| 14 | `cipher suites` | what-is-tls | spelling of Cipher suite | Plural. |
| 15 | `common way to represent the data` | osi-model | stays in lesson | Same phrase as above, without "a"; layer 6's job. |
| 16 | `connection` | what-is-http, what-is-tcp | spelling of TCP connection | HTTP and TCP: "the open line is a connection". |
| 17 | `connections` | firewalls | stays in lesson | The firewall's list of connections it let in; Stateful carries it. |
| 18 | `deny` | firewalls | stays in lesson | A rule's action; Firewall rule and Default deny carry it. |
| 19 | `destination address` | what-is-ip | entry (borderline) | The IP header's "to" field; pairs with Source address; ICMP's Destination unreachable leans on it. |
| 20 | `DHCP Acknowledge` | what-is-dhcp | sense of ACK (in DHCP) | The DHCP message, full name. |
| 21 | `DHCP Discover` | what-is-dhcp | spelling of Discover | Full name; the entry shows it. |
| 22 | `DHCP Offer` | what-is-dhcp | spelling of Offer | Full name. |
| 23 | `DHCP Request` | what-is-dhcp | spelling of Request | Full name. |
| 24 | `dialogue` | osi-model | stays in lesson | X.200's word for layer 5's conversation; Session Layer carries it. |
| 25 | `DNS query` | what-is-dns | stays in lesson (borderline) | The question a resolver is sent; DNS resolver's definition can carry it. |
| 26 | `DNS resolution` | what-is-http | stays in lesson (borderline) | Turning a name into a number, in HTTP; DNS resolver carries it. If the owner wants an entry for DNS itself, this is its spelling. |
| 27 | `echo` | what-is-ssh | stays in lesson | SSH's echo of typed keys; not ICMP's echo, so no tie to Echo request. |
| 28 | `end to end` | osi-model | stays in lesson (borderline) | How layer 4 works; Transport Layer carries it. |
| 29 | `errors` | osi-model | stays in lesson | An ordinary word in layer 2's job. |
| 30 | `example.org` | what-is-smtp | stays in lesson | A story's domain. |
| 31 | `first rule that fits` | firewalls | spelling of First match | The lesson's plain words for it. |
| 32 | `folders` | what-is-imap | stays in lesson | Same as Folders (mailboxes). |
| 33 | `frame` | osi-model | entry | OSI and IP ("wraps it in a frame"); one of the four data-unit names, with Segment, Datagram, Packet. |
| 34 | `GET /` | what-is-http, what-is-https | stays in lesson | One request line; tie to Method. |
| 35 | `header 2` | osi-model | stays in lesson | Story label for layer 2's header. |
| 36 | `header 3` | osi-model | stays in lesson | Story label for layer 3's header. |
| 37 | `https://techconcepts.app` | what-is-https | stays in lesson | A story's address. |
| 38 | `ICMP echo request` | what-is-icmp | spelling of Echo request | Full name (pilot). |
| 39 | `image` | what-is-http | stays in lesson | An ordinary word in HTTP's story. |
| 40 | `IP` | osi-model | entry | The Internet Protocol; met in most lessons. Distinct from IP address. |
| 41 | `its own header` | osi-model | stays in lesson | A phrase; Header carries it. |
| 42 | `its twin` | osi-model | stays in lesson | The lesson's word for a peer layer, not a name sources use. |
| 43 | `KEXINIT` | what-is-ssh | stays in lesson | SSH message name; part of Algorithm negotiation (KEXINIT). |
| 44 | `latency` | what-is-icmp | spelling of Latency | Same word (pilot). |
| 45 | `layer 1, the Physical Layer` | osi-model | entry | Show as "Physical Layer (layer 1)"; OSI badges and Network+ name every layer. |
| 46 | `Layer 2, the Data Link Layer` | osi-model | entry | Show as "Data Link Layer (layer 2)"; where MAC addresses and frames live. |
| 47 | `Layer 3, the Network Layer` | osi-model | entry | Show as "Network Layer (layer 3)"; the badge of IP, ICMP, Subnetting, Firewalls. |
| 48 | `Layer 4, the Transport Layer` | osi-model | entry | Show as "Transport Layer (layer 4)"; the badge of TCP and Firewalls. |
| 49 | `Layer 5, the Session Layer` | osi-model | entry (borderline) | Show as "Session Layer (layer 5)"; no lesson's badge names it, but a beginner learns all seven. Also written "layer 5, the Session Layer" (counted once). |
| 50 | `Layer 6, the Presentation Layer` | osi-model | entry (borderline) | Show as "Presentation Layer (layer 6)"; same as layer 5. Also written "layer 6, the Presentation Layer" (counted once). |
| 51 | `layer 7, the Application Layer` | osi-model | entry | Show as "Application Layer (layer 7)"; the badge of eight lessons. |
| 52 | `Layers 1 to 3` | osi-model | stays in lesson | A phrase; Router and the layer entries carry it. |
| 53 | `Layers 4 to 7` | osi-model | stays in lesson | A phrase. |
| 54 | `LIST` | what-is-pop3 | stays in lesson | POP3 command name. |
| 55 | `local delivery` | subnetting | stays in lesson (borderline) | Subnetting's name for the "on my subnet" answer; Routing decision carries it. |
| 56 | `LOGIN` | what-is-imap | stays in lesson | IMAP command name. |
| 57 | `lowest three layers` | osi-model | stays in lesson | A phrase for layers 1 to 3. |
| 58 | `MAIL FROM` | what-is-smtp | stays in lesson | SMTP command name. |
| 59 | `method` | what-is-http | spelling of Method | Same word. |
| 60 | `name server` | what-is-dns | entry (borderline) | The general word for root, TLD and authoritative servers; one sentence of DNS, but the word a reader meets in every domain setting (NS). |
| 61 | `network addresses` | osi-model | sense of Network address (in the OSI model) | Layer 3's addresses, not subnetting's all-zero host bits. |
| 62 | `NEWKEYS` | what-is-ssh | stays in lesson | SSH message name. |
| 63 | `one link` | osi-model | stays in lesson | A phrase for layer 2's reach; Data Link Layer carries it. |
| 64 | `OSI model` | osi-model | entry | The model every lesson's badge refers to. |
| 65 | `OSI Reference Model` | osi-model | spelling of OSI model | Its full name. |
| 66 | `packet` | osi-model | entry | Used in nearly every lesson; one of the four data-unit names. |
| 67 | `PASS` | what-is-ftp, what-is-pop3 | stays in lesson | Command name (FTP, POP3). |
| 68 | `passive mode` | what-is-ftp | spelling of Passive mode (PASV) | Same name without the command. |
| 69 | `PASV` | what-is-ftp | spelling of Passive mode (PASV) | The command that asks for it. |
| 70 | `peer layers` | osi-model | spelling of Peer layer | Plural. |
| 71 | `pieces` | osi-model | stays in lesson | An ordinary word for segments in the OSI lesson. |
| 72 | `point-to-point` | subnetting | spelling of Point-to-point /30 | The entry's name ("Point-to-point link"). |
| 73 | `port 22` | what-is-ssh | stays in lesson | A port number; tie to Port. |
| 74 | `ports` | firewalls | spelling of Port | Plural. |
| 75 | `private address` | what-is-ip | entry | A basic word; every home network, NAT's reason. |
| 76 | `protocol-control-information` | osi-model | stays in lesson (borderline) | X.200's name for a layer's control information; Header carries it. |
| 77 | `protocol-data-unit` | osi-model | entry (borderline) | Show as "Protocol data unit (PDU)"; the umbrella over Segment, Datagram, Packet, Frame, and Network+ vocabulary. |
| 78 | `public address` | what-is-ip | entry | Pairs with Private address; NAT. |
| 79 | `public-key authentication` | what-is-ssh | stays in lesson (borderline) | Logging in with a key pair; Key pair carries it. |
| 80 | `push` | what-is-imap | stays in lesson (borderline) | New mail shown at once; one sentence of IMAP. |
| 81 | `RCPT TO` | what-is-smtp | stays in lesson | SMTP command name. |
| 82 | `report` | what-is-udp | stays in lesson | Same as Report (RTCP). |
| 83 | `route` | osi-model | stays in lesson (borderline) | An ordinary word in layer 3's job; Router and Forwarding carry it. |
| 84 | `router` | osi-model | entry | Met in nearly every lesson; X.200's Relay is its case. |
| 85 | `rule list` | firewalls | stays in lesson | The list of firewall rules; Firewall rule and First match carry it. |
| 86 | `segments` | what-is-tcp | spelling of Segment | Plural. |
| 87 | `SELECT INBOX` | what-is-imap | stays in lesson | IMAP command. |
| 88 | `selective acknowledgement` | what-is-tcp | stays in lesson | The full name of SACK, which stays. |
| 89 | `sending mail from an app` | what-is-smtp | stays in lesson | A phrase; Outgoing mail server carries it. |
| 90 | `sequence numbers` | what-is-tcp | spelling of Sequence number | Plural. |
| 91 | `session` | osi-model, what-is-ssh | stays in lesson (borderline) | Two uses (OSI layer 5's session, SSH's session channel); Session Layer carries the first. |
| 92 | `session ticket` | what-is-https | stays in lesson | TLS resumption detail in one step. |
| 93 | `session-connection` | osi-model | stays in lesson | X.200's term in one deeper note. |
| 94 | `seven layers` | osi-model | stays in lesson | A phrase; OSI model carries it. |
| 95 | `shadowed` | firewalls | spelling of Shadowed rule | Adjective form. |
| 96 | `source address` | what-is-ip | entry | Show as "Source address": IP header field, and Firewalls' "Source". |
| 97 | `STAT` | what-is-pop3 | stays in lesson | POP3 command name. |
| 98 | `STOR report.pdf` | what-is-ftp | stays in lesson | An FTP command line. |
| 99 | `stylesheet` | what-is-http | stays in lesson | An ordinary web word in one step. |
| 100 | `subnets` | subnetting | spelling of Subnet | Plural. |
| 101 | `synchronization points` | osi-model | stays in lesson | X.200's session detail in one note. |
| 102 | `TCP` | osi-model | entry | Met in most lessons (HTTP, mail, SSH, FTP, TLS). |
| 103 | `TCP handshake` | what-is-http | spelling of Three-way handshake | HTTP's name for it. |
| 104 | `the same layer` | osi-model | stays in lesson | A phrase for a peer layer. |
| 105 | `TLS` | what-is-smtp | entry | Met in HTTPS, TLS, SMTP, IMAP, POP3. |
| 106 | `transfer syntax` | osi-model | stays in lesson | X.200's term in one deeper note. |
| 107 | `twin` | osi-model | stays in lesson | The lesson's word for a peer layer. |
| 108 | `UDP` | osi-model | entry | UDP, OSI, ICMP's traceroute, DNS. |
| 109 | `USER` | what-is-ftp, what-is-pop3 | stays in lesson | Command name (FTP, POP3). |
| 110 | `\Seen` | what-is-imap | stays in lesson | An IMAP flag's name. |

## Counts

245 rows: 135 Learn names and 110 marked words.

| class | rows |
|---|---|
| entry | 113 (37 from part 2) |
| spelling of an entry | 25 |
| sense of an entry | 5 (Acknowledge (ACK), Acknowledge, DHCP Acknowledge under ACK; Headers under Header; network addresses under Network address) |
| stays in lesson | 102 |
| marked (borderline) | 47, of them 21 entries |

**Entries with two senses: 5, holding 10 senses.** TTL (in IP; in DNS), ACK (in TCP; in DHCP), Header (in the layer model; in HTTP), Network address (in subnetting; in the OSI model), Plain text (not encrypted; written as text, not binary, the second from HTTP/1.1's unmarked use).

## The pilot and what is left

**The pilot covers 10 entries:** Echo request, Echo reply, Ping, Latency, TTL (both senses), Time exceeded, Traceroute, Destination unreachable, Packet loss, IP address.

**Left after the pilot: 103 entries**, in about **9 groups** of a dozen (8 of 12 and 1 of 7).

The 21 borderline entries: Discover, Offer, Request, Shadowed rule, Decapsulation, Borrowing bits, Point-to-point link, DHCP server, Referral, Path, Padlock, Routing decision, IP header, Reply code, STARTTLS, Bit, Destination address, Session Layer, Presentation Layer, Name server, Protocol data unit. Without them: 82 entries, 7 groups.

## Estimate (the plan's rate: about 3 checked items an entry, 7,400 to 9,400 subagent tokens a checked item)

| list | entries | checked items | tokens |
|---|---|---|---|
| as proposed | 103 | about 309 | about 2.29 to 2.90 million |
| without the 21 borderline entries | 82 | about 246 | about 1.82 to 2.31 million |

This counts checked items only. Direction 2.39's "roughly 3 to 4.5 million tokens for a hundred more entries" works out at 10,000 to 15,000 an item, so it presumably also counts the analyst and author passes. The pilot's measured cost should replace both figures.

## Open, for the owner and the orchestrator

1. **Protocol names.** IP, TCP, UDP and TLS are marked words and get entries, and IMAP, POP3, SFTP, HTTPS, ARP and NAT are Learn names. DHCP, DNS, HTTP, FTP, SMTP, SSH and ICMP are in neither list, because each is a lesson's title. A glossary with TCP but no DNS would read oddly. Adding those seven would make 110 entries after the pilot.
2. **Server.** "Client" is an entry, but no plain "Server" is a candidate. DHCP server is a borderline entry for that reason, and DHCP client stays and is tied to Client.
3. **Ties.** Nine stays-in-lesson rows are cases of an entry and their reason says "tie": Port 21, Port 443, port 22, 993, 995, 200 OK, GET /, DHCP client, No retransmission. Many more stays rows name the entry that carries them, but are phrases rather than terms. Decision 3's tie could show that entry's definition beside them without listing them as spellings. Whether it should is a ruling for B9's group-file rules.
4. **Shared key and Shared secret** are classed as one entry (borderline). The TLS lesson says keys are made from the shared secret, so the entry's author must settle from the sources whether HTTPS's "shared key" is the same thing or a slip.
5. **Message names.** The pilot makes ICMP's four message names entries. To match, DHCP's Discover, Offer and Request are borderline entries, and Acknowledge sits under ACK. TLS's, SSH's and the mail protocols' message and command names stay, because each is met in one step of one lesson.
