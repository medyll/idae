/*
	renamed from DbCollectionError to IDbErrors
 */
export class IDbError extends Error {
	constructor(
		message: string,
		public readonly code: string
	) {
		super(message);
		this.name = 'DbCollectionError';
	}
	static throwError(message: string, code: string) {
		throw new IDbError(message, code);
	}

	static handleError(error: unknown): void {
		if (error instanceof IDbError) {
			console.error(`${error.name}: ${error.message} (Code: ${error.code})`);
		} else {
			console.error('Unexpected error:', error);
		}
	}
}
