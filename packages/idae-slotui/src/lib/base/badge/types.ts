import type { CommonProps } from '$lib/types/index.js';

export interface BadgeProps extends CommonProps {
	value: number;
	ceiling: number;
	element: HTMLDivElement;
	/**
	 * position of the badge
	 * @type {{ x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' }}
	 */
	position: { x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' | 'center' };
}
