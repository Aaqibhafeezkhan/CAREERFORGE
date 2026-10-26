// Run with: node --test public/showcase/nonprofit-impact/carbon.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync(new URL('./script.js', import.meta.url), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src + '\nthis.CarbonCalc = CarbonCalc;', ctx);
const C = ctx.CarbonCalc;

const base = { carKm: 100, transitKm: 30, flightHours: 4, diet: 'lowMeat', electricityKwh: 250, gasKwh: 300, household: 2 };

test('calculates a known footprint', () => {
  // car 0.88, transit 0.11, flights 0.40, diet 1.70, elec 0.66, gas 0.32
  const r = C.calculateFootprint(base);
  assert.equal(r.breakdown.car, 0.88);
  assert.equal(r.breakdown.flights, 0.4);
  assert.equal(r.breakdown.diet, 1.7);
  assert.equal(r.breakdown.electricity, 0.66);
  assert.ok(Math.abs(r.total - 4.07) < 0.02);
});

test('all-zero travel/energy leaves only diet', () => {
  const r = C.calculateFootprint({ ...base, carKm: 0, transitKm: 0, flightHours: 0, electricityKwh: 0, gasKwh: 0 });
  assert.equal(r.total, 1.7);
});

test('household size divides home energy', () => {
  const one = C.calculateFootprint({ ...base, household: 1 });
  const four = C.calculateFootprint({ ...base, household: 4 });
  assert.ok(one.breakdown.electricity > four.breakdown.electricity);
});

test('validation rejects bad input', () => {
  assert.equal(C.validateCarbonInputs(base).ok, true);
  assert.equal(C.validateCarbonInputs({ ...base, carKm: -1 }).ok, false);
  assert.equal(C.validateCarbonInputs({ ...base, carKm: 'abc' }).ok, false);
  assert.equal(C.validateCarbonInputs({ ...base, flightHours: '' }).ok, false);
  assert.equal(C.validateCarbonInputs({ ...base, household: 0 }).ok, false);
  assert.equal(C.validateCarbonInputs({ ...base, household: 1.5 }).ok, false);
  assert.equal(C.validateCarbonInputs({ ...base, diet: 'carnivore' }).ok, false);
  assert.equal(C.validateCarbonInputs({ ...base, gasKwh: undefined }).ok, false);
});

test('validation converts numeric strings', () => {
  const v = C.validateCarbonInputs({ ...base, carKm: '120' });
  assert.equal(v.values.carKm, 120);
});

test('suggestions are sorted by impact and positive', () => {
  const s = C.getReductionSuggestions({ ...base, diet: 'highMeat', flightHours: 40 });
  assert.ok(s.length >= 4);
  for (let i = 1; i < s.length; i++) assert.ok(s[i - 1].savedTonnes >= s[i].savedTonnes);
  assert.ok(s.every((x) => x.savedTonnes > 0));
});

test('no suggestions for a minimal vegan footprint', () => {
  const s = C.getReductionSuggestions({ ...base, diet: 'vegan', carKm: 0, flightHours: 0, electricityKwh: 0, gasKwh: 0 });
  assert.equal(s.length, 0);
});

test('offset estimate and benchmarks', () => {
  assert.deepEqual({ ...C.getOffsetEstimate(5) }, { usd: 100, trees: 228 });
  const b = C.compareToBenchmarks(9.4);
  assert.equal(b.find((x) => x.key === 'world').diffPercent, 100);
});
