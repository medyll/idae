import { describe, it, expect } from 'vitest';
import { toggleModifierOnChord } from './modifiers.js';

describe('toggleModifierOnChord', () => {
  it('toggles modifier on/off', () => {
    const chord = { root: 'C', quality: 'maj', duration: '1', modifier: undefined };
    const toggled = toggleModifierOnChord(chord, '♯');
    expect(toggled.modifier).toBe('♯');
    const toggledOff = toggleModifierOnChord(toggled, '♯');
    expect(toggledOff.modifier).toBeUndefined();
  });
});
