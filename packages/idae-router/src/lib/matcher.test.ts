import { describe, it, expect } from 'vitest';
import { compilePath, matchCompiled, parseQuery } from './matcher';

describe('matcher', () => {
	it('compiles and matches params', () => {
		const compiled = compilePath('/user/:id');
		const params = matchCompiled(compiled, '/user/42');
		expect(params).toEqual({ id: '42' });
	});

	it('supports wildcard', () => {
		const compiled = compilePath('/files/*');
		const params = matchCompiled(compiled, '/files/path/to/file.txt');
		expect(params).toEqual({ '*': 'path/to/file.txt' });
	});

	it('parses query string into values', () => {
		const q = parseQuery('?a=1&b=2&b=3');
		expect(q.a).toBe('1');
		expect(q.b).toEqual(['2', '3']);
	});
});
