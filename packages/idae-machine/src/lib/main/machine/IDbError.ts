/*
	renamed from DbCollectionError to IDbErrors
 */

/**
 * @class IDbError
 * @role Custom error class for collection-related errors.
 *
 * Usage:
 *   throw new IDbError('Message', 'ERROR_CODE');
 *   IDbError.handleError(error);
 */
export class IDbError extends Error {
  /**
   * Create a new IDbError instance.
   * @role Constructor
   * @param {string} message The error message.
   * @param {string} code The error code.
   */
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DbCollectionError";
  }

  /**
   * Throw a new IDbError.
   * @role Error throwing
   * @param {string} message The error message.
   * @param {string} code The error code.
   * @throws {IDbError}
   */
  static throwError(message: string, code: string) {
    throw new IDbError(message, code);
  }

  /**
   * Handle an error, logging details if it's an IDbError.
   * @role Error handling
   * @param {unknown} error The error to handle.
   * @return {void}
   */
  static handleError(error: unknown): void {
    if (error instanceof IDbError) {
      console.error(`${error.name}: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
