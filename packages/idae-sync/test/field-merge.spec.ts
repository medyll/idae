import { describe, it, expect } from 'vitest';
import { mergeFieldLevel, mergeObjects, defaultOnConflict } from '../src/lib/ConflictResolver';

describe('mergeFieldLevel', () => {
  it('keeps local field when local timestamp is newer', () => {
    const local = { name: 'Alice', name_updated_at: '2026-03-16T10:00:00Z', age: 30 };
    const remote = { name: 'Bob', name_updated_at: '2026-03-15T10:00:00Z', age: 35 };
    const result = mergeFieldLevel(local, remote) as any;
    expect(result.result.name).toBe('Alice');
    expect(result.result.age).toBe(35); // remote wins (no timestamp for age)
  });

  it('keeps remote field when remote timestamp is newer', () => {
    const local = { name: 'Alice', name_updated_at: '2026-03-14T10:00:00Z' };
    const remote = { name: 'Bob', name_updated_at: '2026-03-16T10:00:00Z' };
    const result = mergeFieldLevel(local, remote) as any;
    expect(result.result.name).toBe('Bob');
  });

  it('falls back to remote when no timestamps present', () => {
    const local = { title: 'Draft' };
    const remote = { title: 'Published' };
    const result = mergeFieldLevel(local, remote) as any;
    expect(result.result.title).toBe('Published');
  });

  it('handles mixed fields — some local wins, some remote wins', () => {
    const local  = { a: 1, a_updated_at: '2026-03-16T12:00:00Z', b: 'x', b_updated_at: '2026-03-15T00:00:00Z' };
    const remote = { a: 2, a_updated_at: '2026-03-15T00:00:00Z', b: 'y', b_updated_at: '2026-03-16T12:00:00Z' };
    const result = mergeFieldLevel(local, remote) as any;
    expect(result.result.a).toBe(1);   // local wins
    expect(result.result.b).toBe('y'); // remote wins
    expect(result.resolution).toBe('merge');
  });

  it('returns remote when local is null', () => {
    const result = mergeFieldLevel(null, { x: 1 }) as any;
    expect(result.resolution).toBe('remote');
  });
});

describe('mergeObjects (shallow)', () => {
  it('remote overrides local', () => {
    const result = mergeObjects({ a: 1, b: 2 }, { b: 99, c: 3 }) as any;
    expect(result.result).toEqual({ a: 1, b: 99, c: 3 });
    expect(result.resolution).toBe('merge');
  });
});

describe('defaultOnConflict (LWW)', () => {
  it('picks remote when remote is newer', () => {
    const local  = { updated_at: '2026-03-15T00:00:00Z', v: 1 };
    const remote = { updated_at: '2026-03-16T00:00:00Z', v: 2 };
    const result = defaultOnConflict(local, remote);
    expect(result.resolution).toBe('remote');
  });

  it('picks local when local is newer', () => {
    const local  = { updated_at: '2026-03-16T00:00:00Z', v: 2 };
    const remote = { updated_at: '2026-03-15T00:00:00Z', v: 1 };
    const result = defaultOnConflict(local, remote);
    expect(result.resolution).toBe('local');
  });
});
