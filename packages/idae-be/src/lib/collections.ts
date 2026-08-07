/**
 * Collection utilities operating on plain values (not DOM elements), so they
 * intentionally do NOT follow the `Be`/handler pattern.
 *
 * Note: for a key/value store, prefer the native `Map` — it already provides
 * `.get`/`.set`/`.forEach` and iteration. No `Hash`-like class is shipped here.
 */

/**
 * Converts an iterable or array-like value to a real array.
 * @param input - The iterable or array-like value to convert.
 * @returns A new array containing the input's items.
 * @example
 * toArray(document.querySelectorAll('div')); // HTMLElement[]
 * toArray('abc'); // ['a', 'b', 'c']
 */
export function toArray<T = unknown>(input: Iterable<T> | ArrayLike<T>): T[] {
	if (input == null) return [];
	if (typeof (input as Iterable<T>)[Symbol.iterator] === 'function') {
		return Array.from(input as Iterable<T>);
	}
	return Array.prototype.slice.call(input) as T[];
}

/**
 * Splits a string on whitespace into an array of words.
 * @param str - The string to split.
 * @returns The non-empty whitespace-separated tokens.
 * @example
 * toWords('  alpha  beta\tgamma '); // ['alpha', 'beta', 'gamma']
 */
export function toWords(str: string): string[] {
	return str.trim().split(/\s+/).filter(Boolean);
}

/**
 * Builds a numeric range from `start` (inclusive) to `end`.
 * By default `end` is inclusive; pass `exclusive: true` to exclude it.
 * Descending ranges are supported when `start > end`.
 * @param start - The first value of the range.
 * @param end - The boundary value of the range.
 * @param exclusive - When true, `end` is excluded.
 * @returns The array of integers in the range.
 * @example
 * range(1, 4); // [1, 2, 3, 4]
 * range(1, 4, true); // [1, 2, 3]
 * range(3, 1); // [3, 2, 1]
 */
export function range(start: number, end: number, exclusive = false): number[] {
	const result: number[] = [];
	const step = start <= end ? 1 : -1;
	const stop = exclusive ? end : end + step;

	for (let i = start; i !== stop; i += step) {
		result.push(i);
	}
	return result;
}
