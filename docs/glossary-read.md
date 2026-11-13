# Glossary read (job 9, unit A1)

**Question.** The Glossary page lists every term the lessons teach in Learn: its name, the lesson's own checked "idea" for it, and the lesson's title and track beside it, with a link. Read as a beginner would meet each of the 152 terms there, outside the lesson's story, would any leave that beginner believing something false?

**Rule** (the owner's, for the whole site). A sentence true in the ordinary case stays as written; only what would leave a beginner believing something false is flagged. Thin is not false. The terms were not fact-checked again: every one has passed its lesson's check.

- **fine**: stands on its own with its name and the lesson's title beside it.
- **leans**: thin or lesson-bound (a quoted line, a dangling "those", a story's cast), but with the title beside it nothing false is believed.
- **misleads**: would leave a beginner believing something false.

Source sheet: `.superpowers/revamp/job-9/terms.tsv`. Lesson files were opened only for rows 4, 87 and 126 (searched by term id).

## All 152 terms

| n | lesson | name | verdict | note |
|---|---|---|---|---|
| 1 | dhcp | Broadcast | leans | "because you don't know who to ask" is DHCP's reason for broadcasting, not the only one; the DHCP title carries it |
| 2 | dhcp | Discover | leans | a question in the laptop's voice; DHCP title gives the speaker |
| 3 | dhcp | Offer | fine | "the router" is the home case of the DHCP server |
| 4 | dhcp | Request | leans | "so every router knows" leans on the lesson's two-server story (`dhcp.ts` step "request": "a second server learns it wasn't picked"); true of every DHCP server that offered |
| 5 | dhcp | Acknowledge (ACK) | fine | |
| 6 | dhcp | Lease table | fine | |
| 7 | dhcp | Lease | fine | |
| 8 | dhcp | Renew | fine | "halfway through" is the default renewal time |
| 9 | dhcp | IP address | fine | |
| 10 | firewalls | Firewall | fine | |
| 11 | firewalls | Rule | fine | |
| 12 | firewalls | Port | fine | |
| 13 | firewalls | Source | fine | |
| 14 | firewalls | First match | fine | defines the term itself |
| 15 | firewalls | Default deny | fine | |
| 16 | firewalls | Stateful | leans | names only replies to connections let in; true, and the lesson's case |
| 17 | firewalls | Shadowed rule | fine | |
| 18 | osi-model | Layer | fine | |
| 19 | osi-model | Header | fine | |
| 20 | osi-model | Encapsulation | fine | |
| 21 | osi-model | Decapsulation | fine | |
| 22 | osi-model | Peer layer | fine | |
| 23 | osi-model | Relay | fine | |
| 24 | subnetting | Network portion | fine | |
| 25 | subnetting | Host portion | fine | |
| 26 | subnetting | Subnet mask | leans | "the card laid over" is the lesson's image; the rest defines it |
| 27 | subnetting | Prefix length | fine | |
| 28 | subnetting | Network address | fine | |
| 29 | subnetting | Broadcast address | fine | |
| 30 | subnetting | Subnet | fine | |
| 31 | subnetting | Borrowing bits | fine | |
| 32 | subnetting | Default gateway | fine | |
| 33 | subnetting | Point-to-point /30 | fine | |
| 34 | what-is-dhcp | DHCP client | fine | |
| 35 | what-is-dhcp | DHCP server | fine | "here your router" marks the example |
| 36 | what-is-dhcp | Broadcast | fine | |
| 37 | what-is-dhcp | Discover | leans | quoted line; DHCP title gives the speaker |
| 38 | what-is-dhcp | Offer | leans | quoted line |
| 39 | what-is-dhcp | Request | leans | quoted line |
| 40 | what-is-dhcp | Acknowledge | leans | quoted line |
| 41 | what-is-dhcp | Lease | fine | |
| 42 | what-is-dhcp | IP address | fine | |
| 43 | what-is-dhcp | Lease renewal | fine | |
| 44 | what-is-dns | DNS resolver | fine | |
| 45 | what-is-dns | Root server | fine | |
| 46 | what-is-dns | Top-level domain | fine | |
| 47 | what-is-dns | Referral | leans | quoted line |
| 48 | what-is-dns | Authoritative server | fine | |
| 49 | what-is-dns | A record | fine | "number" is the lesson's word for an IPv4 address |
| 50 | what-is-dns | TTL | fine | alone; see shared names |
| 51 | what-is-dns | DNS cache | fine | |
| 52 | what-is-ftp | Control connection | fine | |
| 53 | what-is-ftp | Port 21 | fine | |
| 54 | what-is-ftp | USER, PASS | leans | "Log in": the commands' job, not what they carry |
| 55 | what-is-ftp | Passive mode (PASV) | leans | quoted line |
| 56 | what-is-ftp | Data connection | fine | |
| 57 | what-is-ftp | STOR, RETR | fine | |
| 58 | what-is-ftp | Plain text | leans | means FTP's traffic; the FTP title carries it |
| 59 | what-is-ftp | SFTP | fine | |
| 60 | what-is-http | Client | fine | "your browser" is HTTP's client |
| 61 | what-is-http | URL | fine | |
| 62 | what-is-http | IP address | leans | "the server's number" is the lesson's use; every device has one |
| 63 | what-is-http | TCP connection | fine | |
| 64 | what-is-http | Method (GET) | fine | |
| 65 | what-is-http | Path | fine | |
| 66 | what-is-http | Headers | fine | |
| 67 | what-is-http | Status code | fine | |
| 68 | what-is-http | HTML | fine | |
| 69 | what-is-http | Rendering | fine | |
| 70 | what-is-https | HTTPS (HTTP Secure) | fine | |
| 71 | what-is-https | Port 443 | fine | |
| 72 | what-is-https | TLS handshake | fine | |
| 73 | what-is-https | Certificate | fine | |
| 74 | what-is-https | Certificate authority (CA) | fine | |
| 75 | what-is-https | Shared key | fine | |
| 76 | what-is-https | Encrypted | fine | |
| 77 | what-is-https | HTML | fine | |
| 78 | what-is-https | Padlock | fine | |
| 79 | what-is-icmp | Echo request | leans | quoted line |
| 80 | what-is-icmp | Echo reply | leans | quoted line |
| 81 | what-is-icmp | Ping | leans | "those" points at rows 79 and 80, which will not sit beside it on an A to Z page |
| 82 | what-is-icmp | Latency (round-trip time) | fine | |
| 83 | what-is-icmp | TTL | fine | alone; see shared names |
| 84 | what-is-icmp | Time exceeded | leans | quoted line |
| 85 | what-is-icmp | Traceroute | fine | |
| 86 | what-is-icmp | Destination unreachable | leans | quoted line |
| 87 | what-is-icmp | Packet loss | leans | names how ping measures it (`what-is-icmp.ts`: "A few pings in a row also show whether any go missing, which is packet loss"); the ICMP title carries it |
| 88 | what-is-imap | IMAP | fine | |
| 89 | what-is-imap | Tag | fine | |
| 90 | what-is-imap | Folders (mailboxes) | fine | |
| 91 | what-is-imap | SELECT | fine | |
| 92 | what-is-imap | FETCH | fine | |
| 93 | what-is-imap | Flag | fine | |
| 94 | what-is-imap | STORE | fine | |
| 95 | what-is-imap | IDLE | leans | quoted line |
| 96 | what-is-ip | IP address | fine | |
| 97 | what-is-ip | Routing decision | leans | a question in the sender's voice |
| 98 | what-is-ip | Default gateway | fine | |
| 99 | what-is-ip | MAC address | fine | |
| 100 | what-is-ip | ARP | leans | quoted line |
| 101 | what-is-ip | IP header | fine | |
| 102 | what-is-ip | TTL | fine | alone; see shared names |
| 103 | what-is-ip | NAT | fine | |
| 104 | what-is-ip | Forwarding | fine | |
| 105 | what-is-ip | Encapsulation | fine | |
| 106 | what-is-pop3 | POP3 | fine | |
| 107 | what-is-pop3 | +OK, -ERR | fine | |
| 108 | what-is-pop3 | USER, PASS | leans | "Log in", as row 54 |
| 109 | what-is-pop3 | STAT, LIST | leans | a question |
| 110 | what-is-pop3 | RETR | fine | |
| 111 | what-is-pop3 | DELE | fine | |
| 112 | what-is-pop3 | QUIT | fine | |
| 113 | what-is-smtp | Outgoing mail server | fine | |
| 114 | what-is-smtp | EHLO | fine | |
| 115 | what-is-smtp | AUTH | fine | |
| 116 | what-is-smtp | MAIL FROM, RCPT TO | fine | |
| 117 | what-is-smtp | DATA | fine | |
| 118 | what-is-smtp | Reply code | fine | |
| 119 | what-is-smtp | MX record | leans | quoted question; "their" leans on the recipient in the story |
| 120 | what-is-smtp | STARTTLS | fine | |
| 121 | what-is-ssh | Version exchange | fine | |
| 122 | what-is-ssh | Algorithm negotiation (KEXINIT) | fine | |
| 123 | what-is-ssh | Key exchange | fine | |
| 124 | what-is-ssh | Host key | fine | "permanent" true in the ordinary case |
| 125 | what-is-ssh | known_hosts | fine | |
| 126 | what-is-ssh | Key pair | leans | describes your login key pair (`what-is-ssh.ts`: "public half on the server"); the server's host key pair runs the other way, but row 124 covers it and the SSH title names the setting |
| 127 | what-is-ssh | Channel | fine | |
| 128 | what-is-ssh | Shell | fine | |
| 129 | what-is-tcp | Three-way handshake | fine | |
| 130 | what-is-tcp | Segment | fine | |
| 131 | what-is-tcp | Sequence number | fine | every byte has a number; a segment carries its first byte's |
| 132 | what-is-tcp | ACK | leans | quoted line |
| 133 | what-is-tcp | Duplicate ACK | fine | |
| 134 | what-is-tcp | SACK | leans | quoted line |
| 135 | what-is-tcp | Retransmission | fine | |
| 136 | what-is-tcp | FIN | fine | |
| 137 | what-is-tls | ClientHello | leans | quoted line |
| 138 | what-is-tls | ServerHello | leans | quoted line |
| 139 | what-is-tls | Cipher suite | fine | |
| 140 | what-is-tls | Key share | fine | |
| 141 | what-is-tls | Shared secret | fine | |
| 142 | what-is-tls | Certificate | fine | |
| 143 | what-is-tls | Certificate authority (CA) | fine | |
| 144 | what-is-tls | Finished | fine | |
| 145 | what-is-tls | close_notify | leans | quoted line |
| 146 | what-is-udp | Connectionless | fine | |
| 147 | what-is-udp | Datagram | fine | |
| 148 | what-is-udp | Port | fine | |
| 149 | what-is-udp | No retransmission | fine | |
| 150 | what-is-udp | Jitter | fine | |
| 151 | what-is-udp | Loss concealment | fine | |
| 152 | what-is-udp | Report (RTCP) | fine | |

Counts: 120 fine, 32 leans, 0 misleads.

## The 14 shared names

- **Broadcast** (1 dhcp, 36 what-is-dhcp): agree; 1 adds DHCP's reason. Keep apart from **Broadcast address** (29), a different name.
- **Discover** (2, 37): same message, one described and one quoted; no conflict.
- **Offer** (3, 38): agree.
- **Request** (4, 39): agree. The bare word also reads as an HTTP request; both rows are DHCP messages, so the page should show the lesson beside the name.
- **Lease** (7, 41): one is the borrowing, the other its length; two sides of one thing, no conflict.
- **IP address** (9, 42, 96, 62): the laptop's number, a device's number, the server's number; together they say every device has one. No conflict.
- **Port** (12 firewalls, 148 udp): the door a service answers at, and which app a datagram is for; one idea. Port 21 (53) and Port 443 (71) are named apart and agree.
- **Encapsulation** (20 osi-model, 105 what-is-ip): 105 is one case of 20 (a packet in a frame); no conflict.
- **Default gateway** (32, 98): agree.
- **TTL** (50 what-is-dns; 83 what-is-icmp, 102 what-is-ip): **two different things under one name.** DNS TTL is how long an answer may be cached; IP TTL is a hop counter on a packet. Shown as one entry, a beginner would take them for one field. The page must show them as two entries (for example "TTL (DNS)" and "TTL (IP)"), not as three wordings of one term. 83 and 102 are the same thing and agree.
- **USER, PASS** (54 FTP, 108 POP3): same command names in two protocols; both "Log in", no conflict, but they are two protocols' commands.
- **HTML** (68, 77): identical.
- **Certificate** (73, 142): agree.
- **Certificate authority** (74, 143): agree.

Two pairs outside the list are worth the same care: **ACK** (5, 40 DHCP's Acknowledge message; 132 TCP's ACK) are different things in different protocols, and **RETR** (57 FTP "download"; 110 POP3 "retrieve one message") are two protocols' commands with the same name. Their names differ on the sheet, so they will not merge unless the page groups by abbreviation.

## For the owner

None.
