import { describe, it, expect } from 'vitest';
import { dotPath } from './pathResolver';

describe('pathResolver', () => {
	it('should export dotPath', () => {
		expect(typeof dotPath).toBe('function');
	});

	it('should resolve a simple path', () => {
		const obj = { a: { b: 1 } };
		expect(dotPath(obj, 'a.b')).toBe(1);
	});

	it('should return undefined for bad path', () => {
		const obj = { a: { b: 1 } };
		expect(dotPath(obj, 'a.x')).toBeUndefined();
	});

	it('should return defaultValue if not found', () => {
		const obj = { a: { b: 1 } };
		expect(dotPath(obj, 'a.x', 42)).toBe(42);
	});

	it('should handle empty path', () => {
		const obj = { a: 1 };
		expect(dotPath(obj, '', 'default')).toBe('default');
	});

	it('should resolve deeply nested paths', () => {
		const obj = { a: { b: { c: { d: 'deep' } } } };
		expect(dotPath(obj, 'a.b.c.d')).toBe('deep');
	});

	it('should handle null values in path', () => {
		const obj = { a: { b: null } };
		expect(dotPath(obj, 'a.b', 'fallback')).toBe('fallback');
	});

	it('should handle undefined values in path', () => {
		const obj = { a: { b: undefined } };
		expect(dotPath(obj, 'a.b', 'fallback')).toBe('fallback');
	});

	it('should resolve top-level keys', () => {
		const obj = { name: 'test', value: 42 };
		expect(dotPath(obj, 'name')).toBe('test');
		expect(dotPath(obj, 'value')).toBe(42);
	});

	it('should handle array access via dot path', () => {
		const obj = { items: ['first', 'second', 'third'] };
		expect(dotPath(obj, 'items.0')).toBe('first');
		expect(dotPath(obj, 'items.2')).toBe('third');
	});
});
