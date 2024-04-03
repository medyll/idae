import type { IconProps } from '@iconify/svelte';
import type { Snippet } from 'svelte';

export type TIcon = string;

/* export namespace Drawer {
  export let title: string;
} */

export interface ElementProps {
	sizeType: 'tiny' | 'small' | 'medium' | 'default' | 'large' | 'big' | 'full' | 'auto' | string;
	inputHeight: 'tiny' | 'small' | 'old' | 'large' | 'none';
	density: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	dense: 'default' | 'small' | 'medium' | 'kind';
	expansion: 'full' | 'padded' | 'centered';
	alignment: 'center' | 'left' | 'right';
	flow: 'relative' | 'absolute' | 'fixed';
	data: Record<string, any>;
	action: (event: any, data: ElementProps['data']) => void;
	icon: string;
}

export type Data = Record<string, any>;

export type CommonProps = {
	class?: string;
	style?: string;
	children?: Snippet<[any]>;
	slots?: Record<string, Snippet<[any]> | undefined>;
	element?: HTMLElement;
};

export type IconObj = IconProps & {
	icon: string;
	rotate?: boolean;
	color?: string;
	rotation?: number;
	size?: 'auto' | 'tiny' | 'small' | 'medium' | 'large' | 'full' | string;
	/** className off the root component */
	class?: string;
};
