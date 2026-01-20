/*
	renamed from DbCollectionError to MachineError
 */

/**
 * @class MachineError
 * @role Custom error class for collection-related errors.
 *
 * Usage:
 *   throw new MachineError('Message', 'ERROR_CODE');
 *   MachineError.handleError(error);
 */
export class MachineError extends Error {
  /**
   * Create a new MachineError instance.
   * @role Constructor
   * @param {string} message The error message.
   * @param {string} code The error code.
   */
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "MachineError";
  }

  /**
   * Throw a new MachineError.
   * @role Error throwing
   * @param {string} message The error message.
   * @param {string} code The error code.
   * @throws {MachineError}
   */
  static throwError(message: string, code: string) {
    throw new MachineError(message, code);
  }

  /**
   * Handle an error, logging details if it's an MachineError.
   * @role Error handling
   * @param {unknown} error The error to handle.
   * @return {void}
   */
  static handleError(error: unknown): void {
    if (error instanceof MachineError) {
      console.error(`${error.name}: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
