import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * HTTP, lesson 1 of How the Internet Works’ 14. You type http://example.net and press Enter: the browser looks the
 * name up, opens a TCP connection to the web server, asks for the front page with GET / and reads it, then fetches
 * its stylesheet and logo over the same connection, and draws the page once the stylesheet has arrived.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols.mjs), changed only where a source does
 * not state them. The addresses, the ports 50310 and 51034, the timings and the sizes are example data (RFC 5737 and
 * RFC 1918 addresses, ephemeral ports, made-up numbers): no source states them, and the scene's events carry them
 * beside the claims they trace to. The analogies (the counter, the line you check) cite nothing.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});

const HTML = 'https://html.spec.whatwg.org/index.html';
/** The HTML standard is one page; a section is cited by the fragment of its heading. */
const html = (section: string, fragment: string, defining = false) =>
  cite('whatwg-html', section, defining ? { url: `${HTML}#${fragment}`, defining: true } : { url: `${HTML}#${fragment}` });
const HTML_LINK_STYLESHEET = html('4.6.8.23', 'link-type-stylesheet');
const HTML_LINK = html('4.2.4', 'the-link-element');
const HTML_IMG = html('4.8.3', 'the-img-element');
const HTML_RENDERING = html('15.1', 'introduction-17', true);

const URL_STANDARD = 'https://url.spec.whatwg.org/index.html';
const FETCH_STANDARD = 'https://fetch.spec.whatwg.org/index.html';
const FETCH_REQUESTS = cite('whatwg-fetch', '2.2.5', { url: `${FETCH_STANDARD}#requests` });
const FETCH_REQUESTS_D = cite('whatwg-fetch', '2.2.5', { url: `${FETCH_STANDARD}#requests`, defining: true });

const IANA_MEDIA = 'https://www.iana.org/assignments/media-types/media-types.xhtml';
const CLOUDFLARE = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const MS_APP_GATEWAY = 'https://learn.microsoft.com/en-us/azure/application-gateway/overview';
/** No standard puts HTTP at an OSI layer (X.200 never names it; RFC 9110 says "application-level"), so the badge rests on two vendors. */
const CLOUDFLARE_L7 = cite('cloudflare-network-layers', 'Network Layers', { url: `${CLOUDFLARE}#:~:text=7%20Application%20layer` });
const MS_L7 = cite('microsoft-app-gateway', 'What is Azure Application Gateway?', {
  url: `${MS_APP_GATEWAY}#:~:text=Application%20Gateway%20operates%20at%20the%20application%20layer`,
});

/** HTTP/1.1 is plain text: RFC 9114 and RFC 9110 each say so, so the claim rests on two documents. */
const PLAIN_TEXT = [rfc('rfc-9114', '1.1'), rfc('rfc-9110', '1.2')];
const CONNECTION_REUSE = rfc('rfc-9112', '9.3', true);

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50310';
const WEB = '203.0.113.80:80';

const files: TableDef = {
  id: 'files',
  title: 'Files the browser has',
  by: 'for this page so far',
  columns: [
    { key: 'path', label: 'Path' },
    { key: 'type', label: 'Type', prose: true },
    { key: 'status', label: 'Status' },
    { key: 'size', label: 'Size' },
  ],
  keyColumn: 'path',
  initialRows: [],
  empty: 'None yet. The browser hasn’t asked for anything.',
};

const mockup = messagesFor(files);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-http',
  title: 'HTTP',
  subtitle: 'Asking for web pages',
  level: 'beginner',
  certTags: [],
  summary:
    'Web pages arrive the same basic way: your browser asks for one, and a web server sends it back. HTTP is the set of rules for that asking and answering, and in HTTP/1.1 it’s plain text, so you could read it yourself.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'lead-2', 'why-2', 'fact-used'] },
  units: [
    {
      id: 'http',
      name: 'HTTP',
      fullName: 'Hypertext Transfer Protocol',
      purpose: 'Asking for web pages',
      group: 'app',
      // No standard puts HTTP at an OSI layer (X.200 never names HTTP; RFC 9110 calls it "application-level"), so the
      // badge rests on two vendors' own mappings.
      osi: { layers: [7], cite: [CLOUDFLARE_L7, MS_L7] },
      backing: { traces: ['fact-defined', 'lead-2', 'fact-used'] },
      scene: {
        title: 'Your browser asks a web server for a page',
        views: ['network', 'sequence'],
        layers: ['http:web'],
        labels: { laptop: 'Wants example.net', url: 'example.net' },
        start: [],
        panel: { type: 'table', table: files },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'resolver', label: 'DNS resolver', addr: '192.0.2.53' },
          { place: 'web', label: 'Web server', addr: '203.0.113.80' },
        ],
        backing: { traces: ['lead-2', 'term-client', 'term-path', 'term-status', 'fact-type', 'fact-dns', 'term-ip'] },
      },
      overview: {
        hook: 'Web pages arrive the same basic way: your browser asks for one, and a web server sends it back. HTTP is the set of rules for that asking and answering, and in HTTP/1.1 it’s plain text, so you could read it yourself.',
        hookBacking: { traces: ['lead-1', 'lead-2', 'why-2', 'fact-used'] },
        description:
          'It works like ordering at a counter. You ask for one thing by name, you get it back with a short note saying how it went, then you ask for the next thing. A page with pictures and styles is a longer order, with several items.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'web pages, and apps that talk to servers', backing: { traces: ['fact-used'] } },
          { label: 'Port', value: 'TCP 80 (HTTPS uses 443)', backing: { traces: ['fact-port', 'fact-rides'] } },
          { label: 'Rides on', value: 'TCP, which rides on IP (HTTP/3: QUIC, on UDP)', backing: { traces: ['fact-rides'] } },
          { label: 'Shape', value: 'a request, then a response', backing: { traces: ['lead-2', 'fact-request', 'fact-response'] } },
          { label: 'OSI layer', value: '7, application', backing: { traces: ['fact-osi'] } },
          { label: 'This example', value: 'example.net at 203.0.113.80', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'client-request',
          title: 'Client Request',
          sub: 'You type http://example.net and press Enter',
          narrative:
            'You type http://example.net and press Enter. Your browser is the **client**, the side that asks. It reads the **URL** you typed to work out three things: which protocol to use (http), which site (example.net) and which page (/, sent when the URL has no path). It has nothing saved for this site, and it doesn’t know the server’s number yet, so nothing has been sent.',
          deep: [
            {
              text: 'A URL has parts: the scheme (http), the host (example.net), an optional port (80 is assumed for http, 443 for https), the path (/), and sometimes a query (?q=…) and a fragment (#top). Before going to the network, the browser can look in its cache first; a fresh saved copy can mean no request at all.',
              cite: [
                rfc('rfc-3986', '3', true),
                cite('whatwg-url', '4.1', { url: `${URL_STANDARD}#url-representation` }),
                rfc('rfc-9110', '4.2.1', true),
                rfc('rfc-9110', '4.2.2', true),
                cite('whatwg-url', '4.2', { url: `${URL_STANDARD}#url-miscellaneous` }),
                rfc('rfc-9110', '7.3.1'),
                rfc('rfc-9111', '4.2', true),
              ],
            },
          ],
          facts: [
            { label: 'URL', value: 'http://example.net/', backing: { example: true } },
            { label: 'Scheme', value: 'http, so TCP port 80', backing: { traces: ['fact-port', 'fact-url', 'fact-rides'] } },
            { label: 'Host', value: 'example.net', backing: { example: true } },
            { label: 'Path', value: '/, sent when the URL has no path', backing: { traces: ['term-path', 'fact-request'] } },
          ],
          status: 'Preparing a request',
          idle: 'Nothing on the network yet. The browser is still getting ready.',
          events: [],
          backing: { traces: ['term-client', 'term-url', 'term-path', 'fact-url', 'fact-port', 'fact-request', 'term-ip', 'pattern'] },
        },
        {
          id: 'dns-resolution',
          title: 'DNS Resolution',
          sub: 'Where is example.net?',
          narrative:
            'To send anything, the browser needs the server’s number, its **IP address**. So the laptop asks its **DNS resolver**: “What’s the number for example.net?” Turning a name into a number this way is **DNS resolution**. The DNS lesson shows how the resolver finds it. Here the answer comes straight back.',
          deep: [
            {
              text: 'This is a DNS query for the A record of example.net, sent over UDP to port 53. If the laptop looked the name up recently, its own cache can answer, with no message sent.',
              cite: [
                rfc('rfc-1034', '5.2.1', true),
                rfc('rfc-1035', '3.2.2', true),
                rfc('rfc-1035', '4.2.1', true),
                rfc('rfc-1034', '5.1', true),
              ],
            },
          ],
          facts: [
            { label: 'Asks', value: 'the DNS resolver, 192.0.2.53', backing: { example: true } },
            { label: 'Question', value: 'the A record for example.net', backing: { traces: ['fact-dns'] } },
            { label: 'Answer', value: '203.0.113.80', backing: { example: true } },
            { label: 'Takes', value: 'about 20 ms here', backing: { traces: ['fact-dns'] } },
          ],
          events: [
            ...msgOf(
              'fact-dns',
              'term-ip',
            )({
              tag: 'LOOKUP',
              from: 'laptop',
              to: 'resolver',
              proto: 'DNS',
              via: 'UDP',
              kind: 'request',
              time: '0.000s',
              src: '192.168.1.100:51034',
              dst: '192.0.2.53:53',
              size: '—',
              sum: 'What’s the number for example.net?',
              info: 'DNS query: A record for example.net',
              st: 'Looking up example.net',
            }),
            ...msgOf(
              'fact-dns',
              'term-ip',
            )({
              tag: 'ANSWER',
              from: 'resolver',
              to: 'laptop',
              proto: 'DNS',
              via: 'UDP',
              kind: 'response',
              time: '0.019s',
              src: '192.0.2.53:53',
              dst: '192.168.1.100:51034',
              size: '—',
              sum: 'example.net is 203.0.113.80.',
              info: 'DNS response: example.net is 203.0.113.80',
              st: 'Found 203.0.113.80',
              known: true,
            }),
          ],
          backing: { traces: ['term-ip', 'fact-dns', 'pattern'] },
        },
        {
          id: 'tcp-connection',
          title: 'TCP Connection',
          sub: 'Check the line works both ways',
          narrative:
            'Next the laptop opens a line to the server, the way you check someone can hear you before you start talking. Three short messages: hello, hello back, and OK. That’s the **TCP handshake**, and the open line is a **connection**. HTTP sends this page’s messages over it. The TCP lesson looks at it closely.',
          deep: [
            {
              text: 'The laptop uses a temporary port of its own (here 50310) and connects to port 80, the standard port for plain HTTP. The three messages are SYN, SYN-ACK and ACK. Once it’s open, many requests can share the connection; HTTP/1.1 keeps it open by default.',
              cite: [
                rfc('rfc-6335', '6', true),
                rfc('rfc-6335', '8.1.2', true),
                rfc('rfc-9110', '4.2.1', true),
                rfc('rfc-9293', '3.5', true),
                rfc('rfc-9293', '3.5.1', true),
                CONNECTION_REUSE,
              ],
            },
          ],
          facts: [
            { label: 'From', value: '192.168.1.100, port 50310', backing: { example: true } },
            { label: 'To', value: '203.0.113.80, port 80', backing: { traces: ['fact-port'] } },
            { label: 'Messages', value: 'SYN, SYN-ACK, ACK', backing: { traces: ['fact-tcp'] } },
            { label: 'Then', value: 'the connection stays open for more requests', backing: { traces: ['fact-tcp'] } },
          ],
          events: [
            ...msgOf(
              'fact-tcp',
              'term-tcp',
              'fact-port',
            )({
              tag: 'SYN',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'TCP',
              kind: 'request',
              time: '0.020s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN: open a connection',
            }),
            ...msgOf(
              'fact-tcp',
              'term-tcp',
              'fact-port',
            )({
              tag: 'SYN-ACK',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'TCP',
              kind: 'response',
              time: '0.052s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Hello. Yes, I hear you.',
              info: 'SYN-ACK: accepted',
            }),
            ...msgOf(
              'fact-tcp',
              'term-tcp',
              'fact-port',
            )({
              tag: 'ACK',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'TCP',
              kind: 'request',
              time: '0.052s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Good, the line is open.',
              info: 'ACK: connection open',
              st: 'Connected to example.net',
              known: true,
              conn: ['open', 'laptop>web'],
            }),
          ],
          backing: { traces: ['term-tcp', 'fact-tcp', 'fact-rides', 'pattern'] },
        },
        {
          id: 'http-exchange',
          title: 'HTTP Exchange',
          sub: 'GET /, then 200 OK',
          narrative:
            'Now the browser asks for the page. In HTTP/1.1 that is a few lines of plain text. The first line starts with **GET /**, which means “send me the page at /”: GET is the **method**, the kind of asking, and / is the **path**. The lines under it are **headers**, notes such as which site this is for. The server answers with a **status code** on top, **200 OK**, meaning it went fine, then the page itself, written in **HTML**. One request and its response make an HTTP exchange.',
          deep: [
            {
              text: 'The request line is GET / HTTP/1.1, and in HTTP/1.1 the Host header (Host: example.net) is required, because one server can hold many sites. Other methods: POST sends data for the server to process, PUT and DELETE change things on the server, HEAD asks for headers only. Status codes come in five families: 1xx received, still going, 2xx success, 3xx more to do (301 look elsewhere, 304 use your saved copy), 4xx a problem with the request (403, 404), 5xx a problem on the server (500, 503).',
              cite: [
                rfc('rfc-9112', '3', true),
                rfc('rfc-9112', '3.2', true),
                rfc('rfc-9110', '7.2'),
                rfc('rfc-9110', '9.3.2', true),
                rfc('rfc-9110', '9.3.3', true),
                rfc('rfc-9110', '9.3.4', true),
                rfc('rfc-9110', '9.3.5', true),
                rfc('rfc-9110', '15', true),
                rfc('rfc-9110', '15.4.2', true),
                rfc('rfc-9110', '15.4.5', true),
                rfc('rfc-9110', '15.5.4', true),
                rfc('rfc-9110', '15.5.5', true),
                rfc('rfc-9110', '15.6.1', true),
                rfc('rfc-9110', '15.6.4', true),
              ],
            },
          ],
          facts: [
            { label: 'Request line', value: 'GET / HTTP/1.1', backing: { traces: ['fact-request', 'term-method'] } },
            { label: 'Host', value: 'example.net', backing: { traces: ['fact-request', 'fact-url'] } },
            { label: 'Status', value: '200 OK', backing: { traces: ['fact-status'] } },
            { label: 'Content-Type', value: 'text/html', backing: { traces: ['fact-type'] } },
          ],
          events: [
            ...msgOf(
              'fact-request',
              'term-method',
              'term-path',
              'lead-1',
              'fact-rides',
              'fact-port',
            )({
              tag: 'GET /',
              from: 'laptop',
              to: 'web',
              proto: 'HTTP',
              via: 'TCP',
              kind: 'request',
              time: '0.053s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Please send the page at /.',
              info: 'GET / HTTP/1.1, Host: example.net',
              st: 'Waiting for the page',
              known: true,
            }),
            ...msgOf(
              'fact-response',
              'term-status',
              'fact-status',
              'term-html',
              'fact-type',
              'lead-1',
              'fact-rides',
              'fact-port',
            )({
              tag: '200 OK',
              from: 'web',
              to: 'laptop',
              proto: 'HTTP',
              via: 'TCP',
              kind: 'response',
              time: '0.091s',
              src: WEB,
              dst: LAPTOP,
              size: '18 KB',
              sum: '200 OK. Here’s the page, as HTML.',
              info: 'HTTP/1.1 200 OK, text/html',
              st: 'Reading the page',
              known: true,
              rows: [{ key: '/', cells: ['/', 'text/html', '200 OK', '18 KB'] }],
            }),
          ],
          backing: {
            traces: ['lead-1', 'lead-2', 'term-method', 'term-path', 'term-headers', 'term-status', 'term-html', 'fact-request', 'fact-response', 'fact-status', 'pattern'],
          },
        },
        {
          id: 'render-page',
          title: 'Render Page',
          sub: 'Fetch the rest, and draw it',
          narrative:
            'The browser reads the HTML. Turning HTML and its styles into what you see is **rendering**. On the way it finds two more files it needs: a **stylesheet** that says how the page looks, and an **image** for the logo. It fetches each with its own GET, here over the same connection. The page is drawn once the stylesheet arrives.',
          deep: [
            {
              text: 'Browsers often fetch several files at once, over more than one connection. HTTP/2 and HTTP/3 let many requests share one connection at the same time. A file the browser already has can be checked instead of fetched: if it hasn’t changed, the server answers 304 Not Modified with no body.',
              cite: [
                rfc('rfc-9112', '9', true),
                rfc('rfc-9114', '1.1'),
                rfc('rfc-9114', '6.1'),
                rfc('rfc-9113', '1', true),
                rfc('rfc-9111', '4.3', true),
                rfc('rfc-9110', '13.1.3'),
                rfc('rfc-9110', '15.4.5', true),
              ],
            },
          ],
          facts: [
            { label: 'Requests', value: 'GET /style.css, GET /logo.png', backing: { traces: ['fact-files', 'term-path'] } },
            { label: 'Types', value: 'text/css, image/png', backing: { traces: ['fact-type'] } },
            { label: 'Same connection', value: 'yes, it stays open', backing: { traces: ['fact-tcp'] } },
            { label: 'Unchanged files', value: '304 Not Modified', backing: { traces: ['fact-status'] } },
          ],
          events: [
            ...msgOf(
              'fact-files',
              'fact-request',
              'term-method',
              'fact-rides',
              'fact-port',
              'term-path',
            )({
              tag: 'GET /style.css',
              from: 'laptop',
              to: 'web',
              proto: 'HTTP',
              via: 'TCP',
              kind: 'request',
              time: '0.104s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Please send /style.css.',
              info: 'GET /style.css HTTP/1.1',
            }),
            ...msgOf(
              'fact-files',
              'term-status',
              'fact-type',
              'term-rendering',
              'deep-4',
              'fact-rides',
              'fact-port',
              'fact-status',
              'fact-response',
              'lead-1',
            )({
              tag: '200 OK',
              from: 'web',
              to: 'laptop',
              proto: 'HTTP',
              via: 'TCP',
              kind: 'response',
              time: '0.139s',
              src: WEB,
              dst: LAPTOP,
              size: '6 KB',
              sum: '200 OK. Here’s the stylesheet.',
              info: 'HTTP/1.1 200 OK, text/css',
              st: 'Drawing the page',
              page: 'text',
              rows: [{ key: '/style.css', cells: ['/style.css', 'text/css', '200 OK', '6 KB'] }],
            }),
            ...msgOf(
              'fact-files',
              'fact-request',
              'term-method',
              'fact-rides',
              'fact-port',
              'term-path',
            )({
              tag: 'GET /logo.png',
              from: 'laptop',
              to: 'web',
              proto: 'HTTP',
              via: 'TCP',
              kind: 'request',
              time: '0.140s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Please send /logo.png.',
              info: 'GET /logo.png HTTP/1.1',
            }),
            ...msgOf(
              'fact-files',
              'term-status',
              'fact-type',
              'term-rendering',
              'fact-rides',
              'fact-port',
              'fact-status',
              'fact-response',
              'lead-1',
            )({
              tag: '200 OK',
              from: 'web',
              to: 'laptop',
              proto: 'HTTP',
              via: 'TCP',
              kind: 'response',
              time: '0.181s',
              src: WEB,
              dst: LAPTOP,
              size: '9 KB',
              sum: '200 OK. Here’s the logo.',
              info: 'HTTP/1.1 200 OK, image/png',
              st: 'Page loaded',
              done: true,
              page: 'full',
              rows: [{ key: '/logo.png', cells: ['/logo.png', 'image/png', '200 OK', '9 KB'] }],
            }),
          ],
          backing: { traces: ['term-html', 'term-rendering', 'fact-files', 'fact-tcp', 'deep-4', 'pattern'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'In HTTP/1.1, getting a web page is a conversation in plain text.',
            cite: PLAIN_TEXT,
          },
          {
            id: 'lead-2',
            text: 'In HTTP, the browser asks for a page or file, and the server answers with a status and, if it’s 200 OK, the file.',
            cite: [rfc('rfc-9110', '3.4', true), rfc('rfc-9110', '15.3.1', true)],
          },
        ],
        terms: [
          {
            id: 'term-client',
            idea: 'The side that asks: your browser',
            name: 'Client',
            cite: [rfc('rfc-9110', '3.3', true), rfc('rfc-9110', '3.5', true)],
          },
          {
            id: 'term-url',
            idea: 'The web address of a page or file',
            name: 'URL',
            cite: [rfc('rfc-3986', '1.1.3', true)],
          },
          {
            id: 'term-ip',
            idea: 'Where to send it: the server’s number',
            name: 'IP address',
            cite: [rfc('rfc-791', '2.3', true), rfc('rfc-9110', '4.3.2')],
          },
          {
            id: 'term-tcp',
            idea: 'The open line both sides agreed on',
            name: 'TCP connection',
            cite: [rfc('rfc-9293', '3.5', true), rfc('rfc-9293', '4', true)],
          },
          {
            id: 'term-method',
            idea: 'The kind of asking, like “send me this”',
            name: 'Method (GET)',
            cite: [rfc('rfc-9110', '9.1', true), rfc('rfc-9110', '9.3.1', true)],
          },
          {
            id: 'term-path',
            idea: 'Which page or file on the site',
            name: 'Path',
            cite: [rfc('rfc-3986', '3.3', true), rfc('rfc-9110', '4.2.1')],
          },
          {
            id: 'term-headers',
            idea: 'Notes on a request or a reply',
            name: 'Headers',
            cite: [rfc('rfc-9110', '6.3', true)],
          },
          {
            id: 'term-status',
            idea: 'The number that says how it went',
            name: 'Status code',
            cite: [rfc('rfc-9110', '15', true)],
          },
          {
            id: 'term-html',
            idea: 'The text that describes the page',
            name: 'HTML',
            cite: [html('1.3', 'background', true), html('1.10', 'a-quick-introduction-to-html', true)],
          },
          {
            id: 'term-rendering',
            idea: 'Drawing the page from its HTML and styles',
            name: 'Rendering',
            cite: [HTML_RENDERING, HTML_LINK_STYLESHEET],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render'],
          note: 'Opening a page over plain HTTP goes through these five, though a saved copy, a remembered name or an open connection can skip a step. The HTTP exchange repeats for every file the page needs from the server.',
          cite: [
            rfc('rfc-9110', '4.3.2', true),
            rfc('rfc-9110', '7.3.1'),
            rfc('rfc-9111', '4.2', true),
            rfc('rfc-1034', '5.1', true),
            CONNECTION_REUSE,
            HTML_RENDERING,
            HTML_LINK,
            HTML_IMG,
            rfc('rfc-9499', '6'),
            rfc('rfc-9110', '3.9'),
          ],
        },
        why: [
          {
            id: 'why-1',
            text: 'HTTP gives every web server the same kind of interface, so a browser can open sites it has never seen.',
            cite: [rfc('rfc-9110', '1.1', true)],
          },
          {
            id: 'why-2',
            text: 'Because HTTP/1.1 is plain text it’s easy to read,',
            cite: PLAIN_TEXT,
          },
          {
            id: 'why-3',
            text: 'and that’s the catch: plain HTTP isn’t encrypted, so anyone on the way can read it too.',
            cite: [rfc('rfc-9110', '4.3.2'), rfc('rfc-9112', '11.4'), rfc('rfc-9110', '4.2.2')],
          },
          {
            id: 'why-4',
            text: 'HTTPS fixes that.',
            cite: [rfc('rfc-9110', '4.2.2', true)],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'HTTP doesn’t remember anything between requests; each one stands alone.',
            cite: [rfc('rfc-9110', '3.3', true)],
          },
          {
            id: 'deep-2',
            text: 'Sites remember you with cookies: names and values the server asks the browser to send back with later requests.',
            cite: [rfc('rfc-6265', '1', true), rfc('rfc-6265', '3', true)],
          },
          {
            id: 'deep-3',
            text: 'HTTP/1.1 is plain text, HTTP/2 sends the same meaning as binary frames, and HTTP/3 runs over QUIC, on UDP.',
            cite: [...PLAIN_TEXT, rfc('rfc-9113', '1', true), rfc('rfc-9114', '1', true), rfc('rfc-9000', '1')],
          },
          {
            id: 'deep-4',
            text: 'Drawing waits for a stylesheet the page links to before its body begins, if it applies to this screen, until it has loaded or failed, or a timeout passes.',
            cite: [
              html('4.6.8.23', 'link-type-stylesheet', true),
              html('3.1.6', 'render-blocking-mechanism', true),
              html('8.1.7.3', 'event-loop-processing-model', true),
            ],
          },
        ],
        facts: [
          { id: 'fact-port', label: 'Port', value: '80 (HTTPS: 443)', cite: [rfc('rfc-9110', '4.2.1', true), rfc('rfc-9110', '4.2.2', true)] },
          {
            id: 'fact-rides',
            label: 'Rides on',
            value: 'TCP, which rides on IP (HTTP/3: QUIC, on UDP)',
            cite: [rfc('rfc-9112', '9', true), rfc('rfc-9293', '2.2'), rfc('rfc-9114', '1', true), rfc('rfc-9000', '1')],
          },
          {
            id: 'fact-used',
            label: 'Used for',
            value: 'web pages, and apps that talk to servers',
            cite: [rfc('rfc-9110', '1.2'), rfc('rfc-9110', '3.5'), rfc('rfc-9114', '1')],
          },
          {
            id: 'fact-url',
            label: 'URL parts',
            value: 'scheme, host, port, path, query, fragment',
            cite: [rfc('rfc-3986', '3', true), rfc('rfc-3986', '3.2', true), cite('whatwg-url', '4.1', { url: `${URL_STANDARD}#url-representation`, defining: true })],
          },
          {
            id: 'fact-request',
            label: 'A request',
            value: 'a request line (method, target, version), then headers; for a GET sent straight to the server, the target is the path and any query, and / when the URL has no path; HTTP/1.1 requires a Host header, which names the site',
            cite: [rfc('rfc-9112', '3', true), rfc('rfc-9112', '3.2.1', true), rfc('rfc-9112', '3.2', true), rfc('rfc-9112', '2.1', true), rfc('rfc-9110', '7.2', true)],
          },
          {
            id: 'fact-response',
            label: 'A response',
            value: 'a status line (version, status code and, optionally, a reason such as OK), then headers, then any content',
            cite: [rfc('rfc-9112', '4', true), rfc('rfc-9112', '2.1', true), rfc('rfc-9110', '6.4', true)],
          },
          {
            id: 'fact-type',
            label: 'Content-Type',
            value: 'names a file’s media type, such as text/html, text/css or image/png',
            cite: [
              rfc('rfc-9110', '8.3', true),
              cite('iana-media-types', 'Media Types, text', { url: `${IANA_MEDIA}#table-text`, defining: true }),
              cite('iana-media-types', 'Media Types, image', { url: `${IANA_MEDIA}#table-image`, defining: true }),
            ],
          },
          { id: 'fact-methods', label: 'Some methods', value: 'GET, POST, PUT, DELETE, HEAD', cite: [rfc('rfc-9110', '9.1', true)] },
          {
            id: 'fact-status',
            label: 'Status families',
            value: '1xx received, still going; 2xx success (200 OK); 3xx more to do (304 Not Modified: use your saved copy); 4xx request problem; 5xx server problem',
            cite: [rfc('rfc-9110', '15', true), rfc('rfc-9110', '15.3.1', true), rfc('rfc-9110', '15.4.5', true)],
          },
          { id: 'fact-versions', label: 'Major versions', value: 'HTTP/1.1, HTTP/2, HTTP/3', cite: [rfc('rfc-9110', '1.2', true)] },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 9110 (the Hypertext Transfer Protocol’s shared meaning); RFC 9112, RFC 9113 and RFC 9114 (the versions)',
            cite: [
              cite('rfc-9110', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc9110.html#abstract', defining: true }),
              rfc('rfc-9110', '1.2', true),
              rfc('rfc-9112', '1', true),
              cite('rfc-9113', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc9113.html#abstract', defining: true }),
              rfc('rfc-9114', '1.2', true),
            ],
          },
          {
            id: 'fact-dns',
            label: 'DNS resolution',
            value: 'a resolver turns a name into an IP address, which can take from milliseconds to seconds; UDP to port 53 is the recommended way to send a query, such as one for an A record',
            cite: [
              rfc('rfc-1034', '5.2.1', true),
              rfc('rfc-1035', '3.2.2', true),
              rfc('rfc-1035', '4.2.1', true),
              rfc('rfc-9499', '6'),
              rfc('rfc-9110', '4.3.2'),
              rfc('rfc-1034', '5.1', true),
            ],
          },
          {
            id: 'fact-tcp',
            label: 'TCP connection',
            value: 'opened by a handshake of three messages (SYN, SYN-ACK, ACK); HTTP/1.1 keeps it open for more requests by default',
            cite: [rfc('rfc-9293', '3.5', true), rfc('rfc-9293', '3.5.1', true), CONNECTION_REUSE],
          },
          {
            id: 'fact-files',
            label: 'Other files',
            value: 'a page names more files, such as a stylesheet (how it looks) and images; each one the browser hasn’t saved is fetched with its own GET',
            cite: [HTML_LINK_STYLESHEET, HTML_IMG, FETCH_REQUESTS_D, rfc('rfc-9110', '9.3.1', true), rfc('rfc-9111', '4.2', true)],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '7, application', cite: [CLOUDFLARE_L7, MS_L7] },
        ],
      },
      practice: [
        {
          id: 'status-404',
          prompt: 'The server replies 404. What does that mean?',
          options: [
            {
              text: 'The server found nothing at that path.',
              feedback: 'Right. 404 means the server answered, but found nothing at that path, or won’t say whether anything is there.',
              cite: [rfc('rfc-9110', '15.5.5', true)],
            },
            {
              text: 'The server is too busy to answer.',
              feedback: 'Not quite. A busy server may answer 503, a 5xx code. 404 means nothing was found at that path.',
              cite: [rfc('rfc-9110', '15.6.4', true), rfc('rfc-9110', '15.5.5', true)],
            },
            {
              text: 'The page came back fine.',
              feedback: 'Not quite. That’s 200 OK. 404 means nothing was found at that path.',
              cite: [rfc('rfc-9110', '15.3.1', true), rfc('rfc-9110', '15.5.5', true)],
            },
          ],
          answer: 0,
        },
        {
          id: 'more-files',
          prompt: 'The page needs a stylesheet and a logo. How does the browser get them?',
          options: [
            {
              text: 'They arrive inside the HTML.',
              feedback: 'Not quite. Here the HTML only names them, so the browser asks for each one.',
              cite: [HTML_LINK, HTML_IMG, FETCH_REQUESTS],
            },
            {
              text: 'It sends a separate request for each file.',
              feedback: 'Yes. One GET per file; here they share the open connection.',
              cite: [FETCH_REQUESTS, HTML_LINK_STYLESHEET, rfc('rfc-9110', '9.3.1', true), CONNECTION_REUSE],
            },
            {
              text: 'It asks the DNS resolver for them.',
              feedback: 'Not quite. DNS turns the name into an address; it doesn’t hold the files. They come from the web server, one request each.',
              cite: [rfc('rfc-1034', '5.2.1', true), rfc('rfc-9110', '4.3.2')],
            },
          ],
          answer: 1,
        },
      ],
    },
  ],
});
