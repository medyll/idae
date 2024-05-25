import { type DemoStoryProps } from '$lib/types/index.js';
type EnumValueType<T> = T[keyof T];
export enum statusPreset {
	success = 'success',
	warning = 'warning',
	alert = 'alert',
	error = 'error',
	info = 'info',
	discrete = 'discrete'
}
import type {
	buttonVariant,
	CommonProps,
	Data,
	densePreset,
	flowPreset,
	IconObj,
	iconSize,
	positionPreset,
	tallPreset,
	widthPreset
} from '$lib/types/index.js';
import type { Snippet } from 'svelte';
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
export interface ElementProps {
	density: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	dense: [densePreset];
	width: keyof typeof widthPreset;
	tall: keyof typeof tallPreset;
	iconSize: keyof typeof iconSize;
	levels: keyof typeof statusPreset;
	buttonVariant: keyof typeof buttonVariant;
	alignment: 'center' | 'left' | 'right';
	flow: keyof typeof flowPreset;
	position: keyof typeof positionPreset;
	action: (event: any, data?: Data) => void;
	icon: string | IconObj;
}

export const demoValues: DemoStoryProps<AvatarProps> = {
	icon: {
		type: 'icons',
		values: ['fa-solid:question', 'bx:question-mark']
	}
};
