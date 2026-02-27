import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { tallPreset, widthPreset, type Data, type ElementProps } from '$lib/types/index.js';

export type FinderProps<T = Data> = {
	/** className off the root component */
	class?: string;
	classRoot?: string;
	styleRoot?: string;

	/** css style off the root component */
	style?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null;

	/** initial data to look in */
	data: T[];

	/** default field to be used, can be * */
	defaultField: string;

	/** show the opener button for the choice of fields */
	showSortMenu?: boolean;

	/** search mode : exact or partial match*/
	mode?: 'exact' | 'partial';

	/** external bind use, to read filtered data */
	filteredData?: T[];

	/** with of the root element using  presets */
	sizeRoot?: ElementProps['width'];

	/** with of the input using  presets */
	width?: ElementProps['width'];
	/** with of the input using  presets */
	tall?: ElementProps['tall'];
};

const FinderPropsDemoValues: DemoerStoryProps<FinderProps> = {
	data: {
		type: 'data',
		values: [[{ name: 'name1' }, { name: 'name2' }]],
		private: true
	},
	defaultField: {
		type: 'string',
		values: ['name'],
		default: 'name'
	},
	width: {
		type: 'width',
		default: widthPreset.default
	},
	tall: {
		type: 'tall',
		default: tallPreset.default
	}
};

export let { parameters, componentArgs } = demoerArgs(FinderPropsDemoValues);

export const finderDemoValues = FinderPropsDemoValues;
