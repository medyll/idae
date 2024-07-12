import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type SwitchProps<T = Record<string, any>> = {
	/** className off the root component */
	class?: string;

	/** css style off the root component */
	style?: string;

	/** element root HTMLDivElement props */
	element?: HTMLElement | null;

	/** name of the switch */
	name?: string;

	/** whether the switch is checked */
	checked: boolean;

	/** whether the switch is disabled */
	disabled?: boolean;

	/** metadata associated with the switch */
	metaData?: T;

	/** function to be called when the switch is toggled */
	onChange?: (val: boolean, metaData: T) => void;
	children?: Snippet;
	switchLabel?: Snippet;
};

export const SwitchDemoValues: DemoerStoryProps<SwitchProps> = {
	checked: {
		type: 'boolean'
	},
	disabled: {
		type: 'boolean'
	}
};
export let { parameters, componentArgs } = demoerArgs(SwitchDemoValues);
