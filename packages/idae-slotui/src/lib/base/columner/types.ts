import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ColumnerColProps = CommonProps & {
	/** unique id of the column */
	columnId: string;
	/** snippet for the top of the drawer */
	drawerTop?: Snippet;
	/** snippet for the bottom of the column */
	bottomSlot?: Snippet;
};
export type ColumnerStoreType = Record<string, ColumnerColType>;

export interface ColumnerColType {
	columnId: string;
	state: keyof typeof states;
}

const states = ['expanded', 'equal', 'minimal', 'default'];
