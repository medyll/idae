import type { CommonProps, ElementProps } from '$lib/types/index.js';

export interface BackdropProps extends CommonProps {
	/** backdrop class */
	class?: string;
	/** backdrop style */
	style?: string;
	/** 
			css position mode of the backdrop
			@type {'absolute' | 'fixed' | 'relative'}  
		*/
	flow?: ElementProps['flow'];
	/** auto-close backdrop on click */
	autoClose?: boolean;
	/** show or hide the backdrop */
	isOpen?: boolean;
	/** if in loading state, it will show a loading icon or $$slots.loadingSlot */
	isLoading?: boolean;
	/** backdrop actions */
	actions?: Record<'open' | 'close', Function>;
	element?: HTMLDivElement;
	elementContent?: HTMLDivElement;
	elementContentInner?: HTMLDivElement;
	classes?: {
		backdrop?: string;
		backdropContent?: string;
		backdropContentInner?: string;
	};
}
