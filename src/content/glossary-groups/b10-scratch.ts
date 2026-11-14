import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/** B10's scratch group: made up, never merged. It exists to run the glossary tests against a glossary larger than the pilot. */
const r791 = (section: string) => cite('rfc-791', section, { defining: true });
const r792 = (section: string) => cite('rfc-792', section, { defining: true });
const r1122 = (section: string) => cite('rfc-1122', section, { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-34', defining: true });
const r826 = cite('rfc-826', 'Introduction', { url: 'https://www.rfc-editor.org/rfc/rfc826.html#:~:text=Ethernet', defining: true });
const r768 = cite('rfc-768', 'Introduction', { url: 'https://www.rfc-editor.org/rfc/rfc768.html#:~:text=Introduction', defining: true });

export default defineGlossaryGroup({
  id: 'b10-scratch',
  entries: [
    { id: 'eight-oh-two-one-x', term: '802.1X', definition: [{ id: 'eight-1', text: 'A scratch entry for the digits key.', cite: [r791('3.1'), r1122('3.2.1.7')] }] },
    { id: 'arp', term: 'ARP', definition: [{ id: 'arp-1', text: 'A scratch entry with no tie.', cite: [r826, r791('3.1')] }] },
    { id: 'binding', term: 'Binding', definition: [{ id: 'binding-1', text: 'A scratch entry tied to a Networking Concepts term.', cite: [r791('3.1'), r1122('3.2.1.7')] }], lessons: [{ lesson: 'dhcp', term: 'term-lease-table' }] },
    { id: 'checksum', term: 'Checksum', definition: [{ id: 'checksum-1', text: 'A scratch entry tied to the OSI header.', cite: [r791('3.1'), cite('rfc-792', 'Echo or Echo Reply Message, page 14', { url: 'https://www.rfc-editor.org/rfc/rfc792.html#page-14', defining: true })] }], lessons: [{ lesson: 'osi-model', term: 'term-header' }] },
    { id: 'forwarder', term: 'Forwarder', definition: [{ id: 'forwarder-1', text: 'A scratch entry tied to the DNS cache.', cite: [r791('3.1'), r1122('3.2.1.7')] }], lessons: [{ lesson: 'what-is-dns', term: 'term-cache' }] },
    {
      id: 'mask',
      term: 'Mask',
      also: ['Netmask'],
      senses: [
        { id: 'one', label: 'In scratch one', definition: [{ id: 'mask-one-1', text: 'The first scratch sense.', cite: [r791('3.1'), r1122('3.2.1.7')] }] },
        { id: 'two', label: 'In scratch two', definition: [{ id: 'mask-two-1', text: 'The second scratch sense.', cite: [r791('3.1'), r1122('3.2.1.7')] }] },
      ],
    },
    { id: 'router', term: 'Router', definition: [{ id: 'router-1', text: 'A scratch entry with no tie.', cite: [r791('3.1'), r1122('3.2.1.7')] }] },
    { id: 'udp', term: 'UDP', definition: [{ id: 'udp-1', text: 'A scratch one-liner.', cite: [r768, r791('3.1')] }] },
  ],
});
