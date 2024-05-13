import type { CommonProps, ElementProps } from '$lib/types/index.js';

export interface ChipperProps extends CommonProps {
	/** position of the chipper  */
	position: ElementProps['position'];
	/** status of the chip */
	status?:
		| 'primary'
		| 'secondary'
		| 'tertiary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'light'
		| 'medium'
		| 'dark';
	/** css color code for the chip */
	color?: string;
	/** text or html is slot is not used */
	content?: string;
	/** show or hide the chip */
	showChip: boolean;
}
