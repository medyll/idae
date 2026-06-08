import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { SocketIoServer } from '@medyll/idae-socket/server';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { grantService } from '../services/GrantService.js';

/** Identity decoded from the handshake JWT (mirrors AuthService JwtPayload). */
interface SocketUser {
	userId:  string;
	login?:  string;
	isAdmin: boolean;
}

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
		let user: SocketUser | null = null;
		const token = socket.data?.token;
		if (token) {
			try { user = jwt.verify(token, jwtSecret) as SocketUser; } catch { user = null; }
		}
		socket.data.user = user;
		// 'none' strategy = dev: allow unauthenticated. Otherwise require a decoded user.
		const authed = authStrategy === 'none' || !!user;

		logger.info(`🔌 Client connected: ${socket.id}${authed ? '' : ' (unauthenticated)'}`);

		socket.on('subscribe', async (table: string) => {
			if (!authed) { logger.warn(`⛔ ${socket.id} subscribe denied (unauthenticated) → ${table}`); return; }
			// Per-table authorization: the user must hold 'L' (list) on `table`.
			// Admins and the dev 'none' strategy bypass the grant lookup.
			const bypass = authStrategy === 'none' || user?.isAdmin === true;
			if (!bypass) {
				const allowed = user?.userId
					? await grantService.checkGrant(user.userId, table, 'L')
					: false;
				if (!allowed) {
					logger.warn(`⛔ ${socket.id} subscribe denied (no 'L' grant) → ${table}`);
					return;
				}
			}
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
