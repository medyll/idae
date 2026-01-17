
/**
 * IDbValidationError
 *
 * Custom error class for validation errors on form fields.
 *
 * Usage:
 *   throw new IDbValidationError('email', 'INVALID_EMAIL', 'Invalid email address');
 */
export class IDbValidationError extends Error {
	/**
	 * Create a new IDbValidationError instance.
	 * @param field The field name.
	 * @param code The error code.
	 * @param message The error message.
	 */
	constructor(
		public field: string,
		public code: string,
		message: string
	) {
		super(message);
		this.name = 'IDbValidationError';
	}
}
