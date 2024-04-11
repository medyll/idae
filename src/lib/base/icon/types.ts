import type { IconObj } from '$lib/types/index.js';

export type IconAppProps = {
	/** icon name for iconify  */
	icon?: string | IconObj;
	/** className off the root component */
	class?: string;

	/** css style off the root component */
	style?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null | any;

	/** icon object for iconify, replace and invalidate props.icon  */
	ico?: IconObj;

	/**
	 * icon size
	 * @type {'small' | 'medium' | 'large' | 'xlarge'}
	 */
	fontSize?: 'small' | 'medium' | 'large' | 'xlarge' | string;

	/** rotate icon */
	rotate?: boolean;

	/** icon color */
	color?: string;

	/** icon rotation */
	rotation?: number;
};
