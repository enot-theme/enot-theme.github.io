// GoatCounter code: analytics posts to https://<code>.goatcounter.com/count.
// Register the code (free) at https://www.goatcounter.com/ to receive data;
// set to '' to drop the script entirely. Cookie-less, no consent banner.
import { logoSvg } from '../lib/logo.mjs';

export const GOATCOUNTER = 'enot-theme';

// Favicon: the raccoon mark baked to fixed dark/cream colors (data URI).
export const FAVICON =
  `data:image/svg+xml,${encodeURIComponent(logoSvg(64, '#45423c', '#f4f2ee'))}`;
