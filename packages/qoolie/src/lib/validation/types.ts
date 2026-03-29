/**
 * Validation types
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'array' | 'object';

export interface FieldRule {
  /** Field type */
  type?: FieldType;
  /** Is field required */
  required?: boolean;
  /** Minimum value (for strings: length, for numbers: value) */
  min?: number;
  /** Maximum value (for strings: length, for numbers: value) */
  max?: number;
  /** Regex pattern for strings */
  pattern?: RegExp;
  /** Enum values */
  enum?: any[];
  /** Custom validator function */
  validate?: (value: any, data: any) => boolean | string | Promise<boolean | string>;
  /** Default value */
  default?: any;
  /** Is field nullable */
  nullable?: boolean;
}

export interface SchemaDefinition {
  /** Field definitions */
  fields: Record<string, FieldRule>;
  /** Allow extra fields not in schema */
  allowUnknown?: boolean;
  /** Custom schema-level validator */
  validate?: (data: any) => boolean | string | Promise<boolean | string>;
}

export interface ValidationErrorMessage {
  /** Field name */
  field: string;
  /** Validation rule that failed */
  rule: string;
  /** Error message */
  message: string;
  /** Actual value */
  value?: any;
}

export interface ValidationResult {
  /** Is validation successful */
  valid: boolean;
  /** List of validation errors */
  errors: ValidationErrorMessage[];
}

export interface Schema {
  /** Schema definition */
  definition: SchemaDefinition;
  /** Compiled schema */
  compiled: Map<string, FieldRule>;
}
