```json fact-check
{
  "slug": "what-is-udp",
  "hash": "3cea93ca6ee8b31f05499639b0c34f59b39d53457877c10623f9f693aa7690b1",
  "checked": "2026-11-11",
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
    "units[0].overview.facts[0] (Overview fact \"Used for\")": "✅",
    "units[0].overview.facts[1] (Overview fact \"Starts with\")": "✅",
    "units[0].overview.facts[2] (Overview fact \"Promises\")": "✅",
    "units[0].overview.facts[3] (Overview fact \"Header\")": "✅",
    "units[0].overview.facts[4] (Overview fact \"OSI layer\")": "✅",
    "units[0].overview.facts[5] (Overview fact \"This example\")": "✅",
    "units[0].steps[0] (step \"connectionless-send\")": "✅",
    "units[0].steps[0].facts[0] (step \"connectionless-send\", fact \"From\")": "✅",
    "units[0].steps[0].facts[1] (step \"connectionless-send\", fact \"To\")": "✅",
    "units[0].steps[0].facts[2] (step \"connectionless-send\", fact \"Handshake\")": "✅",
    "units[0].steps[0].facts[3] (step \"connectionless-send\", fact \"Each packet\")": "✅",
    "units[0].steps[0].events[0] (event \"m1\")": "✅",
    "units[0].steps[0].events[1] (event \"voice-1\")": "✅",
    "units[0].steps[1] (step \"datagram-stream\")": "✅",
    "units[0].steps[1].facts[0] (step \"datagram-stream\", fact \"Rate\")": "✅",
    "units[0].steps[1].facts[1] (step \"datagram-stream\", fact \"Replies\")": "✅",
    "units[0].steps[1].facts[2] (step \"datagram-stream\", fact \"Matters most\")": "⚠️",
    "units[0].steps[1].facts[3] (step \"datagram-stream\", fact \"Smoothing\")": "✅",
    "units[0].steps[1].events[0] (event \"m2\")": "✅",
    "units[0].steps[1].events[1] (event \"voice-2\")": "✅",
    "units[0].steps[1].events[2] (event \"m3\")": "✅",
    "units[0].steps[1].events[3] (event \"voice-3\")": "✅",
    "units[0].steps[1].events[4] (event \"m4\")": "✅",
    "units[0].steps[1].events[5] (event \"voice-4\")": "✅",
    "units[0].steps[2] (step \"packet-loss-no-retransmission\")": "⚠️",
    "units[0].steps[2].facts[0] (step \"packet-loss-no-retransmission\", fact \"Packet 5\")": "✅",
    "units[0].steps[2].facts[1] (step \"packet-loss-no-retransmission\", fact \"Packet 6\")": "✅",
    "units[0].steps[2].facts[2] (step \"packet-loss-no-retransmission\", fact \"Who notices\")": "✅",
    "units[0].steps[2].events[0] (event \"m5\")": "✅",
    "units[0].steps[2].events[1] (event \"voice-5\")": "✅",
    "units[0].steps[2].events[2] (event \"m6\")": "✅",
    "units[0].steps[2].events[3] (event \"voice-6\")": "✅",
    "units[0].steps[3] (step \"two-way-datagrams\")": "✅",
    "units[0].steps[3].facts[0] (step \"two-way-datagrams\", fact \"From\")": "✅",
    "units[0].steps[3].facts[1] (step \"two-way-datagrams\", fact \"To\")": "✅",
    "units[0].steps[3].facts[2] (step \"two-way-datagrams\", fact \"Same rules\")": "✅",
    "units[0].steps[3].facts[3] (step \"two-way-datagrams\", fact \"Your router remembers\")": "✅",
    "units[0].steps[3].events[0] (event \"m7\")": "✅",
    "units[0].steps[3].events[1] (event \"voice-7\")": "✅",
    "units[0].steps[3].events[2] (event \"m8\")": "✅",
    "units[0].steps[3].events[3] (event \"voice-8\")": "✅",
    "units[0].steps[3].events[4] (event \"m9\")": "✅",
    "units[0].steps[3].events[5] (event \"voice-9\")": "✅",
    "units[0].steps[4] (step \"application-level-recovery\")": "✅",
    "units[0].steps[4].facts[0] (step \"application-level-recovery\", fact \"Gap filled by\")": "✅",
    "units[0].steps[4].facts[1] (step \"application-level-recovery\", fact \"Report\")": "✅",
    "units[0].steps[4].facts[2] (step \"application-level-recovery\", fact \"The app’s fix\")": "✅",
    "units[0].steps[4].facts[3] (step \"application-level-recovery\", fact \"Reliable over UDP\")": "✅",
    "units[0].steps[4].events[0] (event \"m10\")": "✅",
    "units[0].steps[4].events[1] (event \"voice-10\")": "✅",
    "units[0].steps[4].events[2] (event \"m11\")": "✅",
    "units[0].steps[4].events[3] (event \"voice-11\")": "✅",
    "units[0].steps[0].deep[0] (step \"connectionless-send\", Go deeper)": "⚠️",
    "units[0].steps[1].deep[0] (step \"datagram-stream\", Go deeper)": "⚠️",
    "units[0].steps[2].deep[0] (step \"packet-loss-no-retransmission\", Go deeper)": "✅",
    "units[0].steps[3].deep[0] (step \"two-way-datagrams\", Go deeper)": "⚠️",
    "units[0].steps[4].deep[0] (step \"application-level-recovery\", Go deeper)": "✅",
    "units[0].learn.lead[0] (\"lead-1\")": "✅",
    "units[0].learn.lead[1] (\"lead-2\")": "✅",
    "units[0].learn.lead[2] (\"lead-3\")": "⚠️",
    "units[0].learn.terms[0] (\"term-connectionless\")": "✅",
    "units[0].learn.terms[1] (\"term-datagram\")": "✅",
    "units[0].learn.terms[2] (\"term-port\")": "✅",
    "units[0].learn.terms[3] (\"term-no-resend\")": "✅",
    "units[0].learn.terms[4] (\"term-jitter\")": "✅",
    "units[0].learn.terms[5] (\"term-plc\")": "⚠️",
    "units[0].learn.terms[6] (\"term-report\")": "✅",
    "units[0].learn.pattern (\"pattern\")": "✅",
    "units[0].learn.why[0] (\"why-1\")": "⚠️",
    "units[0].learn.why[1] (\"why-2\")": "✅",
    "units[0].learn.why[2] (\"why-3\")": "✅",
    "units[0].learn.why[3] (\"why-4\")": "✅",
    "units[0].learn.deep[0] (\"deep-1\", Learn's Go deeper)": "⚠️",
    "units[0].learn.deep[1] (\"deep-2\", Learn's Go deeper)": "⚠️",
    "units[0].learn.deep[2] (\"deep-4\", Learn's Go deeper)": "✅",
    "units[0].learn.deep[3] (\"deep-5\", Learn's Go deeper)": "✅",
    "units[0].learn.facts[0] (\"fact-1\")": "✅",
    "units[0].learn.facts[1] (\"fact-2\")": "✅",
    "units[0].learn.facts[2] (\"fact-3\")": "✅",
    "units[0].learn.facts[3] (\"fact-4\")": "✅",
    "units[0].learn.facts[4] (\"fact-5\")": "✅",
    "units[0].learn.facts[5] (\"fact-6\")": "✅",
    "units[0].learn.facts[6] (\"fact-7\")": "✅",
    "units[0].learn.facts[7] (\"fact-8\")": "⚠️",
    "units[0].learn.facts[8] (\"fact-9\")": "⚠️",
    "units[0].practice[0].options[0] (question \"lost-packet\")": "✅",
    "units[0].practice[0].options[1] (question \"lost-packet\")": "✅",
    "units[0].practice[0].options[2] (question \"lost-packet\")": "✅",
    "units[0].practice[1].options[0] (question \"why-udp\")": "⚠️",
    "units[0].practice[1].options[1] (question \"why-udp\")": "✅",
    "units[0].practice[1].options[2] (question \"why-udp\")": "✅",
    "units[0].practice[0].prompt (question \"lost-packet\")": "✅",
    "units[0].practice[1].prompt (question \"why-udp\")": "✅"
  },
  "sources": [
    {
      "id": "cloudflare-network-layers",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "iana-ports",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "itu-g114",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "itu-g711-appi",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-azure-lb",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "microsoft-gdk-udp",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "nist-sp800-77r1",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-1035",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-1122",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-2131",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-3417",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-3550",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-3551",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-3611",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-4787",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-5681",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-6716",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-7567",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-768",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-791",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8085",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8445",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8834",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-8836",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9000",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9114",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9293",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9308",
      "current": true,
      "checked": "2026-11-11"
    },
    {
      "id": "rfc-9312",
      "current": true,
      "checked": "2026-11-11"
    }
  ],
  "overrides": [],
  "quotes": {
    "checked": "2026-11-11",
    "count": 147,
    "digest": "7fe02f5098ad46380d571c3abb8825f459534e4a826bd89973586c3769b436da",
    "files": {
      "cloudflare-network-layers": "b66e89102182cea951b4e91439e054dda34880bf3915d978eaf26073e838bab4",
      "microsoft-azure-lb": "a2ad084c37b86a5120461307c409e800d900588bfa006e11322f4ff12293eb6a",
      "rfc-768": "7dc8880e1ecef9c3f9da0db4b876a16e96bfa4f0953cc9d977d414f8f680c2f0",
      "rfc-3550": "4c210e9434b5b4c029e8536ad8991f3709bc3cbfa0999e951bcb4c2143c539e8",
      "rfc-3551": "0b1a7fb6582f0e7ab6493f16d897009f0898600e7a9bcc1ee0d155a1c8157e56",
      "itu-g114": "f7d4ae1fa6cc519010cb24985c52de6684de079a0ee7b2e7e4d576ab960c9c62",
      "rfc-3611": "a365d4b99a1993b43bd0cefa68ef1b57a27ec716c752e3361cef21415de89f2d",
      "rfc-8085": "9fc8fa172098ef296040c6e3708d56ff5941fdeda3faf4071c58c68059629f3c",
      "rfc-1122": "9f526e6bebc868324fedb90aebbcf6e5b15c53fd373ca5d5ce1c2cdcd264e04f",
      "rfc-4787": "5db82ec5f0d6b9b0fc0a37ce7d5b40592e4e6f41562ba8fbc55f1daa52648405",
      "rfc-8445": "60bb913e8c8b2007f284105eef2faa2ea7e359dd4b73d7992557b3b11180065e",
      "itu-g711-appi": "c88180f9fc1cdf5a82538e2a9b864928ca96b5c1cc27b10661f8ddd08b165844",
      "rfc-6716": "41caac5240a4a22661efd0031d5b7aee48f3c0bde3b2cdcee8165932e485f98c",
      "rfc-9000": "f88aae47f8b18e102024916e975e919201d8dde689cba79b01079eaedd402e22",
      "rfc-9293": "6d9ac8be4b0286f8c3d337addf442b2eb6a9b14e1366594ea7fbc273f93dc2d9",
      "rfc-7567": "7bf81566611e1d8c8c917d9fa3c8771f50555514a1b9d8320df8428b70f6a621",
      "rfc-5681": "a2d99a2421d5c57b248394f26ba44fc364aa546680fbf10ff0aa7034dad8b87d",
      "nist-sp800-77r1": "2343fd37c8cf23a8bfb594b481a867298f4177adf3146228bd365d2b9affe30e",
      "rfc-791": "6cfb387fcecfc1b72f2f69343c5b6951b5d263d708162e2b5c66ab8f394f6265",
      "rfc-8836": "b124b69c5f067cabac4beac23c55dc1cae15be94b802a66f1649db64b01056a6",
      "rfc-8834": "8bc95ea7e25f350adb265457b4c700357a47285b8d2931654b72db8cbc78b630",
      "rfc-1035": "d14ae809fc9b41bbcae26bb38c937c9515808b944f3252b00de9fe0e95f4fdfb",
      "rfc-9114": "6b84555c88eeebcf5d2b2e1d9d7b58630abc97ab877b2cf62dee4cd635db34e4",
      "rfc-2131": "a043b705785b81762505ded4cf71d61392b2b1da2b4ce1e32c13bc984de5f4a5",
      "iana-ports": "6f1b1cfc45642ea7c33da93581249779ea0814339a0389d9cb49b69b8ae247e3",
      "rfc-3417": "874be9c26a2ae30bb1ae17405ca53fa493dc40a0a8bda98fa659b82985e943c0",
      "rfc-9308": "ebe07ab0c29b58548a43c81f7efdb455661d7282a7cc114c11023522e5142946",
      "rfc-9312": "032e6c950933ebe8c87438839afd9b7043df00e51543a30773d47daa8672e164",
      "microsoft-gdk-udp": "6d1cf1fa6cb4296c81caea64870714de9ee561c2334af5878045c6847732322e"
    }
  }
}
```

# Fact-check: what-is-udp

Checked 2026-11-11 against every cited source, fetched in this run from the publisher's own site. RFCs were read in their `.txt` form from rfc-editor.org and their status read from each RFC's info page; the IANA registry was read in its XML form; the ITU-T and NIST PDFs were read and saved with `pdftotext -raw`; the Cloudflare and Microsoft pages were saved as HTML.

Rule applied throughout: every claim in a part needs two independent documents that each state it, or a citation marked "(defining standard)" that states it. Two sections of one RFC count as one document.

## Claims

### units[0].osi — ✅

Layers: [4].

- `cloudflare-network-layers` §Network Layers
  > Below is a list of the different layers that makes up the open systems interconnection (OSI) model
- `cloudflare-network-layers` §Network Layers
  > 4 Transport layer TCP/UDP
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Use Azure Load Balancer when you need to distribute Layer 4 TCP or UDP traffic across VMs or virtual machine scale sets.
- Note: Cloudflare puts UDP in the OSI transport layer, layer 4, directly. Microsoft calls UDP traffic Layer 4 traffic and says the load balancer that handles it works at OSI layer 4. Two vendors, two independent documents. Both pages are live and current (Cloudflare's was updated in October 2026; Azure's notes the Basic SKU's 2025 retirement).

### units[0].steps[0].deep[0] (step "connectionless-send", Go deeper) — ⚠️

"The UDP header is four fields of 2 bytes each: source port, destination port, length and checksum. There’s no sequence number, no ACK and no window. The call app can add a small header of its own inside, such as RTP, with a sequence number and a timestamp, so the receiver can put packets in order and play them on time."

- `rfc-768` §Fields
  > Length is the length in octets of this user datagram including this header and the data. (This means the minimum value of the length is eight.)
- `rfc-768` §Fields
  > Checksum is the 16-bit one's complement of the one's complement sum
- Note: RFC 768 is the defining standard for the UDP header: its four fields, its 8-byte size and, by their absence, that it carries no sequence, acknowledgment or window field. Not obsoleted; updated only by RFC 9868 (UDP options), which keeps the 8-byte header and adds options after the payload.
- `rfc-3550` §5.1
  > sequence number: 16 bits The sequence number increments by one for each RTP data packet sent, and may be used by the receiver to detect packet loss and to restore packet sequence.
- `rfc-3550` §2.1
  > Each chunk of audio data is preceded by an RTP header; RTP header and data are in turn contained in a UDP packet.
- `rfc-3550` §2.1
  > the RTP header contains timing information and a sequence number that allow the receivers to reconstruct the timing produced by the source
- `rfc-3551` §4.1
  > the RTP header carries both a sequence number and a timestamp to allow a receiver to distinguish between lost packets and periods of time when no data was transmitted.
- Note: Currency: RFC 3550 and RFC 3551 are not obsoleted; their updates (RFC 5761, 7160, 8860 and others) do not change the sequence number or timestamp.
- Note: What is wrong: that the sequence number and timestamp let the receiver put packets in order and play them on time is stated only by RFC 3550 (two sections of one document). RFC 3551 §4.1 says the pair lets a receiver tell loss from silence, not order or timing, and no RFC 3550 citation on this part carries the defining-standard marker.

### units[0].steps[1].deep[0] (step "datagram-stream", Go deeper) — ⚠️

"Fifty packets a second is what a packet every 20 ms comes to. Real-time apps care most about latency, and about jitter, how much the delay varies. The receiver keeps a jitter buffer for uneven arrivals, and discards a packet that arrives too late for it."

- `itu-g114` §Annex A.3
  > Packetized transmission systems exhibit variable delay (jitter) in packet delivery time.
- `itu-g114` §Annex A.3
  > This is typically achieved by collecting packets in a de-jitter buffer at the receive side.
- `itu-g114` §Annex A.3
  > then this packet "arrives too late" with respect to its intended play-out time, and will be discarded.
- `rfc-3611` §4.7
  > The block reports separately on packets lost on the IP channel, and those that have been received but then discarded by the receiving jitter buffer.
- `rfc-3550` §6.4.1
  > The interarrival jitter J is defined to be the mean deviation (smoothed absolute value) of the difference D in packet spacing at the receiver compared to the sender for a pair of packets.
- Note: RFC 3550 is the defining standard for RTP's interarrival jitter. ITU-T G.114 (05/2003) is listed by ITU-T as in force; RFC 3611 is not obsoleted or updated.
- Note: What is wrong: no cited section ranks latency and jitter as what real-time apps "care most about". G.114 and RFC 3611 treat delay, jitter and loss (RFC 3611 gives losses and discards equal weight) without ranking them. The jitter definition, the receiver's buffer, the discard of late packets and the arithmetic (1000 ÷ 20 = 50) all hold.

### units[0].steps[2].deep[0] (step "packet-loss-no-retransmission", Go deeper) — ✅

"UDP has no retransmission at all. A call app can see a loss as a gap in its sequence numbers, and in RTCP reports. UDP also has no congestion control, so an app that doesn’t use a congestion-controlled transport has to control its own sending rate."

- `rfc-8085` §3.3
  > Application designers are generally aware that UDP does not provide any reliability, e.g., it does not retransmit any lost packets.
- `rfc-1122` §4.1.1
  > Therefore, an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery, packetization and reassembly, flow control, congestion avoidance, etc., when these are required.
- `rfc-3550` §2.1
  > The sequence number can also be used by the receiver to estimate how many packets are being lost.
- `rfc-3551` §4.1
  > the RTP header carries both a sequence number and a timestamp to allow a receiver to distinguish between lost packets and periods of time when no data was transmitted.
- `rfc-3550` §6.4.1
  > fraction lost: 8 bits The fraction of RTP data packets from source SSRC_n lost since the previous SR or RR packet was sent
- `rfc-8085` §1
  > A second unique characteristic of UDP is that it provides no inherent congestion control mechanisms.
- `rfc-8085` §3.1
  > If an application or protocol chooses not to use a congestion-controlled transport protocol, it SHOULD control the rate at which it sends UDP datagrams to a destination host
- Note: RFC 3550 is the defining standard for the RTCP report's loss fields. RFC 8085 (BCP 145) is not obsoleted; its one update (RFC 8899) is about path MTU discovery. RFC 1122 is not obsoleted; none of its updates touches §4.1.1.

### units[0].steps[3].deep[0] (step "two-way-datagrams", Go deeper) — ⚠️

"The server sends from the port you sent to (16384) back to the port you sent from (50900). Your home router remembers that pair for a while, which is how replies get back in through NAT. The standard says at least two minutes, but many real devices forget sooner. During silences, a call app may send small keep-alive packets to keep that way open."

- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process, and may be assumed to be the port to which a reply should be addressed in the absence of any other information.
- Note: RFC 768 is the defining standard for UDP's port fields, including the source port as the reply port.
- `rfc-8085` §3.5
  > Per-flow state is typically created when the first packet crosses from the interior to the exterior, and while the state is present, NATs and firewalls will forward return traffic.
- `rfc-4787` §4.3
  > The mapping timer is defined as the time a mapping will stay active without packets traversing the NAT.
- `rfc-4787` §4.3
  > REQ-5: A NAT UDP mapping timer MUST NOT expire in less than two minutes, unless REQ-5a applies.
- `rfc-8085` §3.5
  > NATs require a state timeout of 2 minutes or longer [RFC4787]. However, empirical evidence suggests that a significant fraction of currently deployed middleboxes unfortunately use shorter timeouts.
- `rfc-8085` §3.5
  > For some applications, such as media transmissions, this re-synchronization is highly undesirable, because it can cause user-perceivable playback artifacts. Such specialized applications MAY send periodic keep-alive messages to attempt to refresh middlebox state
- `rfc-8445` §11
  > An agent MUST send a keepalive on each candidate pair that is used for sending data if no packet has been sent on that pair in the last Tr seconds.
- Note: Currency: RFC 4787 (BCP 127) is not obsoleted; its updates, RFC 6888 and RFC 7857, leave REQ-5's two-minute floor in place. RFC 8445 is not obsoleted; its update RFC 8863 does not change keepalives.
- Note: What is wrong: "many real devices forget sooner" is stated only by RFC 8085. RFC 4787 §4.3 says timer values vary widely but does not say deployed NATs use less than two minutes, and RFC 8445 §11 does not speak to it. The rest holds: the reply port, the NAT's memory of the flow, the two-minute floor (REQ-5a's narrow exception for well-known destination ports is dropped, as RFC 8085 also drops it, which is an acceptable simplification) and keep-alives in silences.

### units[0].steps[4].deep[0] (step "application-level-recovery", Go deeper) — ✅

"Filling a gap is packet loss concealment. RTCP receiver reports carry the fraction of packets lost and the jitter, and the sender can work out the round-trip time from them. The sender may change its transmissions based on them, for example its encoding. Some apps want full reliability over UDP and build it themselves: QUIC has its own acknowledgments and resending."

- `itu-g711-appi` §I.1
  > The objective of PLC is to generate a synthetic speech signal to cover missing data (erasures) in a received bit stream.
- `rfc-6716` §4.4
  > In CELT mode, the PLC finds a periodicity in the decoded signal and repeats the windowed waveform using the pitch offset.
- `rfc-3550` §6.4.1
  > Each reception report block conveys statistics on the reception of RTP packets from a single synchronization source.
- `rfc-3550` §6.4.1
  > interarrival jitter: 32 bits An estimate of the statistical variance of the RTP data packet interarrival time
- `rfc-3550` §6.4.1
  > Source SSRC_n can compute the round-trip propagation delay to SSRC_r by recording the time A when this reception report block is received.
- `rfc-3550` §6
  > The feedback may be directly useful for control of adaptive encodings [18,19]
- `rfc-3550` §6
  > The sender may modify its transmissions based on the feedback
- `rfc-9000` §13
  > When a packet loss occurs, only streams with data in that packet are blocked waiting for a retransmission to be received
- `rfc-9000` §13
  > Endpoints acknowledge all packets they receive and process.
- Note: RFC 3550 is the defining standard for RTCP and its reports (§6, including §6.4.1 and §6.4.4, which holds the second §6 passage; the receiver report in §6.4.2 carries the same report blocks). RFC 9000 is the defining standard for QUIC, which its title describes as a transport built on UDP; §13 covers its acknowledgments (§13.2) and retransmission (§13.3). ITU-T G.711 Appendix I (09/99) is listed by ITU-T as in force; RFC 6716 is not obsoleted (updated by RFC 8251, which does not touch PLC); RFC 9000 has no updates.

### units[0].learn.lead[0] ("lead-1") — ✅

"UDP sent your voice with no setup first, no guarantee that it arrived, and no promise to keep the packets in order."

- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism. The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed. Applications requiring ordered reliable delivery of streams of data should use the Transmission Control Protocol (TCP) [2].
- Note: RFC 768 is the defining standard for UDP and its procedure, which has no connection setup.
- `rfc-8085` §1
  > UDP communication consequently does not incur connection establishment and teardown overheads
- `rfc-8085` §3.3
  > Applications that require ordered delivery MUST reestablish datagram ordering themselves.

### units[0].learn.lead[1] ("lead-2") — ✅

"When a packet was lost, perhaps dropped by a busy router, UDP did not send it again, as TCP would have. The app, not UDP, decided what to do."

- `rfc-8085` §3.3
  > Application designers are generally aware that UDP does not provide any reliability, e.g., it does not retransmit any lost packets.
- `rfc-1122` §4.1.1
  > Therefore, an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery
- `rfc-9293` §3.8.1
  > Because of the variability of the networks that compose an internetwork system and the wide range of uses of TCP connections, the retransmission timeout (RTO) must be dynamically determined.
- `rfc-7567` §2
  > accept packets for the queue until the maximum length is reached, then reject (drop) subsequent incoming packets until the queue decreases
- `rfc-5681` §3
  > Also, note that the algorithms specified in this document work in terms of using loss as the signal of congestion.
- Note: Currency: RFC 9293 (STD 7) has no updates; RFC 7567 (BCP 197) is not obsoleted or updated; RFC 5681 is not obsoleted (updated by RFC 9438, CUBIC, which keeps loss as a congestion signal).

### units[0].learn.lead[2] ("lead-3") — ⚠️

"A call app sends its sound in small chunks, say 20 milliseconds each, one chunk to a packet. It can add a small header of its own, such as RTP, with a sequence number and a timestamp, so the receiver can spot gaps, put packets in order and play them on time."

- `rfc-3550` §2.1
  > The audio conferencing application used by each conference participant sends audio data in small chunks of, say, 20 ms duration. Each chunk of audio data is preceded by an RTP header; RTP header and data are in turn contained in a UDP packet.
- `rfc-3551` §4.2
  > For packetized audio, the default packetization interval SHOULD have a duration of 20 ms or one frame, whichever is longer
- `rfc-3550` §1
  > Those services include payload type identification, sequence numbering, timestamping and delivery monitoring.
- `rfc-3550` §1
  > The sequence numbers included in RTP allow the receiver to reconstruct the sender's packet sequence
- `rfc-3550` §1
  > will often be integrated into the application processing rather than being implemented as a separate layer.
- `rfc-3551` §4.1
  > the RTP header carries both a sequence number and a timestamp to allow a receiver to distinguish between lost packets and periods of time when no data was transmitted.
- Note: Currency: RFC 3550 and RFC 3551 are not obsoleted.
- Note: What is wrong: "put packets in order and play them on time" is stated only by RFC 3550 (§1 and §2.1, one document), and no RFC 3550 citation on this part is marked as a defining standard. RFC 3551 §4.1 and §4.2 confirm the 20 ms chunks, the sequence number and timestamp, and spotting gaps, but not ordering or playout timing.

### units[0].learn.terms[0] ("term-connectionless") — ✅

Connectionless: "Sending with no setup first".

- `rfc-8085` §1
  > Compared to other transport protocols, UDP and its UDP-Lite variant [RFC3828] are unique in that they do not establish end-to-end connections between communicating end systems.
- `nist-sp800-77r1` §2.1
  > the User Datagram Protocol (UDP), which provides unreliable connectionless communications
- Note: NIST SP 800-77 Rev. 1 (June 2020) is final on CSRC, not withdrawn and not superseded.

### units[0].learn.terms[1] ("term-datagram") — ✅

Datagram: "One message that travels on its own".

- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism.
- Note: RFC 768 is the defining standard for the user datagram, UDP's message unit.
- `rfc-791` §1.4
  > The internet protocol treats each internet datagram as an independent entity unrelated to any other internet datagram.
- Note: RFC 791 is not obsoleted; its updates (RFC 1349, 2474, 6864) do not change this.

### units[0].learn.terms[2] ("term-port") — ✅

Port: "Which app on the computer it’s for".

- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process
- Note: RFC 768 is the defining standard for UDP's port fields.
- `rfc-1122` §4.1.1
  > the only services it provides over IP are checksumming of data and multiplexing by port number.

### units[0].learn.terms[3] ("term-no-resend") — ✅

No retransmission: "Lost, and not sent again".

- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
- `rfc-1122` §4.1.1
  > an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery

### units[0].learn.terms[4] ("term-jitter") — ✅

Jitter: "Delay that keeps changing".

- `rfc-3550` §6.4.1
  > An estimate of the statistical variance of the RTP data packet interarrival time, measured in timestamp units and expressed as an unsigned integer.
- Note: RFC 3550 is the defining standard for RTP's interarrival jitter.
- `itu-g114` §Annex A.3
  > Packetized transmission systems exhibit variable delay (jitter) in packet delivery time.

### units[0].learn.terms[5] ("term-plc") — ⚠️

Loss concealment: "Covering a gap with sound made from what came before, blended into the next packet, so it may not be heard".

- `itu-g711-appi` §I.1
  > Since speech signals are often locally stationary, it is possible to use the signals’ past history to generate a reasonable approximation to the missing segment.
- `itu-g711-appi` §I.1
  > If the erasures are not too long, and the erasure does not land in a region where the signal is rapidly changing, the erasures may be inaudible after concealment.
- `itu-g711-appi` §I.2.7
  > the synthesized speech from the pitch buffer is continued beyond the end of the erasure, and then mixed with the real signal using an OLA.
- `rfc-6716` §4.4
  > The windowed waveform is overlapped in such a way as to preserve the time-domain aliasing cancellation with the previous frame and the next frame.
- `rfc-6716` §4.4
  > In SILK mode, the PLC uses LPC extrapolation from the previous frame
- Note: Currency: G.711 Appendix I (09/99) is in force at ITU-T; RFC 6716 is not obsoleted.
- Note: What is wrong: "so it may not be heard" is stated only by G.711 Appendix I (two sections of one document), with its conditions (short erasures, not where the signal changes fast); RFC 6716 §4.4 says nothing about audibility, and neither citation is marked as a defining standard. Sound made from what came before, and the blend into the next frame, are confirmed by both.

### units[0].learn.terms[6] ("term-report") — ✅

Report (RTCP): "The app’s own note about how it went, which the sender can use to adapt its encoding".

- `rfc-3550` §6
  > The primary function is to provide feedback on the quality of the data distribution.
- `rfc-3550` §6
  > The feedback may be directly useful for control of adaptive encodings [18,19]
- `rfc-3550` §6.4.1
  > Each reception report block conveys statistics on the reception of RTP packets from a single synchronization source.
- Note: RFC 3550 is the defining standard for RTCP and its reports.

### units[0].learn.pattern ("pattern") — ✅

Names: Connectionless Send, Datagram Stream, No Retransmission, App Recovery. Note: "UDP only sends. Order, gaps and speed are all up to the app."

- `rfc-1122` §4.1.1
  > UDP is almost a null protocol; the only services it provides over IP are checksumming of data and multiplexing by port number. Therefore, an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled
- `rfc-8085` §3.3
  > Applications that require ordered delivery MUST reestablish datagram ordering themselves.
- `rfc-8085` §3.3
  > Applications that do require reliable message delivery MUST implement an appropriate mechanism themselves.
- `rfc-8085` §1
  > Because UDP itself provides no congestion control mechanisms, it is up to the applications that use UDP for Internet communication to employ suitable mechanisms to prevent congestion collapse
- Note: RFC 1122 puts every end-to-end problem a connection-oriented protocol would handle (its list is given as examples, not a closed set) on the application; RFC 8085 names ordering, reliability and sending rate in turn. The step names are labels and make no claim.

### units[0].learn.why[0] ("why-1") — ⚠️

"In a call or a live video, each bit of sound or picture has its moment to be played. A packet that arrives after its moment is thrown away, just as if it had been lost, so resending it rarely helps. Late is as bad as lost."

- `itu-g114` §Annex A.3
  > then this packet "arrives too late" with respect to its intended play-out time, and will be discarded. Consequently, the speech carried in this packet is lost for the decoding process.
- `rfc-8836` §1
  > since the data is generated in real time, sending "future" data is impossible, and since it's consumed in real time, data delivered late is commonly useless.
- `rfc-8834` §6.1
  > Retransmission needs to be used with care in interactive real-time applications to ensure that the retransmitted packet arrives in time to be useful, but it can be effective in environments with relatively low network RTT.
- Note: Currency: RFC 8836 (Informational) and RFC 8834 (Standards Track) are not obsoleted or updated.
- Note: What is wrong: "resending it rarely helps" is overstated. RFC 8834 §6.1 says retransmission must be used with care but can be effective where the round-trip time is low, and the same section requires WebRTC receivers to support RTP retransmission; no cited source says it rarely helps, least of all for live video. Each moment having its playout time, late packets being discarded like lost ones, and "late is as bad as lost" are confirmed by G.114 and RFC 8836.

### units[0].learn.why[1] ("why-2") — ✅

"A quick lookup gains in another way: UDP has no setup to wait for. It adds almost nothing on top of IP, so it can be very efficient, and each app decides how much checking it needs."

- `rfc-8085` §1
  > UDP communication consequently does not incur connection establishment and teardown overheads, and there is minimal associated end-system state. Because of these characteristics, UDP can offer a very efficient communication transport to some applications.
- `rfc-1122` §4.1.1
  > UDP is almost a null protocol; the only services it provides over IP are checksumming of data and multiplexing by port number.
- `rfc-1122` §4.1.1
  > an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery, packetization and reassembly, flow control, congestion avoidance, etc., when these are required.
- `rfc-1035` §4.2.1
  > UDP is not acceptable for zone transfers, but is the recommended method for standard queries in the Internet. Queries sent using UDP may be lost, and hence a retransmission strategy is required.
- Note: RFC 1122 sets UDP against a connection-oriented protocol and calls it almost null over IP, which confirms both the missing setup and the low overhead alongside RFC 8085; RFC 1035 shows a lookup protocol choosing its own retransmission. RFC 1035 is not obsoleted; its many updates leave UDP as the method for standard queries.

### units[0].learn.why[2] ("why-3") — ✅

"A call app also keeps a jitter buffer at the receiver. A packet that arrives too late for its place in the buffer is discarded."

- `itu-g114` §Annex A.3
  > If the delivery time of a packet exceeds the length of the receive buffer, then this packet "arrives too late" with respect to its intended play-out time, and will be discarded.
- `rfc-3611` §4.7
  > The block reports separately on packets lost on the IP channel, and those that have been received but then discarded by the receiving jitter buffer.
- `rfc-3550` §6.4.1
  > The interarrival jitter J is defined to be the mean deviation (smoothed absolute value) of the difference D in packet spacing at the receiver compared to the sender for a pair of packets.

### units[0].learn.why[3] ("why-4") — ✅

"TCP delivers bytes in order, so when one packet is lost, the data behind it waits until it is sent again. UDP holds nothing back: packet 6 reaches the app as it arrives."

- `rfc-9293` §2.2
  > TCP provides a reliable, in-order, byte-stream service to applications.
- `rfc-9293` §2.2
  > TCP reliability consists of detecting packet losses (via sequence numbers) and errors (via per-segment checksums), as well as correction via retransmission.
- `rfc-9114` §1.1
  > a lost or reordered packet causes all active transactions to experience a stall regardless of whether that transaction was directly impacted by the lost packet.
- `rfc-8085` §3.3
  > This can cause reordering, where UDP datagrams arrive at the receiver in an order different from the transmission order.
- `rfc-768` §Introduction
  > Applications requiring ordered reliable delivery of streams of data should use the Transmission Control Protocol (TCP) [2].
- Note: RFC 768 is the defining standard for UDP, whose procedure has no ordering or holding back. RFC 9114 is not obsoleted or updated.

### units[0].learn.deep[0] ("deep-1", Learn's Go deeper) — ⚠️

"The UDP header is four 2-byte fields: source port, destination port, length and checksum. TCP’s header also has sequence and acknowledgment numbers and a window; UDP has none."

- `rfc-768` §Fields
  > Length is the length in octets of this user datagram including this header and the data. (This means the minimum value of the length is eight.)
- Note: RFC 768 is the defining standard for the UDP header.
- `rfc-9293` §3.1
  > Sequence Number: 32 bits The sequence number of the first data octet in this segment
- `rfc-9293` §3.1
  > Window: 16 bits The number of data octets beginning with the one indicated in the acknowledgment field that the sender of this segment is willing to accept.
- Note: What is wrong: what TCP's header holds is stated only by RFC 9293, and that citation is not marked as a defining standard, so the TCP half of the part has one source. RFC 9293 is in fact TCP's current defining standard; the UDP half is confirmed.

### units[0].learn.deep[1] ("deep-2", Learn's Go deeper) — ⚠️

"UDP can send one message to many machines (broadcast and multicast), which TCP can’t; DHCP’s first message is a broadcast."

- `rfc-1122` §4.1.1
  > UDP is used by applications that do not require the level of service of TCP or that wish to use communications services (e.g., multicast or broadcast delivery) not available from TCP.
- `rfc-8085` §4
  > Multicast and broadcast transmission [RFC1112] usually employ the UDP transport protocol, although they may be used with other transport protocols (e.g., UDP-Lite).
- `rfc-2131` §3.1
  > 1. The client broadcasts a DHCPDISCOVER message on its local physical subnet.
- `rfc-2131` §4.1
  > DHCP uses UDP as its transport protocol.
- Note: RFC 2131 is the defining standard for DHCP's message exchange; it is not obsoleted (updated by RFC 3396, 4361, 5494, 6842, none of which changes the broadcast DHCPDISCOVER).
- Note: What is wrong: "which TCP can't" is stated only by RFC 1122. RFC 8085 §4 says multicast and broadcast usually use UDP and may use other transports, but does not say TCP cannot carry them. UDP sending to many machines and DHCP's broadcast first message are confirmed.

### units[0].learn.deep[2] ("deep-4", Learn's Go deeper) — ✅

"Some apps build reliability over UDP themselves: QUIC has its own acknowledgments and resending."

- `rfc-9000` §13
  > Endpoints acknowledge all packets they receive and process.
- `rfc-9000` §13
  > New frames and packets are used to carry information that is determined to have been lost.
- Note: RFC 9000 is the defining standard for QUIC, a UDP-based transport; §13 holds its acknowledgment (§13.2) and retransmission (§13.3) rules.
- `rfc-8085` §3.3
  > Applications that do require reliable message delivery MUST implement an appropriate mechanism themselves.

### units[0].learn.deep[3] ("deep-5", Learn's Go deeper) — ✅

"In a G.711 call, 8,000 one-byte samples a second make 160 bytes in 20 ms; the 12-byte RTP header makes each packet 172 bytes, before the UDP header."

- `rfc-3551` §4.5.14
  > PCMA and PCMU are specified in ITU-T Recommendation G.711. Audio data is encoded as eight bits per sample, after logarithmic scaling.
- `rfc-3551` §4.5
  > selected RTP timestamp clock rate, which is usually the same as the sampling rate for audio.
- `rfc-3551` §6
  > 0 PCMU A 8,000 1
- `rfc-3550` §5.1
  > The first twelve octets are present in every RTP packet, while the list of CSRC identifiers is present only when inserted by a mixer.
- Note: RFC 3551 is the defining standard for the PCMU and PCMA payloads (8-bit G.711 samples, the 8,000 Hz clock of static payload types 0 and 8, and the 20 ms default packet in Table 1 of §4.5). RFC 3550 is the defining standard for the 12-byte fixed RTP header. 8,000 × 0.020 s = 160 bytes; 160 + 12 = 172 bytes, with no CSRC list.

### units[0].learn.facts[0] ("fact-1") — ✅

Header: 8 bytes.

- `rfc-768` §Fields
  > (This means the minimum value of the length is eight.)
- Note: RFC 768 is the defining standard for the UDP header, whose length field counts the header, so a datagram with no data is the 8-byte header alone.

### units[0].learn.facts[1] ("fact-2") — ✅

Gives: ports and a checksum, nothing more.

- `rfc-1122` §4.1.1
  > UDP is almost a null protocol; the only services it provides over IP are checksumming of data and multiplexing by port number.
- `rfc-768` §Fields
  > Source Port is an optional field, when meaningful, it indicates the port of the sending process
- Note: RFC 768 is the defining standard for UDP's fields: ports, length and checksum.

### units[0].learn.facts[2] ("fact-3") — ✅

Ports: 53 DNS, 67/68 DHCP, 123 NTP, 161 SNMP, 443 HTTP/3 (over QUIC).

- `iana-ports` §Registry
  > Domain Name Server
- `iana-ports` §Registry
  > Bootstrap Protocol Server
- `iana-ports` §Registry
  > Network Time Protocol
- Note: The IANA Service Name and Transport Protocol Port Number Registry is the defining registry for port assignments. Read in its live XML form (updated 2026-11-10): udp 53 is domain, udp 67 bootps and udp 68 bootpc, udp 123 ntp, udp 161 snmp, udp 443 https.
- `rfc-1035` §4.2.1
  > Messages sent using UDP user server port 53 (decimal).
- `rfc-2131` §4.1
  > DHCP messages from a client to a server are sent to the 'DHCP server' port (67), and DHCP messages from a server to a client are sent to the 'DHCP client' port (68).
- `rfc-3417` §3.2
  > It is suggested that administrators configure their SNMP entities supporting command responder applications to listen on UDP port 161.
- `rfc-9308` §8
  > For example, the default port for HTTP/3 [QUIC-HTTP] is UDP port 443, analogous to HTTP/1.1 or HTTP/2 over TLS over TCP.
- `rfc-9312` §3.1
  > HTTP/3 uses UDP port 443 by convention but various methods can be used to specify alternate port numbers.
- Note: Currency: RFC 3417 (STD 62) is not obsoleted; RFC 9308 and RFC 9312 are current Informational RFCs with no updates.

### units[0].learn.facts[3] ("fact-4") — ✅

Versus TCP: less setup, but no guarantee.

- `rfc-8085` §1
  > UDP communication consequently does not incur connection establishment and teardown overheads
- `rfc-768` §Introduction
  > The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed. Applications requiring ordered reliable delivery of streams of data should use the Transmission Control Protocol (TCP) [2].
- Note: RFC 768 is the defining standard for UDP and what it does not guarantee.
- `rfc-1122` §4.1.1
  > The User Datagram Protocol UDP [UDP:1] offers only a minimal transport service -- non-guaranteed datagram delivery

### units[0].learn.facts[4] ("fact-5") — ✅

Defined in: RFC 768, User Datagram Protocol.

- `rfc-768` §Introduction
  > This User Datagram Protocol (UDP) is defined to make available a datagram mode of packet-switched computer communication
- Note: RFC 768 is the defining standard for UDP, not obsoleted; RFC 9868 updates it with options and does not replace it.

### units[0].learn.facts[5] ("fact-6") — ✅

Layer: transport, in the internet model.

- `nist-sp800-77r1` §2.1
  > TCP, which provides reliable connection-oriented communications, and the User Datagram Protocol (UDP), which provides unreliable connectionless communications, are commonly used transport layer protocols.
- `rfc-1122` §4.1.1
  > The User Datagram Protocol UDP [UDP:1] offers only a minimal transport service
- Note: RFC 1122 files UDP under its transport protocols (§4); NIST's §2.1 places it in the transport layer of the four-layer IP model.

### units[0].learn.facts[6] ("fact-7") — ✅

OSI layer: 4, transport.

- `cloudflare-network-layers` §Network Layers
  > 4 Transport layer TCP/UDP
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Azure Load Balancer operates at layer 4 of the Open Systems Interconnection (OSI) model.
- `microsoft-azure-lb` §How Azure Load Balancer distributes Layer 4 traffic
  > Use Azure Load Balancer when you need to distribute Layer 4 TCP or UDP traffic across VMs or virtual machine scale sets.

### units[0].learn.facts[7] ("fact-8") — ⚠️

Online games: Xbox multiplayer has used UDP 3074, though the port can be changed.

- `microsoft-gdk-udp` §Preferred local UDP multiplayer port networking APIs
  > All iterations of Xbox consoles have allowed you to use UDP 3074. It's a publicly registered, well-known port for multiplayer network traffic.
- `microsoft-gdk-udp` §Preferred local UDP multiplayer port networking APIs
  > users have been able to manually configure the port to work with their own unique network configurations.
- `iana-ports` §Registry
  > Xbox game port
- Note: The IANA registry is the defining registry for the udp 3074 Xbox assignment. The Microsoft GDK page is live and describes the current GDK.
- Note: What is wrong: "the port can be changed" is stated only by the Microsoft GDK page. The IANA registry confirms the 3074 assignment but says nothing of changing it, and the GDK page is not marked as a defining source.

### units[0].learn.facts[8] ("fact-9") — ⚠️

A router’s memory: a UDP port pair, at least two minutes by the standard, often less.

- `rfc-4787` §4.3
  > REQ-5: A NAT UDP mapping timer MUST NOT expire in less than two minutes, unless REQ-5a applies.
- `rfc-8085` §3.5
  > NATs require a state timeout of 2 minutes or longer [RFC4787]. However, empirical evidence suggests that a significant fraction of currently deployed middleboxes unfortunately use shorter timeouts.
- Note: What is wrong: "often less" rests on RFC 8085 alone; RFC 4787 §4.3 reports wide variation in timer values but not that deployed NATs fall below two minutes. The port-pair mapping and the two-minute floor are confirmed by both (REQ-5a's well-known-port exception is dropped, as RFC 8085 also drops it).

### units[0].practice[0].options[0] (question "lost-packet") — ✅

"Sends it again." (right: false). Feedback: "Not quite. UDP never resends. A late copy would be no use in a live call anyway."

- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
- `rfc-1122` §4.1.1
  > an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled -- e.g., retransmission for reliable delivery
- `itu-g114` §Annex A.3
  > then this packet "arrives too late" with respect to its intended play-out time, and will be discarded.
- `rfc-8836` §1
  > data delivered late is commonly useless.
- `rfc-8834` §6.1
  > to ensure that the retransmitted packet arrives in time to be useful
- Note: The feedback is right for a wrong option. It speaks of a copy that is late, which the sources agree is no use; it does not claim every resent copy is late.

### units[0].practice[0].options[1] (question "lost-packet") — ✅

"Pauses the call until it arrives." (right: false). Feedback: "Not quite. Nothing waits in UDP. Packet 6 carries straight on."

- `rfc-8085` §3.3
  > This can cause reordering, where UDP datagrams arrive at the receiver in an order different from the transmission order.
- `rfc-768` §Introduction
  > This protocol provides a procedure for application programs to send messages to other programs with a minimum of protocol mechanism.
- Note: RFC 768 is the defining standard for UDP, which delivers each datagram on its own and holds none back for another.

### units[0].practice[0].options[2] (question "lost-packet") — ✅

"Nothing. The app copes with the gap." (right: true). Feedback: "Right. UDP doesn’t resend; the call app deals with the gap or adjusts."

- `rfc-8085` §3.3
  > Applications that do require reliable message delivery MUST implement an appropriate mechanism themselves.
- `rfc-1122` §4.1.1
  > Therefore, an application program running over UDP must deal directly with end-to-end communication problems that a connection-oriented protocol would have handled
- `rfc-3550` §6
  > The feedback may be directly useful for control of adaptive encodings [18,19]

### units[0].practice[1].options[0] (question "why-udp") — ⚠️

"Late is as bad as lost, and UDP never waits." (right: true). Feedback: "Yes. A late packet is useless, and UDP has no handshake and no resending to wait for."

- `itu-g114` §Annex A.3
  > Consequently, the speech carried in this packet is lost for the decoding process.
- `rfc-8836` §1
  > data delivered late is commonly useless.
- `rfc-8834` §6.1
  > Retransmission needs to be used with care in interactive real-time applications to ensure that the retransmitted packet arrives in time to be useful
- `rfc-8085` §1
  > UDP communication consequently does not incur connection establishment and teardown overheads
- `rfc-8085` §3.3
  > it does not retransmit any lost packets.
- Note: What is wrong: "no handshake" and "no resending" each rest on RFC 8085 alone (§1 and §3.3 are one document). G.114, RFC 8836 and RFC 8834 confirm that a late packet is useless but say nothing about UDP, and no citation here is marked as a defining standard. "Late is as bad as lost" is confirmed.

### units[0].practice[1].options[1] (question "why-udp") — ✅

"UDP is encrypted." (right: false). Feedback: "Not quite. UDP does not provide communications security. Apps that need it use other protocols."

- `rfc-8085` §6
  > UDP does not provide communications security. Applications that need to protect their communications against eavesdropping, tampering, or message forgery SHOULD employ end-to-end security services provided by other IETF protocols.
- `rfc-1122` §4.1.1
  > UDP is almost a null protocol; the only services it provides over IP are checksumming of data and multiplexing by port number. Therefore, an application program running over UDP must deal directly with end-to-end communication problems

### units[0].practice[1].options[2] (question "why-udp") — ✅

"UDP never loses packets." (right: false). Feedback: "Not quite. UDP does not guarantee delivery, and it doesn’t resend what is lost."

- `rfc-768` §Introduction
  > The protocol is transaction oriented, and delivery and duplicate protection are not guaranteed.
- Note: RFC 768 is the defining standard for UDP and its lack of a delivery guarantee.
- `rfc-8085` §3.3
  > Application designers are generally aware that UDP does not provide any reliability, e.g., it does not retransmit any lost packets.

## Traced, example, analogy and unbacked parts

Traced:

- `backing (the lesson's subtitle and summary)` — ✅
- `units[0].backing (the unit's full name and purpose)` — ✅
- `units[0].scene.backing (the scene)` — ✅
- `units[0].overview.hookBacking (the Overview hook)` — ✅
- `units[0].overview.facts[0] (Overview fact "Used for")` — ✅
- `units[0].overview.facts[1] (Overview fact "Starts with")` — ✅
- `units[0].overview.facts[2] (Overview fact "Promises")` — ✅
- `units[0].overview.facts[3] (Overview fact "Header")` — ✅
- `units[0].overview.facts[4] (Overview fact "OSI layer")` — ✅
- `units[0].steps[0] (step "connectionless-send")` — ✅
- `units[0].steps[0].facts[2] (step "connectionless-send", fact "Handshake")` — ✅
- `units[0].steps[0].facts[3] (step "connectionless-send", fact "Each packet")` — ✅
- `units[0].steps[0].events[0] (event "m1")` — ✅
- `units[0].steps[0].events[1] (event "voice-1")` — ✅
- `units[0].steps[1] (step "datagram-stream")` — ✅ (fifty a second is the same fact as lead-3's one packet every 20 ms)
- `units[0].steps[1].facts[0] (step "datagram-stream", fact "Rate")` — ✅
- `units[0].steps[1].facts[1] (step "datagram-stream", fact "Replies")` — ✅
- `units[0].steps[1].facts[2] (step "datagram-stream", fact "Matters most")` — ⚠️ "Matters most" ranks low delay and steady timing above everything else; why-1 and term-jitter say timing matters but rank nothing, so the ranking goes beyond the parts it traces.
- `units[0].steps[1].facts[3] (step "datagram-stream", fact "Smoothing")` — ✅
- `units[0].steps[1].events[0] (event "m2")` — ✅
- `units[0].steps[1].events[1] (event "voice-2")` — ✅
- `units[0].steps[1].events[2] (event "m3")` — ✅
- `units[0].steps[1].events[3] (event "voice-3")` — ✅
- `units[0].steps[1].events[4] (event "m4")` — ✅
- `units[0].steps[1].events[5] (event "voice-4")` — ✅
- `units[0].steps[2] (step "packet-loss-no-retransmission")` — ⚠️ "By the time a copy arrived, that moment of the call would be long gone" says a resent copy would always be too late; why-1, which it traces, says only that resending rarely helps (itself overstated).
- `units[0].steps[2].facts[0] (step "packet-loss-no-retransmission", fact "Packet 5")` — ✅
- `units[0].steps[2].facts[1] (step "packet-loss-no-retransmission", fact "Packet 6")` — ✅
- `units[0].steps[2].facts[2] (step "packet-loss-no-retransmission", fact "Who notices")` — ✅
- `units[0].steps[2].events[0] (event "m5")` — ✅
- `units[0].steps[2].events[1] (event "voice-5")` — ✅
- `units[0].steps[2].events[2] (event "m6")` — ✅
- `units[0].steps[2].events[3] (event "voice-6")` — ✅
- `units[0].steps[3] (step "two-way-datagrams")` — ✅
- `units[0].steps[3].facts[2] (step "two-way-datagrams", fact "Same rules")` — ✅
- `units[0].steps[3].facts[3] (step "two-way-datagrams", fact "Your router remembers")` — ✅
- `units[0].steps[3].events[0] (event "m7")` — ✅
- `units[0].steps[3].events[1] (event "voice-7")` — ✅
- `units[0].steps[3].events[2] (event "m8")` — ✅
- `units[0].steps[3].events[3] (event "voice-8")` — ✅
- `units[0].steps[3].events[4] (event "m9")` — ✅
- `units[0].steps[3].events[5] (event "voice-9")` — ✅
- `units[0].steps[4] (step "application-level-recovery")` — ✅
- `units[0].steps[4].facts[0] (step "application-level-recovery", fact "Gap filled by")` — ✅
- `units[0].steps[4].facts[1] (step "application-level-recovery", fact "Report")` — ✅
- `units[0].steps[4].facts[2] (step "application-level-recovery", fact "The app’s fix")` — ✅
- `units[0].steps[4].facts[3] (step "application-level-recovery", fact "Reliable over UDP")` — ✅
- `units[0].steps[4].events[0] (event "m10")` — ✅
- `units[0].steps[4].events[1] (event "voice-10")` — ✅
- `units[0].steps[4].events[2] (event "m11")` — ✅
- `units[0].steps[4].events[3] (event "voice-11")` — ✅

Example (RFC 1918 and RFC 5737 addresses; the ports are example values):

- `units[0].overview.facts[5] (Overview fact "This example")` — ✅
- `units[0].steps[0].facts[0] (step "connectionless-send", fact "From")` — ✅
- `units[0].steps[0].facts[1] (step "connectionless-send", fact "To")` — ✅
- `units[0].steps[3].facts[0] (step "two-way-datagrams", fact "From")` — ✅
- `units[0].steps[3].facts[1] (step "two-way-datagrams", fact "To")` — ✅

Analogy:

- `units[0].overview.backing (the Overview description)` — ✅ A walkie-talkie that carries on past a crackle, against a call where you check and repeat, fits no resending versus acknowledgment and retransmission.

Unbacked:

- `title` — ✅
- `units[0].name` — ✅
- `units[0].practice[0].prompt (question "lost-packet")` — ✅
- `units[0].practice[1].prompt (question "why-udp")` — ✅ Its premise, that calls use UDP, matches lead-3 and RFC 3550's RTP over UDP.

## Sources

All checked 2026-11-11.

- `cloudflare-network-layers` — live on developers.cloudflare.com, last updated October 2026; current.
- `iana-ports` — live registry (XML form), updated 2026-11-10; current.
- `itu-g114` — G.114 (05/2003), listed in force by ITU-T; current.
- `itu-g711-appi` — G.711 Appendix I (09/99), listed in force by ITU-T; current.
- `microsoft-azure-lb` — live on learn.microsoft.com, describes the current Standard and Gateway SKUs; current.
- `microsoft-gdk-udp` — live on learn.microsoft.com, describes the current GDK; current.
- `nist-sp800-77r1` — final (June 2020) on CSRC, not withdrawn or superseded; current.
- `rfc-1035` — not obsoleted (many updates; none changes UDP for standard queries on port 53); current.
- `rfc-1122` — not obsoleted (updates do not touch §4.1.1); current.
- `rfc-2131` — not obsoleted (updates do not touch §3.1 or §4.1's ports); current.
- `rfc-3417` — not obsoleted (updated by RFC 4789, 5590); current.
- `rfc-3550` — not obsoleted (updates do not change the cited sections); current.
- `rfc-3551` — not obsoleted (updated by RFC 5761, 7007, 8860); current.
- `rfc-3611` — not obsoleted or updated; current.
- `rfc-4787` — not obsoleted (updated by RFC 6888, 7857, which keep REQ-5); current.
- `rfc-5681` — not obsoleted (updated by RFC 9438); current.
- `rfc-6716` — not obsoleted (updated by RFC 8251); current.
- `rfc-7567` — not obsoleted or updated; current.
- `rfc-768` — not obsoleted (updated by RFC 9868, UDP options, which keeps the 8-byte header); current.
- `rfc-791` — not obsoleted; current.
- `rfc-8085` — not obsoleted (updated by RFC 8899); current.
- `rfc-8445` — not obsoleted (updated by RFC 8863); current.
- `rfc-8834` — not obsoleted or updated; current.
- `rfc-8836` — not obsoleted or updated; current.
- `rfc-9000` — not obsoleted or updated; current.
- `rfc-9114` — not obsoleted or updated; current.
- `rfc-9293` — not obsoleted or updated; current.
- `rfc-9308` — not obsoleted or updated; current.
- `rfc-9312` — not obsoleted or updated; current.

## Limit overrides

None.
