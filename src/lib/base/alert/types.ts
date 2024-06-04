import { statusPreset, type CommonProps, type ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import { demoerArgs } from '../demoer/demoer.utils.js';
import type { DemoerStoryProps } from '../demoer/types.js';
export interface AlertProps extends CommonProps {
	/** alert level */
	level?: ElementProps['levels'];
	/** message to be shown */
	message?: string;
	/** make the alert draggable */
	draggable?: boolean;
	/** show or hide the alert */
	isOpen?: boolean;
	element?: HTMLDialogElement;
	actions?: Record<'open' | 'toggle' | 'close', Function>;
	children?: Snippet;
	topButtonSlot?: Snippet;
	messageSlot?: Snippet;
	buttonZoneSlot?: Snippet;
	buttonCloseSlot?: Snippet;
}

export const alertDemoValues: DemoerStoryProps<any> = {
	isOpen: {
		type: 'boolean',
		values: [true, false],
		default: true
	},
	draggable: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	level: {
		type: 'levels',
		values: Object.keys(statusPreset),
		default: statusPreset.info
	},
	message: {
		type: 'string',
		values: ['Some messages']
	}
};

export let { parameters, componentArgs } = demoerArgs(alertDemoValues);
