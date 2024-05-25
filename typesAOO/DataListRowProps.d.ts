import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { T } from 'vitest/dist/reporters-xEmem8D4.js';
export type DataListRowProps = CommonProps & {
    /** data for the row */
    data: T;
    /** children slot for the default cell content */
    children?: Snippet;
};