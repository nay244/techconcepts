import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * HTTPS, lesson 2 of How the Internet Works’ 14. The browser opens https://techconcepts.app as HTTP opens a page, with
 * one more job before it asks: after the lookup and the TCP handshake, a TLS handshake seals the line and checks the
 * site’s certificate. The page comes back sealed, the padlock comes on, and the server hands over a session ticket.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), changed only where a source
 * does not state them. techconcepts.app, the addresses, the ports 50812 and 51210, the timings and the request and
 * file sizes are example data (RFC 5737 and RFC 1918 addresses, ephemeral ports, made-up numbers): no source states
 * them. The postcard and the locked box, and the three greetings of the TCP handshake, are analogies and cite nothing.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
const RFC = (n: number) => `https://www.rfc-editor.org/rfc/rfc${n}.html`;
/** An appendix or the abstract of an RFC has no numbered section, so it is cited by the fragment of its heading. */
const rfcAt = (source: string, section: string, n: number, fragment: string, defining = false) =>
  cite(source, section, defining ? { url: `${RFC(n)}#${fragment}`, defining: true } : { url: `${RFC(n)}#${fragment}` });
const ABSTRACT_9846 = rfcAt('rfc-9846', 'Abstract', 9846, 'abstract', true);
const ABSTRACT_10024 = rfcAt('rfc-10024', 'Abstract', 10024, 'abstract', true);
const F1_9846 = rfcAt('rfc-9846', 'F.1', 9846, 'appendix-F.1');
const F3_9846 = rfcAt('rfc-9846', 'F.3', 9846, 'appendix-F.3');
const C2_9846 = rfcAt('rfc-9846', 'C.2', 9846, 'appendix-C.2');

const HTML = 'https://html.spec.whatwg.org/index.html';
/** The HTML standard is one page; a section is cited by the fragment of its heading. */
const html = (section: string, fragment: string, defining = false) =>
  cite('whatwg-html', section, defining ? { url: `${HTML}#${fragment}`, defining: true } : { url: `${HTML}#${fragment}` });
const HTML_LINK_STYLESHEET = html('4.6.8.23', 'link-type-stylesheet');
const HTML_IMG = html('4.8.3', 'the-img-element');

const FETCH_STANDARD = 'https://fetch.spec.whatwg.org/index.html';
const FETCH_REQUESTS_D = cite('whatwg-fetch', '2.2.5', { url: `${FETCH_STANDARD}#requests`, defining: true });
const FETCH_MAIN = cite('whatwg-fetch', '4.1', { url: `${FETCH_STANDARD}#main-fetch` });

const IANA_MEDIA = 'https://www.iana.org/assignments/media-types/media-types.xhtml';
const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const MS_APP_GATEWAY = 'https://learn.microsoft.com/en-us/azure/application-gateway/overview';
const CF_PROXY = 'https://developers.cloudflare.com/load-balancing/understand-basics/proxy-modes/';
/** No standard puts HTTPS at an OSI layer (X.200 never names it), so the badge rests on two vendors' own mappings. */
const MS_L7 = vendor('microsoft-app-gateway', MS_APP_GATEWAY, 'What is Azure Application Gateway?', 'Application%20Gateway%20operates%20at%20the%20application%20layer');
const CF_L7 = vendor('cloudflare-lb-proxy-modes', CF_PROXY, 'Layer 7 load balancing', 'Layer%207%20load%20balancers%20direct%20traffic');

const EDGE_FIRST = 'https://support.microsoft.com/en-us/edge/secure-your-web-browsing-with-https-first-mode-in-microsoft-edge';
const EDGE_HTTP = vendor('microsoft-edge-https-first', EDGE_FIRST, 'What are HTTP and HTTPS?', 'What%20are%20HTTP%20and%20HTTPS');
const EDGE_FIRST_MODE = vendor('microsoft-edge-https-first', EDGE_FIRST, 'What is HTTPS-First Mode?', 'What%20is%20HTTPS-First%20Mode');
const EDGE_FIRST_MANAGE = vendor('microsoft-edge-https-first', EDGE_FIRST, 'Manage HTTPS-First Mode in Microsoft Edge', 'Manage%20HTTPS-First%20Mode%20in%20Microsoft%20Edge');
const EDGE_SECURE = 'https://support.microsoft.com/en-us/edge/securely-browse-the-web-in-microsoft-edge';
const EDGE_ICON = vendor('microsoft-edge-secure', EDGE_SECURE, 'Verify the connection icon in the address bar', 'Verify%20the%20connection%20icon%20in%20the%20address%20bar');
const CHROME_SECURE = 'https://support.google.com/chrome/answer/95617';
const CHROME_SYMBOLS = vendor('google-chrome-secure', CHROME_SECURE, 'What each security symbol means', 'What%20each%20security%20symbol%20means');
const CHROME_RESOLVE = vendor('google-chrome-secure', CHROME_SECURE, 'Resolve security and connection issues', 'Resolve%20security%20and%20connection%20issues');
const CHROME_ALWAYS = vendor(
  'google-chrome-always-secure',
  'https://support.google.com/chrome/answer/10468685',
  'Manage Advanced security settings',
  'Manage%20Advanced%20security%20settings',
);
const CF_MIXED = vendor(
  'cloudflare-mixed-content',
  'https://developers.cloudflare.com/ssl/troubleshooting/mixed-content-errors/',
  'Mixed content errors',
  'Mixed%20content%20errors',
);
const CF_DNS = vendor('cloudflare-dns-encryption', 'https://developers.cloudflare.com/1.1.1.1/encryption/', 'Encryption', 'DNS%20over%20TLS%20%28DoT%29');
const CF_PQC = vendor(
  'cloudflare-pqc-support',
  'https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/',
  'Browsers',
  'Default%20in%20Chrome%20131',
);
const CF_VALIDITY = vendor(
  'cloudflare-cert-validity',
  'https://developers.cloudflare.com/ssl/reference/certificate-validity-periods/',
  'Universal SSL',
  'Universal%20SSL',
);
const LE_FAQ = vendor('letsencrypt-faq', 'https://letsencrypt.org/docs/faq/', 'What is the lifetime for Let’s Encrypt certificates?', 'What%20is%20the%20lifetime%20for%20Let');
const LE_HOW = vendor('letsencrypt-how', 'https://letsencrypt.org/how-it-works/', 'How It Works', 'The%20objective%20of%20Let');

/** HTTP/1.1 is plain text: RFC 9114 and RFC 9110 each say so, so the claim rests on two documents. */
const PLAIN_TEXT = [rfc('rfc-9114', '1.1'), rfc('rfc-9110', '1.2')];

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50812';
const WEB = '198.51.100.7:443';
const LAPTOP_DNS = '192.168.1.100:51210';

const seen: TableDef = {
  id: 'seen',
  title: 'What someone watching can see',
  by: 'between you and the site',
  columns: [
    { key: 'message', label: 'Message' },
    { key: 'sees', label: 'They can see', prose: true },
  ],
  keyColumn: 'message',
  initialRows: [],
  empty: 'Nothing yet. Nothing has been sent.',
};

const mockup = messagesFor(seen);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-https',
  title: 'HTTPS',
  subtitle: 'Web pages, sealed',
  level: 'beginner',
  certTags: [],
  summary:
    'HTTPS is HTTP inside a sealed envelope. The asking and answering are the same, but nobody between you and the site can read or change them, and you can check that the site is really the one you meant.',
  figure: 'net-map',
  backing: { traces: ['term-https', 'lead-1', 'lead-2', 'why-1', 'why-2', 'term-encrypted', 'term-cert', 'fact-used'] },
  units: [
    {
      id: 'https',
      name: 'HTTPS',
      fullName: 'HTTP Secure',
      purpose: 'Web pages, sealed',
      group: 'security',
      osi: { layers: [7], cite: [MS_L7, CF_L7] },
      backing: { traces: ['term-https', 'lead-1', 'lead-2', 'fact-used'] },
      scene: {
        title: 'The same asking and answering, sealed on the way',
        views: ['network', 'sequence'],
        layers: ['https:web'],
        labels: { laptop: 'Wants techconcepts.app', url: 'techconcepts.app' },
        start: [],
        panel: { type: 'table', table: seen },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'resolver', label: 'DNS resolver', addr: '192.0.2.53' },
          { place: 'web', label: 'Web server', addr: '198.51.100.7' },
        ],
        backing: { traces: ['lead-2', 'term-https', 'term-encrypted', 'fact-watch', 'fact-dns', 'fact-inside'] },
      },
      overview: {
        hook: 'HTTPS is HTTP inside a sealed envelope. The asking and answering are the same, but nobody between you and the site can read or change them, and you can check that the site is really the one you meant.',
        hookBacking: { traces: ['term-https', 'lead-1', 'lead-2', 'why-1', 'why-2', 'term-encrypted', 'term-cert'] },
        description:
          'Think of a postcard and a locked box. With plain HTTP, every router on the way could read your postcard, and even rewrite it. With HTTPS, your browser and the site first agree on a lock only the two of them can open, then everything goes in the box. Here your browser opens techconcepts.app.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'web pages, and apps that talk to servers', backing: { traces: ['fact-used', 'lead-1'] } },
          { label: 'Port', value: 'TCP 443', backing: { traces: ['fact-port', 'fact-rides'] } },
          { label: 'Is', value: 'HTTP, carried inside TLS', backing: { traces: ['fact-is', 'term-https', 'lead-1'] } },
          { label: 'Proves the site with', value: 'a certificate', backing: { traces: ['term-cert', 'why-2', 'fact-certs'] } },
          { label: 'OSI layer', value: '7, application', backing: { traces: ['fact-osi'] } },
          { label: 'This example', value: 'techconcepts.app at 198.51.100.7', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'client-request',
          title: 'Client Request',
          sub: 'Ask for https://',
          narrative:
            'You type **https://techconcepts.app** and press Enter. The s means secure: the browser will only talk to this site through a sealed line. Before it asks for any page it has three jobs: find the server’s number, open a line to it, and seal that line. Nothing has been sent yet.',
          deep: [
            {
              text: 'Some browsers upgrade http:// to https:// when they can, by default or as a setting. Many sites also send an HSTS header, which tells the browser to always use HTTPS for them, so a link to http:// is upgraded before anything is sent. The scheme https means port 443 unless the URL names another. Sites on the browser’s HSTS preload list are never contacted over plain HTTP at all.',
              cite: [
                EDGE_FIRST_MODE,
                EDGE_FIRST_MANAGE,
                CHROME_ALWAYS,
                rfc('rfc-6797', '5.1', true),
                rfc('rfc-6797', '8.3', true),
                FETCH_MAIN,
                rfc('rfc-9110', '4.2.2', true),
                rfc('rfc-6797', '12.3'),
                rfc('rfc-6797', '5.2', true),
              ],
            },
          ],
          facts: [
            { label: 'URL', value: 'https://techconcepts.app/', backing: { example: true } },
            { label: 'Scheme', value: 'https, so TCP port 443', backing: { traces: ['term-https', 'fact-port', 'fact-rides'] } },
            { label: 'Before the page', value: 'DNS, then TCP, then TLS', backing: { traces: ['pattern', 'fact-dns', 'fact-tcp', 'fact-tls'] } },
            { label: 'HSTS', value: '“always use HTTPS for me”', backing: { traces: ['deep-4'] } },
          ],
          status: 'Preparing a secure request',
          idle: 'Nothing on the network yet. The browser is still getting ready.',
          events: [],
          backing: { traces: ['term-https', 'lead-1', 'fact-is', 'fact-port', 'pattern', 'fact-dns', 'fact-tcp', 'fact-tls'] },
        },
        {
          id: 'dns-resolution',
          title: 'DNS Resolution',
          sub: 'The lookup isn’t secret',
          narrative:
            'First the number, the same way as for any site: the laptop asks the **DNS resolver** where techconcepts.app is. Notice that this question isn’t sealed. Anyone watching the network can see which name you looked up, though not what you do there. HTTPS protects your conversation with the site, not the lookup before it.',
          deep: [
            {
              text: 'Normal DNS travels as plain UDP on port 53. Encrypted DNS hides the lookup too: DNS over HTTPS (DoH, port 443) or DNS over TLS (DoT, port 853), which many browsers and phones can switch on. The DNS lesson shows how the resolver finds the answer.',
              cite: [
                rfc('rfc-1035', '4.2.1', true),
                rfc('rfc-9076', '1'),
                rfc('rfc-8484', '1', true),
                rfc('rfc-8484', '8.1'),
                rfc('rfc-7858', '3.1', true),
                CF_DNS,
                CHROME_ALWAYS,
              ],
            },
          ],
          facts: [
            { label: 'Asks', value: 'the DNS resolver, 192.0.2.53', backing: { example: true } },
            { label: 'Answer', value: '198.51.100.7', backing: { example: true } },
            { label: 'Sealed?', value: 'no: plain DNS on UDP 53', backing: { traces: ['fact-dns', 'fact-dns-plain'] } },
            { label: 'To hide it', value: 'DoH or DoT', backing: { traces: ['fact-dns-plain'] } },
          ],
          events: [
            ...msgOf(
              'fact-dns',
              'fact-dns-plain',
            )({
              tag: 'LOOKUP',
              from: 'laptop',
              to: 'resolver',
              proto: 'DNS',
              via: 'UDP',
              kind: 'request',
              time: '0.000s',
              src: LAPTOP_DNS,
              dst: '192.0.2.53:53',
              size: '—',
              sum: 'What’s the number for techconcepts.app?',
              info: 'DNS query: A record for techconcepts.app',
              st: 'Looking up the name',
            }),
            ...msgOf(
              'fact-dns',
              'fact-dns-plain',
            )({
              tag: 'ANSWER',
              from: 'resolver',
              to: 'laptop',
              proto: 'DNS',
              via: 'UDP',
              kind: 'response',
              time: '0.018s',
              src: '192.0.2.53:53',
              dst: LAPTOP_DNS,
              size: '—',
              sum: 'techconcepts.app is 198.51.100.7.',
              info: 'DNS response: techconcepts.app is 198.51.100.7',
              st: 'Found 198.51.100.7',
              known: true,
              rows: [{ key: 'dns', cells: ['DNS lookup', 'the name techconcepts.app, and its number'] }],
            }),
          ],
          backing: { traces: ['fact-dns', 'fact-dns-plain', 'term-encrypted', 'lead-1', 'pattern'] },
        },
        {
          id: 'tcp-connection',
          title: 'TCP Connection',
          sub: 'Connect on port 443',
          narrative:
            'Next comes the TCP handshake, exactly as for plain HTTP: hello, hello back, OK. The only difference is the door it knocks on. HTTPS uses **port 443** instead of 80, so the server knows to expect a sealed conversation. The line is open now, but it isn’t sealed yet.',
          deep: [
            {
              text: 'A watcher sees the handshake and both addresses and ports, 192.168.1.100:50812 to 198.51.100.7:443, and port 443 is the port reserved for HTTPS. HTTP/3 skips TCP and runs over QUIC on UDP port 443, with the TLS handshake built into QUIC’s own.',
              cite: [
                rfc('rfc-9110', '4.3.3', true),
                rfc('rfc-9849', '1'),
                rfc('rfc-9110', '4.2.2', true),
                IANA_PORTS,
                rfc('rfc-9114', '1', true),
                rfc('rfc-9308', '8'),
                rfc('rfc-9001', '3', true),
                rfc('rfc-9001', '4', true),
              ],
            },
          ],
          facts: [
            { label: 'From', value: '192.168.1.100, port 50812', backing: { example: true } },
            { label: 'To', value: '198.51.100.7, port 443', backing: { traces: ['fact-port'] } },
            { label: 'Messages', value: 'SYN, SYN-ACK, ACK', backing: { traces: ['fact-tcp'] } },
            { label: 'Sealed?', value: 'not yet', backing: { traces: ['fact-tls', 'fact-is'] } },
          ],
          events: [
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SYN',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.019s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Hello, can we talk?',
              info: 'SYN',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SYN-ACK',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.051s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-port',
              'fact-tls',
              'fact-is',
              'fact-watch',
            )({
              tag: 'ACK',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.051s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              st: 'Connected, not sealed',
              known: true,
              conn: ['open', 'laptop>web'],
              rows: [{ key: 'tcp', cells: ['TCP connection', 'both addresses, and port 443'] }],
            }),
          ],
          backing: { traces: ['fact-tcp', 'fact-rides', 'fact-port', 'term-port', 'fact-tls', 'fact-is', 'pattern'] },
        },
        {
          id: 'tls-handshake',
          title: 'TLS Handshake',
          sub: 'Agree on keys, check the ID',
          narrative:
            'Now the two sides seal the line, in a quick exchange called the **TLS handshake**. The browser says hello and offers the kinds of lock it can use. The server picks one and sends its **certificate**, an ID card signed by an organisation browsers trust, and the browser checks that it really says techconcepts.app. Meanwhile both sides do some clever maths that gives each of them the same secret key, without the key ever crossing the network. From here on, everything is **encrypted**.',
          deep: [
            {
              text: 'This is TLS 1.3. The ClientHello carries a key share; the ServerHello, certificate, CertificateVerify and Finished come back in one flight; the client’s Finished completes it. Sealing costs one round trip. The key exchange is usually X25519, which browsers now pair with ML-KEM, a post-quantum method. The ClientHello names the site in plain text (SNI), so a watcher sees the name; Encrypted Client Hello (ECH) can hide it. The TLS/SSL lesson takes the handshake one message at a time.',
              cite: [
                ABSTRACT_9846,
                rfc('rfc-9846', '2', true),
                rfc('rfc-9846', '2.3', true),
                rfc('rfc-9001', '1'),
                ABSTRACT_10024,
                rfc('rfc-10024', '2', true),
                CF_PQC,
                rfc('rfc-9849', '1'),
                rfc('rfc-6066', '3', true),
              ],
            },
          ],
          facts: [
            { label: 'Version', value: 'TLS 1.3', backing: { traces: ['fact-tls'] } },
            { label: 'Certificate for', value: 'techconcepts.app', backing: { traces: ['term-cert', 'why-2', 'fact-tls'] } },
            { label: 'Shared key made by', value: 'X25519 with ML-KEM', backing: { traces: ['fact-kx', 'term-key'] } },
            { label: 'Costs', value: 'one more round trip', backing: { traces: ['fact-tls'] } },
          ],
          events: [
            ...msgOf(
              'fact-tls',
              'term-handshake',
              'fact-watch',
            )({
              tag: 'CLIENT HELLO',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.052s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Hello. I’d like a sealed line to techconcepts.app. Here are the locks I can use.',
              info: 'TLS ClientHello, TLS 1.3, SNI techconcepts.app',
              st: 'Sealing the line',
              rows: [{ key: 'hello', cells: ['TLS hello', 'the name techconcepts.app'] }],
            }),
            ...msgOf(
              'fact-tls',
              'term-handshake',
              'term-cert',
              'term-ca',
            )({
              tag: 'SERVER HELLO',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.085s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Let’s use this lock. Here’s my ID, a certificate signed by an authority you trust.',
              info: 'TLS ServerHello, Certificate, CertificateVerify, Finished',
            }),
            ...msgOf(
              'fact-tls',
              'term-handshake',
              'term-cert',
              'why-2',
              'term-key',
              'term-encrypted',
            )({
              tag: 'FINISHED',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.086s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Your ID checks out. Done: we’re sealed.',
              info: 'TLS Finished (encrypted)',
              st: 'Sealed',
              known: true,
              conn: ['seal', 'laptop>web'],
              rows: [{ key: 'keys', cells: ['The keys', 'nothing: they never crossed'] }],
            }),
          ],
          backing: { traces: ['term-handshake', 'fact-tls', 'term-cert', 'term-ca', 'why-2', 'term-key', 'term-encrypted', 'pattern'] },
        },
        {
          id: 'encrypted-http-exchange',
          title: 'Encrypted HTTP Exchange',
          sub: 'HTTP inside the seal',
          narrative:
            'Now the browser asks for the page in the same plain-text HTTP/1.1 as before: **GET /**, and back comes **200 OK** with the HTML. But each message is locked before it leaves and unlocked when it arrives. Look at the tags on the map. To anyone in between, both are just **encrypted** data, a jumble of bytes of about the right size. They can’t read the page, and if they changed it, the change would be caught.',
          deep: [
            {
              text: 'Each TLS record carries the encrypted HTTP, sealed with a check that catches any change (AES-GCM or ChaCha20-Poly1305). A record altered on the way fails the check, and the connection is dropped. A watcher still sees the sizes and timing of records, and the addresses. The path (such as /account), cookies and passwords are all inside the seal.',
              cite: [
                rfc('rfc-9846', '5.2', true),
                rfc('rfc-9846', '9.1', true),
                F3_9846,
                rfc('rfc-9849', '1'),
                rfc('rfc-9112', '9.7', true),
              ],
            },
          ],
          facts: [
            { label: 'Inside', value: 'GET / HTTP/1.1, then 200 OK', backing: { traces: ['fact-inside'] } },
            { label: 'On the wire', value: 'TLS application data', backing: { traces: ['fact-is'] } },
            { label: 'Cipher', value: 'AES-128-GCM', backing: { traces: ['fact-records'] } },
            { label: 'A watcher sees', value: 'sizes and timing, not the contents', backing: { traces: ['fact-watch', 'term-encrypted'] } },
          ],
          events: [
            ...msgOf(
              'fact-inside',
              'fact-is',
              'fact-rides',
              'term-encrypted',
              'fact-watch',
            )({
              tag: 'ENCRYPTED',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.087s',
              src: LAPTOP,
              dst: WEB,
              size: '437 B',
              sum: 'Inside the seal: GET /, please send the front page.',
              info: 'TLS application data (GET / inside)',
              st: 'Waiting for the page',
              known: true,
              rows: [{ key: 'req', cells: ['The request', 'encrypted data, about 440 bytes'] }],
            }),
            ...msgOf(
              'fact-inside',
              'fact-type',
              'fact-is',
              'fact-rides',
              'term-encrypted',
              'fact-watch',
              'fact-drawing',
              'fact-files',
              'term-html',
            )({
              tag: 'ENCRYPTED',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.124s',
              src: WEB,
              dst: LAPTOP,
              size: '18 KB',
              sum: 'Inside the seal: 200 OK, and the page.',
              info: 'TLS application data (200 OK, text/html inside)',
              st: 'Reading the page',
              known: true,
              rows: [{ key: 'res', cells: ['The reply', 'encrypted data, about 18 KB'] }],
            }),
          ],
          backing: { traces: ['fact-inside', 'fact-type', 'term-html', 'fact-is', 'fact-records', 'term-encrypted', 'fact-watch', 'lead-2', 'pattern'] },
        },
        {
          id: 'secure-session',
          title: 'Secure Session',
          sub: 'The padlock',
          narrative:
            'The rest of the page comes in over the same sealed line, and many browsers show a small **padlock** by the address. It means two things: the line is encrypted, and the site proved it is techconcepts.app. It doesn’t mean the site is honest, only that you’re really talking to it, and privately. Last, the server hands over a **session ticket**, so a later visit can skip the certificate part of the handshake.',
          deep: [
            {
              text: 'The padlock appears only when the certificate is valid, in date and issued for this name, and the whole page came over TLS. Scam sites can have valid certificates too: the padlock proves who you’re talking to, not that they’re trustworthy. Resuming with a ticket (a pre-shared key) skips the certificate, and can even send the first request in the first flight (0-RTT).',
              cite: [
                CF_MIXED,
                EDGE_ICON,
                rfc('rfc-5280', '6.1'),
                rfc('rfc-9525', '6.3'),
                rfc('rfc-8555', '1'),
                rfc('rfc-9846', '2.2', true),
                rfc('rfc-9846', '2.3', true),
              ],
            },
          ],
          facts: [
            { label: 'Padlock means', value: 'encrypted, and the name checked out', backing: { traces: ['term-padlock'] } },
            { label: 'Doesn’t mean', value: 'the site is safe or honest', backing: { traces: ['fact-honest', 'term-padlock'] } },
            { label: 'Next visit', value: 'can resume with the session ticket', backing: { traces: ['fact-ticket'] } },
            { label: 'Certificates last', value: 'a few months, then they’re renewed', backing: { traces: ['fact-validity'] } },
          ],
          events: [
            ...msgOf(
              'fact-inside',
              'fact-files',
              'fact-is',
              'fact-rides',
              'term-encrypted',
              'fact-watch',
            )({
              tag: 'ENCRYPTED',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.140s',
              src: LAPTOP,
              dst: WEB,
              size: '420 B',
              sum: 'Inside the seal: GET /style.css.',
              info: 'TLS application data (GET /style.css inside)',
            }),
            ...msgOf(
              'fact-inside',
              'fact-files',
              'fact-type',
              'fact-drawing',
              'fact-is',
              'fact-rides',
              'term-encrypted',
              'term-padlock',
            )({
              tag: 'ENCRYPTED',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.175s',
              src: WEB,
              dst: LAPTOP,
              size: '6 KB',
              sum: 'Inside the seal: 200 OK, and the stylesheet.',
              info: 'TLS application data (200 OK, text/css inside)',
              st: 'Secure. Page loaded',
              done: true,
              page: 'text',
              hold: { lock: true },
              rows: [{ key: 'page', cells: ['The page itself', 'nothing: it’s sealed'] }],
            }),
            ...msgOf(
              'fact-ticket',
              'fact-tls',
              'fact-is',
              'fact-rides',
              'term-encrypted',
            )({
              tag: 'TICKET',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.176s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Here’s a ticket. Show it next time and we can skip the certificate.',
              info: 'TLS NewSessionTicket (encrypted)',
            }),
          ],
          backing: {
            traces: ['fact-tcp', 'fact-is', 'term-padlock', 'term-encrypted', 'term-cert', 'fact-honest', 'fact-ticket', 'fact-files', 'fact-drawing', 'pattern'],
          },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'HTTPS is HTTP with one extra job before the asking: seal the line.',
            cite: [rfc('rfc-9112', '9.7', true), rfc('rfc-9110', '4.2.2', true)],
          },
          {
            id: 'lead-2',
            text: 'After that the conversation is the same, but only the two ends can read it.',
            cite: [rfc('rfc-9846', '1', true), rfc('rfc-9112', '9.7', true)],
          },
        ],
        terms: [
          {
            id: 'term-https',
            idea: 'HTTP inside a sealed line',
            name: 'HTTPS (HTTP Secure)',
            cite: [rfc('rfc-9112', '9.7', true), rfc('rfc-9110', '4.2.2', true), rfc('rfc-9110', '4.2', true), EDGE_HTTP],
          },
          {
            id: 'term-port',
            idea: 'The door for sealed web traffic',
            name: 'Port 443',
            cite: [rfc('rfc-9110', '4.2.2', true), IANA_PORTS],
          },
          {
            id: 'term-handshake',
            idea: 'Agreeing on the lock and checking the ID',
            name: 'TLS handshake',
            cite: [rfc('rfc-9846', '1', true)],
          },
          {
            id: 'term-cert',
            idea: 'The site’s ID card, signed by someone trusted',
            name: 'Certificate',
            cite: [rfc('rfc-5280', '3.1', true)],
          },
          {
            id: 'term-ca',
            idea: 'Who signs the ID cards',
            name: 'Certificate authority (CA)',
            cite: [rfc('rfc-5280', '3'), C2_9846],
          },
          {
            id: 'term-key',
            idea: 'The same secret, made on both sides',
            name: 'Shared key',
            cite: [rfc('rfc-7748', '6.1'), F1_9846],
          },
          {
            id: 'term-encrypted',
            idea: 'Scrambled so only the two ends can read it',
            name: 'Encrypted',
            cite: [rfc('rfc-9846', '1', true)],
          },
          {
            id: 'term-html',
            idea: 'The text that describes the page',
            name: 'HTML',
            cite: [html('1.3', 'background', true), html('1.10', 'a-quick-introduction-to-html', true)],
          },
          {
            id: 'term-padlock',
            idea: 'The sign that the line is sealed and the name checked out',
            name: 'Padlock',
            cite: [EDGE_ICON, CF_MIXED, EDGE_HTTP],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['DNS Resolution', 'TCP Connection', 'TLS Handshake', 'Encrypted HTTP'],
          note: 'Plain HTTP plus the TLS handshake. Everything after the handshake is sealed.',
          cite: [rfc('rfc-9110', '4.3.3', true), rfc('rfc-9112', '9.7', true), rfc('rfc-9846', '2', true)],
        },
        why: [
          {
            id: 'why-1',
            text: 'Without HTTPS, anyone on the path, café Wi-Fi, a provider, a router on the way, could read your passwords or quietly change the page.',
            cite: [CHROME_SYMBOLS, EDGE_HTTP, rfc('rfc-9110', '4.3.2')],
          },
          {
            id: 'why-2',
            text: 'HTTPS stops both, and the certificate stops someone pretending to be the site.',
            cite: [rfc('rfc-9846', '1', true), rfc('rfc-9110', '4.3.4', true)],
          },
          {
            id: 'why-3',
            text: 'That’s why browsers now warn you about plain HTTP pages.',
            cite: [CHROME_SYMBOLS, EDGE_HTTP],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'Certificates are checked along a chain: the site’s certificate is signed by an intermediate, which is signed by a root certificate the browser or system already trusts.',
            cite: [rfc('rfc-5280', '3.2'), rfc('rfc-5280', '6.1'), CHROME_RESOLVE],
          },
          {
            id: 'deep-2',
            text: 'Authorities such as Let’s Encrypt issue certificates automatically (ACME).',
            cite: [rfc('rfc-8555', '1', true), LE_HOW],
          },
          {
            id: 'deep-3',
            text: 'A wrong name, an expired certificate or an unknown signer gives a full-page warning.',
            cite: [rfc('rfc-9110', '4.3.4', true), CHROME_RESOLVE],
          },
          {
            id: 'deep-4',
            text: 'HSTS tells browsers never to use plain HTTP for a site.',
            cite: [rfc('rfc-6797', '5.2', true)],
          },
        ],
        facts: [
          {
            id: 'fact-port',
            label: 'Port',
            value: '443 (the default for https; plain HTTP: 80)',
            cite: [rfc('rfc-9110', '4.2.2', true), rfc('rfc-9110', '4.2.1', true), IANA_PORTS],
          },
          {
            id: 'fact-is',
            label: 'Is',
            value: 'HTTP over TLS: every HTTP message goes as TLS application data',
            cite: [rfc('rfc-9112', '9.7', true), rfc('rfc-9110', '4.2.2', true)],
          },
          {
            id: 'fact-certs',
            label: 'Certificates',
            value: 'X.509, signed by a CA',
            cite: [rfc('rfc-9846', '4.5.1.2', true), rfc('rfc-5280', '3.1', true)],
          },
          {
            id: 'fact-watch',
            label: 'Watchers still see',
            value: 'addresses and ports, the site’s name (SNI), sizes and timing',
            cite: [rfc('rfc-9849', '1'), rfc('rfc-9846', '1', true), F3_9846, rfc('rfc-6066', '3', true), rfc('rfc-9110', '4.3.3', true)],
          },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 9110, RFC 9846',
            cite: [rfc('rfc-9110', '4.2.2', true), ABSTRACT_9846],
          },
          {
            id: 'fact-used',
            label: 'Used for',
            value: 'web pages, and apps that talk to servers',
            cite: [rfc('rfc-9110', '1.2'), rfc('rfc-9110', '3.5'), rfc('rfc-9114', '1'), EDGE_HTTP],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '7, application', cite: [MS_L7, CF_L7] },
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
            id: 'fact-dns-plain',
            label: 'Plain DNS',
            value: 'not encrypted, so the name you look up shows; DoH (port 443) or DoT (port 853) can hide it',
            cite: [rfc('rfc-9076', '5.1'), rfc('rfc-9076', '1'), rfc('rfc-8484', '1', true), rfc('rfc-8484', '8.1'), rfc('rfc-7858', '3.1', true), CF_DNS],
          },
          {
            id: 'fact-tcp',
            label: 'TCP connection',
            value: 'opened by a handshake of three messages (SYN, SYN-ACK, ACK); HTTP/1.1 keeps it open for more requests by default',
            cite: [rfc('rfc-9293', '3.5', true), rfc('rfc-9293', '3.5.1', true), rfc('rfc-9112', '9.3', true)],
          },
          {
            id: 'fact-rides',
            label: 'Rides on',
            value: 'TCP, which rides on IP (HTTP/3: QUIC, on UDP)',
            cite: [rfc('rfc-9112', '9', true), rfc('rfc-9293', '2.2'), rfc('rfc-9114', '1', true), rfc('rfc-9000', '1')],
          },
          {
            id: 'fact-tls',
            label: 'TLS 1.3 handshake',
            value:
              'runs on the TCP connection: the ClientHello offers locks (cipher suites) and a key share; the server answers with ServerHello, its certificate, CertificateVerify and Finished; the client’s Finished ends it; it costs one round trip, and everything after the key exchange is encrypted',
            cite: [
              ABSTRACT_9846,
              rfc('rfc-9846', '2', true),
              rfc('rfc-9846', '4.2.1', true),
              rfc('rfc-9846', '2.3', true),
              rfc('rfc-9112', '9.7', true),
              rfc('rfc-9001', '1'),
            ],
          },
          {
            id: 'fact-kx',
            label: 'Key exchange',
            value: 'usually X25519, which browsers now pair with ML-KEM, a post-quantum method',
            cite: [ABSTRACT_10024, rfc('rfc-10024', '2', true), CF_PQC],
          },
          {
            id: 'fact-inside',
            label: 'Inside the seal',
            value: 'the same HTTP as before (in HTTP/1.1, plain text), such as GET / HTTP/1.1 and a 200 OK reply',
            cite: [rfc('rfc-9112', '9.7', true), rfc('rfc-9112', '3', true), rfc('rfc-9110', '15.3.1', true), ...PLAIN_TEXT],
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
          {
            id: 'fact-files',
            label: 'Other files',
            value: 'a page names more files, such as a stylesheet (how it looks) and images; each one the browser hasn’t saved is fetched with its own GET',
            cite: [HTML_LINK_STYLESHEET, HTML_IMG, FETCH_REQUESTS_D, rfc('rfc-9110', '9.3.1', true), rfc('rfc-9111', '4.2', true)],
          },
          {
            id: 'fact-records',
            label: 'Records',
            value: 'each is encrypted and checked (AES-128-GCM, AES-256-GCM or ChaCha20-Poly1305); one altered on the way ends the connection',
            cite: [rfc('rfc-9846', '5.2', true), rfc('rfc-9846', '9.1', true)],
          },
          {
            id: 'fact-drawing',
            label: 'Drawing',
            value: 'Drawing waits for a stylesheet the page links to before its body begins, if it applies to this screen, until it has loaded or failed, or a timeout passes.',
            cite: [
              html('4.6.8.23', 'link-type-stylesheet', true),
              html('3.1.6', 'render-blocking-mechanism', true),
              html('8.1.7.3', 'event-loop-processing-model', true),
            ],
          },
          {
            id: 'fact-ticket',
            label: 'Session ticket',
            value: 'after the handshake the server may send a ticket (NewSessionTicket); a later visit can resume with it, skip the certificate, and even send its first request at once (0-RTT)',
            cite: [rfc('rfc-9846', '2.2', true), rfc('rfc-9846', '4.7.1', true), rfc('rfc-9846', '2.3', true)],
          },
          {
            id: 'fact-validity',
            label: 'Certificates last',
            value: 'a few months (90 days is common), then they’re renewed',
            cite: [CF_VALIDITY, LE_FAQ, rfc('rfc-5280', '3.1')],
          },
          {
            id: 'fact-honest',
            label: 'Padlock does not mean',
            value: 'the site is safe or honest: scam sites can have valid certificates too',
            cite: [EDGE_ICON, rfc('rfc-8555', '1')],
          },
        ],
      },
      practice: [
        {
          id: 'cafe-wifi',
          prompt: 'On café Wi-Fi you open an HTTPS page. What can someone else on the Wi-Fi see?',
          options: [
            {
              text: 'Everything, including your password.',
              feedback: 'Not quite. That would be true of plain HTTP. With HTTPS, the page and your password are sealed.',
              cite: [rfc('rfc-9112', '9.7', true), rfc('rfc-9110', '4.2.2', true), CHROME_SYMBOLS, EDGE_HTTP],
            },
            {
              text: 'Which site you went to, but not what you read or typed.',
              feedback: 'Right. The addresses and the name show; what’s inside the seal doesn’t.',
              cite: [rfc('rfc-9849', '1'), rfc('rfc-9846', '1', true), F3_9846],
            },
            {
              text: 'Nothing at all, not even the site.',
              feedback: 'Not quite. The DNS lookup and the name in the TLS hello can show which site it was. The contents stay sealed.',
              cite: [rfc('rfc-9076', '5.1'), rfc('rfc-9849', '1'), rfc('rfc-6066', '3', true)],
            },
          ],
          answer: 1,
        },
        {
          id: 'padlock',
          prompt: 'What does the padlock by the address tell you?',
          options: [
            {
              text: 'The line is encrypted and the site proved its name.',
              feedback: 'Yes. It tells you who you’re talking to, and that nobody else can listen in.',
              cite: [EDGE_ICON, CF_MIXED],
            },
            {
              text: 'The site is safe and honest.',
              feedback: 'Not quite. A scam site can have a padlock too. It only proves the name and the seal.',
              cite: [EDGE_ICON, rfc('rfc-8555', '1')],
            },
            {
              text: 'Your laptop has no viruses.',
              feedback: 'Not quite. The padlock is only about the connection to this site.',
              cite: [EDGE_ICON, CF_MIXED],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
