import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { ElementProps, CommonProps } from '$lib/types/index.js';
import { uiPresets } from '$lib/utils/engine/presets.js';
import type { ChangeEventHandler } from 'svelte/elements';

export type SliderProps = CommonProps & {
	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null;
	/** Obtains a bound DOM reference to the slider's input element. */
	elementInput?: HTMLInputElement | null;
	/** Obtains a bound DOM reference to the slider's outer rail element. */
	elementRail?: HTMLDivElement;
	/** Obtains a bound DOM reference to the slider's track (fill) element. */
	elementGutter?: HTMLDivElement;
	/** Slider's value. */
	value: number;
	/** Minimum value. */
	min?: number;
	/** Maximum value . */
	max?: number;
	/** Steps size. */
	step?: number;
	/** Determines if the slider's value tooltip will be shown. */
	tooltip?: boolean;
	/** Slider's orientation. */
	orientation?: ElementProps['orientation'];
	/** Reverse th slider order . */
	reverse?: boolean;
	/** Controls Slider  status. */
	disabled?: boolean;
	/** Dense mode. */
	dense?: ElementProps['dense'];
	style?: string;
	onchange?: (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
};

export const SliderDemoValues: DemoerStoryProps<SliderProps> = {
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
