import type { AlertProps } from '$lib/base/alert/types.js';
import type { StickToPositionType } from '$lib/utils/uses/stickTo/stickTo.js';
import type { IconProps } from '@iconify/svelte';
import type { Snippet } from 'svelte';

export type AppIcon = string;

export enum fontSize {
	small = 'small',
	medium = 'medium',
	large = 'large',
	xlarge = 'xlarge'
}

export enum theme {
	primary = 'primary',
	secondary = 'secondary',
	tertiary = 'tertiary',
	success = 'success',
	warning = 'warning',
	danger = 'danger',
	light = 'light',
	medium = 'medium',
	dark = 'dark'
}

export enum levels {
	success = 'success',
	warning = 'warning',
	alert = 'alert',
	error = 'error',
	info = 'info',
	discrete = 'discrete'
}

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

export enum gutterPreset {
	default = 'default',
	small = 'small',
	med = 'med',
	kind = 'kind'
}

export enum tallPreset {
	default = 'default',
	mini = 'mini',
	tiny = 'tiny',
	small = 'small',
	med = 'med',
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

export const iconFontSize: Record<iconSize, string> = {
	auto: 'auto',
	tiny: '1rem',
	small: '1.5rem',
	medium: '4rem',
	large: '12rem',
	big: '16rem',
	full: '100%'
};

export enum flowPreset {
	relative = 'relative',
	absolute = 'absolute',
	fixed = 'fixed'
}

export enum widthPreset {
	tiny = 'tiny',
	mini = 'mini',
	small = 'small',
	med = 'med',
	kind = 'kind',
	full = 'full'
}

export enum positionPreset {
	top = 'top',
	bottom = 'bottom',
	left = 'left',
	right = 'right'
}

export enum orientation {
	vertical = 'vertical',
	horizontal = 'horizontal'
}

export enum wrapPreset {
	vertical = 'vertical',
	horizontal = 'horizontal'
}

const elevation = [0, 1, 2, 3, 4, 5];

export interface ElementProps {
	density: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	wrap: wrapPreset | keyof typeof wrapPreset;
	dense: densePreset | keyof typeof densePreset;
	gutter: gutterPreset | keyof typeof gutterPreset;
	theme: theme | keyof typeof theme;
	width: widthPreset | keyof typeof widthPreset;
	tall: tallPreset | keyof typeof tallPreset;
	levels: levels | keyof typeof levels;
	status: statusPreset | keyof typeof statusPreset;
	buttonVariant: buttonVariant | keyof typeof buttonVariant;
	alignment: 'center' | 'left' | 'right';
	flow: keyof typeof flowPreset;
	position: keyof typeof positionPreset;
	popperPosition: StickToPositionType;
	action: (event: any, data?: Data) => void;
	iconSize: keyof typeof iconSize;
	icon: string | IconObj;
	orientation?: keyof typeof orientation;
	elevation?: keyof typeof elevation;
}
export enum StickyPosition {
	TC = 'TC', // Top Center
	TL = 'TL', // Top Left
	TR = 'TR', // Top Right
	BC = 'BC', // Bottom Center
	BL = 'BL', // Bottom Left
	BR = 'BR', // Bottom Right
	T = 'T', // Top
	R = 'R', // Right
	B = 'B', // Bottom
	L = 'L', // Left
	C = 'C' // Center
}

export const uiPresets = {
	buttonVariant: Object.keys(buttonVariant),
	dense: Object.keys(densePreset),
	tall: Object.keys(tallPreset),
	status: Object.keys(statusPreset),
	theme: Object.keys(theme),
	density: {
		none: '0',
		tight: '0.25rem',
		default: '0.5rem',
		medium: '1rem',
		kind: '1.5rem',
		unset: '1.5rem'
	},
	width: Object.keys(widthPreset),
	iconSize: Object.keys(iconSize),
	stickyPosition: Object.keys(StickyPosition),
	position: Object.keys(positionPreset),
	flow: Object.keys(flowPreset),
	levels: Object.keys(levels),
	orientation: Object.keys(orientation),
	gutter: Object.keys(gutterPreset),
	elevation: elevation
};

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
	iconSize?: keyof typeof iconSize;
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

export type ExpandProps<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
