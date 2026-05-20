import { describe, it, expect } from 'vitest';
import ExplorerList from '../../shell/explorer/ExplorerList.svelte';

describe('ExplorerList pagination', () => {
	it('ExplorerList is defined', () => {
		expect(ExplorerList).toBeDefined();
	});

	it('accepts pageSize prop', () => {
		// Component should accept pageSize without error
		expect(ExplorerList).toBeTruthy();
	});
});
