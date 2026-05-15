import { idaeApi, mongooseConnectionManager } from '@medyll/idae-api';
import { DbType } from '@medyll/idae-db';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerSchemeRoutes } from './routes/scheme.js';
import { registerDataRoutes } from './routes/data.js';
import { registerPermissionRoutes } from './middleware/permission.js';
import { registerBootstrapRoutes } from './routes/bootstrap.js';
import { initializeSocketIO } from './socket/index.js';
import { setupConflictHandling } from './socket/conflictHandler.js';

async function connectDatabase(): Promise<void> {
	try {
		// Pre-connect to meta DB — validates credentials at startup
		await mongooseConnectionManager.createConnection(config.mongodbUri, `${config.org}_machine_app`);
		logger.info('📦 Connected to MongoDB');
	} catch (error) {
		logger.error('Failed to connect to MongoDB:', error);
		throw error;
	}
}

async function disconnectDatabase(): Promise<void> {
	// mongooseConnectionManager connections are closed when process exits
	logger.info('📦 Disconnected from MongoDB');
}

/**
 * Start the idae-machine server
 */
export async function startServer(): Promise<void> {
	try {
		// Connect to database
		await connectDatabase();

		// Register routes
		registerHealthRoutes();
		registerSchemeRoutes();
		registerDataRoutes();
		registerPermissionRoutes();
		if (config.nodeEnv === 'development') registerBootstrapRoutes();

		// Configure idae-api
		idaeApi.setOptions({
			port: config.port,
			cors: {
				origin: config.corsOrigin,
				credentials: true
			},
			enableCompression: true,
			payloadLimit: '1mb',
			// idae-db options: naming + autoincrement compatible with idae-machine
			idaeDbOptions: {
				dbType:           DbType.MONGODB,
				// DB scope = org prefix → produces '{org}_{base}' db names matching moduleDbName()
				dbScope:          config.org,
				dbScopeSeparator: '_',
				idaeModelOptions: {
					// All idae-machine collections use sequential 'id' field (keyPath '++id')
					autoIncrementFormat:       (_collection: string) => 'id',
					// Counter collection stored in the same DB as the data
					autoIncrementDbCollection: 'auto_increment'
				}
			}
		});

		// Start server
		await idaeApi.start();

		// Initialize Socket.IO for real-time
		const httpServer = (idaeApi as any).server;
		if (httpServer) {
			initializeSocketIO(httpServer);
			setupConflictHandling();
		}

		logger.info(`🚀 Server running on port ${config.port}`);
		logger.info(`📊 Environment: ${config.nodeEnv}`);
		logger.info(`🔗 CORS origin: ${config.corsOrigin}`);
		logger.info(`⚡ Socket.IO ready for real-time updates`);
		logger.info(`🔀 Conflict resolution enabled`);
	} catch (error) {
		logger.error('Failed to start server:', error);
		process.exit(1);
	}
}

/**
 * Stop the server gracefully
 */
export async function stopServer(): Promise<void> {
	try {
		await idaeApi.stop();
		await disconnectDatabase();
		logger.info('Server stopped');
	} catch (error) {
		logger.error('Error stopping server:', error);
	}
}

// Start if run directly — cross-platform path comparison
const _currentFile = new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const _entryFile   = process.argv[1]?.replace(/\\/g, '/');
if (_entryFile && (_currentFile === _entryFile || _currentFile.endsWith(_entryFile) || import.meta.url.endsWith(_entryFile.replace(/\\/g, '/')))) {
	startServer();

	// Graceful shutdown
	process.on('SIGTERM', async () => {
		logger.info('SIGTERM received, shutting down...');
		await stopServer();
		process.exit(0);
	});

	process.on('SIGINT', async () => {
		logger.info('SIGINT received, shutting down...');
		await stopServer();
		process.exit(0);
	});
}
