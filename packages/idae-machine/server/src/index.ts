import { machineServer } from './MachineServer.js';
import { logger } from './utils/logger.js';

export { machineServer } from './MachineServer.js';

// Start if run directly — cross-platform path comparison
const _currentFile = new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const _entryFile   = process.argv[1]?.replace(/\\/g, '/');
if (_entryFile && (_currentFile === _entryFile || _currentFile.endsWith(_entryFile) || import.meta.url.endsWith(_entryFile.replace(/\\/g, '/')))) {
	machineServer.start().catch((err) => {
		logger.error('Failed to start server:', err);
		process.exit(1);
	});

	process.on('SIGTERM', async () => {
		logger.info('SIGTERM received, shutting down...');
		await machineServer.stop();
		process.exit(0);
	});

	process.on('SIGINT', async () => {
		logger.info('SIGINT received, shutting down...');
		await machineServer.stop();
		process.exit(0);
	});
}
