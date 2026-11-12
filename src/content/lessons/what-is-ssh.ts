import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * SSH, lesson 13 of How the Internet Works’ 14. Version lines first, then each side’s lists (KEXINIT), then the key
 * exchange, where the server’s host key is checked and NEWKEYS seals the line. The laptop logs in with a key, opens
 * a session channel and a shell, and each keystroke crosses sealed and comes back as its echo. The line stays open,
 * and sealed, to the end.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-apps.mjs), changed only where a source
 * does not state them. RFC 4251 to 4254 define SSH, so their citations are marked as the defining standard where the
 * claim is about the thing each defines; no vendor page is. The addresses (RFC 1918 and RFC 5737), the example names,
 * the clock times, the laptop’s port, the prompt, the channel number, the file names and OpenSSH’s version are
 * example data. No message size is shown: no source states one. The speaking tube (Overview description) is an
 * analogy and cites nothing. No source places SSH at an OSI layer, so the badge spans.
 */

// ---------------------------------------------------------------- citations

/** A numbered section of an RFC that defines what the claim is about, so it is cited as the defining standard. */
const d = (source: string, section: string) => cite(source, section, { defining: true });
/** A numbered section of an RFC that only mentions or explains it. */
const r = (source: string, section: string) => cite(source, section);
/** An RFC’s abstract has no numbered section, so it is cited by the fragment of its heading. */
const abstractOf = (source: string, number: number) =>
  cite(source, 'Abstract', { url: `https://www.rfc-editor.org/rfc/rfc${number}.html#abstract`, defining: true });

const IANA_PORTS_URL = 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers';
const IANA_PORTS = cite('iana-ports', 'Registry', { url: IANA_PORTS_URL, defining: true });
/** The same record, cited for the port number only, not as the thing that defines the claim. */
const IANA_PORT_23 = cite('iana-ports', 'Registry', { url: IANA_PORTS_URL });

const IANA_SSH = 'https://www.iana.org/assignments/ssh-parameters';
const IANA_KEX = cite('iana-ssh-parameters', 'Key Exchange Method Names', { url: `${IANA_SSH}#ssh-parameters-16` });
const IANA_CIPHER = cite('iana-ssh-parameters', 'Encryption Algorithm Names', { url: `${IANA_SSH}#ssh-parameters-17` });
const IANA_HOSTKEY = cite('iana-ssh-parameters', 'Public Key Algorithm Names', { url: `${IANA_SSH}#ssh-parameters-19` });

const NIST_IR_URL = 'https://nvlpubs.nist.gov/nistpubs/ir/2015/NIST.IR.7966.pdf#page=9';
/** NISTIR 7966’s section 3, on PDF page 9: what SSH is, what it replaced and where it is used. */
const NIST_IR_BASICS = cite('nist-ir-7966', '3', { url: NIST_IR_URL });
/** NISTIR 7966’s section 3.2, on the same page: file transfers with scp and SFTP. */
const NIST_IR_USES = cite('nist-ir-7966', '3.2', { url: NIST_IR_URL });
const NIST_SERVER_SECURITY = cite('nist-sp800-123', '6.5', {
  url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-123.pdf#page=48',
});

/** A vendor’s page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, page: string, section: string, text: string) =>
  cite(source, section, { url: `${page}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const MS = 'https://learn.microsoft.com/en-us';
const MS_OVERVIEW_URL = `${MS}/windows-server/administration/OpenSSH/openssh-overview`;
const MS_OVERVIEW = 'OpenSSH for Windows overview';
const MS_ADMINS = vendor('microsoft-openssh-overview', MS_OVERVIEW_URL, MS_OVERVIEW, 'OpenSSH is the open-source version');
const MS_SFTP = vendor('microsoft-openssh-overview', MS_OVERVIEW_URL, MS_OVERVIEW, 'sftp is the service');
const MS_SCP = vendor('microsoft-openssh-overview', MS_OVERVIEW_URL, MS_OVERVIEW, 'scp is a file copy utility');
const MS_AGENT = vendor('microsoft-openssh-overview', MS_OVERVIEW_URL, MS_OVERVIEW, 'ssh-agent stores private keys');
const MS_FIRST_URL = `${MS}/windows-server/administration/openssh/openssh_install_firstuse`;
const MS_COMMAND = vendor('microsoft-openssh-get-started', MS_FIRST_URL, 'Connect to OpenSSH Server', 'ssh domain');
const MS_FINGERPRINT = vendor('microsoft-openssh-get-started', MS_FIRST_URL, 'Connect to OpenSSH Server', 'The authenticity of host');
const MS_PUBLIC_HALF = vendor(
  'microsoft-openssh-keys',
  `${MS}/windows-server/administration/openssh/openssh_keymanagement`,
  'Key pairs',
  'The public key is what is placed',
);
const MS_SHELL = vendor(
  'microsoft-openssh-server-config',
  `${MS}/windows-server/administration/OpenSSH/openssh-server-configuration`,
  'Configuring the default shell for OpenSSH in Windows',
  'The default command shell provides',
);
const MS_AUTH_FILE = vendor(
  'microsoft-openssh-server-config',
  `${MS}/windows-server/administration/OpenSSH/openssh-server-configuration`,
  'AuthorizedKeysFile',
  'The default is .ssh/authorized_keys',
);
const MS_KNOWN = vendor('microsoft-azure-ssh-quick', `${MS}/azure/virtual-machines/linux/mac-create-ssh-keys`, 'SSH into your VM', 'The VM is added to your');
const MS_DETAILED_URL = `${MS}/azure/virtual-machines/linux/create-ssh-keys-detailed`;
const MS_PRIVATE_HOME = vendor('microsoft-azure-ssh-detailed', MS_DETAILED_URL, 'Overview of SSH and keys', 'The private key remains on your local');
const MS_BRUTE_FORCE = vendor('microsoft-azure-ssh-detailed', MS_DETAILED_URL, 'Overview of SSH and keys', 'Although SSH provides an encrypted connection');
const MS_AUTH_KEYS = vendor('microsoft-azure-ssh-detailed', MS_DETAILED_URL, 'SSH keys use and benefits', 'Azure copies the public key');
const MS_NO_PASSWORDS = vendor('microsoft-azure-ssh-detailed', MS_DETAILED_URL, 'SSH keys use and benefits', 'In an Azure Linux VM that uses SSH keys');
const MS_SOCKS = vendor(
  'microsoft-hdinsight-ssh-tunnel',
  `${MS}/azure/hdinsight/hdinsight-linux-ambari-ssh-tunnel`,
  'Create a tunnel using the SSH command',
  'ssh -C2qTnNf',
);

const CISCO_URL = 'https://www.cisco.com/c/en/us/support/docs/security-vpn/secure-shell-ssh/4145-ssh.html';
const CISCO_DEBUG = 'SSH Client Debug (Linux/macOS)';
const CISCO_INTRO = vendor('cisco-ssh-configure', CISCO_URL, 'Introduction', 'This document describes how to configure');
const CISCO_V2 = vendor('cisco-ssh-configure', CISCO_URL, 'Configure SSH Version 2', 'ensure that SSHv2 is enabled');
const CISCO_COMMAND = vendor('cisco-ssh-configure', CISCO_URL, CISCO_DEBUG, 'ssh -i ~/.ssh/cisco1024');
const CISCO_VERSION_LINE = vendor('cisco-ssh-configure', CISCO_URL, CISCO_DEBUG, 'debug1: Remote protocol version');
const CISCO_KEX_LINE = vendor('cisco-ssh-configure', CISCO_URL, CISCO_DEBUG, 'debug1: kex: server->client cipher');
const CISCO_KNOWN = vendor('cisco-ssh-configure', CISCO_URL, CISCO_DEBUG, 'debug1: Found key in');
const CISCO_SHOW_IP_SSH = vendor('cisco-ssh-configure', CISCO_URL, 'Debug and Show Commands', 'Encryption Algorithms:chacha20');
const CISCO_FINGERPRINT = vendor('cisco-ssh-configure', CISCO_URL, CISCO_DEBUG, 'debug1: Server host key: ssh-rsa');

const OPENBSD = 'https://man.openbsd.org';
const OPENBSD_COMMAND = vendor('openbsd-man-ssh', `${OPENBSD}/ssh`, 'DESCRIPTION', 'ssh connects and logs into');
const OPENBSD_WARNS = vendor('openbsd-man-ssh', `${OPENBSD}/ssh`, 'AUTHENTICATION', "If a host's identification ever changes");
const OPENBSD_SOCKS = vendor('openbsd-man-ssh', `${OPENBSD}/ssh`, 'DESCRIPTION', 'Currently the SOCKS4 and SOCKS5');
const OPENBSD_AUTH_FILE = vendor('openbsd-man-sshd', `${OPENBSD}/sshd`, 'AUTHORIZED_KEYS FILE FORMAT', 'the default is ~/.ssh/authorized_keys');
const OPENBSD_AUTH_KEYS = vendor('openbsd-man-sshd-config', `${OPENBSD}/sshd_config`, 'DESCRIPTION', 'Specifies the file that contains the public keys');
const OPENBSD_SUBSYSTEM = vendor('openbsd-man-sshd-config', `${OPENBSD}/sshd_config`, 'DESCRIPTION', 'Configures an external subsystem');
const OPENBSD_PASSWORD = vendor('openbsd-man-sshd-config', `${OPENBSD}/sshd_config`, 'DESCRIPTION', 'Specifies whether password authentication is allowed');
const OPENBSD_CIPHERS = vendor('openbsd-man-ssh-config', `${OPENBSD}/ssh_config`, 'DESCRIPTION', 'The default is: chacha20-poly1305@openssh.com');
const OPENBSD_COMPRESSION = vendor('openbsd-man-ssh-config', `${OPENBSD}/ssh_config`, 'DESCRIPTION', 'Specifies whether to use compression');
const OPENBSD_OBSCURE = vendor('openbsd-man-ssh-config', `${OPENBSD}/ssh_config`, 'DESCRIPTION', 'Specifies whether ssh(1) should try to obscure');
const OPENBSD_SFTP = vendor('openbsd-man-sftp', `${OPENBSD}/sftp`, 'DESCRIPTION', 'sftp is a file transfer program');
const OPENBSD_AGENT = vendor('openbsd-man-ssh-agent', `${OPENBSD}/ssh-agent`, 'DESCRIPTION', 'Authentication passphrases and private keys never go');

const CLOUDFLARE_TELNET = vendor(
  'cloudflare-ssh',
  'https://www.cloudflare.com/learning/access-management/what-is-ssh/',
  'What is the Secure Shell (SSH) protocol?',
  'Older remote management protocols like Telnet',
);

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:51022';
const HOST = '203.0.113.22:22';

const agreed: TableDef = {
  id: 'agreed',
  title: 'What the two sides agreed',
  by: 'for this session',
  columns: [
    { key: 'item', label: 'Item' },
    { key: 'agreed', label: 'Agreed' },
  ],
  keyColumn: 'item',
  initialRows: [],
  empty: 'Nothing yet. The two sides haven’t spoken.',
};

const mockup = messagesFor(agreed);

/** The mockup's message, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-ssh',
  title: 'SSH',
  subtitle: 'Remote control, sealed',
  level: 'beginner',
  certTags: [],
  summary:
    'SSH lets you type commands on a computer somewhere else as if you were sitting at it, through a sealed line. It’s a standard way to log in to servers from afar.',
  figure: 'net-map',
  backing: { traces: ['fact-purpose', 'lead-1', 'why-3', 'fact-newkeys'] },
  units: [
    {
      id: 'ssh',
      name: 'SSH',
      fullName: 'Secure Shell',
      purpose: 'Remote control, sealed',
      group: 'security',
      // No standard puts SSH at an OSI layer (RFC 4251 speaks of its own transport, authentication and connection
      // layers), and no registered vendor page does, so the badge spans.
      osi: 'spans',
      backing: { traces: ['fact-name', 'fact-purpose'] },
      scene: {
        title: 'A sealed line for typing on a faraway server',
        views: ['network', 'sequence'],
        layers: ['ssh:host'],
        labels: { laptop: 'Opening a terminal', url: 'Terminal' },
        start: [],
        panel: { type: 'table', table: agreed },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'host', label: 'Server', addr: '203.0.113.22' },
        ],
        backing: { traces: ['lead-1', 'fact-purpose', 'term-shell', 'fact-session', 'fact-port'] },
      },
      overview: {
        hook: 'SSH lets you type commands on a computer somewhere else as if you were sitting at it, through a sealed line. It’s a standard way to log in to servers from afar.',
        hookBacking: { traces: ['fact-purpose', 'lead-1', 'why-3', 'fact-newkeys'] },
        description:
          'Picture a long, private speaking tube from your desk to a machine room far away. Whatever you type comes out at the other end and the machine’s answers come back, and nobody can listen in or slip in words of their own. Here you log in to srv.example.net and run a command.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'running servers, and copying files (SFTP, scp)', backing: { traces: ['fact-also', 'why-3'] } },
          { label: 'Port', value: 'TCP 22', backing: { traces: ['fact-port', 'fact-rides'] } },
          { label: 'Checks the server by', value: 'its host key', backing: { traces: ['term-hostkey', 'fact-hostkey'] } },
          { label: 'Logs you in with', value: 'a key, or a password', backing: { traces: ['fact-logins'] } },
          { label: 'This example', value: 'alex at srv.example.net', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'version-exchange',
          title: 'Version Exchange',
          sub: 'Swap versions',
          narrative:
            'You type ssh alex@srv.example.net. After the TCP hello on **port 22**, both sides introduce themselves with one line of text: “SSH-2.0”, the protocol version, then the software’s name. That’s the **version exchange**. Nothing is sealed yet; the next two steps build the seal.',
          deep: [
            {
              text: 'The line is SSH-protoversion-softwareversion, here SSH-2.0-OpenSSH_9.9 on both sides.',
              cite: [d('rfc-4253', '4.2'), CISCO_VERSION_LINE],
            },
            {
              text: 'SSH-1, the older version, was never a written standard and is much weaker.',
              cite: [d('rfc-4253', '5'), CISCO_V2],
            },
            {
              text: 'The line is sent before anything is sealed, so anyone watching can read which software a server runs.',
              cite: [d('rfc-4253', '4.2'), CISCO_VERSION_LINE],
            },
          ],
          facts: [
            { label: 'To', value: 'srv.example.net, 203.0.113.22', backing: { example: true } },
            { label: 'Port', value: '22', backing: { traces: ['fact-port'] } },
            { label: 'Both say', value: 'SSH-2.0-OpenSSH_9.9', backing: { traces: ['term-version'] } },
            { label: 'Sealed?', value: 'not yet', backing: { traces: ['fact-newkeys'] } },
          ],
          events: [
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SYN',
              from: 'laptop',
              to: 'host',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.000s',
              src: LAPTOP,
              dst: HOST,
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
              from: 'host',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.024s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I hear you.',
              info: 'SYN-ACK',
            }),
            ...msgOf(
              'fact-tcp',
              'fact-rides',
              'fact-port',
            )({
              tag: 'ACK',
              from: 'laptop',
              to: 'host',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.024s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Connected.',
              info: 'ACK',
              st: 'Connecting',
              conn: ['open', 'laptop>host'],
            }),
            ...msgOf(
              'term-version',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SSH-2.0',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.025s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'I speak SSH 2.0, with OpenSSH.',
              info: 'SSH-2.0-OpenSSH_9.9',
            }),
            ...msgOf(
              'term-version',
              'fact-newkeys',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SSH-2.0',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              time: '0.049s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'So do I.',
              info: 'SSH-2.0-OpenSSH_9.9',
              st: 'Connected, not sealed',
              known: true,
              rows: [{ key: 'ver', cells: ['Version', 'SSH 2.0'] }],
            }),
          ],
          backing: { traces: ['fact-command', 'fact-tcp', 'fact-rides', 'fact-port', 'term-version', 'fact-newkeys'] },
        },
        {
          id: 'algorithm-negotiation',
          title: 'Algorithm Negotiation',
          sub: 'Pick the tools',
          narrative:
            'Next, each side sends a list of everything it can use: ways to make keys, kinds of lock, kinds of ID. This is **KEXINIT**. Each list is in order of preference, and both sides pick the first item on the client’s list that the server also has. No choice is sent back: both work it out the same way.',
          deep: [
            {
              text: 'The main kinds chosen are key exchange (here sntrup761x25519-sha512, which mixes X25519 with a post-quantum method; a newer choice, mlkem768x25519-sha256, pairs X25519 with ML-KEM), host key type (ssh-ed25519), cipher (chacha20-poly1305@openssh.com or aes256-gcm) and MAC, which those ciphers build in. Compression is usually none.',
              cite: [
                d('rfc-4253', '7.1'),
                abstractOf('rfc-9941', 9941),
                d('rfc-10042', '2.3.3'),
                d('rfc-8709', '1'),
                IANA_CIPHER,
                CISCO_SHOW_IP_SSH,
                d('rfc-5647', '6.2'),
                OPENBSD_CIPHERS,
                d('rfc-5647', '5.1'),
                CISCO_KEX_LINE,
                d('rfc-4253', '6.2'),
                OPENBSD_COMPRESSION,
              ],
            },
          ],
          facts: [
            { label: 'Sent by', value: 'both sides at once', backing: { traces: ['fact-choice', 'term-kexinit'] } },
            { label: 'Key exchange', value: 'sntrup761x25519-sha512', backing: { traces: ['fact-algorithms'] } },
            { label: 'Host key', value: 'ssh-ed25519', backing: { traces: ['fact-algorithms'] } },
            { label: 'Cipher', value: 'chacha20-poly1305', backing: { traces: ['fact-algorithms'] } },
          ],
          events: [
            ...msgOf(
              'term-kexinit',
              'fact-messages',
              'fact-choice',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEXINIT',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.050s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Here’s everything I can use, best first.',
              info: 'SSH_MSG_KEXINIT (client lists)',
            }),
            ...msgOf(
              'term-kexinit',
              'fact-messages',
              'fact-choice',
              'fact-algorithms',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEXINIT',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              time: '0.074s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'And here’s my list.',
              info: 'SSH_MSG_KEXINIT (server lists)',
              st: 'Tools agreed',
              known: true,
              rows: [
                { key: 'kex', cells: ['Key exchange', 'sntrup761x25519-sha512'] },
                { key: 'cipher', cells: ['Cipher', 'chacha20-poly1305'] },
              ],
            }),
          ],
          backing: { traces: ['term-kexinit', 'fact-choice', 'fact-algorithms'] },
        },
        {
          id: 'key-exchange-and-host-key-check',
          title: 'Key Exchange and Host Key Check',
          sub: 'Make shared keys, check the server’s ID',
          narrative:
            'Now the clever part. Each side sends the public half of a key it just made. Combining the other side’s public half with its own secret half gives both of them the same **shared secret**, which never crosses the network. The server also signs the exchange with its **host key**, its permanent ID. Your laptop looks that key up in its list of servers it knows, **known_hosts**. The first time, it asks you to check the key’s fingerprint; after that it checks by itself. Then both sides say **NEWKEYS**, and the line is sealed.',
          deep: [
            {
              text: 'The exchange works like Diffie-Hellman (here X25519 combined with a post-quantum method).',
              cite: [d('rfc-9941', '3'), d('rfc-4253', '8')],
            },
            {
              text: 'If a server’s host key ever changes, ssh warns you loudly, because that’s exactly what an attacker in the middle would look like.',
              cite: [r('rfc-4251', '9.3.4'), OPENBSD_WARNS],
            },
            {
              text: 'Fingerprints look like SHA256: followed by a long string of characters.',
              cite: [MS_FINGERPRINT, CISCO_FINGERPRINT],
            },
            {
              text: 'The session ID from this exchange is signed again in the login step.',
              cite: [d('rfc-4253', '7.2')],
            },
          ],
          facts: [
            { label: 'Shared secret', value: 'made on both sides, never sent', backing: { traces: ['term-kex', 'fact-secret'] } },
            { label: 'Host key', value: 'ssh-ed25519, signs the exchange', backing: { traces: ['term-hostkey', 'fact-hostkey', 'fact-algorithms'] } },
            { label: 'Checked against', value: '~/.ssh/known_hosts', backing: { traces: ['term-knownhosts', 'fact-hostkey'] } },
            { label: 'Then', value: 'NEWKEYS: sealed', backing: { traces: ['fact-newkeys'] } },
          ],
          events: [
            ...msgOf(
              'term-kex',
              'fact-secret',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEX INIT',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.075s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Here’s the public half of my key.',
              info: 'SSH_MSG_KEX_ECDH_INIT',
            }),
            ...msgOf(
              'term-kex',
              'fact-secret',
              'term-hostkey',
              'term-knownhosts',
              'fact-hostkey',
              'fact-algorithms',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEX REPLY',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              time: '0.101s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'Here’s my public half, my host key, and my signature on all of it.',
              info: 'SSH_MSG_KEX_ECDH_REPLY, host key ssh-ed25519',
              rows: [{ key: 'host', cells: ['Host key', 'ssh-ed25519, matches known_hosts'] }],
            }),
            ...msgOf(
              'fact-newkeys',
              'fact-hostkey',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'NEWKEYS',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '0.102s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Your ID checks out. My keys are ready.',
              info: 'SSH_MSG_NEWKEYS',
            }),
            ...msgOf(
              'fact-newkeys',
              'term-hostkey',
              'fact-hostkey',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'NEWKEYS',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.102s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'Mine too. Sealed from here.',
              info: 'SSH_MSG_NEWKEYS',
              st: 'Sealed, server checked',
              known: true,
              conn: ['seal', 'laptop>host'],
            }),
          ],
          backing: { traces: ['term-kex', 'fact-secret', 'term-hostkey', 'term-knownhosts', 'fact-hostkey', 'fact-newkeys', 'fact-messages'] },
        },
        {
          id: 'public-key-authentication',
          title: 'Public-Key Authentication',
          sub: 'Log in with a key',
          narrative:
            'Your laptop knows the server is real; now you prove who you are. Instead of a password you use a **key pair**: a private key that never leaves your laptop, and its public half, which you put on the server earlier. Your laptop asks, “May I log in as alex with this public key?” The server says that key is allowed. Your laptop then signs the session with the private key, and the server checks the signature. “Success.” That’s **public-key authentication**, and nothing secret ever crosses.',
          deep: [
            {
              text: 'First the laptop asks for the login service, and the server accepts.',
              cite: [d('rfc-4253', '10')],
            },
            {
              text: 'The server looks the public key up in alex’s ~/.ssh/authorized_keys.',
              cite: [MS_AUTH_KEYS, MS_AUTH_FILE, OPENBSD_AUTH_KEYS, OPENBSD_AUTH_FILE, d('rfc-4252', '7')],
            },
            {
              text: 'The signature covers this session’s ID, so it can’t be reused in another session.',
              cite: [d('rfc-4253', '7.2'), d('rfc-4252', '7'), d('rfc-4252', '1')],
            },
            {
              text: 'Passwords also work, inside the seal, but keys are safer, and a passphrase can protect the private key.',
              cite: [d('rfc-4252', '8'), MS_BRUTE_FORCE, r('rfc-4251', '9.4.5'), d('rfc-4252', '7'), r('rfc-4251', '9.4.4')],
            },
            {
              text: 'ssh-agent holds unlocked keys so you don’t retype the passphrase.',
              cite: [d('rfc-9987', '1'), MS_AGENT],
            },
          ],
          facts: [
            { label: 'User', value: 'alex', backing: { example: true } },
            { label: 'Key', value: 'ssh-ed25519, public half on the server', backing: { traces: ['fact-algorithms', 'term-keypair'] } },
            { label: 'Server checks', value: '~/.ssh/authorized_keys', backing: { traces: ['fact-keylogin'] } },
            { label: 'Secret sent', value: 'none: only a signature', backing: { traces: ['fact-keylogin'] } },
          ],
          events: [
            ...msgOf(
              'fact-keylogin',
              'fact-messages',
              'fact-algorithms',
              'fact-rides',
              'fact-port',
            )({
              tag: 'USERAUTH',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.103s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'May I log in as alex, with this public key?',
              info: 'SSH_MSG_USERAUTH_REQUEST, publickey, ssh-ed25519',
            }),
            ...msgOf(
              'fact-keylogin',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'PK OK',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.129s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'That key is allowed. Prove it’s yours.',
              info: 'SSH_MSG_USERAUTH_PK_OK',
            }),
            ...msgOf(
              'fact-keylogin',
              'term-keypair',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SIGNATURE',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.130s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Here’s my signature, made with the private key.',
              info: 'SSH_MSG_USERAUTH_REQUEST, with signature',
            }),
            ...msgOf(
              'fact-keylogin',
              'fact-logins',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SUCCESS',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              time: '0.158s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'The signature checks out. Welcome, alex.',
              info: 'SSH_MSG_USERAUTH_SUCCESS',
              st: 'Logged in as alex',
              known: true,
              rows: [{ key: 'login', cells: ['Login', 'alex, with a key'] }],
            }),
          ],
          backing: { traces: ['lead-1', 'term-hostkey', 'term-keypair', 'fact-keylogin', 'fact-logins', 'fact-messages'] },
        },
        {
          id: 'channel-open',
          title: 'Channel Open',
          sub: 'Open a session',
          narrative:
            'One SSH connection can carry several conversations at once, each in its own **channel**. Your laptop opens a channel for a **session**, asks for a terminal of a given size, and asks the server to start a **shell**, the program that reads your commands. The server confirms, and a prompt appears: alex@srv:~$.',
          deep: [
            {
              text: 'Channel types include session (a shell or one command), direct-tcpip (forwarding a port from your side) and forwarded-tcpip (forwarding a port from the server’s side).',
              cite: [d('rfc-4254', '6'), d('rfc-4254', '7.2')],
            },
            {
              text: 'Requests on a session include pty-req (a terminal), env, shell, exec (one command) and subsystem (such as sftp).',
              cite: [d('rfc-4254', '6.2'), d('rfc-4254', '6.4'), d('rfc-4254', '6.5'), OPENBSD_SUBSYSTEM, MS_SFTP],
            },
            {
              text: 'Each channel has its own flow-control window.',
              cite: [d('rfc-4254', '5')],
            },
          ],
          facts: [
            { label: 'Channel', value: 'session 0', backing: { traces: ['fact-session'] } },
            { label: 'Requests', value: 'pty-req (a terminal), then shell', backing: { traces: ['fact-session'] } },
            { label: 'One connection', value: 'many channels: shells, forwards, SFTP', backing: { traces: ['fact-session', 'fact-also', 'deep-2'] } },
            { label: 'Prompt', value: 'alex@srv:~$', backing: { example: true } },
          ],
          events: [
            ...msgOf(
              'term-channel',
              'fact-session',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'CHANNEL OPEN',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.159s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Open a session channel, please.',
              info: 'SSH_MSG_CHANNEL_OPEN session',
            }),
            ...msgOf(
              'term-channel',
              'fact-session',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'CONFIRM',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '0.185s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'Channel 0 is open.',
              info: 'SSH_MSG_CHANNEL_OPEN_CONFIRMATION, channel 0',
            }),
            ...msgOf(
              'term-shell',
              'fact-session',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'SHELL',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              time: '0.186s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'A terminal, 80 by 24, and start a shell.',
              info: 'CHANNEL_REQUEST pty-req, then shell',
            }),
            ...msgOf(
              'term-channel',
              'term-shell',
              'fact-session',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'PROMPT',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              time: '0.240s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'alex@srv:~$',
              info: 'CHANNEL_DATA: the prompt',
              st: 'At the prompt',
              known: true,
              page: 'text',
              rows: [{ key: 'chan', cells: ['Channel', 'session 0, a shell'] }],
            }),
          ],
          backing: { traces: ['term-channel', 'term-shell', 'fact-session', 'fact-also'] },
        },
        {
          id: 'interactive-session',
          title: 'Interactive Session',
          sub: 'Each keystroke is a packet',
          narrative:
            'You type ls and press Enter. Each key goes to the server the moment you press it, in its own small sealed packet, and the server sends the letter back so it appears on your screen. That’s the **echo**. When you press Enter, the server runs the command and sends back what it printed. All of these packets are sealed, so a watcher sees only small bursts of data.',
          deep: [
            {
              text: 'Each keystroke packet is mostly wrapping: the smallest SSH packet is about 28 bytes.',
              cite: [d('rfc-4253', '5.3')],
            },
            {
              text: 'Because the size and timing of packets can leak a little information, SSH software can send dummy packets to hide it.',
              cite: [r('rfc-4251', '9.3.9'), OPENBSD_OBSCURE],
            },
            {
              text: 'Typing exit ends the shell; the server reports how it ended and closes the channel.',
              cite: [d('rfc-4254', '6.10')],
            },
          ],
          facts: [
            { label: 'You type', value: 'l, s, Enter', backing: { example: true } },
            { label: 'Each key', value: 'one sealed packet, echoed back', backing: { traces: ['fact-typing'] } },
            { label: 'Output', value: 'the list of files', backing: { example: true } },
            { label: 'A watcher sees', value: 'small sealed bursts only', backing: { traces: ['fact-typing', 'fact-newkeys'] } },
          ],
          events: [
            ...msgOf(
              'fact-typing',
              'fact-session',
              'fact-newkeys',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEY l',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '3.020s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'The letter l.',
              info: 'CHANNEL_DATA: 1 byte (sealed)',
            }),
            ...msgOf(
              'fact-typing',
              'fact-session',
              'fact-newkeys',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'ECHO l',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '3.045s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'l, to show on your screen.',
              info: 'CHANNEL_DATA: echo',
            }),
            ...msgOf(
              'fact-typing',
              'fact-session',
              'fact-newkeys',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEY s',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '3.180s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'The letter s.',
              info: 'CHANNEL_DATA: 1 byte (sealed)',
            }),
            ...msgOf(
              'fact-typing',
              'fact-session',
              'fact-newkeys',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'ECHO s',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              fast: true,
              time: '3.205s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 's, to show on your screen.',
              info: 'CHANNEL_DATA: echo',
            }),
            ...msgOf(
              'fact-typing',
              'fact-session',
              'fact-newkeys',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'KEY ENTER',
              from: 'laptop',
              to: 'host',
              proto: 'SSH',
              via: 'TCP',
              kind: 'request',
              fast: true,
              time: '3.400s',
              src: LAPTOP,
              dst: HOST,
              size: '—',
              sum: 'Enter: run it.',
              info: 'CHANNEL_DATA: 1 byte (sealed)',
            }),
            ...msgOf(
              'fact-typing',
              'fact-session',
              'fact-newkeys',
              'fact-messages',
              'fact-rides',
              'fact-port',
            )({
              tag: 'OUTPUT',
              from: 'host',
              to: 'laptop',
              proto: 'SSH',
              via: 'TCP',
              kind: 'response',
              time: '3.428s',
              src: HOST,
              dst: LAPTOP,
              size: '—',
              sum: 'notes.txt   reports   site',
              info: 'CHANNEL_DATA: the command’s output',
              st: 'Ran ls',
              done: true,
            }),
          ],
          backing: { traces: ['fact-typing', 'fact-session', 'fact-newkeys'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'SSH built a sealed line, checked that the server was the right one, let you in with a key, then carried every keystroke across.',
            cite: [d('rfc-4251', '1'), d('rfc-4252', '7'), d('rfc-4254', '6.6')],
          },
        ],
        terms: [
          {
            id: 'term-version',
            idea: 'Both sides say which version and which software they run',
            name: 'Version exchange',
            cite: [d('rfc-4253', '4.2')],
          },
          {
            id: 'term-kexinit',
            idea: 'Lists of what each side can use',
            name: 'Algorithm negotiation (KEXINIT)',
            cite: [d('rfc-4253', '7.1')],
          },
          {
            id: 'term-kex',
            idea: 'The same secret, made on both sides, never sent',
            name: 'Key exchange',
            cite: [d('rfc-4253', '8'), d('rfc-9941', '3'), r('rfc-7748', '6.1')],
          },
          {
            id: 'term-hostkey',
            idea: 'The server’s permanent ID',
            name: 'Host key',
            cite: [d('rfc-4251', '4.1'), d('rfc-4253', '8')],
          },
          {
            id: 'term-knownhosts',
            idea: 'Your list of servers you’ve checked',
            name: 'known_hosts',
            cite: [d('rfc-4251', '4.1'), MS_KNOWN, CISCO_KNOWN],
          },
          {
            id: 'term-keypair',
            idea: 'A private key that stays home, and its public half on the server',
            name: 'Key pair',
            cite: [d('rfc-4252', '7'), MS_PRIVATE_HOME, MS_PUBLIC_HALF],
          },
          {
            id: 'term-channel',
            idea: 'One conversation inside the connection',
            name: 'Channel',
            cite: [d('rfc-4254', '5')],
          },
          {
            id: 'term-shell',
            idea: 'The program that reads your commands',
            name: 'Shell',
            cite: [d('rfc-4254', '6.5'), MS_SHELL],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Version Exchange', 'Negotiation', 'Key Exchange', 'Authentication', 'Channel'],
          note: 'Every SSH login goes this way. The seal is on from the key exchange onward.',
          cite: [d('rfc-4253', '4.2'), d('rfc-4253', '7.1'), d('rfc-4253', '8'), d('rfc-4252', '1'), d('rfc-4254', '5'), d('rfc-4251', '1'), d('rfc-4253', '7.3')],
        },
        why: [
          {
            id: 'why-1',
            text: 'Before SSH, people used Telnet and rlogin, which were far less safe: Telnet sent everything as plain text.',
            cite: [r('rfc-4251', '4.1'), NIST_IR_BASICS, NIST_SERVER_SECURITY, CLOUDFLARE_TELNET],
          },
          {
            id: 'why-2',
            text: 'SSH gave the same remote control with a seal, a check that the server is real, and logins that need no password at all.',
            cite: [d('rfc-4251', '1'), d('rfc-4251', '4.1'), d('rfc-4252', '7')],
          },
          {
            id: 'why-3',
            text: 'Administrators use it to manage remote machines, from servers to routers.',
            cite: [MS_ADMINS, NIST_IR_BASICS, CISCO_INTRO],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'SSH has three layers: transport (version, key exchange, encryption), user authentication (publickey, password, keyboard-interactive) and connection (channels).',
            cite: [d('rfc-4251', '1'), d('rfc-4253', '4.2'), d('rfc-4252', '7'), d('rfc-4252', '8'), d('rfc-4256', '1'), d('rfc-4254', '5')],
          },
          {
            id: 'deep-2',
            text: 'One connection can also forward ports, either way or as a SOCKS proxy (ssh -D), and copy files (scp, sftp).',
            cite: [d('rfc-4254', '7.2'), MS_SOCKS, OPENBSD_SOCKS, MS_SCP, MS_SFTP, OPENBSD_SFTP, NIST_IR_USES],
          },
          {
            id: 'deep-3',
            text: 'On servers you run, use keys and turn off password logins.',
            cite: [MS_NO_PASSWORDS, OPENBSD_PASSWORD, r('rfc-4251', '9.4.5')],
          },
        ],
        facts: [
          { id: 'fact-port', label: 'Port', value: '22', cite: [d('rfc-4253', '4.1'), IANA_PORTS] },
          { id: 'fact-replaced', label: 'Replaced', value: 'Telnet (23), rlogin', cite: [r('rfc-4251', '4.1'), NIST_IR_BASICS, IANA_PORT_23] },
          { id: 'fact-logins', label: 'Logins', value: 'public key, password', cite: [d('rfc-4252', '7'), d('rfc-4252', '8')] },
          {
            id: 'fact-also',
            label: 'Also does',
            value: 'SFTP, scp, port forwarding',
            cite: [MS_SFTP, MS_SCP, OPENBSD_SFTP, NIST_IR_USES, d('rfc-4254', '7.2')],
          },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 4251 to 4254',
            cite: [d('rfc-4251', '1'), d('rfc-4252', '1'), d('rfc-4253', '1'), d('rfc-4254', '1')],
          },
          {
            id: 'fact-tcp',
            label: 'TCP connection',
            value: 'opened by a handshake of three messages (SYN, SYN-ACK, ACK)',
            cite: [d('rfc-9293', '3.5')],
          },
          {
            id: 'fact-rides',
            label: 'SSH rides on',
            value: 'TCP; the server listens on port 22',
            cite: [d('rfc-4253', '4.1'), d('rfc-4251', '1')],
          },
          {
            id: 'fact-choice',
            label: 'Choosing tools',
            value: 'each side sends its list of what it can use, best first, as key exchange begins; both then take the first item on the client’s list that the server also has',
            cite: [d('rfc-4253', '7.1'), d('rfc-4253', '4.2')],
          },
          {
            id: 'fact-algorithms',
            label: 'In this example',
            value: 'key exchange sntrup761x25519-sha512 (X25519 with a post-quantum method), host key ssh-ed25519, cipher chacha20-poly1305',
            cite: [abstractOf('rfc-9941', 9941), IANA_KEX, d('rfc-8709', '1'), IANA_HOSTKEY, IANA_CIPHER, CISCO_SHOW_IP_SSH],
          },
          {
            id: 'fact-hostkey',
            label: 'Host key',
            value:
              'signs the key exchange; your laptop checks it against its list of known servers (~/.ssh/known_hosts), and the first time asks you to check the key’s fingerprint',
            cite: [d('rfc-4253', '8'), d('rfc-4251', '4.1'), MS_FINGERPRINT, MS_KNOWN, CISCO_KNOWN],
          },
          {
            id: 'fact-newkeys',
            label: 'Seal starts',
            value: 'when both sides have sent NEWKEYS, at the end of the key exchange; from then on every message is encrypted and checked with the new keys',
            cite: [d('rfc-4253', '7.3'), d('rfc-4253', '6.3'), d('rfc-4253', '6.4'), d('rfc-4253', '4.2')],
          },
          {
            id: 'fact-keylogin',
            label: 'Key login',
            value:
              'the laptop asks whether its public key is allowed, then sends a signature made with its private key over the session ID, and the server checks it; the server finds the allowed keys in ~/.ssh/authorized_keys, and the private key itself never crosses',
            cite: [d('rfc-4252', '7'), d('rfc-4253', '7.2'), MS_AUTH_KEYS, OPENBSD_AUTH_FILE, MS_PRIVATE_HOME, OPENBSD_AGENT],
          },
          {
            id: 'fact-session',
            label: 'Session',
            value:
              'opened as a channel (one connection carries many channels at once); pty-req asks for a terminal (such as 80 by 24), then shell starts one; output comes back as CHANNEL_DATA',
            cite: [d('rfc-4254', '5'), d('rfc-4254', '6.1'), d('rfc-4254', '6.2'), d('rfc-4254', '6.5'), d('rfc-4254', '6.6')],
          },
          {
            id: 'fact-typing',
            label: 'Typing',
            value:
              'each key goes at once, as one byte, in its own small sealed packet, and the server echoes it back; a watcher can see only the size and timing of the packets',
            cite: [d('rfc-4253', '5.3'), d('rfc-4254', '8'), r('rfc-4251', '9.3.9'), d('rfc-4253', '6.3')],
          },
          {
            id: 'fact-messages',
            label: 'Messages',
            value:
              'KEXINIT; KEX_ECDH_INIT and KEX_ECDH_REPLY, which carry each side’s temporary public key; NEWKEYS; USERAUTH_REQUEST, USERAUTH_PK_OK and USERAUTH_SUCCESS; CHANNEL_OPEN, CHANNEL_OPEN_CONFIRMATION, CHANNEL_REQUEST and CHANNEL_DATA',
            cite: [
              d('rfc-4253', '7.1'),
              d('rfc-4253', '7.3'),
              d('rfc-9941', '3'),
              d('rfc-4252', '7'),
              d('rfc-4252', '5.3'),
              d('rfc-4254', '5.1'),
              d('rfc-4254', '6.2'),
              d('rfc-4254', '6.6'),
            ],
          },
          { id: 'fact-name', label: 'Stands for', value: 'Secure Shell', cite: [d('rfc-4251', '1')] },
          {
            id: 'fact-purpose',
            label: 'Purpose',
            value: 'secure remote login: typing commands on another computer over a line that others on the way can’t read or change',
            cite: [d('rfc-4251', '1'), d('rfc-4254', '1'), NIST_IR_BASICS],
          },
          {
            id: 'fact-secret',
            label: 'Shared secret',
            value: 'each side combines the other’s public key with its own private one and gets the same secret, which never crosses the network',
            cite: [d('rfc-4253', '8'), d('rfc-9941', '3'), r('rfc-7748', '6.1')],
          },
          {
            id: 'fact-command',
            label: 'The ssh command',
            value: 'ssh user@host connects and logs you in on the named computer',
            cite: [MS_COMMAND, CISCO_COMMAND, OPENBSD_COMMAND],
          },
        ],
      },
      practice: [
        {
          id: 'host-key-changed',
          prompt: 'You connect to a server you’ve used before, and ssh warns that its host key has changed. What might it mean?',
          options: [
            {
              text: 'Someone could be pretending to be the server, so stop and check.',
              feedback:
                'Right. A changed host key is exactly what an attacker in the middle would look like. Check with whoever runs the server.',
              cite: [r('rfc-4251', '9.3.4'), OPENBSD_WARNS],
            },
            {
              text: 'Your password has expired.',
              feedback: 'Not quite. The host key is the server’s ID, not your login.',
              cite: [d('rfc-4251', '4.1'), d('rfc-4252', '8')],
            },
            {
              text: 'Nothing: it changes every time.',
              feedback: 'Not quite. A host key stays the same from one visit to the next, and your laptop compares it each time. A change is worth a warning.',
              cite: [d('rfc-4251', '4.1'), MS_KNOWN],
            },
          ],
          answer: 0,
        },
        {
          id: 'what-crosses',
          prompt: 'With public-key login, what crosses the network?',
          options: [
            {
              text: 'Your private key.',
              feedback: 'Not quite. The private key never leaves your laptop.',
              cite: [d('rfc-4252', '7'), MS_PRIVATE_HOME],
            },
            {
              text: 'A signature made with your private key.',
              feedback: 'Yes. The server checks it with your public key. No secret is sent.',
              cite: [d('rfc-4252', '7'), OPENBSD_AGENT],
            },
            {
              text: 'Your password, sealed.',
              feedback: 'Not quite. With a key, no password is sent at all.',
              cite: [d('rfc-4252', '7'), d('rfc-4252', '8')],
            },
          ],
          answer: 1,
        },
      ],
    },
  ],
});
