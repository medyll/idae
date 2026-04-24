import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger.js';

/**
 * Socket.IO instance for real-time broadcasts
 */
export let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO server
 */
export function initializeSocketIO(httpServer: HttpServer): SocketIOServer {
	if (io) {
		logger.warn('Socket.IO already initialized');
		return io;
	}

	io = new SocketIOServer(httpServer, {
		cors: {
			origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
			credentials: true
		},
		transports: ['websocket', 'polling']
	});

	io.on('connection', (socket) => {
		logger.info(`🔌 Client connected: ${socket.id}`);

		// Join table-specific rooms
		socket.on('subscribe', (table: string) => {
			const room = `room_${table}`;
			socket.join(room);
			logger.info(`📡 Client ${socket.id} subscribed to ${room}`);
		});

		// Leave room
		socket.on('unsubscribe', (table: string) => {
			const room = `room_${table}`;
			socket.leave(room);
			logger.info(`📡 Client ${socket.id} unsubscribed from ${room}`);
		});

		// Disconnect
		socket.on('disconnect', () => {
			logger.info(`🔌 Client disconnected: ${socket.id}`);
		});
	});

	logger.info('🚀 Socket.IO server initialized');
	return io;
}

/**
 * Broadcast event to table room
 */
export function broadcastToTable(table: string, event: string, data: unknown): void {
	if (!io) {
		logger.warn('Socket.IO not initialized, skipping broadcast');
		return;
	}

	const room = `room_${table}`;
	io.to(room).emit(event, {
		table,
		data,
		timestamp: new Date().toISOString()
	});

	logger.debug(`📡 Broadcast ${event} to ${room}`);
}

/**
 * Get Socket.IO instance
 */
export function getIO(): SocketIOServer | null {
	return io;
}
