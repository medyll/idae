import Window from '$lib/ui/window/Window.svelte';
import { wStore } from '$lib/ui/window/store.js';
import { get } from 'svelte/store';
import type { ElementProps } from '$lib/types/index.js';
import { mount, type ComponentConstructorOptions } from 'svelte';

type OpenWindow = {
	/** Id of the component's instance */ frameId?: string | undefined;
	/** the title appears on the handle bar */ title?: string | undefined;
	/** boolean to show the window */ open?: boolean | undefined;
	/** state of the window */ minimized?: boolean | undefined;
	maximized?: boolean | undefined;
	/** is on top of others*/ active?: boolean | undefined;
	/** the secondaryTitle appears below the title */ secondaryTitle?: string | undefined;
	/** the description appears somewhere */ description?: string | undefined;
	/** shows or hide the handle, if dismissed, then the whole window is draggable */ showHandle?:
		| boolean
		| undefined;
	/** actions triggered on click*/ onClose?: ((args?: any) => void) | undefined;
	onCancel?: ((args?: any) => void) | undefined;
	onValidate?: ((args?: any) => void) | undefined;
	/** buttons visible in the bottom bar */ hideAcceptButton?: boolean | undefined;
	hideCloseButton?: boolean | undefined;
	hideCancelButton?: boolean | undefined;
	/** style of the component */ style?: string | undefined;
	/** can be opened with a component */ component?: any;
	/** used when props.component is used */ componentProps?: any;
	/** content can be set from a html string */ contentHTML?: any;
	/** parent of the window */ parentNode?: HTMLElement | undefined;
	/** icon used on the left side*/ icon?: string | undefined;
	iconClose?: string | undefined;
	iconValidate?: string | undefined;
	flow?: ElementProps['flow'] | undefined;
	/** start position */ startPosition?: 'center' | 'cascade' | 'overlap' | undefined;
	/** close the window on accept */ closeOnValidate?: boolean | undefined;
	/** destroy the component on close */ removeFromDomOnClose?: boolean | undefined;
	actions?:
		| {
				close: () => void;
				setActive: () => void;
		  }
		| undefined;
};
export const openWindow = <T = any>(
	frameId: string,
	args: OpenWindow = {},
	opts: Partial<ComponentConstructorOptions> = {}
) => {
	const w = get(wStore).instances[frameId];

	const target =
		typeof args?.parentNode === 'string'
			? document.querySelector(args.parentNode)
			: args?.parentNode ?? document.body;
	if (!w) {
		let a = mount(Window, {
			target: target ?? document.body,
			...opts,
			props: {
				title: frameId,
				...args,
				frameId: frameId,
				removeFromDomOnClose: true
			}
		});
		//a.self = a;
		/* a.$set({
			self: a
		}); */
		return a;
	} else {
		w.actions.setActive();
		return w;
	}
};
