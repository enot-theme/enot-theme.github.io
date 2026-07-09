// Data integrity of the generated bundle. These re-assert the pipeline's
// own gate inside this repo, so a bad site.json fails the build here rather
// than shipping contradictory numbers to the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { guarantee, floor1, INV_LABELS } from '../src/lib/metrics.mjs';

const site = JSON.parse(
  readFileSync(new URL('../src/data/site.json', import.meta.url), 'utf8'),
);
const MODES = ['dark', 'light'];

test('every gate metric has a human label', () => {
  for (const g of site.gates) {
    assert.ok(INV_LABELS[g.metric], `no INV_LABELS entry for ${g.metric}`);
  }
});

test('every gate metric is measured at both themes', () => {
  for (const g of site.gates) {
    for (const mode of MODES) {
      const v = site.metrics[mode]?.[g.depth]?.[g.metric];
      assert.equal(typeof v, 'number', `metrics.${mode}.${g.depth}.${g.metric} missing`);
    }
  }
});

test('every measured metric clears its gate', () => {
  for (const g of site.gates) {
    const modes = g.mode === '*' ? MODES : [g.mode];
    for (const mode of modes) {
      const v = site.metrics[mode][g.depth][g.metric];
      assert.ok(v >= g.threshold, `${mode}/${g.depth}/${g.metric}=${v} below gate ${g.threshold}`);
    }
  }
});

test('advertised guarantee never exceeds the measured minimum', () => {
  for (const metric of ['accents', 'ansi16']) {
    const adv = guarantee(site.metrics, '16M', metric);
    for (const mode of MODES) {
      const measured = site.metrics[mode]['16M'][metric];
      assert.ok(adv <= measured, `advertised ${metric} ${adv} > measured ${mode} ${measured}`);
    }
  }
});

test('numbers field equals the floored guarantee', () => {
  assert.equal(site.numbers.accentsMin, guarantee(site.metrics, '16M', 'accents'));
  assert.equal(site.numbers.ansiMin, guarantee(site.metrics, '16M', 'ansi16'));
});

test('floor1 rounds toward zero, never up', () => {
  assert.equal(floor1(8.27), 8.2);
  assert.equal(floor1(8.31), 8.3);
  assert.equal(floor1(7.2), 7.2); // no float drift to 7.1
});
