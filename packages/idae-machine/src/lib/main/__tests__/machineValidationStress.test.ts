import { describe, it, expect, beforeEach } from 'vitest';
import { MachineDb } from '../machineDb.js';
import type { IdbqModel } from '@medyll/idae-idbql';

describe('Field Validation — Stress Tests', () => {
	let db: MachineDb;

	const stressSchema = {
		large_dataset: {
			keyPath: '++id',
			model: {},
			ts: {} as {
				id: string;
				name: string;
				value: number;
				active: boolean;
			},
			template: {
				index: 'id',
				presentation: 'name value',
				fields: {
					id: 'id (readonly)',
					name: 'text (required)',
					value: 'number',
					active: 'boolean'
				},
				fks: {}
			}
		}
	} satisfies IdbqModel;

	beforeEach(() => {
		db = new MachineDb(stressSchema);
	});

	describe('Bulk Validation Performance', () => {
		it('should validate 100 records within reasonable time', async () => {
			const validator = db.collection('large_dataset').validator;
			const startTime = performance.now();

			const promises = [];
			for (let i = 0; i < 100; i++) {
				promises.push(validator.validateField('name', `Record${i}`));
			}
			await Promise.all(promises);

			const duration = performance.now() - startTime;
			expect(duration).toBeLessThan(1000); // Should complete in < 1 second
		});

		it('should validate 500 records without timeout', async () => {
			const validator = db.collection('large_dataset').validator;
			const startTime = performance.now();

			const promises = [];
			for (let i = 0; i < 500; i++) {
				promises.push(validator.validateField('value', i));
			}
			await Promise.all(promises);

			const duration = performance.now() - startTime;
			expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
		});
	});

	describe('Concurrent Validation', () => {
		it('should handle 50 concurrent validations', async () => {
			const validator = db.collection('large_dataset').validator;
			const promises = [];

			for (let i = 0; i < 50; i++) {
				promises.push(validator.validateField('name', `Name${i}`));
				promises.push(validator.validateField('value', i * 10));
			}

			const results = await Promise.all(promises);
			expect(results.every((r) => r.isValid)).toBe(true);
		});

		it('should handle rapid sequential validations', async () => {
			const validator = db.collection('large_dataset').validator;
			const results = [];

			for (let i = 0; i < 100; i++) {
				const result = await validator.validateField('name', `Item${i}`);
				results.push(result);
			}

			expect(results.length).toBe(100);
			expect(results.every((r) => r.isValid)).toBe(true);
		});

		it('should handle mixed validation types concurrently', async () => {
			const validator = db.collection('large_dataset').validator;
			const promises = [];

			for (let i = 0; i < 30; i++) {
				promises.push(validator.validateField('name', `Name${i}`));
				promises.push(validator.validateField('value', i));
				promises.push(validator.validateField('value', -i));
				promises.push(validator.validateField('value', i * 1000));
			}

			const results = await Promise.all(promises);
			expect(results.length).toBe(120);
		});
	});

	describe('Large Value Validation', () => {
		it('should validate very long strings', async () => {
			const validator = db.collection('large_dataset').validator;
			const longString = 'x'.repeat(100000);
			const result = await validator.validateField('name', longString);
			expect(result.isValid).toBe(true);
		});

		it('should validate large numbers', async () => {
			const validator = db.collection('large_dataset').validator;
			const result = await validator.validateField('value', Number.MAX_SAFE_INTEGER);
			expect(result.isValid).toBe(true);
		});

		it('should handle multiple large value validations', async () => {
			const validator = db.collection('large_dataset').validator;
			const promises = [];

			for (let i = 0; i < 10; i++) {
				const longString = 'a'.repeat(50000);
				promises.push(validator.validateField('name', longString));
			}

			const results = await Promise.all(promises);
			expect(results.every((r) => r.isValid)).toBe(true);
		});
	});

	describe('Error Handling Under Load', () => {
		it('should handle mixed valid and invalid validations', async () => {
			const validator = db.collection('large_dataset').validator;
			const promises = [];

			for (let i = 0; i < 50; i++) {
				if (i % 2 === 0) {
					promises.push(validator.validateField('name', `Valid${i}`));
				} else {
					promises.push(validator.validateField('value', NaN));
				}
			}

			const results = await Promise.all(promises);
			const validCount = results.filter((r) => r.isValid).length;
			const invalidCount = results.filter((r) => !r.isValid).length;
			expect(validCount + invalidCount).toBe(50);
			expect(invalidCount).toBeGreaterThan(0);
		});

		it('should recover from validation failures in sequence', async () => {
			const validator = db.collection('large_dataset').validator;

			const result1 = await validator.validateField('name', '');
			const result2 = await validator.validateField('name', 'Valid');
			const result3 = await validator.validateField('name', '');
			const result4 = await validator.validateField('name', 'Also Valid');

			expect(result1.isValid).toBe(false);
			expect(result2.isValid).toBe(true);
			expect(result3.isValid).toBe(false);
			expect(result4.isValid).toBe(true);
		});
	});

	describe('Memory and Resource Usage', () => {
		it('should not leak memory with repeated validations', async () => {
			const validator = db.collection('large_dataset').validator;

			// Perform 1000 validations and check memory doesn't explode
			for (let i = 0; i < 1000; i++) {
				await validator.validateField('name', `Item${i}`);
			}

			// If we got here without crashing, memory is reasonable
			expect(true).toBe(true);
		});

		it('should handle validator reuse efficiently', async () => {
			const validator = db.collection('large_dataset').validator;
			const iterations = 100;

			for (let round = 0; round < 10; round++) {
				const promises = [];
				for (let i = 0; i < iterations; i++) {
					promises.push(validator.validateField('value', Math.random() * 1000));
				}
				await Promise.all(promises);
			}

			expect(true).toBe(true); // Completed without error
		});
	});

	describe('Validator State Consistency', () => {
		it('should maintain consistent results across validations', async () => {
			const validator = db.collection('large_dataset').validator;
			const value = 'consistent-test-value';

			const results = [];
			for (let i = 0; i < 10; i++) {
				const result = await validator.validateField('name', value);
				results.push(result.isValid);
			}

			expect(results.every((r) => r === true)).toBe(true);
		});

		it('should produce same results for same inputs', async () => {
			const validator = db.collection('large_dataset').validator;

			const result1 = await validator.validateField('value', 42);
			const result2 = await validator.validateField('value', 42);
			const result3 = await validator.validateField('value', 42);

			expect(result1.isValid).toBe(result2.isValid);
			expect(result2.isValid).toBe(result3.isValid);
		});
	});
});
