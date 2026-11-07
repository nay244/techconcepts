/** A string found in a value, and where it sits, such as `units[0].learn.why[0].text`. */
export interface TextAt {
  path: string;
  text: string;
}

/** Every string in a value, wherever it sits, with its path; in the order `Object.entries` gives. */
export function textsAt(value: unknown, path = ''): TextAt[] {
  if (typeof value === 'string') return [{ path, text: value }];
  if (Array.isArray(value)) return value.flatMap((item, i) => textsAt(item, `${path}[${i}]`));
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, item]) => textsAt(item, path === '' ? key : `${path}.${key}`));
  }
  return [];
}

/** Every string in a value, wherever it sits. */
export function textsOf(value: unknown): string[] {
  return textsAt(value).map((t) => t.text);
}
