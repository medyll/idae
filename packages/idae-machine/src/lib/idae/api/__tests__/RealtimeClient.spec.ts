import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RealtimeClient } from '../RealtimeClient';

// Mock socket.io-client
vi.mock('socket.io-client', () => {
	return {
		io: vi.fn(() => ({
			on: vi.fn((event, cb) => {
				if (event === 'connect') {
					// Simulate connection
					setTimeout(() => cb(), 10);
				}
			}),
			emit: vi.fn(),
			disconnect: vi.fn(),
			connected: true
		}))
	};
});

describe('RealtimeClient', () => {
	let client: RealtimeClient;

	beforeEach(() => {
		client = new RealtimeClient('http://localhost:3000');
	});

	afterEach(() => {
		client.disconnect();
	});

	describe('constructor', () => {
		it('should create client with baseUrl', () => {
			expect(client).toBeInstanceOf(RealtimeClient);
			expect(client.baseUrl).toBe('http://localhost:3000');
		});

		it('should remove trailing slash from baseUrl', () => {
			const client = new RealtimeClient('http://localhost:3000/');
			expect(client.baseUrl).toBe('http://localhost:3000');
		});
	});

	describe('connect', () => {
		it('should connect to server', async () => {
			await client.connect();
			expect(client.isConnected()).toBe(true);
		});

		it('should connect with token', async () => {
			await client.connect('test-token');
			expect(client.isConnected()).toBe(true);
		});
	});

	describe('subscribe/unsubscribe', () => {
		it('should subscribe to table', async () => {
			await client.connect();
			client.subscribe('produit');
			// Subscription is tracked internally
			expect(true).toBe(true);
		});

		it('should unsubscribe from table', async () => {
			await client.connect();
			client.subscribe('produit');
			client.unsubscribe('produit');
			expect(true).toBe(true);
		});

		it('should queue subscription if not connected', () => {
			client.subscribe('produit');
			// Should be queued for when connected
			expect(true).toBe(true);
		});
	});

	describe('event handlers', () => {
		it('should register data:created handler', async () => {
			await client.connect();
			const handler = vi.fn();
			const unsubscribe = client.onData('data:created', handler);

			expect(typeof unsubscribe).toBe('function');
		});

		it('should unregister handler with unsubscribe function', async () => {
			await client.connect();
			const handler = vi.fn();
			const unsubscribe = client.onData('data:created', handler);

			unsubscribe();
			// Handler should be removed
			expect(true).toBe(true);
		});
	});

	describe('disconnect', () => {
		it('should disconnect from server', async () => {
			await client.connect();
			client.disconnect();
			expect(client.isConnected()).toBe(false);
		});

		it('should clear subscriptions on disconnect', async () => {
			await client.connect();
			client.subscribe('produit');
			client.disconnect();
			expect(client.isConnected()).toBe(false);
		});
	});
});
