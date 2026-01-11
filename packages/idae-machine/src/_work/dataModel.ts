// dataModel.ts - Initial data model types
// Based on README.md and dbFields

import type { FieldsDefinition } from './dbFields';

export interface CollectionTemplate {
  index: string;
  presentation: string;
  fields: FieldsDefinition;
  fks?: Record<string, any>;
}

export type SchemeModelDb = {
  [collection: string]: CollectionTemplate;
};
