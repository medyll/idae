import { describe, it, expect, vi } from 'vitest';
import { stator } from './Stator.js';
describe('stator', () => {
	it('should handle primitive values', () => {
		const state = stator(42);
		expect(state.stator).toBe(42);
	});

	it('should handle object values', () => {
		const initialState = { foo: 'bar' };
		const state = stator(initialState);
		expect(state.stator).toEqual(initialState);
	});

	it('should trigger onchange for primitive values', () => {
		const state = stator(42);
		const mockOnChange = vi.fn();
		state.onchange = mockOnChange;

		state.stator = 43;
		expect(mockOnChange).toHaveBeenCalledWith({ stator: 42 }, { stator: 43 });
	});

	it('should trigger onchange for object properties', () => {
		const state = stator({ count: 0 });
		const mockOnChange = vi.fn();
		state.onchange = mockOnChange;

		state.stator.count = 1;
		expect(mockOnChange).toHaveBeenCalledWith({ count: 0 }, { count: 1 });
	});

	it('should throw TypeError when setting onchange to non-function', () => {
		const state = stator(42);
		expect(() => {
			(state as any).onchange = 'not a function';
		}).toThrow(TypeError);
	});

	it('should not enumerate onchange property', () => {
		const state = stator({ foo: 'bar' });
		state.onchange = () => {};
		expect(Object.keys(state)).not.toContain('onchange');
	});

	it('should handle null values', () => {
		const state = stator(null);
		expect(state.stator).toBeNull();
	});

	it('should log error when accessing non-existent property', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const state = stator({});

		expect(() => {
			(state as any).nonExistent;
		}).toThrow();

		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});
});
