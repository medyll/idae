/**
 * @file SchemeFieldDefaultValues.test.ts
 * @description Unit tests for SchemeFieldDefaultValues (default value factories logic)
 */
import { describe, it, expect } from 'vitest';
import { SchemeFieldDefaultValues } from '../machine/SchemeFieldDefaultValues.js';

describe('SchemeFieldDefaultValues', () => {
  it('returns global defaults for fields', () => {
    const result = SchemeFieldDefaultValues.getDefaults(['createdAt', 'status']);
    expect(result.status).toBe('draft');
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('returns collection-specific defaults when present', () => {
    SchemeFieldDefaultValues.defaultCollectionFactories['agents'] = {
      status: () => 'active',
      role: () => 'user',
    };
    const result = SchemeFieldDefaultValues.getDefaults(['status', 'role', 'createdAt'], 'agents');
    expect(result.status).toBe('active');
    expect(result.role).toBe('user');
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('getDefault returns correct value for single field', () => {
    expect(SchemeFieldDefaultValues.getDefault('status')).toBe('draft');
    SchemeFieldDefaultValues.defaultCollectionFactories['groups'] = {
      status: () => 'archived',
    };
    expect(SchemeFieldDefaultValues.getDefault('status', 'groups')).toBe('archived');
    expect(SchemeFieldDefaultValues.getDefault('createdAt')).toBeInstanceOf(Date);
    expect(SchemeFieldDefaultValues.getDefault('unknown')).toBeUndefined();
  });

  it('returns empty object if no defaults found', () => {
    const result = SchemeFieldDefaultValues.getDefaults(['foo', 'bar']);
    expect(result).toEqual({});
  });
  it('can set a global default for a single field', () => {
    SchemeFieldDefaultValues.setDefault('foo', () => 42);
    expect(SchemeFieldDefaultValues.getDefault('foo')).toBe(42);
    expect(SchemeFieldDefaultValues.getDefaults(['foo'])).toEqual({ foo: 42 });
  });

  it('can set a collection-specific default for a single field', () => {
    SchemeFieldDefaultValues.setDefault('bar', () => 'baz', 'agents');
    expect(SchemeFieldDefaultValues.getDefault('bar', 'agents')).toBe('baz');
    expect(SchemeFieldDefaultValues.getDefaults(['bar'], 'agents')).toEqual({ bar: 'baz' });
  });

  it('can set multiple global defaults at once', () => {
    SchemeFieldDefaultValues.setDefaults({ alpha: () => 1, beta: () => 2 });
    expect(SchemeFieldDefaultValues.getDefault('alpha')).toBe(1);
    expect(SchemeFieldDefaultValues.getDefault('beta')).toBe(2);
    expect(SchemeFieldDefaultValues.getDefaults(['alpha', 'beta'])).toEqual({ alpha: 1, beta: 2 });
  });

  it('can set multiple collection-specific defaults at once', () => {
    SchemeFieldDefaultValues.setDefaults({ gamma: () => 'x', delta: () => 'y' }, 'groups');
    expect(SchemeFieldDefaultValues.getDefault('gamma', 'groups')).toBe('x');
    expect(SchemeFieldDefaultValues.getDefault('delta', 'groups')).toBe('y');
    expect(SchemeFieldDefaultValues.getDefaults(['gamma', 'delta'], 'groups')).toEqual({ gamma: 'x', delta: 'y' });
  });
});
