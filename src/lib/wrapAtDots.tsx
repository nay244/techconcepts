import { Fragment, type ReactNode } from 'react';

/**
 * A value with a place to break the line after each dot and nowhere else, so
 * an address or a binary mask wraps between its groups, never in the middle of
 * one. The text itself is unchanged.
 */
export function wrapAtDots(value: string): ReactNode {
  const groups = value.split('.');
  return groups.map((group, i) => (
    <Fragment key={i}>
      {group}
      {i < groups.length - 1 ? (
        <>
          .<wbr />
        </>
      ) : null}
    </Fragment>
  ));
}

export default wrapAtDots;
