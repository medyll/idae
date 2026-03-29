/**
 * Validate data against a schema
 */

import type { Schema, ValidationResult, ValidationErrorMessage } from './types.js';
import {
  validateType,
  validateMin,
  validateMax,
  validatePattern,
  validateEnum,
  validateRequired,
} from './validators.js';

/**
 * Validate data against a schema
 * 
 * @param schema - Schema definition
 * @param data - Data to validate
 * @returns Validation result with errors
 */
export async function validate(schema: Schema, data: any): Promise<ValidationResult> {
  const errors: ValidationErrorMessage[] = [];
  const { fields, allowUnknown } = schema.definition;

  // Check for unknown fields
  if (!allowUnknown) {
    for (const key of Object.keys(data)) {
      if (!fields[key]) {
        errors.push({
          field: key,
          rule: 'unknown',
          message: `Unknown field: ${key}`,
          value: data[key],
        });
      }
    }
  }

  // Validate each field
  for (const [field, rule] of Object.entries(fields)) {
    const value = data[field];

    // Required check
    if (rule.required) {
      const error = validateRequired(value, field);
      if (error) {
        errors.push(error);
        continue;
      }
    }

    // Skip further validation if value is null/undefined and not required
    if (value === null || value === undefined) {
      if (!rule.nullable && rule.required) {
        errors.push({ field, rule: 'nullable', message: `${field} cannot be null`, value });
      }
      continue;
    }

    // Type check
    if (rule.type) {
      const error = validateType(value, rule.type, field);
      if (error) {
        errors.push(error);
        continue;
      }
    }

    // Min check
    if (rule.min !== undefined) {
      const error = validateMin(value, rule.min, field);
      if (error) {
        errors.push(error);
      }
    }

    // Max check
    if (rule.max !== undefined) {
      const error = validateMax(value, rule.max, field);
      if (error) {
        errors.push(error);
      }
    }

    // Pattern check
    if (rule.pattern) {
      const error = validatePattern(value, rule.pattern, field);
      if (error) {
        errors.push(error);
      }
    }

    // Enum check
    if (rule.enum) {
      const error = validateEnum(value, rule.enum, field);
      if (error) {
        errors.push(error);
      }
    }

    // Custom validator
    if (rule.validate) {
      try {
        const result = await rule.validate(value, data);
        if (result === false || typeof result === 'string') {
          errors.push({
            field,
            rule: 'validate',
            message: typeof result === 'string' ? result : `${field} is invalid`,
            value,
          });
        }
      } catch (error) {
        errors.push({
          field,
          rule: 'validate',
          message: `Custom validator error: ${error}`,
          value,
        });
      }
    }
  }

  // Schema-level validator
  if (schema.definition.validate) {
    try {
      const result = await schema.definition.validate(data);
      if (result === false || typeof result === 'string') {
        errors.push({
          field: '_schema',
          rule: 'validate',
          message: typeof result === 'string' ? result : 'Schema validation failed',
          value: data,
        });
      }
    } catch (error) {
      errors.push({
        field: '_schema',
        rule: 'validate',
        message: `Schema validator error: ${error}`,
        value: data,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate and throw on error
 */
export async function validateOrThrow(schema: Schema, data: any): Promise<void> {
  const result = await validate(schema, data);
  if (!result.valid) {
    const error = new ValidationError(result.errors);
    throw error;
  }
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(public errors: ValidationErrorMessage[]) {
    super(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    this.name = 'ValidationError';
  }
}
