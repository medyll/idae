import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

// Props moved to the component module script during migration.

export type BindableEvent = CustomEvent<{
	element: any;
	clientHeight?: number;
	clientWidth?: number;
	offsetHeight?: number;
	offsetWidth?: number;
}>;

import type { DemoerStoryProps } from '../../base/demoer/types.js';

// Placeholder demo export for Content utility
export const contentDemoValues: DemoerStoryProps<any> = {};
