export const progressDemoValues = {};
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { ElementProps } from '$lib/types/index.js';

// NOTE: `ProgressProps` moved to the component module script during migration.
export const ProgressDemoValues: DemoerStoryProps<any> = {
	percentBase: {
		type: 'number',
		values: [100, 200]
	},
	value: {
		type: 'number',
		values: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
	},
	orientation: {
		type: 'orientation'
	}
};
