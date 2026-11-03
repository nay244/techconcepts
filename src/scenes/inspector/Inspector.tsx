import { useId } from 'react';
import type { Field, Layer, Packet } from '../../content/schema';
import type { LogRow } from '../../engine/timeline';
import { formatBytes, formatTime } from '../../lib/format';
import './inspector.css';

export interface InspectorProps {
  packet: Packet;
  /** The log row the packet was opened from. Null when none exists yet: the meta line then shows only the size. */
  row: LogRow | null;
  onClose(): void;
  /** Moves to the previous packet. The button is shown only when this is given. */
  onPrev?(): void;
  /** Moves to the next packet. The button is shown only when this is given. */
  onNext?(): void;
}

/** "0.024s · 0.0.0.0 → 255.255.255.255 · DHCP · 342 B", or just "342 B" with no row. */
function metaLine(packet: Packet, row: LogRow | null): string {
  const size = formatBytes(packet.size);
  return row === null ? size : [formatTime(row.time), `${row.src} → ${row.dst}`, row.protocol, size].join(' · ');
}

function FieldRow({ field }: { field: Field }) {
  return (
    <li className="inspector__field">
      <span className="inspector__field-name">{field.name}</span>
      <span className="sr-only">: </span>
      <span className="inspector__field-value">{field.value}</span>
      {field.example ? (
        <span className="inspector__eg">
          <span aria-hidden="true">E.G.</span>
          <span className="sr-only">Example value</span>
        </span>
      ) : null}
      {field.explain ? <p className="inspector__field-explain">{field.explain}</p> : null}
    </li>
  );
}

function LayerSection({ layer }: { layer: Layer }) {
  return (
    <details className="inspector__layer" open>
      <summary>{`${layer.name} · ${layer.size} bytes`}</summary>
      <p className="inspector__layer-summary">{layer.summary}</p>
      {layer.fields.length > 0 ? (
        <ul className="inspector__fields" role="list">
          {layer.fields.map((field, i) => (
            <FieldRow key={i} field={field} />
          ))}
        </ul>
      ) : null}
    </details>
  );
}

/**
 * A packet taken apart: a bar of its layers sized by bytes, then every layer's
 * fields with a plain-English line for each. It replaces the scene canvas, so
 * it owns no focus or keyboard handling: the lesson console moves focus here
 * when it opens, and closes it on Esc.
 *
 * `packet.seenAt` is shown as written, so a lesson writes it as a full sentence.
 * Layers and fields are positional, so a console that switches packets with
 * prev and next should give this a `key` to reset any layer the learner folded.
 */
export function Inspector({ packet, row, onClose, onPrev, onNext }: InspectorProps) {
  const barLabel = useId();
  return (
    <section className="inspector" aria-label="Packet inspector">
      <header className="inspector__head">
        <div className="inspector__heading">
          <h2 className="inspector__name">{packet.name}</h2>
          <p className="inspector__meta">{metaLine(packet, row)}</p>
        </div>
        <div className="inspector__actions">
          {onPrev ? (
            <button type="button" className="inspector__btn" onClick={onPrev}>
              Previous packet
            </button>
          ) : null}
          {onNext ? (
            <button type="button" className="inspector__btn" onClick={onNext}>
              Next packet
            </button>
          ) : null}
          <button type="button" className="inspector__btn" onClick={onClose}>
            <span aria-hidden="true">×</span> Close inspector
          </button>
        </div>
      </header>

      <div className="inspector__body">
        <div className="inspector__context">
          <p className="inspector__summary">{packet.summary}</p>
          {packet.seenAt ? <p className="inspector__seen">{packet.seenAt}</p> : null}
        </div>

        <div>
          <p id={barLabel} className="inspector__caption">
            Layers, sizes in bytes
          </p>
          <ol className="inspector__bar" role="list" aria-labelledby={barLabel}>
            {packet.layers.map((layer, i) => (
              <li key={i} className="inspector__seg" style={{ flexGrow: layer.size }}>
                {`${layer.name} ${layer.size}`}
              </li>
            ))}
          </ol>
        </div>

        <div className="inspector__tree">
          {packet.layers.map((layer, i) => (
            <LayerSection key={i} layer={layer} />
          ))}
        </div>

        <p className="inspector__legend">E.G. marks an example value: it differs in every real capture.</p>
      </div>
    </section>
  );
}

export default Inspector;
