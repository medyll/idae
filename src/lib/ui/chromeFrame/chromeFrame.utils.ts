import { derived, get } from 'svelte/store';
import { chromeFrameStore } from './chromeFrame.store.js';
import type { ChromeFrameArgs } from './types.js';

export function getChromeFrame(frameId: string | number) {
	const { subscribe } = derived([chromeFrameStore], ([$windowsStore]) => {
		return $windowsStore.get(frameId);
	});

	return {
		subscribe,
		updatePos: (position: ChromeFrameArgs['position']) =>
			chromeFrameStore.updatePos(frameId, position),
		remove: () => chromeFrameStore.remove(frameId),
		makeOnTop: () => chromeFrameStore.makeOnTop(frameId),
		minimize: () => chromeFrameStore.minimize(frameId),
		toggle: () => chromeFrameStore.toggle(frameId)
	};
}

/** open a chrome frame in DOM and add it to the store **/
export function openChromeFrame(frameId: string, args: Partial<ChromeFrameArgs> = {}) {
	console.log('openChromeFrame from utils :', frameId);
	chromeFrameStore.open({
		title: frameId,
		defaultPosition: { x: 960, y: 650 },
		component: args.component,
		...args,
		frameId: frameId // cannot overwrite+
	});
}

export function removeChromeFrame(frameId: string, args: Partial<ChromeFrameArgs> = {}) {
	chromeFrameStore.remove(frameId);
}
