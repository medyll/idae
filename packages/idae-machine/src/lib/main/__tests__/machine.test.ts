import { describe, it, expect, beforeEach } from 'vitest';
import { Machine } from '../machine.js';
import { testScheme } from '../../demo/testScheme.js';


function createTestMachine() {
  return new Machine('test-db', 1, testScheme);
}

describe('Machine', () => {
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
});
