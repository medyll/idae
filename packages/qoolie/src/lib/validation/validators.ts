/**
 * Built-in validators
 */

import type { FieldRule, ValidationErrorMessage } from './types.js';

/**
 * Validate field type
 */
export function validateType(value: any, type: string, field: string): ValidationErrorMessage | null {
  if (value === null || value === undefined) {
    return null;
  }

  const actualType = getType(value);
  
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return { field, rule: 'type', message: `${field} must be a string`, value };
      }
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return { field, rule: 'type', message: `${field} must be a number`, value };
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return { field, rule: 'type', message: `${field} must be a boolean`, value };
      }
      break;
    case 'date':
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        return { field, rule: 'type', message: `${field} must be a valid date`, value };
      }
      break;
    case 'email':
      if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return { field, rule: 'type', message: `${field} must be a valid email`, value };
      }
      break;
    case 'url':
      if (typeof value !== 'string' || !/^https?:\/\/.+$/.test(value)) {
        return { field, rule: 'type', message: `${field} must be a valid URL`, value };
      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        return { field, rule: 'type', message: `${field} must be an array`, value };
      }
      break;
    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return { field, rule: 'type', message: `${field} must be an object`, value };
      }
      break;
  }

  return null;
}

/**
 * Validate minimum value/length
 */
export function validateMin(value: any, min: number, field: string): ValidationErrorMessage | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' && value.length < min) {
    return { field, rule: 'min', message: `${field} must be at least ${min} characters`, value };
  }

  if (typeof value === 'number' && value < min) {
    return { field, rule: 'min', message: `${field} must be at least ${min}`, value };
  }

  if (Array.isArray(value) && value.length < min) {
    return { field, rule: 'min', message: `${field} must have at least ${min} items`, value };
  }

  return null;
}

/**
 * Validate maximum value/length
 */
export function validateMax(value: any, max: number, field: string): ValidationErrorMessage | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' && value.length > max) {
    return { field, rule: 'max', message: `${field} must be at most ${max} characters`, value };
  }

  if (typeof value === 'number' && value > max) {
    return { field, rule: 'max', message: `${field} must be at most ${max}`, value };
  }

  if (Array.isArray(value) && value.length > max) {
    return { field, rule: 'max', message: `${field} must have at most ${max} items`, value };
  }

  return null;
}

/**
 * Validate pattern
 */
export function validatePattern(value: any, pattern: RegExp, field: string): ValidationErrorMessage | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' && !pattern.test(value)) {
    return { field, rule: 'pattern', message: `${field} format is invalid`, value };
  }

  return null;
}

/**
 * Validate enum
 */
export function validateEnum(value: any, enumValues: any[], field: string): ValidationErrorMessage | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!enumValues.includes(value)) {
    return { field, rule: 'enum', message: `${field} must be one of: ${enumValues.join(', ')}`, value };
  }

  return null;
}

/**
 * Validate required
 */
export function validateRequired(value: any, field: string): ValidationErrorMessage | null {
  if (value === null || value === undefined || value === '') {
    return { field, rule: 'required', message: `${field} is required`, value };
  }

  return null;
}

/**
 * Get JavaScript type
 */
function getType(value: any): string {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value instanceof Date) {
    return 'date';
  }
  if (value === null) {
    return 'null';
  }
  return typeof value;
}
