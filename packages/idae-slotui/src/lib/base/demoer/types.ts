import type { CommonProps } from '$lib/types/index.js';
import type { uiPresets } from '$lib/utils/engine/presets.js';
import type { Component, Snippet } from 'svelte';

export type DemoerProps<T = Record<string, any>> = {
	title?: string;
	parameters: DemoerStoryProps<T>;
	componentArgs?: T;
	component?: Component<any> /** svelte component*/;
	multiple?: Record<string, any>;
	children?: Snippet<[{ activeParams: T }]>;
};

export type DemoerArgsType =
	| 'boolean'
	| 'flow-preset'
	| 'string'
	| 'icon'
	| 'dense'
	| 'tall'
	| string;

export type DemoerParameters = { type: DemoerArgsType; values?: any[]; default?: any };

export type DemoPageProps = CommonProps & {
	title?: string;
	subTitle?: string;
	component: string;
	code?: string;
	demoerCode?: Snippet;
	children: Snippet;
	slots?: {
		code: Snippet;
	};
};

export type DemoerStoryProps<T = Record<string, any>> = {
	[K in keyof T]: {
		type: keyof typeof uiPresets | T[K] | K | string;
		values?: T[K][] | any[];
		default?: T[K];
		private?: boolean;
	};
};

// Placeholder demo exports for demoer-related components
export const demoerDemoValues: DemoerStoryProps<any> = {};
export const demoerCodeDemoValues: DemoerStoryProps<any> = {};
export const demoerComponentDemoValues: DemoerStoryProps<any> = {};
export const demoerContentDemoValues: DemoerStoryProps<any> = {};
export const demoPageDemoValues: DemoerStoryProps<any> = {};
