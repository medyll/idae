import { describe, it, expect } from 'vitest';
import * as pathResolver from './pathResolver';

describe('pathResolver', () => {
  it('should export dotPath', () => {
    expect(typeof pathResolver.dotPath).toBe('function');
  });

  it('should resolve a simple path', () => {
    const obj = { a: { b: 1 } };
    expect(pathResolver.dotPath(obj, 'a.b')).toBe(1);
  });

  it('should return undefined for bad path', () => {
    const obj = { a: { b: 1 } };
    expect(pathResolver.dotPath(obj, 'a.x')).toBeUndefined();
  });

  it('should return defaultValue if not found', () => {
    const obj = { a: { b: 1 } };
    expect(pathResolver.dotPath(obj, 'a.x', 42)).toBe(42);
  });

  it('should handle empty path', () => {
    const obj = { a: 1 };
    expect(pathResolver.dotPath(obj, '', 'default')).toBe('default');
  });
});
