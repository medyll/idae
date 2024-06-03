import type { ElementProps } from '$lib/types/index.js';
import type { DemoerStoryProps } from '../demoer/types.js';

export type DividerProps = {
	/** className off the root component */
	class?: string;

	/** css style off the root component */
	style?: CSSStyleDeclaration;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null;

	/**
	 * margins and with applied to divider
	 */
	dense?: ElementProps['dense'];

	/**
	 * default direction of the divider
	 * @type {'vertical' | 'horizontal'}
	 */
	direction?: 'vertical' | 'horizontal';

	/**
	 * expansion of the divider
	 * @type {'full' | 'padded' | 'centered'}
	 */
	expansion?: 'full' | 'padded' | 'centered';

	/** give shadow to divider */
	shadowed?: boolean;

	/** give color to divider */
	color?: string | null;
};

export const DividerDemoValues: DemoerStoryProps<DividerProps> = {
	dense: {
		type: 'string',
		values: ['none', 'tight', 'default', 'medium', 'kind']
	},
	direction: {
		type: 'string',
		values: ['vertical', 'horizontal']
	},
	expansion: {
		type: 'string',
		values: ['full', 'padded', 'centered']
	},
	shadowed: {
		type: 'boolean',
		values: [true, false]
	},
	color: {
		type: 'string',
		values: ['#ff0000', '#00ff00', '#0000ff']
	}
};
