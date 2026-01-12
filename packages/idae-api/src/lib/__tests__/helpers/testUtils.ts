/**
 * Test Utilities & Helpers
 * Common patterns and utilities for consistent testing
 */

import { vi } from 'vitest';
import jwt from 'jsonwebtoken';

/**
 * Generate a mock JWT token for testing
 */
export function generateMockToken(payload: any = {}, secret: string = 'test-secret', expiresIn: string = '1h') {
	return jwt.sign(
		{
			username: 'testuser',
			role: 'user',
			...payload
		},
		secret,
		{ expiresIn }
	);
}

/**
 * Create a mock Express Request object
 */
export function createMockRequest(overrides: any = {}) {
	return {
		headers: {},
		params: {},
		query: {},
		body: {},
		user: { username: 'testuser', role: 'user' },
		idaeDb: undefined,
		dbName: 'testdb',
		collectionName: 'users',
		connectedCollection: undefined,
		...overrides
	};
}

/**
 * Create a mock Express Response object
 */
export function createMockResponse() {
	let statusCode = 200;
	let responseData: any;
	const headers = new Map<string, string>();

	return {
		status: (code: number) => {
			statusCode = code;
			return {
				json: (data: any) => {
					responseData = data;
					return {};
				},
				send: (data: any) => {
					responseData = data;
					return {};
				}
			};
		},
		json: (data: any) => {
			responseData = data;
			return {};
		},
		send: (data: any) => {
			responseData = data;
			return {};
		},
		setHeader: (key: string, value: string) => {
			headers.set(key, value);
			return {};
		},
		getHeader: (key: string) => headers.get(key),
		getStatusCode: () => statusCode,
		getResponseData: () => responseData,
		statusCode,
		responseData,
		headers
	};
}

/**
 * Create a mock NextFunction
 */
export function createMockNextFunction() {
	return vi.fn((err?: any) => {
		if (err) throw err;
	});
}

/**
 * Create a complete mock middleware context
 */
export function createMockMiddlewareContext(overrides: any = {}) {
	return {
		req: createMockRequest(overrides.req),
		res: createMockResponse(),
		next: createMockNextFunction()
	};
}

/**
 * Wait for async operations to complete
 */
export async function waitFor(condition: () => boolean, timeout: number = 1000) {
	const start = Date.now();
	while (!condition()) {
		if (Date.now() - start > timeout) {
			throw new Error('Timeout waiting for condition');
		}
		await new Promise(resolve => setTimeout(resolve, 10));
	}
}

/**
 * Create a mock IdaeDb collection adapter
 */
export function createMockCollection(defaultData: any[] = []) {
	return {
		find: vi.fn(async (filter?: any) => {
			return defaultData.filter(item => {
				if (!filter) return true;
				for (const key in filter) {
					if (item[key] !== filter[key]) return false;
				}
				return true;
			});
		}),
		findById: vi.fn(async (id: string) => {
			return defaultData.find((item: any) => item.id === id) || null;
		}),
		findAll: vi.fn(async () => defaultData),
		create: vi.fn(async (data: any) => {
			const newItem = { id: String(defaultData.length + 1), ...data };
			defaultData.push(newItem);
			return newItem;
		}),
		update: vi.fn(async (id: string, data: any) => {
			const item = defaultData.find((item: any) => item.id === id);
			if (item) {
				Object.assign(item, data);
				return item;
			}
			return null;
		}),
		deleteById: vi.fn(async (id: string) => {
			const index = defaultData.findIndex((item: any) => item.id === id);
			if (index > -1) {
				defaultData.splice(index, 1);
			}
		}),
		deleteWhere: vi.fn(async (filter: any) => {
			const before = defaultData.length;
			// Simple filter implementation
			for (const key in filter) {
				const newData = defaultData.filter((item: any) => item[key] !== filter[key]);
				defaultData.length = 0;
				defaultData.push(...newData);
			}
			return before - defaultData.length;
		})
	};
}

/**
 * Create a mock IdaeDb database adapter
 */
export function createMockIdaeDb(collections: Record<string, any> = {}) {
	return {
		init: vi.fn(async (uri: string, options: any) => {
			return {
				db: vi.fn(async (dbName: string) => {
					return {
						collection: vi.fn((collectionName: string) => {
							return collections[collectionName] || createMockCollection();
						})
					};
				})
			};
		}),
		collection: vi.fn((collectionName: string) => {
			return collections[collectionName] || createMockCollection();
		})
	};
}

/**
 * Create a mock HTTP fetch response
 */
export function createMockFetchResponse(data: any = {}, options: any = {}) {
	return Promise.resolve({
		ok: options.ok !== false,
		status: options.status || 200,
		headers: new Map(options.headers || []),
		json: async () => data,
		text: async () => JSON.stringify(data),
		blob: async () => new Blob([JSON.stringify(data)]),
		clone: () => createMockFetchResponse(data, options)
	});
}

/**
 * Assert that a middleware was called with specific arguments
 */
export function assertMiddlewareCalled(middleware: any, argIndex: number, expected: any) {
	const call = middleware.mock.calls[0];
	if (!call) {
		throw new Error('Middleware was not called');
	}
	const actual = call[argIndex];
	if (typeof expected === 'object') {
		if (!Object.keys(expected).every(key => actual[key] === expected[key])) {
			throw new Error(`Middleware argument ${argIndex} does not match expected`);
		}
	} else if (actual !== expected) {
		throw new Error(`Middleware argument ${argIndex} does not match expected`);
	}
}

/**
 * Mock an external module
 */
export function mockModule(moduleName: string, implementation: any) {
	return vi.mock(moduleName, () => implementation);
}

/**
 * Restore all mocks
 */
export function resetAllMocks() {
	vi.clearAllMocks();
	vi.resetAllMocks();
	vi.restoreAllMocks();
}

/**
 * Create a test database URI
 */
export function createTestDatabaseUri(dbType: string = 'mongodb', dbName: string = 'testdb') {
	if (dbType === 'mongodb') {
		return `mongodb://localhost:27017/${dbName}`;
	} else if (dbType === 'mysql') {
		return `mysql://localhost:3306/${dbName}`;
	}
	return `${dbType}://localhost/${dbName}`;
}

/**
 * Extract bearer token from Authorization header
 */
export function extractBearerToken(authHeader?: string) {
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}
	return authHeader.substring(7);
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string) {
	const parts = token.split('.');
	return parts.length === 3;
}

/**
 * Create assertion helpers for common patterns
 */
export const testAssertions = {
	/**
	 * Assert middleware sets status code
	 */
	statusCode: (res: any, expectedCode: number) => {
		if (res.statusCode !== expectedCode && res.status) {
			// Response might be from mock with chained methods
			throw new Error(`Expected status ${expectedCode}, got ${res.statusCode}`);
		}
	},

	/**
	 * Assert middleware sets Authorization header
	 */
	hasAuthHeader: (req: any) => {
		if (!req.headers?.authorization) {
			throw new Error('Authorization header not set');
		}
	},

	/**
	 * Assert response has error
	 */
	hasError: (res: any) => {
		if (!res.responseData?.error) {
			throw new Error('Response does not contain error');
		}
	},

	/**
	 * Assert response has success data
	 */
	hasData: (res: any) => {
		if (!res.responseData) {
			throw new Error('Response does not contain data');
		}
	}
};

/**
 * Performance testing helper
 */
export async function measurePerformance(fn: () => Promise<any>, iterations: number = 100) {
	const times: number[] = [];

	for (let i = 0; i < iterations; i++) {
		const start = performance.now();
		await fn();
		const end = performance.now();
		times.push(end - start);
	}

	return {
		average: times.reduce((a, b) => a + b) / times.length,
		min: Math.min(...times),
		max: Math.max(...times),
		times
	};
}

/**
 * Test data sanitizer - remove sensitive info before assertions
 */
export function sanitizeForAssertion(data: any, keysToRemove: string[] = ['password', 'token', 'secret']) {
	if (typeof data !== 'object' || data === null) {
		return data;
	}

	const sanitized = Array.isArray(data) ? [...data] : { ...data };

	const remove = (obj: any) => {
		for (const key in obj) {
			if (keysToRemove.includes(key)) {
				delete obj[key];
			} else if (typeof obj[key] === 'object') {
				remove(obj[key]);
			}
		}
	};

	remove(sanitized);
	return sanitized;
}
