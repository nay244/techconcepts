import type { FigureId } from '../../art/scenes/types';
import type { DriverModule } from '../driver';

/**
 * A driver that moves nothing, and gives every event a second. Each figure
 * keeps it until its lesson's task builds the real one (Tasks 10–16).
 */
function stillDriver(): DriverModule {
  return {
    create: () => ({ show() {}, play: async () => {}, destroy() {} }),
    duration: () => 1000,
  };
}

/** The driver for each scene figure. */
export const DRIVERS: Record<FigureId, DriverModule> = {
  dhcp: stillDriver(),
  subnet: stillDriver(),
  firewall: stillDriver(),
  'net-map': stillDriver(),
};
