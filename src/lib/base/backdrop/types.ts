import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { demoerArgs } from '../demoer/demoer.utils.js';

export interface BackdropProps extends CommonProps {
	/** backdrop class */
	class?: string;
	/** backdrop style */
	style?: string;
	/** 
			css position mode of the backdrop
			@type {'absolute' | 'fixed' | 'relative'}  
		*/
	flow?: ElementProps['flow'];
	/** auto-close backdrop on click */
	autoClose?: boolean;
	/** show or hide the backdrop */
	isOpen?: boolean;
	/** if in loading state, it will show a loading icon or $$slots.loadingSlot */
	isLoading?: boolean;
	element?: HTMLDivElement;
	elementContent?: HTMLDivElement;
	elementContentInner?: HTMLDivElement;
	classes?: {
		backdrop?: string;
		backdropContent?: string;
		backdropContentInner?: string;
	};
	onclick?: (event: MouseEvent) => void;
	children?: Snippet;
	backdropLoading?: Snippet;
}

export const BackdropDemoValues: DemoerStoryProps<BackdropProps> = {
	isOpen: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	autoClose: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	isLoading: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	flow: {
		type: 'flow-preset',
		values: ['relative', 'absolute', 'fixed'],
		default: 'fixed'
	}
};

export let { parameters, componentArgs } = demoerArgs(BackdropDemoValues);
