// Unit test for dbFields.ts
import { describe, it, expect } from 'vitest';
import { parseFieldRule } from './dbFields';

describe('dbFields', () => {
  it('parses required text field', () => {
    const rule = parseFieldRule('text (required)');
    expect(rule.type).toBe('text');
    expect(rule.required).toBe(true);
  });

  it('parses readonly id field', () => {
    const rule = parseFieldRule('id (readonly)');
    expect(rule.type).toBe('id');
    expect(rule.readonly).toBe(true);
  });

  it('parses fk field', () => {
    const rule = parseFieldRule('fk-category.id (required)');
    expect(rule.type).toBe('fk-category.id');
    expect(rule.required).toBe(true);
  });
});
