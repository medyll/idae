import type { ElementProps, IconObj } from '$lib/types/index.js';
import { demoerArgs } from '../demoer/demoer.utils.js';
import type { DemoerStoryProps } from '../demoer/types.js';

export type IconAppProps = {
	/** icon name for iconify  */
	icon?: ElementProps['icon'];
	/** className off the root component */
	class?: string;

	/** css style off the root component */
	style?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null | any;

	/** icon object for iconify, replace and invalidate props.icon  */
	ico?: IconObj;

	/**  icon size 	 */
	iconSize?: ElementProps['iconSize'];

	/** rotate icon */
	rotate?: boolean;

	/** icon color */
	color?: string;

	/** icon rotation */
	rotation?: number;
};

export const iconAppDemoValues: DemoerStoryProps<IconAppProps> = {
	icon: {
		type: 'icon',
		default: 'user'
	},
	iconSize: {
		type: 'iconSize'
	},
	color: {
		type: 'string'
	},
	rotation: {
		type: 'number',
		values: [0, 45, 90, 180, 270]
	},
	rotate: {
		type: 'boolean'
	}
};

export let { parameters, componentArgs } = demoerArgs(iconAppDemoValues);
