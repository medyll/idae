import type { DemoerStoryProps } from '$lib/base/demoer/types.js';

export type ProgressProps = {
	/** className off the root component */
	class?: string;

	/** css style off the root component */
	style?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null;

	/** base value for the progress */
	percentBase?: number;

	/** current value of the progress */
	value: number;

	/** can be vertical or horizontal */
	direction?: 'vertical' | 'horizontal';
};

export const ProgressDemoValues: DemoerStoryProps<ProgressProps> = {
	percentBase: {
		type: 'number',
		values: [100, 200]
	},
	value: {
		type: 'number',
		values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
	},
	direction: {
		type: 'string',
		values: ['vertical', 'horizontal']
	}
};
