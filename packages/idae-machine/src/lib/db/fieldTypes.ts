// src/lib/db/fieldTypes.ts


export type FieldTypeId =
  | 'id'
  | 'text'
  | 'text-short'
  | 'text-medium'
  | 'text-long'
  | 'text-area'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'password'
  | 'object-any'
  | `fk-${string}.id`
  | `array-of-${string}`
  | `object-of-${string}`
  | `array-of-fk-${string}.id`;

export interface FieldTypeDef {
  id: FieldTypeId;
  formatter: (value: any) => any;
  validator?: (value: any) => boolean;
}

const fieldTypeRegistry: Record<string, FieldTypeDef> = {};

export function registerFieldType(def: FieldTypeDef) {
  fieldTypeRegistry[def.id] = def;
}

/**
 * Ajoute plusieurs types de champs d'un coup
 */
export function registerFieldTypes(defs: FieldTypeDef[]) {
  defs.forEach(registerFieldType);
}

export function getFieldType(id: FieldTypeId): FieldTypeDef | undefined {
  return fieldTypeRegistry[id];
}

export function getAllFieldTypes(): FieldTypeDef[] {
  return Object.values(fieldTypeRegistry);
}

// Enregistrement des types de base
registerFieldType({
  id: 'id',
  formatter: (v) => v
});
registerFieldType({
  id: 'text',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'text-short',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'text-medium',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'text-long',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'text-area',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'number',
  formatter: (v) => Number(v)
});
registerFieldType({
  id: 'boolean',
  formatter: (v) => Boolean(v)
});
registerFieldType({
  id: 'date',
  formatter: (v) => (v ? new Date(v) : null)
});
registerFieldType({
  id: 'email',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'password',
  formatter: (v) => (typeof v === 'string' ? v : String(v))
});
registerFieldType({
  id: 'object-any',
  formatter: (v) => v
});
// Pour les types dynamiques (fk-*, array-of-*) il faudra un traitement spécial à l'enregistrement
