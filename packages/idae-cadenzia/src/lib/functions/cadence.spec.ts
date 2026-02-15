import { describe, it, expect } from 'vitest';
import { suggestCadencesFromEntries } from './cadence.js';
import type { ChordEntry } from '$lib/types/types';

describe('suggestCadencesFromEntries', () => {
  it('returns cadences whose first chord matches last chord roman', () => {
    const entries: ChordEntry[] = [
      { chord: { root: 'C', quality: 'maj', duration: '1' }, armor: '', measureInfo: { start: 1, end: 1, beatStart: 0 } },
      { chord: { root: 'G', quality: 'maj', duration: '1' }, armor: '', measureInfo: { start: 1, end: 1, beatStart: 0 } }
    ];

    const suggestions = suggestCadencesFromEntries(entries);
    expect(suggestions.length).toBeGreaterThan(0);
    // Expect at least the common perfect cadence (V -> I) to be present
    const names = suggestions.map((s) => s.name);
    expect(names).toEqual(expect.arrayContaining(['Perfect']));
  });
});
