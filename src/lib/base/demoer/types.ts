import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type DemoerArgsType = 'boolean' | 'flow-preset' | 'string' | 'icon' | string;

export type DemoerParameters = { type: DemoerArgsType; values?: any[] };

export type DemoPageProps = CommonProps & {
	title: string;
	subTitle?: string;
	component: string;
	code: string;
	demoerCode?: Snippet;
	children: Snippet;
	slots?: {
		code: Snippet;
	};
};
