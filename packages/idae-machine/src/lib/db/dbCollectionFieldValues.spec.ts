import { describe, it, expect } from 'vitest';
import { IDbCollectionFieldValues } from '$lib/main/machine/IDbCollectionFieldValues.js';

const agentData = {
  id: 1,
  name: 'Test Agent',
  code: 'A1',
  model: 'gpt',
  prompt: 'Say hello',
  created_at: '2026-01-01',
  ia_lock: false,
  agentPromptId: 2
};

describe('IDbCollectionFieldValues', () => {
  const fieldValues = new IDbCollectionFieldValues('agent', agentData);

 

 

  it('iterateArray returns array (empty for non-array)', () => {
    expect(Array.isArray(fieldValues.iterateArrayField('name', ['a', 'b']))).toBe(true);
  });

  it('iterateObject returns array (empty for non-object)', () => {
    expect(Array.isArray(fieldValues.iterateObjectField('name', { a: 1 }))).toBe(true);
  });
});
