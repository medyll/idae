import { describe, it, expect } from 'vitest';
import { getArmorInfo } from './armor.js';

describe('getArmorInfo', () => {
  it('returns formatted armor info when found', () => {
    const res = getArmorInfo('C');
    expect(res).toBe('C');
  });
  it('returns empty string when not found', () => {
    const res = getArmorInfo('ZZ');
    expect(res).toBe('');
  });
});
