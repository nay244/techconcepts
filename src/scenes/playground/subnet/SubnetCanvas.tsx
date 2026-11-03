import { useId } from 'react';
import { formatIPv4, toOctetBits } from '../../../engine/net/ipv4';
import { MAX_PREFIX, MIN_PREFIX, type SubnetPlaygroundState } from './useSubnetPlayground';
import './subnet.css';

interface Piece {
  octet: number;
  bits: string;
}

/** Bits `from` up to `to` (positions 0 to 31) of the address, cut at octet boundaries so the octets stay visible. */
function pieces(bits: string, from: number, to: number): Piece[] {
  const out: Piece[] = [];
  for (let octet = 0; octet < 4; octet++) {
    const start = Math.max(from, octet * 8);
    const end = Math.min(to, octet * 8 + 8);
    if (start < end) out.push({ octet, bits: bits.slice(start, end) });
  }
  return out;
}

function BitGroup({ part, title, count, pieces: items }: { part: 'network' | 'host'; title: string; count: number; pieces: Piece[] }) {
  return (
    <div className="subnet-bits__group" data-part={part}>
      <div className="subnet-bits__label">
        <span>{title}</span>
        <span className="subnet-bits__count">{count} bits</span>
      </div>
      <div className="subnet-bits__run">
        {items.map((piece) => (
          <span key={piece.octet} className="subnet-bits__octet" data-octet={piece.octet}>
            {piece.bits}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The address as 32 bits, split by the prefix. The network and host parts differ
 * by colour, by a solid or dashed rule, by the divider between them and by the
 * words "Network" and "Host". A screen reader gets one sentence instead of 32 digits.
 */
function BitRow({ address, prefix }: { address: number; prefix: number }) {
  const octets = toOctetBits(address);
  const bits = octets.join('');
  const hostBits = 32 - prefix;
  const description = `${formatIPv4(address)} in binary is ${octets.join('.')}. The first ${prefix} bits are the network part and the last ${hostBits} are the host part.`;

  return (
    <div className="subnet-bits" role="img" aria-label={description}>
      <BitGroup part="network" title="Network" count={prefix} pieces={pieces(bits, 0, prefix)} />
      <span className="subnet-bits__divider" data-divider="" />
      <BitGroup part="host" title="Host" count={hostBits} pieces={pieces(bits, prefix, 32)} />
    </div>
  );
}

/**
 * The playground's controls and the address in binary. While `state.locked` the
 * controls are disabled and say why; the lesson unlocks them at Try it.
 */
export function SubnetCanvas({ state }: { state: SubnetPlaygroundState }) {
  const { addressText, setAddressText, prefix, setPrefix, address, addressError, locked } = state;
  const addressId = useId();
  const errorId = useId();
  const prefixId = useId();

  return (
    <section className="subnet-canvas" aria-label="Subnet playground">
      <div className="subnet-controls">
        <div className="subnet-field">
          <label htmlFor={addressId}>IP address</label>
          <input
            id={addressId}
            className="subnet-input"
            type="text"
            value={addressText}
            onChange={(event) => setAddressText(event.target.value)}
            disabled={locked}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={addressError === null ? undefined : true}
            aria-describedby={addressError === null ? undefined : errorId}
          />
          {addressError === null ? null : (
            <p id={errorId} className="subnet-error">
              {addressError}
            </p>
          )}
        </div>

        <div className="subnet-field">
          <div className="subnet-field__head">
            <label htmlFor={prefixId}>Prefix length</label>
            <span className="subnet-prefix" aria-hidden="true">
              /{prefix}
            </span>
          </div>
          <input
            id={prefixId}
            className="subnet-slider"
            type="range"
            min={MIN_PREFIX}
            max={MAX_PREFIX}
            step={1}
            value={prefix}
            onChange={(event) => setPrefix(Number(event.target.value))}
            disabled={locked}
            aria-valuetext={`/${prefix}`}
          />
        </div>
      </div>

      {locked ? <p className="subnet-note">You can change these in Try it.</p> : null}

      <BitRow address={address} prefix={prefix} />
    </section>
  );
}

export default SubnetCanvas;
