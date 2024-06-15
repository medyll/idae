import type { Data, CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type PreviewProps<T = Data> = CommonProps & {
	/** Data to be displayed in the grid */
	data?: T[];

	/** Number of columns in the grid */
	columns?: number;

	/** Whether the grid is expanded or not */
	isExpanded?: boolean;

	/** Children snippet for the default content */
	children?: Snippet<[{ data: T }]>;

	/** Slot for the zoomed in view */
	previewZoom?: Snippet<[{ data: T }]>;
};
