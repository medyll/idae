import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IdaeEventEmitter, withEmitter } from '../../src/lib/IdaeEventEmitter.js';
import { collectEvents, createEventSpy, waitForEvent } from '../helpers/assertions.js';

describe('IdaeEventEmitter', () => {
	let emitter: IdaeEventEmitter;

	beforeEach(() => {
		emitter = new IdaeEventEmitter();
	});

	describe('emit method', () => {
		it('should emit an event and trigger listener', async () => {
			const listener = vi.fn();
			emitter.on('test:event', listener);

			emitter.emit('test:event', 'arg1', 'arg2');

			expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should return true if event had listeners', () => {
			const listener = vi.fn();
			emitter.on('test:event', listener);

			const result = emitter.emit('test:event', 'data');

			expect(result).toBe(true);
		});

		it('should return false if event had no listeners', () => {
			const result = emitter.emit('non-existent:event', 'data');
			expect(result).toBe(false);
		});

		it('should handle multiple listeners for same event', () => {
			const listener1 = vi.fn();
			const listener2 = vi.fn();
			const listener3 = vi.fn();

			emitter.on('multi:event', listener1);
			emitter.on('multi:event', listener2);
			emitter.on('multi:event', listener3);

			emitter.emit('multi:event', 'shared-data');

			expect(listener1).toHaveBeenCalledWith('shared-data');
			expect(listener2).toHaveBeenCalledWith('shared-data');
			expect(listener3).toHaveBeenCalledWith('shared-data');
		});

		it('should support once() for single execution', () => {
			const listener = vi.fn();
			emitter.once('once:event', listener);

			emitter.emit('once:event', 'first');
			emitter.emit('once:event', 'second');

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith('first');
		});
	});

	describe('@withEmitter decorator - synchronous methods', () => {
		class TestService extends IdaeEventEmitter {
			@withEmitter()
			syncMethod(arg1: string, arg2: number) {
				return `result_${arg1}_${arg2}`;
			}

			@withEmitter()
			syncMethodThrows(message: string) {
				throw new Error(message);
			}
		}

		it('should emit pre event with arguments', () => {
			const service = new TestService();
			const preListener = vi.fn();

			service.on('pre:syncMethod', preListener);
			service.syncMethod('test', 42);

			expect(preListener).toHaveBeenCalledWith('test', 42);
		});

		it('should emit post event with result and arguments', () => {
			const service = new TestService();
			const postListener = vi.fn();

			service.on('post:syncMethod', postListener);
			const result = service.syncMethod('test', 42);

			expect(postListener).toHaveBeenCalledWith(`result_test_42`, 'test', 42);
			expect(result).toBe(`result_test_42`);
		});

		it('should emit error event on exception', () => {
			const service = new TestService();
			const errorListener = vi.fn();

			service.on('error:syncMethodThrows', errorListener);

			expect(() => {
				service.syncMethodThrows('test error');
			}).toThrow('test error');

			expect(errorListener).toHaveBeenCalled();
			const errorArg = errorListener.mock.calls[0][0];
			expect(errorArg).toBeInstanceOf(Error);
			expect(errorArg.message).toBe('test error');
		});

		it('should re-throw error after emitting error event', () => {
			const service = new TestService();
			service.on('error:syncMethodThrows', () => {
				// handle error
			});

			expect(() => {
				service.syncMethodThrows('test error');
			}).toThrow('test error');
		});

		it('should emit events in correct order: pre -> post', () => {
			const service = new TestService();
			const eventOrder: string[] = [];

			service.on('pre:syncMethod', () => eventOrder.push('pre'));
			service.on('post:syncMethod', () => eventOrder.push('post'));

			service.syncMethod('test', 42);

			expect(eventOrder).toEqual(['pre', 'post']);
		});

		it('should emit error event before throwing', () => {
			const service = new TestService();
			const eventOrder: string[] = [];

			service.on('pre:syncMethodThrows', () => eventOrder.push('pre'));
			service.on('error:syncMethodThrows', () => eventOrder.push('error'));

			try {
				service.syncMethodThrows('test error');
			} catch (e) {
				// expected
			}

			expect(eventOrder).toEqual(['pre', 'error']);
		});
	});

	describe('@withEmitter decorator - asynchronous methods', () => {
		class AsyncTestService extends IdaeEventEmitter {
			@withEmitter()
			async asyncMethod(arg1: string, arg2: number) {
				return `async_result_${arg1}_${arg2}`;
			}

			@withEmitter()
			async asyncMethodThrows(message: string) {
				throw new Error(`Async error: ${message}`);
			}

			@withEmitter()
			async asyncMethodWithDelay(value: string, delay: number) {
				return new Promise((resolve) => {
					setTimeout(() => resolve(`delayed_${value}`), delay);
				});
			}
		}

		it('should handle async methods and emit pre event', async () => {
			const service = new AsyncTestService();
			const preListener = vi.fn();

			service.on('pre:asyncMethod', preListener);
			await service.asyncMethod('test', 42);

			expect(preListener).toHaveBeenCalledWith('test', 42);
		});

		it('should emit post event with async result', async () => {
			const service = new AsyncTestService();
			const postListener = vi.fn();

			service.on('post:asyncMethod', postListener);
			const result = await service.asyncMethod('test', 42);

			expect(postListener).toHaveBeenCalledWith(`async_result_test_42`, 'test', 42);
			expect(result).toBe(`async_result_test_42`);
		});

		it('should emit error event on async error', async () => {
			const service = new AsyncTestService();
			const errorListener = vi.fn();

			service.on('error:asyncMethodThrows', errorListener);

			await expect(service.asyncMethodThrows('test error')).rejects.toThrow(
				'Async error: test error'
			);

			expect(errorListener).toHaveBeenCalled();
		});

		it('should handle delayed async operations', async () => {
			const service = new AsyncTestService();
			const preListener = vi.fn();
			const postListener = vi.fn();

			service.on('pre:asyncMethodWithDelay', preListener);
			service.on('post:asyncMethodWithDelay', postListener);

			const result = await service.asyncMethodWithDelay('data', 50);

			expect(preListener).toHaveBeenCalledWith('data', 50);
			expect(postListener).toHaveBeenCalledWith('delayed_data', 'data', 50);
			expect(result).toBe('delayed_data');
		});
	});

	describe('Event listener management', () => {
		it('should support removing specific listeners', () => {
			const listener1 = vi.fn();
			const listener2 = vi.fn();

			emitter.on('test:event', listener1);
			emitter.on('test:event', listener2);

			emitter.off('test:event', listener1);

			emitter.emit('test:event', 'data');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).toHaveBeenCalledWith('data');
		});

		it('should support removing all listeners for an event', () => {
			const listener1 = vi.fn();
			const listener2 = vi.fn();

			emitter.on('test:event', listener1);
			emitter.on('test:event', listener2);

			emitter.removeAllListeners('test:event');

			emitter.emit('test:event', 'data');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).not.toHaveBeenCalled();
		});

		it('should support listenerCount', () => {
			const listener1 = vi.fn();
			const listener2 = vi.fn();

			emitter.on('test:event', listener1);
			emitter.on('test:event', listener2);

			expect(emitter.listenerCount('test:event')).toBe(2);
		});
	});

	describe('Complex scenarios', () => {
		it('should handle multiple decorated methods independently', () => {
			class MultiMethodService extends IdaeEventEmitter {
				@withEmitter()
				methodA(value: string) {
					return `A_${value}`;
				}

				@withEmitter()
				methodB(value: string) {
					return `B_${value}`;
				}
			}

			const service = new MultiMethodService();
			const preAListener = vi.fn();
			const preBListener = vi.fn();

			service.on('pre:methodA', preAListener);
			service.on('pre:methodB', preBListener);

			service.methodA('test');
			service.methodB('test');

			expect(preAListener).toHaveBeenCalledWith('test');
			expect(preBListener).toHaveBeenCalledWith('test');
		});

		it('should handle error events with custom error handling', () => {
			const errors: Error[] = [];

			// Add a simple TestService class for this test
			class ErrorHandlingService extends IdaeEventEmitter {
				@withEmitter()
				mightFail(shouldFail: boolean) {
					if (shouldFail) throw new Error('Intentional failure');
					return 'success';
				}
			}

			const svc = new ErrorHandlingService();

			svc.on('error:mightFail', (err) => {
				errors.push(err);
			});

			try {
				svc.mightFail(true);
			} catch (e) {
				// expected
			}

			expect(errors).toHaveLength(1);
			expect(errors[0].message).toBe('Intentional failure');
		});

		it('should support chaining event listeners', () => {
			const listener = vi.fn();
			const result = emitter.on('test:event', listener).on('test:event', listener);

			expect(result).toBe(emitter);
		});
	});
});
