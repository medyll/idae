import { describe, it, expect, beforeEach } from 'vitest';
import { Machine } from '../machine.js';
import { testScheme } from '../../demo/testScheme.js';
import { MachineDb } from '../machineDb.js';

function createTestDb() {
  return new MachineDb(testScheme);
}

describe('MachineDb', () => {
  let db: MachineDb;

  beforeEach(() => {
    db = createTestDb();
  });

  it('should initialize with testScheme', () => {
    expect(db).toBeDefined();
    expect(db.model).toBe(testScheme);
  });

  it('should return a MachineScheme for a collection', () => {
    const scheme = db.collection('agent');
    expect(scheme).toBeDefined();
    expect(scheme.collection).toBe('agent');
    expect(scheme.template).toBeDefined();
  });

  it('should cache MachineScheme instances per collection', () => {
    const scheme1 = db.collection('agent');
    const scheme2 = db.collection('agent');
    expect(scheme1).toBe(scheme2);
  });
});
