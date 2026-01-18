import { describe, it, expect } from 'vitest';
import { IDbFieldType } from './IDbFieldType';

describe('IDbFieldType', () => {
  const fieldType = new IDbFieldType();

  it('should format id as string', () => {
    expect(fieldType.format('id', 123)).toBe('123');
  });

  it('should format any as string', () => {
    expect(fieldType.format('any', 'abc')).toBe('abc');
  });

  it('should format date', () => {
    const result = fieldType.format('date', '2026-01-17');
    expect(typeof result).toBe('string');
  });

  it('should format text', () => {
    expect(fieldType.format('text', 'hello')).toBe('hello');
  });

  it('should format number', () => {
    expect(fieldType.format('number', 42)).toBe('42');
  });

  it('should format boolean true as check', () => {
    expect(fieldType.format('boolean', true)).toBe('✔');
  });

  it('should format boolean false as cross', () => {
    expect(fieldType.format('boolean', false)).toBe('✘');
  });

  it('should format unknown type as string', () => {
    expect(fieldType.format('unknown', 'x')).toBe('x');
  });
});
