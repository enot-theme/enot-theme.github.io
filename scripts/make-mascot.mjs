// Regenerates every mascot-derived asset in public/ from the originals in
// src/assets/mascot/ plus the palette in src/data/site.json. Committed as
// static assets; rerun with `npm run mascot` after replacing the art or a
// palette change:
//
// - mascot-{dark,light}.webp - hero and 404 art, 640px;
// - mark-{dark,light}.webp - the header mark, 80px (38 css px at 2x);
// - favicon.png - the dark mascot in a 64px circle with alpha;
// - og.png - the 1200x630 social-share card: mascot, wordmark, accent bars.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const site = JSON.parse(readFileSync(root('src/data/site.json'), 'utf8'));
const c = site.vision.enot.dark.normal;

// The art has its baked-in background; sample it so squaring pads and the
// og canvas continue the exact same color with no visible seam.
async function baked(src) {
  const { data } = await sharp(src)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw().toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2] };
}

async function square(src, bg, size) {
  return sharp(await sharp(src).trim().toBuffer())
    .resize(size, size, { fit: 'contain', background: bg });
}

const srcs = {
  dark: root('src/assets/mascot/enot-anime-dark.png'),
  light: root('src/assets/mascot/enot-anime-light.png'),
};
const bgs = {};
for (const mode of ['dark', 'light']) {
  bgs[mode] = await baked(srcs[mode]);
  (await square(srcs[mode], bgs[mode], 640))
    .webp({ quality: 82 }).toFile(root(`public/mascot-${mode}.webp`));
  (await square(srcs[mode], bgs[mode], 80))
    .webp({ quality: 82 }).toFile(root(`public/mark-${mode}.webp`));
}

const circle = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">' +
  '<circle cx="32" cy="32" r="32" fill="#fff"/></svg>');
await (await square(srcs.dark, bgs.dark, 64))
  .composite([{ input: circle, blend: 'dest-in' }])
  .png().toFile(root('public/favicon.png'));

// og card: sampled mascot background as the canvas, palette for the text
const W = 1200;
const H = 630;
const accents = site.accents.map((a) => c[a]);
const x0 = 94;
const x1 = 560;
const gap = 12;
const bw = (x1 - x0 - gap * (accents.length - 1)) / accents.length;
const bars = accents
  .map((hex, i) => {
    const x = x0 + i * (bw + gap);
    return `<rect x="${x.toFixed(1)}" y="470" width="${bw.toFixed(1)}" height="20" rx="10" fill="${hex}"/>`;
  })
  .join('');
const text = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="${x0}" y="300" font-family="Helvetica, Arial, sans-serif" font-size="150" font-weight="700" letter-spacing="6" fill="${c.fg0}">enot</text>
  <text x="${x0}" y="380" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="${c.fg1}">An earthy colorscheme that</text>
  <text x="${x0}" y="420" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="${c.fg1}">survives color blindness.</text>
  ${bars}
</svg>`;
const mascot = await (await square(srcs.dark, bgs.dark, 520)).toBuffer();
await sharp({ create: { width: W, height: H, channels: 3, background: bgs.dark } })
  .composite([
    { input: Buffer.from(text) },
    { input: mascot, left: 630, top: 55 },
  ])
  .png({ palette: true, quality: 90 }).toFile(root('public/og.png'));
console.log('wrote mascot-{dark,light}.webp mark-{dark,light}.webp favicon.png og.png');
