import pino from 'pino';

/**
 * Global logger instance configured with pino.
 * It uses 'pino-pretty' for better readability during development.
 * The log level can be configured via the LOG_LEVEL environment variable (default: 'info').
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});
