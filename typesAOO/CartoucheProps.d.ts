import type { CommonProps, ElementProps, IconObj } from '$lib/types/index.js';
import type { Snippet, SvelteComponent } from 'svelte';
export type CartoucheProps = CommonProps & {
    /** className off the root component */
    class?: string;
    /** classNames off the whole component */
    classes: CartoucheClasses;
    /** css style off the root component */
    style?: string;
    /** element root HTMLDivElement props */
    element?: HTMLDivElement;
    /** displayed title of the cartouche */
    primary: string;
    /** displayed sub title of the cartouche */
    secondary?: string;
    icon?: ElementProps['icon'];
    /** can be set as a prop or as a className */
    stacked: boolean;
    component?: SvelteComponent;
    componentProps: Record<string, any>;
    /** State of content is preserved while visibility is toggled */
    keepCartoucheContent: boolean;
    /** show the title divider line */
    showTitleDivider: boolean;
    /** show the default border style */
    bordered: boolean;
    isOpen: boolean;
    /** component actions	 */
    actions: Record<'open' | 'toggle' | 'close', (event: Event) => void>;
    /** @deprecated */
    dense: ElementProps['dense'];
    tall: ElementProps['tall'];
    //
    children?: Snippet;
    cartoucheIcon?: Snippet;
    cartouchePrimary?: Snippet;
    cartoucheSecondary?: Snippet;
    cartoucheButtons?: Snippet;
};