# What is HTTP: every changed sentence

Moving this lesson to the cited shape meant tying each claim to the source section that states it, and changing any sentence a source did not support. The lesson now cites 20 sources (it listed two, RFC 9110 and RFC 9112, before) and passed its fact-check on 2026-11-11. Compared with the lesson as it was before the move (`revamp:src/content/lessons/what-is-http.ts`), it has 41 corrections (35, plus 6 in Practice), 7 removals, 12 additions and 3 rewordings; the last section lists what is word for word as before.

Source names are the ones the lesson's Sources list shows. Section numbers are the RFC's own; "HTML Standard", "URL Standard" and "Fetch Standard" are WHATWG's, cited by the heading's number.

## The changes to look at first

1. **Home's two lead sentences.** Home shows Learn's lead, so both sentences changed there. Before: "A web page is a conversation in plain text. The browser asks for one thing, the server answers with a status and the file, and the browser asks for the next thing." After: "In HTTP/1.1, getting a web page is a conversation in plain text. In HTTP, the browser asks for a page or file, and the server answers with a status and, if it’s 200 OK, the file." (Corrections 22 and 23.)
2. **You type `http://example.net`.** Step 1 used to say you type `example.net` and the browser works out that it means plain HTTP. No standard says so, and the leading browser tries HTTPS first. The reader now types the whole address, and the scene's address bar still shows `example.net`. (Corrections 7 and 8.)
3. **The page is drawn when the stylesheet arrives.** The original drew the page's words as soon as the HTML arrived. The HTML Standard holds drawing back while a stylesheet linked before the body is loading. The "Drawing the page" status and the page's words moved from the HTML's 200 OK to the stylesheet's 200 OK (the HTML's now says "Reading the page"). No step or event was added, removed or reordered. (Corrections 17, 19 and 21.)
4. **"Plain text" is scoped to HTTP/1.1.** HTTP/2 and HTTP/3 send binary frames. The lead, the hook, the step 4 narrative and Learn's why now say HTTP/1.1. What makes anyone on the way able to read it is that plain HTTP isn't encrypted, not that it is text. (Corrections 2, 15, 22 and 30.)

## Corrections

The original said something the sources contradict or do not state, and the lesson now says what they state.

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| 1 | Unit full name | HyperText Transfer Protocol | Hypertext Transfer Protocol | RFC 9110 Abstract, §1.1 spell it so. |
| 2 | Overview hook and lesson summary (first two sentences) | Every web page you’ve ever opened arrived the same way. Your browser asked for it, and a web server sent it back. | Web pages arrive the same basic way: your browser asks for one, and a web server sends it back. | RFC 9111 §4.2 (a fresh saved copy needs no request); RFC 9110 §1.2 (three versions share the meaning). "Every" was too strong. |
| 3 | Overview hook and lesson summary (last sentence) | …and it’s plain text, so you could read it yourself. | …and in HTTP/1.1 it’s plain text, so you could read it yourself. | RFC 9114 §1.1; RFC 9110 §1.2 (HTTP/2 uses binary framing: RFC 9113 §1). |
| 4 | Overview description (last sentence; the description is an analogy) | A page with pictures and styles takes several of these. | A page with pictures and styles is a longer order, with several items. | A factual sentence cannot sit under an analogy; the fact is now Learn's pattern note and "Other files" fact. |
| 5 | Overview fact Used for | web pages, images, and most apps that talk to servers | web pages, and apps that talk to servers | RFC 9110 §1.2, §3.5 (mobile apps among clients); RFC 9114 §1. "Most" and "images" are in no cited source. |
| 6 | Overview fact Rides on | TCP, which rides on IP | TCP, which rides on IP (HTTP/3: QUIC, on UDP) | RFC 9114 §1; RFC 9000 §1. HTTP/3 does not use TCP. |
| 7 | Step 1 subtitle | You type example.net and press Enter | You type http://example.net and press Enter | URL Standard §4.4 puts address-bar conversion out of its scope, so no standard says a typed bare name becomes `http`. |
| 8 | Step 1 narrative | You type example.net and press Enter. … … which page (/, the front page). | You type http://example.net and press Enter. … … which page (/, sent when the URL has no path). | As above; RFC 9112 §3.2.1 ("/" is sent when the path is empty). |
| 9 | Step 1 Go deeper | Before going to the network, the browser checks its cache; a fresh saved copy of the page would mean no request at all. | Before going to the network, the browser can look in its cache first; a fresh saved copy can mean no request at all. | RFC 9110 §7.3.1 ("usually directed there first"); RFC 9111 §4.2. |
| 10 | Step 1 fact Path | /, the front page | /, sent when the URL has no path | RFC 9112 §3.2.1. No source calls the root path the front page. |
| 11 | Step 2 narrative | So it asks the **DNS resolver** | So the laptop asks its **DNS resolver** | RFC 1034 §5.1, §5.3.1: the resolver is the host's; the scene draws the question from the laptop. |
| 12 | Step 2 Go deeper | If the browser or the laptop looked the name up recently, it skips this step and uses the remembered answer. | If the laptop looked the name up recently, its own cache can answer, with no message sent. | RFC 1034 §5.1 (the resolver's cache). No standard describes a browser's own DNS cache. |
| 13 | Step 3 narrative | HTTP sends everything over it. | HTTP sends this page’s messages over it. | RFC 9110 §4.3.2. The lookup used UDP, and HTTP/3 uses QUIC (RFC 9114 §1). |
| 14 | Step 3 Go deeper | The laptop picks a free port of its own (here 50310) | The laptop uses a temporary port of its own (here 50310) | RFC 6335 §6, §8.1.2 (ephemeral ports; software may use any dynamic port). No RFC says "picks a free port". |
| 15 | Step 4 narrative | Now the browser asks for the page, in a few lines of plain text. The first line, **GET /**, means “send me the front page”: … **headers**, short notes such as which site this is for. | Now the browser asks for the page. In HTTP/1.1 that is a few lines of plain text. The first line starts with **GET /**, which means “send me the page at /”: … **headers**, notes such as which site this is for. | RFC 9114 §1.1, RFC 9110 §1.2 (text is HTTP/1.1); RFC 9112 §3 (the first line also carries the version); RFC 9110 §6.3 ("short" is stated nowhere). |
| 16 | Step 4 Go deeper | …and the Host header (Host: example.net) is required, because one server often holds many sites. Other methods: POST sends data, … 1xx still working, 2xx success, 3xx look elsewhere (301, 304), … | …and in HTTP/1.1 the Host header (Host: example.net) is required, because one server can hold many sites. Other methods: POST sends data for the server to process, … 1xx received, still going, 2xx success, 3xx more to do (301 look elsewhere, 304 use your saved copy), … | RFC 9112 §3.2 (required "in all HTTP/1.1 request messages"); RFC 9110 §7.2; §9.3.3; §15 (1xx "received, continuing process"; 3xx "further action needs to be taken"); §15.4.2; §15.4.5 (304 is not a redirect). |
| 17 | Step 4 event 200 OK (HTML), status line | Drawing the page | Reading the page | HTML Standard §4.6.8.23, §3.1.6, §8.1.7.3: a stylesheet linked before the body blocks drawing. The page's words moved to the stylesheet's reply (see 21). |
| 18 | Step 5 subtitle | Draw it, and fetch the rest | Fetch the rest, and draw it | The same: drawing waits for the stylesheet. |
| 19 | Step 5 narrative | The browser reads the HTML and starts drawing the words straight away. Turning HTML into what you see is **rendering**. On the way it finds two more files it needs: a **stylesheet** for the colours and layout, and an **image** for the logo. It fetches each with its own GET over the same connection, and the page fills in as they arrive. | The browser reads the HTML. Turning HTML and its styles into what you see is **rendering**. On the way it finds two more files it needs: a **stylesheet** that says how the page looks, and an **image** for the logo. It fetches each with its own GET, here over the same connection. The page is drawn once the stylesheet arrives. | HTML Standard §4.6.8.23 ("describes how to present the document"), §3.1.6, §8.1.7.3, §15.1; RFC 9112 §9 (a client may use several connections). "Colours and layout" has no single source. |
| 20 | Step 5 Go deeper | Browsers fetch several files at once. HTTP/2 and HTTP/3 let many requests share one connection without waiting in line. | Browsers often fetch several files at once, over more than one connection. HTTP/2 and HTTP/3 let many requests share one connection at the same time. | RFC 9114 §1.1; RFC 9112 §9 ("often", "most clients maintain multiple connections"); RFC 9113 §1 (HTTP/2 does not address TCP's head-of-line blocking); RFC 9114 §6.1. |
| 21 | Step 5 event 200 OK (style.css), status line and page cue | (no status line; the page's words were cued at the HTML's reply) | Drawing the page, with the page's words shown here | The same sources as 17. |
| 22 | Learn lead, first sentence | A web page is a conversation in plain text. | In HTTP/1.1, getting a web page is a conversation in plain text. | RFC 9114 §1.1; RFC 9110 §1.2. A page is not a conversation; getting one is. |
| 23 | Learn lead, second sentence | The browser asks for one thing, the server answers with a status and the file, and the browser asks for the next thing. | In HTTP, the browser asks for a page or file, and the server answers with a status and, if it’s 200 OK, the file. | RFC 9110 §3.4 (every response has a status code), §15.3.1 (the content of a 200 depends on the method). A HEAD or an error returns no file, and no section says a second request follows. |
| 24 | Learn term URL | The address you type | The web address of a page or file | RFC 3986 §1.1.3. Step 1 no longer says everything you type is a URL. |
| 25 | Learn term Path | Which page or file | Which page or file on the site | RFC 3986 §3.3; RFC 9110 §4.2.1. |
| 26 | Learn term Headers | Short notes on a request or a reply | Notes on a request or a reply | RFC 9110 §6.3. "Short" is stated nowhere. |
| 27 | Learn term Rendering | Drawing the page from its HTML | Drawing the page from its HTML and styles | HTML Standard §15.1, §4.6.8.23. |
| 28 | Learn pattern note | Every page you open goes through these five. The HTTP exchange repeats once for every file the page needs. | Opening a page over plain HTTP goes through these five, though a saved copy, a remembered name or an open connection can skip a step. The HTTP exchange repeats for every file the page needs from the server. | RFC 9111 §4.2; RFC 1034 §5.1; RFC 9112 §9.3; RFC 9110 §4.3.2, §7.3.1. |
| 29 | Learn why, first sentence | HTTP is the same for every browser and every website, so any browser can open any site. | HTTP gives every web server the same kind of interface, so a browser can open sites it has never seen. | RFC 9110 §1.1 ("a uniform interface", "general-purpose implementations"). |
| 30 | Learn why, second and third sentences | Because it’s plain text it’s easy to read, and that’s the catch: anyone on the way can read it too. | Because HTTP/1.1 is plain text it’s easy to read, and that’s the catch: plain HTTP isn’t encrypted, so anyone on the way can read it too. | The text is not the cause; the missing encryption is (RFC 9110 §4.3.2, §4.2.2; RFC 9112 §11.4). Text scope: RFC 9114 §1.1; RFC 9110 §1.2. |
| 31 | Learn Go deeper, cookies | Sites remember you with cookies, small values the server asks the browser to send back with every request. | Sites remember you with cookies: names and values the server asks the browser to send back with later requests. | RFC 6265 §1, §3. Cookies are sent back only on matching later requests; "small" is stated nowhere. |
| 32 | Learn fact label | Methods | Some methods | RFC 9110 §9.1 lists eight methods. |
| 33 | Learn fact Status families | 2xx OK, 3xx moved, 4xx request problem, 5xx server problem | 1xx received, still going; 2xx success (200 OK); 3xx more to do (304 Not Modified: use your saved copy); 4xx request problem; 5xx server problem | RFC 9110 §15 (five families), §15.3.1, §15.4.5 (304 is not "moved"). |
| 34 | Learn fact Defined in | RFC 9110 | RFC 9110 (the Hypertext Transfer Protocol’s shared meaning); RFC 9112, RFC 9113 and RFC 9114 (the versions) | RFC 9110 Abstract, §1.2; RFC 9112 §1; RFC 9113 Abstract; RFC 9114 §1.2. |
| 35 | Learn fact label | Versions | Major versions | RFC 9110 §1.2 ("all three major versions"). HTTP/1.0 still exists. |

Practice corrections are counted here too, since the feedback is part of what a reader sees:

| # | Where | Before | After | Source and section |
|---|---|---|---|---|
| P1 | Question 1, option "There’s nothing at that path." | There’s nothing at that path. / Right. 404 means the server is working, but it has no page or file at the path you asked for. | The server found nothing at that path. / Right. 404 means the server answered, but found nothing at that path, or won’t say whether anything is there. | RFC 9110 §15.5.5 ("or is not willing to disclose that one exists"). |
| P2 | Question 1, option "The server is too busy to answer." | Not quite. A busy server answers with a 5xx code, like 503. 404 means there’s nothing at that path. | Not quite. A busy server may answer 503, a 5xx code. 404 means nothing was found at that path. | RFC 9110 §15.6.4 (a server need not use 503 when overloaded). |
| P3 | Question 1, option "The page arrived safely." | The page arrived safely. / Not quite. That’s 200 OK. 404 means there’s nothing at that path. | The page came back fine. / Not quite. That’s 200 OK. 404 means nothing was found at that path. | RFC 9110 §15.3.1, §15.5.5. "Safely" reads as security. |
| P4 | Question 2, option "They arrive inside the HTML." | Not quite. The HTML only names them. The browser has to ask for each one. | Not quite. Here the HTML only names them, so the browser asks for each one. | HTML Standard §4.2.4, §4.8.3, Fetch Standard §2.2.5. A style element can embed CSS (§4.2.6), so it is scoped to this page. |
| P5 | Question 2, option "It sends a separate request for each file." | Yes. One GET per file, usually over the same open connection. | Yes. One GET per file; here they share the open connection. | Fetch Standard §2.2.5; RFC 9112 §9.3, §9. "Usually" is stated nowhere. |
| P6 | Question 2, option "It asks the DNS resolver for them." | Not quite. DNS only gives numbers for names. The files come from the web server, one request each. | Not quite. DNS turns the name into an address; it doesn’t hold the files. They come from the web server, one request each. | RFC 1034 §5.2.1; RFC 1035 §3.2.2 (DNS holds other records too). |

## Removed

Said in the original, gone now.

| # | Where | What was removed | Why |
|---|---|---|---|
| 1 | Overview "Used for" | "images" and "most" | No cited source says HTTP is used for images or for most apps. |
| 2 | Step 1 narrative | "so plain HTTP" after "http" | No source ties the `http` scheme to unencrypted HTTP in those words (RFC 9110 §4.2.1 says http is TCP, port 80). |
| 3 | Step 1 narrative and fact Path, Step 4 narrative, the GET / event | "the front page" | No source calls `/` the front page; the lesson says what RFC 9112 §3.2.1 says ("the page at /", "sent when the URL has no path"). |
| 4 | Step 4 fact Content-Type | ", 18 KB" after text/html | A size is not part of a Content-Type (RFC 9110 §8.3). The 18 KB stays in the log and the table. |
| 5 | The eight messages' sizes in the log (DNS query and answer, SYN, SYN-ACK, ACK, GET /, GET /style.css, GET /logo.png) | 70 B, 86 B, 74 B, 74 B, 66 B, 412 B, 398 B, 402 B; now shown as — | A size reads as a claim about the protocol and no source states it. The three file sizes (18 KB, 6 KB, 9 KB) and all the times stay. |
| 6 | Step 5 narrative | "starts drawing the words straight away" and "the page fills in as they arrive" | HTML Standard §4.6.8.23, §3.1.6: drawing waits for the stylesheet. |
| 7 | Learn why | "next" in "HTTPS, next, fixes that." | The next lesson depends on the track. |

## Added

New statements, terms, facts or sentences, with why each was needed.

| # | Where | What was added | Why it was needed |
|---|---|---|---|
| 1 | Learn fact Used for | web pages, and apps that talk to servers | The Overview fact traces to it (RFC 9110 §1.2, §3.5; RFC 9114 §1). |
| 2 | Learn fact Rides on | TCP, which rides on IP (HTTP/3: QUIC, on UDP) | The Overview fact and the TCP and port parts of every message trace to it (RFC 9112 §9; RFC 9293 §2.2; RFC 9114 §1; RFC 9000 §1). |
| 3 | Learn fact URL parts | scheme, host, port, path, query, fragment | Step 1 traces to it (RFC 3986 §3, §3.2; URL Standard §4.1). |
| 4 | Learn fact A request | a request line (method, target, version), then headers; for a GET sent straight to the server, the target is the path and any query, and / when the URL has no path; HTTP/1.1 requires a Host header, which names the site | Step 4's request line, Host and GET / trace to it (RFC 9112 §3, §3.2, §3.2.1, §2.1; RFC 9110 §7.2). |
| 5 | Learn fact A response | a status line (version, status code and, optionally, a reason such as OK), then headers, then any content | Step 4's answer traces to it (RFC 9112 §4, §2.1; RFC 9110 §6.4). |
| 6 | Learn fact Content-Type | names a file’s media type, such as text/html, text/css or image/png | The table's Type column and the Types facts trace to it (RFC 9110 §8.3; IANA Media Types). |
| 7 | Learn fact DNS resolution | a resolver turns a name into an IP address, which can take from milliseconds to seconds; UDP to port 53 is the recommended way to send a query, such as one for an A record | Step 2 and its events trace to it (RFC 1034 §5.1, §5.2.1; RFC 1035 §3.2.2, §4.2.1; RFC 9499 §6). |
| 8 | Learn fact TCP connection | opened by a handshake of three messages (SYN, SYN-ACK, ACK); HTTP/1.1 keeps it open for more requests by default | Step 3 traces to it (RFC 9293 §3.5, §3.5.1; RFC 9112 §9.3). |
| 9 | Learn fact Other files | a page names more files, such as a stylesheet (how it looks) and images; each one the browser hasn’t saved is fetched with its own GET | Step 5 traces to it (HTML Standard §4.6.8.23, §4.8.3; Fetch Standard §2.2.5; RFC 9110 §9.3.1; RFC 9111 §4.2). |
| 10 | Learn fact OSI layer | 7, application | Backs the OSI fact and badge, from Cloudflare's "7 Application layer: HTTP, DNS" row and Microsoft Azure's Application Gateway page (see Unchanged for the badge itself). |
| 11 | Learn Go deeper | Drawing waits for a stylesheet the page links to before its body begins, if it applies to this screen, until it has loaded or failed, or a timeout passes. | Step 5 and the moved drawing cue trace to it (HTML Standard §4.6.8.23, §3.1.6, §8.1.7.3). |
| 12 | Learn, Sources list | 20 sources instead of two | Every cited claim lists its source at the foot of Learn. |

## Reworded, same meaning

| # | Where | Before | After |
|---|---|---|---|
| 1 | Step 2 fact Takes | about 20 ms | about 20 ms here |
| 2 | Step 1 narrative | It reads what you typed, the **URL**, to work out three things | It reads the **URL** you typed to work out three things |
| 3 | Step 5 narrative (order) | …drawing the words… Turning HTML into what you see is **rendering**. On the way it finds two more files… | The browser reads the HTML. Turning HTML and its styles into what you see is **rendering**. On the way it finds two more files… |

## Unchanged

Word for word as the original: the title ("HTTP"), the purpose ("Asking for web pages"), the level and group; the OSI badge (layer 7, now cited to Cloudflare and Microsoft Azure, since no standard places HTTP in the OSI model); the scene's title, labels (Wants example.net, example.net), table (title, columns, empty text), legend and three parties; all five step titles and the subtitles of steps 2, 3 and 4; step 1's status and idle lines; Overview facts Port, Shape, OSI layer and This example; steps 1 to 5's facts URL, Scheme, Host, Asks, Question, Answer, From, To, Messages, Then, Request line, Host, Status, Requests, Types, Same connection and Unchanged files; all 14 events, in the same order, with their tags, addresses, ports, times, summaries and log lines (apart from the changes listed above); step 3's analogy ("the way you check someone can hear you", "hello, hello back, and OK"); Learn's terms Client, IP address, TCP connection, Method (GET), Status code and HTML; the pattern's five names; Learn's Go deeper on statelessness and on the three versions; both Practice prompts, their ids, the three options of each and the right answers (the first and the second).

## Counts

The counts at the top were made by counting the table rows in each section above (41 = 35 numbered corrections + P1 to P6; 7; 12; 3), and the sources by the lesson's cited list on the claim sheet (20) against the two references of the original.
