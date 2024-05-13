import {
	statusPreset,
	type CommonProps,
	type DemoStoryProps,
	type ElementProps
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

export const demoValues: DemoStoryProps<AvatarProps> = {
	icon: {
		type: 'icons',
		values: ['fa-solid:question', 'bx:question-mark']
	}
};
