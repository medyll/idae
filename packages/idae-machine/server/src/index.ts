import { idaeApi } from '@medyll/idae-api';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { registerHealthRoutes } from './routes/health.js';

/**
 * Start the idae-machine server
 */
export async function startServer(): Promise<void> {
	try {
		// Register routes
		registerHealthRoutes();

		// Configure idae-api
		idaeApi.setOptions({
			port: config.port,
			cors: {
				origin: config.corsOrigin,
				credentials: true
			},
			enableCompression: true,
			payloadLimit: '1mb'
		});

		// Start server
		await idaeApi.start();

		logger.info(`🚀 Server running on port ${config.port}`);
		logger.info(`📊 Environment: ${config.nodeEnv}`);
		logger.info(`🔗 CORS origin: ${config.corsOrigin}`);
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
		logger.info('Server stopped');
	} catch (error) {
		logger.error('Error stopping server:', error);
	}
}

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
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
