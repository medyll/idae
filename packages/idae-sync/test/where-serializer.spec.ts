import { describe, it, expect } from 'vitest';
import { serializeWhere, deserializeWhere, isDeterministic } from '../src/lib/WhereSerializer';

describe('WhereSerializer', () => {
  it('serializes objects with different key order identically', () => {
    const a = { a: 1, b: 2, c: 3 };
    const b = { c: 3, b: 2, a: 1 };
    const sa = serializeWhere(a);
    const sb = serializeWhere(b);
    expect(sa).toBe(sb);
    expect(isDeterministic(a, b)).toBe(true);
    // ensure deserialization roundtrips
    expect(deserializeWhere(sa)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('serializes nested objects deterministically', () => {
    const x = { z: { b: 2, a: 1 }, y: [ { d: 4, c: 3 } ] };
    const y = { y: [ { c: 3, d: 4 } ], z: { a: 1, b: 2 } };
    expect(serializeWhere(x)).toBe(serializeWhere(y));
    expect(isDeterministic(x, y)).toBe(true);
  });
});
