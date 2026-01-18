import { describe, it, expect } from 'vitest';
import { MachineForge } from './machineForge';

describe('MachineForge', () => {
  const forge = new MachineForge();

  it('should detect primitive type', () => {
    const result = forge.testIs('primitive', 'text (required)');
    expect(result).toBeDefined();
    expect(result?.is).toBe('primitive');
    expect(result?.fieldType).toBe('text');
  });

  it('should detect array type', () => {
    const result = forge.testIs('array', 'array-of-number (required)');
    expect(result).toBeDefined();
    expect(result?.is).toBe('array');
    expect(result?.fieldType).toBe('number');
  });

  it('should detect object type', () => {
    const result = forge.testIs('object', 'object-custom (readonly)');
    expect(result).toBeDefined();
    expect(result?.is).toBe('object');
    expect(result?.fieldType).toBe('custom');
  });

  it('should detect fk type', () => {
    const result = forge.testIs('fk', 'fk-user.id (required)');
    expect(result).toBeDefined();
    expect(result?.is).toBe('fk');
    expect(result?.fieldType).toBe('fk-user.id');
  });

  it('should return undefined for mismatched type', () => {
    const result = forge.testIs('array', 'text (required)');
    expect(result).toBeUndefined();
  });
});
