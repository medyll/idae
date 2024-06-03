import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { densePreset, type CommonProps, type ElementProps } from '$lib/types/index.js';

export type CheckboxProps = CommonProps &
	Partial<HTMLInputElement> & {
		/** The label title for the checkbox. */
		title?: string;
		/** Checked state of the checkbox. */
		checked?: boolean;

		/** Indeterminate state of the checkbox. */
		indeterminate?: boolean;

		/** Sets the `value` attribute of the input element for form usage. */
		value?: any;

		/** Determines if the checkbox is disabled for user interaction and styles it accordingly. */
		disabled?: boolean;

		/** Provides a bound DOM reference to the checkbox's <input /> element. */
		inputElement?: HTMLInputElement;

		/** Provides a bound DOM reference to the checkbox's outer container element. */
		labelElement?: HTMLLabelElement;

		dense: ElementProps['dense'];
	};

export const CheckboxDemoValues: DemoerStoryProps<CheckboxProps> = {
	title: {
		type: 'string',
		values: [undefined, 'Checkbox', 'Check me'],
		default: 'Checkbox'
	},
	checked: {
		type: 'boolean',
		values: [undefined, false, true],
		default: false
	},
	disabled: {
		type: 'boolean',
		values: [undefined, false, true],
		default: false
	},
	indeterminate: {
		type: 'boolean',
		values: [undefined, true, false],
		default: false
	},
	dense: {
		type: 'dense',
		values: Object.values(densePreset),
		default: densePreset.default
	}
};
