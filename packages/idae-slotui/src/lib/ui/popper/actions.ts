import type { PopperPositionType, PopperProps } from '$lib/ui/popper/types.js';
import Popper from '$lib/ui/popper/Popper.svelte';
import { mount, type SvelteComponent } from 'svelte';

export const popperList: Record<string, Popper> = {};

const openPopper = (popperId: string, args: PopperProps = {}) => {
	if (popperList[popperId]) {
		// popperList[popperId]?.actions?.show?.();
		popperList[popperId].isOpen = true;
		return popperList[popperId];
	} else {
		return createPopper();
	}

	function createPopper() {
		popperList[popperId] = mount(Popper, {
			target: document.body,
			intro: true,
			// @ts-expect-error -- Svelte 5 mount() props type is narrower than the actual component interface
			props: { code: popperId, ...args }
		});

		/* popperList[popperId].$$.on_destroy.push(() => {
			delete popperList[popperId];
		}); */

		return popperList[popperId];
	}
};

export { openPopper };
