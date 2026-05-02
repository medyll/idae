/**
 * Simple logger utility
 * In production, this could be replaced with a more sophisticated logger like pino
 */
export const logger = {
	info: (...args: unknown[]): void => {
		console.log('[INFO]', ...args);
	},
	warn: (...args: unknown[]): void => {
		console.warn('[WARN]', ...args);
	},
	error: (...args: unknown[]): void => {
		console.error('[ERROR]', ...args);
	},
	debug: (...args: unknown[]): void => {
		if (process.env.DEBUG) {
			console.log('[DEBUG]', ...args);
		}
	}
};
