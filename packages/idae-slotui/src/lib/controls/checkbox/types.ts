export const checkboxDemoValues = {};
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { densePreset, type CommonProps, type ElementProps } from '$lib/types/index.js';

// NOTE: `CheckboxProps` moved to the component module script during migration.
export const CheckboxDemoValues: DemoerStoryProps<any> = {
	title: {
		type: 'string',
		values: [undefined, 'Checkbox', 'Check me'],
		default: 'Checkbox'
	},
	checked: {
		type: 'boolean',
		default: false
	},
	disabled: {
		type: 'boolean',
		default: false
	},
	indeterminate: {
		type: 'boolean',
		default: false
	},
	dense: {
		type: 'dense',
		default: densePreset.default
	}
};
