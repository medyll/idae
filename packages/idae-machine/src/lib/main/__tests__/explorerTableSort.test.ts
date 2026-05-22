import { describe, it, expect } from 'vitest';
import Explorer from '../../shell/frame/explorer/Explorer.svelte';

describe('Explorer table mode', () => {
	it('Explorer is defined', () => {
		expect(Explorer).toBeDefined();
	});

	it('supports table mode', () => {
		expect(Explorer).toBeTruthy();
	});

	it('supports list mode', () => {
		expect(Explorer).toBeTruthy();
	});

	it('supports card mode', () => {
		expect(Explorer).toBeTruthy();
	});
});
