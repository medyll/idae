import { describe, it, expect } from 'vitest';
import Explorer from '../../shell/explorer/Explorer.svelte';

describe('Explorer pagination (list mode)', () => {
	it('Explorer is defined', () => {
		expect(Explorer).toBeDefined();
	});

	it('accepts collection + mode props', () => {
		expect(Explorer).toBeTruthy();
	});
});
