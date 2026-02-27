export const sliderDemoValues = {};
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { ElementProps, CommonProps } from '$lib/types/index.js';
import { uiPresets } from '$lib/utils/engine/presets.js';
import type { ChangeEventHandler } from 'svelte/elements';

// Props moved to the component module script during migration.

export const SliderDemoValues: DemoerStoryProps<any> = {
	value: {
		type: 'number',
		values: [20, 50]
	},
	min: {
		type: 'number',
		values: [0, 55]
	},
	max: {
		type: 'number',
		values: [100, 600]
	},
	step: {
		type: 'number',
		values: [1, 5, 10, 20, 50]
	},
	tooltip: {
		type: 'boolean'
	},
	orientation: {
		type: 'orientation'
	},
	reverse: {
		type: 'boolean'
	},
	disabled: {
		type: 'boolean'
	},
	dense: {
		type: 'string',
		values: uiPresets.dense
	}
};

export let { parameters, componentArgs } = demoerArgs(SliderDemoValues);
