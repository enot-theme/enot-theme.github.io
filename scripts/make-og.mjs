// Regenerates public/og.png - the 1200x630 social-share image - from the
// palette in src/data/site.json, so the card colors stay in sync with the
// scheme. Committed as a static asset; rerun with `npm run og` after a
// brand or palette change. Reuses the raccoon mark from src/components/Logo.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const site = JSON.parse(
  readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'),
);
const c = site.vision.enot.dark.normal;
const accents = site.accents.map((a) => c[a]);
const W = 1200;
const H = 630;

const x0 = 92;
const x1 = 1108;
const gap = 14;
const bw = (x1 - x0 - gap * (accents.length - 1)) / accents.length;
const bars = accents
  .map((hex, i) => {
    const x = x0 + i * (bw + gap);
    return `<rect x="${x.toFixed(1)}" y="524" width="${bw.toFixed(1)}" height="22" rx="11" fill="${hex}"/>`;
  })
  .join('');

const logo = `<g transform="translate(96,150) scale(5)">
  <path d="M10 24 L4 8 L22 13 Z" fill="${c.fg0}"/>
  <path d="M54 24 L60 8 L42 13 Z" fill="${c.fg0}"/>
  <path d="M32 8 C14 8 6 22 6 36 C6 50 17 58 32 58 C47 58 58 50 58 36 C58 22 50 8 32 8 Z" fill="none" stroke="${c.fg0}" stroke-width="3.5"/>
  <path d="M7 28 C15 24 24 23 32 23 C40 23 49 24 57 28 C57 36 52 42 44 42 C38 42 34 39 32 36 C30 39 26 42 20 42 C12 42 7 36 7 28 Z" fill="${c.fg0}"/>
  <circle cx="21" cy="32" r="3.4" fill="${c.bg0}"/>
  <circle cx="43" cy="32" r="3.4" fill="${c.bg0}"/>
  <path d="M28 47 L36 47 L32 52 Z" fill="${c.fg0}"/>
</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${c.bg0}"/>
  ${logo}
  <text x="470" y="352" font-family="Helvetica, Arial, sans-serif" font-size="184" font-weight="700" letter-spacing="6" fill="${c.fg0}">enot</text>
  <text x="94" y="478" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="${c.fg1}">An earthy colorscheme that survives color blindness.</text>
  ${bars}
</svg>`;

const out = fileURLToPath(new URL('../public/og.png', import.meta.url));
await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`wrote ${out}`);
