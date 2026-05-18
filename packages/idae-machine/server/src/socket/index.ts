import { Server as HttpServer } from 'http';
import { SocketIoServer } from '@medyll/idae-socket';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export interface SocketServerOptions {
	auth?:   { strategy: 'jwt' | 'introspection' | 'none'; jwtSecret?: string; introspectionUrl?: string };
	redis?:  string;
	cors?:   string;
	enabled?: boolean;
}

let socketServer: SocketIoServer | null = null;

export function initializeSocketIO(
	httpServer: HttpServer,
	opts: SocketServerOptions = {}
): SocketIoServer {
	if (socketServer) {
		logger.warn('Socket.IO already initialized');
		return socketServer;
	}

	if (opts.enabled === false) {
		logger.info('Socket.IO disabled by options');
		return null as any;
	}

	socketServer = new SocketIoServer({
		corsOrigin: opts.cors   ?? config.corsOrigin,
		redisUrl:   opts.redis,
		auth: {
			strategy:         opts.auth?.strategy         ?? 'jwt',
			jwtSecret:        opts.auth?.jwtSecret        ?? config.jwtSecret,
			introspectionUrl: opts.auth?.introspectionUrl ?? 'http://localhost/unused',
		},
	});

	const io = socketServer.init(httpServer as any);

	io.on('connection', (socket: any) => {
		logger.info(`🔌 Client connected: ${socket.id}`);
		socket.on('subscribe',   (table: string) => { socket.join(`room_${table}`);  logger.info(`📡 ${socket.id} → room_${table}`); });
		socket.on('unsubscribe', (table: string) => { socket.leave(`room_${table}`); logger.info(`📡 ${socket.id} ← room_${table}`); });
		socket.on('disconnect',  () => logger.info(`🔌 Client disconnected: ${socket.id}`));
	});

	logger.info('🚀 Socket.IO initialized (idae-socket)');
	return socketServer;
}

export function broadcastToTable(table: string, event: string, data: unknown): void {
	if (!socketServer?.ioApp) {
		logger.warn('Socket.IO not initialized, skipping broadcast');
		return;
	}
	socketServer.toRoom(`room_${table}`, event, { table, data, timestamp: new Date().toISOString() });
	logger.debug(`📡 Broadcast ${event} → room_${table}`);
}

export function getSocketServer(): SocketIoServer | null { return socketServer; }
export function getIO(): any { return socketServer?.ioApp ?? null; }
