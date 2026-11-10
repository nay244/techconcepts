import { LOGO_ACCENT, LOGO_BOX, LOGO_SHAPES } from '../art/logo';

/**
 * The TechConcepts mark for React parts (the lesson's top bar). It draws the same three shapes as `logoMark()` in
 * src/art/logo.ts, which the Astro header and footer use. It sits beside the site's name, so it is hidden from
 * screen readers.
 */
export default function LogoMark() {
  return (
    <svg className="logo" viewBox={`0 0 ${LOGO_BOX} ${LOGO_BOX}`} fill="none" aria-hidden="true" focusable="false">
      {LOGO_SHAPES.map((shape) => {
        const paint = shape.paint === 'ink' ? 'currentColor' : LOGO_ACCENT;
        return <path key={shape.d} d={shape.d} fill={paint} stroke={paint} strokeWidth={shape.stroke} strokeLinejoin="round" />;
      })}
    </svg>
  );
}
