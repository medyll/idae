import { EventEmitter } from 'events';

/**
 * IdaeEventEmitter extends Node's EventEmitter to provide pre/post method hooks.
 */
export class IdaeEventEmitter extends EventEmitter {
	/**
	 * Overrides the emit method to ensure type safety.
	 * @param event - The name of the event to emit.
	 * @param args - The arguments to pass to the event listeners.
	 * @returns Whether the event had listeners.
	 */
	emit(event: string | symbol, ...args: unknown[]): boolean {
		return super.emit(event, ...args);
	}
}

/**
 * Decorator factory to add pre/post hooks to a method.
 * @template T - The type of the method being decorated.
 * @returns A method decorator that adds event emission for pre/post hooks.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withEmitter<T extends (...args: any[]) => any>() {
	return function (
		target: object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<T>
	): void {
		if (!descriptor || !descriptor.value) {
			throw new Error('Descriptor or method value is undefined');
		}

		const originalMethod = descriptor.value;

		descriptor.value = function (this: IdaeEventEmitter, ...args: Parameters<T>): ReturnType<T> {
			// Emit the pre-execution event
			this.emit(`pre:${String(propertyKey)}`, ...args);

			try {
				// Execute the original method
				const executionResult = originalMethod.apply(this, args) as unknown;

				// If the method returns a Promise, handle async resolution/rejection
				if (
					executionResult &&
					(typeof (executionResult as Promise<unknown>).then === 'function' ||
						(executionResult as unknown) instanceof Promise)
				) {
					const promise = (executionResult as Promise<unknown>)
						.then((resolved) => {
							this.emit(`post:${String(propertyKey)}`, resolved as unknown as ReturnType<T>, ...args);
							return resolved as unknown as ReturnType<T>;
						})
						.catch((error: Error) => {
							this.emit(`error:${String(propertyKey)}`, error);
							throw error;
						});

					return promise as unknown as ReturnType<T>;
				}

				// Synchronous result
				this.emit(`post:${String(propertyKey)}`, executionResult as unknown as ReturnType<T>, ...args);
				return executionResult as unknown as ReturnType<T>;
			} catch (error) {
				// Emit the error event if an exception occurs
				this.emit(`error:${String(propertyKey)}`, error as Error);
				throw error;
			}
		} as T;
	};
}

/**
 * Type for pre-execution event listeners.
 * @template T - The tuple of arguments expected by the event.
 */
export type PreEventListener<T extends unknown[]> = (...args: T) => void | Promise<void>;

/**
 * Type for post-execution event listeners.
 * @template T - The tuple of arguments expected by the event.
 * @template R - The return type of the event.
 */
export type PostEventListener<T extends unknown[], R> = (
	result: R,
	...args: T
) => void | Promise<void>;

/**
 * Type for error event listeners.
 */
export type ErrorEventListener = (error: Error) => void | Promise<void>;

/**
 * Interface to extend IdaeEventEmitter with strongly typed event listeners.
 * @template T - The object containing methods to attach listeners to.
 */
export interface TypedIdaeEventEmitter<T extends Record<string, (...args: unknown[]) => unknown>> {
	on<K extends keyof T>(
		event: `pre:${K & string}`,
		listener: PreEventListener<Parameters<T[K]>>
	): this;
	on<K extends keyof T>(
		event: `post:${K & string}`,
		listener: PostEventListener<Parameters<T[K]>, ReturnType<T[K]>>
	): this;
	on<K extends keyof T>(event: `error:${K & string}`, listener: ErrorEventListener): this;

	once<K extends keyof T>(
		event: `pre:${K & string}`,
		listener: PreEventListener<Parameters<T[K]>>
	): this;
	once<K extends keyof T>(
		event: `post:${K & string}`,
		listener: PostEventListener<Parameters<T[K]>, ReturnType<T[K]>>
	): this;
	once<K extends keyof T>(event: `error:${K & string}`, listener: ErrorEventListener): this;

	emit<K extends keyof T>(event: `pre:${K & string}`, ...args: Parameters<T[K]>): boolean;
	emit<K extends keyof T>(
		event: `post:${K & string}`,
		result: ReturnType<T[K]>,
		...args: Parameters<T[K]>
	): boolean;
	emit<K extends keyof T>(event: `error:${K & string}`, error: Error): boolean;
}

/**
 * Type for event listeners.
 * @template T - The object containing methods to attach listeners to.
 * @template R - The object containing methods to attach listeners to (defaults to T).
 */
export type EventListeners<T extends object, R = unknown> = {
	[K in keyof T as T[K] extends (...args: unknown[]) => unknown ? K : never]?: {
		pre?: PreEventListener<T[K] extends (...args: infer P) => unknown ? P : never>;
		post?: PostEventListener<
			T[K] extends (...args: infer P) => unknown ? P : never,
			T[K] extends (...args: unknown[]) => infer U ? U : never
		>;
		error?: ErrorEventListener;
	};
};
