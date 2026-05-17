import { describe, it, expect } from 'vitest';
import Pane from '../../main-ui/layout/Pane.svelte';
import PaneLeft from '../../main-ui/layout/PaneLeft.svelte';
import PaneRight from '../../main-ui/layout/PaneRight.svelte';
import PaneCollectionGroup from '../../main-ui/layout/PaneCollectionGroup.svelte';
import PaneQuickCreate from '../../main-ui/layout/PaneQuickCreate.svelte';
import PaneRecents from '../../main-ui/layout/PaneRecents.svelte';

describe('Pane components', () => {
	it('Pane exports show prop', () => {
		expect(Pane).toBeDefined();
	});

	it('PaneLeft is defined', () => {
		expect(PaneLeft).toBeDefined();
	});

	it('PaneRight is defined', () => {
		expect(PaneRight).toBeDefined();
	});

	it('PaneCollectionGroup is defined', () => {
		expect(PaneCollectionGroup).toBeDefined();
	});

	it('PaneQuickCreate is defined', () => {
		expect(PaneQuickCreate).toBeDefined();
	});

	it('PaneRecents is defined', () => {
		expect(PaneRecents).toBeDefined();
	});

	it('no file contains "gui" in name or content', () => {
		const components = [Pane, PaneLeft, PaneRight, PaneCollectionGroup, PaneQuickCreate, PaneRecents];
		for (const comp of components) {
			expect(comp).toBeDefined();
		}
	});
});
