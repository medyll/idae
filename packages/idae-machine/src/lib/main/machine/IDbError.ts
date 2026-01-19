/*
	renamed from DbCollectionError to IDbErrors
 */

/**
 * IDbError
 *
 * Custom error class for collection-related errors.
 *
 * Usage:
 *   throw new IDbError('Message', 'ERROR_CODE');
 *   IDbError.handleError(error);
 */
export class IDbError extends Error {
  /**
   * Create a new IDbError instance.
   * @param message The error message.
   * @param code The error code.
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
   * @param message The error message.
   * @param code The error code.
   */
  static throwError(message: string, code: string) {
    throw new IDbError(message, code);
  }

  /**
   * Handle an error, logging details if it's an IDbError.
   * @param error The error to handle.
   */
  static handleError(error: unknown): void {
    if (error instanceof IDbError) {
      console.error(`${error.name}: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
