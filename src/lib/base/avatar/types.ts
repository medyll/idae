import { widthPreset, iconSize, type DemoStoryProps } from '$lib/types/index.js';
type EnumValueType<T> = T[keyof T];
export enum statusPreset {
	success = 'success',
	warning = 'warning',
	alert = 'alert',
	error = 'error',
	info = 'info',
	discrete = 'discrete'
}
import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import { demoerArgs } from '../demoer/demoer.utils.js';
export interface AvatarProps extends CommonProps {
	/** icon name 	*/
	icon?: string;
	/**
	 * size of the avatar
	 */
	size?: ElementProps['width'];
	/**
	 * size of the icon
	 */
	iconSize?: ElementProps['iconSize'];
	element?: HTMLDivElement;
	class?: string;
	children?: Snippet;
	avatarBadge?: Snippet;
}

export const AvatarDemoValues: DemoStoryProps<AvatarProps> = {
	icon: {
		type: 'icons',
		values: ['fa-solid:question', 'bx:question-mark']
	},
	size: {
		type: 'width',
		values: Object.keys(widthPreset),
		default: widthPreset.medium
	},
	iconSize: {
		type: 'iconSize',
		values: Object.keys(iconSize),
		default: iconSize.medium
	}
};

export let { parameters, componentArgs } = demoerArgs(AvatarDemoValues);
