import { widthPreset, iconSize } from '$lib/types/index.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
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
export type AvatarProps = CommonProps & {
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
	element?: HTMLElement;
	class?: string;
	children?: Snippet;
	avatarBadge?: Snippet;
};

export const AvatarDemoValues: DemoerStoryProps<AvatarProps> = {
	icon: {
		type: 'icon',
		default: 'user'
	},
	size: {
		type: 'width',
		default: widthPreset.medium
	},
	iconSize: {
		type: 'iconSize',
		default: iconSize.medium
	}
};

export let { parameters, componentArgs } = demoerArgs(AvatarDemoValues);
