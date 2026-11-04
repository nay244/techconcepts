import { useState } from 'react';
import type { PlaygroundPreset } from '../../../content/schema';
import { parseIPv4, type IPv4 } from '../../../engine/net/ipv4';
import { sameSubnet, subnetInfo, type SubnetInfo } from '../../../engine/net/subnet';

/** The slider's range. The lesson schema limits presets to the same range. */
export const MIN_PREFIX = 16;
export const MAX_PREFIX = 30;

export interface SubnetPlaygroundState {
  addressText: string;
  setAddressText(value: string): void;
  prefix: number;
  setPrefix(prefix: number): void;
  compareText: string;
  setCompareText(value: string): void;
  /**
   * The last valid address as a number. The bit row draws from it, so it stays
   * put while `addressText` is invalid, just as `info` does.
   */
  address: IPv4;
  /** Always the subnet of the last valid address at the current prefix. */
  info: SubnetInfo;
  /** `IPV4_ERROR` while `addressText` does not parse, otherwise null. */
  addressError: string | null;
  /** Null for an empty compare field and while it does not parse. */
  compare: 'same' | 'different' | null;
  /** `IPV4_ERROR` while `compareText` does not parse, otherwise null. An empty field is not an error. */
  compareError: string | null;
  locked: boolean;
}

interface Fields {
  /** Which preset, by value, and which reset key these fields came from. */
  presetKey: string;
  addressText: string;
  address: IPv4;
  prefix: number;
  compareText: string;
}

function clampPrefix(prefix: number): number {
  // subnetInfo throws outside 0-32, so nothing a caller passes may get that far.
  return Number.isNaN(prefix) ? MIN_PREFIX : Math.min(MAX_PREFIX, Math.max(MIN_PREFIX, Math.round(prefix)));
}

function presetKey(preset: PlaygroundPreset, resetKey: string | number): string {
  return JSON.stringify([preset.address, preset.prefix, preset.compare ?? '', resetKey]);
}

function fieldsFromPreset(preset: PlaygroundPreset, resetKey: string | number): Fields {
  const parsed = parseIPv4(preset.address);
  return {
    presetKey: presetKey(preset, resetKey),
    addressText: preset.address,
    // Lessons are validated at build time, so an unparseable preset address is a content bug. Show the error, not a crash.
    address: parsed.ok ? parsed.value : 0,
    prefix: clampPrefix(preset.prefix),
    compareText: preset.compare ?? '',
  };
}

/**
 * The subnet playground's state: an address, a prefix and an address to compare with.
 *
 * It starts from `preset` and starts over whenever the preset's *values* change,
 * or `resetKey` does. The lesson console may hand over a new object on every
 * render, so identity means nothing here, and a learner's edits survive a
 * re-render of the same preset. The console passes its position as `resetKey`,
 * so every position starts from its own preset, even where two positions share
 * one, and Try it's edits are dropped as soon as the learner leaves it.
 *
 * Bad input never reaches the maths. The hook keeps the last valid address, so
 * `info` (and the comparison) stay on the last good result while the text is
 * wrong, and the error says what to fix.
 */
export function useSubnetPlayground(preset: PlaygroundPreset, locked: boolean, resetKey: string | number = ''): SubnetPlaygroundState {
  const [fields, setFields] = useState(() => fieldsFromPreset(preset, resetKey));

  // Starting over when a prop changes is done during render, not in an effect, so no
  // frame ever shows the old preset's values next to the new narration.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (presetKey(preset, resetKey) !== fields.presetKey) setFields(fieldsFromPreset(preset, resetKey));

  const addressResult = parseIPv4(fields.addressText);
  const compareResult = fields.compareText.trim() === '' ? null : parseIPv4(fields.compareText);

  let compare: SubnetPlaygroundState['compare'] = null;
  if (compareResult?.ok) compare = sameSubnet(fields.address, compareResult.value, fields.prefix) ? 'same' : 'different';

  return {
    addressText: fields.addressText,
    setAddressText: (value) =>
      setFields((f) => {
        const parsed = parseIPv4(value);
        return { ...f, addressText: value, address: parsed.ok ? parsed.value : f.address };
      }),
    prefix: fields.prefix,
    setPrefix: (prefix) => setFields((f) => ({ ...f, prefix: clampPrefix(prefix) })),
    compareText: fields.compareText,
    setCompareText: (value) => setFields((f) => ({ ...f, compareText: value })),
    address: fields.address,
    info: subnetInfo(fields.address, fields.prefix),
    addressError: addressResult.ok ? null : addressResult.error,
    compare,
    compareError: compareResult && !compareResult.ok ? compareResult.error : null,
    locked,
  };
}
