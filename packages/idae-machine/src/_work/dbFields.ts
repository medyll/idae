// dbFields.ts - Initial field type and validation structure
// Based on README.md schema DSL

export type FieldType =
  | 'id'
  | 'text'
  | 'number'
  | 'boolean'
  | 'email'
  | 'date'
  | 'text-long'
  | 'text-area'
  | 'fk'
  | 'array-of-number'
  | 'password';

export interface FieldRule {
  type: FieldType;
  required?: boolean;
  readonly?: boolean;
  private?: boolean;
  fkTarget?: string;
}

export type FieldsDefinition = {
  [field: string]: FieldRule;
};

// Example: parse DSL string to FieldRule
export function parseFieldRule(dsl: string): FieldRule {
  // Very basic parser for demo
  const [typePart, ...modifiers] = dsl.split(' ');
  const rule: FieldRule = { type: typePart as FieldType };
  modifiers.forEach(mod => {
    if (mod === '(required)') rule.required = true;
    if (mod === '(readonly)') rule.readonly = true;
    if (mod === '(private)') rule.private = true;
    if (mod.startsWith('fk-')) rule.fkTarget = mod.slice(3);
  });
  return rule;
}
