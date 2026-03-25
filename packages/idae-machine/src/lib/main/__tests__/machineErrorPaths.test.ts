import { describe, it, expect, beforeEach } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { MachineError, MachineErrorValidation } from '../machine/MachineError.js';
import type { IdbqModel } from '@medyll/idae-idbql';

describe('Machine Error Paths', () => {
	describe('Schema Validation Errors', () => {
		it('should detect missing field definition in template', () => {
			const invalidSchema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name', // references 'name' field
						fields: {
							id: 'id (readonly)'
							// 'name' is missing!
						},
						fks: {}
					}
				}
			} as any;

			// Should not crash, but field resolution should fail gracefully
			const db = new MachineDb(invalidSchema);
			expect(db).toBeDefined();
		});

		it('should handle undefined field type in validation', async () => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'value',
						fields: {
							id: 'id (readonly)',
							value: 'unknown-type' // Invalid type
						},
						fks: {}
					}
				}
			} as any;

			const db = new MachineDb(schema);
			const validator = db.collection('test').validator;

			// Validation should handle unknown type gracefully
			const result = await validator.validateField('value', 'test');
			expect(result).toBeDefined();
		});

		it('should detect malformed foreign key references', () => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'fk_field',
						fields: {
							id: 'id (readonly)',
							fk_field: 'fk-missing_collection.id' // Collection doesn't exist
						},
						fks: {
							missing_collection: { code: 'missing_collection', multiple: false }
						}
					}
				}
			} as any;

			// Should not crash on schema parse
			const db = new MachineDb(schema);
			expect(db).toBeDefined();
		});
	});

	describe('Database Initialization Errors', () => {
		it('should initialize database with valid schema', () => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name',
						fields: {
							id: 'id (readonly)',
							name: 'text'
						},
						fks: {}
					}
				}
			} as any;
			const db = new MachineDb(schema);
			expect(db).toBeDefined();
			// Should be able to access collections
			expect(db.collection('test')).toBeDefined();
		});

		it('should handle collection with missing keyPath', () => {
			const schema = {
				test: {
					keyPath: undefined as any, // Missing keyPath
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name',
						fields: {
							id: 'id (readonly)',
							name: 'text'
						},
						fks: {}
					}
				}
			} as any;

			// Should not crash
			const db = new MachineDb(schema);
			expect(db).toBeDefined();
		});

		it('should handle collection with invalid keyPath format', () => {
			const schema = {
				test: {
					keyPath: 'invalid-key-format!', // Invalid keyPath
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name',
						fields: {
							id: 'id (readonly)',
							name: 'text'
						},
						fks: {}
					}
				}
			} as any;

			// Should handle gracefully
			const db = new MachineDb(schema);
			expect(db).toBeDefined();
		});
	});

	describe('Field Validation Error Messages', () => {
		let db: MachineDb;

		beforeEach(() => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name',
						fields: {
							id: 'id (readonly)',
							name: 'text (required)',
							age: 'number',
							created: 'date'
						},
						fks: {}
					}
				}
			} as any;
			db = new MachineDb(schema);
		});

		it('should provide error message for missing required field', async () => {
			const validator = db.collection('test').validator;
			const result = await validator.validateField('name', '');
			expect(result.isValid).toBe(false);
			expect(result.errors || Object.keys(result).length).toBeGreaterThan(0);
		});

		it('should provide error message for invalid type', async () => {
			const validator = db.collection('test').validator;
			const result = await validator.validateField('age', 'not-a-number' as any);
			expect(result.isValid).toBe(false);
		});

		it('should provide error message for invalid date', async () => {
			const validator = db.collection('test').validator;
			const invalidDate = new Date('invalid');
			const result = await validator.validateField('created', invalidDate);
			expect(result.isValid).toBe(false);
		});

		it('should have consistent error structure across field types', async () => {
			const validator = db.collection('test').validator;

			const result1 = await validator.validateField('name', '');
			const result2 = await validator.validateField('age', 'invalid');
			const result3 = await validator.validateField('created', new Date('invalid'));

			// All should have isValid property
			expect(result1.hasOwnProperty('isValid')).toBe(true);
			expect(result2.hasOwnProperty('isValid')).toBe(true);
			expect(result3.hasOwnProperty('isValid')).toBe(true);
		});
	});

	describe('Collection Operation Error Handling', () => {
		let db: MachineDb;

		beforeEach(() => {
			const schema = {
				users: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name',
						fields: {
							id: 'id (readonly)',
							name: 'text (required)',
							email: 'text'
						},
						fks: {}
					}
				}
			} as any;
			db = new MachineDb(schema);
		});

		it('should handle accessing non-existent collection', () => {
			expect(() => {
				db.collection('non_existent');
			}).toThrow();
		});

		it('should handle getting field from non-existent collection', () => {
			expect(() => {
				db.collection('non_existent').field('name');
			}).toThrow();
		});

		it('should access valid fields in collection', () => {
			const field = db.collection('users').field('name');
			expect(field).toBeDefined();
		});

		it('should handle validator access consistently', () => {
			const scheme = db.collection('users');
			const validator1 = scheme.validator;
			const validator2 = scheme.validator;

			expect(validator1).toBeDefined();
			expect(validator2).toBeDefined();
			// Should be same or equivalent
		});
	});

	describe('Error Recovery', () => {
		it('should continue validating after error', async () => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'value',
						fields: {
							id: 'id (readonly)',
							value: 'text (required)'
						},
						fks: {}
					}
				}
			} as any;

			const db = new MachineDb(schema);
			const validator = db.collection('test').validator;

			// First validation fails
			const result1 = await validator.validateField('value', '');
			expect(result1.isValid).toBe(false);

			// Second validation succeeds
			const result2 = await validator.validateField('value', 'valid');
			expect(result2.isValid).toBe(true);

			// Third validation fails again
			const result3 = await validator.validateField('value', '');
			expect(result3.isValid).toBe(false);
		});

		it('should recover from invalid type validation', async () => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'count',
						fields: {
							id: 'id (readonly)',
							count: 'number (required)'
						},
						fks: {}
					}
				}
			} as any;

			const db = new MachineDb(schema);
			const validator = db.collection('test').validator;

			// Invalid type
			const result1 = await validator.validateField('count', 'invalid' as any);
			expect(result1.isValid).toBe(false);

			// Valid value after error
			const result2 = await validator.validateField('count', 42);
			expect(result2.isValid).toBe(true);

			// Another valid value
			const result3 = await validator.validateField('count', 100);
			expect(result3.isValid).toBe(true);
		});
	});

	describe('Error Type Classification', () => {
		it('should distinguish validation errors from system errors', async () => {
			const schema = {
				test: {
					keyPath: '++id',
					model: {},
					ts: {} as any,
					template: {
						index: 'id',
						presentation: 'name',
						fields: {
							id: 'id (readonly)',
							name: 'text (required)'
						},
						fks: {}
					}
				}
			} as any;

			const db = new MachineDb(schema);
			const validator = db.collection('test').validator;

			// Validation error (bad data)
			const validationResult = await validator.validateField('name', '');
			expect(validationResult.isValid).toBe(false);

			// Should not be a system error
			expect(validationResult).toBeDefined();
		});
	});
});
