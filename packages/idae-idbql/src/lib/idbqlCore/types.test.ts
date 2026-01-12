import { describe, it, expect } from 'vitest';
import * as types from './types';

describe('Types', () => {
  it('should export enumPrimitive', () => {
    expect(typeof types.enumPrimitive).toBe('object');
    expect(types.enumPrimitive.id).toBe('id');
  });
  it('should export TplProperties', () => {
    expect(typeof types.TplProperties).toBe('object');
    expect(types.TplProperties.readonly).toBe('readonly');
  });
  it('should combine elements', () => {
    type T = types.CombineElements<'a'|'b'>;
    const val: T = 'a b';
    expect(val).toBe('a b');
  });
  it('should support IdbObjectify', () => {
    const arr: types.IdbObjectify<'foo'> = 'array-of-foo';
    expect(arr).toBe('array-of-foo');
  });
});
