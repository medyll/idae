import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { Writable } from 'svelte/store';

export type PanelContextType = Writable<{
	activePanelId?: string;
	activePanelSlideData: Record<string, any>;
	panelSlides: Record<string, any>;
	panels: Record<string, any>;
}>;

export type PanelGridProps<T = Data> = CommonProps & {
	/** Data to be displayed in the grid */
	data?: T[];

	/** Number of columns in the grid */
	columns?: number;

	/** Whether the grid is expanded or not */
	isExpanded?: boolean;

	/** Children snippet for the default content */
	children?: Snippet<[{ data: T }]>;

	/** Slot for the zoomed in view */
	panelGridZoom?: Snippet;
};

export type PanelProps<T = Data> = {
	/** Title of the panel */
	title: string;

	/** ID of the panel */
	panelId?: string;

	/** Data to be displayed in the panel */
	data?: T;

	/** Whether to show navigation or not */
	showNavigation?: boolean;
	panelButtonNext?: Snippet;
	panelButtonPrevious?: Snippet;
	children?: Snippet;
};
