import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { T } from 'vitest/dist/reporters-xEmem8D4.js';
export interface DataCellType {
    /** internal use */
    index: number;
    /** column identifier data.id ?? generated */
    columnId: string | number;
    width: string;
    /** applied inline css style to header */
    headerStyle?: string;
    style?: string;
    order?: number;
    /** data field */
    field?: string;
    /** data field title shown in header*/
    fieldTitle?: string;
    /** use as convenience */
    fieldType?: string;
    /** transform data */
    getter?: (data: Record<string, unknown>) => void;
    htmlElement?: HTMLElement;
}