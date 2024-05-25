import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { Writable } from 'svelte/store';

export type PanelContextType = Writable<{
	activePanelId?: string;
	activePanelSlideData: Record<string, any>;
	panelSlides: Record<string, any>;
	panels: Record<string, any>;
}>;

export type PanelGridProps = CommonProps & {
	/** Data to be displayed in the grid */
	data?: Data;

	/** Number of columns in the grid */
	columns: number;

	/** Whether the grid is expanded or not */
	isExpanded: boolean;

	/** Children slot for the default content */
	children?: Snippet<[{ data: Data }]>;

	/** Slot for the zoomed in view */
	zoomSlot?: Snippet;
};

export type PanelProps = {
	/** Title of the panel */
	title: string;

	/** ID of the panel */
	panelId: string;

	/** Data to be displayed in the panel */
	data: any | undefined;

	/** Whether to show navigation or not */
	showNavigation: boolean;
	panelButtonNext: Snippet;
	panelButtonPrevious: Snippet;
	/** Actions to be performed by the panel */
	actions: {
		load: (args: any) => void;
	};
};
