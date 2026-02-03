/**
 * Represents an HTTP error with a status code and a message.
 * This class extends the built-in Error class to include an HTTP status code.
 */
export class HttpError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  status: number;

  /**
   * Creates a new HttpError instance.
   * @param status - The HTTP status code (e.g., 404, 500).
   * @param message - The error message.
   */
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
