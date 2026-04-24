/**
 * MachineApi error class
 */
export class MachineApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public response?: Response
	) {
		super(message);
		this.name = 'MachineApiError';
	}
}

/**
 * Network error class for retry logic
 */
export class NetworkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NetworkError';
	}
}
