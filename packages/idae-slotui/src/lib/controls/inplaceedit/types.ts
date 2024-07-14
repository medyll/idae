import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';

export type InPlaceEditProps = {
	value: string;
	spanElement: HTMLElement;
	inputElement: HTMLInputElement;
	inputValue?: any;
	editing?: boolean;
	onSave?: (newValue: string) => void;
};

export const inPlaceEditDemoValues: DemoerStoryProps<InPlaceEditProps> = {
	value: {
		type: 'string',
		values: ['Initial Value', 'Click to Edit'],
		default: 'Initial Value'
	},
	inputValue: {
		type: 'string',
		values: [undefined, 'Editing Value'],
		default: undefined
	},
	editing: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	onSave: {
		type: 'function',
		private: true,
		values: [(newValue: string) => console.log('Saved:', newValue)]
	}
};

export const { parameters, componentArgs } = demoerArgs(inPlaceEditDemoValues);
