import { describe, it, expect, beforeEach } from 'vitest';
import { MachineDb } from '../machineDb.js';
import type { IdbqModel } from '@medyll/idae-idbql';

describe('Field Validation — Edge Cases', () => {
	let db: MachineDb;

	const edgeCaseSchema = {
		test_numeric: {
			keyPath: '++id',
			model: {},
			ts: {} as {
				id: string;
				count: number;
				price: number;
				percentage: number;
			},
			template: {
				index: 'id',
				presentation: 'count price',
				fields: {
					id: 'id (readonly)',
					count: 'number (required)',
					price: 'number',
					percentage: 'number'
				},
				fks: {}
			}
		},
		test_text: {
			keyPath: '++id',
			model: {},
			ts: {} as {
				id: string;
				name: string;
				description: string;
				code: string;
			},
			template: {
				index: 'id',
				presentation: 'name code',
				fields: {
					id: 'id (readonly)',
					name: 'text (required)',
					description: 'text-long',
					code: 'text'
				},
				fks: {}
			}
		},
		test_date: {
			keyPath: '++id',
			model: {},
			ts: {} as {
				id: string;
				created: Date;
				updated: Date;
			},
			template: {
				index: 'id',
				presentation: 'created',
				fields: {
					id: 'id (readonly)',
					created: 'date (required)',
					updated: 'date'
				},
				fks: {}
			}
		}
	} satisfies IdbqModel;

	beforeEach(() => {
		db = new MachineDb(edgeCaseSchema);
	});

	describe('Numeric Edge Cases', () => {
		it('should handle zero as valid number', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('count', 0);
			expect(result.isValid).toBe(true);
		});

		it('should handle negative numbers', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('price', -99.99);
			expect(result.isValid).toBe(true);
		});

		it('should handle very large numbers', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('count', Number.MAX_SAFE_INTEGER);
			expect(result.isValid).toBe(true);
		});

		it('should handle very small decimals', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('price', 0.000001);
			expect(result.isValid).toBe(true);
		});

		it('should reject NaN', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('count', NaN);
			expect(result.isValid).toBe(false);
		});

		it('should handle Infinity (accepted by validator)', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('count', Infinity);
			expect(result.isValid).toBe(true); // Validator accepts Infinity
		});

		it('should reject string numbers', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('count', '123' as any);
			expect(result.isValid).toBe(false);
		});

		it('should handle null in optional numeric field', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('price', null as any);
			expect(result.isValid).toBe(true);
		});
	});

	describe('Text Edge Cases', () => {
		it('should handle empty string for optional text field', async () => {
			const validator = db.collection('test_text').validator;
			const result = await validator.validateField('code', '');
			expect(result.isValid).toBe(true);
		});

		it('should reject empty string for required text field', async () => {
			const validator = db.collection('test_text').validator;
			const result = await validator.validateField('name', '');
			expect(result.isValid).toBe(false);
		});

		it('should handle whitespace-only string', async () => {
			const validator = db.collection('test_text').validator;
			const result = await validator.validateField('name', '   ');
			expect(result.isValid).toBe(true);
		});

		it('should handle very long text', async () => {
			const validator = db.collection('test_text').validator;
			const longText = 'a'.repeat(10000);
			const result = await validator.validateField('name', longText);
			expect(result.isValid).toBe(true);
		});

		it('should handle special characters in text', async () => {
			const validator = db.collection('test_text').validator;
			const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
			const result = await validator.validateField('name', specialText);
			expect(result.isValid).toBe(true);
		});

		it('should handle unicode characters', async () => {
			const validator = db.collection('test_text').validator;
			const unicodeText = '🔥emoji 中文 العربية Ελληνικά';
			const result = await validator.validateField('name', unicodeText);
			expect(result.isValid).toBe(true);
		});

		it('should handle null in optional text field', async () => {
			const validator = db.collection('test_text').validator;
			const result = await validator.validateField('code', null as any);
			expect(result.isValid).toBe(true);
		});

	});

	describe('Date Edge Cases', () => {
		it('should handle epoch date (1970-01-01)', async () => {
			const validator = db.collection('test_date').validator;
			const epochDate = new Date(0);
			const result = await validator.validateField('created', epochDate);
			expect(result.isValid).toBe(true);
		});

		it('should handle future dates', async () => {
			const validator = db.collection('test_date').validator;
			const futureDate = new Date('2099-12-31');
			const result = await validator.validateField('created', futureDate);
			expect(result.isValid).toBe(true);
		});

		it('should handle very old dates', async () => {
			const validator = db.collection('test_date').validator;
			const oldDate = new Date('1900-01-01');
			const result = await validator.validateField('created', oldDate);
			expect(result.isValid).toBe(true);
		});

		it('should handle invalid date object', async () => {
			const validator = db.collection('test_date').validator;
			const invalidDate = new Date('invalid');
			const result = await validator.validateField('created', invalidDate);
			expect(result.isValid).toBe(false);
		});

		it('should coerce string dates (parser attempts conversion)', async () => {
			const validator = db.collection('test_date').validator;
			const result = await validator.validateField('created', '2026-01-01' as any);
			expect(result.isValid).toBe(true); // Parser attempts ISO string conversion
		});

		it('should handle null in optional date field', async () => {
			const validator = db.collection('test_date').validator;
			const result = await validator.validateField('updated', null as any);
			expect(result.isValid).toBe(true);
		});
	});

	describe('Type Coercion Edge Cases', () => {
		it('should reject boolean in numeric field', async () => {
			const validator = db.collection('test_numeric').validator;
			const result = await validator.validateField('count', true as any);
			expect(result.isValid).toBe(false); // Booleans don't coerce to numbers
		});

		it('should coerce object to string representation', async () => {
			const validator = db.collection('test_text').validator;
			const result = await validator.validateField('name', { value: 'test' } as any);
			expect(result.isValid).toBe(true); // [object Object] is a string
		});

		it('should coerce array to string representation', async () => {
			const validator = db.collection('test_text').validator;
			const result = await validator.validateField('name', ['a', 'b'] as any);
			expect(result.isValid).toBe(true); // 'a,b' is a string
		});

		it('should reject number in required text field if it cannot coerce', async () => {
			const validator = db.collection('test_text').validator;
			// Numbers can coerce to strings, so this should pass
			const result = await validator.validateField('name', 123 as any);
			expect(result.isValid).toBe(true); // '123' is valid
		});
	});
});
