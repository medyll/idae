import type { moduleName, querySelector } from '$lib/HtmluDom.js';
import { cssObserve } from '$lib/cssObserver.js';

type HtmluModule = Record<moduleName, [querySelector, querySelector]>;

const configModules: HtmluModule = {
	'[data-htmlu-module-id]': ['[data-click]', '[data-click]']
};

export let HtmluModuleActions = {
	'[attach]': { '[data-click] [data-click]': (selectors: string) => {} },
	'[toggle]': { '[data-click] [data-click]': (selectors: string) => {} },
	'[wrap]': { '[data-click] [data-click]': (selectors: string) => {} }
};

/* the module receives custom events data
 init, load, destroy, attributes changed */
