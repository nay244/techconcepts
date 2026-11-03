import { useId } from 'react';
import { formatIPv4 } from '../../../engine/net/ipv4';
import type { SubnetPlaygroundState } from './useSubnetPlayground';
import './subnet.css';

const RESULT = {
  same: 'Same subnet',
  different: 'Different subnets: traffic between them goes through a router',
} as const;

/**
 * The current values as a description list, plus a "Same subnet?" check for a
 * second address. It sits where flow lessons show their event log.
 */
export function SubnetReadout({ state }: { state: SubnetPlaygroundState }) {
  const { info, compare, compareText, setCompareText, compareError, locked } = state;
  const compareId = useId();
  const errorId = useId();

  const values: [term: string, value: string][] = [
    ['Mask', formatIPv4(info.mask)],
    ['Network', formatIPv4(info.network)],
    ['Broadcast', formatIPv4(info.broadcast)],
    ['First host', formatIPv4(info.firstHost)],
    ['Last host', formatIPv4(info.lastHost)],
    // Grouped digits keep a /16's 65,534 readable.
    ['Usable hosts', info.usableHosts.toLocaleString('en-US')],
  ];

  return (
    <section className="subnet-readout" aria-label="Current values">
      <dl>
        {values.map(([term, value]) => (
          <div key={term} className="subnet-readout__item">
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}

        <div className="subnet-readout__item subnet-readout__compare">
          <dt>Same subnet?</dt>
          <dd>
            <div className="subnet-field">
              <label htmlFor={compareId}>Compare with</label>
              <input
                id={compareId}
                className="subnet-input"
                type="text"
                value={compareText}
                onChange={(event) => setCompareText(event.target.value)}
                disabled={locked}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={compareError === null ? undefined : true}
                aria-describedby={compareError === null ? undefined : errorId}
              />
              {compareError === null ? null : (
                <p id={errorId} className="subnet-error">
                  {compareError}
                </p>
              )}
            </div>
            {/* Always in the page, so a screen reader hears the result when it first appears. */}
            <p role="status" className="subnet-result" data-result={compare ?? undefined}>
              {compare === null ? null : RESULT[compare]}
            </p>
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default SubnetReadout;
