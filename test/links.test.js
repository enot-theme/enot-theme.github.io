// Build-output checks: every internal link and download in the rendered
// site resolves to a file that exists, every in-page nav anchor has a
// target, and llms.txt points at real artifacts. Runs against dist/, so
// `npm test` builds first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const ORIGIN = 'https://enot-theme.github.io/';

function htmlFiles(dir = '') {
  const out = [];
  for (const name of readdirSync(path.join(dist, dir))) {
    const rel = path.posix.join(dir, name);
    if (statSync(path.join(dist, rel)).isDirectory()) out.push(...htmlFiles(rel));
    else if (rel.endsWith('.html')) out.push(rel);
  }
  return out;
}
const hrefs = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

// Map a site-internal href to its path inside dist, or null if it points
// off-site (http, data, mailto) or is a bare fragment. Directory-style
// URLs resolve to their index.html.
function toDistPath(href, fromFile) {
  if (/^(https?:|mailto:|data:|\/\/)/.test(href)) return null;
  let h = href.split('#')[0].split('?')[0];
  if (h === '') return null;
  if (h.startsWith('/')) h = h.slice(1);
  else h = path.posix.join(path.posix.dirname(fromFile), h);
  if (h === '' || h.endsWith('/')) h += 'index.html';
  return h;
}

test('dist was built', () => {
  assert.ok(existsSync(dist), 'run `npm test` (builds first) or `npm run build`');
  assert.ok(htmlFiles().length >= 6, 'expected the six generated pages');
});

test('every internal link and download resolves to a built file', () => {
  for (const file of htmlFiles()) {
    const html = readFileSync(path.join(dist, file), 'utf8');
    for (const href of hrefs(html)) {
      const rel = toDistPath(href, file);
      if (rel === null) continue;
      assert.ok(existsSync(path.join(dist, rel)), `${file}: dead link ${href} -> ${rel}`);
    }
  }
});

test('in-page nav anchors have a target on their page', () => {
  const wanted = new Map(); // dist-relative html -> Set(fragment)
  for (const file of htmlFiles()) {
    for (const href of hrefs(readFileSync(path.join(dist, file), 'utf8'))) {
      if (!href.includes('#')) continue;
      const frag = href.split('#')[1];
      const rel = href.startsWith('#') ? file : toDistPath(href, file);
      if (!frag || rel === null || !rel.endsWith('.html')) continue;
      if (!wanted.has(rel)) wanted.set(rel, new Set());
      wanted.get(rel).add(frag);
    }
  }
  for (const [rel, frags] of wanted) {
    const html = readFileSync(path.join(dist, rel), 'utf8');
    for (const frag of frags) {
      assert.match(html, new RegExp(`id="${frag}"`), `#${frag} missing in ${rel}`);
    }
  }
});

// The one-line-h1 cap in global.css divides the wrap width by --h1ch,
// the title's character count stamped inline. A stale count reintroduces
// wrapping (too low) or shrinks the title for nothing (too high).
test('every h1 declares --h1ch equal to its text length', () => {
  for (const file of htmlFiles()) {
    const html = readFileSync(path.join(dist, file), 'utf8');
    const h1s = [...html.matchAll(/<h1([^>]*)>([^<]*)<\/h1>/g)];
    assert.ok(h1s.length === 1, `${file}: expected exactly one plain-text h1`);
    for (const [, attrs, text] of h1s) {
      const ch = attrs.match(/--h1ch:\s*(\d+)/)?.[1];
      assert.equal(Number(ch), text.length, `${file}: h1 "${text}"`);
    }
  }
});

test('llms.txt links point at built artifacts', () => {
  const llms = readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8');
  const internal = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(ORIGIN));
  assert.ok(internal.length > 0, 'expected internal links in llms.txt');
  for (const u of internal) {
    let rel = u.slice(ORIGIN.length).split('#')[0];
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    assert.ok(existsSync(path.join(dist, rel)), `llms.txt dead link ${u} -> ${rel}`);
  }
});
