import { expect, test } from 'vitest';
import { drawFirewall } from './firewall';
import { fillLabels } from './labels';

test('fillLabels writes each word into every slot with its key', () => {
  expect(fillLabels('<text data-label="a"></text><tspan x="1" data-label="a"></tspan><text data-label="b"></text>', { a: 'A & <B>' })).toBe(
    '<text data-label="a">A &amp; &lt;B&gt;</text><tspan x="1" data-label="a">A &amp; &lt;B&gt;</tspan><text data-label="b"></text>',
  );
});

test('fillLabels leaves a figure without slots as it was', () => {
  const { svg } = drawFirewall();
  expect(fillLabels(svg, { plate: 'X' })).toBe(svg);
});
