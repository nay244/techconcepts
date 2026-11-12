import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * TLS/SSL, lesson 14 of How the Internet Works’ 14. The TCP line to techconcepts.app is already open as the part
 * starts (the mockup’s conn0, as the scene’s start), so the map draws it from the Overview on, and the handshake
 * seals that line: ClientHello, ServerHello, the certificate and CertificateVerify, then Finished both ways. The page
 * comes back as application data, then close_notify both ways, and the line closes.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-apps.mjs), changed only where a source
 * does not state them. It tells the handshake What is HTTPS tells, with that lesson's words and citations where the
 * two state one idea. techconcepts.app, the addresses, the client's port 50877, the times, the request’s 437 B and the
 * page’s 18 KB are example data (RFC 5737 and RFC 1918 addresses, an ephemeral port, made-up numbers) and the log’s
 * "3 cipher suites" is this example’s count; the messages’ own sizes are a dash, because no source states one. The
 * two strangers shouting across a room are an analogy and cite nothing. No standard places TLS at an OSI layer, so the
 * badge spans. The page cue on the reply is gone: this story fetches no stylesheet or picture, so nothing draws.
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
const B4_9846 = rfcAt('rfc-9846', 'B.4', 9846, 'appendix-B.4', true);
const E5_9846 = rfcAt('rfc-9846', 'E.5', 9846, 'appendix-E.5', true);
const F11_9846 = rfcAt('rfc-9846', 'F.1.1', 9846, 'appendix-F.1.1');
const F2_9846 = rfcAt('rfc-9846', 'F.2', 9846, 'appendix-F.2');
const RFC5869_ABSTRACT = rfcAt('rfc-5869', 'Abstract', 5869, 'abstract', true);
const RFC8996_ABSTRACT = rfcAt('rfc-8996', 'Abstract', 8996, 'abstract');
const RFC9162_ABSTRACT = rfcAt('rfc-9162', 'Abstract', 9162, 'abstract', true);

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

/** NIST's PDFs have no section anchors, so a section is cited by the PDF page it starts on. */
const NIST_52 = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf';
const NIST_52_INTRO = cite('nist-sp800-52r2', '1', { url: `${NIST_52}#page=10` });
const NIST_52_REVOCATION = cite('nist-sp800-52r2', '4.2.2', { url: `${NIST_52}#page=44` });
const NIST_52_CT = cite('nist-sp800-52r2', '3.4.2.15', { url: `${NIST_52}#page=36` });
const NIST_52_HISTORY = cite('nist-sp800-52r2', '1.1', { url: `${NIST_52}#page=10` });
const NIST_77_SSLVPN = cite('nist-sp800-77r1', '8.2', { url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf#page=105' });

const MS_TLS = 'https://learn.microsoft.com/en-us/windows-server/security/tls/transport-layer-security-protocol';
const MS_TLS_LAYERS = vendor('microsoft-tls-protocol', MS_TLS, 'Transport Layer Security protocol', 'The%20TLS%20%28and%20SSL%29%20protocols%20are%20located');
const MS_TLS_TCP = vendor('microsoft-tls-protocol', MS_TLS, 'Transport Layer Security protocol', 'TLS%20and%20SSL%20assume');
const MS_SQL_RTT = vendor(
  'microsoft-sql-tls-1-3',
  'https://learn.microsoft.com/en-us/sql/relational-databases/security/networking/tls-1-3?view=sql-server-ver17',
  'Differences between TLS 1.2 and TLS 1.3',
  'TLS%201.3%20reduces%20the%20number%20of%20round%20trips',
);
const MS_APP_SERVICE = 'https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate';
const MS_APP_SERVICE_NAME = vendor('microsoft-app-service-certificates', MS_APP_SERVICE, 'Add and manage TLS/SSL certificates in Azure App Service', 'The%20certificates%20are%20currently%20called');
const MS_APP_SERVICE_KX = vendor('microsoft-app-service-certificates', MS_APP_SERVICE, 'Frequently asked questions', 'X25519MLKEM768%20combines');
const PA_RTT = vendor('paloalto-tls-handshake', 'https://www.paloaltonetworks.com/cyberpedia/what-is-a-tls-handshake', 'TLS Handshake FAQs', 'A%20standard%20TLS%201.2%20handshake');
const PA_MTLS = vendor('paloalto-tls-handshake', 'https://www.paloaltonetworks.com/cyberpedia/what-is-a-tls-handshake', 'TLS Handshake FAQs', 'also%20known%20as%20Mutual%20TLS');
const PA_SSL_CERT = vendor('paloalto-tls-certificate', 'https://www.paloaltonetworks.com/cyberpedia/what-is-tls-certificate', 'TLS vs SSL Certificates', 'While%20the%20term');
const CF_MTLS = vendor('cloudflare-client-certificates', 'https://developers.cloudflare.com/ssl/client-certificates/', 'Client certificates (mTLS)', 'Mutual%20TLS%20%28mTLS%29%20adds');

const EDGE_SECURE = 'https://support.microsoft.com/en-us/edge/securely-browse-the-web-in-microsoft-edge';
const EDGE_ICON = vendor('microsoft-edge-secure', EDGE_SECURE, 'Verify the connection icon in the address bar', 'Verify%20the%20connection%20icon%20in%20the%20address%20bar');
const CHROME_SECURE = 'https://support.google.com/chrome/answer/95617';
const CHROME_RESOLVE = vendor('google-chrome-secure', CHROME_SECURE, 'Resolve security and connection issues', 'Resolve%20security%20and%20connection%20issues');
const CF_PQC = vendor(
  'cloudflare-pqc-support',
  'https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-support/',
  'Browsers',
  'Default%20in%20Chrome%20131',
);

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50877';
const WEB = '198.51.100.7:443';

const handshake: TableDef = {
  id: 'handshake',
  title: 'The handshake so far',
  by: 'what each side has said and checked',
  columns: [
    { key: 'item', label: 'Item' },
    { key: 'value', label: 'Value', prose: true },
  ],
  keyColumn: 'item',
  initialRows: [],
  empty: 'Nothing yet. The TCP line is open, but neither side has said hello.',
};

const mockup = messagesFor(handshake);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-tls',
  title: 'TLS/SSL',
  subtitle: 'The seal itself',
  level: 'beginner',
  certTags: [],
  summary:
    'TLS is the seal that HTTPS, secure email and many apps use. In one quick exchange the two sides agree on secret keys and the server proves who it is with a certificate. Everything after that is private and can’t be changed on the way.',
  figure: 'net-map',
  backing: { traces: ['fact-purpose', 'fact-used', 'fact-handshake', 'term-cert', 'fact-gives', 'fact-records'] },
  units: [
    {
      id: 'tls',
      name: 'TLS/SSL',
      fullName: 'Transport Layer Security (SSL is its old name)',
      purpose: 'The seal itself',
      group: 'security',
      osi: 'spans',
      backing: { traces: ['fact-stands', 'fact-purpose', 'fact-retired'] },
      scene: {
        title: 'The handshake that seals a line, step by step',
        views: ['network', 'sequence'],
        layers: ['tls:web'],
        labels: { laptop: 'Wants a sealed line', url: 'techconcepts.app' },
        start: [{ cue: 'conn', arg: 'open laptop>web' }],
        panel: { type: 'table', table: handshake },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'web', label: 'Web server', addr: '198.51.100.7' },
        ],
        backing: { traces: ['pattern', 'fact-runs-on', 'fact-handshake', 'fact-inside'] },
      },
      overview: {
        hook: 'TLS is the seal that HTTPS, secure email and many apps use. In one quick exchange the two sides agree on secret keys and the server proves who it is with a certificate. Everything after that is private and can’t be changed on the way.',
        hookBacking: { traces: ['fact-used', 'fact-handshake', 'term-cert', 'fact-gives', 'fact-records'] },
        description:
          'Imagine two strangers who must agree on a secret code while shouting across a crowded room, where one of them must also prove who they are. TLS does both, with some clever maths and a signed ID card, the certificate. Here your browser seals a line to techconcepts.app, over a TCP connection that’s already open.',
        backing: { analogy: true },
        facts: [
          { label: 'Used by', value: 'HTTPS, secure email, many apps', backing: { traces: ['fact-used'] } },
          { label: 'Current version', value: 'TLS 1.3', backing: { traces: ['fact-current'] } },
          { label: 'SSL', value: 'the old name; every SSL version is retired', backing: { traces: ['fact-retired', 'fact-stands'] } },
          { label: 'Proves identity with', value: 'certificates', backing: { traces: ['term-cert', 'fact-gives'] } },
          { label: 'Sits', value: 'between TCP and the app', backing: { traces: ['fact-runs-on'] } },
          { label: 'This example', value: 'techconcepts.app, port 443', backing: { traces: ['fact-inside'] } },
        ],
      },
      steps: [
        {
          id: 'clienthello',
          title: 'ClientHello',
          sub: 'What I can do',
          narrative:
            'The TCP line to techconcepts.app is already open. The browser starts the seal with a **ClientHello**: the TLS versions it speaks, the **cipher suites** it can use (the kinds of lock), a random number, the site’s name, and a **key share**, the public half of a key it has just made up. It sends that half straight away, guessing which method the server will pick, to save a round trip.',
          deep: [
            {
              text: 'TLS 1.3 has five cipher suites, such as TLS_AES_128_GCM_SHA256 and TLS_CHACHA20_POLY1305_SHA256. The site’s name goes in the server_name extension (SNI), unencrypted, so one server can hold certificates for many sites. The supported groups list the key-exchange methods. Browsers now put a post-quantum hybrid first: X25519 with ML-KEM, named X25519MLKEM768.',
              cite: [
                B4_9846,
                rfc('rfc-9849', '1'),
                rfc('rfc-6066', '3', true),
                rfc('rfc-9846', '4.5.1.2', true),
                rfc('rfc-9846', '4.3.7', true),
                ABSTRACT_10024,
                rfc('rfc-10024', '2', true),
                CF_PQC,
              ],
            },
          ],
          facts: [
            { label: 'Versions', value: 'TLS 1.3, 1.2', backing: { traces: ['fact-current'] } },
            { label: 'Cipher suites', value: 'AES-128-GCM, ChaCha20-Poly1305 and others', backing: { traces: ['term-suite', 'fact-records'] } },
            { label: 'Name (SNI)', value: 'techconcepts.app, in plain view', backing: { traces: ['fact-sni'] } },
            { label: 'Key share', value: 'the public half, for X25519 with ML-KEM', backing: { traces: ['term-keyshare', 'fact-kx'] } },
          ],
          events: [
            ...msgOf(
              'fact-runs-on',
              'fact-handshake',
              'fact-inside',
              'term-clienthello',
              'term-suite',
              'term-keyshare',
              'fact-sni',
              'fact-current',
              'fact-kx',
            )({
              tag: 'CLIENT HELLO',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.000s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Hello. I speak TLS 1.3, here are my locks, and here’s half a key.',
              info: 'ClientHello: TLS 1.3, 3 cipher suites, SNI techconcepts.app, key share X25519 with ML-KEM',
              st: 'Sealing the line',
              rows: [{ key: 'sni', cells: ['Name asked for', 'techconcepts.app'] }],
            }),
          ],
          backing: {
            traces: ['term-clienthello', 'term-suite', 'term-keyshare', 'fact-current', 'fact-sni', 'fact-kx', 'fact-handshake', 'fact-runs-on'],
          },
        },
        {
          id: 'serverhello',
          title: 'ServerHello',
          sub: 'Here’s what we’ll use',
          narrative:
            'The server answers with a **ServerHello**: it picks TLS 1.3 and one cipher suite, and sends its own key share. Now each side has the other’s public half and its own secret half, and the maths gives both the same **shared secret**. It never crossed the network, so nobody watching can work it out. From this message on, everything the server sends is already encrypted.',
          deep: [
            {
              text: 'This is elliptic-curve Diffie-Hellman, X25519, paired here with ML-KEM, a post-quantum method. Every connection uses fresh key shares, so someone who records the traffic and later steals the server’s private key still can’t unlock it; that’s forward secrecy. From the shared secret, both sides derive separate keys for each direction (with HKDF). If the client guessed the wrong method, the server sends a HelloRetryRequest, costing a round trip.',
              cite: [
                rfc('rfc-9846', '7.4.2', true),
                ABSTRACT_10024,
                rfc('rfc-10024', '2', true),
                CF_PQC,
                rfc('rfc-9846', '4.3.8', true),
                F1_9846,
                rfc('rfc-9846', '7.3', true),
                F11_9846,
                RFC5869_ABSTRACT,
                rfc('rfc-9846', '4.2.1', true),
              ],
            },
          ],
          facts: [
            { label: 'Version', value: 'TLS 1.3', backing: { traces: ['fact-current'] } },
            { label: 'Cipher suite', value: 'TLS_AES_128_GCM_SHA256', backing: { traces: ['term-suite', 'fact-records'] } },
            { label: 'Key exchange', value: 'X25519 with ML-KEM', backing: { traces: ['fact-kx'] } },
            { label: 'Forward secrecy', value: 'yes: fresh keys every time', backing: { traces: ['fact-fs'] } },
          ],
          events: [
            ...msgOf(
              'fact-runs-on',
              'fact-handshake',
              'fact-inside',
              'term-serverhello',
              'term-suite',
              'term-shared',
              'fact-current',
              'fact-kx',
              'fact-records',
            )({
              tag: 'SERVER HELLO',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.032s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Let’s use TLS 1.3 and AES-128-GCM. Here’s my half of the key.',
              info: 'ServerHello: TLS 1.3, TLS_AES_128_GCM_SHA256, key share X25519 with ML-KEM',
              st: 'Shared keys made',
              known: true,
              rows: [
                { key: 'ver', cells: ['Version', 'TLS 1.3'] },
                { key: 'suite', cells: ['Cipher suite', 'TLS_AES_128_GCM_SHA256'] },
                { key: 'kx', cells: ['Key exchange', 'X25519 with ML-KEM'] },
              ],
            }),
          ],
          backing: {
            traces: ['term-serverhello', 'term-suite', 'term-shared', 'fact-kx', 'fact-fs', 'fact-keys', 'fact-handshake', 'fact-records'],
          },
        },
        {
          id: 'certificate-verification',
          title: 'Certificate Verification',
          sub: 'Prove who you are',
          narrative:
            'Anyone could do the key maths, an impostor included. So the server sends its **certificate**, a document saying “this key belongs to techconcepts.app”, signed by a **certificate authority** (CA). The browser checks three things: the name matches, the dates are valid, and the signatures lead back to a CA it already trusts. Then the server signs the whole handshake with its private key, the **CertificateVerify**, to prove the certificate is really its own.',
          deep: [
            {
              text: 'The server sends a chain: its own certificate and an intermediate CA’s. The root CA is already in the browser’s or system’s trust store. The browser also checks the certificate hasn’t been revoked, and certificates are recorded in public Certificate Transparency logs, where anyone can spot one issued by mistake. A self-signed certificate isn’t trusted, because nobody vouches for it.',
              cite: [
                rfc('rfc-9846', '4.5.1', true),
                rfc('rfc-5280', '3.2'),
                rfc('rfc-5280', '6.1', true),
                rfc('rfc-5280', '6.1.3', true),
                NIST_52_REVOCATION,
                RFC9162_ABSTRACT,
                NIST_52_CT,
                rfc('rfc-6797', '11.3'),
                EDGE_ICON,
                CHROME_RESOLVE,
              ],
            },
          ],
          facts: [
            { label: 'Certificate for', value: 'techconcepts.app', backing: { traces: ['term-cert'] } },
            { label: 'Signed by', value: 'an intermediate CA, under a trusted root', backing: { traces: ['fact-chain'] } },
            { label: 'Checks', value: 'name, dates, chain of signatures', backing: { traces: ['fact-checks'] } },
            { label: 'Proof of the key', value: 'CertificateVerify', backing: { traces: ['fact-certverify'] } },
          ],
          events: [
            ...msgOf(
              'fact-runs-on',
              'fact-handshake',
              'fact-inside',
              'term-cert',
              'term-ca',
              'fact-certs',
              'fact-chain',
              'fact-checks',
            )({
              tag: 'CERTIFICATE',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.032s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'My certificate, signed by a CA you trust.',
              info: 'Certificate: techconcepts.app, chain of 2 (encrypted)',
              rows: [
                { key: 'cert', cells: ['Name on certificate', 'techconcepts.app ✓'] },
                { key: 'ca', cells: ['Signed by', 'a CA the laptop trusts ✓'] },
              ],
            }),
            ...msgOf(
              'fact-runs-on',
              'fact-handshake',
              'fact-inside',
              'fact-certverify',
              'fact-checks',
            )({
              tag: 'CERT VERIFY',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.032s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'And my signature on everything so far, made with that certificate’s key.',
              info: 'CertificateVerify: ecdsa_secp256r1_sha256 (encrypted)',
              st: 'Server checked',
              known: true,
              rows: [{ key: 'own', cells: ['Server owns that key', 'yes ✓'] }],
            }),
          ],
          backing: {
            traces: ['term-cert', 'term-ca', 'fact-checks', 'fact-chain', 'fact-certverify', 'fact-certs', 'fact-handshake'],
          },
        },
        {
          id: 'handshake-finished',
          title: 'Handshake Finished',
          sub: 'Ready',
          narrative:
            'Each side ends with a **Finished** message: a short code worked out from every handshake message so far, using the new keys. If anyone had changed a single byte on the way, the codes wouldn’t match and the connection would stop. The server’s Finished arrives, the browser checks it and sends its own. The whole handshake took one round trip, and the line is sealed.',
          deep: [
            {
              text: 'Finished carries an HMAC over a hash of the whole handshake. In TLS 1.3, the server’s EncryptedExtensions, Certificate, CertificateVerify and Finished all arrive in one flight right after the ServerHello; this walkthrough takes them one at a time to show each job. A resumed connection can even send data with its very first message (0-RTT), at the cost of replay protection.',
              cite: [
                rfc('rfc-9846', '4.5.3', true),
                rfc('rfc-9846', '4.1', true),
                rfc('rfc-9846', '4.4.1', true),
                rfc('rfc-9846', '4.5', true),
                rfc('rfc-9846', '2.3', true),
              ],
            },
          ],
          facts: [
            { label: 'Server sends', value: 'Finished', backing: { traces: ['term-finished'] } },
            { label: 'Browser sends', value: 'Finished', backing: { traces: ['term-finished'] } },
            { label: 'Proves', value: 'nobody changed the handshake', backing: { traces: ['term-finished'] } },
            { label: 'Round trips', value: 'one (TLS 1.2 took two)', backing: { traces: ['fact-rtt'] } },
          ],
          events: [
            ...msgOf('fact-runs-on', 'fact-handshake', 'fact-inside', 'term-finished')({
              tag: 'FINISHED',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.032s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'That’s my side of the handshake, and here’s its code.',
              info: 'Finished (server, encrypted)',
            }),
            ...msgOf('fact-runs-on', 'fact-handshake', 'fact-inside', 'term-finished', 'fact-rtt')({
              tag: 'FINISHED',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.033s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Your code matches. Here’s mine. We’re sealed.',
              info: 'Finished (client, encrypted)',
              st: 'Sealed',
              known: true,
              conn: ['seal', 'laptop>web'],
              rows: [{ key: 'fin', cells: ['Handshake', 'complete and untouched ✓'] }],
            }),
          ],
          backing: { traces: ['term-finished', 'fact-handshake', 'fact-rtt', 'fact-0rtt'] },
        },
        {
          id: 'encrypted-application-data',
          title: 'Encrypted Application Data',
          sub: 'Sealed messages',
          narrative:
            'Now the app’s own messages go through the seal. Here the browser’s HTTP request goes out as **application data**: encrypted with the shared key, plus a tag that proves it wasn’t changed. On the map the tags just say ENCRYPTED, because that’s all anyone in between can see. The server unlocks the request, and its reply comes back the same way.',
          deep: [
            {
              text: 'Each message is sealed in one or more TLS records of up to 16 KB, with AEAD (here AES-128-GCM), which encrypts and authenticates in one go. Every record has its own sequence number, so records can’t be replayed or reordered. Keys can be refreshed mid-connection with KeyUpdate. A watcher still sees each record’s size and timing.',
              cite: [
                rfc('rfc-9846', '5.1', true),
                rfc('rfc-9846', '5.2', true),
                rfc('rfc-9846', '5.3', true),
                F2_9846,
                rfc('rfc-9846', '4.7.3', true),
                F3_9846,
              ],
            },
          ],
          facts: [
            { label: 'Record type', value: 'application data', backing: { traces: ['fact-records', 'fact-inside'] } },
            { label: 'Cipher', value: 'AES-128-GCM', backing: { traces: ['fact-records'] } },
            { label: 'Each record', value: 'up to 16 KB, numbered', backing: { traces: ['fact-records'] } },
            { label: 'Changed on the way?', value: 'detected, and the connection drops', backing: { traces: ['fact-records'] } },
          ],
          events: [
            ...msgOf('fact-runs-on', 'fact-inside', 'fact-records')({
              tag: 'ENCRYPTED',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '0.034s',
              src: LAPTOP,
              dst: WEB,
              size: '437 B',
              sum: 'Inside the seal: GET /.',
              info: 'Application data, 437 bytes',
            }),
            ...msgOf('fact-runs-on', 'fact-inside', 'fact-records')({
              tag: 'ENCRYPTED',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '0.071s',
              src: WEB,
              dst: LAPTOP,
              size: '18 KB',
              sum: 'Inside the seal: 200 OK, and the page.',
              info: 'Application data, 18 KB',
              st: 'Page received, sealed',
              known: true,
            }),
          ],
          backing: { traces: ['fact-inside', 'fact-records', 'fact-runs-on'] },
        },
        {
          id: 'close-notify',
          title: 'Close Notify',
          sub: 'Close safely',
          narrative:
            'When the browser is done, it doesn’t just hang up. It sends a **close_notify** alert, sealed like everything else: “I’m finished sending.” The server replies with its own. That way neither side can be fooled by someone cutting the line early and pretending a message was complete. Then TCP closes the connection underneath.',
          deep: [
            {
              text: 'TLS alerts carry a level and a description: close_notify ends a connection normally, and others report errors, such as bad_certificate, handshake_failure or decrypt_error. Cutting a connection without close_notify, to make a download look complete, is a truncation attack. SSL 2.0 and 3.0, TLS 1.0 and TLS 1.1 are all retired; use 1.2 or 1.3.',
              cite: [
                rfc('rfc-9846', '6', true),
                rfc('rfc-9846', '6.1', true),
                rfc('rfc-9846', '6.2', true),
                rfc('rfc-6176', '2'),
                E5_9846,
                RFC8996_ABSTRACT,
                rfc('rfc-9325', '3.1.1'),
              ],
            },
          ],
          facts: [
            { label: 'Alert', value: 'close_notify', backing: { traces: ['term-close'] } },
            { label: 'Sent', value: 'sealed, both ways', backing: { traces: ['term-close', 'fact-trunc'] } },
            { label: 'Stops', value: 'truncation attacks', backing: { traces: ['fact-trunc'] } },
            { label: 'Then', value: 'TCP FIN', backing: { traces: ['fact-runs-on'] } },
          ],
          events: [
            ...msgOf('fact-runs-on', 'fact-inside', 'term-close', 'fact-trunc')({
              tag: 'CLOSE NOTIFY',
              from: 'laptop',
              to: 'web',
              proto: 'TLS',
              via: 'TCP',
              kind: 'request',
              time: '5.000s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'I’m finished sending.',
              info: 'Alert: close_notify (encrypted)',
            }),
            ...msgOf('fact-runs-on', 'fact-inside', 'term-close', 'fact-trunc')({
              tag: 'CLOSE NOTIFY',
              from: 'web',
              to: 'laptop',
              proto: 'TLS',
              via: 'TCP',
              kind: 'response',
              time: '5.032s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Me too. Goodbye.',
              info: 'Alert: close_notify (encrypted)',
              st: 'Closed safely',
              done: true,
              conn: ['close', 'laptop>web'],
            }),
          ],
          backing: { traces: ['term-close', 'fact-trunc', 'fact-runs-on', 'fact-retired'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'In one round trip, two strangers agreed on secret keys in plain view, one proved who it was, and both checked that nobody had meddled.',
            cite: [rfc('rfc-9846', '2', true), F1_9846],
          },
        ],
        terms: [
          { id: 'term-clienthello', idea: '“Here’s what I can do”', name: 'ClientHello', cite: [rfc('rfc-9846', '4.2.2', true), rfc('rfc-9846', '2', true)] },
          { id: 'term-serverhello', idea: '“Here’s what we’ll use”', name: 'ServerHello', cite: [rfc('rfc-9846', '2', true), rfc('rfc-9846', '4.2.3', true)] },
          { id: 'term-suite', idea: 'A set of methods for the lock', name: 'Cipher suite', cite: [B4_9846] },
          { id: 'term-keyshare', idea: 'The public half of a key, sent across', name: 'Key share', cite: [rfc('rfc-9846', '4.3.8', true), rfc('rfc-9846', '7.4.2', true)] },
          { id: 'term-shared', idea: 'The same secret, made on both sides', name: 'Shared secret', cite: [rfc('rfc-7748', '6.1'), F1_9846] },
          { id: 'term-cert', idea: 'The site’s ID, signed by someone trusted', name: 'Certificate', cite: [rfc('rfc-5280', '3.1', true)] },
          { id: 'term-ca', idea: 'The organisation that signs certificates', name: 'Certificate authority (CA)', cite: [rfc('rfc-5280', '3'), C2_9846] },
          { id: 'term-finished', idea: 'Proof that nobody changed the handshake', name: 'Finished', cite: [rfc('rfc-9846', '4.5.3', true), rfc('rfc-9846', '2', true)] },
          { id: 'term-close', idea: '“I’m done”, sealed', name: 'close_notify', cite: [rfc('rfc-9846', '6.1', true), rfc('rfc-9846', '6', true)] },
        ],
        pattern: {
          id: 'pattern',
          names: ['ClientHello', 'ServerHello', 'Certificate', 'Finished', 'Application Data'],
          note: 'Every full handshake starts this way; a resumed one skips the certificate. After Finished, the app’s data goes sealed until close_notify.',
          cite: [rfc('rfc-9846', '2', true), rfc('rfc-9846', '2.2', true), rfc('rfc-9846', '4.7', true)],
        },
        why: [
          {
            id: 'why-1',
            text: 'TLS gives any app three things at once: privacy (nobody can read it), integrity (nobody can change it unnoticed) and authentication (you know who’s on the other end).',
            cite: [rfc('rfc-9846', '1', true)],
          },
          {
            id: 'why-2',
            text: 'HTTPS, secure email, VPNs and many other apps borrow it instead of inventing their own.',
            cite: [rfc('rfc-9325', '1'), NIST_77_SSLVPN, NIST_52_INTRO, rfc('rfc-9846', '1', true)],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'SSL was Netscape’s original (SSL 2.0 in 1995, 3.0 in 1996).',
            cite: [NIST_52_HISTORY, rfc('rfc-6176', '6.2'), rfc('rfc-7568', '1')],
          },
          {
            id: 'deep-2',
            text: 'TLS 1.0 followed in 1999, 1.2 in 2008, and 1.3 in 2018, which cut the handshake to one round trip and removed old, weak options such as RSA key exchange, CBC ciphers, RC4 and SHA-1.',
            cite: [
              RFC8996_ABSTRACT,
              rfc('rfc-9325', '3.1.1'),
              rfc('rfc-7568', '1'),
              MS_SQL_RTT,
              PA_RTT,
              NIST_52_HISTORY,
              rfc('rfc-9846', '1.3', true),
              E5_9846,
            ],
          },
          {
            id: 'deep-3',
            text: '“SSL certificate” is still the everyday name for a TLS certificate.',
            cite: [PA_SSL_CERT, MS_APP_SERVICE_NAME],
          },
          {
            id: 'deep-4',
            text: 'Mutual TLS (mTLS) asks the client for a certificate too.',
            cite: [rfc('rfc-9846', '4.4.2', true), CF_MTLS, PA_MTLS],
          },
        ],
        facts: [
          { id: 'fact-current', label: 'Current', value: 'TLS 1.3 (1.2 still common)', cite: [ABSTRACT_9846, rfc('rfc-9852', '1'), rfc('rfc-9325', '3.1.1')] },
          { id: 'fact-retired', label: 'Retired', value: 'SSL 2.0, 3.0, TLS 1.0, 1.1', cite: [E5_9846, RFC8996_ABSTRACT, rfc('rfc-9325', '3.1.1')] },
          { id: 'fact-gives', label: 'Gives', value: 'privacy, integrity, authentication', cite: [rfc('rfc-9846', '1', true)] },
          { id: 'fact-certs', label: 'Certificates', value: 'X.509, from a CA', cite: [rfc('rfc-9846', '4.5.1.2', true), rfc('rfc-5280', '3.1', true)] },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 9846', cite: [ABSTRACT_9846] },
          {
            id: 'fact-handshake',
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
            id: 'fact-runs-on',
            label: 'Runs on',
            value: 'a TCP connection already opened by TCP’s three-way handshake; TLS sits between TCP and the app, and when it is done, TCP closes the connection (FIN)',
            cite: [
              rfc('rfc-9846', '1', true),
              NIST_52_INTRO,
              MS_TLS_LAYERS,
              MS_TLS_TCP,
              rfc('rfc-9293', '3.5', true),
              rfc('rfc-9293', '3.1', true),
              rfc('rfc-9293', '3.6', true),
              rfc('rfc-9112', '9.7', true),
            ],
          },
          {
            id: 'fact-inside',
            label: 'Here, inside the seal',
            value: 'HTTPS: the browser’s HTTP, such as GET / and a 200 OK reply, sent as TLS application data on TCP port 443',
            cite: [rfc('rfc-9112', '9.7', true), rfc('rfc-9110', '4.2.2', true), rfc('rfc-9112', '3', true), rfc('rfc-9110', '15.3.1', true), IANA_PORTS],
          },
          {
            id: 'fact-used',
            label: 'Used by',
            value: 'HTTPS, secure email, VPNs and many other apps',
            cite: [rfc('rfc-9325', '1'), rfc('rfc-9112', '9.7', true), rfc('rfc-8314', '1', true), NIST_77_SSLVPN],
          },
          {
            id: 'fact-sni',
            label: 'Name (SNI)',
            value: 'the ClientHello names the site in plain text, so one server can hold certificates for many sites',
            cite: [rfc('rfc-9849', '1'), rfc('rfc-6066', '3', true), rfc('rfc-9846', '4.5.1.2', true)],
          },
          {
            id: 'fact-kx',
            label: 'Key exchange',
            value: 'usually X25519, which browsers now pair with ML-KEM, a post-quantum method (together named X25519MLKEM768)',
            cite: [ABSTRACT_10024, rfc('rfc-10024', '2', true), CF_PQC],
          },
          {
            id: 'fact-fs',
            label: 'Forward secrecy',
            value: 'fresh key shares for every connection, so a private key stolen later can’t unlock recorded traffic',
            cite: [rfc('rfc-9846', '4.3.8', true), F1_9846],
          },
          {
            id: 'fact-keys',
            label: 'Keys',
            value: 'derived from the shared secret with HKDF, separate for each direction',
            cite: [rfc('rfc-9846', '7.3', true), F11_9846, RFC5869_ABSTRACT],
          },
          {
            id: 'fact-checks',
            label: 'Certificate checks',
            value: 'the name matches, the dates are valid, the signatures lead back to a CA the browser trusts, and it hasn’t been revoked',
            cite: [rfc('rfc-9525', '6.3', true), rfc('rfc-5280', '6.1.3', true), rfc('rfc-5280', '6.1', true), C2_9846, NIST_52_REVOCATION],
          },
          {
            id: 'fact-chain',
            label: 'Chain',
            value: 'the site’s certificate is signed by an intermediate, which is signed by a root certificate the browser or system already trusts',
            cite: [rfc('rfc-5280', '3.2'), rfc('rfc-5280', '6.1'), CHROME_RESOLVE, rfc('rfc-9846', '4.5.1', true)],
          },
          {
            id: 'fact-certverify',
            label: 'CertificateVerify',
            value: 'the server’s signature over the whole handshake with its certificate’s private key (such as ecdsa_secp256r1_sha256), proving the certificate is its own',
            cite: [rfc('rfc-9846', '4.5.2', true), rfc('rfc-9846', '4.3.3', true)],
          },
          {
            id: 'fact-rtt',
            label: 'Round trips',
            value: 'one for a TLS 1.3 handshake; TLS 1.2 took two',
            cite: [rfc('rfc-9846', '2.3', true), MS_SQL_RTT, PA_RTT],
          },
          {
            id: 'fact-records',
            label: 'Records',
            value:
              'each up to 16 KB, encrypted and checked with AEAD (AES-128-GCM, AES-256-GCM or ChaCha20-Poly1305) and numbered, so none can be replayed or reordered; one altered on the way ends the connection',
            cite: [
              rfc('rfc-9846', '5.1', true),
              rfc('rfc-9846', '5.2', true),
              rfc('rfc-9846', '5.3', true),
              rfc('rfc-9846', '9.1', true),
              F2_9846,
              rfc('rfc-5116', '5.1', true),
            ],
          },
          {
            id: 'fact-0rtt',
            label: '0-RTT',
            value: 'a resumed connection may send data in its first message, but that data can be replayed',
            cite: [rfc('rfc-9846', '2.3', true), rfc('rfc-9846', '2.2', true)],
          },
          {
            id: 'fact-trunc',
            label: 'close_notify',
            value: 'each side says it has finished sending, so a cut-off connection can’t pass for a complete one (a truncation attack); other alerts report errors',
            cite: [rfc('rfc-9846', '6.1', true), rfc('rfc-9846', '6', true), rfc('rfc-6176', '2')],
          },
          {
            id: 'fact-stands',
            label: 'Stands for',
            value: 'Transport Layer Security; SSL (Secure Sockets Layer) is its old name',
            cite: [ABSTRACT_9846, NIST_77_SSLVPN, MS_APP_SERVICE_NAME],
          },
          {
            id: 'fact-purpose',
            label: 'Purpose',
            value: 'the seal itself: a secure channel between two ends, private and unchanged, with the server’s identity checked',
            cite: [rfc('rfc-9846', '1', true)],
          },
        ],
      },
      practice: [
        {
          id: 'same-secret',
          prompt: 'How do the browser and the server end up with the same secret key?',
          options: [
            {
              text: 'The server sends it, protected by a password.',
              feedback: 'Not quite. The key itself never crosses the network.',
              cite: [F1_9846, rfc('rfc-7748', '6.1')],
            },
            {
              text: 'Each sends a public half, and combining the halves gives both the same secret.',
              feedback: 'Right. That’s the key exchange, and nobody watching can work the secret out.',
              cite: [rfc('rfc-7748', '6.1'), F1_9846, rfc('rfc-9846', '2', true)],
            },
            {
              text: 'It’s inside the certificate.',
              feedback: 'Not quite. The certificate proves who the server is. The key comes from the key exchange.',
              cite: [MS_APP_SERVICE_KX, rfc('rfc-9846', '2', true)],
            },
          ],
          answer: 1,
        },
        {
          id: 'certificate-proves',
          prompt: 'What does the certificate prove?',
          options: [
            {
              text: 'That the key really belongs to techconcepts.app.',
              feedback: 'Yes. A trusted CA vouches for the name and the key.',
              cite: [rfc('rfc-5280', '3.1', true)],
            },
            {
              text: 'That the site has no viruses.',
              feedback: 'Not quite. A certificate says nothing about what’s on the site, only who it is.',
              cite: [rfc('rfc-5280', '3.1', true), EDGE_ICON],
            },
            {
              text: 'That the line is encrypted.',
              feedback: 'Not quite. The keys from the key exchange do the encrypting. The certificate proves identity.',
              cite: [rfc('rfc-9846', '1', true), MS_APP_SERVICE_KX],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
