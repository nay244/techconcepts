// @vitest-environment jsdom
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import type { PlaygroundPreset } from '../../../content/schema';
import { IPV4_ERROR } from '../../../engine/net/ipv4';
import SubnetCanvas from './SubnetCanvas';
import SubnetReadout from './SubnetReadout';
import { useSubnetPlayground } from './useSubnetPlayground';

const DIFFERENT = 'Different subnets: traffic between them goes through a router';

const PRESET: PlaygroundPreset = { address: '192.168.1.10', prefix: 24 };

/** The two views the lesson console mounts, fed by one hook, as the console does. */
function Playground({ preset, locked = false }: { preset: PlaygroundPreset; locked?: boolean }) {
  const state = useSubnetPlayground(preset, locked);
  return (
    <>
      <SubnetCanvas state={state} />
      <SubnetReadout state={state} />
    </>
  );
}

const canvas = () => screen.getByRole('region', { name: 'Subnet playground' });
const readout = () => screen.getByRole('region', { name: 'Current values' });
const addressInput = () => screen.getByLabelText('IP address');
const slider = () => screen.getByLabelText('Prefix length');
const compareInput = () => screen.getByLabelText('Compare with');

/** The value shown beside a readout term such as "Network". */
function valueOf(term: string): string {
  const dd = within(readout()).getByText(term, { selector: 'dt' }).nextElementSibling;
  if (!dd) throw new Error(`no value beside "${term}"`);
  return dd.textContent ?? '';
}

const setPrefixTo = (prefix: number) => fireEvent.change(slider(), { target: { value: String(prefix) } });

// ------------------------------------------------------------ the brief

test('unlocked at 192.168.1.10/24: the readout shows the network and the usable hosts', () => {
  render(<Playground preset={PRESET} />);
  expect(valueOf('Network')).toBe('192.168.1.0');
  expect(valueOf('Usable hosts')).toBe('254');
  expect(valueOf('Mask')).toBe('255.255.255.0');
  expect(valueOf('Broadcast')).toBe('192.168.1.255');
  expect(valueOf('First host')).toBe('192.168.1.1');
  expect(valueOf('Last host')).toBe('192.168.1.254');
});

test('the readout is a description list: six values and the Same subnet? check', () => {
  render(<Playground preset={PRESET} />);
  const terms = [...readout().querySelectorAll('dl > div > dt')].map((dt) => dt.textContent);
  expect(terms).toEqual(['Mask', 'Network', 'Broadcast', 'First host', 'Last host', 'Usable hosts', 'Same subnet?']);
});

test('the slider moves the prefix: /26 gives 62 usable hosts in the same network', () => {
  render(<Playground preset={PRESET} />);
  setPrefixTo(26);
  expect(valueOf('Usable hosts')).toBe('62');
  expect(valueOf('Network')).toBe('192.168.1.0');
  expect(valueOf('Mask')).toBe('255.255.255.192');
});

test('typing 192.168.1.256 shows the error and the readout keeps the previous network', async () => {
  const user = userEvent.setup();
  render(<Playground preset={PRESET} />);
  await user.clear(addressInput());
  await user.type(addressInput(), '192.168.1.256');
  expect(screen.getByText(IPV4_ERROR)).toBeInTheDocument();
  expect(valueOf('Network')).toBe('192.168.1.0');
  expect(valueOf('Usable hosts')).toBe('254');
});

test('typing "  192.168.1.70 " (spaces around it) clears the error: network 192.168.1.64 at /26', async () => {
  const user = userEvent.setup();
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  await user.clear(addressInput());
  expect(screen.getByText(IPV4_ERROR)).toBeInTheDocument();
  await user.type(addressInput(), '  192.168.1.70 ');
  expect(screen.queryByText(IPV4_ERROR)).not.toBeInTheDocument();
  expect(valueOf('Network')).toBe('192.168.1.64');
});

test('comparing 192.168.1.10 with 192.168.1.70: different at /26, the same at /24', async () => {
  const user = userEvent.setup();
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  await user.type(compareInput(), '192.168.1.70');
  expect(screen.getByText(DIFFERENT)).toBeInTheDocument();
  expect(screen.queryByText('Same subnet')).not.toBeInTheDocument();

  setPrefixTo(24);
  expect(screen.getByText('Same subnet')).toBeInTheDocument();
  expect(screen.queryByText(DIFFERENT)).not.toBeInTheDocument();
});

test('locked: the address and prefix inputs are disabled, with the note explaining why', () => {
  render(<Playground preset={PRESET} locked />);
  expect(addressInput()).toBeDisabled();
  expect(slider()).toBeDisabled();
  expect(within(canvas()).getByText('You can change these in Try it.')).toBeInTheDocument();
});

test('locked also disables the compare input, and unlocked has no note', () => {
  const { rerender } = render(<Playground preset={PRESET} locked />);
  expect(compareInput()).toBeDisabled();

  rerender(<Playground preset={PRESET} locked={false} />);
  expect(addressInput()).toBeEnabled();
  expect(slider()).toBeEnabled();
  expect(compareInput()).toBeEnabled();
  expect(screen.queryByText('You can change these in Try it.')).not.toBeInTheDocument();
});

test('a new preset resets the address, the prefix and the compare field', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Playground preset={{ address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' }} />);
  await user.clear(addressInput());
  await user.type(addressInput(), '10.0.0.5');
  setPrefixTo(30);
  await user.clear(compareInput());

  rerender(<Playground preset={{ address: '172.16.5.4', prefix: 20 }} />);
  expect(addressInput()).toHaveValue('172.16.5.4');
  expect(slider()).toHaveValue('20');
  expect(compareInput()).toHaveValue('');
  expect(valueOf('Network')).toBe('172.16.0.0');
  expect(valueOf('Usable hosts')).toBe('4,094');
});

// ------------------------------------------------------------ review focus: malformed addresses

const MALFORMED: [string, string][] = [
  ['an octet above 255', '192.168.1.256'],
  ['too few octets', '192.168.1'],
  ['a leading zero', '192.168.01.1'],
  ['not an address at all', 'abc'],
  ['nothing', ''],
];

test.each(MALFORMED)('malformed (%s): inline error, last valid results kept, no NaN', (_name, text) => {
  render(<Playground preset={{ address: '192.168.1.70', prefix: 26 }} />);
  fireEvent.change(addressInput(), { target: { value: text } });

  expect(screen.getByText(IPV4_ERROR)).toBeInTheDocument();
  // Announced: the field is marked invalid and described by the error text.
  expect(addressInput()).toBeInvalid();
  expect(addressInput()).toHaveAccessibleDescription(IPV4_ERROR);
  // The readout still shows the last valid address's subnet, not zeros or NaN.
  expect(valueOf('Network')).toBe('192.168.1.64');
  expect(valueOf('Broadcast')).toBe('192.168.1.127');
  expect(valueOf('Usable hosts')).toBe('62');
  expect(document.body).not.toHaveTextContent('NaN');
  expect(document.body).not.toHaveTextContent('undefined');
});

test('after a malformed address, a valid one clears the error, the invalid state and the description', () => {
  render(<Playground preset={{ address: '192.168.1.70', prefix: 26 }} />);
  fireEvent.change(addressInput(), { target: { value: 'abc' } });
  expect(addressInput()).toBeInvalid();

  fireEvent.change(addressInput(), { target: { value: '  192.168.1.130 ' } });
  expect(screen.queryByText(IPV4_ERROR)).not.toBeInTheDocument();
  expect(addressInput()).toBeValid();
  expect(addressInput()).not.toHaveAttribute('aria-invalid');
  expect(addressInput()).not.toHaveAttribute('aria-describedby');
  expect(valueOf('Network')).toBe('192.168.1.128');
});

test('the compare field shows its own error and no result while its text is invalid', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' }} />);
  expect(screen.getByText(DIFFERENT)).toBeInTheDocument();

  fireEvent.change(compareInput(), { target: { value: '192.168.1.256' } });
  expect(within(readout()).getByText(IPV4_ERROR)).toBeInTheDocument();
  expect(compareInput()).toBeInvalid();
  expect(compareInput()).toHaveAccessibleDescription(IPV4_ERROR);
  expect(screen.queryByText(DIFFERENT)).not.toBeInTheDocument();
  expect(screen.queryByText('Same subnet')).not.toBeInTheDocument();
  // The address side is untouched.
  expect(addressInput()).toBeValid();

  fireEvent.change(compareInput(), { target: { value: '' } });
  expect(screen.queryByText(IPV4_ERROR)).not.toBeInTheDocument();
  expect(compareInput()).toBeValid();
});

test('a malformed address keeps the last valid comparison result', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' }} />);
  fireEvent.change(addressInput(), { target: { value: 'abc' } });
  expect(screen.getByText(DIFFERENT)).toBeInTheDocument();
});

// ------------------------------------------------------------ the canvas

test('the prefix slider runs /16 to /30 and reads as a prefix to assistive technology', () => {
  render(<Playground preset={PRESET} />);
  expect(slider()).toHaveAttribute('type', 'range');
  expect(slider()).toHaveAttribute('min', '16');
  expect(slider()).toHaveAttribute('max', '30');
  expect(slider()).toHaveValue('24');
  expect(slider()).toHaveAttribute('aria-valuetext', '/24');

  setPrefixTo(27);
  expect(slider()).toHaveAttribute('aria-valuetext', '/27');
  expect(within(canvas()).getByText('/27')).toBeInTheDocument();
});

const bitsOf = (part: 'network' | 'host') => {
  const group = canvas().querySelector(`[data-part="${part}"]`);
  if (!group) throw new Error(`no ${part} group`);
  return [...group.querySelectorAll('[data-octet]')].map((el) => el.textContent);
};

test('the 32-bit row splits at the prefix: network bits, a divider, then host bits', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  // 192.168.1.10 = 11000000.10101000.00000001.00001010
  expect(bitsOf('network')).toEqual(['11000000', '10101000', '00000001', '00']);
  expect(bitsOf('host')).toEqual(['001010']);

  const group = (part: string) => canvas().querySelector(`[data-part="${part}"]`);
  const divider = canvas().querySelector('[data-divider]');
  expect(divider).not.toBeNull();
  expect(divider?.previousElementSibling).toBe(group('network'));
  expect(divider?.nextElementSibling).toBe(group('host'));
});

test('the groups are labelled in text with their bit counts, not by colour alone', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  const networkGroup = canvas().querySelector('[data-part="network"]') as HTMLElement;
  const hostGroup = canvas().querySelector('[data-part="host"]') as HTMLElement;
  expect(within(networkGroup).getByText('Network')).toBeInTheDocument();
  expect(within(networkGroup).getByText('26 bits')).toBeInTheDocument();
  expect(within(hostGroup).getByText('Host')).toBeInTheDocument();
  expect(within(hostGroup).getByText('6 bits')).toBeInTheDocument();
});

test('the bit row moves with the slider, at an octet boundary too', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  setPrefixTo(24);
  expect(bitsOf('network')).toEqual(['11000000', '10101000', '00000001']);
  expect(bitsOf('host')).toEqual(['00001010']);
  setPrefixTo(16);
  expect(bitsOf('network')).toEqual(['11000000', '10101000']);
  expect(bitsOf('host')).toEqual(['00000001', '00001010']);
});

test('the bit row has a text equivalent: the binary address and where it splits', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  const row = screen.getByRole('img', { name: /in binary/i });
  expect(row).toHaveAccessibleName(
    '192.168.1.10 in binary is 11000000.10101000.00000001.00001010. The first 26 bits are the network part and the last 6 are the host part.',
  );
});

test('while the address text is invalid, the bit row keeps showing the last valid address', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26 }} />);
  fireEvent.change(addressInput(), { target: { value: '192.168.1' } });
  expect(bitsOf('network')).toEqual(['11000000', '10101000', '00000001', '00']);
  expect(bitsOf('host')).toEqual(['001010']);
});

// ------------------------------------------------------------ the readout's compare field

test('an empty compare field shows no result and no error, and so does a field of spaces', async () => {
  const user = userEvent.setup();
  render(<Playground preset={PRESET} />);
  expect(screen.queryByText('Same subnet')).not.toBeInTheDocument();
  expect(screen.queryByText(DIFFERENT)).not.toBeInTheDocument();
  expect(screen.queryByText(IPV4_ERROR)).not.toBeInTheDocument();

  await user.type(compareInput(), '   ');
  expect(screen.queryByText(IPV4_ERROR)).not.toBeInTheDocument();
  expect(compareInput()).toBeValid();
});

test('the compare result is announced politely when it changes', async () => {
  const user = userEvent.setup();
  render(<Playground preset={{ address: '192.168.1.10', prefix: 24 }} />);
  const status = within(readout()).getByRole('status');
  expect(status).toBeEmptyDOMElement();
  await user.type(compareInput(), ' 192.168.1.70 ');
  expect(status).toHaveTextContent('Same subnet');
});

test('a preset with a compare address shows its result straight away', () => {
  render(<Playground preset={{ address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' }} />);
  expect(compareInput()).toHaveValue('192.168.1.70');
  expect(screen.getByText(DIFFERENT)).toBeInTheDocument();
});

// ------------------------------------------------------------ lesson-console contract

test('re-rendering with the same preset values in a fresh object keeps the learner’s edits', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Playground preset={{ address: '192.168.1.10', prefix: 24 }} locked={false} />);
  await user.clear(addressInput());
  await user.type(addressInput(), '10.1.2.3');
  setPrefixTo(28);
  await user.type(compareInput(), '10.1.2.9');

  rerender(<Playground preset={{ address: '192.168.1.10', prefix: 24 }} locked={false} />);
  expect(addressInput()).toHaveValue('10.1.2.3');
  expect(slider()).toHaveValue('28');
  expect(compareInput()).toHaveValue('10.1.2.9');
  expect(valueOf('Network')).toBe('10.1.2.0');
});

test('a new reset key starts over from the same preset; the same key keeps the edits', () => {
  const { result, rerender } = renderHook(
    (props: { resetKey: number }) => useSubnetPlayground({ address: '192.168.1.10', prefix: 24 }, false, props.resetKey),
    { initialProps: { resetKey: 5 } },
  );
  act(() => result.current.setPrefix(28));
  rerender({ resetKey: 5 });
  expect(result.current.prefix).toBe(28);
  rerender({ resetKey: 6 });
  expect(result.current.prefix).toBe(24);
  expect(result.current.addressText).toBe('192.168.1.10');
});

test('the inputs leave keyboard events alone, so Space and arrow keys behave normally and bubble to the page', async () => {
  const user = userEvent.setup();
  const onKey = vi.fn((event: KeyboardEvent) => event.defaultPrevented);
  window.addEventListener('keydown', onKey);
  try {
    render(<Playground preset={PRESET} />);
    await user.click(addressInput());
    await user.keyboard(' ');
    expect(addressInput()).toHaveValue('192.168.1.10 ');
    // Space did not scroll or toggle anything: it was not cancelled on its way up to the window.
    expect(onKey).toHaveBeenCalled();
    expect(onKey.mock.results.every((r) => r.value === false)).toBe(true);
    expect(onKey.mock.calls.every(([event]) => event.target === addressInput())).toBe(true);

    onKey.mockClear();
    slider().focus();
    await user.keyboard('{ArrowRight}');
    expect(onKey).toHaveBeenCalledTimes(1);
    expect(onKey.mock.calls[0]?.[0].target).toBe(slider());
    expect(onKey.mock.results[0]?.value).toBe(false);
  } finally {
    window.removeEventListener('keydown', onKey);
  }
});

// ------------------------------------------------------------ the hook on its own

const hook = (preset: PlaygroundPreset = PRESET, locked = false) =>
  renderHook((props: { preset: PlaygroundPreset; locked: boolean }) => useSubnetPlayground(props.preset, props.locked), {
    initialProps: { preset, locked },
  });

test('hook: starts from the preset, with no errors and no comparison', () => {
  const { result } = hook({ address: '192.168.1.10', prefix: 24 });
  expect(result.current).toMatchObject({
    addressText: '192.168.1.10',
    prefix: 24,
    compareText: '',
    addressError: null,
    compare: null,
    compareError: null,
    locked: false,
  });
  expect(result.current.info.usableHosts).toBe(254);
});

test('hook: reports locked as given', () => {
  const { result, rerender } = hook(PRESET, true);
  expect(result.current.locked).toBe(true);
  rerender({ preset: PRESET, locked: false });
  expect(result.current.locked).toBe(false);
});

test('hook: info holds the last valid result; both errors equal IPV4_ERROR while the text is invalid', () => {
  const { result } = hook({ address: '192.168.1.70', prefix: 26, compare: '192.168.1.10' });
  const before = result.current.info;

  act(() => result.current.setAddressText('192.168.1'));
  expect(result.current.addressError).toBe(IPV4_ERROR);
  expect(result.current.info).toEqual(before);

  act(() => result.current.setCompareText('abc'));
  expect(result.current.compareError).toBe(IPV4_ERROR);
  expect(result.current.compare).toBeNull();

  act(() => result.current.setAddressText('192.168.1.130'));
  expect(result.current.addressError).toBeNull();
  expect(result.current.info.network).not.toBe(before.network);
});

test('hook: compare is "same" or "different" for the last valid address and the current prefix', () => {
  const { result } = hook({ address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' });
  expect(result.current.compare).toBe('different');
  act(() => result.current.setPrefix(24));
  expect(result.current.compare).toBe('same');
  act(() => result.current.setCompareText(''));
  expect(result.current.compare).toBeNull();
  expect(result.current.compareError).toBeNull();
});

test.each([
  [99, 30],
  [3, 16],
  [26.4, 26],
  [Infinity, 30],
  [NaN, 16],
])('hook: setPrefix(%s) stays inside the slider’s range (%s) and never throws', (given, expected) => {
  const { result } = hook();
  act(() => result.current.setPrefix(given));
  expect(result.current.prefix).toBe(expected);
  expect(Number.isFinite(result.current.info.usableHosts)).toBe(true);
});

test('hook: a preset with an address that does not parse shows the error and falls back to 0.0.0.0, never throws', () => {
  const { result } = hook({ address: 'not an address', prefix: 24 });
  expect(result.current.addressError).toBe(IPV4_ERROR);
  expect(result.current.info.network).toBe(0);
});
