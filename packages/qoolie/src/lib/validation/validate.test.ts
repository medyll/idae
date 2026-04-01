import { describe, it, expect } from 'vitest';
import { defineSchema, validate, validateOrThrow, ValidationError } from './index.js';

describe('Validation', () => {
  describe('defineSchema', () => {
    it('should create a schema with fields', () => {
      const schema = defineSchema({
        fields: {
          name: { type: 'string', required: true },
          age: { type: 'number' },
        },
      });

      expect(schema.definition.fields).toHaveProperty('name');
      expect(schema.definition.fields).toHaveProperty('age');
    });
  });

  describe('validate - type validation', () => {
    const schema = defineSchema({
      fields: {
        name: { type: 'string' },
        age: { type: 'number' },
        active: { type: 'boolean' },
        scores: { type: 'array' },
        metadata: { type: 'object' },
      },
    });

    it('should validate string type', async () => {
      const result = await validate(schema, { name: 'Alice' });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid string type', async () => {
      const result = await validate(schema, { name: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('type');
    });

    it('should validate number type', async () => {
      const result = await validate(schema, { age: 25 });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid number type', async () => {
      const result = await validate(schema, { age: '25' });
      expect(result.valid).toBe(false);
    });

    it('should validate boolean type', async () => {
      const result = await validate(schema, { active: true });
      expect(result.valid).toBe(true);
    });

    it('should validate array type', async () => {
      const result = await validate(schema, { scores: [1, 2, 3] });
      expect(result.valid).toBe(true);
    });

    it('should validate object type', async () => {
      const result = await validate(schema, { metadata: { key: 'value' } });
      expect(result.valid).toBe(true);
    });
  });

  describe('validate - required', () => {
    const schema = defineSchema({
      fields: {
        name: { type: 'string', required: true },
      },
    });

    it('should pass required validation', async () => {
      const result = await validate(schema, { name: 'Alice' });
      expect(result.valid).toBe(true);
    });

    it('should fail required validation with undefined', async () => {
      const result = await validate(schema, {});
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('required');
    });

    it('should fail required validation with empty string', async () => {
      const result = await validate(schema, { name: '' });
      expect(result.valid).toBe(false);
    });
  });

  describe('validate - min/max', () => {
    const schema = defineSchema({
      fields: {
        name: { type: 'string', min: 2, max: 10 },
        age: { type: 'number', min: 0, max: 150 },
        tags: { type: 'array', min: 1, max: 5 },
      },
    });

    it('should pass min length validation', async () => {
      const result = await validate(schema, { name: 'Al' });
      expect(result.valid).toBe(true);
    });

    it('should fail min length validation', async () => {
      const result = await validate(schema, { name: 'A' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('min');
    });

    it('should pass max length validation', async () => {
      const result = await validate(schema, { name: 'Alice' });
      expect(result.valid).toBe(true);
    });

    it('should fail max length validation', async () => {
      const result = await validate(schema, { name: 'Alexanderia' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('max');
    });

    it('should pass number min/max validation', async () => {
      const result = await validate(schema, { age: 25 });
      expect(result.valid).toBe(true);
    });

    it('should fail number min validation', async () => {
      const result = await validate(schema, { age: -1 });
      expect(result.valid).toBe(false);
    });

    it('should fail number max validation', async () => {
      const result = await validate(schema, { age: 200 });
      expect(result.valid).toBe(false);
    });

    it('should pass array min/max validation', async () => {
      const result = await validate(schema, { tags: ['a', 'b'] });
      expect(result.valid).toBe(true);
    });

    it('should fail array min validation', async () => {
      const result = await validate(schema, { tags: [] });
      expect(result.valid).toBe(false);
    });
  });

  describe('validate - pattern', () => {
    const schema = defineSchema({
      fields: {
        email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      },
    });

    it('should pass pattern validation', async () => {
      const result = await validate(schema, { email: 'test@example.com' });
      expect(result.valid).toBe(true);
    });

    it('should fail pattern validation', async () => {
      const result = await validate(schema, { email: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('pattern');
    });
  });

  describe('validate - enum', () => {
    const schema = defineSchema({
      fields: {
        role: { type: 'string', enum: ['admin', 'user', 'guest'] },
      },
    });

    it('should pass enum validation', async () => {
      const result = await validate(schema, { role: 'admin' });
      expect(result.valid).toBe(true);
    });

    it('should fail enum validation', async () => {
      const result = await validate(schema, { role: 'superuser' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('enum');
    });
  });

  describe('validate - email type', () => {
    const schema = defineSchema({
      fields: {
        email: { type: 'email' },
      },
    });

    it('should validate email format', async () => {
      const result = await validate(schema, { email: 'test@example.com' });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const result = await validate(schema, { email: 'invalid' });
      expect(result.valid).toBe(false);
    });
  });

  describe('validate - custom validator', () => {
    const schema = defineSchema({
      fields: {
        username: {
          type: 'string',
          validate: (value) => {
            if (value && value.length < 3) {
              return 'Username must be at least 3 characters';
            }
            return true;
          },
        },
      },
    });

    it('should pass custom validation', async () => {
      const result = await validate(schema, { username: 'alice' });
      expect(result.valid).toBe(true);
    });

    it('should fail custom validation', async () => {
      const result = await validate(schema, { username: 'ab' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('3 characters');
    });
  });

  describe('validateOrThrow', () => {
    const schema = defineSchema({
      fields: {
        name: { type: 'string', required: true },
      },
    });

    it('should not throw on valid data', async () => {
      await expect(validateOrThrow(schema, { name: 'Alice' })).resolves.not.toThrow();
    });

    it('should throw ValidationError on invalid data', async () => {
      await expect(validateOrThrow(schema, {})).rejects.toThrow(ValidationError);
    });
  });

  describe('unknown fields', () => {
    const schema = defineSchema({
      fields: {
        name: { type: 'string' },
      },
      allowUnknown: false,
    });

    it('should reject unknown fields by default', async () => {
      const result = await validate(schema, { name: 'Alice', unknown: 'field' });
      expect(result.valid).toBe(false);
      expect(result.errors[0].rule).toBe('unknown');
    });

    it('should allow unknown fields when configured', async () => {
      const schemaWithUnknown = defineSchema({
        fields: { name: { type: 'string' } },
        allowUnknown: true,
      });
      const result = await validate(schemaWithUnknown, { name: 'Alice', unknown: 'field' });
      expect(result.valid).toBe(true);
    });
  });
});
