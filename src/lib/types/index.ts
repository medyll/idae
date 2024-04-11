import type { IconProps } from '@iconify/svelte';
import type { Snippet } from 'svelte';

export type AppIcon = string;

enum dense {
	default = 'default',
	small = 'small',
	medium = 'medium',
	kind = 'kind'
}

enum iconSize {
	auto = 'auto',
	tiny = 'tiny',
	small = 'small',
	medium = 'medium',
	large = 'large',
	full = 'full'
}

export interface ElementProps {
	density: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	dense: keyof typeof dense;
	tall: keyof typeof dense;
	iconSize: keyof typeof iconSize;
	alignment: 'center' | 'left' | 'right';
	flow: 'relative' | 'absolute' | 'fixed';
	action: (event: any, data?: Data) => void;
	icon: AppIcon;
}

export type Data = Record<string, any>;

export type CommonProps = {
	element?: HTMLElement;
	class?: string;
	style?: string;
	children?: Snippet<[any]>;
	slots?: Record<string, Snippet<[any]> | undefined>;
};

export type IconObj = IconProps & {
	icon: string;
	rotate?: boolean;
	color?: string;
	rotation?: number;
	size?: keyof typeof iconSize;
	class?: string;
};
