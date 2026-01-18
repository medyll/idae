import { describe, it, expect } from 'vitest';
import { IDbFormValidate } from './IDbFormValidate';

describe('IDbFormValidate', () => {
  const mockDb = {
    parseCollectionFieldName: (collection, field) => {
      if (field === 'email') return { fieldType: 'email', fieldArgs: [] };
      if (field === 'number') return { fieldType: 'number', fieldArgs: [] };
      return { fieldType: 'text', fieldArgs: [] };
    },
  };
  const validator = new IDbFormValidate('agents', mockDb as any);

  it('should validate text field', () => {
    const result = validator.validateField('name', 'John');
    expect(result.isValid).toBe(true);
  });

  it('should validate email field', () => {
    expect(validator.validateField('email', 'test@example.com').isValid).toBe(true);
    expect(validator.validateField('email', 'invalid').isValid).toBe(false);
  });

  it('should validate number field', () => {
    expect(validator.validateField('number', 123).isValid).toBe(true);
    expect(validator.validateField('number', 'abc').isValid).toBe(false);
  });
});
