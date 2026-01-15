// Unit test for dbSchema.ts
import { describe, it, expect } from 'vitest';
import { schemeModelDb } from '$lib/db/dbSchema.js';

describe('dbSchema', () => {
  it('contains agent collection with correct fields', () => {
    expect(schemeModelDb.agent).toBeDefined();
    expect(schemeModelDb.agent.template.fields.id).toContain('id');
    expect(schemeModelDb.agent.template.fields.name).toContain('text');
    expect(schemeModelDb.agent.template.fields.code).toContain('text');
  });
});
