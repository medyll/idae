import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { densePreset, tallPreset, type CommonProps, type ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

type DrawerTitleType = string;
export type DrawerProps<T = any> = CommonProps & {
	/** title of the drawer */
	primary?: DrawerTitleType;

	/** sub-title of the drawer */
	secondary?: DrawerTitleType;

	/** icon of the drawer */
	icon?: string;

	/** Should the drawer be open */
	isOpen?: boolean;

	/** Should the closer icon be hidden */
	hideCloseIcon?: boolean;

	/**
	 * flow
	 * @type "fixed" | "relative" | "absolute"
	 */
	flow?: ElementProps['flow'];

	/**  stickTo position */
	stickTo?: ElementProps['position'];

	showOpenerIcon?: boolean;

	/** default width of the drawer in vertical mode */
	defaultWidth?: string;

	/** minimum width of the drawer in vertical mode and closed state */
	defaultVisibleArea?: string;

	dense?: ElementProps['dense'];
	tall?: ElementProps['dense'];

	/** default height of the drawer in horizontal mode */
	defaultHeight?: string;
	drawerContent?: Snippet;
	drawerIcon?: Snippet;
	drawerTitle?: Snippet;
	drawerPrimary?: Snippet;
	drawerSecondary?: Snippet;
	drawerTop?: Snippet;
	drawerFooter?: Snippet;
	/** actions for the drawer */
	actions?: {
		toggle: (visibleSate?: boolean) => void;
	};
};

const drawerDemoValues: DemoerStoryProps<DrawerProps> = {
	primary: {
		type: 'string',
		values: ['Drawer']
	},
	secondary: {
		type: 'string',
		values: ['Drawer secondary']
	},
	isOpen: {
		type: 'boolean',
		default: false
	},
	flow: {
		type: 'flow'
	},
	stickTo: {
		type: 'stickyPosition'
	},
	showOpenerIcon: {
		type: 'boolean',
		default: false
	},
	dense: {
		type: 'dense',
		default: densePreset.default
	},
	tall: {
		type: 'dense',
		default: tallPreset.default
	}
};

export const { parameters, componentArgs } = demoerArgs(drawerDemoValues);
