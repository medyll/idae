import { describe, it, expect } from 'vitest';
import { SUPPORTED_OPERATORS, type OperatorType } from './operators.js';

describe('Query Operators', () => {
  it('should export all supported operators from idae-query', () => {
    expect(SUPPORTED_OPERATORS).toEqual([
      '$eq',
      '$gt',
      '$gte',
      '$lt',
      '$lte',
      '$ne',
      '$in',
      '$nin',
      '$contains',
      '$startsWith',
      '$endsWith',
      '$btw',
    ]);
  });

  it('should have 12 supported operators', () => {
    expect(SUPPORTED_OPERATORS.length).toBe(12);
  });

  describe('Operator types', () => {
    it('$eq should work with any type', () => {
      // Type check: $eq works with any type
      const query: OperatorType<string> = { $eq: 'test' };
      expect(query).toEqual({ $eq: 'test' });
    });

    it('$gt should work with numbers', () => {
      const query: OperatorType<number> = { $gt: 18 };
      expect(query).toEqual({ $gt: 18 });
    });

    it('$in should work with arrays', () => {
      const query: OperatorType<string> = { $in: ['admin', 'user'] };
      expect(query).toEqual({ $in: ['admin', 'user'] });
    });

    it('$contains should work with strings', () => {
      const query: OperatorType<string> = { $contains: 'test' };
      expect(query).toEqual({ $contains: 'test' });
    });

    it('$btw should work with number tuples', () => {
      const query: OperatorType<number> = { $btw: [18, 65] as [number, number] };
      expect(query).toEqual({ $btw: [18, 65] });
    });
  });

  describe('Operator documentation', () => {
    it('should document $eq (equality)', () => {
      // Usage: { field: { $eq: value } }
      // Finds documents where field equals value
      expect(SUPPORTED_OPERATORS).toContain('$eq');
    });

    it('should document $gt (greater than)', () => {
      // Usage: { field: { $gt: value } }
      // Finds documents where field > value (numbers/dates)
      expect(SUPPORTED_OPERATORS).toContain('$gt');
    });

    it('should document $gte (greater than or equal)', () => {
      // Usage: { field: { $gte: value } }
      // Finds documents where field >= value (numbers/dates)
      expect(SUPPORTED_OPERATORS).toContain('$gte');
    });

    it('should document $lt (less than)', () => {
      // Usage: { field: { $lt: value } }
      // Finds documents where field < value (numbers/dates)
      expect(SUPPORTED_OPERATORS).toContain('$lt');
    });

    it('should document $lte (less than or equal)', () => {
      // Usage: { field: { $lte: value } }
      // Finds documents where field <= value (numbers/dates)
      expect(SUPPORTED_OPERATORS).toContain('$lte');
    });

    it('should document $ne (not equal)', () => {
      // Usage: { field: { $ne: value } }
      // Finds documents where field != value
      expect(SUPPORTED_OPERATORS).toContain('$ne');
    });

    it('should document $in (in array)', () => {
      // Usage: { field: { $in: [value1, value2] } }
      // Finds documents where field is in the array
      expect(SUPPORTED_OPERATORS).toContain('$in');
    });

    it('should document $nin (not in array)', () => {
      // Usage: { field: { $nin: [value1, value2] } }
      // Finds documents where field is NOT in the array
      expect(SUPPORTED_OPERATORS).toContain('$nin');
    });

    it('should document $contains (string contains)', () => {
      // Usage: { field: { $contains: 'substring' } }
      // Finds documents where field contains the substring
      expect(SUPPORTED_OPERATORS).toContain('$contains');
    });

    it('should document $startsWith (string starts with)', () => {
      // Usage: { field: { $startsWith: 'prefix' } }
      // Finds documents where field starts with prefix
      expect(SUPPORTED_OPERATORS).toContain('$startsWith');
    });

    it('should document $endsWith (string ends with)', () => {
      // Usage: { field: { $endsWith: 'suffix' } }
      // Finds documents where field ends with suffix
      expect(SUPPORTED_OPERATORS).toContain('$endsWith');
    });

    it('should document $btw (between)', () => {
      // Usage: { field: { $btw: [min, max] } }
      // Finds documents where min <= field <= max (numbers)
      expect(SUPPORTED_OPERATORS).toContain('$btw');
    });
  });
});
