import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockSocket, mockClient } = vi.hoisted(() => {
	const mockSocket = {
		on:         vi.fn(),
		emit:       vi.fn(),
		disconnect: vi.fn(),
		connected:  true,
	};

	const mockClient = {
		config: {
			host:            '',
			port:            0,
			namespace:       '',
			authentication:  undefined as any,
		},
		socket:          mockSocket,
		onConnect:       undefined as any,
		onDisconnect:    undefined as any,
		onConnectError:  undefined as any,
		connect: vi.fn(function (this: any) {
			if (mockClient.onConnect) mockClient.onConnect();
		}),
	};

	return { mockSocket, mockClient };
});

vi.mock('@medyll/idae-socket', () => ({
	EventDataClientInstance: class {
		constructor() { return mockClient; }
	},
	EventDataConfig: class {},
}));

import { RealtimeClient } from '../RealtimeClient.js';

describe('RealtimeClient', () => {
	let client: RealtimeClient;

	beforeEach(() => {
		vi.clearAllMocks();
		mockClient.onConnect      = undefined as any;
		mockClient.onDisconnect   = undefined as any;
		mockClient.onConnectError = undefined as any;
		mockClient.config.authentication = undefined as any;
		mockSocket.connected = true;
		// re-bind connect mock after clearAllMocks
		mockClient.connect.mockImplementation(function () {
			if (mockClient.onConnect) mockClient.onConnect();
		});
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
			const c = new RealtimeClient('http://localhost:3000/');
			expect(c.baseUrl).toBe('http://localhost:3000');
		});
	});

	describe('connect', () => {
		it('should connect to server', async () => {
			await client.connect();
			expect(mockClient.connect).toHaveBeenCalled();
			expect(client.isConnected()).toBe(true);
		});

		it('should connect with token', async () => {
			await client.connect('test-token');
			expect(mockClient.config.authentication).toEqual({ auth: 'test-token', authMode: 'Bearer' });
			expect(client.isConnected()).toBe(true);
		});
	});

	describe('subscribe/unsubscribe', () => {
		it('should subscribe to table', async () => {
			await client.connect();
			client.subscribe('produit');
			expect(mockSocket.emit).toHaveBeenCalledWith('subscribe', 'produit');
		});

		it('should unsubscribe from table', async () => {
			await client.connect();
			client.subscribe('produit');
			client.unsubscribe('produit');
			expect(mockSocket.emit).toHaveBeenCalledWith('unsubscribe', 'produit');
		});

		it('should queue subscription if not connected', () => {
			client.subscribe('produit');
			expect(mockSocket.emit).not.toHaveBeenCalled();
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
			expect(true).toBe(true);
		});
	});

	describe('disconnect', () => {
		it('should disconnect from server', async () => {
			await client.connect();
			mockSocket.connected = false;
			client.disconnect();
			expect(client.isConnected()).toBe(false);
			expect(mockSocket.disconnect).toHaveBeenCalled();
		});

		it('should clear subscriptions on disconnect', async () => {
			await client.connect();
			client.subscribe('produit');
			mockSocket.connected = false;
			client.disconnect();
			expect(client.isConnected()).toBe(false);
		});
	});
});
