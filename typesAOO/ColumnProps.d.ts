import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type ColumnProps = CommonProps & {
    /** unique id of the column */
    columnId: string;
    /** slot for the top of the drawer */
    drawerTop?: Snippet;
    /** slot for the bottom of the column */
    bottomSlot?: Snippet;
};