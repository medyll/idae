import { describe, it, expect } from 'vitest';
import { defineMigration } from './index.js';

describe('migrations', () => {
  it('should define a migration', () => {
    const migration = defineMigration(1, (db) => {
      db.createObjectStore('users', { keyPath: 'id' });
    });

    expect(migration.version).toBe(1);
    expect(migration.migrate).toBeDefined();
  });

  it('should sort migrations by version', () => {
    const migrations = [
      defineMigration(3, () => {}),
      defineMigration(1, () => {}),
      defineMigration(2, () => {}),
    ];

    const sorted = [...migrations].sort((a, b) => a.version - b.version);

    expect(sorted.map(m => m.version)).toEqual([1, 2, 3]);
  });
});
