import type { PopperPositionType } from '$lib/ui/popper/types.js';
import Popper from '$lib/ui/popper/Popper.svelte';
import { mount, type SvelteComponent } from 'svelte';

export let popperList: Record<string, Popper> = {};

const openPopper = (
	popperId: string,
	args: {
		position?: PopperPositionType;
		parentNode?: HTMLElement;
		component?: SvelteComponent;
		componentProps?: any;
	} = {}
) => {
	if (popperList[popperId]) {
		popperList[popperId].toggle();
	} else {
		createPopper();
	}

	function createPopper() {
		popperList[popperId] = mount(Popper, {
			target: document.body,
			intro: true,
			// @ts-ignore
			props: { code: popperId, ...args }
		});

		popperList[popperId].$$.on_destroy.push(() => {
			delete popperList[popperId];
		});
	}
};

export { openPopper };
