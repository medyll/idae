import type { IconProps } from '@iconify/svelte';
import type { Snippet } from 'svelte';

export type AppIcon = string;

enum sizeType {
	tiny = 'tiny',
	small = 'small',
	medium = 'medium',
	default = 'default',
	large = 'large',
	big = 'big',
	full = 'full',
	auto = 'auto'
}

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
	alignment: 'center' | 'left' | 'right';
	flow: 'relative' | 'absolute' | 'fixed';
	action: (event: any, data: Data) => void;
	icon: AppIcon;
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
	size?: keyof typeof iconSize;
	class?: string;
};
