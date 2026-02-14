import { describe, it, expect } from 'vitest';
import { Operators } from './operators.js';

describe('Operators integrity', () => {
  it('exports essential operator keys', () => {
    expect(Operators.operators).toEqual(expect.arrayContaining(['eq', 'in', 'nin']));
  });

  it('filters can be used for core operators (in)', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const res = Operators.filters('id' as any, 'in' as any, [1], data);
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });
});
