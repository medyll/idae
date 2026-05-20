import { EventDataClientInstance } from '@medyll/idae-socket';
import { logger } from '../../utils/logger.js';

export class RealtimeClient {
	readonly baseUrl: string;
	private client: EventDataClientInstance;
	private subscribedTables: Set<string> = new Set();
	private eventHandlers: Map<string, Set<(data: unknown) => void>> = new Map();
	private connected = false;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, '');
		this.client = new EventDataClientInstance();

		const url = new URL(this.baseUrl);
		this.client.config.host      = url.hostname;
		this.client.config.port      = Number(url.port) || (url.protocol === 'https:' ? 443 : 80);
		this.client.config.namespace = url.pathname !== '/' ? url.pathname : '';

		this.client.onConnect = () => {
			this.connected = true;
			logger.info('Connected to real-time server');
			this.subscribedTables.forEach(t => this.client.socket?.emit('subscribe', t));
		};

		this.client.onDisconnect = () => {
			this.connected = false;
			logger.warn('Disconnected from real-time server');
		};
	}

	connect(token?: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (token) {
				this.client.config.authentication = { auth: token, authMode: 'Bearer' };
			}

			this.client.onConnectError = () => reject(new Error('Connection error'));
			this.client.onConnect = () => {
				this.connected = true;
				this.subscribedTables.forEach(t => this.client.socket?.emit('subscribe', t));
				this.setupDataListeners();
				resolve();
			};

			this.client.connect();
		});
	}

	private setupDataListeners(): void {
		const socket = this.client.socket;
		if (!socket) return;
		(['data:created', 'data:updated', 'data:deleted'] as const).forEach(event => {
			socket.on(event, (payload: unknown) => {
				this.eventHandlers.get(event)?.forEach(h => h(payload));
			});
		});
	}

	subscribe(table: string): void {
		this.subscribedTables.add(table);
		if (this.connected) this.client.socket?.emit('subscribe', table);
	}

	unsubscribe(table: string): void {
		this.subscribedTables.delete(table);
		this.client.socket?.emit('unsubscribe', table);
	}

	onData(event: 'data:created' | 'data:updated' | 'data:deleted', handler: (data: unknown) => void): () => void {
		if (!this.eventHandlers.has(event)) this.eventHandlers.set(event, new Set());
		this.eventHandlers.get(event)!.add(handler);
		return () => this.eventHandlers.get(event)?.delete(handler);
	}

	disconnect(): void {
		this.client.socket?.disconnect();
		this.connected = false;
		this.subscribedTables.clear();
	}

	isConnected(): boolean {
		return this.connected && this.client.socket?.connected === true;
	}
}

export function createRealtimeClient(baseUrl: string): RealtimeClient {
	return new RealtimeClient(baseUrl);
}
