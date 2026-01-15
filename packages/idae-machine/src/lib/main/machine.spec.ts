// machine.spec.ts
import { describe, it, expect } from 'vitest';
import { Machine } from './machine';
import { IDbCollections } from '$lib/db/dbFields';
import { createIdbqDb } from '@medyll/idae-idbql';

// Copie simplifiée de schemeModel pour le test
const testSchemeModel = {
  collections: {
    test: {
      fields: {
        id: { type: 'number' },
        name: { type: 'string' }
      }
    }
  }
};

describe('Machine', () => {
  it('should initialize and expose core properties', () => {
    const machine = new Machine('test-db', 1, testSchemeModel as any);
    machine.start();
    expect(machine.collections).toBeDefined();
    expect(machine.idbql).toBeDefined();
    expect(machine.idbqlState).toBeDefined();
    expect(machine.indexedb).toBeDefined();
    expect(machine.idbqModel).toBeDefined();

    // Test d'instance
    expect(machine.collections).toBeInstanceOf(IDbCollections);

    // Pour idbql, idbqlState, indexedb, idbqModel : on vérifie le type object
    expect(typeof machine.idbql).toBe('object');
    expect(typeof machine.idbqlState).toBe('object');
    expect(typeof machine.indexedb).toBe('object');
    expect(typeof machine.idbqModel).toBe('object');
  });
});
