// Regenerates public/og.png - the 1200x630 social-share image - from the
// palette in src/data/site.json, so the card colors stay in sync with the
// scheme. Committed as a static asset; rerun with `npm run og` after a
// brand or palette change.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { logoMark } from '../src/lib/logo.mjs';

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

const logo = `<g transform="translate(96,150) scale(5)">${logoMark(c.fg0, c.bg0)}</g>`;

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
