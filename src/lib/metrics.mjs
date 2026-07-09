// Metric labels for the invariant tables plus the flooring helpers the
// consistency test uses to re-derive the advertised numbers: the bundle's
// numbers field and the measured metrics cannot drift apart unnoticed.

// A ">=" guarantee must never round up. Flooring to one decimal keeps the
// printed value at or below the measured worst case, so the claim on the
// page is always true (8.27 measured -> 8.2 advertised, never 8.3).
export function floor1(x) {
  return Math.floor(x * 10 + 1e-9) / 10;
}

// Worst measured value of a metric across dark and light at one depth,
// floored - the safe number to put behind a ">=".
export function guarantee(metrics, depth, metric) {
  const vals = ['dark', 'light'].map((m) => metrics[m][depth][metric]);
  return floor1(Math.min(...vals));
}

/** @type {Record<string, string>} */
export const INV_LABELS = {
  accents: 'min pairwise &Delta;E00 across the 7 accents, worst of normal / protanopia / deuteranopia',
  ansi16: 'min pairwise &Delta;E00 across all 16 ANSI colors',
  tints: 'min pairwise &Delta;E00 across the 4 diff backgrounds',
  contrast: 'min WCAG contrast over every text-on-background pair of the depth',
  guard_accents: 'min &Delta;E00 from accents to text and comment',
  guard_ansi_normal: 'the same guard for the normal ANSI tier',
  guard_ansi_bright: 'the same guard for the bright ANSI tier',
  red_chroma: 'chroma of red - diagnostics stay salient',
  ansi_tier_gap: 'lightness gap between ANSI tiers (the bright tier is darker in the light theme)',
};
