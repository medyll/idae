import type { IconObj } from '$lib/types/index.js';
import type { DemoerStoryProps } from '../demoer/types.js';

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

export const iconAppDemoValues: DemoerStoryProps<IconAppProps> = {
	icon: {
		type: 'string',
		values: ['mdi:window', 'mdi:user', undefined]
	},
	fontSize: {
		type: 'string',
		values: ['small', 'medium', 'large', 'xlarge']
	},
	color: {
		type: 'string',
		values: ['#ff0000', '#00ff00', '#0000ff']
	},
	rotation: {
		type: 'number',
		values: [0, 45, 90, 180, 270]
	},
	rotate: {
		type: 'boolean',
		values: [true, false]
	}
};
