import type { Drawer } from '$lib/index.js';
import type { DrawerProps } from '$lib/navigation/drawer/types.js';
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type FrameProps = CommonProps & {
    /** Width of the drawer */
    drawerWidth?: string;
    /** Props for the drawer */
    drawerProps?: DrawerProps;
    frameDrawerRef?: typeof Drawer;
    elementNav?: HTMLDivElement;
    /** Children slot for the default content */
    children?: Snippet;
    /** Slot for the nav left header frame */
    frameNavHeader?: Snippet;
    /** Slot for the drawer top */
    drawerTop?: Snippet;
    /** Slot for the drawer content */
    drawerContent?: Snippet;
    drawerIcon?: Snippet;
    drawerTitle?: Snippet;
    drawerPrimary?: Snippet;
    drawerSecondary?: Snippet;
    drawerFooter?: Snippet;
    /** Slot for the frame top */
    frameTop?: Snippet;
    /** Slot for the frame bottom */
    frameBottom?: Snippet;
};