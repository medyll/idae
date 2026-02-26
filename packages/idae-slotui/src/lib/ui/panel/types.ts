export const panelDemoValues = {};
export const panelButtonNextDemoValues = {};
export const panelButtonPreviousDemoValues = {};
export const panelerDemoValues = {};
export const panelGridDemoValues = {};
export const panelGridZoomDemoValues = {};
export const panelSlideDemoValues = {};
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { Writable } from 'svelte/store';

export type PanelContextType = Writable<{
	activePanelId?: string;
	activePanelSlideData: Record<string, any>;
	panelSlides: Record<string, any>;
	panels: Record<string, any>;
}>;

// NOTE: `PanelGridProps` moved to the component module script during migration.

export type PanelProps<T = Data> = {
	/** Title of the panel */
	title: string;

	/** ID of the panel */
	panelId?: string;

	/** Data to be displayed in the panel */
	data?: T;

	/** Whether to show navigation or not */
	showNavigation?: boolean;
	panelButtonPrevious?: import('svelte').Snippet;
	panelButtonNext?: import('svelte').Snippet;
	children?: import('svelte').Snippet<[any]>;
};
