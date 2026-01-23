import { describe, it, expect, beforeEach } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { testScheme } from '../../demo/testScheme.js';
import { MachineScheme } from '../machine/MachineScheme.js';

describe('MachineScheme', () => {
  let db: MachineDb;
  let scheme: MachineScheme;

  beforeEach(() => {
    db = new MachineDb(testScheme);
    scheme = db.collection('agent');
  });

  it('should expose collection name and template', () => {
    expect(scheme.collection).toBe('agent');
    expect(scheme.template).toBeDefined();
  });

  it('should return a validator instance', () => {
    const validator = scheme.validator;
    expect(validator).toBeDefined();
    expect(typeof validator.validateField).toBe('function');
  });

  it('should return a MachineSchemeField for a field', () => {
    const field = scheme.field('id');
    expect(field).toBeDefined();
    expect(typeof field.parse).toBe('function');
  });

  it('should parse all fields', () => {
    const parsed = scheme.parse();
    expect(parsed).toBeDefined();
    expect(parsed?.id).toBeDefined();
  });
});
