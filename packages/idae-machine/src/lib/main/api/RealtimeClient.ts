import { io, type Socket } from 'socket.io-client';
import { logger } from '../../utils/logger.js';

/**
 * Real-time client for subscribing to table updates
 */
export class RealtimeClient {
	private socket: Socket | null = null;
	private subscribedTables: Set<string> = new Set();
	private eventHandlers: Map<string, Set<(data: unknown) => void>> = new Map();
	private baseUrl: string;
	private connected = false;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, '');
	}

	/**
	 * Connect to Socket.IO server
	 */
	connect(token?: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const socketUrl = this.baseUrl.replace('http', 'ws').replace('https', 'wss');

			this.socket = io(socketUrl, {
				auth: token ? { token } : undefined,
				transports: ['websocket', 'polling'],
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000
			});

			this.socket.on('connect', () => {
				this.connected = true;
				logger.info('🔌 Connected to real-time server');

				// Re-subscribe to previously subscribed tables
				this.subscribedTables.forEach((table) => {
					this.socket?.emit('subscribe', table);
				});

				resolve();
			});

			this.socket.on('disconnect', () => {
				this.connected = false;
				logger.warn('🔌 Disconnected from real-time server');
			});

			this.socket.on('connect_error', (error) => {
				logger.error('Real-time connection error:', error);
				reject(error);
			});

			// Listen for data events
			this.setupDataListeners();
		});
	}

	/**
	 * Setup data event listeners
	 */
	private setupDataListeners(): void {
		if (!this.socket) return;

		// Generic data events
		const events = ['data:created', 'data:updated', 'data:deleted'];

		events.forEach((event) => {
			this.socket!.on(event, (payload) => {
				logger.debug(`📩 Received ${event}:`, payload);

				// Call registered handlers
				const handlers = this.eventHandlers.get(event) || new Set();
				handlers.forEach((handler) => handler(payload));
			});
		});
	}

	/**
	 * Subscribe to table updates
	 */
	subscribe(table: string): void {
		if (!this.socket || !this.connected) {
			logger.warn('Not connected, queuing subscription');
			this.subscribedTables.add(table);
			return;
		}

		this.socket.emit('subscribe', table);
		this.subscribedTables.add(table);
		logger.info(`📡 Subscribed to ${table}`);
	}

	/**
	 * Unsubscribe from table updates
	 */
	unsubscribe(table: string): void {
		if (!this.socket) return;

		this.socket.emit('unsubscribe', table);
		this.subscribedTables.delete(table);
		logger.info(`📡 Unsubscribed from ${table}`);
	}

	/**
	 * Listen for data events
	 */
	onData(event: 'data:created' | 'data:updated' | 'data:deleted', handler: (data: unknown) => void): () => void {
		if (!this.eventHandlers.has(event)) {
			this.eventHandlers.set(event, new Set());
		}

		this.eventHandlers.get(event)!.add(handler);

		// Return unsubscribe function
		return () => {
			this.eventHandlers.get(event)?.delete(handler);
		};
	}

	/**
	 * Disconnect from server
	 */
	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.connected = false;
			this.subscribedTables.clear();
			logger.info('🔌 Disconnected from real-time server');
		}
	}

	/**
	 * Check connection status
	 */
	isConnected(): boolean {
		return this.connected && this.socket?.connected === true;
	}
}

/**
 * Create real-time client instance
 */
export function createRealtimeClient(baseUrl: string): RealtimeClient {
	return new RealtimeClient(baseUrl);
}
