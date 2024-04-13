import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

type DrawerTitleType = string | undefined;
export type DrawerProps = CommonProps & {
	/** title of the drawer */
	primary?: DrawerTitleType;

	/** sub-title of the drawer */
	secondary?: DrawerTitleType | undefined;

	/** icon of the drawer */
	icon?: string | undefined;

	/** Should the drawer be open */
	isOpen?: boolean;

	/** Should the closer icon be hidden */
	hideCloseIcon: boolean;

	/**
	 * flow
	 * @type "fixed" | "relative" | "absolute"
	 */
	flow?: 'fixed' | 'relative' | 'absolute';

	/**  stickTo
	 * @type {'right' | 'left' | 'top' | 'bottom'}
	 */
	stickTo?: 'right' | 'left' | 'top' | 'bottom';

	showOpenerIcon?: boolean;

	/** default width of the drawer in vertical mode */
	defaultWidth?: string;

	/** minimum width of the drawer in vertical mode and closed state */
	defaultVisibleArea?: string;

	dense?: ElementProps['dense'];
	tall?: ElementProps['dense'];

	/** default height of the drawer in horizontal mode */
	defaultHeight?: string;
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
