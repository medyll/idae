import { describe, it, expect } from 'vitest';
import { be } from '@medyll/idae-be';
import { Machine } from '../machine.js';

describe('machine.be', () => {
	const machine = new Machine('test-db', 1);

	it('machine.be is the be() function from @medyll/idae-be', () => {
		expect(machine.be).toBe(be);
	});

	it('machine.be is a function', () => {
		expect(typeof machine.be).toBe('function');
	});
});
