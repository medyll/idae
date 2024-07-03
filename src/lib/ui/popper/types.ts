import type { ButtonProps } from '$lib/controls/button/types.js';
import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { StickToPositionType } from '$lib/utils/uses/stickTo/stickTo.js';
import type { ComponentType, Snippet } from 'svelte';
import type { $ } from 'vitest/dist/reporters-yx5ZTtEV.js';

export type PopperPositionType = StickToPositionType;

export type PopperProps = CommonProps & {
	/** unique code for the popper */
	code?: string;

	/** parent node of the popper */
	parentNode?: HTMLElement | null;

	/** whether the popper should stick to hook width */
	stickToHookWidth?: boolean;

	/** component to be displayed in the popper */
	component?: ComponentType;

	/** props for the component */
	componentProps?: {};

	buttonProps?: ButtonProps;

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
	/** anchor sous la forme de anchor-for, will target [anchor-for=anchor]  */
	anchor?: `${string}` | HTMLElement | null;
	popperHolder?: Snippet;
	popperRight?: Snippet;
	popperLeft?: Snippet;
	children?: Snippet;
};
