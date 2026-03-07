import { describe, it, expect } from 'vitest';
import { MachineParserForge } from '../machineParserForge.js';

describe('MachineParserForge', () => {
  const p = new MachineParserForge();

  it('parses primitive text with args', () => {
    const r = p.testIs('primitive', 'text (required)');
    expect(r).toBeDefined();
    expect(r?.fieldType).toBe('text');
    expect(r?.fieldArgs).toEqual(['required']);
  });

  it('primitive returns undefined for prefixed types', () => {
    expect(p.testIs('primitive', 'array-of-text')).toBeUndefined();
    expect(p.testIs('primitive', 'fk-user.id')).toBeUndefined();
  });

  it('parses array-of-number with multiple args', () => {
    const r = p.testIs('array', 'array-of-number (min 1 max 10)');
    expect(r).toBeDefined();
    expect(r?.fieldType).toBe('number');
    expect(r?.is).toBe('array');
    expect(r?.fieldArgs).toEqual(['min', '1', 'max', '10']);
  });

  it('parses fk rule and preserves fk- prefix', () => {
    const r = p.testIs('fk', 'fk-product_category.id (required)');
    expect(r).toBeDefined();
    expect(r?.fieldType).toBe('fk-product_category.id');
    expect(r?.is).toBe('fk');
    expect(r?.fieldArgs).toEqual(['required']);
  });

  it('extract returns piece and args for primitive', () => {
    const ex = p.extract('primitive', 'text-long (required private)');
    expect(ex).toBeDefined();
    expect(ex.fieldType).toBe('text-long');
    expect(ex.fieldArgs).toEqual(['required', 'private']);
  });

  it('forge constructs an IDbForge-like object', () => {
    const forged = p.forge({
      collection: 'demo',
      fieldName: 'name',
      fieldType: 'text',
      fieldRule: 'text (required)',
      fieldArgs: ['required'],
      is: 'primitive',
    } as any);
    expect(forged.collection).toBe('demo');
    expect(forged.fieldType).toBe('text');
    expect(forged.is).toBe('primitive');
  });

  it('handles object- prefix extraction', () => {
    const r = p.testIs('object', 'object-address (street city)');
    expect(r).toBeDefined();
    expect(r?.fieldType).toBe('address');
    expect(r?.is).toBe('object');
  });

  it('returns undefined for non-matching types', () => {
    expect(p.testIs('array', 'text (required)')).toBeUndefined();
  });
});
