import type { IconProps } from '@iconify/svelte';
import type { Snippet } from 'svelte';

export type AppIcon = string;

export enum status {
	success = 'success',
	warning = 'warning',
	alert = 'alert',
	error = 'error',
	info = 'info',
	discrete = 'discrete'
}

export enum densePreset {
	default = 'default',
	small = 'small',
	medium = 'medium',
	kind = 'kind'
}

export enum tallPreset {
	default = 'default',
	small = 'small',
	medium = 'medium',
	kind = 'kind'
}

export enum buttonVariant {
	link = 'link',
	contained = 'contained',
	bordered = 'bordered',
	naked = 'naked',
	flat = 'flat'
}

export enum iconSize {
	auto = 'auto',
	tiny = 'tiny',
	small = 'small',
	medium = 'medium',
	large = 'large',
	full = 'full'
}

export enum flow {
	relative = 'relative',
	absolute = 'absolute',
	fixed = 'fixed'
}

export enum width {
	auto = 'auto',
	tiny = 'tiny',
	small = 'small',
	medium = 'medium',
	large = 'large',
	full = 'full',
	default = 'default'
}

export interface ElementProps {
	density: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	dense: keyof typeof densePreset;
	width: keyof typeof width;
	tall: keyof typeof tallPreset;
	iconSize: keyof typeof iconSize;
	levels: keyof typeof status;
	buttonVariant: keyof typeof buttonVariant;
	alignment: 'center' | 'left' | 'right';
	flow: keyof typeof flow;
	action: (event: any, data?: Data) => void;
	icon: string | IconObj;
}

export type Data = Record<string, any>;

export type CommonProps = {
	element?: HTMLElement;
	class?: string;
	style?: string;
	children?: Snippet | Snippet<[any]>;
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
