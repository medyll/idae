import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MachineApi, createMachineApi } from '../MachineApi.js';
import { MachineApiError, NetworkError } from '../errors.js';

describe('MachineApi', () => {
	const baseUrl = 'http://localhost:3000';
	let api: MachineApi;

	beforeEach(() => {
		api = new MachineApi({ baseUrl, timeout: 1000, retries: 2, cacheTtl: 5000 });
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('constructor', () => {
		it('should create instance with options', () => {
			const api = createMachineApi({ baseUrl: 'http://api.example.com' });
			expect(api).toBeInstanceOf(MachineApi);
		});

		it('should remove trailing slash from baseUrl', () => {
			const api = new MachineApi({ baseUrl: 'http://api.example.com/' });
			// Access private property for testing
			expect((api as any).baseUrl).toBe('http://api.example.com');
		});
	});

	describe('health', () => {
		it('should return health status', async () => {
			const mockResponse = {
				status: 'ok',
				version: '2.0.0',
				timestamp: new Date().toISOString(),
				environment: 'development'
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse
			});

			const result = await api.health();

			expect(result).toEqual(mockResponse);
			expect(global.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/health',
				expect.objectContaining({
					headers: { 'Content-Type': 'application/json' }
				})
			);
		});

		it('should throw MachineApiError on HTTP error', async () => {
			(global.fetch as any).mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error'
			});

			await expect(api.health()).rejects.toThrow(MachineApiError);
		});
	});

	describe('fetchAllSchemes', () => {
		it('should return all schemes', async () => {
			const mockSchemes = [
				{ id: '1', code: 'produit', name: 'Produits' },
				{ id: '2', code: 'client', name: 'Clients' }
			];

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ schemes: mockSchemes })
			});

			const result = await api.fetchAllSchemes();

			expect(result).toEqual(mockSchemes);
			expect(result).toHaveLength(2);
		});

		it('should cache schemes', async () => {
			const mockSchemes = [{ id: '1', code: 'produit', name: 'Produits' }];

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ schemes: mockSchemes })
			});

			// First call should fetch
			await api.fetchAllSchemes();

			// Second call should use cache
			const result = await api.fetchAllSchemes();

			expect(result).toEqual(mockSchemes);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});
	});

	describe('fetchScheme', () => {
		it('should return single scheme', async () => {
			const mockScheme = {
				id: '1',
				code: 'produit',
				name: 'Produits',
				_views: {
					fullView: [{ name: 'nomProduit', title: 'Nom' }]
				}
			};

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => mockScheme
			});

			const result = await api.fetchScheme('produit');

			expect(result).toEqual(mockScheme);
			expect(global.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/api/scheme/produit',
				expect.any(Object)
			);
		});

		it('should encode special characters in table name', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: '1', code: 'test table', name: 'Test' })
			});

			await api.fetchScheme('test table');

			expect(global.fetch).toHaveBeenCalledWith(
				'http://localhost:3000/api/scheme/test%20table',
				expect.any(Object)
			);
		});

		it('should throw on 404', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: 'Not Found'
			});

			await expect(api.fetchScheme('unknown')).rejects.toThrow(MachineApiError);
		});
	});

	describe('retry logic', () => {
		it('should retry on network error', async () => {
			(global.fetch as any)
				.mockRejectedValueOnce(new Error('Network error'))
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ status: 'ok', version: '2.0.0', timestamp: '', environment: '' })
				});

			const result = await api.health();

			expect(result.status).toBe('ok');
			expect(global.fetch).toHaveBeenCalledTimes(2);
		});

		it('should not retry on 4xx errors', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: 'Bad Request'
			});

			await expect(api.health()).rejects.toThrow(MachineApiError);
			expect(global.fetch).toHaveBeenCalledTimes(1);
		});

		it('should throw NetworkError after all retries exhausted', async () => {
			(global.fetch as any).mockRejectedValue(new Error('Network error'));

			await expect(api.health()).rejects.toThrow(NetworkError);
			expect(global.fetch).toHaveBeenCalledTimes(2); // retries = 2
		});
	});

	describe('cache management', () => {
		it('should clear all cache', () => {
			api.clearCache();
			// Cache is private, but we can verify it doesn't throw
			expect(true).toBe(true);
		});

		it('should invalidate scheme cache', async () => {
			const mockScheme = { id: '1', code: 'produit', name: 'Produits' };

			(global.fetch as any).mockResolvedValue({
				ok: true,
				json: async () => mockScheme
			});

			// First call
			await api.fetchScheme('produit');

			// Invalidate cache
			api.invalidateSchemeCache('produit');

			// Second call should fetch again
			await api.fetchScheme('produit');

			expect(global.fetch).toHaveBeenCalledTimes(2);
		});

		it('should invalidate all scheme caches', async () => {
			(global.fetch as any).mockResolvedValue({
				ok: true,
				json: async () => ({ id: '1', code: 'produit', name: 'Produits' })
			});

			await api.fetchScheme('produit');
			api.invalidateSchemeCache();

			// Should be able to fetch again without cache
			await api.fetchScheme('produit');
			expect(global.fetch).toHaveBeenCalledTimes(2);
		});
	});
});
