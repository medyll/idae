// src/tests/ApiServer.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiServer } from '$lib/apiServer';

// Mock express
const mockApp = {
	use: vi.fn(),
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	delete: vi.fn(),
	all: vi.fn(),
	listen: vi.fn()
};

vi.mock('express', () => ({
	default: vi.fn(() => mockApp),
	json: vi.fn(),
	urlencoded: vi.fn()
}));

vi.mock('$lib/middleware/databaseMiddleware', () => ({
	connectToDatabase: vi.fn((req, res, next) => next())
}));

vi.mock('$lib/engine/DBaseService', () => ({
	DBaseService: class {
		findAll = vi.fn();
		findById = vi.fn();
		create = vi.fn();
		update = vi.fn();
		deleteById = vi.fn();
		deleteManyByQuery = vi.fn();
	}
}));

describe('ApiServer', () => {
	let server: ApiServer;

	beforeEach(() => {
		vi.clearAllMocks();
		server = new ApiServer({ port: 3000 });
	});

	it('should initialize with default routes', () => {
		expect(mockApp.get).toHaveBeenCalledTimes(2); // For '/:collectionName' and '/:collectionName/:id'
		expect(mockApp.post).toHaveBeenCalledTimes(1);
		expect(mockApp.put).toHaveBeenCalledTimes(1);
		expect(mockApp.delete).toHaveBeenCalledTimes(2);
		expect(mockApp.all).toHaveBeenCalledTimes(1); // For command routes
	});

	it('should add a new route', () => {
		server.router.addRoute({
			method: 'get',
			path: '/test',
			handler: async () => ({ message: 'test' })
		});

		expect(mockApp.get).toHaveBeenCalledWith('/test', expect.any(Function));
	});

	it('should add multiple routes', () => {
		server.router.addRoutes([
			{ method: 'get', path: '/test1', handler: async () => ({ message: 'test1' }) },
			{ method: 'get', path: '/test2', handler: async () => ({ message: 'test2' }) }
		]);

		expect(mockApp.get).toHaveBeenCalledWith('/test1', expect.any(Function));
		expect(mockApp.get).toHaveBeenCalledWith('/test2', expect.any(Function));
	});

	it('should start the server', () => {
		server.start();
		expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
	});
});
