import { eventLog, messagesFor } from '../../helpers/internet-events';
import type { LegacyUnitInput } from '../../legacy';
import type { TableDef } from '../../schema';

/**
 * TLS/SSL, protocol 14 of How the Internet Works’ 14. The TCP line to techconcepts.app is already open as the part
 * starts (the mockup’s conn0, as the scene’s start), so the map draws it from the Overview on, and the handshake
 * seals that line: ClientHello, ServerHello, the certificate and CertificateVerify, then Finished both ways. The page
 * comes back as application data, then close_notify both ways, and the line closes.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-apps.mjs), ported as written.
 */

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

const msg = messagesFor(handshake);

const tls: LegacyUnitInput = {
  id: 'tls',
  name: 'TLS/SSL',
  fullName: 'Transport Layer Security (SSL is its old name)',
  purpose: 'The seal itself',
  group: 'security',
  osiLayers: [6],
  references: [
    { label: 'RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446' },
  ],
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
  },
  overview: {
    hook: 'TLS is the seal that HTTPS, secure email and many apps use. In one quick exchange the two sides agree on secret keys and the server proves who it is with a certificate. Everything after that is private and can’t be changed on the way.',
    description:
      'Imagine two strangers who must agree on a secret code while shouting across a crowded room, where one of them must also prove who they are. TLS does both, with some clever maths and a signed ID card, the certificate. Here your browser seals a line to techconcepts.app, over a TCP connection that’s already open.',
    facts: [
      { label: 'Used by', value: 'HTTPS, secure email, most apps' },
      { label: 'Current version', value: 'TLS 1.3' },
      { label: 'SSL', value: 'the old name; every SSL version is retired' },
      { label: 'Proves identity with', value: 'certificates' },
      { label: 'Sits', value: 'between TCP and the app' },
      { label: 'This example', value: 'techconcepts.app, port 443' },
    ],
  },
  steps: [
    {
      id: 'clienthello',
      title: 'ClientHello',
      sub: 'What I can do',
      narrative:
        'The TCP line to techconcepts.app is already open. The browser starts the seal with a **ClientHello**: the TLS versions it speaks, the **cipher suites** it can use (the kinds of lock), a random number, the site’s name, and a **key share**, the public half of a key it has just made up. It sends that half straight away, guessing which method the server will pick, to save a round trip.',
      deep: 'TLS 1.3 has five cipher suites, such as TLS_AES_128_GCM_SHA256 and TLS_CHACHA20_POLY1305_SHA256. The site’s name goes in the server_name extension (SNI), unencrypted, so one server can hold certificates for many sites. The supported groups list the key-exchange methods, usually X25519 first; newer browsers add a post-quantum hybrid (X25519MLKEM768).',
      facts: [
        { label: 'Versions', value: 'TLS 1.3, 1.2' },
        { label: 'Cipher suites', value: 'AES-128-GCM, ChaCha20-Poly1305 and others' },
        { label: 'Name (SNI)', value: 'techconcepts.app, in plain view' },
        { label: 'Key share', value: 'the X25519 public half' },
      ],
      events: [
        ...msg({
          tag: 'CLIENT HELLO',
          from: 'laptop',
          to: 'web',
          proto: 'TLS',
          via: 'TCP',
          kind: 'request',
          time: '0.000s',
          src: LAPTOP,
          dst: WEB,
          size: '517 B',
          sum: 'Hello. I speak TLS 1.3, here are my locks, and here’s half a key.',
          info: 'ClientHello: TLS 1.3, 3 cipher suites, SNI techconcepts.app, key share X25519',
          st: 'Sealing the line',
          rows: [{ key: 'sni', cells: ['Name asked for', 'techconcepts.app'] }],
        }),
      ],
    },
    {
      id: 'serverhello',
      title: 'ServerHello',
      sub: 'Here’s what we’ll use',
      narrative:
        'The server answers with a **ServerHello**: it picks TLS 1.3 and one cipher suite, and sends its own key share. Now each side has the other’s public half and its own secret half, and the maths gives both the same **shared secret**. It never crossed the network, so nobody watching can work it out. From this message on, everything the server sends is already encrypted.',
      deep: 'This is elliptic-curve Diffie-Hellman, X25519 here. Every connection uses fresh key shares, so someone who records the traffic and later steals the server’s private key still can’t unlock it; that’s forward secrecy. From the shared secret, both sides derive separate keys for each direction (with HKDF). If the client guessed the wrong method, the server sends a HelloRetryRequest, costing a round trip.',
      facts: [
        { label: 'Version', value: 'TLS 1.3' },
        { label: 'Cipher suite', value: 'TLS_AES_128_GCM_SHA256' },
        { label: 'Key exchange', value: 'X25519' },
        { label: 'Forward secrecy', value: 'yes: fresh keys every time' },
      ],
      events: [
        ...msg({
          tag: 'SERVER HELLO',
          from: 'web',
          to: 'laptop',
          proto: 'TLS',
          via: 'TCP',
          kind: 'response',
          time: '0.032s',
          src: WEB,
          dst: LAPTOP,
          size: '122 B',
          sum: 'Let’s use TLS 1.3 and AES-128-GCM. Here’s my half of the key.',
          info: 'ServerHello: TLS 1.3, TLS_AES_128_GCM_SHA256, key share X25519',
          st: 'Shared keys made',
          known: true,
          rows: [
            { key: 'ver', cells: ['Version', 'TLS 1.3'] },
            { key: 'suite', cells: ['Cipher suite', 'TLS_AES_128_GCM_SHA256'] },
            { key: 'kx', cells: ['Key exchange', 'X25519'] },
          ],
        }),
      ],
    },
    {
      id: 'certificate-verification',
      title: 'Certificate Verification',
      sub: 'Prove who you are',
      narrative:
        'Anyone could do the key maths, an impostor included. So the server sends its **certificate**, a document saying “this key belongs to techconcepts.app”, signed by a **certificate authority** (CA). The browser checks three things: the name matches, the dates are valid, and the signatures lead back to a CA it already trusts. Then the server signs the whole handshake with its private key, the **CertificateVerify**, to prove the certificate is really its own.',
      deep: 'The server sends a chain: its own certificate and an intermediate CA’s. The root CA is already in the browser’s or system’s trust store. The browser also checks the certificate hasn’t been revoked and appears in public Certificate Transparency logs. A self-signed certificate isn’t trusted, because nobody vouches for it.',
      facts: [
        { label: 'Certificate for', value: 'techconcepts.app' },
        { label: 'Signed by', value: 'an intermediate CA, under a trusted root' },
        { label: 'Checks', value: 'name, dates, chain of signatures' },
        { label: 'Proof of the key', value: 'CertificateVerify' },
      ],
      events: [
        ...msg({
          tag: 'CERTIFICATE',
          from: 'web',
          to: 'laptop',
          proto: 'TLS',
          via: 'TCP',
          kind: 'response',
          time: '0.032s',
          src: WEB,
          dst: LAPTOP,
          size: '2.9 KB',
          sum: 'My certificate, signed by a CA you trust.',
          info: 'Certificate: techconcepts.app, chain of 2 (encrypted)',
          rows: [
            { key: 'cert', cells: ['Name on certificate', 'techconcepts.app ✓'] },
            { key: 'ca', cells: ['Signed by', 'a CA the laptop trusts ✓'] },
          ],
        }),
        ...msg({
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
          size: '264 B',
          sum: 'And my signature on everything so far, made with that certificate’s key.',
          info: 'CertificateVerify: ecdsa_secp256r1_sha256 (encrypted)',
          st: 'Server checked',
          known: true,
          rows: [{ key: 'own', cells: ['Server owns that key', 'yes ✓'] }],
        }),
      ],
    },
    {
      id: 'handshake-finished',
      title: 'Handshake Finished',
      sub: 'Ready',
      narrative:
        'Each side ends with a **Finished** message: a short code worked out from every handshake message so far, using the new keys. If anyone had changed a single byte on the way, the codes wouldn’t match and the connection would stop. The server’s Finished arrives, the browser checks it and sends its own. The whole handshake took one round trip, and the line is sealed.',
      deep: 'Finished carries an HMAC over a hash of the whole handshake. In TLS 1.3, the server’s EncryptedExtensions, Certificate, CertificateVerify and Finished all arrive in one flight right after the ServerHello; this walkthrough takes them one at a time to show each job. A resumed connection can even send data with its very first message (0-RTT), at the cost of replay protection.',
      facts: [
        { label: 'Server sends', value: 'Finished' },
        { label: 'Browser sends', value: 'Finished' },
        { label: 'Proves', value: 'nobody changed the handshake' },
        { label: 'Round trips', value: 'one (TLS 1.2 took two)' },
      ],
      events: [
        ...msg({
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
          size: '74 B',
          sum: 'That’s my side of the handshake, and here’s its code.',
          info: 'Finished (server, encrypted)',
        }),
        ...msg({
          tag: 'FINISHED',
          from: 'laptop',
          to: 'web',
          proto: 'TLS',
          via: 'TCP',
          kind: 'request',
          time: '0.033s',
          src: LAPTOP,
          dst: WEB,
          size: '74 B',
          sum: 'Your code matches. Here’s mine. We’re sealed.',
          info: 'Finished (client, encrypted)',
          st: 'Sealed',
          known: true,
          conn: ['seal', 'laptop>web'],
          rows: [{ key: 'fin', cells: ['Handshake', 'complete and untouched ✓'] }],
        }),
      ],
    },
    {
      id: 'encrypted-application-data',
      title: 'Encrypted Application Data',
      sub: 'Sealed messages',
      narrative:
        'Now the app’s own messages go through the seal. Here the browser’s HTTP request goes out as **application data**: encrypted with the shared key, plus a tag that proves it wasn’t changed. On the map the tags just say ENCRYPTED, because that’s all anyone in between can see. The server unlocks the request, and its reply comes back the same way.',
      deep: 'Each message is sealed in a TLS record of up to 16 KB with AEAD (here AES-128-GCM), which encrypts and authenticates in one go. Every record has its own sequence number, so records can’t be replayed or reordered. Keys can be refreshed mid-connection with KeyUpdate. A watcher still sees each record’s size and timing.',
      facts: [
        { label: 'Record type', value: 'application data' },
        { label: 'Cipher', value: 'AES-128-GCM' },
        { label: 'Each record', value: 'up to 16 KB, numbered' },
        { label: 'Changed on the way?', value: 'detected, and the connection drops' },
      ],
      events: [
        ...msg({
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
        ...msg({
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
          page: 'full',
        }),
      ],
    },
    {
      id: 'close-notify',
      title: 'Close Notify',
      sub: 'Close safely',
      narrative:
        'When the browser is done, it doesn’t just hang up. It sends a **close_notify** alert, sealed like everything else: “I’m finished sending.” The server replies with its own. That way neither side can be fooled by someone cutting the line early and pretending a message was complete. Then TCP closes the connection underneath.',
      deep: 'TLS alerts carry a level and a description: close_notify ends a connection normally, and others report errors, such as bad_certificate, handshake_failure or decrypt_error. Cutting a connection without close_notify, to make a download look complete, is a truncation attack. SSL 2.0 and 3.0, TLS 1.0 and TLS 1.1 are all retired; use 1.2 or 1.3.',
      facts: [
        { label: 'Alert', value: 'close_notify' },
        { label: 'Sent', value: 'sealed, both ways' },
        { label: 'Stops', value: 'truncation attacks' },
        { label: 'Then', value: 'TCP FIN' },
      ],
      events: [
        ...msg({
          tag: 'CLOSE NOTIFY',
          from: 'laptop',
          to: 'web',
          proto: 'TLS',
          via: 'TCP',
          kind: 'request',
          time: '5.000s',
          src: LAPTOP,
          dst: WEB,
          size: '24 B',
          sum: 'I’m finished sending.',
          info: 'Alert: close_notify (encrypted)',
        }),
        ...msg({
          tag: 'CLOSE NOTIFY',
          from: 'web',
          to: 'laptop',
          proto: 'TLS',
          via: 'TCP',
          kind: 'response',
          time: '5.032s',
          src: WEB,
          dst: LAPTOP,
          size: '24 B',
          sum: 'Me too. Goodbye.',
          info: 'Alert: close_notify (encrypted)',
          st: 'Closed safely',
          done: true,
          conn: ['close', 'laptop>web'],
        }),
      ],
    },
  ],
  learn: {
    lead: 'In one round trip, two strangers agreed on secret keys in plain view, one proved who it was, and both checked that nobody had meddled.',
    terms: [
      { idea: '“Here’s what I can do”', name: 'ClientHello' },
      { idea: '“Here’s what we’ll use”', name: 'ServerHello' },
      { idea: 'A set of methods for the lock', name: 'Cipher suite' },
      { idea: 'The public half of a key, sent across', name: 'Key share' },
      { idea: 'The same secret, made on both sides', name: 'Shared secret' },
      { idea: 'The site’s ID, signed by someone trusted', name: 'Certificate' },
      { idea: 'The organisation that signs certificates', name: 'Certificate authority (CA)' },
      { idea: 'Proof that nobody changed the handshake', name: 'Finished' },
      { idea: '“I’m done”, sealed', name: 'close_notify' },
    ],
    pattern: {
      names: ['ClientHello', 'ServerHello', 'Certificate', 'Finished', 'Application Data'],
      note: 'Every TLS connection starts this way. After Finished, it’s application data until close_notify.',
    },
    why: 'TLS gives any app three things at once: privacy (nobody can read it), integrity (nobody can change it unnoticed) and authentication (you know who’s on the other end). HTTPS, secure email, VPNs and most apps borrow it instead of inventing their own.',
    deep: 'SSL was Netscape’s original (SSL 2.0 in 1995, 3.0 in 1996). TLS 1.0 followed in 1999, 1.2 in 2008, and 1.3 in 2018, which cut the handshake to one round trip and removed old, weak options such as RSA key exchange, CBC ciphers, RC4 and SHA-1. “SSL certificate” is still the everyday name for a TLS certificate. Mutual TLS (mTLS) asks the client for a certificate too.',
    facts: [
      { label: 'Current', value: 'TLS 1.3 (1.2 still common)' },
      { label: 'Retired', value: 'SSL 2.0, 3.0, TLS 1.0, 1.1' },
      { label: 'Gives', value: 'privacy, integrity, authentication' },
      { label: 'Certificates', value: 'X.509, from a CA' },
      { label: 'Defined in', value: 'RFC 8446' },
    ],
  },
  practice: [
    {
      id: 'same-secret',
      prompt: 'How do the browser and the server end up with the same secret key?',
      options: [
        { text: 'The server sends it, protected by a password.', feedback: 'Not quite. The key itself never crosses the network.' },
        {
          text: 'Each sends a public half, and combining the halves gives both the same secret.',
          feedback: 'Right. That’s the key exchange, and nobody watching can work the secret out.',
        },
        {
          text: 'It’s inside the certificate.',
          feedback: 'Not quite. The certificate proves who the server is. The key comes from the key exchange.',
        },
      ],
      answer: 1,
    },
    {
      id: 'certificate-proves',
      prompt: 'What does the certificate prove?',
      options: [
        { text: 'That the key really belongs to techconcepts.app.', feedback: 'Yes. A trusted CA vouches for the name and the key.' },
        {
          text: 'That the site has no viruses.',
          feedback: 'Not quite. A certificate says nothing about what’s on the site, only who it is.',
        },
        {
          text: 'That the line is encrypted.',
          feedback: 'Not quite. The key exchange does the encrypting. The certificate proves identity.',
        },
      ],
      answer: 0,
    },
  ],
};

export default tls;
