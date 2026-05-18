import { describe, it, expect } from 'vitest';
import { validateField, validateRecord, getSupportedTypes, registerTypeValidator, type FieldRule } from '../validateRules.js';

describe('validateField', () => {
	describe('required', () => {
		it('rejects undefined when required', () => {
			expect(validateField(undefined, { required: true })).toBe('Ce champ est obligatoire');
		});

		it('rejects null when required', () => {
			expect(validateField(null, { required: true })).toBe('Ce champ est obligatoire');
		});

		it('rejects empty string when required', () => {
			expect(validateField('', { required: true })).toBe('Ce champ est obligatoire');
		});

		it('accepts undefined when not required', () => {
			expect(validateField(undefined, {})).toBeNull();
		});
	});

	describe('type: email', () => {
		it('accepts valid email', () => {
			expect(validateField('test@example.com', { type: 'email' })).toBeNull();
		});

		it('rejects invalid email', () => {
			expect(validateField('not-an-email', { type: 'email' })).toBe('Format email invalide');
		});
	});

	describe('type: url', () => {
		it('accepts valid URL', () => {
			expect(validateField('https://example.com', { type: 'url' })).toBeNull();
		});

		it('rejects invalid URL', () => {
			expect(validateField('not-a-url', { type: 'url' })).toBe('URL invalide');
		});
	});

	describe('type: date', () => {
		it('accepts valid date', () => {
			expect(validateField('2026-05-18', { type: 'date' })).toBeNull();
		});

		it('rejects invalid date', () => {
			expect(validateField('not-a-date', { type: 'date' })).toBe('Format de date invalide');
		});
	});

	describe('type: number', () => {
		it('accepts valid number', () => {
			expect(validateField(42, { type: 'number' })).toBeNull();
			expect(validateField('3.14', { type: 'number' })).toBeNull();
		});

		it('rejects non-number', () => {
			expect(validateField('abc', { type: 'number' })).toBe('Doit être un nombre');
		});
	});

	describe('type: integer', () => {
		it('accepts integer', () => {
			expect(validateField(42, { type: 'integer' })).toBeNull();
		});

		it('rejects float', () => {
			expect(validateField(3.14, { type: 'integer' })).toBe('Doit être un entier');
		});
	});

	describe('type: cp (code postal FR)', () => {
		it('accepts valid French postal code', () => {
			expect(validateField('75001', { type: 'cp' })).toBeNull();
		});

		it('rejects invalid postal code', () => {
			expect(validateField('1234', { type: 'cp' })).toBe('Code postal invalide (5 chiffres)');
			expect(validateField('ABCDE', { type: 'cp' })).toBe('Code postal invalide (5 chiffres)');
		});
	});

	describe('type: alpha', () => {
		it('accepts letters only', () => {
			expect(validateField('HelloWorld', { type: 'alpha' })).toBeNull();
			expect(validateField('Jean-Pierre', { type: 'alpha' })).toBeNull();
		});

		it('rejects numbers', () => {
			expect(validateField('Hello123', { type: 'alpha' })).toBe('Ne doit contenir que des lettres');
		});
	});

	describe('type: alphanum', () => {
		it('accepts letters and numbers', () => {
			expect(validateField('Hello123', { type: 'alphanum' })).toBeNull();
		});

		it('rejects special chars', () => {
			expect(validateField('Hello@123', { type: 'alphanum' })).toBe('Ne doit contenir que des lettres et chiffres');
		});
	});

	describe('min/max (numeric)', () => {
		it('respects min constraint', () => {
			expect(validateField(5, { type: 'number', min: 10 })).toBe('Minimum 10');
		});

		it('respects max constraint', () => {
			expect(validateField(20, { type: 'number', max: 10 })).toBe('Maximum 10');
		});

		it('accepts value within range', () => {
			expect(validateField(5, { type: 'number', min: 0, max: 10 })).toBeNull();
		});
	});

	describe('minLength/maxLength (string)', () => {
		it('respects minLength', () => {
			expect(validateField('ab', { minLength: 3 })).toBe('Minimum 3 caractères');
		});

		it('respects maxLength', () => {
			expect(validateField('abcdef', { maxLength: 3 })).toBe('Maximum 3 caractères');
		});
	});

	describe('pattern', () => {
		it('accepts matching pattern', () => {
			expect(validateField('ABC123', { pattern: /^[A-Z0-9]+$/ })).toBeNull();
		});

		it('rejects non-matching pattern', () => {
			expect(validateField('abc', { pattern: /^[A-Z]+$/ })).toBe('Format invalide');
		});

		it('accepts string pattern', () => {
			expect(validateField('12345', { pattern: '^\\d{5}$' })).toBeNull();
		});
	});

	describe('custom type validator', () => {
		it('supports registered custom types', () => {
			registerTypeValidator('positive', (v) => Number(v) > 0 || 'Must be positive');
			expect(validateField(5, { type: 'positive' })).toBeNull();
			expect(validateField(-1, { type: 'positive' })).toBe('Must be positive');
		});
	});
});

describe('validateRecord', () => {
	it('validates multiple fields', () => {
		const fields: Record<string, FieldRule> = {
			name:  { required: true, type: 'alpha' },
			email: { required: true, type: 'email' },
			age:   { type: 'integer', min: 0, max: 150 },
		};

		const result = validateRecord({ name: 'John', email: 'john@example.com', age: 30 }, fields);
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual({});
	});

	it('collects all errors', () => {
		const fields: Record<string, FieldRule> = {
			name:  { required: true, type: 'alpha' },
			email: { required: true, type: 'email' },
			age:   { type: 'integer', min: 0 },
		};

		const result = validateRecord({ name: 'John123', email: 'bad', age: -5 }, fields);
		expect(result.valid).toBe(false);
		expect(result.errors.name).toBe('Ne doit contenir que des lettres');
		expect(result.errors.email).toBe('Format email invalide');
		expect(result.errors.age).toBe('Minimum 0');
	});

	it('ignores missing optional fields', () => {
		const fields: Record<string, FieldRule> = {
			name:  { required: true },
			email: { type: 'email' },
		};

		const result = validateRecord({ name: 'John' }, fields);
		expect(result.valid).toBe(true);
	});
});

describe('getSupportedTypes', () => {
	it('returns all built-in type names', () => {
		const types = getSupportedTypes();
		expect(types).toContain('email');
		expect(types).toContain('url');
		expect(types).toContain('date');
		expect(types).toContain('number');
		expect(types).toContain('integer');
		expect(types).toContain('cp');
		expect(types).toContain('alpha');
		expect(types).toContain('alphanum');
	});
});
