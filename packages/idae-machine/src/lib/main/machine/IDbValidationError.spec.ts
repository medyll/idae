import { describe, it, expect } from 'vitest';
import { IDbValidationError } from './IDbValidationError';

describe('IDbValidationError', () => {
  it('should create a validation error with field, code, and message', () => {
    const err = new IDbValidationError('email', 'INVALID_EMAIL', 'Invalid email address');
    expect(err.field).toBe('email');
    expect(err.code).toBe('INVALID_EMAIL');
    expect(err.message).toBe('Invalid email address');
    expect(err.name).toBe('IDbValidationError');
  });
});
