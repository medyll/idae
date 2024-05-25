import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type AutoCompleteProps<T> = CommonProps & {
    /** className off the root component */
    class?: string;
    /** element root HTMLDivElement props */
    element?: HTMLDivElement;
    /** initial data to look in */
    data: T[];
    /** show all data when search is empty */
    showAllOnEmpty?: boolean;
    /** default field to be used for searches, can be * */
    searchField?: string | '*';
    /**
     * defaults fields to be shown
     */
    dataFieldName?: keyof T | (keyof T)[];
    /** search mode : exact or partial match*/
    mode?: 'exact' | 'partial';
    /** external bind use, to read filtered data */
    filteredData?: T[];
    /** selectedIndex : index of the selected item in data */
    selectedIndex?: number;
    /** selectedIndex : index of the selected item in data */
    onchange?: ((args: T) => void) | undefined;
    autoCompleteEmpty?: Snippet | undefined;
    autoCompleteNoResults?: Snippet | undefined;
};