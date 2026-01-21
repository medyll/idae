import { describe, it, expect } from 'vitest';
import { MachineSchemeFieldType, defaultTypes, defaultFieldTypesDef } from '../machine/MachineFieldType.js';
import type { FieldTypeDef } from '../machine/MachineFieldType.js';

describe('MachineSchemeFieldType (singleton)', () => {
  it('should update validator for a field type', () => {
    MachineSchemeFieldType.init(defaultFieldTypesDef);
    expect(MachineSchemeFieldType.getFieldType('text')?.validator?.('abc')).toBe(true); // default validator
    MachineSchemeFieldType.setValidator('text', v => typeof v === 'string' && v.length > 3);
    expect(MachineSchemeFieldType.getFieldType('text')?.validator?.('abc')).toBe(false);
    expect(MachineSchemeFieldType.getFieldType('text')?.validator?.('abcd')).toBe(true);
  });

  it('should update formatter for a field type', () => {
    MachineSchemeFieldType.init(defaultFieldTypesDef);
    expect(MachineSchemeFieldType.getFieldType('number')?.formatter(2.7)).toBe(2.7); // default formatter
    MachineSchemeFieldType.setFormatter('number', v => Math.round(Number(v)));
    expect(MachineSchemeFieldType.getFieldType('number')?.formatter(2.7)).toBe(3);
  });

  it('should register and retrieve a custom field type', () => {
    MachineSchemeFieldType.init({});
    const custom: FieldTypeDef = {
      id: 'custom',
      formatter: (v: unknown) => `x${v}`,
      validator: (v: unknown) => v === 'ok',
    };
    MachineSchemeFieldType.registerFieldType(custom);
    const found = MachineSchemeFieldType.getFieldType('custom');
    expect(found).toBeDefined();
    expect(found?.formatter('a')).toBe('xa');
    expect(found?.validator?.('ok') ?? true).toBe(true);
    expect(found?.validator?.('no') ?? false).toBe(false);
  });

  it('should unregister a field type', () => {
    MachineSchemeFieldType.init({});
    const custom: FieldTypeDef = {
      id: 'toremove',
      formatter: (v: unknown) => v,
      validator: () => true,
    };
    MachineSchemeFieldType.registerFieldType(custom);
    expect(MachineSchemeFieldType.getFieldType('toremove')).toBeDefined();
    expect(MachineSchemeFieldType.unregister('toremove')).toBe(true);
    expect(MachineSchemeFieldType.getFieldType('toremove')).toBeUndefined();
    expect(MachineSchemeFieldType.unregister('toremove')).toBe(false);
  });

  it('should return all default field types by default', () => {
    MachineSchemeFieldType.init(defaultFieldTypesDef);
    const all = MachineSchemeFieldType.getAllFieldTypes();
    // Should include at least the defaultTypes keys
    for (const key of Object.values(defaultTypes)) {
      expect(all[key]).toBeDefined();
      expect(all[key].id).toBe(key);
    }
  });

  it('should allow initialization without defaults', () => {
    MachineSchemeFieldType.init({});
    // Registry should be empty
    expect(Object.keys(MachineSchemeFieldType.getAllFieldTypes())).toHaveLength(0);
  });

  it('should allow custom types to override defaults', () => {
    MachineSchemeFieldType.init(defaultFieldTypesDef);
    const custom: FieldTypeDef = {
      id: defaultTypes.text,
      formatter: (v: unknown) => `override${v}`,
      validator: (v: unknown) => v === 'ok',
    };
    MachineSchemeFieldType.registerFieldType(custom);
    const found = MachineSchemeFieldType.getFieldType(defaultTypes.text);
    expect(found?.formatter('a')).toBe('overridea');
    expect(found?.validator?.('ok') ?? true).toBe(true);
    expect(found?.validator?.('no') ?? false).toBe(false);
  });
});
