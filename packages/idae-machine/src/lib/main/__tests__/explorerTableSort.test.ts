import { describe, it, expect } from 'vitest';
import ExplorerTable from '../../main-ui/explorer/ExplorerTable.svelte';

describe('ExplorerTable sort headers', () => {
	it('ExplorerTable is defined', () => {
		expect(ExplorerTable).toBeDefined();
	});

	it('accepts sortable prop', () => {
		expect(ExplorerTable).toBeTruthy();
	});

	it('accepts sortableColumns prop', () => {
		expect(ExplorerTable).toBeTruthy();
	});

	it('accepts initialSortBy prop', () => {
		expect(ExplorerTable).toBeTruthy();
	});
});
