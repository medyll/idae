import { describe, it, expect } from 'vitest';
import { IDbFormValidate } from './dbFields.js';

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

describe('IDbFormValidate', () => {
  const validator = new IDbFormValidate('agent');

  it('validateField returns valid for correct value', () => {
    expect(validator.validateField('name', 'Test Agent').isValid).toBe(true);
  });

  it('validateField returns invalid for required field missing', () => {
    expect(validator.validateField('agentPromptId', undefined).isValid).toBe(false);
  });

  it('validateFieldValue returns true for valid', () => {
    expect(validator.validateFieldValue('name', 'Test Agent')).toBe(true);
  });

  it('validateFieldValue returns false for invalid', () => {
    expect(validator.validateFieldValue('agentPromptId', undefined)).toBe(false);
  });

  it('validateForm returns valid for correct data', () => {
    const result = validator.validateForm(agentData);
    expect(result.isValid).toBe(true);
    expect(result.invalidFields.length).toBe(0);
  });

  it('validateForm returns invalid for missing required', () => {
    const data = { ...agentData, agentPromptId: undefined };
    const result = validator.validateForm(data);
    expect(result.isValid).toBe(false);
    expect(result.invalidFields).toContain('agentPromptId');
  });

  it('validateForm ignores fields in ignoreFields option', () => {
    const data = { ...agentData, agentPromptId: undefined };
    const result = validator.validateForm(data, { ignoreFields: ['agentPromptId'] });
    expect(result.isValid).toBe(true);
  });
});
