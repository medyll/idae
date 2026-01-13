// dbSchema.ts - Example schema definition
// Based on README.md Quick Start
// DO NOT USE THIS FILE AS ANY SOURCE OF TRUTH FOR ACTUAL IMPLEMENTATION
import type { SchemeModelDb } from './dataModel';
import { parseFieldRule } from './dbFields';

export const schemeModelDb: SchemeModelDb = {
  agents: {
    index: 'id',
    presentation: 'name',
    fields: {
      id: parseFieldRule('id (readonly)'),
      name: parseFieldRule('text (required)'),
      code: parseFieldRule('text (required)'),
      model: parseFieldRule('text'),
      prompt: parseFieldRule('text-long'),
      created_at: parseFieldRule('date (private)'),
      ia_lock: parseFieldRule('boolean (private)')
    },
    fks: {
      agentPrompt: {
        code: 'agentPrompt',
        multiple: true,
        rules: 'readonly private'
      }
    }
  }
};
