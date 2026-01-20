
/**
 * @class IDbValidationError
 * @role Custom error class for validation errors on form fields.
 *
 * Usage:
 *   throw new MachineErrorValidation('email', 'INVALID_EMAIL', 'Invalid email address');
 */
export class MachineErrorValidation extends Error {
	/**
	 * Create a new MachineErrorValidation instance.
	 * @role Constructor
	 * @param {string} field The field name.
	 * @param {string} code The error code.
	 * @param {string} message The error message.
	 */
	constructor(
		public field: string,
		public code: string,
		message: string
	) {
		super(message);
		this.name = 'MachineErrorValidation';
	}
}
