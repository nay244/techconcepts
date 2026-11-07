import type { FigureId } from '../../art/scenes/types';
import type { DriverModule } from '../driver';
import { dhcpDriver } from './dhcp';
import { firewallDriver } from './firewall';
import { netMapDriver } from './net-map';
import { subnetDriver } from './subnet';

/** The driver for each scene figure. */
export const DRIVERS: Record<FigureId, DriverModule> = {
  dhcp: dhcpDriver,
  subnet: subnetDriver,
  firewall: firewallDriver,
  'net-map': netMapDriver,
};
