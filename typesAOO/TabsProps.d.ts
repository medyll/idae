import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type TabsProps = CommonProps & {
    /** active tab */
    activeTabCode?: string;
    element: HTMLElement;
    /** tabs to display */
    items: TabsItemsProps;
    /** orientation of the tabs */
    orientation: 'horizontal' | 'vertical';
    /** event handler for tab click */
    onTabClick: (item: TabItem) => void;
    tabTitleMain?: Snippet;
    tabLabel?: Snippet<[
        {
            item: any;
        }
    ]>;
    tabTitle?: Snippet;
    tabButton?: Snippet;
    tabInner?: Snippet<[
        {
            item: any;
            activeTabCode: string;
        }
    ]>;
    children?: Snippet<[
        {
            item: any;
            activeTabCode: string;
        }
    ]>;
};