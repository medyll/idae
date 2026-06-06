import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { SocketIoServer } from '@medyll/idae-socket/server';
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

	const authStrategy = opts.auth?.strategy ?? 'jwt';
	const jwtSecret    = opts.auth?.jwtSecret ?? config.jwtSecret;

	io.on('connection', (socket: any) => {
		// Decode the handshake-validated token (set on socket.data.token by the
		// idae-socket authorization middleware) into a user identity.
		let user: unknown = null;
		const token = socket.data?.token;
		if (token) {
			try { user = jwt.verify(token, jwtSecret); } catch { user = null; }
		}
		socket.data.user = user;
		// 'none' strategy = dev: allow unauthenticated. Otherwise require a decoded user.
		const authed = authStrategy === 'none' || !!user;

		logger.info(`🔌 Client connected: ${socket.id}${authed ? '' : ' (unauthenticated)'}`);

		socket.on('subscribe', (table: string) => {
			if (!authed) { logger.warn(`⛔ ${socket.id} subscribe denied (unauthenticated) → ${table}`); return; }
			// TODO(rbac): per-table authorization — check this user holds 'L' on `table`
			// (server-side grant lookup) before joining. Currently any authenticated user.
			socket.join(`room_${table}`);
			logger.info(`📡 ${socket.id} → room_${table}`);
		});
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
