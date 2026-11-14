import { defineGlossaryGroup } from '../glossary-group';
import { cite, SOURCES } from '../sources';

/**
 * The glossary group security (job 10, batch 3): ten entries on TLS and what it is made of, the keys behind it, and
 * what encrypted and plain text mean. Written from the analyst's report and the orchestrator's rulings in it.
 * A numbered section of an RFC is cited by its number; RFC 9846's abstract and appendices by their fragment. NIST's
 * PDFs have no section anchors, so a section is cited by the PDF page its passage is on; a vendor's page has none
 * either, so a section is cited by a text fragment that starts in it. A citation is marked defining only where the
 * document defines the thing the statement is about: RFC 9846 (TLS 1.3, its handshake, cipher suites and record
 * protection), RFC 5280 (the certificate), RFC 4253 (SSH's key exchange), RFC 4252 (its public-key login), RFC 9112
 * (HTTP/1.1's message format) and RFC 2046 (the text/plain media type); never RFC 4949, NIST or a vendor page.
 */

const d = (source: string, section: string) => cite(source, section, { defining: true });
const rfc = (source: string, section: string) => cite(source, section);
const RFC = (n: number) => `https://www.rfc-editor.org/rfc/rfc${n}.html`;
const rfcAt = (source: string, section: string, n: number, fragment: string, defining = false) =>
  cite(source, section, defining ? { url: `${RFC(n)}#${fragment}`, defining: true } : { url: `${RFC(n)}#${fragment}` });

const ABSTRACT_9846 = rfcAt('rfc-9846', 'Abstract', 9846, 'abstract', true);
const C2_9846 = rfcAt('rfc-9846', 'C.2', 9846, 'appendix-C.2');
const B4_9846 = rfcAt('rfc-9846', 'B.4', 9846, 'appendix-B.4', true);
const F1_9846 = rfcAt('rfc-9846', 'F.1', 9846, 'appendix-F.1');

/** RFC 4949 is one source; each entry of it is cited by the page it is on. */
const r4949 = (page: number) => cite('rfc-4949', '4', { url: `${RFC(4949)}#page-${page}` });

const NIST_52 = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf';
const nist52 = (section: string, page: number) => cite('nist-sp800-52r2', section, { url: `${NIST_52}#page=${page}` });
const NIST_77 = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';
const nist77 = (section: string, page: number) => cite('nist-sp800-77r1', section, { url: `${NIST_77}#page=${page}` });

const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const PA_HANDSHAKE = vendor('paloalto-tls-handshake', 'What Is the TLS Handshake?', 'This process serves three primary functions');
const PA_CA_TRUST = vendor(
  'paloalto-tls-handshake',
  'Certificate Authority (CA) Validation and Trust Chains',
  'During the handshake, the client checks the certificate',
);
const PA_DH = vendor(
  'paloalto-tls-handshake',
  'Phase 2: Server Authentication and Key Exchange',
  'In TLS 1.3, this is replaced by a more secure Diffie-Hellman exchange',
);
const PA_PASSPORT = vendor('paloalto-tls-certificate', 'TLS Certificate Explained', 'the TLS certificate acts as a digital passport');
const PA_CA = vendor('paloalto-tls-certificate', 'The Role Of Certificate Authorities', 'A certificate authority (CA) is a trusted third party');
const PA_DV = vendor('paloalto-tls-certificate', 'The Role Of Certificate Authorities', 'Domain Validation (DV)');
const LE_ACME = vendor('letsencrypt-how', 'How It Works', 'the ACME client proves to the Certificate Authority');
const MS_KEYPAIRS = vendor('microsoft-openssh-keys', 'Key pairs', 'Key pairs refer to the public and private key files');
const MS_PUBLIC_SHARED = vendor('microsoft-azure-ssh-detailed', 'Overview of SSH and keys', 'Your public key can be shared with anyone');
const MS_PRIVATE_HOME = vendor('microsoft-azure-ssh-detailed', 'Overview of SSH and keys', 'The private key remains on your local');
const MS_FTP = vendor('microsoft-app-service-ftp', 'Enforce FTPS', 'To disable unencrypted FTP');

export default defineGlossaryGroup({
  id: 'security',
  entries: [
    {
      id: 'tls',
      term: 'TLS',
      also: ['Transport Layer Security'],
      definition: [
        {
          id: 'tls-1',
          text: 'TLS (Transport Layer Security) is a protocol that gives two programs, such as a browser and a server, a secure channel: others cannot read what they send, or change it unnoticed.',
          cite: [ABSTRACT_9846, d('rfc-9846', '1'), nist52('1', 10)],
        },
        {
          id: 'tls-2',
          text: 'It starts with a handshake that checks the server’s identity and sets up keys.',
          cite: [d('rfc-9846', '1')],
        },
        {
          id: 'tls-3',
          text: 'It runs over a reliable transport, usually TCP, beneath protocols such as HTTP.',
          cite: [d('rfc-9846', '1'), nist52('1', 10), r4949(313)],
        },
      ],
    },
    {
      id: 'tls-handshake',
      term: 'TLS handshake',
      definition: [
        {
          id: 'tls-handshake-1',
          text: 'The TLS handshake is the start of a TLS connection, when client and server first talk.',
          cite: [d('rfc-9846', '2'), nist52('2.1', 13)],
        },
        {
          id: 'tls-handshake-2',
          text: 'They agree on a TLS version and cryptographic methods, the server proves its identity, usually with a certificate, and both sides set up shared keys.',
          cite: [d('rfc-9846', '2'), d('rfc-9846', '4.5.1'), nist52('2.1', 13), PA_HANDSHAKE],
        },
        {
          id: 'tls-handshake-3',
          text: 'Once it is complete, those keys protect the application’s data.',
          cite: [d('rfc-9846', '2')],
        },
      ],
      lessons: [{ lesson: 'what-is-https', term: 'term-handshake' }],
    },
    {
      id: 'certificate',
      term: 'Certificate',
      also: ['Public-key certificate'],
      definition: [
        {
          id: 'certificate-1',
          text: 'A certificate, or public-key certificate, is a digitally signed record that binds a public key to its owner, such as a website.',
          cite: [d('rfc-5280', '3.1'), nist52('2.1', 13), r4949(241), PA_PASSPORT],
        },
        {
          id: 'certificate-2',
          text: 'A trusted certificate authority signs it, and it is valid only for a limited time.',
          cite: [d('rfc-5280', '3.1'), C2_9846],
        },
        {
          id: 'certificate-3',
          text: 'In the TLS handshake the server sends its certificate so the client can check who it is talking to.',
          cite: [d('rfc-9846', '4.5.1'), d('rfc-9846', '2'), nist52('2.1', 13)],
        },
      ],
      lessons: [
        { lesson: 'what-is-https', term: 'term-cert' },
        { lesson: 'what-is-tls', term: 'term-cert' },
      ],
    },
    {
      id: 'certificate-authority',
      term: 'Certificate authority',
      also: ['CA'],
      definition: [
        {
          id: 'certificate-authority-1',
          text: 'A certificate authority (CA) is an organisation that issues and signs certificates, vouching that each public key belongs to the owner named.',
          cite: [r4949(55), rfc('rfc-5280', '3.1'), rfc('rfc-5280', '3'), PA_CA],
        },
        {
          id: 'certificate-authority-2',
          text: 'Browsers and other clients trust a limited set of CAs, and accept a certificate whose chain of signatures leads back to one.',
          cite: [rfc('rfc-5280', '3.2'), C2_9846, PA_CA_TRUST],
        },
        {
          id: 'certificate-authority-3',
          text: 'Before issuing a website’s certificate, a CA checks that the requester controls its domain.',
          cite: [LE_ACME, PA_DV],
        },
      ],
      lessons: [
        { lesson: 'what-is-https', term: 'term-ca' },
        { lesson: 'what-is-tls', term: 'term-ca' },
      ],
    },
    {
      id: 'cipher-suite',
      term: 'Cipher suite',
      definition: [
        {
          id: 'cipher-suite-1',
          text: 'A cipher suite is a named set of cryptographic algorithms that a TLS connection uses to protect its data.',
          cite: [B4_9846, nist52('2.1', 14), nist52('3.3', 23)],
        },
        {
          id: 'cipher-suite-2',
          text: 'In the handshake the client lists the suites it supports and the server picks one.',
          cite: [d('rfc-9846', '4.2.2'), d('rfc-9846', '4.2.3'), nist52('3.3', 23)],
        },
        {
          id: 'cipher-suite-3',
          text: 'In TLS 1.3 a suite names an encryption method and a hash, as in TLS_AES_128_GCM_SHA256; older versions’ suites also named the key exchange.',
          cite: [B4_9846, nist52('3.3', 23), nist52('3.3.1', 23)],
        },
      ],
      lessons: [{ lesson: 'what-is-tls', term: 'term-suite' }],
    },
    {
      id: 'shared-secret',
      term: 'Shared secret',
      also: ['Shared key'],
      definition: [
        {
          id: 'shared-secret-1',
          text: 'A shared secret is a value that both ends of a connection hold and no one else knows.',
          cite: [rfc('rfc-7748', '6.1'), nist77('2.2', 23), r4949(281)],
        },
        {
          id: 'shared-secret-2',
          text: 'In TLS and SSH a key exchange such as Diffie-Hellman lets each end compute it, so an eavesdropper cannot work it out; the result is also called a shared key.',
          cite: [d('rfc-4253', '8'), d('rfc-9846', '7.4.1'), rfc('rfc-7748', '6.1'), nist77('2.3.3', 26), F1_9846],
        },
        {
          id: 'shared-secret-3',
          text: 'The keys that encrypt the connection are then made from it.',
          cite: [d('rfc-4253', '7.2'), d('rfc-9846', '7.1'), rfc('rfc-7748', '6.1')],
        },
      ],
      lessons: [
        { lesson: 'what-is-tls', term: 'term-shared' },
        { lesson: 'what-is-https', term: 'term-key' },
      ],
    },
    {
      id: 'key-exchange',
      term: 'Key exchange',
      definition: [
        {
          id: 'key-exchange-1',
          text: 'Key exchange is the step at the start of a secure connection, in SSH and TLS alike, in which two sides set up a shared secret over an open network.',
          cite: [d('rfc-4253', '7'), d('rfc-4253', '7.2'), d('rfc-9846', '2'), rfc('rfc-4251', '9')],
        },
        {
          id: 'key-exchange-2',
          text: 'In Diffie-Hellman key exchange each side sends only a public value and combines the other’s with its own private value, so both compute the same secret without sending it.',
          cite: [d('rfc-4253', '8'), rfc('rfc-7748', '6.1'), r4949(172), PA_DH],
        },
      ],
      lessons: [{ lesson: 'what-is-ssh', term: 'term-kex' }],
    },
    {
      id: 'key-pair',
      term: 'Key pair',
      definition: [
        {
          id: 'key-pair-1',
          text: 'A key pair is a public key and a private key made together; the private key cannot be worked out from the public one.',
          cite: [r4949(176), MS_KEYPAIRS, nist77('2.3.4', 26)],
        },
        {
          id: 'key-pair-2',
          text: 'The owner keeps the private key secret and may share the public key freely.',
          cite: [r4949(176), MS_PUBLIC_SHARED],
        },
        {
          id: 'key-pair-3',
          text: 'In SSH the server keeps a user’s public key, and the user signs in by proving they hold the private key.',
          cite: [d('rfc-4252', '7'), MS_PRIVATE_HOME],
        },
      ],
      lessons: [{ lesson: 'what-is-ssh', term: 'term-keypair' }],
    },
    {
      id: 'encryption',
      term: 'Encryption',
      definition: [
        {
          id: 'encryption-1',
          text: 'Encryption turns readable data into a scrambled form that hides its meaning, using a key.',
          cite: [r4949(119), nist77('2.2', 23)],
        },
        {
          id: 'encryption-2',
          text: 'Decryption, with the right key, turns encrypted data back into its original form.',
          cite: [r4949(119), nist77('2.2', 23)],
        },
        {
          id: 'encryption-3',
          text: 'TLS and SSH encrypt what they carry, so that only the two ends of the connection can read it.',
          cite: [d('rfc-9846', '1'), d('rfc-4253', '1')],
        },
      ],
      lessons: [{ lesson: 'what-is-https', term: 'term-encrypted' }],
    },
    {
      id: 'plain-text',
      term: 'Plain text',
      also: ['Plaintext'],
      senses: [
        {
          id: 'unencrypted',
          label: 'Not encrypted',
          definition: [
            {
              id: 'plain-text-unencrypted-1',
              text: 'In this sense, plain text, or plaintext, is data that is not encrypted, so anyone who can see it on its way across the network can read it.',
              cite: [rfc('rfc-9325', '5.1'), rfc('rfc-9325', '4.1'), r4949(225), rfc('rfc-2228', '1')],
            },
            {
              id: 'plain-text-unencrypted-2',
              text: 'Classic FTP sends everything this way, passwords included.',
              cite: [rfc('rfc-2577', '6'), rfc('rfc-2577', '5'), rfc('rfc-2228', '1'), MS_FTP],
            },
          ],
          lessons: [{ lesson: 'what-is-ftp', term: 'term-plain' }],
        },
        {
          id: 'text',
          label: 'Written as text, not binary',
          definition: [
            {
              id: 'plain-text-text-1',
              text: 'In this sense, plain text is data made only of characters and line breaks, with no formatting codes or binary data, so it can be read as it is without special software.',
              cite: [d('rfc-2046', '4.1'), d('rfc-2046', '3')],
            },
            {
              id: 'plain-text-text-2',
              text: 'HTTP/1.1 writes each message’s start line and header fields as human-readable lines of text, while HTTP/2 sends them in binary frames.',
              cite: [d('rfc-9112', '2.1'), rfc('rfc-9114', '1.1'), rfc('rfc-9110', '1.2'), rfc('rfc-9113', '1')],
            },
          ],
        },
      ],
    },
  ],
});
