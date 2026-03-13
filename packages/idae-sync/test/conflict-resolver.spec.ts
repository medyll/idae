import { describe, it, expect } from 'vitest';
import { defaultOnConflict, mergeObjects } from '../src/lib/ConflictResolver';

describe('ConflictResolver', () => {
  it('prefers remote when remote.updated_at is newer', () => {
    const local = { id: 1, updated_at: '2020-01-01T00:00:00.000Z', a: 1 };
    const remote = { id: 1, updated_at: '2021-01-01T00:00:00.000Z', a: 2 };
    const r = defaultOnConflict(local, remote);
    expect(r.resolution).toBe('remote');
    expect(r.result).toBe(remote);
  });

  it('prefers local when local.updated_at is newer', () => {
    const local = { id: 1, updated_at: '2022-01-01T00:00:00.000Z', a: 3 };
    const remote = { id: 1, updated_at: '2021-01-01T00:00:00.000Z', a: 2 };
    const r = defaultOnConflict(local, remote);
    expect(r.resolution).toBe('local');
    expect(r.result).toBe(local);
  });

  it('treats missing updated_at as epoch', () => {
    const local = { id: 1, a: 1 };
    const remote = { id: 1, updated_at: '1970-01-02T00:00:00.000Z', a: 2 };
    const r = defaultOnConflict(local, remote);
    expect(r.resolution).toBe('remote');
  });

  it('mergeObjects merges fields with remote overriding local', () => {
    const local = { id: 1, a: 1, b: 1 };
    const remote = { id: 1, b: 2, c: 3 };
    const r = mergeObjects(local, remote);
    expect(r.resolution).toBe('merge');
    expect(r.result).toEqual({ id: 1, a: 1, b: 2, c: 3 });
  });
});
