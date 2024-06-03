import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { iconSize, type CommonProps, type ElementProps } from '$lib/types/index.js';
import { uiPresets } from '$lib/utils/engine/presets.js';
import type { Snippet } from 'svelte';

export type ConfirmProps = CommonProps &
	Partial<Omit<HTMLDivElement, 'style'>> & {
		style?: string;
		element?: HTMLDivElement | null;

		/** element initial HTMLDivElement props */
		initialRef?: HTMLElement | null;

		/** element confirm HTMLDivElement props */
		contentRef?: HTMLElement | null;

		/** text displayed on initial button */
		tooltipInitial?: string | null;

		/** text displayed on initial button */
		primaryInitial: string;

		/** icon displayed on the initial button */
		iconInitial?: string;

		/** color of the icon displayed on the initial button */
		iconColorInitial?: string;

		/** text displayed on confirm button */
		primary?: string;

		/** icon displayed on the confirm button */
		icon?: ElementProps['icon'];

		/** color of the icon displayed on the confirm button
		 * @type string
		 */
		iconColor?: string;

		iconSize?: string;

		/** action initiated on confirmation */
		readonly action?: () => void;

		/** icon to display for back action */
		iconCancel?: ElementProps['icon'];
		children?: Snippet;
		confirmInitial?: Snippet;
	};

export const ConfirmDemoValues: DemoerStoryProps<ConfirmProps> = {
	primaryInitial: {
		type: 'string',
		values: ['Would you please click once ?']
	},
	tooltipInitial: {
		type: 'string',
		values: ['Would you please click once ?']
	},
	iconInitial: {
		type: 'string',
		values: ['fa-solid:question', 'bx:question-mark']
	},
	iconColorInitial: {
		type: 'icon',
		values: ['green', 'blue', undefined]
	},
	primary: {
		type: 'icon',
		values: ['Consfirm deletion']
	},
	icon: {
		type: 'icon',
		values: ['mdi:close', undefined]
	},
	iconColor: {
		type: 'icon',
		values: ['red', 'orange', undefined]
	},
	iconSize: {
		type: 'icon-size',
		values: Object.values(uiPresets.iconSize),
		default: iconSize.medium
	}
};
