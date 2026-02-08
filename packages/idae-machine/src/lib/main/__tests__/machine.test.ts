import { describe, it, expect, beforeEach } from 'vitest';
import { Machine } from '../machine.js';
import { testScheme } from '../../demo/testScheme.js';


function createTestMachine() {
  return new Machine('test-db', 1, testScheme);
}

describe('Machine', () => {
    it('should create named instance and store in registry', () => {
      const named = Machine.prototype.createInstance('foo', 'foo-db', 1, testScheme);
      expect(named.instanceName).toBe('foo');
      expect(Machine.instanceRegistry['foo']).toBe(named);
    });

    it('should retrieve instance by name using instance', () => {
      const named = Machine.prototype.createInstance('bar', 'bar-db', 1, testScheme);
      const retrieved = Machine.instance('bar');
      expect(retrieved).toBe(named);
      expect(retrieved?.instanceName).toBe('bar');
    });
  let machine: Machine;

  beforeEach(() => {
    machine = createTestMachine();
  });

  it('should initialize with testScheme', () => {
    expect(machine).toBeDefined();
    expect(machine._model).toBe(testScheme);
  });

  it('should set dbName, version, and model via init', () => {
    machine.init({ dbName: 'foo', version: 2, model: testScheme });
    expect(machine._dbName).toBe('foo');
    expect(machine._version).toBe(2);
    expect(machine._model).toBe(testScheme);
  });

  it('should throw if start is called without model', () => {
    const m = new Machine();
    expect(() => m.start()).toThrow();
  });

  it('should create collections and store on start', () => {
    machine.start();
    expect(machine.logic).toBeDefined();
    expect(machine.idbql).toBeDefined();
    expect(machine.store).toBeDefined();
  });

  it('should expose accessors for logic, idbql, store, idbqlState, indexedb, idbqModel', () => {
    machine.start();
    expect(machine.logic).toBe(machine._machineDb);
    expect(machine.idbql).toBe(machine._idbql);
    expect(machine.store).toBe(machine._idbqlState);
    expect(machine.idbqlState).toBe(machine._idbqlState);
    expect(machine.indexedb).toBe(machine._idbDatabase);
    expect(machine.idbqModel).toBe(machine._idbqModel);
  });

  // --- Intégration MachineDb/MachineScheme ---
  describe('integration: MachineDb/MachineScheme', () => {
    beforeEach(() => {
      machine.start();
    });

    it('should access a collection and its template', () => {
      const scheme = machine.logic.collection('agent');
      expect(scheme).toBeDefined();
      expect(scheme.collection).toBe('agent');
      expect(scheme.template).toBeDefined();
    });

    it('should access a field and parse its metadata', () => {
      const scheme = machine.logic.collection('agent');
      const field = scheme.field('id');
      const meta = field.parse();
      expect(meta).toBeDefined();
      expect(meta?.fieldName).toBe('id');
    });

    it('should parse all fields of a collection', () => {
      const scheme = machine.logic.collection('agent');
      const parsed = scheme.parse();
      expect(parsed).toBeDefined();
      expect(parsed?.id).toBeDefined();
      expect(parsed?.name).toBeDefined();
    });

    it('should validate a valid field value', () => {
      const scheme = machine.logic.collection('agent');
      const validator = scheme.validator;
      const result = validator.validateField('id', 1);
      expect(result).toHaveProperty('isValid');
    });

    it('should throw MachineError for invalid field', () => {
      const scheme = machine.logic.collection('agent');
      const validator = scheme.validator;
      expect(() => {
        validator.validateField('notAField', 1);
      }).toThrowError(/Field notAField not found/);
    });
  });
});
