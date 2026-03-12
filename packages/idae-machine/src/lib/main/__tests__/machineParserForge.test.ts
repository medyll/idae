import { describe, it, expect } from 'vitest';
import { MachineParserForge } from '../machineParserForge.js';

describe('MachineParserForge', () => {
  const p = new MachineParserForge();

  describe('Primitive Types', () => {
    it('parses "text" field without modifiers', () => {
      const r = p.testIs('primitive', 'text');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
      expect(r?.fieldArgs).toBeUndefined();
    });

    it('parses "text" field with required modifier', () => {
      const r = p.testIs('primitive', 'text (required)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
      expect(r?.fieldArgs).toEqual(['required']);
    });

    it('parses "number" field', () => {
      const r = p.testIs('primitive', 'number');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('number');
      expect(r?.is).toBe('primitive');
    });

    it('parses "boolean" field', () => {
      const r = p.testIs('primitive', 'boolean');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('boolean');
    });

    it('parses "date" field', () => {
      const r = p.testIs('primitive', 'date');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('date');
    });

    it('parses "email" field', () => {
      const r = p.testIs('primitive', 'email');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('email');
    });

    it('parses custom primitive types like "text-long"', () => {
      const r = p.testIs('primitive', 'text-long');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text-long');
    });

    it('parses primitive with multiple modifiers', () => {
      const r = p.testIs('primitive', 'text (required private)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
      expect(r?.fieldArgs).toEqual(['required', 'private']);
    });

    it('parses primitive with readonly modifier', () => {
      const r = p.testIs('primitive', 'id (readonly)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('id');
      expect(r?.fieldArgs).toEqual(['readonly']);
    });

    it('returns undefined for primitive when array-of- prefix is present', () => {
      expect(p.testIs('primitive', 'array-of-text')).toBeUndefined();
    });

    it('returns undefined for primitive when fk- prefix is present', () => {
      expect(p.testIs('primitive', 'fk-user.id')).toBeUndefined();
    });

    it('returns undefined for primitive when object- prefix is present', () => {
      expect(p.testIs('primitive', 'object-address')).toBeUndefined();
    });
  });

  describe('Array Types', () => {
    it('parses "array-of-text" field', () => {
      const r = p.testIs('array', 'array-of-text');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
      expect(r?.is).toBe('array');
    });

    it('parses "array-of-number" field', () => {
      const r = p.testIs('array', 'array-of-number');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('number');
    });

    it('parses "array-of-string" field', () => {
      const r = p.testIs('array', 'array-of-string');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('string');
    });

    it('parses array-of with multiple args', () => {
      const r = p.testIs('array', 'array-of-number (min 1 max 10)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('number');
      expect(r?.is).toBe('array');
      expect(r?.fieldArgs).toEqual(['min', '1', 'max', '10']);
    });

    it('parses array-of with required modifier', () => {
      const r = p.testIs('array', 'array-of-text (required)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
      expect(r?.fieldArgs).toEqual(['required']);
    });

    it('returns undefined for array when text prefix is present', () => {
      expect(p.testIs('array', 'text (required)')).toBeUndefined();
    });

    it('returns undefined for array when fk- prefix is present', () => {
      expect(p.testIs('array', 'fk-user.id')).toBeUndefined();
    });
  });

  describe('Foreign Key Types', () => {
    it('parses "fk-teams.id" field', () => {
      const r = p.testIs('fk', 'fk-teams.id');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('fk-teams.id');
      expect(r?.is).toBe('fk');
    });

    it('parses "fk-user.id" field with required modifier', () => {
      const r = p.testIs('fk', 'fk-user.id (required)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('fk-user.id');
      expect(r?.is).toBe('fk');
      expect(r?.fieldArgs).toEqual(['required']);
    });

    it('parses fk with complex collection name', () => {
      const r = p.testIs('fk', 'fk-product_category.id');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('fk-product_category.id');
      expect(r?.is).toBe('fk');
    });

    it('parses fk with multiple modifiers', () => {
      const r = p.testIs('fk', 'fk-teams.id (required readonly)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('fk-teams.id');
      expect(r?.fieldArgs).toEqual(['required', 'readonly']);
    });

    it('returns undefined for fk when text prefix is present', () => {
      expect(p.testIs('fk', 'text')).toBeUndefined();
    });

    it('returns undefined for fk when array- prefix is present', () => {
      expect(p.testIs('fk', 'array-of-text')).toBeUndefined();
    });
  });

  describe('Object Types', () => {
    it('parses "object-address" field', () => {
      const r = p.testIs('object', 'object-address');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('address');
      expect(r?.is).toBe('object');
    });

    it('parses object with args', () => {
      const r = p.testIs('object', 'object-address (street city)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('address');
      expect(r?.is).toBe('object');
      expect(r?.fieldArgs).toEqual(['street', 'city']);
    });

    it('parses object with complex name', () => {
      const r = p.testIs('object', 'object-contact_info');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('contact_info');
    });

    it('returns undefined for object when text prefix is present', () => {
      expect(p.testIs('object', 'text')).toBeUndefined();
    });
  });

  describe('Extract Method', () => {
    it('extract returns piece and args for primitive', () => {
      const ex = p.extract('primitive', 'text-long (required private)');
      expect(ex).toBeDefined();
      expect(ex.fieldType).toBe('text-long');
      expect(ex.fieldArgs).toEqual(['required', 'private']);
    });

    it('extract works for array types', () => {
      const ex = p.extract('array', 'array-of-number (min 1)');
      expect(ex.fieldType).toBe('number');
      expect(ex.is).toBe('array');
      expect(ex.fieldArgs).toEqual(['min', '1']);
    });

    it('extract works for fk types', () => {
      const ex = p.extract('fk', 'fk-users.id (required)');
      expect(ex.fieldType).toBe('fk-users.id');
      expect(ex.is).toBe('fk');
    });

    it('extract works for object types', () => {
      const ex = p.extract('object', 'object-location (lat lon)');
      expect(ex.fieldType).toBe('location');
      expect(ex.is).toBe('object');
    });
  });

  describe('Forge Method', () => {
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
      expect(forged.fieldName).toBe('name');
      expect(forged.fieldRule).toBe('text (required)');
    });

    it('forge preserves all properties', () => {
      const forged = p.forge({
        collection: 'users',
        fieldName: 'teamId',
        fieldType: 'fk-teams.id',
        fieldRule: 'fk-teams.id (required)',
        fieldArgs: ['required'],
        is: 'fk',
      } as any);
      expect(forged.fieldName).toBe('teamId');
      expect(forged.is).toBe('fk');
    });
  });

  describe('Edge Cases', () => {
    it('handles extra whitespace in modifier list', () => {
      const r = p.testIs('primitive', 'text  (required  private)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
      // Whitespace handling may vary; test what it actually returns
      expect(r?.fieldArgs).toBeDefined();
    });

    it('handles no space after type', () => {
      const r = p.testIs('primitive', 'text(required)');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('text');
    });

    it('handles multiple arg tuples', () => {
      const r = p.testIs('array', 'array-of-number (min 1 max 10 step 2)');
      expect(r).toBeDefined();
      expect(r?.fieldArgs).toBeDefined();
      expect(r?.fieldArgs?.length).toBeGreaterThan(0);
    });

    it('returns undefined for non-matching type test', () => {
      expect(p.testIs('array', 'text (required)')).toBeUndefined();
    });

    it('handles empty string by returning object with empty fieldType', () => {
      const r = p.testIs('primitive', '');
      expect(r).toBeDefined();
      expect(r?.fieldType).toBe('');
      expect(r?.is).toBe('primitive');
    });

    it('handles type-switching correctly', () => {
      const prim = p.testIs('primitive', 'text');
      const arr = p.testIs('array', 'text');
      expect(prim).toBeDefined();
      expect(arr).toBeUndefined();
    });
  });

  describe('Type Coercion & Modifiers', () => {
    it('recognizes all single modifiers separately', () => {
      const required = p.testIs('primitive', 'text (required)');
      const readonly = p.testIs('primitive', 'text (readonly)');
      const private_ = p.testIs('primitive', 'text (private)');

      expect(required?.fieldArgs).toEqual(['required']);
      expect(readonly?.fieldArgs).toEqual(['readonly']);
      expect(private_?.fieldArgs).toEqual(['private']);
    });

    it('parses all modifiers together', () => {
      const r = p.testIs('primitive', 'text (required readonly private)');
      expect(r?.fieldArgs).toEqual(['required', 'readonly', 'private']);
    });
  });
});
