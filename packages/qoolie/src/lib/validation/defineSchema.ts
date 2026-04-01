/**
 * Define a schema for collection validation
 */

import type { Schema, SchemaDefinition } from './types.js';

/**
 * Define a schema with validation rules
 * 
 * @example
 * ```typescript
 * const userSchema = defineSchema({
 *   fields: {
 *     name: { type: 'string', required: true, min: 2, max: 100 },
 *     email: { type: 'email', required: true },
 *     age: { type: 'number', min: 0, max: 150 },
 *     role: { type: 'string', enum: ['admin', 'user', 'guest'] },
 *   },
 * });
 * ```
 */
export function defineSchema(definition: SchemaDefinition): Schema {
  return {
    definition,
    compiled: new Map(Object.entries(definition.fields)),
  };
}
