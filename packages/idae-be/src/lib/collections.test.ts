import { describe, it, expect } from 'vitest';
import { toArray, toWords, range } from './collections.js';
import { createClass, extendObject } from './classes-oop.js';

describe('collections', () => {
	it('toArray converts array-like and iterable values', () => {
		expect(toArray('abc')).toEqual(['a', 'b', 'c']);
		expect(toArray(new Set([1, 2]))).toEqual([1, 2]);

		const arrayLike = { 0: 'x', 1: 'y', length: 2 };
		expect(toArray(arrayLike as unknown as ArrayLike<string>)).toEqual(['x', 'y']);
	});

	it('toArray handles DOM array-likes', () => {
		document.body.innerHTML = '<span></span><span></span>';
		expect(toArray(document.querySelectorAll('span'))).toHaveLength(2);
	});

	it('toWords splits on whitespace and drops empties', () => {
		expect(toWords('  alpha  beta\tgamma\n delta ')).toEqual(['alpha', 'beta', 'gamma', 'delta']);
		expect(toWords('')).toEqual([]);
	});

	it('range builds inclusive ranges by default', () => {
		expect(range(1, 4)).toEqual([1, 2, 3, 4]);
		expect(range(0, 0)).toEqual([0]);
	});

	it('range supports exclusive end and descending order', () => {
		expect(range(1, 4, true)).toEqual([1, 2, 3]);
		expect(range(3, 1)).toEqual([3, 2, 1]);
		expect(range(3, 1, true)).toEqual([3, 2]);
	});
});

describe('classes-oop', () => {
	it('createClass builds a constructor with initialize', () => {
		const Animal = createClass({
			initialize(this: Record<string, unknown>, name: string) {
				this.name = name;
			},
			speak(this: Record<string, unknown>) {
				return `${this.name} makes a sound`;
			}
		});

		const a = new (Animal as new (name: string) => { speak(): string })('rex');
		expect(a.speak()).toBe('rex makes a sound');
	});

	it('createClass supports inheritance with spec override', () => {
		const Animal = createClass({
			initialize(this: Record<string, unknown>, name: string) {
				this.name = name;
			},
			speak() {
				return 'generic';
			}
		});
		const Dog = createClass(
			{
				speak() {
					return 'woof';
				}
			},
			Animal
		);

		const d = new (Dog as new (name: string) => { name: string; speak(): string })('rex');
		expect(d.speak()).toBe('woof');
		expect(d.name).toBe('rex');
		expect(d instanceof (Animal as unknown as new () => object)).toBe(true);
	});

	it('extendObject shallow-merges source into target', () => {
		const target = { a: 1, b: 2 };
		const result = extendObject(target, { b: 3, c: 4 });

		expect(result).toEqual({ a: 1, b: 3, c: 4 });
		expect(result).toBe(target);
	});
});
