import type { FigureId } from '../../art/scenes/types';
import type { DriverModule } from '../driver';
import { dhcpDriver } from './dhcp';
import { netMapDriver } from './net-map';
import { subnetDriver } from './subnet';

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
  dhcp: dhcpDriver,
  subnet: subnetDriver,
  firewall: stillDriver(),
  'net-map': netMapDriver,
};
