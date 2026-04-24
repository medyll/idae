import { MachineApiError, NetworkError } from './errors.js';
import type { AppScheme, HealthResponse, SchemesResponse } from './types.js';

/**
 * MachineApi client options
 */
export interface MachineApiOptions {
	/** Base URL for the API */
	baseUrl: string;
	/** Request timeout in milliseconds (default: 10000) */
	timeout?: number;
	/** Number of retries on failure (default: 3) */
	retries?: number;
	/** Cache TTL in milliseconds (default: 300000 = 5 minutes) */
	cacheTtl?: number;
}

/**
 * Cache entry
 */
interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

/**
 * MachineApi client for interacting with idae-machine server
 */
export class MachineApi {
	private baseUrl: string;
	private timeout: number;
	private retries: number;
	private cacheTtl: number;
	private cache: Map<string, CacheEntry<unknown>> = new Map();

	constructor(options: MachineApiOptions) {
		this.baseUrl = options.baseUrl.replace(/\/$/, ''); // Remove trailing slash
		this.timeout = options.timeout ?? 10000;
		this.retries = options.retries ?? 3;
		this.cacheTtl = options.cacheTtl ?? 300000; // 5 minutes
	}

	/**
	 * Make an HTTP request with retry logic
	 */
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		let lastError: Error | undefined;

		for (let attempt = 0; attempt < this.retries; attempt++) {
			try {
				const response = await fetch(url, {
					...options,
					signal: controller.signal,
					headers: {
						'Content-Type': 'application/json',
						...options.headers
					}
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					throw new MachineApiError(
						`HTTP ${response.status}: ${response.statusText}`,
						response.status,
						response
					);
				}

				return (await response.json()) as T;
			} catch (error) {
				lastError = error as Error;

				// Don't retry on 4xx errors (client errors)
				if (error instanceof MachineApiError && error.statusCode >= 400 && error.statusCode < 500) {
					throw error;
				}

				// Wait before retry (exponential backoff)
				if (attempt < this.retries - 1) {
					await this.delay(Math.pow(2, attempt) * 1000);
				}
			}
		}

		clearTimeout(timeoutId);

		// All retries exhausted
		if (lastError instanceof MachineApiError) {
			throw lastError;
		}
		throw new NetworkError(`Network error after ${this.retries} attempts: ${lastError?.message}`);
	}

	/**
	 * Delay helper
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Get cached data or fetch
	 */
	private async getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
		const cached = this.cache.get(key);
		const now = Date.now();

		if (cached && now - cached.timestamp < this.cacheTtl) {
			return cached.data as T;
		}

		const data = await fetcher();
		this.cache.set(key, { data, timestamp: now });
		return data;
	}

	/**
	 * Clear cache
	 */
	clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Check server health
	 */
	async health(): Promise<HealthResponse> {
		return this.request<HealthResponse>('/health');
	}

	/**
	 * Fetch all schemes
	 */
	async fetchAllSchemes(): Promise<AppScheme[]> {
		return this.getCached('all-schemes', async () => {
			const response = await this.request<SchemesResponse>('/api/scheme');
			return response.schemes;
		});
	}

	/**
	 * Fetch single scheme by table code
	 */
	async fetchScheme(table: string): Promise<AppScheme> {
		return this.getCached(`scheme-${table}`, async () => {
			return this.request<AppScheme>(`/api/scheme/${encodeURIComponent(table)}`);
		});
	}

	/**
	 * Invalidate scheme cache
	 */
	invalidateSchemeCache(table?: string): void {
		if (table) {
			this.cache.delete(`scheme-${table}`);
		} else {
			// Clear all scheme-related cache entries
			for (const key of this.cache.keys()) {
				if (key.startsWith('scheme-') || key === 'all-schemes') {
					this.cache.delete(key);
				}
			}
		}
	}
}

/**
 * Create a MachineApi instance
 */
export function createMachineApi(options: MachineApiOptions): MachineApi {
	return new MachineApi(options);
}
