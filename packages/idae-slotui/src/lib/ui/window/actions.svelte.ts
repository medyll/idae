import Window, { type WindowProps } from '$lib/ui/window/Window.svelte';
import { wStore } from '$lib/ui/window/store.js';
import { get } from 'svelte/store';
import { mount, type ComponentConstructorOptions } from 'svelte';

export const openWindow = <T = any>(
	frameId: string,
	args: WindowProps = {},
	opts: Partial<ComponentConstructorOptions> = {}
) => {
	const w = get(wStore).instances[frameId];

	const target =
		typeof args?.parentNode === 'string'
			? document.querySelector(args.parentNode)
			: (args?.parentNode ?? document.body);
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
		return a;
	} else {
		w.actions.setActive();
		return w;
	}
};
