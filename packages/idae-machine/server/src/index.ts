import { idaeApi } from '@medyll/idae-api';
import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerSchemeRoutes } from './routes/scheme.js';

/**
 * Connect to MongoDB
 */
async function connectDatabase(): Promise<void> {
	try {
		await mongoose.connect(config.mongodbUri);
		logger.info('📦 Connected to MongoDB');
	} catch (error) {
		logger.error('Failed to connect to MongoDB:', error);
		throw error;
	}
}

/**
 * Disconnect from MongoDB
 */
async function disconnectDatabase(): Promise<void> {
	try {
		await mongoose.disconnect();
		logger.info('📦 Disconnected from MongoDB');
	} catch (error) {
		logger.error('Error disconnecting from MongoDB:', error);
	}
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
		await disconnectDatabase();
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
