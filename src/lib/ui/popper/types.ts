import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { StickToPositionType } from '$lib/utils/uses/stickTo/stickTo.js';
import type { ComponentType, Snippet } from 'svelte';

export type PopperPositionType = StickToPositionType;

export type PopperProps = CommonProps & {
	/** unique code for the popper */
	code?: string;

	/** parent node of the popper */
	parentNode?: HTMLElement;

	/** whether the popper should stick to hook width */
	stickToHookWidth?: boolean;

	/** component to be displayed in the popper */
	component?: ComponentType;

	/** props for the component */
	componentProps?: {};

	/** position of the popper */
	position?: StickToPositionType;

	/** content of the popper */
	content?: any;

	/** The popper will be closed on clickAway */
	autoClose?: boolean;
	/** flow */
	flow?: ElementProps['flow'];
	/** binding : The popper will be opened or is opened */
	isOpen?: boolean;
	popperHolder?: Snippet;
};
