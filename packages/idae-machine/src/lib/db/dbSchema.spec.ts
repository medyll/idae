// Unit test for dbSchema.ts
import { describe, it, expect } from 'vitest';
import { schemeModelDb } from '$lib/db/dbSchema.js';

describe('dbSchema', () => {
  it('contains agents collection with correct fields', () => {
    expect(schemeModelDb.agents).toBeDefined();
    expect(schemeModelDb.agents.fields.id.type).toBe('id');
    expect(schemeModelDb.agents.fields.name.required).toBe(true);
    expect(schemeModelDb.agents.fields.code.type).toBe('text');
  });
});
