import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { EventEmitter } from 'events';

/**
 * Custom assertion helpers for event testing
 */

export interface EventAssertion<T = any> {
	called: () => void;
	calledWith: (...args: unknown[]) => void;
	notCalled: () => void;
	callCount: (n: number) => void;
}

/**
 * Create a spy function that tracks calls
 */
export function createEventSpy<T extends (...args: any[]) => any>(
	fn?: T
): { spy: T & { calls: any[]; callCount: number }; calls: any[] } {
	const calls: any[] = [];
	const spy = ((...args: any[]) => {
		calls.push(args);
		if (fn) {
			return (fn as any)(...args);
		}
	}) as T & { calls: any[]; callCount: number };

	Object.defineProperty(spy, 'calls', {
		get: () => calls
	});

	Object.defineProperty(spy, 'callCount', {
		get: () => calls.length
	});

	return { spy, calls };
}

/**
 * Wait for an event to be emitted
 */
export function waitForEvent<T = any>(
	emitter: EventEmitter,
	eventName: string,
	timeout: number = 1000
): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			emitter.off(eventName, handler);
			reject(new Error(`Event '${eventName}' not emitted within ${timeout}ms`));
		}, timeout);

		const handler = (data: any) => {
			clearTimeout(timer);
			emitter.off(eventName, handler);
			resolve(data);
		};

		emitter.on(eventName, handler);
	});
}

/**
 * Assert event was emitted with specific args
 */
export function expectEventEmitted(
	emitter: EventEmitter,
	eventName: string,
	expectedArgs?: any[]
): Promise<void> {
	return new Promise((resolve, reject) => {
		const handler = (...args: any[]) => {
			if (expectedArgs) {
				try {
					expect(args).toEqual(expectedArgs);
				} catch (e) {
					emitter.off(eventName, handler);
					reject(e);
					return;
				}
			}
			emitter.off(eventName, handler);
			resolve();
		};

		emitter.on(eventName, handler);

		setTimeout(() => {
			emitter.off(eventName, handler);
			reject(new Error(`Event '${eventName}' not emitted within timeout`));
		}, 1000);
	});
}

/**
 * Collect all events emitted during an operation
 */
export async function collectEvents(
	emitter: EventEmitter,
	eventNames: string[],
	operation: () => Promise<void>,
	timeout: number = 1000
): Promise<Map<string, any[]>> {
	const events = new Map<string, any[]>();

	const handlers = eventNames.map((eventName) => ({
		name: eventName,
		handler: (...args: any[]) => {
			if (!events.has(eventName)) {
				events.set(eventName, []);
			}
			events.get(eventName)!.push(args);
		}
	}));

	handlers.forEach(({ name, handler }) => emitter.on(name, handler));

	try {
		await Promise.race([
			operation(),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error(`Operation timeout after ${timeout}ms`)), timeout)
			)
		]);
	} finally {
		handlers.forEach(({ name, handler }) => emitter.off(name, handler));
	}

	return events;
}
