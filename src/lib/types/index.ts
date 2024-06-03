import type { AlertProps } from '$lib/base/alert/types.js';
import type { StickToPositionType } from '$lib/utils/uses/stickTo/stickTo.js';
import type { IconProps } from '@iconify/svelte';
import type { Snippet } from 'svelte';

export type AppIcon = string;

export enum statusPreset {
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
	big = 'big',
	full = 'full'
}

export enum flowPreset {
	relative = 'relative',
	absolute = 'absolute',
	fixed = 'fixed'
}

export enum widthPreset {
	auto = 'auto',
	tiny = 'tiny',
	small = 'small',
	medium = 'medium',
	large = 'large',
	full = 'full',
	default = 'default'
}

export enum positionPreset {
	top = 'top',
	bottom = 'bottom',
	left = 'left',
	right = 'right'
}

export interface ElementProps {
	density: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	dense: keyof typeof densePreset;
	width: keyof typeof widthPreset;
	tall: keyof typeof tallPreset;
	levels: keyof typeof statusPreset;
	buttonVariant: keyof typeof buttonVariant;
	alignment: 'center' | 'left' | 'right';
	flow: keyof typeof flowPreset;
	position: keyof typeof positionPreset;
	popperPosition: StickToPositionType;
	action: (event: any, data?: Data) => void;
	iconSize: keyof typeof iconSize;
	icon: string | IconObj;
}

export type Data = Record<string, any>;

export interface CommonProps {
	element?: HTMLElement;
	class?: string;
	style?: string;
	children?: Snippet<[any]>;
}

export type IconObj = IconProps & {
	icon: string;
	rotate?: boolean;
	color?: string;
	rotation?: number;
	size?: keyof typeof iconSize;
	class?: string;
};

/** @deprecated use demoer/DemoerStoryProps */
export type DemoStoryProps<T> = {
	[K in keyof T]: {
		type: T[K] | K | string;
		values: T[K][] | any[];
		default?: T[K];
	};
};

type SnippetKeys<T> = {
	[K in keyof T]: T[K] extends Snippet<any> | Snippet ? K : never;
}[keyof T];

type FilteredBySnippet<T> = {
	[K in SnippetKeys<T>]: T[K];
};

type oo = FilteredBySnippet<AlertProps>;
