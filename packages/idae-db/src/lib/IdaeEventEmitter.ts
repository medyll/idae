import { EventEmitter } from 'events';
import { IdaeDbAdapter } from './IdaeDbAdapter.js';

/**
 * IdaeEventEmitter extends Node's EventEmitter to provide pre/post method hooks.
 */
export class IdaeEventEmitter extends EventEmitter {
	/**
	 * Overrides the emit method to ensure type safety.
	 * @param event The name of the event to emit.
	 * @param args The arguments to pass to the event listeners.
	 * @returns Whether the event had listeners.
	 */
	emit(event: string | symbol, ...args: any[]): boolean {
		return super.emit(event, ...args);
	}
}

/**
 * Decorator factory to add pre/post hooks to a method.
 * @returns A method decorator that adds event emission for pre/post hooks.
 */
export function withEmitter() {
	return function (
		target: object,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	): TypedPropertyDescriptor<any> | void {
		if (descriptor === undefined) {
			descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
		}
		const originalMethod = descriptor.value;

		descriptor.value = async function (this: IdaeEventEmitter, ...args: any[]) {
			// Emit the pre-execution event
			this.emit(`pre:${String(propertyKey)}`, ...args);

			let result;
			try {
				// Execute the original method
				result = await originalMethod.apply(this, args);
			} catch (error) {
				// Emit the error event if an exception occurs
				this.emit(`error:${String(propertyKey)}`, error);
				throw error;
			}

			// Emit the post-execution event
			this.emit(`post:${String(propertyKey)}`, result, ...args);

			return result;
		};

		return descriptor;
	};
}

/**
 * Type for pre-execution event listeners.
 */
export type PreEventListener<T extends any[]> = (...args: T) => void | Promise<void>;

/**
 * Type for post-execution event listeners.
 */
export type PostEventListener<T extends any[], R> = (result: R, ...args: T) => void | Promise<void>;

/**
 * Type for error event listeners.
 */
export type ErrorEventListener = (error: Error) => void | Promise<void>;

/**
 * Interface to extend IdaeEventEmitter with strongly typed event listeners.
 */
export interface TypedIdaeEventEmitter<T> {
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

export type EventListeners<T> = {
	[K in keyof IdaeDbAdapter<T>]?: {
		pre?: PreEventListener<Parameters<IdaeDbAdapter<T>[K]>>;
		post?: PostEventListener<Parameters<IdaeDbAdapter<T>[K]>, ReturnType<IdaeDbAdapter<T>[K]>>;
		error?: ErrorEventListener;
	};
};
