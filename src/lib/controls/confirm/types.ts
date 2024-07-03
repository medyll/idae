import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { iconSize, type CommonProps, type ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ConfirmProps<T = any> = CommonProps & {
	/** element data sent on confirm */
	data?: T;
	/** element initial HTMLDivElement props */
	initialRef?: HTMLElement | null;

	/** element confirm HTMLDivElement props */
	contentRef?: HTMLElement | null;

	/** text displayed on initial button */
	tooltipInitial?: string | null;

	/** text displayed on initial button */
	primaryInitial: string;
	/** text displayed on the confirm phase */
	primaryConfirm: string;

	/** icon displayed on the initial button */
	iconInitial?: string;

	/** color of the icon displayed on the initial button */
	iconColorInitial?: string;

	/** text displayed on confirm button */
	primary?: string;

	/** icon displayed on the confirm button */
	icon?: ElementProps['icon'];
	/**  button height */
	tall?: ElementProps['tall'];

	/** color of the icon displayed on the confirm button
	 * @type string
	 */
	iconColor?: string;

	iconSize?: string;

	autoClose?: boolean;
	/** loading state on validate */
	loading?: boolean;
	iconLoading?: ElementProps['icon'];

	/** action initiated on confirmation */
	action?: Promise<T> | ((data?: T) => void);

	/** icon to display for back action */
	iconCancel?: ElementProps['icon'];
	children?: Snippet;
	confirmInitial?: Snippet;
};

export const ConfirmDemoValues: DemoerStoryProps<ConfirmProps> = {
	primaryInitial: {
		type: 'string',
		values: ['Would you please click once ?'],
		private: true
	},
	tooltipInitial: {
		type: 'string',
		values: ['Would you please click once ?'],
		private: true
	},
	iconInitial: {
		type: 'icon',
		values: ['fa-solid:question']
	},
	iconColorInitial: {
		type: 'color',
		values: ['green', 'blue', undefined]
	},
	primary: {
		type: 'icon',
		values: ['Confirm deletion']
	},
	icon: {
		type: 'icon',
		values: ['mdi:close', undefined]
	},
	iconColor: {
		type: 'color',
		values: ['red', 'orange', undefined]
	},
	iconSize: {
		type: 'iconSize',
		default: iconSize.medium
	}
};

export let { parameters, componentArgs } = demoerArgs(ConfirmDemoValues);
