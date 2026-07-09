// Types for the data bundle the enot pipeline syncs into src/data/site.json.
// The bundle is generated, so the shape is a contract, not a suggestion:
// `astro check` (npm run check) fails the build if a page reads a field the
// bundle no longer carries. Dynamically indexed maps use string keys on
// purpose - roles, depths and modes are looked up by variables.
import data from '../data/site.json';

// One normalized base for every internal link; '/' while the site lives
// at the GitHub Pages root, but a future base change stays one-line.
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export type Hex = string;
export type VisionSet = Record<string, Hex>; // role -> hex
export type ModeVisions = Record<string, VisionSet>; // vision -> set

export interface Vision {
  enot: Record<string, ModeVisions>; // mode -> vision -> set
  gruvbox: Record<string, Record<string, Hex[]>>; // mode -> vision -> hexes
}

export type MetricSet = Record<string, number>; // metric -> value
export type DepthMetrics = Record<string, MetricSet>; // depth -> metrics

export interface Gate {
  mode: string;
  depth: string;
  metric: string;
  threshold: number;
}

export interface PortOutput {
  path: string;
  theme?: string;
}

export interface Port {
  app: string;
  name: string;
  category: string;
  kind: string;
  depth: string;
  guarantee: string;
  outputs: PortOutput[];
}

export interface SiteData {
  slug: string;
  accents: string[];
  vision: Vision;
  metrics: Record<string, DepthMetrics>; // mode -> depth -> metrics
  gates: Gate[];
  numbers: { accentsMin: number; ansiMin: number };
  ports: Port[];
}

export const site = data as unknown as SiteData;
