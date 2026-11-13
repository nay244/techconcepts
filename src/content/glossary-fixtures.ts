import { defineGlossaryGroup, type GlossaryGroup, type GlossaryGroupInput } from './glossary-group';
import { cite } from './sources';
import { FIXTURE_SOURCES } from './test-fixtures';

/**
 * Valid glossary groups for tests, against `FIXTURE_SOURCES` (RFC 9999, whose citations are marked as the defining
 * standard). Every call builds a fresh object, so a test can change any part of it. Ties name the terms of the cited
 * fixture lesson (`cited-lesson`: `term-1` Lease request, `term-2` Lease, `term-3` Renewal).
 */

/** `rfc-example` at a numbered section, marked as the defining standard. */
export const defining = (section = '2.1') => cite('rfc-example', section, { sources: FIXTURE_SOURCES, defining: true });

/** A statement with one defining citation. */
export const statement = (id: string, text = 'An address lent to a device for a set time.', section = '2.1') => ({ id, text, cite: [defining(section)] });

export function makeGroupInput(): GlossaryGroupInput & { entries: NonNullable<GlossaryGroupInput['entries']> } {
  return {
    id: 'pilot',
    entries: [
      {
        id: 'lease',
        term: 'Lease',
        also: ['Address lease'],
        definition: [statement('lease-1'), statement('lease-2', 'It ends unless the device renews it.', '4.4')],
        lessons: [{ lesson: 'cited-lesson', term: 'term-2' }],
      },
      {
        id: 'renewal',
        term: 'Renewal',
        senses: [
          { id: 'dhcp', label: 'In the example protocol', definition: [statement('renewal-dhcp-1', 'Asking to keep an address longer.', '4.4')], lessons: [{ lesson: 'cited-lesson', term: 'term-3' }] },
          { id: 'contracts', label: 'In contracts', definition: [statement('renewal-contracts-1', 'Extending an agreement for another period.', '3.1')] },
        ],
      },
    ],
  };
}

/** A valid group, made as a group file makes it, against the fixture sources. */
export const makeGroup = (edit: (input: ReturnType<typeof makeGroupInput>) => void = () => {}): GlossaryGroup => {
  const input = makeGroupInput();
  edit(input);
  return defineGlossaryGroup(input, FIXTURE_SOURCES);
};
