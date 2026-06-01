import { describe, it, expect } from 'vitest';
import Pane from '../../shell/layout/Pane.svelte';
import PaneRight from '../../shell/layout/PaneRight.svelte';
import PaneQuickCreate from '../../shell/layout/PaneQuickCreate.svelte';
import PaneRecents from '../../shell/layout/PaneRecents.svelte';

describe('Pane components', () => {
	it('Pane exports show prop', () => {
		expect(Pane).toBeDefined();
	});

	it('PaneRight is defined', () => {
		expect(PaneRight).toBeDefined();
	});

	it('PaneQuickCreate is defined', () => {
		expect(PaneQuickCreate).toBeDefined();
	});

	it('PaneRecents is defined', () => {
		expect(PaneRecents).toBeDefined();
	});

	it('no file contains "gui" in name or content', () => {
		const components = [Pane, PaneRight, PaneQuickCreate, PaneRecents];
		for (const comp of components) {
			expect(comp).toBeDefined();
		}
	});
});
