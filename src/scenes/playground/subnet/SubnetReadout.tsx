import { formatIPv4 } from '../../../engine/net/ipv4';
import { wrapAtDots } from '../../../lib/wrapAtDots';
import type { SubnetPlaygroundState } from './useSubnetPlayground';
import './subnet.css';

/**
 * The current values as a description list. It sits where flow lessons show
 * their event log. The comparison with a second address lives with the other
 * controls, in SubnetCanvas, so its result is in view when it changes.
 */
export function SubnetReadout({ state }: { state: SubnetPlaygroundState }) {
  const { info } = state;

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
            <dd>{wrapAtDots(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default SubnetReadout;
