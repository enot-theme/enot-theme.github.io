// The raccoon mark, single source of the path data. Logo.astro renders
// it inline (currentColor), config.ts bakes the favicon data URI and
// scripts/make-og.mjs embeds it in the social-share image - one drawing,
// three consumers.

// The seven elements of the mark: ears, head outline, mask, eyes, nose.
// ink draws the raccoon, eye punches the eyes out in the page background.
export function logoMark(ink, eye) {
  return (
    `<path d="M10 24 L4 8 L22 13 Z" fill="${ink}"/>` +
    `<path d="M54 24 L60 8 L42 13 Z" fill="${ink}"/>` +
    `<path d="M32 8 C14 8 6 22 6 36 C6 50 17 58 32 58 C47 58 58 50 58 36 C58 22 50 8 32 8 Z" fill="none" stroke="${ink}" stroke-width="3.5"/>` +
    `<path d="M7 28 C15 24 24 23 32 23 C40 23 49 24 57 28 C57 36 52 42 44 42 C38 42 34 39 32 36 C30 39 26 42 20 42 C12 42 7 36 7 28 Z" fill="${ink}"/>` +
    `<circle cx="21" cy="32" r="3.4" fill="${eye}"/>` +
    `<circle cx="43" cy="32" r="3.4" fill="${eye}"/>` +
    `<path d="M28 47 L36 47 L32 52 Z" fill="${ink}"/>`
  );
}

export function logoSvg(size, ink, eye) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 64 64" role="img" aria-label="enot raccoon logo">` +
    `${logoMark(ink, eye)}</svg>`
  );
}
