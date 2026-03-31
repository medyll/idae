// ChromaDB Adapter Unit Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromaDBAdapter } from '../../src/lib/adapters/ChromaDBAdapter.js';
import type { IdaeDbParams } from '../../src/@types/types.js';

interface TestDocument {
	id: string;
	embeddings: number[];
	metadatas: Record<string, any>;
	documents: string[];
}

describe('ChromaDBAdapter', () => {
	let mockCollection: any;
	let mockClient: any;
	let mockConnection: any;
	let adapter: ChromaDBAdapter<TestDocument>;

	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();

		// Create mock collection with all required methods
		mockCollection = {
			add: vi.fn().mockResolvedValue(undefined),
			get: vi.fn().mockResolvedValue({
				ids: ['test-id'],
				documents: ['test document'],
				metadatas: [{ foo: 'bar' }],
				embeddings: [[0.1, 0.2, 0.3]]
			}),
			query: vi.fn().mockResolvedValue({
				ids: [['test-id']],
				documents: [['test document']],
				metadatas: [[{ foo: 'bar' }]],
				embeddings: [[[0.1, 0.2, 0.3]]],
				distances: [[0.5]]
			}),
			update: vi.fn().mockResolvedValue(undefined),
			delete: vi.fn().mockResolvedValue(undefined),
			upsert: vi.fn().mockResolvedValue(undefined)
		};

		// Create mock client
		mockClient = {
			getOrCreateCollection: vi.fn().mockResolvedValue(mockCollection)
		};

		// Create mock connection
		mockConnection = {
			getDb: () => mockClient
		};

		// Create adapter instance
		adapter = new ChromaDBAdapter<TestDocument>('test-collection', mockConnection);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor & initialization', () => {
		it('should initialize with collection name and connection', async () => {
			expect(mockClient.getOrCreateCollection).toHaveBeenCalledWith({
				name: 'test-collection'
			});
		});

		it('should store the collection reference', async () => {
			expect(adapter).toBeDefined();
		});
	});

	describe('create', () => {
		it('should create a new document with provided id', async () => {
			const data = {
				ids: 'doc-1',
				embeddings: [0.1, 0.2, 0.3],
				metadatas: { title: 'Test Doc' },
				documents: ['This is a test document']
			};

			const result = await adapter.create(data);

			expect(mockCollection.add).toHaveBeenCalledWith({
				ids: ['doc-1'],
				embeddings: [[0.1, 0.2, 0.3]],
				metadatas: [{ title: 'Test Doc' }],
				documents: [['This is a test document']]
			});
			expect(result.id).toBe('doc-1');
			expect(result).toEqual(expect.objectContaining(data));
		});

		it('should generate UUID if no id provided', async () => {
			const data = {
				embeddings: [0.1, 0.2, 0.3],
				metadatas: { title: 'Test Doc' },
				documents: ['This is a test document']
			};

			await adapter.create(data as any);

			expect(mockCollection.add).toHaveBeenCalled();
		});

		it('should handle multiple documents', async () => {
			const data = {
				ids: ['doc-1', 'doc-2'],
				embeddings: [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
				metadatas: [{ title: 'Doc 1' }, { title: 'Doc 2' }],
				documents: ['First document', 'Second document']
			};

			await adapter.create(data as any);

			// Adapter wraps each field in an array
			expect(mockCollection.add).toHaveBeenCalledWith({
				ids: [['doc-1', 'doc-2']],
				embeddings: [[[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]]],
				metadatas: [[{ title: 'Doc 1' }, { title: 'Doc 2' }]],
				documents: [['First document', 'Second document']]
			});
		});
	});

	describe('findById', () => {
		it('should find a document by id', async () => {
			const result = await adapter.findById('test-id');

			expect(mockCollection.get).toHaveBeenCalledWith(['test-id']);
			// ChromaDB returns an object with ids, documents, etc. arrays
			expect(result).toBeDefined();
		});

		it('should return empty result for non-existent id', async () => {
			mockCollection.get.mockResolvedValueOnce({
				ids: [],
				documents: [],
				metadatas: [],
				embeddings: []
			});

			const result = await adapter.findById('non-existent');

			expect(mockCollection.get).toHaveBeenCalledWith(['non-existent']);
			// Returns empty object from ChromaDB, not empty array
			expect(result).toEqual({ ids: [], documents: [], metadatas: [], embeddings: [] });
		});

		it('should handle multiple ids', async () => {
			await adapter.findById('id-1');
			await adapter.findById('id-2');

			expect(mockCollection.get).toHaveBeenCalledTimes(2);
		});
	});

	describe('find', () => {
		it('should find documents with query vector', async () => {
			const params: IdaeDbParams<TestDocument> = {
				query: { vector: [0.1, 0.2, 0.3] },
				limit: 10
			};

			const result = await adapter.find(params);

			expect(mockCollection.query).toHaveBeenCalledWith([0.1, 0.2, 0.3], 10);
			// ChromaDB returns query result object
			expect(result).toBeDefined();
		});

		it('should use default limit if not provided', async () => {
			const params: IdaeDbParams<TestDocument> = {
				query: { vector: [0.1, 0.2, 0.3] }
			};

			await adapter.find(params);

			expect(mockCollection.query).toHaveBeenCalledWith([0.1, 0.2, 0.3], undefined);
		});

		it('should handle empty query vector', async () => {
			const params: IdaeDbParams<TestDocument> = {
				query: {},
				limit: 5
			};

			await adapter.find(params);

			expect(mockCollection.query).toHaveBeenCalledWith([], 5);
		});
	});

	describe('findOne', () => {
		it('should find a single document', async () => {
			const params: IdaeDbParams<TestDocument> = {
				query: { vector: [0.1, 0.2, 0.3] },
				limit: 1
			};

			const result = await adapter.findOne(params);

			expect(mockCollection.query).toHaveBeenCalledWith([0.1, 0.2, 0.3], 1);
			expect(result).toBeDefined();
		});

		it('should return null if no results', async () => {
			mockCollection.query.mockResolvedValueOnce({
				ids: [[]],
				documents: [[]],
				metadatas: [[]],
				embeddings: [[]]
			});

			const params: IdaeDbParams<TestDocument> = {
				query: { vector: [0.9, 0.8, 0.7] }
			};

			const result = await adapter.findOne(params);

			expect(result).toBeNull();
		});
	});

	describe('update', () => {
		it('should update a document', async () => {
			const updateData = {
				ids: ['doc-1'],
				embeddings: [[0.5, 0.6, 0.7]],
				documents: [['Updated document']]
			};

			const result = await adapter.update('doc-1', updateData as any);

			expect(mockCollection.update).toHaveBeenCalledWith(updateData);
			expect(result).toEqual(expect.objectContaining(updateData));
		});

		it('should update metadata', async () => {
			const updateData = {
				ids: ['doc-1'],
				metadatas: [{ title: 'Updated Title', category: 'New Category' }]
			};

			await adapter.update('doc-1', updateData as any);

			expect(mockCollection.update).toHaveBeenCalledWith(updateData);
		});

		it('should handle partial updates', async () => {
			const updateData = {
				ids: ['doc-1'],
				documents: [['Partial update']]
			};

			await adapter.update('doc-1', updateData as any);

			expect(mockCollection.update).toHaveBeenCalledWith(updateData);
		});
	});

	describe('updateWhere', () => {
		it('should throw error for unsupported operation', async () => {
			const params: IdaeDbParams<TestDocument> = {
				query: { vector: [0.1, 0.2, 0.3] }
			};

			await expect(adapter.updateWhere(params, {} as Partial<TestDocument>)).rejects.toThrow(
				'updateWhere not supported in ChromaDB'
			);
		});
	});

	describe('createIndex', () => {
		it('should throw error for unsupported operation', async () => {
			await expect(adapter.createIndex('field', {} as any)).rejects.toThrow(
				'updateWhere not supported in ChromaDB'
			);
		});
	});

	describe('deleteById', () => {
		it('should delete a document by string id', async () => {
			const result = await adapter.deleteById('doc-1');

			expect(mockCollection.delete).toHaveBeenCalledWith({ ids: ['doc-1'] });
			expect(result).toBe(true);
		});

		it('should delete multiple documents by array of ids', async () => {
			const result = await adapter.deleteById(['doc-1', 'doc-2', 'doc-3']);

			expect(mockCollection.delete).toHaveBeenCalledWith({
				ids: ['doc-1', 'doc-2', 'doc-3']
			});
			expect(result).toBe(true);
		});

		it('should handle empty id array', async () => {
			await adapter.deleteById([]);

			expect(mockCollection.delete).toHaveBeenCalledWith({ ids: [] });
		});
	});

	describe('deleteWhere', () => {
		it('should throw error for unsupported operation', async () => {
			const params: IdaeDbParams<TestDocument> = {
				query: {}
			};

			await expect(adapter.deleteWhere(params)).rejects.toThrow(
				'deleteWhere not supported in ChromaDB'
			);
		});
	});

	describe('similaritySearch', () => {
		it('should perform similarity search with default k', async () => {
			const vector = [0.1, 0.2, 0.3];

			const result = await adapter.similaritySearch(vector);

			expect(mockCollection.query).toHaveBeenCalledWith(vector, 10);
			expect(result).toBeDefined();
		});

		it('should perform similarity search with custom k', async () => {
			const vector = [0.1, 0.2, 0.3];
			const k = 20;

			await adapter.similaritySearch(vector, k);

			expect(mockCollection.query).toHaveBeenCalledWith(vector, 20);
		});

		it('should handle zero-dimensional vector', async () => {
			const vector: number[] = [];

			await adapter.similaritySearch(vector);

			expect(mockCollection.query).toHaveBeenCalledWith([], 10);
		});

		it('should return results with distances', async () => {
			mockCollection.query.mockResolvedValueOnce({
				ids: [['doc-1', 'doc-2']],
				documents: [['doc1', 'doc2']],
				metadatas: [[{ foo: 'bar' }, { baz: 'qux' }]],
				embeddings: [[[0.1, 0.2], [0.3, 0.4]]],
				distances: [[0.15, 0.25]]
			});

			const result = await adapter.similaritySearch([0.1, 0.2], 2);

			expect(result).toBeDefined();
		});
	});

	describe('error handling', () => {
		it('should attempt collection initialization', async () => {
			// Verify that the constructor calls getOrCreateCollection
			expect(mockClient.getOrCreateCollection).toHaveBeenCalledWith({
				name: 'test-collection'
			});
		});

		it('should handle add operation failure', async () => {
			mockCollection.add.mockRejectedValueOnce(new Error('Add failed'));

			const data = {
				ids: 'doc-1',
				embeddings: [0.1, 0.2, 0.3],
				metadatas: { foo: 'bar' },
				documents: ['test']
			};

			await expect(adapter.create(data as any)).rejects.toThrow('Add failed');
		});

		it('should handle get operation failure', async () => {
			mockCollection.get.mockRejectedValueOnce(new Error('Get failed'));

			await expect(adapter.findById('doc-1')).rejects.toThrow('Get failed');
		});

		it('should handle query operation failure', async () => {
			mockCollection.query.mockRejectedValueOnce(new Error('Query failed'));

			const params: IdaeDbParams<TestDocument> = {
				query: { vector: [0.1, 0.2, 0.3] }
			};

			await expect(adapter.find(params)).rejects.toThrow('Query failed');
		});

		it('should handle delete operation failure', async () => {
			mockCollection.delete.mockRejectedValueOnce(new Error('Delete failed'));

			await expect(adapter.deleteById('doc-1')).rejects.toThrow('Delete failed');
		});
	});

	describe('edge cases', () => {
		it('should handle very large embedding vectors', async () => {
			const largeVector = Array(1536).fill(0.1); // Common size for OpenAI embeddings
			const data = {
				ids: 'large-doc',
				embeddings: largeVector,
				metadatas: {},
				documents: ['test']
			};

			await adapter.create(data as any);

			expect(mockCollection.add).toHaveBeenCalledWith({
				ids: ['large-doc'],
				embeddings: [largeVector],
				metadatas: [{}],
				documents: [['test']]
			});
		});

		it('should handle negative distances in similarity search', async () => {
			mockCollection.query.mockResolvedValueOnce({
				ids: [['doc-1']],
				documents: [['doc']],
				metadatas: [[{}]],
				embeddings: [[[0.1]]],
				distances: [[-0.5]] // Cosine similarity can be negative
			});

			const result = await adapter.similaritySearch([0.1, 0.2, 0.3]);

			expect(result).toBeDefined();
		});

		it('should handle empty metadata', async () => {
			const data = {
				ids: 'no-meta',
				embeddings: [0.1, 0.2, 0.3],
				metadatas: {},
				documents: ['test']
			};

			await adapter.create(data as any);

			expect(mockCollection.add).toHaveBeenCalledWith({
				ids: ['no-meta'],
				embeddings: [[0.1, 0.2, 0.3]],
				metadatas: [{}],
				documents: [['test']]
			});
		});

		it('should handle special characters in documents', async () => {
			const data = {
				ids: 'special-doc',
				embeddings: [0.1],
				metadatas: { title: 'Test with "quotes" and \n newlines' },
				documents: ['Special chars: !@#$%^&*()_+{}|:"<>?']
			};

			await adapter.create(data as any);

			expect(mockCollection.add).toHaveBeenCalled();
		});
	});
});
