import { describe, it, expect } from 'vitest';
import { IDbError } from './IDbError';

describe('IDbError', () => {
  it('should create an error with message and code', () => {
    const err = new IDbError('Test error', 'TEST_CODE');
    expect(err.message).toBe('Test error');
    expect(err.code).toBe('TEST_CODE');
    expect(err.name).toBe('DbCollectionError');
  });

  it('should throw error using throwError', () => {
    expect(() => IDbError.throwError('Throw error', 'THROW_CODE')).toThrow(IDbError);
  });

  it('should handle IDbError and log', () => {
    const error = new IDbError('Handle error', 'HANDLE_CODE');
    // Should not throw
    expect(() => IDbError.handleError(error)).not.toThrow();
  });

  it('should handle unknown error and log', () => {
    expect(() => IDbError.handleError('unknown')).not.toThrow();
  });
});
