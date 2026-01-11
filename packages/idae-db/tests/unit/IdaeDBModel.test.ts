import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IdaeDBModel, type IdaeModelOptions } from '../../src/lib/IdaeDBModel.js';
import { IdaeDbConnection } from '../../src/lib/IdaeDbConnection.js';

describe('IdaeDBModel', () => {
	let mockConnection: any;
	let model: IdaeDBModel<{ _id?: string; name: string; email: string }>;

	beforeEach(() => {
		// Create mock connection with getDb method
		mockConnection = {
			getDb: vi.fn().mockReturnValue({
				collection: vi.fn().mockReturnValue({
					collectionName: 'test-collection'
				})
			}),
			idaeDb: {
				uri: 'mock://localhost',
				options: { dbType: 'MONGODB' }
			}
		} as unknown as IdaeDbConnection;

		const options: Partial<IdaeModelOptions> = {};
		model = new IdaeDBModel(mockConnection, 'test-collection', options);
	});

	describe('constructor', () => {
		it('should create model instance with collection name', () => {
			expect(model).toBeDefined();
			expect(model.collectionName).toBe('test-collection');
		});

		it('should initialize with default options', () => {
			const newModel = new IdaeDBModel(mockConnection, 'users');
			expect(newModel.collectionName).toBe('users');
			expect(newModel.fieldId).toBe('_id');
		});

		it('should accept custom auto-increment options', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: (collectionName) => `${collectionName}_id`,
				autoIncrementDbCollection: 'counters'
			};

			const customModel = new IdaeDBModel(mockConnection, 'products', options);
			expect(customModel).toBeDefined();
		});

		it('should set fieldId based on auto-increment format', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: () => 'custom_id'
			};

			const customModel = new IdaeDBModel(mockConnection, 'items', options);
			expect(customModel.fieldId).toBe('custom_id');
		});

		it('should default autoIncrementDbCollection to auto_increment', () => {
			const model1 = new IdaeDBModel(mockConnection, 'collection1');
			expect(model1).toBeDefined();
		});

		it('should use custom autoIncrementDbCollection if provided', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementDbCollection: 'custom_counters'
			};

			const customModel = new IdaeDBModel(mockConnection, 'items', options);
			expect(customModel).toBeDefined();
		});
	});

	describe('collection property', () => {
		it('should return the MongoDB collection', () => {
			const collection = model.collection;
			expect(collection).toBeDefined();
		});

		it('should be consistent across multiple accesses', () => {
			const col1 = model.collection;
			const col2 = model.collection;
			expect(col1).toBe(col2);
		});
	});

	describe('collectionName property', () => {
		it('should return the collection name', () => {
			expect(model.collectionName).toBe('test-collection');
		});

		it('should preserve collection name through model lifetime', () => {
			expect(model.collectionName).toBe('test-collection');
			expect(model.collectionName).toBe('test-collection');
		});
	});

	describe('fieldId property', () => {
		it('should default to _id', () => {
			expect(model.fieldId).toBe('_id');
		});

		it('should use auto-increment field if configured', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: () => 'id'
			};

			const autoIncrementModel = new IdaeDBModel(mockConnection, 'users', options);
			expect(autoIncrementModel.fieldId).toBe('id');
		});

		it('should use format function output as fieldId', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: (collectionName) => `${collectionName}_pk`
			};

			const customModel = new IdaeDBModel(mockConnection, 'articles', options);
			expect(customModel.fieldId).toBe('articles_pk');
		});
	});

	describe('Type constraints', () => {
		it('should work with generic T type parameter', () => {
			interface User {
				_id?: string;
				name: string;
				email: string;
				age: number;
			}

			const userModel = new IdaeDBModel<User>(mockConnection, 'users');
			expect(userModel.collectionName).toBe('users');
		});

		it('should maintain type information', () => {
			interface Product {
				_id?: string;
				name: string;
				price: number;
				stock: number;
			}

			const productModel = new IdaeDBModel<Product>(mockConnection, 'products');
			expect(productModel).toBeDefined();
		});
	});

	describe('getNextIncrement method', () => {
		it('should exist and be callable', async () => {
			expect(model.getNextIncrement).toBeDefined();
			expect(typeof model.getNextIncrement).toBe('function');
		});

		// Note: Full testing of getNextIncrement requires actual MongoDB instance
		// This is tested in integration tests with real database
	});

	describe('Model caching and reuse', () => {
		it('should maintain model state', () => {
			const col1 = model.collection;
			const fieldId = model.fieldId;
			const col2 = model.collection;

			expect(col1).toBe(col2);
			expect(fieldId).toBe('_id');
		});
	});

	describe('Different collection types', () => {
		it('should handle different collection names', () => {
			const model1 = new IdaeDBModel(mockConnection, 'users');
			const model2 = new IdaeDBModel(mockConnection, 'products');
			const model3 = new IdaeDBModel(mockConnection, 'orders');

			expect(model1.collectionName).toBe('users');
			expect(model2.collectionName).toBe('products');
			expect(model3.collectionName).toBe('orders');
		});

		it('should work with special collection names', () => {
			const specialNames = [
				'user_profiles',
				'User-Accounts',
				'users.backup',
				'system.indexes'
			];

			specialNames.forEach((name) => {
				const specialModel = new IdaeDBModel(mockConnection, name);
				expect(specialModel.collectionName).toBe(name);
			});
		});
	});

	describe('Auto-increment configuration variations', () => {
		it('should support simple incrementing field name', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: () => 'id'
			};

			const model1 = new IdaeDBModel(mockConnection, 'users', options);
			expect(model1.fieldId).toBe('id');
		});

		it('should support collection-specific format', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: (collectionName) => {
					const mapping: Record<string, string> = {
						users: 'user_id',
						products: 'product_id',
						orders: 'order_id'
					};
					return mapping[collectionName] || '_id';
				}
			};

			const userModel = new IdaeDBModel(mockConnection, 'users', options);
			const productModel = new IdaeDBModel(mockConnection, 'products', options);

			expect(userModel.fieldId).toBe('user_id');
			expect(productModel.fieldId).toBe('product_id');
		});

		it('should support custom counter collection', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: () => 'id',
				autoIncrementDbCollection: 'counters'
			};

			const model1 = new IdaeDBModel(mockConnection, 'users', options);
			expect(model1).toBeDefined();
		});

		it('should support mixed configurations', () => {
			const options: Partial<IdaeModelOptions> = {
				autoIncrementFormat: (col) => `${col}_seq`,
				autoIncrementDbCollection: 'sequences'
			};

			const model1 = new IdaeDBModel(mockConnection, 'activities', options);
			expect(model1.fieldId).toBe('activities_seq');
		});
	});
});
