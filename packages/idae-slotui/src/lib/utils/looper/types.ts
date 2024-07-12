import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { ResolverPathType } from '../engine/utils.js';

export type LoopProps<T> = CommonProps & {
	title?: string;
	data?: T[];
	naked?: boolean;
	groupBy?: ResolverPathType<T>;
	tag?: string;
	children?: Snippet<[{ item: T; idx: number }]>;
	loopTitle?: Snippet;
	loopGroupTitle?: Snippet<[{ key: any; data: T[]; idx: number }]>;
};
