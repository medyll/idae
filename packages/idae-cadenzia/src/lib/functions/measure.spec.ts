import { describe, it, expect } from 'vitest';
import { computeMeasureInfos, getDurationValue } from './measure.js';

describe('getDurationValue', () => {
  it('parses integer durations', () => {
    expect(getDurationValue('1')).toBe(1);
    expect(getDurationValue('2')).toBe(2);
  });
  it('parses fractional durations', () => {
    expect(getDurationValue('1/4')).toBeCloseTo(0.25);
    expect(getDurationValue('3/4')).toBeCloseTo(0.75);
  });
});

describe('computeMeasureInfos', () => {
  it('computes measure info across entries', () => {
    const entries = [
      { chord: { root: 'C', quality: 'maj', duration: '1' }, armor: '', measureInfo: { start: 0, end: 0, beatStart: 0 } },
      { chord: { root: 'C', quality: 'maj', duration: '1/2' }, armor: '', measureInfo: { start: 0, end: 0, beatStart: 0 } },
      { chord: { root: 'C', quality: 'maj', duration: '1/2' }, armor: '', measureInfo: { start: 0, end: 0, beatStart: 0 } }
    ];

    const out = computeMeasureInfos(entries);
    expect(out[0].measureInfo.start).toBe(1);
    expect(out[1].measureInfo.start).toBe(2);
    expect(out[2].measureInfo.start).toBe(2);
  });
});
