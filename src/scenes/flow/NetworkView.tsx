import { useCallback, useLayoutEffect, useRef, useState, type RefCallback } from 'react';
import type { Actor, FlowScene, Link, MessageEvent } from '../../content/schema';
import { EVENT_DURATION_MS } from '../../engine/playback';
import type { DerivedState } from '../../engine/timeline';
import DeviceIcon from './DeviceIcon';
import { chipAlign, chipSpot, deviceText, NODE_RADIUS, pathFor, VIEW_HEIGHT, VIEW_WIDTH, type DeviceText, type Point } from './geometry';
import './flow.css';

export interface NetworkViewProps {
  scene: FlowScene;
  state: DerivedState;
  /** True when the learner wants no motion: chips are placed at their destination and do not travel. */
  reducedMotion: boolean;
  /** Playback speed, as chosen in the controls. A message takes `EVENT_DURATION_MS.message / speed` to arrive. */
  speed?: number;
  onOpenPacket(packetId: string): void;
}

/** The 48 px icon is drawn at this scale inside its disc. */
const ICON_SCALE = 1.25;
const ICON_OFFSET = -(48 * ICON_SCALE) / 2;
/** Half the gap between the two lines of a tunnel. */
const TUNNEL_HALF_GAP = 3;

/** A position on the canvas as a CSS percentage, so chips stay put however the canvas is scaled. */
const percent = (value: number, total: number): string => `${Math.round((value / total) * 10000) / 100}%`;
const round = (value: number): number => Math.round(value * 100) / 100;

function LinkLine({ link, from, to }: { link: Link; from: Actor; to: Actor }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  // The unit step at right angles to the link, for placing the two lines of a tunnel.
  const nx = length === 0 ? 0 : -(to.y - from.y) / length;
  const ny = length === 0 ? 0 : (to.x - from.x) / length;
  const offsets = link.medium === 'tunnel' ? [-TUNNEL_HALF_GAP, TUNNEL_HALF_GAP] : [0];
  return (
    <g className="flow-link" data-link={link.id} data-medium={link.medium}>
      {offsets.map((offset) => (
        <line
          key={offset}
          x1={from.x + nx * offset}
          y1={from.y + ny * offset}
          x2={to.x + nx * offset}
          y2={to.y + ny * offset}
          strokeDasharray={link.medium === 'wireless' ? '7 7' : undefined}
        />
      ))}
    </g>
  );
}

function Device({ actor, text }: { actor: Actor; text: DeviceText }) {
  return (
    <g className="flow-device" data-device={actor.id} transform={`translate(${actor.x} ${actor.y})`}>
      <circle className="flow-device__disc" r={NODE_RADIUS} />
      <g transform={`translate(${ICON_OFFSET} ${ICON_OFFSET}) scale(${ICON_SCALE})`}>
        <DeviceIcon kind={actor.kind} />
      </g>
      <text className="flow-device__label" y={text.labelY} textAnchor="middle" style={{ fontSize: text.label }}>
        {actor.label}
      </text>
      {actor.addresses.map((address, i) => (
        <text
          key={i}
          className="flow-device__address"
          y={Math.round((text.firstAddressY + text.lineHeight * i) * 10) / 10}
          textAnchor="middle"
          style={{ fontSize: text.address }}
        >
          {address}
        </text>
      ))}
    </g>
  );
}

interface ChipProps {
  msg: MessageEvent;
  /** The label of the device this chip is travelling to. */
  destination: string;
  path: Point[];
  speed: number;
  reducedMotion: boolean;
  onOpenPacket(packetId: string): void;
}

/**
 * The label that rides the links. It rests at its destination (that is where
 * the CSS puts it), so a flight only has to start from somewhere else and end
 * at rest: with no Web Animations API, or under reduced motion, the chip is
 * simply there.
 */
function Chip({ msg, destination, path, speed, reducedMotion, onOpenPacket }: ChipProps) {
  const element = useRef<HTMLElement | null>(null);
  const attach = useCallback((node: HTMLElement | null) => {
    element.current = node;
  }, []);

  const dropped = msg.outcome === 'dropped';
  const animated = !reducedMotion && path.length > 1;
  const duration = EVENT_DURATION_MS.message / speed;
  // The flight depends on where the path goes, not on which array object describes it.
  const route = path.map((stop) => `${stop.x},${stop.y}`).join(' ');

  useLayoutEffect(() => {
    const chip = element.current;
    const canvas = chip?.parentElement;
    // jsdom and old browsers have no Web Animations API; the chip then just stays at its destination.
    if (!animated || chip == null || canvas == null || typeof chip.animate !== 'function') return;
    // The canvas keeps a 1000 by 600 shape, so one scale turns canvas units into pixels in both directions.
    const scale = canvas.clientWidth / VIEW_WIDTH;
    if (!(scale > 0)) return;

    const spots = path.map(chipSpot);
    const rest = spots[spots.length - 1]!;
    const distances = [0];
    spots.slice(1).forEach((spot, i) => distances.push(distances[i]! + Math.hypot(spot.x - spots[i]!.x, spot.y - spots[i]!.y)));
    const total = distances[distances.length - 1]!;
    if (total === 0) return;

    // Offsets are in proportion to distance, so the chip keeps one pace along the whole route.
    const keyframes = spots.map((spot, i) => ({
      transform: `translate(${round((spot.x - rest.x) * scale)}px, ${round((spot.y - rest.y) * scale)}px)`,
      offset: distances[i]! / total,
    }));
    const flight = chip.animate(keyframes, { duration, easing: 'ease-in-out' });
    return () => flight.cancel();
  }, [route, duration, animated]);

  const spot = chipSpot(path[path.length - 1]!);
  const props = {
    ref: attach,
    className: 'flow-chip',
    'data-kind': msg.kind,
    'data-outcome': msg.outcome ?? 'delivered',
    'data-animated': String(animated),
    'data-align': chipAlign(spot),
    style: { left: percent(spot.x, VIEW_WIDTH), top: percent(spot.y, VIEW_HEIGHT) },
  };
  const body = (
    <>
      <span className="flow-chip__label">{msg.label}</span>
      {dropped && <span className="flow-flag">Dropped</span>}
    </>
  );

  if (msg.packet === undefined) return <div {...props}>{body}</div>;

  const packet = msg.packet;
  return (
    <button
      {...props}
      type="button"
      aria-label={`${msg.label}${dropped ? ' (dropped)' : ''}, to ${destination}: open packet details`}
      onClick={() => onOpenPacket(packet)}
    >
      {body}
      <svg className="flow-chip__glyph" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
        <path d="M2 3h8M2 6h8M2 9h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * How many screen pixels one canvas unit takes, measured once the canvas is on
 * the page and again whenever it changes size. Null until then, and wherever it
 * cannot be measured (on the server, and in jsdom).
 */
function useCanvasScale(): [RefCallback<SVGSVGElement>, number | null] {
  const [scale, setScale] = useState<number | null>(null);
  const ref = useCallback((svg: SVGSVGElement | null) => {
    if (svg === null) return;
    // The drawing is fitted inside the box (preserveAspectRatio meet), so the smaller ratio is the scale.
    // Rounded down, so text sized from it is never short of its minimum.
    const measure = (width: number, height: number) => {
      const fit = Math.floor(Math.min(width / VIEW_WIDTH, height / VIEW_HEIGHT) * 1000) / 1000;
      setScale(fit > 0 ? fit : null);
    };
    const box = svg.getBoundingClientRect();
    measure(box.width, box.height);
    if (typeof ResizeObserver !== 'function') return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry !== undefined) measure(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  return [ref, scale];
}

/**
 * The topology: devices joined by links, with the message now in flight drawn
 * as a chip for each of its targets. The picture is an image to assistive
 * technology; the chips are separate, real elements above it so a chip with a
 * packet can be a focusable button. The text under the devices keeps a readable
 * size on screen however small the canvas is drawn (see `deviceText`).
 */
export function NetworkView({ scene, state, reducedMotion, speed = 1, onOpenPacket }: NetworkViewProps) {
  const actors = new Map(scene.actors.map((actor) => [actor.id, actor]));
  const [svgRef, scale] = useCanvasScale();
  const text = deviceText(scale);
  const msg = state.activeMessage;
  // The picture's text alternative: who is in it and how they are joined.
  const nameOf = (id: string) => actors.get(id)?.label ?? id;
  const links = scene.links.map((link) => `${nameOf(link.from)} to ${nameOf(link.to)} (${link.medium})`);
  const description = `Network diagram of ${scene.actors.map((actor) => actor.label).join(', ')}.${links.length === 0 ? '' : ` Links: ${links.join('; ')}.`}`;

  return (
    <div className="flow-network">
      <svg ref={svgRef} className="flow-network__svg" viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} role="img" aria-label={description}>
        {scene.links.map((link) => {
          const from = actors.get(link.from);
          const to = actors.get(link.to);
          return from === undefined || to === undefined ? null : <LinkLine key={link.id} link={link} from={from} to={to} />;
        })}
        {scene.actors.map((actor) => (
          <Device key={actor.id} actor={actor} text={text} />
        ))}
      </svg>
      {msg !== null &&
        msg.to.map((target) => {
          const destination = actors.get(target);
          // A target the scene does not have leaves nothing to draw.
          return destination === undefined ? null : (
            <Chip
              key={`${msg.id}:${target}`}
              msg={msg}
              destination={destination.label}
              path={pathFor(scene, msg, target)}
              speed={speed}
              reducedMotion={reducedMotion}
              onOpenPacket={onOpenPacket}
            />
          );
        })}
    </div>
  );
}

export default NetworkView;
